# 006 - Protección de rutas

## Objetivo

Proteger todas las rutas de la aplicación para que solo sean accesibles por usuarios autenticados. Redirigir a login si no hay sesión.

## Implementación

### 1. Componente ProtectedRoute

Crear `src/components/auth/ProtectedRoute.tsx`:

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### 2. Actualizar rutas en App.tsx

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "@/pages/Login";

// Rutas:
<Routes>
  {/* Ruta pública */}
  <Route path="/login" element={<Login />} />

  {/* Rutas protegidas */}
  <Route path="/" element={
    <ProtectedRoute>
      <AppLayout><Dashboard /></AppLayout>
    </ProtectedRoute>
  } />
  <Route path="/proyectos" element={
    <ProtectedRoute>
      <AppLayout><Proyectos /></AppLayout>
    </ProtectedRoute>
  } />
  {/* ... resto de rutas protegidas igual ... */}
</Routes>
```

### 3. Redirigir desde login si ya autenticado

Añadir en `Login.tsx`:

```typescript
const { user } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  if (user) navigate("/", { replace: true });
}, [user, navigate]);
```

## Archivos creados/modificados

- `src/components/auth/ProtectedRoute.tsx` (nuevo)
- `src/App.tsx` (modificado - rutas protegidas)
- `src/pages/Login.tsx` (modificado - redirect si autenticado)

## Dependencias

- Task 005 completada (AuthContext y Login)
