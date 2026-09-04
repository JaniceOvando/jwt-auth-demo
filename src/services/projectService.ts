const API_BASE = "https://d3ujwk09smrk9z.cloudfront.net";

export interface Project {
  id: number;
  name: string;
  description: string;
}

export type ProjectPayload = Omit<Project, "id">;

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getProjects(token: string): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("No se pudo obtener los proyectos");
  return res.json();
}

export async function getProject(
  token: string,
  id: number
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("No se pudo obtener el proyecto");
  return res.json();
}

export async function createProject(
  token: string,
  payload: ProjectPayload
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("No se pudo crear el proyecto");
  return res.json();
}

export async function updateProject(
  token: string,
  id: number,
  payload: ProjectPayload
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("No se pudo editar el proyecto");
  return res.json();
}

export async function deleteProject(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("No se pudo borrar el proyecto");
}
