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
- [ ] Configurar Playwright para pruebas E2E de flujos críticos

# Refactorización de Datos (JSON Data)

- [x] Renombrar claves de español a inglés en `data/*.json` (`pregunta` -> `question`, etc.)
