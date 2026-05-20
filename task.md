# supera-bert

- [x] Refactorización completa de ITC-BT-03 (Acreditaciones y competencias)
- [x] Reparación de corrupción estructural y duplicidades en itc-bt-04.json
- [x] Estandarización de Grupos Normativos (a-p) para alineación con el BOE consolidado
- [x] Validación técnica y sintáctica de datasets itc-bt-03.json e itc-bt-04.json
- [x] Auditoría técnica y corrección de competencias de categoría básica vs especialista (ITC-BT-03-37)
- [x] Saneamiento de citas normativas sobre certificación de personas (ITC-BT-03-41, punto 4.e)
- [x] Corrección de referencias cruzadas en habilidades prácticas de especialista (ITC-BT-03-42, punto 3.1)
- [x] Saneamiento integral de la Sección 5 (Habilitación) sobre plazos y efectos de la declaración responsable (Puntos 5.5 y 5.7)
- [x] Refactorización pedagógica de la identidad y habilitación empresarial (ITC-BT-03-46) bajo el nuevo protocolo docs/question.md
- [x] Finalización de auditoría ITC-BT-03: Especialidades técnicas (Rótulos - Unidad 6), Obligaciones de registro (Apartado 7) y Libre Prestación UE (Apartado 6).
- [x] Refactorización integral y auditoría pedagógica de ITC-BT-04: Transformación a escenarios situacionales, saneamiento de citas en opciones y validación técnica de umbrales (100 preguntas).
- [x] Limpieza técnica de último minuto ITC-BT-04: Sincronización final de grupos (a-n) y umbrales de potencia según la fuente de verdad (rebt_full.txt).
- [x] Auditoría de seguridad de base de datos Supabase: Identificación de vulnerabilidades RLS y propuesta de remediación SQL.
- [x] Implementación del Sistema de Reporte de Errores: Creación de componente UI, Server Actions y persistencia en Supabase.
- [x] Resolución de conflictos en Storybook: Downgrade a v8 estable y migración a framework react-vite para compatibilidad con React 19/Next 16.
- [x] Implementación de exclusión de preguntas reportadas: Descarte automático de preguntas erróneas durante la sesión del quiz sin afectar el pool original.
- [x] Sistema centralizado de pausas: Implementación de Pause Stack para gestionar visibilidad del browser, modales y feedback sin conflictos de tiempo.
- [x] Validación y testing del sistema de pausas: Creación de tests unitarios para escenarios de solapamiento y precisión del cronómetro.
- [x] Resolución de warnings de Vite: Optimización de importaciones dinámicas en el Factory para análisis estático.
- [x] Corrección de duplicados en resultados: Deduplicación de preguntas por ID en el repositorio y estabilización de keys en la UI.
- [x] Expansión y auditoría técnica de ITC-BT-05: Creación de 50 preguntas situacionales basadas en la fuente de verdad y cumplimiento de estándares pedagógicos.
- [x] Expansión técnica de REE-GENERAL: Incorporación de 16 conceptos fundamentales de luminotecnia desglosados en definiciones y unidades/especificaciones independientes (32 preguntas en total).

## Limpieza de Referencias ITC (Pedagogía Avanzada)
- [x] Eliminación de referencias "ITC-BT-XX" en `itc-bt-01.json` a `itc-bt-35.json`
- [x] Recreación integral y auditoría pedagógica de `itc-bt-34.json` a `itc-bt-38.json` (50 preguntas situacionales, tipos simple/multiple, estructura normalizada)
- [x] Recreación integral y auditoría pedagógica de `itc-bt-39.json` a `itc-bt-47.json` (50 preguntas situacionales, tipos simple/multiple, estructura normalizada)
- [x] Aplicación sistemática en el resto de datasets: `itc-bt-48.json` a `itc-bt-52.json` (REMEDIACIÓN FINALIZADA)
## Auditoría Pedagógica del Radar (Modelo de Conquista)
- [x] Refactorización del RadarChart: Implementación del modelo de Cobertura vs Maestría (Universo Dataset).
- [x] Optimización de Estadísticas: Eliminación del castigo de la media y transición al modelo de "Estado de Conocimiento" (último intento único).
- [x] Dinamización de Resultados: Zoom automático sobre temas preguntados y visibilidad de brechas de conocimiento (segmentos vacíos).

## Motor de Estadísticas y Rendimiento
- [x] Optimización del Motor de Estadísticas: Migración de agregación en memoria a función RPC de Postgres (`get_user_topic_stats`) para manejo eficiente de grandes volúmenes de datos.
- [x] Refactorización de Capas de Datos: Implementación de tipado estricto en `AnswersRepository` y eliminación de tipos `any` en la comunicación con Supabase.

