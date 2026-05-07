"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Componente que intercepta la navegación hacia atrás del navegador
 * y redirige al usuario a la página de inicio.
 * Se utiliza para evitar volver a estados inválidos como un quiz ya finalizado.
 */
export function NavigationGuard(): null {
  const router = useRouter();

  useEffect(() => {
    // Agregamos una entrada adicional al historial para capturar el primer "Atrás"
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (): void => {
      // Cuando se detecta el evento popstate (botón atrás), 
      // reemplazamos la ruta actual por la home
      router.replace("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return null;
}
