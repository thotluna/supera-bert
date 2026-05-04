# Plan de Refactorización: Validación en Cliente (Simplificado)

Este plan detalla los pasos para mover la lógica de validación de respuestas al cliente eliminando las interfaces redundantes y permitiendo que el cliente maneje las entidades completas.

## Etapa 1: Unificación de Modelos de Datos

Eliminaremos la distinción entre modelos de servidor y cliente para simplificar el flujo.

- **Tarea**: Eliminar `QuestionClient` y `OptionClient` de `libs/quiz/models/index.ts`.
- **Tarea**: Actualizar todas las referencias en el proyecto para usar `Question` y `Option` directamente.

## Etapa 2: Modificación de `getAllQuestions`

El servidor ahora enviará el objeto completo, incluyendo la respuesta correcta y la explicación.

- **Cambio**: La función devolverá `Promise<Question[]>` en lugar de `QuestionClient[]`.
- **Archivo**: `libs/quiz/actions/get-all-questions.ts`.

## Etapa 3: Refactorización del Zustand Store (`quiz-store.ts`)

La validación pasa a ser una operación puramente local y síncrona.

- **Acción `nextQuestion`**:
    1.  Eliminar la llamada a `await validateAnswer()`.
    2.  Validar directamente comparando con `option.isCorrect`.
    3.  Actualizar el estado del quiz instantáneamente.
- **Beneficio**: Feedback inmediato y código mucho más limpio.

## Etapa 4: Eliminación de Infraestructura Obsoleta

- **Tarea**: Eliminar el archivo `libs/quiz/actions/validate-answer.ts`.
- **Tarea**: Limpiar el `QuizService` de métodos que ya no son necesarios para la validación individual.

## Etapa 5: Validación de Integridad en el Guardado

Para mantener la integridad de los datos en la base de datos:

- **Lógica**: `saveAndRedirect` recibirá el array de respuestas. El servidor puede recalcular el score final basándose en los IDs enviados para asegurar que los puntos guardados son legítimos.
- **Archivo**: `libs/quiz/actions/save-and-redirect.ts`.

## Resumen de Impacto en Costos (Vercel)

| Métrica | Arquitectura Actual | Nueva Arquitectura |
| :--- | :--- | :--- |
| **Llamadas por Quiz (10 q)** | 12 | 2 |
| **Latencia por pregunta** | 200ms - 600ms | < 1ms |
| **Seguridad** | Alta (Inviolable) | Media (Ofuscada) |
| **Experiencia de Usuario** | Regular (Depende de red) | Excelente (Instantánea) |
