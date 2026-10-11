# Design: Master Course (Course / Lesson / Sub Lesson / Material)

Tanggal: 2026-10-11
Status: disetujui untuk Fase 1

## Intent & kenapa

Admin perlu mengelola materi ajar secara terstruktur. Model datanya bertingkat:

```
Course ─1:N─ Lesson ─1:N─ Sub Lesson ─1:N─ Material
                 └─ punya Level (level_id)
```

Tujuan: admin bisa membuat course, menambah lesson (dikelompokkan per level),
lalu menambah sub-lesson dan material di dalamnya — semua lewat halaman admin.

## Goals (Fase 1)

- CRUD Course, Lesson, Sub Lesson, Material dari UI admin.
- Lesson dikelompokkan per Level.
- Material punya tipe teks (`materials`) atau video (`url_video`).
- Integrasi ke backend `bajapro-be` (Go Fiber) sesuai kontrak yang ada.

## Non-goals (Fase 1)

- Upload gambar/thumbnail (thumbnail course & gambar di materi) — ditunda.
- Rich text editor (Tiptap) — pakai `Input.TextArea` biasa dulu.
- Drag & drop reorder — posisi diisi otomatis.
- Halaman Question (code/essay), halaman siswa, gamifikasi.
- RBAC per-permission (cukup `AdminGuard` yang sudah ada).

## Anti-goals

- Membangun endpoint upload/gambar setengah jalan.
- Meniru mentah reference lama (path/method berbeda → bisa salah integrasi).
- Menyimpan HTML rich-text dari editor yang belum ada.

## Constraints & fakta lapangan

- FE: Next.js 16 App Router, Ant Design 5, pola feature module + `MasterTemplate`.
  Semua request lewat `apiRequest` (`/api/backend/...`, cookie `access_token`).
- BE: `bajapro-be`, JWT middleware. **Update pakai `PUT`** (bukan PATCH).
- Path yang benar di BE sekarang:
  - `/courses` (GET list, POST, GET `/:id`, PUT `/:id`, DELETE `/:id`)
  - `/lessons` (+bulk), `/sub_lessons` (bukan `sublessons`), `/materials` (+`/materials/tree`)
  - `/levels`
- **Gap BE**: `GET /lessons`, `GET /sub_lessons`, `GET /materials` **belum** punya filter
  `course_id` / `lesson_id` / `sub_lesson_id`. Ini yang harus ditambah.
- Tidak ada endpoint upload di BE (dikonfirmasi: grep kosong).
- `CreateMMaterialDto` punya `content_position` & `prompt_llm`; FE kirim
  `content_position` (auto) dan `prompt_llm: ""`.
- Fiber `c.BodyParser` tidak menjalankan validator `binding`, jadi field kosong tetap lolos.

### Kontrak balikan penting

- `GET /courses` → array `MCourseResponseDto`: `{id, course_name, description, img_thumbnail, published, isactive, created_at, updated_at, lessonCount, subLessonCount}`.
- `GET /courses/:id` → `MCourseDetailResponse`: field course + `levels: [{id, level_name, description, isactive, lessonCount, subLessonCount, isLocked}]`.
- `presenters.SuccessResponse` → `{success:true, data, total?}`. Error → `{success:false, error}`.

### Bentuk data (field names persis)

- Course: `course_name`, `description`, `img_thumbnail`, `published`, `isactive`
- Lesson: `course_id`, `level_id`, `title`, `description`, `position`, `img_thumbnail`, `published`, `isactive`
- Sub Lesson: `lesson_id`, `title`, `order_position`, `isactive`
- Material: `sub_lesson_id`, `title`, `materials`, `url_video`, `content_position`, `prompt_llm`, `published`, `isactive`

## Yang diputuskan (Fase 1)

### Backend — tambah filter

- `MLessonFilterDto` + `CourseID *int64`; controller baca `course_id`; handler/service
  `repo.WithWhere("course_id = ?", ...)`.
- `MSubLessonFilterDto` + `LessonID *int64`; baca `lesson_id`.
- `MMaterialFilterDto` + `SubLessonID *int64`; baca `sub_lesson_id`.
- Ikuti pola `user_controller.go` (query param → filter dto → repo WithWhere).

### Frontend — struktur

Halaman (di grup `(admin)`):
- `/manage-material/course` — list
- `/manage-material/course/add` — form course baru (khusus tab Detail)
- `/manage-material/course/[id]` — detail 3 tab

Feature modules:
- `features/course/` — `types`, `services` (courses API), `hooks`, `components`:
  `MasterCourse` (list), `CourseDetail` (orchestrator 3 tab), `CourseDetailTab`, `LessonTab`, `SubLessonMaterialTab`.
- `features/lesson/`, `features/subLesson/`, `features/material/` — types + services (dipakai tab).

Tiap halaman dibungkus `AdminGuard` (admin-only).

### UX tiap tab

