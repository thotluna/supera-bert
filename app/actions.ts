'use server';

import { redirect } from "next/navigation";

export async function startQuizAction(formData: FormData) {
  const mode = formData.get('mode');
  const topics = formData.getAll('topics');

  if (!mode) {
    // Podríamos manejar errores aquí, pero por simplicidad asumimos que hay uno por defecto
    return;
  }

  // Si "all" está presente, ignoramos el resto para limpiar la URL
  const topicParam = topics.includes('all') ? 'all' : topics.join(',');

  redirect(`/quiz?mode=${mode}&topics=${topicParam}`);
}
