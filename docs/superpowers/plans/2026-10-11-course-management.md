# Master Course (Fase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin bisa CRUD Course → Lesson (per Level) → Sub Lesson → Material dari UI, terintegrasi ke backend Go Fiber.

**Architecture:** BE menambah 3 filter query (`course_id`, `lesson_id`, `sub_lesson_id`). FE menambah satu feature module `features/course/` (types, services, hooks, components) + 3 route admin: list, add, `[id]` (detail 3 tab).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Ant Design 5, Tailwind 4; backend Go + Fiber + GORM.

**Spec:** `docs/superpowers/specs/2026-10-11-course-management-design.md`

## Global Constraints

- BE update pakai **PUT** (bukan PATCH). Path: `/courses`, `/lessons`, `/sub_lessons`, `/materials`, `/levels`. Semua butuh JWT (cookie `access_token`).
- FE semua request lewat `apiRequest` dari `@/lib/apiClient` (`BASE_URL = "/api/backend"`), balikan `{success, data, total?}`.
- Komponen client-side wajib `"use client"`. Halaman master pakai `MasterTemplate` + `MasterFormModal`; warna primary `#531DAB`.
- Endpoint child selalu balikin array **penuh** (service mengabaikan `limit`/`cursor`). Jangan pakai `total`; hitung dari `data`.
- Posisi dihitung FE: `position` per `level_id`, `order_position` per `lesson_id`, `content_position` per `sub_lesson_id` (= jumlah item scope itu + 1).
- Delete = hard delete tanpa cascade → FE **pre-check anak** dulu.
- Fase 1 tanpa: upload gambar, rich text, drag-drop, toggle `published`, halaman Question.
- Verifikasi: BE `go build ./...`; FE `npx tsc --noEmit`, `npm run lint`, `npx next build`.
- Repo BE: `<workspace>/bajapro-be/src`. Repo FE: `<workspace>/bajapro-fe-revamp`.

## Review Focus

- **Filter tidak diterapkan**: `GET /lessons?course_id=` harus benar-benar menyaring; kalau filter di-drop, tab Lessons menampilkan lesson course lain. Test: curl dengan 2 course.
- **Nested route param**: `/manage-material/course/[id]` harus dapat `id` yang benar (Next 16 `params` adalah Promise) → kalau salah, detail tab memuat course yang salah/tidak ada.
- **Guard edit-course-baru**: buka tab Lessons/Materials sebelum course disimpan harus diblok. Bila bocor, create lesson memakai `course_id` kosong.
- **Pre-check anak saat delete**: hapus Course ber-lesson harus diblok dengan pesan; bila gagal, baris/relasi jadi yatim.
- **Posisi duplikat/negatif**: menambah item saat list kosong → posisi harus `1`, bukan `0`.

---

## File Structure

**Backend (modify):**
- `api/http/controllers/v1/dto/m_lesson_dto.go` — +`CourseID *int64` di `MLessonFilterDto`
- `api/http/controllers/v1/m_lesson_controller.go` — baca `course_id`
- `pkg/services/v1/m_lesson_service.go` — `GetAllMLessons` terapkan filter
- `api/http/controllers/v1/dto/m_sub_lesson_dto.go` — +`LessonID *int64`
- `api/http/controllers/v1/m_sub_lesson_controller.go` — baca `lesson_id`
- `pkg/services/v1/m_sub_lesson_service.go` — `GetAllMSubLessons` terapkan filter
- `api/http/controllers/v1/dto/m_material_dto.go` — +`SubLessonID *int64`
- `api/http/controllers/v1/m_material_controller.go` — baca `sub_lesson_id`
- `pkg/services/v1/m_material_service.go` — `GetAllMMaterials` terapkan filter

**Frontend (create):**
- `src/features/course/types/courseTypes.ts` — semua interface + DTO (course/lesson/subLesson/material/level)
- `src/features/course/services/courseServices.ts` — endpoint untuk 4 entitas + levels
- `src/features/course/hooks/useCourse.ts` — list + CRUD course + pre-check dapat anak
- `src/features/course/hooks/useCourseDetail.ts` — orchestrasi detail (course, lessons, sublessons, materials)
- `src/features/course/components/MasterCourse.tsx` — list course
- `src/features/course/components/CourseDetail.tsx` — shell 3 tab (Segmented) + guard
- `src/features/course/components/CourseDetailTab.tsx` — form detail course
- `src/features/course/components/LessonTab.tsx` — lesson per level + modal CRUD
- `src/features/course/components/SubLessonMaterialTab.tsx` — sub-lesson + material
- `src/app/(admin)/manage-material/course/page.tsx` — list
- `src/app/(admin)/manage-material/course/add/page.tsx` — detail (mode create)
- `src/app/(admin)/manage-material/course/[id]/page.tsx` — detail (mode edit)