1. **Detail Course**: form `course_name` (wajib), `description` (wajib). Simpan:
   - create → POST `/courses` → redirect `/manage-material/course/{id}`
   - update → PUT `/courses/{id}`
   - Tab Lessons & Materials terkunci sampai course tersimpan (perlu `id`).
2. **Lessons**: pilih tidak ada; tampilkan kolom per Level (dari `/levels`,
   `isactive`). Tiap kolom: daftar lesson (judul + deskripsi) dengan Edit/Hapus, plus
   tombol "Tambah Lesson" (modal: `level_id` wajib, `title` wajib, `description`).
   `position` = jumlah lesson di level itu + 1. `img_thumbnail` = "". `published` = false.
   Data lesson: `GET /lessons?course_id={id}` (setelah filter BE ditambah).
3. **Sub Lessons & Materials**: `Select` Lesson → daftar sub-lesson
   (`GET /sub_lessons?lesson_id=`), tombol Tambah Sub Lesson (modal: `title` wajib;
   `order_position` = jumlah + 1). Pilih sub-lesson → panel material:
   `GET /materials?sub_lesson_id=`, tombol Tambah Material (modal: `title` wajib,
   tipe teks/video, `materials` TextArea atau `url_video`; `content_position` = jumlah + 1;
   `prompt_llm` = ""). Edit/Hapus material.

### Delete

- Hapus memakai `DELETE` + `Popconfirm`. (Catatan: reference melakukan pre-check anak
  via query anak; backend sekarang tak memberi jaminan; cukup konfirmasi + pesan error
  dari server bila gagal.)

## Keputusan tambahan (hasil builder-check)

1. **Posisi dihitung di FE dari list penuh.** Controller `GET /lessons|/sub_lessons|/materials`
   mem-parse `limit`/`cursor` tapi service **mengabaikannya** → list selalu kembali penuh
   (tak ada limit server). FE hitung `position`/`order_position`/`content_position`
   dari list yang sudah dimuat, di-scope: lesson per `level_id`, sub-lesson per `lesson_id`,
   material per `sub_lesson_id`. Jika nanti BE menambah limit, strategi ini harus diganti.
2. **`total` dari handler TIDAK bisa dipercaya.** Semua `GetAllXHandler` menghitung total
   lewat query terpisah yang hanya menerapkan `name`/`show_deleted`, bukan `WithWhere`
   dari repo. Jadi FE **jangan** pakai `total`; andalkan `data`. (Tidak mengubah count query —
   di luar scope.)
3. **Pagination: client-side.** Tabel pakai pagination default `MasterTable`. Tak ada
   pagination server (controller mengabaikan `limit`/`cursor`/`sort`).
4. **Delete = hard delete, tanpa cascade.** Model pakai `DeletedAt time.Time` (bukan
   `gorm.DeletedAt`) → GORM melakukan DELETE nyata, dan tak ada cascade di kode. FE
   **pre-check anak** sebelum hapus memakai filter baru: Course→`GET /lessons?course_id=`,
   Lesson→`GET /sub_lessons?lesson_id=`, Sub Lesson→`GET /materials?sub_lesson_id=`.
   Bila ada anak → blok + pesan "hapus anaknya dulu".
5. **Tipe FE mengikuti model mentah** (bukan DTO rapih). Sertakan `deleted_at?: string`
   (bisa `"0001-01-01T00:00:00Z"`) dan relasi bersarang **opsional** (`course`, `level`,
   `sub_lessons`, `lesson`, `sub_lesson`). Tidak perlu `preload=true`.
6. **Kolom list course**: No, Nama Course, Deskripsi, Jumlah Lesson, Jumlah Sub Lesson,
   Status (`isactive`). `published` tidak ditampilkan (Fase 2).
7. **`GET /levels` mengembalikan semua level** (tanpa filter `isactive`) → FE filter
   `isactive` untuk kolom di tab Lessons; lesson hanya bisa dibuat di level aktif.

## Yang diserahkan ke builder

- Tata letak detail (Segmented vs Tabs) — bebas, asal 3 tab jelas.
- Cara fetch paralel/`Promise.all`, penamaan file komponen, pagination tabel list.
- Apakah `description` course dipaksa wajib di FE (BE opsional) — diputuskan: ya, wajib di FE.
- Detail styling (pakai komponen `Button`/`Input` yang ada).
- Menambah `published` toggle — tidak, ditunda ke Fase 2.

## Fase 2 (belum dikerjakan)

- Endpoint upload BE + thumbnail course & gambar materi.
- Rich text editor (Tiptap) untuk `materials`.
- Drag & drop reorder (lesson antar level, sub-lesson, material).
- Toggle `published`.
- Halaman Question & terkait.

## Verifikasi

- BE: `go build ./...`.
- FE: `npx tsc --noEmit`, `npm run lint`, `npx next build`.
- Manual: buat course → tambah lesson per level → tambah sub-lesson → tambah material teks & video.
