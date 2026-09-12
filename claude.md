Project ini merupakan frontend dari aplikasi E-Learning Java bernama BAJAPRO, menggunakan teknologi next js typescript, yang nantinya akan diintegrasikan dengan backend go fiber.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Ant Design 5 (antd + @ant-design/icons)
- **Lint**: `npm run lint` (eslint)
- **Typecheck**: `npx tsc --noEmit`

## Architecture

### Atomic Design Pattern (src/components/)

Komponen disusun menggunakan konsep atomic design dengan 3 level:

1. **ui/** (Atoms) — wrapper tipis di atas Ant Design, reusable di mana saja
   - `Button.tsx` — wrapper `antd/Button`
   - `Input.tsx` — wrapper `antd/Input` + `SearchInput` (Input.Search)
   - `Table.tsx` — wrapper generic `antd/Table<T>`

2. **fragments/** (Molecules) — gabungan beberapa atom jadi unit fungsional
   - `MasterHeader.tsx` — title + search bar + tombol "Tambah Data" + slot `extra`
   - `MasterTable.tsx` — Card + Table + pagination default (10/25/50/100)

3. **templates/** (Templates) — gabungan fragments jadi layout halaman reusable
   - `MasterTemplate.tsx` — MasterHeader + MasterTable, dipakai semua halaman master (user, roles, kelas, dll)

### Cara pakai MasterTemplate

```tsx
<MasterTemplate
  title="Data User"
  onAdd={() => router.push("/master/user/create")}
  onSearch={(val) => setSearch(val)}
  searchPlaceholder="Cari user..."
  tableProps={{
    columns: userColumns,
    dataSource: users,
    loading: isLoading,
  }}
/>
```

### Feature Module Pattern (src/features/)

Setiap fitur master punya folder sendiri dengan struktur:

```
features/<nama-fitur>/
├── hooks/        # Custom hooks (useXxx.ts) — memanggil services, return data + state
├── types/        # TypeScript types/DTO (xxxTypes.ts) — model, createDTO, updateDTO
├── services/     # API endpoint list (xxxServices.ts) — fungsi fetch/post/put/delete
└── components/   # Komponen spesifik fitur (XxxTable.tsx) — pakai hooks + MasterTemplate
```

### Navigation (src/navigation/)

- `Sidebar.tsx` — sidebar dengan Ant Design Sider + Menu, accordion submenu, auto-highlight berdasarkan pathname. Terpasang di `src/app/layout.tsx`. Role filtering belum diimplementasi (semua menu tampil).

Menu items: Dashboard, Kelola Materi (Level, Course, Question), Kelola Pengguna (Roles, Kelas, Users, Approval, Permission), Report (Hasil Belajar, Leaderboard), Gamifikasi (Badge Settings).

## Repository Structure

```
bajapro-fe-revamp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (Sidebar + main content)
│   │   ├── page.tsx            # Landing page
│   │   └── master/
│   │       └── user/page.tsx   # Halaman master user
│   │
│   ├── components/
│   │   ├── ui/                # Atoms: Button, Input/SearchInput, Table
│   │   ├── fragments/         # Molecules: MasterHeader, MasterTable
│   │   ├── templates/         # Templates: MasterTemplate
│   │   ├── layout/            # Layout components
│   │   └── providers/         # Context providers (Auth, Toast, Theme)
│   │
│   ├── features/
│   │   └── user/              # Fitur master user
│   │       ├── hooks/useUser.ts
│   │       ├── types/userTypes.ts
│   │       ├── services/userServices.ts
│   │       └── components/UserTable.tsx
│   │
│   ├── config/                # Axios configuration, CRUD factory
│   ├── hooks/                 # Custom React hooks (global)
│   ├── lib/                   # Utilities (date formatting, helpers)
│   ├── navigation/            # Sidebar.tsx (menu config + komponen)
│   ├── store/                 # Redux store configuration
│   └── utils/                 # Helper functions
│
├── public/                    # Static assets (icons, images)
├── Dockerfile                 # Multi-stage Docker build
├── cloudbuild_prod.yaml      # GCP Cloud Build config
├── makefile                  # Docker management commands
└── package.json               # Frontend dependencies
```

## Conventions

- Semua komponen client-side wajib pakai `"use client"` di baris pertama
- Props komponen UI mengextend props Ant Design aslinya (misal `ButtonProps extends AntButtonProps`)
- Generic Table: `Table<T>` dan `MasterTable<T>` support generic type untuk type-safe columns/dataSource
- Warna primary: `#531DAB` (ungu)
- Sidebar theme: light, width 250px, sticky, border kanan