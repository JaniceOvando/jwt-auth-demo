# TaskFlow — JWT Auth Demo

Demo educativo de autenticación JWT en React (servicio, hook, componente),
conectado a la API real de TaskFlow.

## API

- Base URL: `https://d3ujwk09smrk9z.cloudfront.net`
- Documentación Swagger: `https://d3ujwk09smrk9z.cloudfront.net/swagger-ui/index.html`
- Usuarios sembrados: `ana/ana123`, `luis/luis123`, `admin/admin123`

## Arquitectura del proyecto

```
src/
├── services/
│   ├── authService.ts      # login, register
│   ├── projectService.ts   # CRUD de proyectos
│   └── taskService.ts      # CRUD de tareas (incluye PATCH de status)
├── hooks/
│   └── useAuth.ts          # maneja el token JWT y el estado de sesión
├── pages/
│   ├── LoginPage.tsx        # formulario de login
│   ├── ProjectsPage.tsx     # dashboard de proyectos (CRUD)
│   └── ProjectDetailPage.tsx # detalle de un proyecto y sus tareas
└── App.tsx                  # enruta entre Login / Projects / ProjectDetail
```

## Flujo de autenticación

1. El usuario llena el formulario en `LoginPage`.
2. `useAuth.login()` llama a `authService.login()`, que hace
   `POST /auth/login` con `{ username, password }`.
3. La API responde con un JWT (`{ token }`).
4. El hook guarda el token en `localStorage` y en estado de React.
5. Cada petición posterior (`projectService`, `taskService`) manda el token
   en el header `Authorization: Bearer <token>`.
6. `logout()` borra el token de `localStorage` y regresa a `LoginPage`.

## Endpoints consumidos

| Verbo  | Endpoint                          | Uso                              |
|--------|------------------------------------|-----------------------------------|
| POST   | `/auth/login`                      | Iniciar sesión, obtener JWT       |
| GET    | `/projects`                        | Listar proyectos                  |
| POST   | `/projects`                        | Crear proyecto                    |
| PUT    | `/projects/{id}`                   | Editar proyecto                   |
| DELETE | `/projects/{id}`                   | Borrar proyecto (borra sus tasks) |
| GET    | `/projects/{id}/tasks`             | Listar tareas de un proyecto      |
| POST   | `/projects/{projectId}/tasks`      | Crear tarea dentro de un proyecto |
| PUT    | `/tasks/{id}`                      | Reemplazar una tarea completa     |
| PATCH  | `/tasks/{id}/status`               | Cambiar solo el estado de la tarea|
| DELETE | `/tasks/{id}`                      | Borrar tarea                      |

## Cómo correr en local

```bash
npm install
npm run dev
```

## Deploy

Este proyecto se despliega a GitHub Pages vía GitHub Actions
(`.github/workflows/deploy-gh-pages.yml`). Cada push a `main` dispara el
build y deploy automáticamente. El `base` en `vite.config.ts` debe coincidir
con el nombre del repo, ej: `base: '/jwt-auth-demo/'`.
