# 🍷 Berebene -- Classifica Vini 2026

Portale ufficiale della Classifica Berebene 2026 di Gambero Rosso,
sviluppato in **Nuxt 3** e distribuito su **Vercel**, con routing
avanzato, sitemap dinamica e dati caricati da JSON.\
Il sito è raggiungibile dal dominio **https://berebene.gamberorosso.it**
tramite **reverse proxy** gestito dall'IT Gambero, mentre l'applicazione
è fisicamente hostata su Vercel.

------------------------------------------------------------------------

## 🚀 Tech Stack

-   **Nuxt 3** (Vue 3 + Nitro)
-   **TypeScript**
-   **Vue Router**
-   **@nuxtjs/sitemap**
-   **@vueuse/core / @vueuse/nuxt**
-   **Iconify**
-   Hosting su **Vercel**
-   Dominio servito tramite reverse proxy del server Gambero Rosso

------------------------------------------------------------------------

## 📦 Struttura del progetto

    /
    ├─ pages/
    │  └─ classifica-vini-2026/
    │     └─ vini/
    │        ├─ index.vue
    │        ├─ [type]/index.vue
    │        └─ [type]/[slug].vue
    ├─ components/
    ├─ composables/
    ├─ data/
    ├─ nuxt.config.ts
    ├─ tsconfig.json
    ├─ app.vue
    ├─ vercel.json
    └─ package.json

------------------------------------------------------------------------

## ⚙️ Configurazione routing & Vercel

``` json
{
  "redirects": [
    { "source": "/", "destination": "/classifica-vini-2026/vini/tutti", "permanent": false },
    { "source": "/classifica-vini-2026/vini/", "destination": "/classifica-vini-2026/vini/tutti", "permanent": false }
  ]
}
```

------------------------------------------------------------------------

## 🌐 Hosting e Reverse Proxy

La build del progetto vive su Vercel.\
Il dominio produttivo è raggiunto tramite reverse proxy dal server
Gambero.

------------------------------------------------------------------------

## 📄 Configurazione Nuxt

-   metadati del sito
-   sitemap generata automaticamente
-   caricamento dati da JSON
-   moduli attivi: `@vueuse/nuxt`, `@nuxtjs/sitemap`

------------------------------------------------------------------------

## 🗺️ Sitemap XML

Generata automaticamente e disponibile su:

    https://berebene.gamberorosso.it/sitemap.xml

------------------------------------------------------------------------

## ▶️ Avvio del progetto

``` bash
npm install
npm run dev
npm run build
npm run preview
```

------------------------------------------------------------------------

## 🔧 Scripts disponibili

``` json
"scripts": {
  "build": "nuxt build",
  "dev": "nuxt dev",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "postinstall": "nuxt prepare",
  "test": "node --test"
}
```

------------------------------------------------------------------------

## 🧠 SEO & Struttura Dati

-   JSON‑LD Product / ItemList
-   date coerenti in ISO
-   OpenGraph dinamici

------------------------------------------------------------------------

## 🗂️ Gestione dei dati

`wines.json` come database locale: - categorie - premi - thumbnail -
slug
Questo database viene fornito da Gambero tramite endpoint fornito e concordato con IT.

------------------------------------------------------------------------

## 🧩 Componenti principali

-   WineList.vue\
-   WineListResult.vue\
-   WineDescriptionDetails.vue\
-   WineTechnicalDetails.vue\
-   WineRelatedWines.vue\
-   WineTypeFilters.vue\
-   WineDetailFilters.vue\
-   HeaderGeneral.vue\
-   Footer.vue

------------------------------------------------------------------------

## 📤 Deploy su Vercel

Pipeline: 1. Push su GitHub\
2. Build automatica\
3. Proxy verso dominio principale

------------------------------------------------------------------------

## 📄 License

Proprietà di **Gambero Rosso**.
