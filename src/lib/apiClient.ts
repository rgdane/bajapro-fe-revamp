// Client API bersama. Semua request ke backend dilewatkan proxy same-origin
// `/api/backend` (route handler meneruskan header Authorization dari cookie
// access_token), sehingga endpoint ber-JWT bisa diakses setelah login.
export const BASE_URL = "/api/backend";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

function toQueryString(
  query?: Record<string, string | number | boolean | undefined>,
): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body, query } = options;

  const res = await fetch(`${BASE_URL}${path}${toQueryString(query)}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await res
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !payload?.success) {
    throw new Error(
      payload?.error ?? `Request gagal dengan status ${res.status}`,
    );
  }

  return payload;
}
