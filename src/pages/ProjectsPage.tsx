import { useEffect, useState } from "react";
import { getProjects, createProject, updateProject, deleteProject,} from "../services/projectService";
import type { Project } from "../services/projectService";
import type { ProjectPayload } from "../services/projectService";
import "./ProjectsPage.css";

interface ProjectsPageProps {
  token: string;
  username: string;
  onLogout: () => void;
  onOpenProject: (project: Project) => void;
}

const EMPTY_FORM: ProjectPayload = { name: "", description: "" };

function ProjectsPage({
  token,
  username,
  onLogout,
  onOpenProject,
}: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"new" | Project | null>(null);
  const [form, setForm] = useState<ProjectPayload>(EMPTY_FORM);

  useEffect(() => {
    getProjects(token)
      .then(setProjects)
      .catch((err: Error) => setError(err.message));
  }, [token]);

  function openNew() {
    setForm(EMPTY_FORM);
    setModal("new");
  }

  function openEdit(project: Project) {
    setForm({ name: project.name, description: project.description });
    setModal(project);
  }

  function closeModal() {
    setModal(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit() {
    if (form.name.trim().length < 3) {
      alert("El nombre debe tener al menos 3 caracteres");
      return;
    }
    try {
      if (modal === "new") {
        const created = await createProject(token, form);
        setProjects((prev) => [...(prev ?? []), created]);
      } else if (modal) {
        const updated = await updateProject(token, modal.id, form);
        setProjects(
          (prev) => prev?.map((p) => (p.id === modal.id ? updated : p)) ?? null
        );
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteProject(token, id);
      setProjects((prev) => prev?.filter((p) => p.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (error) return <div className="pp-error">Error: {error}</div>;
  if (!projects) return <div className="pp-loading">Cargando...</div>;

  return (
    <div className="pp-container">
      <div className="pp-topbar">
        <div>
          <h1>Projects</h1>
          <p className="pp-subtitle">
            Organiza tu trabajo y administra tus tareas.
          </p>
        </div>
        <div className="pp-user">
          <span className="pp-avatar">{username[0]?.toUpperCase()}</span>
          <span>{username}</span>
          <button className="pp-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <button className="pp-add-btn" onClick={openNew}>
        + Add project
      </button>

      <div className="pp-list-card">
        <h2>Projects ({projects.length})</h2>

        {projects.map((project) => (
          <div key={project.id} className="pp-row">
            <div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="pp-id">ID {project.id}</span>
            </div>
            <div className="pp-row-actions">
              <button onClick={() => onOpenProject(project)}>OPEN</button>
              <button onClick={() => openEdit(project)}>✏️ EDIT</button>
              <button
                className="pp-delete"
                onClick={() => handleDelete(project.id)}
              >
                🗑️ DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && (
        <div className="pp-modal-backdrop" onClick={closeModal}>
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal === "new" ? "Add a project" : "Edit project"}</h2>

            <label>
              Name *
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <span className="pp-hint">At least 3 characters</span>
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

            <div className="pp-modal-actions">
              <button className="pp-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="pp-save" onClick={handleSubmit}>
                {modal === "new" ? "Create project" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
