const API_BASE = "https://d3ujwk09smrk9z.cloudfront.net";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority?: string;
  dueDate?: string;
}

export type TaskPayload = Omit<Task, "id">;

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getTasksByProject(
  token: string,
  projectId: number
): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("No se pudo obtener las tareas");
  return res.json();
}

export async function createTask(
  token: string,
  projectId: number,
  payload: TaskPayload
): Promise<Task> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("No se pudo crear la tarea");
  return res.json();
}

export async function updateTask(
  token: string,
  id: number,
  payload: TaskPayload
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("No se pudo editar la tarea");
  return res.json();
}

export async function updateTaskStatus(
  token: string,
  id: number,
  status: string
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("No se pudo cambiar el estado");
  return res.json();
}

export async function deleteTask(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("No se pudo borrar la tarea");
}
