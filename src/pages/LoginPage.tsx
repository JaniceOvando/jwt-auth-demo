import { useState } from "react";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
}

function LoginPage({ onLogin, error, loading }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(username, password);
  }

  return (
    <div className="lp-container">
      <h1>TaskFlow</h1>
      <p className="lp-subtitle">Inicia sesión para administrar tus proyectos y tareas.</p>

      <form className="lp-card" onSubmit={handleSubmit}>
        {error && <div className="lp-error">{error}</div>}

        <label>
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="user"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