**Catatan builder:** spec menyebut modul terpisah per entitas; diputuskan digabung ke satu `features/course/` karena semuanya hanya dipakai halaman course dan berubah bersama.

---

## Task 1: BE — filter `course_id` pada GET /lessons

**Files:**
- Modify: `api/http/controllers/v1/dto/m_lesson_dto.go`
- Modify: `api/http/controllers/v1/m_lesson_controller.go`
- Modify: `pkg/services/v1/m_lesson_service.go`

**Interfaces:**
- Produces: `GET /api/v1/lessons?course_id={id}` menyaring by `course_id`; `dto.MLessonFilterDto.CourseID *int64`.

- [ ] **Step 1: Tambah field filter**

Di `m_lesson_dto.go`, tambah ke `MLessonFilterDto`:
```go
CourseID *int64
```

- [ ] **Step 2: Baca query di controller**

Di `GetMLessons`, sebelum build filter, parse:
```go
var courseID *int64
if val := c.Query("course_id"); val != "" {
    if parsed, err := strconv.ParseInt(val, 10, 64); err == nil {
        courseID = &parsed
    }
}
```
lalu isi `CourseID: courseID` di `dto.MLessonFilterDto{...}`.

- [ ] **Step 3: Terapkan filter di service**

Di `mLessonService.GetAllMLessons`, tambah sebelum `FindMLesson()`:
```go
if filter.CourseID != nil {
    repo = repo.WithWhere("m_lessons.course_id = ?", *filter.CourseID)
}
```

- [ ] **Step 4: Compile**

Run: `go build ./...` (workdir `bajapro-be/src`)
Expected: exit 0.

- [ ] **Step 5: Verifikasi manual (opsional bila server jalan)**

Run: `curl -s "http://localhost:5000/api/v1/lessons?course_id=1" -H "Cookie: access_token=<token>"`
Expected: `data` hanya berisi lesson `course_id=1`.

- [ ] **Step 6: Commit**
```bash
git add src/api/http/controllers/v1/dto/m_lesson_dto.go src/api/http/controllers/v1/m_lesson_controller.go src/pkg/services/v1/m_lesson_service.go
git commit -m "[Feat][Lesson] tambah filter course_id pada GET lessons"
```

---

## Task 2: BE — filter `lesson_id` pada GET /sub_lessons

**Files:**
- Modify: `api/http/controllers/v1/dto/m_sub_lesson_dto.go`
- Modify: `api/http/controllers/v1/m_sub_lesson_controller.go`
- Modify: `pkg/services/v1/m_sub_lesson_service.go`

**Interfaces:**
- Consumes: pola sama Task 1.
- Produces: `GET /api/v1/sub_lessons?lesson_id={id}`; `dto.MSubLessonFilterDto.LessonID *int64`.

- [ ] **Step 1: Tambah field** `LessonID *int64` ke `MSubLessonFilterDto`.
- [ ] **Step 2: Baca `lesson_id`** di `GetMSubLessons` (pola `%> Step 2 Task 1`).
- [ ] **Step 3: Terapkan di service** `GetAllMSubLessons`:
```go
if filter.LessonID != nil {
    repo = repo.WithWhere("m_sub_lessons.lesson_id = ?", *filter.LessonID)
}
```
- [ ] **Step 4: Compile** — Run: `go build ./...` → exit 0.
- [ ] **Step 5: Commit**
```bash
git add src/api/http/controllers/v1/dto/m_sub_lesson_dto.go src/api/http/controllers/v1/m_sub_lesson_controller.go src/pkg/services/v1/m_sub_lesson_service.go
git commit -m "[Feat][SubLesson] tambah filter lesson_id pada GET sub_lessons"
```

---

## Task 3: BE — filter `sub_lesson_id` pada GET /materials

**Files:**
- Modify: `api/http/controllers/v1/dto/m_material_dto.go`
- Modify: `api/http/controllers/v1/m_material_controller.go`
- Modify: `pkg/services/v1/m_material_service.go`

