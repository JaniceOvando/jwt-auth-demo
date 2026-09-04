import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import type { Project } from "./services/projectService";

function App() {
  const { token, username, isAuthenticated, login, logout, error, loading } =
    useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    null
  );

  async function handleLogin(user: string, password: string) {
    try {
      await login({ username: user, password });
    } catch {
      // el error ya se guarda en el hook y se muestra en LoginPage
    }
  }

  if (!isAuthenticated || !token) {
    return <LoginPage onLogin={handleLogin} error={error} loading={loading} />;
  }

  if (selectedProject) {
    return (
      <ProjectDetailPage
        token={token}
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <ProjectsPage
      token={token}
      username={username ?? ""}
      onLogout={logout}
      onOpenProject={setSelectedProject}
    />
  );
}

export default App;
