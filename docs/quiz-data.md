# Datos del Quiz

Este documento detalla toda la información que actualmente podemos obtener y rastrear durante y después de un quiz en Supera-BERT.

## 1. Configuración del Quiz (`ConfigQuiz`)
Esta información se define al inicio del quiz y determina las reglas del mismo.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `userId` | `string` | Identificador único del usuario que realiza el quiz. |
| `mode` | `ModeQuiz` | Modo de juego: `timed` (con tiempo global), `standard` (por defecto), `untimed` (sin límites). |
| `time` | `number` (opcional) | Tiempo total asignado para el quiz en segundos (si aplica). |
| `questionCount` | `number` | Cantidad total de preguntas solicitadas para la sesión. |
| `topics` | `ITCTopic[]` | Lista de temas seleccionados (ej: `ITC-BT-03`, `ITC-BT-04`). |

## 2. Estado en Tiempo Real (`QuizState`)
Datos gestionados por el store de Zustand para mantener la reactividad y persistencia en el navegador.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `questions` | `QuestionClient[]` | Cola de preguntas restantes por responder. |
| `currentQuestion` | `QuestionClient` | La pregunta que el usuario está viendo actualmente. |
| `currentSelection` | `OptionClient[]` | Opciones que el usuario ha marcado pero aún no ha confirmado. |
| `answers` | `ResponseQuestion[]` | Historial detallado de todas las preguntas ya respondidas. |
| `startTime` | `number` | Timestamp (ms) de cuándo se inició la pregunta actual. |
| `expiresAt` | `number` | Timestamp (ms) de cuándo expira el quiz completo (modo `timed`). |
| `isFeedbacking` | `boolean` | Indica si se está mostrando la corrección (feedback) de la pregunta actual. |
| `score` | `number` | Puntuación acumulada del usuario (soporta decimales). |
| `isFinished` | `boolean` | Estado que indica si el quiz ha llegado a su fin. |

## 3. Detalle de Respuestas (`ResponseQuestion`)
Cada entrada en el array de `answers` contiene información detallada sobre el desempeño en esa pregunta específica.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `string` | ID único de la pregunta. |
| `question` | `string` | Enunciado de la pregunta. |
| `selectedOptions` | `Option[]` | Opciones seleccionadas por el usuario, enriquecidas con `isCorrect` y `explanation`. |
| `time` | `number` | Tiempo invertido en responder esta pregunta específica (en milisegundos). |
| `points` | `number` | Puntos obtenidos (positivos por aciertos, negativos por errores si aplica). |
| `isCorrect` | `boolean` | Indica si el resultado global de la respuesta fue correcto. |
| `itc` | `string` | Referencia a la Instrucción Técnica Complementaria relacionada. |

## 4. Estructura de Opciones (`Option`)
Detalle de las opciones dentro de una pregunta.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `number` | ID de la opción dentro de la pregunta. |
| `answer` | `string` | Texto de la opción. |
| `isCorrect` | `boolean` | Indica si la opción es correcta (solo disponible tras validación o en servidor). |
| `explanation` | `string` | Justificación de por qué la opción es correcta o incorrecta. |