**Interfaces:**
- Produces: `GET /api/v1/materials?sub_lesson_id={id}`; `dto.MMaterialFilterDto.SubLessonID *int64`.

- [ ] **Step 1: Tambah field** `SubLessonID *int64` ke `MMaterialFilterDto`.
- [ ] **Step 2: Baca `sub_lesson_id`** di `GetMMaterials`.
- [ ] **Step 3: Terapkan di service** `GetAllMMaterials`:
```go
if filter.SubLessonID != nil {
    repo = repo.WithWhere("m_materials.sub_lesson_id = ?", *filter.SubLessonID)
}
```
- [ ] **Step 4: Compile** — Run: `go build ./...` → exit 0.
- [ ] **Step 5: Commit**
```bash
git add src/api/http/controllers/v1/dto/m_material_dto.go src/api/http/controllers/v1/m_material_controller.go src/pkg/services/v1/m_material_service.go
git commit -m "[Feat][Material] tambah filter sub_lesson_id pada GET materials"
```

---

## Task 4: FE — types & services course

**Files:**
- Create: `src/features/course/types/courseTypes.ts`
- Create: `src/features/course/services/courseServices.ts`

**Interfaces:**
- Produces:
  - Types: `Course`, `Lesson`, `SubLesson`, `Material`, `LevelRef` + DTO `CreateCourseDTO`, `UpdateCourseDTO`, `CreateLessonDTO`, `UpdateLessonDTO`, `CreateSubLessonDTO`, `UpdateSubLessonDTO`, `CreateMaterialDTO`, `UpdateMaterialDTO`.
  - `courseServices`: `getCourses()`, `getCourseById(id)`, `createCourse(d)`, `updateCourse(id,d)`, `deleteCourse(id)`, `getLessons(courseId)`, `createLesson(d)`, `updateLesson(id,d)`, `deleteLesson(id)`, `getSubLessons(lessonId)`, `createSubLesson(d)`, `updateSubLesson(id,d)`, `deleteSubLesson(id)`, `getMaterials(subLessonId)`, `createMaterial(d)`, `updateMaterial(id,d)`, `deleteMaterial(id)`, `getLevels()`.

- [ ] **Step 1: Tulis `courseTypes.ts`** dengan field persis kontrak:
```ts
export interface Course { id:number; course_name:string; description:string; img_thumbnail:string;
  published:boolean; isactive:boolean; created_at:string; updated_at?:string; deleted_at?:string;
  lessonCount?:number; subLessonCount?:number; }
export interface Lesson { id:number; course_id:number; level_id:number; title:string; description:string;
  position:number; img_thumbnail:string; published:boolean; isactive:boolean; created_at?:string; updated_at?:string; deleted_at?:string; }
export interface SubLesson { id:number; lesson_id:number; title:string; order_position:number;
  isactive:boolean; created_at?:string; updated_at?:string; deleted_at?:string; }
export interface Material { id:number; sub_lesson_id:number; title:string; materials:string; url_video:string;
  content_position:number; prompt_llm:string; published:boolean; isactive:boolean; created_at?:string; updated_at?:string; deleted_at?:string; }
export interface LevelRef { id:number; level_name:string; description:string; isactive:boolean; }
export interface CreateCourseDTO { course_name:string; description:string; img_thumbnail:string; }
export interface UpdateCourseDTO { course_name?:string; description?:string; img_thumbnail?:string; published?:boolean; isactive?:boolean; }
export interface CreateLessonDTO { course_id:number; level_id:number; title:string; description:string; position:number; img_thumbnail:string; }
export interface UpdateLessonDTO { course_id?:number; level_id?:number; title?:string; description?:string; position?:number; img_thumbnail?:string; published?:boolean; isactive?:boolean; }
export interface CreateSubLessonDTO { lesson_id:number; title:string; order_position:number; }
export interface UpdateSubLessonDTO { lesson_id?:number; title?:string; order_position?:number; isactive?:boolean; }
export interface CreateMaterialDTO { sub_lesson_id:number; title:string; materials:string; url_video:string; content_position:number; prompt_llm:string; }
export interface UpdateMaterialDTO { sub_lesson_id?:number; title?:string; materials?:string; url_video?:string; content_position?:number; prompt_llm?:string; published?:boolean; isactive?:boolean; }
```

- [ ] **Step 2: Tulis `courseServices.ts`** memakai `apiRequest`:

