Project ini merupakan frontend dari aplikasi E-Learning Java bernama BAJAPRO, menggunakan teknologi next js typescript, yang nantinya akan diintegrasikan dengan backend go fiber.

## Repository Structure

```
bajapro-fe-revamp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/
│   │   │   ├── data-pegawai/   # Employee data (Divisions, Titles)
│   │   │   ├── master/         # SOP/SPK management
│   │   │   └── profile/        # User profile
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/
│   │   ├── fragments/         # Reusable component groups (Flowchart)
│   │   ├── layout/            # Layout components
│   │   ├── providers/         # Context providers (Auth, Toast, Theme)
│   │   └── ui/                # Base UI components (Button, Table, Modal)
│   │
│   ├── features/
│   │   ├── user/         # folder parent fitur master user
            ├── hooks/         # berisi hooks dari fitur master user
                ├── useUser.ts         # dari setiap endpoint yang sudah dilist di services akan dibuatkan hooks disini agar bisa dipanggil di component dengan lebih clean
            ├── types/         # berisi types yang dibutuhkan fitur master user
                ├── userTypes.ts         # types seperti createUserDTO, updateUserDTO, dan User (representasi model user) ini nanti dipanggil di hook sesuai kebutuhan, misal hook untuk fetch data disimpan ke type User, hook untuk create data user disimpan ke createUserDTO, dan seterusnya
            ├── services/      # list endpoint yang dibutuhkan fitur master user
                ├── userServices.ts      # list endpoint yang dibutuhkan fitur master user
            ├── components/    # komponen yang dibutuhkan fitur master user, nantinya
                ├── UserTable.tsx    # komponen yang dibutuhkan fitur master user, nantinya akan manggil hooks yang dibutuhkan komponen
│   │
│   ├── config/                # Axios configuration, CRUD factory
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities (date formatting, diagram helpers)
│   ├── navigation/            # Menu configuration
│   ├── store/                 # Redux store configuration
│   └── utils/                 # Helper functions
│
├── public/                    # Static assets (icons, images)
├── Dockerfile                 # Multi-stage Docker build
├── cloudbuild_prod.yaml      # GCP Cloud Build config
├── makefile                  # Docker management commands
└── package.json               # Frontend dependencies
```