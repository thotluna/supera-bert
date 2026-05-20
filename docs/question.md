# Estándares de Calidad para Preguntas Pedagógicas (REBT)

Este documento establece las reglas estrictas para la creación y revisión de preguntas en el simulador.

## 1. Fuente de la Verdad
- **Única Fuente Autorizada:** Toda pregunta, respuesta y explicación debe estar sustentada exclusivamente en el archivo `docs/rebt_full.txt` (Reglamento Electrotécnico de Baja Tensión). 
- En caso de duda, se consultará la versión PDF oficial (9ª Edición V9.05) via browser.

## 2. Estructura y Formato
- **Formulacion de Preguntas:** Las preguntas no pueden hacer referencia a la estructura del REBT. pero se deben formular de tal manera que la respuesta sea extraida del REBT.
- **Tipos de Pregunta:** 
    - `multiple-choice`: 1 respuesta correcta.
    - `multiple-response`: varias respuestas correctas.
- **Opciones:** Siempre 4 opciones por pregunta.
- **Idioma:** Todo el contenido (pregunta y opciones) debe estar en español.
- **ID de Pregunta:** Seguir el patrón `ITC-BT-XX-YY`.

## 3. Rigor Técnico y Normativo
- **Citas Explícitas:** Las explicaciones deben destacar la ITC, el apartado o el apéndice correspondiente.
- **Prohibición de Citas Ambiguas:** No se permite usar numeraciones relativas (ej: "Apartado 3.1") sin especificar el bloque superior. Se debe usar la nomenclatura completa o descriptiva (ej: "Unidad Temática 1 de la parte Práctica para Especialistas").
- **Explicaciones Desarrolladas:** Las explicaciones no pueden ser "Correcto" o "Incorrecto". Deben desarrollar el **porqué** técnico, aportando valor pedagógico adicional.
- **Exclusividad de Citas:** Las referencias normativas (ej: Punto 5.1, ITC-BT-03, etc.) **NO** pueden aparecer ni en el enunciado de la pregunta ni en el texto de las opciones. Deben figurar única y exclusivamente en el campo `explanation`.

## Preguntas.
- ** cortas y directas**
- ** NO nombrar ITC-BT-XX-YY en la pregunta, como tampoco por numero de apartado, esquema tabla o nada referente a la estructura del REBT. las preguntas devem parecer que salen de situaciones reales  **
- ** no agregar palabras que no apaortan al contexto o la pregunta como (Caso Practico) (Ejercicio) etc.  **

## 4. Design De Opciones (Distractores)
- **Equilibrio Estructural:** No puede haber sesgo de longitud. La respuesta correcta no debe ser significativamente más larga o corta que las demás.
- **Familiaridad Técnica:** Las opciones deben tener sentido y cierta familiaridad entre ellas. 
- **Calidad del Distractor:** Las opciones incorrectas deben ser técnicamente plausibles (ej: una norma real aplicada al contexto equivocado), evitando distractores triviales o absurdos.
- ** Explicacion deben tener un contexto real y que aporte valor pedagogico, no  respuesta correcta o respuesta incorrecta. Respuesta incorrecta y correcta estan proibidas en el JSON de explicacion. y deben ir acompanadas del numero de ITC-BT-XX y apartado o articulo que le da soporte.   **`

## 5. Tono y Estilo
- **Tono Profesional:** Orientado a un examen oficial: formal, claro y preciso.
- **Clean Code en Explicaciones:** Evitar redundancias. Si la respuesta ya incluye un dato, la explicación debe aportar el contexto normativo o la razón de seguridad industrial detrás del dato.