```ts
import { apiRequest } from "@/lib/apiClient";
import type { ... } from "../types/courseTypes";
export const courseServices = {
  getCourses: () => apiRequest<Course[]>("/courses"),
  getCourseById: (id:number) => apiRequest<Course>(`/courses/${id}`),
  createCourse: (d:CreateCourseDTO) => apiRequest<Course>("/courses",{method:"POST",body:d}),
  updateCourse: (id:number,d:UpdateCourseDTO) => apiRequest<Course>(`/courses/${id}`,{method:"PUT",body:d}),
  deleteCourse: (id:number) => apiRequest<null>(`/courses/${id}`,{method:"DELETE"}),
  getLevels: () => apiRequest<LevelRef[]>("/levels"),
  getLessons: (courseId:number) => apiRequest<Lesson[]>("/lessons",{query:{course_id:courseId}}),
  createLesson: (d:CreateLessonDTO) => apiRequest<Lesson>("/lessons",{method:"POST",body:d}),
  updateLesson: (id:number,d:UpdateLessonDTO) => apiRequest<Lesson>(`/lessons/${id}`,{method:"PUT",body:d}),
  deleteLesson: (id:number) => apiRequest<null>(`/lessons/${id}`,{method:"DELETE"}),
  getSubLessons: (lessonId:number) => apiRequest<SubLesson[]>("/sub_lessons",{query:{lesson_id:lessonId}}),
  createSubLesson: (d:CreateSubLessonDTO) => apiRequest<SubLesson>("/sub_lessons",{method:"POST",body:d}),
  updateSubLesson: (id:number,d:UpdateSubLessonDTO) => apiRequest<SubLesson>(`/sub_lessons/${id}`,{method:"PUT",body:d}),
  deleteSubLesson: (id:number) => apiRequest<null>(`/sub_lessons/${id}`,{method:"DELETE"}),
  getMaterials: (subLessonId:number) => apiRequest<Material[]>("/materials",{query:{sub_lesson_id:subLessonId}}),
  createMaterial: (d:CreateMaterialDTO) => apiRequest<Material>("/materials",{method:"POST",body:d}),
  updateMaterial: (id:number,d:UpdateMaterialDTO) => apiRequest<Material>(`/materials/${id}`,{method:"PUT",body:d}),
  deleteMaterial: (id:number) => apiRequest<null>(`/materials/${id}`,{method:"DELETE"}),
};
export default courseServices;
```

- [ ] **Step 3: Typecheck** — Run: `npx tsc --noEmit` (workdir `bajapro-fe-revamp`) → exit 0.
- [ ] **Step 4: Commit**
```bash
git add src/features/course/types/courseTypes.ts src/features/course/services/courseServices.ts
git commit -m "[Feat][Course] tambah types dan service course/lesson/sub_lesson/material"
```

---

## Task 5: FE — halaman list course

**Files:**
- Create: `src/features/course/hooks/useCourse.ts`
- Create: `src/features/course/components/MasterCourse.tsx`
- Create: `src/app/(admin)/manage-material/course/page.tsx`

**Interfaces:**
- Consumes: `courseServices`, `MasterTemplate`, `AdminGuard`.
- Produces: `useCourse()` → `{ courses, loading, error, fetchCourses, deleteCourse }`; rute `/manage-material/course`.

- [ ] **Step 1: Tulis `useCourse.ts`** — pola hook yang ada (`useSchool`): `useEffect` async IIFE memanggil `fetchCourses`; `deleteCourse(id)` melakukan pre-check anak dulu:
```ts
// sebelum delete, cek anak
const lessons = await courseServices.getLessons(id);
if ((lessons.data ?? []).length > 0) {
  throw new Error("Course masih memiliki lesson. Hapus lesson-nya dulu.");
}
await courseServices.deleteCourse(id);
```

- [ ] **Step 2: Tulis `MasterCourse.tsx`** — `MasterTemplate<Course>`:
  - Kolom: No (index), Nama Course, Deskripsi, Jumlah Lesson (`lessonCount ?? 0`), Jumlah Sub Lesson (`subLessonCount ?? 0`), Status (`isactive` Tag), Aksi.
  - Aksi: Detail → `router.push('/manage-material/course/'+id)`, Edit (sama), Hapus (`Popconfirm`) → `deleteCourse`.
  - `onAdd` → `router.push('/manage-material/course/add')`.
  - Search client-side pada `course_name`/`description`.

