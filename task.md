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
- [x] Sincronizar mocks de Quizzes, Answers y Questions para cubrir todos los escenarios de resultados
- [x] Instalar y configurar Storybook con addons de accesibilidad (`a11y`) y esenciales
- [x] Configurar Storybook para soportar Next.js, Tailwind v4 y tokens semánticos (CSS variables)
- [x] Implementar componentes atómicos (`Button`, `OptionsMode`) y sus historias en Storybook
- [x] Estandarizar el componente `Button` premium en toda la aplicación (Home, Resultados, Auth)

# Configuración del Quiz (UX/UI Premium)

- [x] Implementar Dashboard compacto (Bento Grid) sin scroll
- [x] Solucionar error 500/404 en Vercel por carga de datos.
- [x] Implementar arquitectura de manifiesto dinámico (Plug-and-Play).
- [x] Configurar Husky pre-commit para auto-sincronización de datos.
- [x] Añadir contenido de ITC-BT-12 (25 preguntas).
- [x] Corregir regresiones en tests de Store y Proxy.
- [ ] Merge a rama main y validación final en producción.
- [x] Asegurar cumplimiento de reglas de ingeniería TS (No any, SOLID)

# Refactorización de Datos (JSON Data)

- [x] Renombrar claves de español a inglés en `data/*.json` (`pregunta` -> `question`, etc.)
- [x] Crear semillas de datos mock para validación de tests
- [x] Refinar metadatos de preguntas (Mover referencias de ITC a explicaciones) en todos los archivos
- [x] Cargar y limpiar contenido de ITC-BT-18 y ITC-BT-19

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

# Correcciones de UI/UX

- [x] Corregir deformación de círculos de opciones en móvil (Issue #21)
- [x] Ajustar feedback de resultados al 80% (Issue #25)
- [x] Corregir navegación y feedback en la última pregunta (Issue #24)
  - [x] Mantener pregunta visible durante 3s de feedback
  - [x] Corregir contador de progreso (11/10)
  - [x] Evitar pantalla en blanco al finalizar el store
  - [x] Implementar test unitario de validación
- [x] Corregir race condition del timer y sesiones 'zombie' que provocaban redirecciones prematuras

# Accesibilidad y Contraste (WCAG compliance)

- [x] Implementar suite de tests de contraste con Playwright + Axe-core
- [x] Corregir violaciones de contraste en botones (Sky/Accent) en modo claro y oscuro
- [x] Implementar sistema de tokens semánticos (`--success`, `--error`) para feedback visual expresivo y accesible
- [x] Asegurar cumplimiento de ratios WCAG AA (4.5:1) en todos los estados (Acierto, Fallo, No contestada)

# Migración de Componentes a Storybook (Pattern Container/Presenter)

- [x] Crear e integrar `OptionsMode` a Storybook
- [x] Refactorizar `QuizTopics` (Container/Presenter) e integrar a Storybook
- [x] Refactorizar `SimpleChoice` y `MultipleChoice` (shared View) e integrar a Storybook
- [x] Refactorizar Resultados (Summary & ReviewItem) e integrar a Storybook

# Estadísticas de Usuario (UX/UI Premium)

- [x] Implementar arquitectura base para Estadísticas de Usuario
  - [x] Definir entidad de dominio `UserStats`
  - [x] Crear `StatsRepository` y `StatsDataSource` (Supabase)
  - [x] Implementar `StatsService` con lógica de agregación
  - [x] Registrar `StatsService` en la `Factory`
- [x] Crear página de Estadísticas (`/stats`)
- [x] Implementar componentes visuales (Gráficos, Bento Grid de métricas, Radar Chart)
- [x] Integrar Server Actions para obtención de datos
- [x] Asegurar diseño premium y responsivo

# Generación de Datos (ITCs)

- [x] Extraer y formatear datos de ITC-BT-10 (100/100 preguntas)
- [x] Cargar y limpiar contenido de ITC-BT-20 al ITC-BT-40
- [x] Generar 100 preguntas para ITC-BT-22 al ITC-BT-40 basadas en el PDF
- [x] Sincronizar manifiesto de datos (39 tópicos registrados)

# Despliegue y Producción (Vercel Fixes)

- [x] Corregir Error 500 en Vercel al cargar el Quiz (Issue #31)
  - [x] Eliminar dependencia de `fs` en el entorno serverless
  - [x] Implementar mapeo de importaciones dinámicas para archivos JSON de datos
- [x] Refinar layout Bento del Dashboard de Estadísticas
  - [x] Intercambiar posiciones de RadarChart y TopicPerformance para mejor equilibrio visual
  - [x] Ajustar contenedores para evitar deformación de gráficos (Radar)


# Navegación y UX

- [x] Evitar navegación hacia atrás al Quiz desde Resultados o Estadísticas
  - [x] Usar `RedirectType.replace` al finalizar el quiz
- [x] Implementar guardián de navegación en `/stats` y `/quiz/results/[id]` para redirigir a `/` en `popstate`

# Automatización de Datasets (REBT Fuente de Verdad)

- [x] Extraer texto completo del REBT desde PDF local (`/docs/rebt_full.txt`)
- [x] Generar preguntas para ITC-BT-41 (60 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-42 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-43 (30 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-44 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-45 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-46 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-47 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-48 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-49 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-50 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-51 (25 preguntas validadas por PDF)
- [x] Generar preguntas para ITC-BT-52 (25 preguntas validadas por PDF)
- [x] Generar dataset conceptual del Reglamento de Eficiencia Energética (REE) (100 preguntas validadas por PDF)
- [x] Generar dataset práctico del Anexo 1 de la Guía BT (Grados IP/IK) (25 preguntas validadas por PDF)
- [x] Generar dataset de alcances de todas las ITCs (REBT-SCOPES) (104 preguntas)
- [x] Implementar inyección automática del 10% de preguntas generales (REE, Anexo 1, Scopes) en cada quiz
- [ ] Revisar consistencia global de los datasets generados
