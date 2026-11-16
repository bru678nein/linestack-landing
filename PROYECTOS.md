# Cómo agregar un proyecto al portfolio

Los proyectos que aparecen en la sección **Proyectos** de la landing salen de un solo archivo:
[`data/projects.ts`](data/projects.ts). Para sumar uno hay que hacer 3 cosas: preparar las capturas,
agregar la ficha y revisar cómo queda.

## 1. Capturas

Creá una carpeta con el nombre corto del proyecto (sin espacios ni tildes) dentro de `public/projects/`:

```
public/projects/mi-proyecto/
  1.webp   ← portada (la que se ve en la tarjeta)
  2.webp
  3.webp
```

| Tipo de proyecto | Qué capturas | Tamaño recomendado |
|---|---|---|
| **Web / Sistemas** | De la compu, de la parte más vistosa (arriba de todo suele ser lo mejor) | 1600 × 1000 px |
| **Mobile (app)** | Pantallas del celular, verticales. Las 3 primeras se muestran en marcos de teléfono | 1080 × 2340 px |

- Formato **.webp** o **.jpg** (no .png enormes). Cada captura debería pesar menos de 300 KB.
  Para convertir/comprimir: [squoosh.app](https://squoosh.app).
- Nada de datos reales de clientes o usuarios en las capturas (nombres, emails, teléfonos): usá datos de prueba.

## 2. Ficha

Copiá este bloque dentro de la lista `projects` en `data/projects.ts`, en la posición donde querés
que aparezca (el orden de la lista es el orden en la página):

```ts
{
  slug: "mi-proyecto",                // igual que el nombre de la carpeta de capturas
  title: "Nombre del proyecto",
  client: "Para quién fue",           // ej: "Estudio contable" o "Proyecto propio"
  category: "Web",                    // "Web", "Mobile" o "Sistemas"
  summary: "Qué es, en una oración.",
  problem: "Qué problema tenía el cliente o qué faltaba.",
  solution: "Qué hicimos y las funciones principales.",
  results: ["Resultado real 1", "Resultado real 2", "Resultado real 3"],
  tags: ["Next.js", "Supabase"],      // tecnologías principales (2 a 4)
  accent: ["#38bdf8", "#6366f1"],     // dos colores de la marca del proyecto (fondo de la tarjeta)
  images: [
    "/projects/mi-proyecto/1.webp",
    "/projects/mi-proyecto/2.webp",
  ],
  url: "https://...",                 // opcional: web publicada o link a la tienda de apps
},
```

Reglas para los textos:
- **Resultados solo reales.** Si no hay números, valen hechos concretos: "Publicada en Play Store",
  "El cliente gestiona sus turnos sin ayuda", "Más de 200 usuarios registrados".
- Frases cortas: el resumen se lee en la tarjeta, el problema/solución en el detalle.

## 3. Revisar y subir

```bash
npm run dev
```

Abrí http://localhost:3000/#proyectos y revisá:
- la tarjeta (en compu y achicando la ventana al ancho de un celular),
- el detalle que se abre al hacer clic (textos, capturas y link).

Después subí el cambio en una rama propia y abrí un pull request:

```bash
git checkout -b proyecto-mi-proyecto
git add data/projects.ts public/projects/mi-proyecto
git commit -m "Agregar proyecto Mi Proyecto"
git push -u origin proyecto-mi-proyecto
```

> El diseño se acomoda solo a la cantidad de proyectos: alterna tarjetas grandes y medianas.
> No hace falta tocar ningún componente.
