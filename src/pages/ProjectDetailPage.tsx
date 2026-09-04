import { useEffect, useState } from "react";
import type { Project } from "../services/projectService";
import { getTasksByProject, createTask, deleteTask } from "../services/taskService";
import type {Task } from "../services/taskService";
import type { TaskPayload } from "../services/taskService";
import "./ProjectDetailPage.css";

interface ProjectDetailPageProps {
  token: string;
  project: Project;
  onBack: () => void;
}

const EMPTY_FORM: TaskPayload = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "LOW",
  dueDate: "",
};

function ProjectDetailPage({ token, project, onBack }: ProjectDetailPageProps) {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskPayload>(EMPTY_FORM);

  useEffect(() => {
    getTasksByProject(token, project.id)
      .then(setTasks)
      .catch((err: Error) => setError(err.message));
  }, [token, project.id]);

  async function handleCreate() {
    if (!form.title.trim()) {
      alert("El título es obligatorio");
      return;
    }
    try {
      const created = await createTask(token, project.id, form);
      setTasks((prev) => [...(prev ?? []), created]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTask(token, id);
      setTasks((prev) => prev?.filter((t) => t.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (error) return <div className="pd-error">Error: {error}</div>;
  if (!tasks) return <div className="pd-loading">Cargando...</div>;

  return (
    <div className="pd-container">
      <button className="pd-back" onClick={onBack}>
        ← Back to projects
      </button>

      <h1>{project.name}</h1>
      <p className="pd-desc">{project.description}</p>

      <button className="pd-add-btn" onClick={() => setShowForm(true)}>
        + Add task
      </button>

      <div className="pd-list-card">
        <h2>Tasks ({tasks.length})</h2>

        {tasks.map((task) => (
          <div key={task.id} className="pd-row">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="pd-meta">
                Priority: {task.priority} · Due date: {task.dueDate}
              </span>
            </div>
            <div className="pd-row-actions">
              <button
                className="pd-delete"
                onClick={() => handleDelete(task.id)}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="pd-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add task</h2>

            <label>
              Title *
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>

            <label>
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <label>
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </label>

            <div className="pd-modal-actions">
              <button className="pd-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="pd-save" onClick={handleCreate}>
                Create task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
