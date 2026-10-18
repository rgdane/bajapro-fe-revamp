// Upload gambar ke backend (disimpan lokal di server) lewat proxy /api/backend.
// Menggunakan FormData, jadi tidak lewat `apiRequest` (yang mengirim JSON).

interface UploadResponse {
  success: boolean;
  data?: { url: string; filename: string };
  error?: string;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/backend/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const json = (await res.json().catch(() => null)) as UploadResponse | null;
    if (!res.ok || !json?.success || !json.data?.url) {
      throw new Error(json?.error ?? "Gagal mengunggah gambar");
    }
    return json.data.url;
  },
};

export default uploadService;
