# Arquitectura de Fábrica Dinámica (Dynamic Factory)

## Contexto
En el desarrollo de `supera-bert`, se requiere una forma robusta de gestionar las dependencias entre los servicios de aplicación y sus implementaciones de infraestructura (Repositorios/DataSources).

## El Problema
El uso de condicionales `if/else` dentro de una fábrica para conmutar entre implementaciones reales (Supabase) y de prueba (Mocks) introduce "conocimiento de test" en el código de producción. Esto viola el principio de limpieza y puede llevar a que código de pruebas se ejecute o se incluya innecesariamente en los entornos de producción.

## La Solución: Plug-and-Play Architecture
Se ha decidido implementar un patrón **Factory** basado en **importaciones dinámicas asíncronas** configuradas a través de variables de entorno (`.env`).

### Ventajas Clave
1. **Aislamiento Total**: El código de producción no sabe que existen los mocks. La ruta de la implementación se inyecta en tiempo de ejecución.
2. **Cero Código de Test en Producción**: Al evitar los `if (process.env.NODE_ENV === 'test')`, mantenemos la lógica de la fábrica pura y centrada en la instanciación.
3. **Flexibilidad en Servidor (Next.js)**: Dado que estas fábricas se ejecutan exclusivamente en el lado del servidor, el uso de `await import()` no afecta el rendimiento del cliente y permite una carga perezosa de los módulos de infraestructura.
4. **Facilidad de Mocking**: Para realizar tests de integración o E2E, basta con cambiar el path en un archivo `.env.test`, permitiendo que la aplicación use una base de datos en memoria o ficheros JSON sin modificar una sola línea de código fuente.

### Consideraciones Técnicas
- **Tipado**: Para mantener la seguridad de tipos, el resultado del `import()` dinámico debe ser casteado a la interfaz de dominio correspondiente.
- **Asincronía**: Los métodos de la `Factory` pasan a ser `async`, lo cual es natural en el ecosistema de Next.js Server Components.
- **Bundling**: En entornos de compilación estricta, es necesario asegurar que el bundler tenga acceso a las posibles rutas o utilizar un mapeo de claves si la ruta dinámica absoluta presenta problemas de resolución.

## Ejemplo de Implementación Futura
```typescript
static async getQuizzesRepository(): Promise<QuizzesRepository> {
  const path = process.env.QUIZ_REPO_PATH;
  const module = await import(`${path}`);
  const Implementation = module.QuizzesDataSource;
  return new Implementation() as QuizzesRepository;
}
```
