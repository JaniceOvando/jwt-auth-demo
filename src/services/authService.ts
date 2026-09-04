const API_BASE = "https://d3ujwk09smrk9z.cloudfront.net";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return res.json();
}

export async function register(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("No se pudo registrar el usuario");
  }

  return res.json();
}
