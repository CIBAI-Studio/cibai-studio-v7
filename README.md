# CIBAI Studio v7 — Web Corporativa

Nueva versión (v7) del sitio web corporativo de CIBAI Studio. Basado en la arquitectura técnica de v6, con una **nueva estructura de contenido** y **copy neuromarketing-optimizado**.

- Arquitectura de servicios agrupada en **6 categorías**: Inteligencia Artificial, Diseño Web, Programación a Medida (SaaSw), Automatización de Procesos, Neuromarketing & Copy de Ventas, y Digital Business Growth.
- Copy más corto, directo y disruptivo (el cliente ve *qué hacemos*, no *cómo* lo hacemos).
- Los slides del Hero se reutilizan tal cual desde v6 (ya son correctos).

## Stack

- **Astro 6** — SSR con adaptador Node.js
- **Tailwind CSS v4** — Utility-first CSS vía Vite plugin
- **TypeScript** — Strict mode
- **@astrojs/sitemap** — Sitemap SEO
- **i18n** — ES (por defecto) + CA

## Estructura

```
src/
  components/        Componentes reutilizables (Hero, secciones, UI)
  i18n/              Traducciones ES/CA y utilidades de idioma
  layouts/           Layouts públicos y de admin
  lib/               Utilidades, auth, settings, translations
  pages/             Rutas (ES raíz, CA bajo /ca)
  styles/            CSS global (theme, animaciones)
public/              Assets estáticos (imágenes, fuentes)
docs/                Documentación del proyecto (copy, briefings, etc.)
```

La carpeta `docs/` recibirá los entregables de ContentStrat, Neuromarketing y SEO antes de aplicarse al código.

## Setup local

```bash
npm install
npm run dev       # Dev server en localhost:4321
npm run build     # Build SSR
npm run preview   # Preview local
```

## Convenciones de ramas

- `main`: producción (protegida, requiere PR aprobado por QA + CTO)
- `develop`: integración
- `feature/*`: trabajo en curso

## Contacto

- Web: [cibai.studio](https://cibai.studio)
- Email: hola@cibai.studio
- Ubicación: Barcelona, España
