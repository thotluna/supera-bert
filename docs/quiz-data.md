# Arquitectura de Persistencia (Supabase)

Este documento define la estructura de datos para el proyecto **supera-bert**. La base de datos se utiliza exclusivamente para gestionar la identidad del usuario y el seguimiento de sesiones, manteniendo el banco de preguntas y el cálculo de estadísticas desacoplado (en el código).

## 1. Identidad de Usuario
Propósito: Mantener un perfil persistente vinculado a la autenticación de Google.

### Tabla: `users`
*   `id`: UUID (Primary Key, referencia a `auth.users`).
*   `email`: Correo electrónico del usuario.
*   `full_name`: Nombre completo extraído de Google.
*   `avatar_url`: Imagen de perfil de Google.

---

## 2. Motor de Quiz (Actividad)
Propósito: Registrar cada sesión y cada respuesta individual para permitir la recuperación de estado y auditoría. Las estadísticas globales se calculan en caliente a partir de estos datos.

### Tabla: `quizzes` (Cabecera de Sesión)
*   `id`: UUID (Primary Key).
*   `user_id`: Referencia a `users.id`.
*   `mode`: Modo de examen (`standard`, `timed`, `infinite`).
*   `itc_codes`: Array de ITCs seleccionadas para esta sesión.
*   `total_questions`: Número de preguntas configuradas.
*   `total_score`: Puntuación final obtenida.
*   `started_at` / `finished_at`: Control de tiempo global.
*   `is_completed`: Flag que indica si el examen se terminó formalmente.

### Tabla: `quiz_answers` (Detalle de Interacción)
*   `id`: UUID (Primary Key).
*   `quiz_id`: Referencia a `quizzes.id`.
*   `question_id`: ID de la pregunta (corresponde al ID en el JSON).
*   `itc_code`: Código de la ITC a la que pertenece la pregunta.
*   `selected_option_ids`: Array de IDs de las opciones marcadas.
*   `is_correct`: Booleano que indica acierto total.
*   `points`: Puntos obtenidos en esta respuesta.
*   `time_ms`: Tiempo invertido en esta pregunta específica.

### Tabla: `user_itc_stats` (Optimización de Lectura)
*   `user_id`: Referencia a `users.id`.
*   `itc_code`: Código de la ITC.
*   `total_attempts`: Contador de respuestas totales.
*   `correct_answers`: Contador de aciertos.
*   `accuracy_rate`: Porcentaje de éxito (calculado por trigger).
*   `avg_time_ms`: Tiempo medio de respuesta (calculado por trigger).
*   **Por qué**: Evita agregaciones pesadas en el dashboard, permitiendo lecturas instantáneas del progreso del usuario.

---

## 🏗️ Resumen de Decisiones
1.  **Desacople de Contenido**: No existen tablas de banco de preguntas en la BD.
2.  **Cálculo Asíncrono (Triggers)**: Se utilizan triggers en la BD para mantener la tabla de estadísticas actualizada en tiempo real, optimizando el rendimiento del dashboard.
3.  **Simplicidad y Rendimiento**: Equilibrio entre una BD mínima y una estructura que soporte consultas rápidas para el usuario final.
