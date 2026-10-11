import type {
  AuthUser,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
} from "../types/authTypes";

export const authServices = {
  login: async (payload: LoginPayload): Promise<LoginResult> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => null)) as LoginResult | null;
    if (!res.ok || !json?.success) {
      throw new Error(json?.error ?? "Login gagal");
    }
    return json;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResult> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => null)) as RegisterResult | null;
    if (!res.ok || !json?.success) {
      throw new Error(json?.error ?? "Registrasi gagal");
    }
    return json;
  },

  logout: async (): Promise<void> => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  },

  getProfile: async (): Promise<AuthUser | null> => {
    const res = await fetch("/api/auth/profile", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json().catch(() => null)) as
      | { success: boolean; data?: AuthUser }
      | null;
    return json?.data ?? null;
  },
};

export default authServices;