## Dominio de Puntaje (Motor de Calificación)
- [x] Creación del modelo de dominio `QuizScore`: Centralización de la lógica de negocio y reglas de calificación.
- [x] Implementación de Penalización Prorrateada: Lógica de puntos parciales y penalización máxima de -0.20 por pregunta.
- [x] Unificación de Umbrales: Establecimiento del límite de aprobación en >80% de los puntos totales del quiz.
- [x] Refactorización de Servicios: Migración de `QuizService` y `StatsService` al nuevo modelo de dominio.
- [x] Sincronización de UI/Store: Actualización de `quiz-store` y componentes de resultados para reflejar las nuevas reglas de éxito.

## Optimización de Cuotas y Dataset ITC-BT-11
- [x] Reparación del Motor de Selección: Garantía de cumplimiento de cuota (50/100 preguntas) mediante priorización de pools y corrección de persistencia en `QuizService`.
- [x] Refactorización del Dominio de Puntaje: Diferenciación de penalizaciones entre preguntas 'simple' (fijo -0.20) y 'multiple' (prorrateado) para fidelidad reglamentaria.
- [x] Expansión Masiva ITC-BT-11: Creación de 100 preguntas situacionales integrando requisitos de ITC-BT-06 (Redes Aéreas) e ITC-BT-07 (Redes Subterráneas) aplicados a acometidas.
- [x] Remediación técnica y pedagógica FINAL de ITC-BT-12: Alineación estricta con los 4 esquemas de enlace y los 18 componentes normalizados de la 9ª Edición del REBT (140 preguntas: 100 simples, 40 múltiples).
- [x] Remediación técnica y pedagógica integral de ITC-BT-13: Reconstrucción total de 100 preguntas situacionales basadas exclusivamente en la fuente de verdad (rebt_full.txt), integrando esquemas de conexión y tipos de envolventes, con referencias normativas precisas y cumplimiento de docs/question.md.
- [x] Remediación técnica y pedagógica integral de ITC-BT-14: Generación de 100 preguntas (80 simples, 20 múltiples) basadas en la fuente de verdad (rebt_full.txt), enfocadas en Líneas Generales de Alimentación, requisitos de instalación en conductos (RF 120), especificaciones de cables (Cca-s1b,d1,a1) y cálculos de caída de tensión, cumpliendo estrictamente con docs/question.md.
- [x] Auditoría técnica y remediación de nomenclatura de ITC-BT-15: Saneamiento de ambigüedades entre Derivación Individual y LGA en preguntas de caída de tensión, asegurando coherencia con los porcentajes normativos (0.5%, 1%, 1.5%) y validación de 50 preguntas.
- [x] Remediación técnica y pedagógica integral de ITC-BT-16: Auditoría y expansión masiva a 110 preguntas situacionales. Actualización de normativa (UNE-EN 61.439), incorporación de requisitos para vehículos eléctricos, condiciones de locales técnicos (IP, RF, ventilación) y gestión de precintos, eliminando toda cita normativa del enunciado según docs/question.md.
- [x] Reconstrucción total de ITC-BT-17: [COMPLETADO] Reemplazo completo del dataset por 50 preguntas (47 simples, 3 múltiples) situacionales, extraídas estrictamente del texto de la ITC-BT-17 sin interpretaciones. Cobertura exhaustiva: ubicación, alturas, envolventes (IP30/IK07), inflamabilidad (650/850/960ºC), ICP (63A, precintable, modelo aprobado), IGA (omnipolar, 4500A, manual), diferenciales (selectividad 3x), cálculo Icc (0.8xU/R a 20ºC) y normas UNE de producto.
- [x] Remediación técnica y pedagógica integral de ITC-BT-18: [COMPLETADO] Reconstrucción masiva a 110 preguntas situacionales (100 simples, 10 múltiples). Foco en sistemas de puesta a tierra, electrodos (barras, mallas), equipotencialidad y dimensionamiento de conductores según resistividad del terreno, eliminando citas normativas directas.
- [x] Remediación técnica y pedagógica integral de ITC-BT-19: [COMPLETADO] Reconstrucción masiva a 110 preguntas situacionales (100 simples, 10 múltiples). Foco en prescripciones generales de instalaciones interiores, caídas de tensión, aislamiento, rigidez dieléctrica e identificación de conductores.
- [ ] Remediación técnica y pedagógica integral de ITC-BT-20
- [x] Implementación de estadísticas de tiempo: Incorporación de tiempo promedio, máximo y mínimo por pregunta en el resumen de resultados del quiz.
- [x] Implementación de visualización de preguntas omitidas: Identificación de preguntas sin responder (o reportadas) en el listado detallado de revisión y conteo total en el resumen.
