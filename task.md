# Tareas de Corrección de Seguridad

- [x] Crear rama de trabajo `fix/postcss-vulnerability`
- [x] Configurar `overrides` en `package.json`
- [x] Ejecutar `pnpm install` para actualizar el lockfile
- [x] Verificar con `pnpm audit`
- [x] Documentar cambios en el Walkthrough

# Refactorización de Autenticación (Arquitectura de Dominio)

- [x] Crear arquitectura de auth basada en dominio (Fachada/Repositorio/Servicio)
- [x] Implementar Result Pattern (`DomainResponse`) para manejo explícito de errores
- [x] Asegurar la aplicación con Server Actions y Middleware (Proxy)
- [x] Refactorizar componentes UI para consumir la nueva capa de auth
- [x] Corregir fugas de código de servidor en el bundle del cliente

# Pruebas y Calidad (Testing Infrastructure)

- [x] Configurar Vitest y Testing Library
- [x] Implementar Unit Tests para `AuthRepository` y `AuthService`
- [x] Implementar Tests para el Middleware Proxy (Seguridad de Rutas)
- [x] Configurar Playwright para pruebas E2E de flujos críticos
- [x] Implementar Tests Unitarios y E2E para la configuración del Quiz (Happy paths & Corner cases)
- [x] Implementar Auth Bypass para entorno de testing (E2E) sin comprometer producción

# Configuración del Quiz (UX/UI Premium)

- [x] Implementar Dashboard compacto (Bento Grid) sin scroll
- [x] Integrar Server Actions para navegación nativa
- [x] Implementar Renderizado Granular con Suspense y Skeletons
- [x] Corregir bugs de estado concurrente en el hook de selección
- [x] Asegurar cumplimiento de reglas de ingeniería TS (No any, SOLID)

# Refactorización de Datos (JSON Data)

- [x] Renombrar claves de español a inglés en `data/*.json` (`pregunta` -> `question`, etc.)
- [x] Crear semillas de datos mock para validación de tests

# Documentación y Análisis

- [x] Definir y documentar estructura de datos obtenibles del Quiz
- [x] Implementar esquema de base de datos en Supabase (4 tablas y triggers)
- [x] Definir entidades de dominio puras para Quiz, Answer y Progress
- [x] Implementar arquitectura de 4 capas (Action -> Service -> Repository -> DataSource)
- [x] Documentar y diseñar arquitectura de Fábrica Dinámica (Plug-and-Play)

# Limpieza de Código

- [x] Eliminar acciones y métodos de Factory no utilizados (`StartQuizAction`, `SubmitAnswerAction`, `FinishQuizAction`)
- [x] Eliminar servicios redundantes (`AnswerService`)

# Optimización de Rendimiento y Costos (Validación en Cliente)

- [x] Etapa 1: Unificar modelos de datos (eliminar interfaces `Client`)
- [x] Etapa 2: Modificar `getAllQuestions` para devolver objeto completo `Question[]`
- [x] Etapa 3: Refactorizar `quiz-store.ts` para validación síncrona local
- [x] Etapa 4: Eliminar Server Action `validate-answer.ts`
- [x] Etapa 5: Implementar validación de integridad en `saveAndRedirect`