- [ ] **Step 3: Tulis `page.tsx`** — `Suspense` + `AdminGuard` + `<MasterCourse />` (pola sama dengan `manage-user/sekolah/page.tsx`).

- [ ] **Step 4: Typecheck + lint** — Run: `npx tsc --noEmit; npm run lint` → 0 error.
- [ ] **Step 5: Build** — Run: `npx next build` → sukses; route `/manage-material/course` ada.
- [ ] **Step 6: Commit**
```bash
git add src/features/course/hooks/useCourse.ts src/features/course/components/MasterCourse.tsx "src/app/(admin)/manage-material/course/page.tsx"
git commit -m "[Feat][Course] halaman list course"
```

---

## Task 6: FE — shell detail (3 tab) + tab Detail Course

**Files:**
- Create: `src/features/course/hooks/useCourseDetail.ts`
- Create: `src/features/course/components/CourseDetail.tsx`
- Create: `src/features/course/components/CourseDetailTab.tsx`
- Create: `src/app/(admin)/manage-material/course/add/page.tsx`
- Create: `src/app/(admin)/manage-material/course/[id]/page.tsx`

**Interfaces:**
- Consumes: `courseServices`.
- Produces: `<CourseDetail courseId={number|null} />`; tab keys `detail|lessons|materials`.

- [ ] **Step 1: `useCourseDetail.ts`** — state: `course`, `loading`, `activeTab`, `isMounted`. `loadCourse(id)` → `getCourseById`. `saveCourse(values, id?)`:
  - id null → `createCourse` → kembalikan id baru.
  - id ada → `updateCourse`.

- [ ] **Step 2: `CourseDetailTab.tsx`** — `Form` (`course_name` wajib, `description` TextArea wajib). Tombol Simpan. `onSave(values)` dari parent. Field `img_thumbnail` tidak ada di Fase 1.

- [ ] **Step 3: `CourseDetail.tsx`** — orchestrator:
  - Tombol "Kembali" → `/manage-material/course`.
  - `Segmented` options Detail Course / Lessons / Sub Lessons & Materials.
  - Guard: jika `isCreate` dan tab !== "detail" → `message.warning("Simpan Detail Course terlebih dahulu!")` dan jangan pindah tab.
  - `if (!isMounted) return null;`
  - Render `<CourseDetailTab>` di tab detail; tab lain dirender di Task 7/8 (sementara placeholder `null`).
  - Simpan sukses mode create → `router.replace('/manage-material/course/'+newId)`.

- [ ] **Step 4: `add/page.tsx`** → `<CourseDetail courseId={null} />`; **`[id]/page.tsx`** → `const { id } = await params;` lalu `<CourseDetail courseId={Number(id)} />` (keduanya dibungkus `AdminGuard`).

- [ ] **Step 5: Typecheck + lint + build** — Run: `npx tsc --noEmit; npm run lint; npx next build` → 0 error; rute `add` dan `[id]` ada.
- [ ] **Step 6: Manual** — buka `/manage-material/course/add`, isi form, Simpan → URL berubah ke `/{id}`.
- [ ] **Step 7: Commit**
```bash
git add src/features/course/hooks/useCourseDetail.ts src/features/course/components/CourseDetail.tsx src/features/course/components/CourseDetailTab.tsx "src/app/(admin)/manage-material/course/add/page.tsx" "src/app/(admin)/manage-material/course/[id]/page.tsx"
git commit -m "[Feat][Course] shell detail 3 tab dan form detail course"
```

---

## Task 7: FE — tab Lessons (per level)

**Files:**
- Create: `src/features/course/components/LessonTab.tsx`
- Modify: `src/features/course/components/CourseDetail.tsx` (render `LessonTab` di tab lessons)

**Interfaces:**
- Consumes: `courseServices.getLessons/getLevels/createLesson/updateLesson/deleteLesson`; props `{ courseId:number }`.
- Produces: `<LessonTab courseId={number} />`.

- [ ] **Step 1: Tulis `LessonTab.tsx`**:
  - Muat `levels` (`getLevels()`, filter `isactive`) + `lessons` (`getLessons(courseId)`).
  - Render kolom per level; tiap kolom: judul `Level: {level_name}`, daftar lesson (`title`, `description`) + tombol Edit/Hapus, tombol "Tambah Lesson".
  - Modal Tambah/Edit (`level_id` Select wajib dari level aktif, `title` wajib, `description` TextArea). Create: `position = lessons.filter(l=>l.level_id===levelId).length + 1`, `img_thumbnail=""`. Update: kirim `level_id`, `title`, `description`.
  - Hapus: pre-check `getSubLessons(lesson.id)`; bila ada → blok + pesan.
  - Setelah aksi → reload `lessons`.

