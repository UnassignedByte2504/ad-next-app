# Data Flow

> Cómo fluyen los datos en la aplicación.

## Flujo Unidireccional

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Component  │────▶│    Action    │────▶│    Store     │
│   (render)   │     │  (dispatch)  │     │   (state)    │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                                         │
       │                                         │
       └─────────────────────────────────────────┘
                    (subscription)
```

## Patrones de Flujo

### Server → Client

```typescript
// 1. Server Component obtiene datos
// app/(main)/musician/[id]/page.tsx
import { fetchMusician } from "@lib/api/musicians";
import { MusicianProfile } from "./components/MusicianProfile";

export default async function MusicianPage({ params }: { params: { id: string } }) {
  const musician = await fetchMusician(params.id);

  // 2. Pasa datos como props a Client Component
  return <MusicianProfile musician={musician} />;
}

// 3. Client Component recibe y usa los datos
// app/(main)/musician/[id]/components/MusicianProfile.tsx
"use client";

import { MusicianCard } from "@organisms";
import { useAuth } from "@store";

interface MusicianProfileProps {
  musician: Musician;
}

export function MusicianProfile({ musician }: MusicianProfileProps) {
  const currentUser = useAuth((s) => s.user);
  // Lógica de cliente...

  return <MusicianCard musician={musician} />;
}
```

### User Action → API → Store

```typescript
// components/organisms/LoginForm/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useAuthentication } from "@store/hooks";
import { useNotify } from "@store/hooks";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthentication();
  const notify = useNotify();
  const { register, handleSubmit, formState } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      notify.success("¡Bienvenido!");
      router.push("/dashboard");
    } catch {
      notify.error("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        error={formState.errors.email?.message}
        {...register("email", { required: "Email requerido" })}
      />
      <FormField
        label="Contraseña"
        type="password"
        error={formState.errors.password?.message}
        {...register("password", { required: "Contraseña requerida" })}
      />
      <Button type="submit" loading={isLoading}>
        Iniciar Sesión
      </Button>
    </form>
  );
}
```

### Optimistic Updates

```typescript
// hooks/useOptimisticUpdate.ts
export function useOptimisticUpdate<T>(
  currentData: T,
  updateFn: (data: T) => Promise<T>
) {
  const [optimisticData, setOptimisticData] = useState(currentData);
  const [isUpdating, setIsUpdating] = useState(false);

  const update = async (newData: T) => {
    const previousData = optimisticData;

    // Actualización optimista
    setOptimisticData(newData);
    setIsUpdating(true);

    try {
      const result = await updateFn(newData);
      setOptimisticData(result);
    } catch (error) {
      // Rollback en caso de error
      setOptimisticData(previousData);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { data: optimisticData, update, isUpdating };
}
```

## Related

- [State Types](./state-types.md)
- [Zustand](../state/zustand.md)
- [API Client](../api/client.md)