- [ ] **Step 2: Sambungkan** di `CourseDetail.tsx`: tab `lessons` → `<LessonTab courseId={courseId!} />` (hanya saat bukan create).
- [ ] **Step 3: Typecheck + lint + build** — 0 error, build sukses.
- [ ] **Step 4: Manual** — tambah lesson di level berbeda; pastikan `position` per level mulai dari 1; edit & hapus jalan.
- [ ] **Step 5: Commit**
```bash
git add src/features/course/components/LessonTab.tsx src/features/course/components/CourseDetail.tsx
git commit -m "[Feat][Course] tab lessons per level"
```

---

## Task 8: FE — tab Sub Lessons & Materials

**Files:**
- Create: `src/features/course/components/SubLessonMaterialTab.tsx`
- Modify: `src/features/course/components/CourseDetail.tsx` (render di tab materials)

**Interfaces:**
- Consumes: `courseServices.getLessons/getSubLessons/createSubLesson/updateSubLesson/deleteSubLesson/getMaterials/createMaterial/updateMaterial/deleteMaterial`; props `{ courseId:number }`.
- Produces: `<SubLessonMaterialTab courseId={number} />`.

- [ ] **Step 1: Tulis `SubLessonMaterialTab.tsx`**:
  - `Select` Lesson (dari `getLessons(courseId)`).
  - Saat lesson dipilih → `getSubLessons(lessonId)`. Tabel/list sub-lesson (`title`, `order_position`) + tombol Tambah (modal `title` wajib; `order_position = subLessons.length + 1`), Edit, Hapus (pre-check `getMaterials(sub.id)`; blok bila ada).
  - Pilih sub-lesson → panel material: `getMaterials(subId)`. Tombol Tambah Material (modal: `title` wajib; `Select` tipe `text`/`video`; `text` → `Input.TextArea` untuk `materials`; `video` → Input `url_video`). Create body: `{ sub_lesson_id, title, materials, url_video, content_position: mats.length+1, prompt_llm: "" }` (field yang tak dipakai = ""). Edit/Hapus material.
  - Setelah aksi → reload list terkait.

- [ ] **Step 2: Sambungkan** di `CourseDetail.tsx`: tab `materials` → `<SubLessonMaterialTab courseId={courseId!} />` (bukan create).
- [ ] **Step 3: Typecheck + lint + build** — 0 error.
- [ ] **Step 4: Manual (end-to-end)** — course → lesson → sub-lesson → material teks & video; edit/hapus tiap tingkat; pastikan pre-check anak memblok.
- [ ] **Step 5: Commit**
```bash
git add src/features/course/components/SubLessonMaterialTab.tsx src/features/course/components/CourseDetail.tsx
git commit -m "[Feat][Course] tab sub lessons dan materials"
```

---

## Task 9: Verifikasi akhir & rapikan

**Files:** — (tak ada file baru)

- [ ] **Step 1:** BE — Run: `go build ./...` (workdir `bajapro-be/src`) → exit 0.
- [ ] **Step 2:** FE — Run: `npx tsc --noEmit; npm run lint; npx next build` → 0 error, build sukses.
- [ ] **Step 3:** Manual penuh alur Fase 1 (lihat Task 8 Step 4) ✓.
- [ ] **Step 4:** Siapkan ringkasan perubahan untuk push (belum push kecuali diminta).

---

## Self-Review

- **Spec coverage**: BE filter (Task 1–3), list (Task 5), detail+tab (Task 6), lesson per level (Task 7), sub-lesson+material (Task 8), pre-check delete (Task 5/7/8), posisi otomatis (Task 7/8), guard simpan-dulu (Task 6), non-goals dihormati (tak ada upload/rich-text/DnD/published). `lessonCount/subLessonCount` kolom (Task 5). `/levels` filter isactive (Task 7).
- **Deviasi disengaja**: tak ada framework test di repo → verifikasi = `go build` + `tsc`/`lint`/`next build` + manual/curl. Struktur feature digabung ke `features/course/` (bukan per entitas).
- **Konsistensi tipe**: nama service & DTO dipakai sama di Task 5–8; path `sub_lessons` konsisten.
- **Review Focus** tiap poin punya test/langkah verifikasi di task terkait.
