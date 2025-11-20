# 🍷 Berebene -- Classifica Vini 2026

## 📑 Indice
- [🚀 Tech Stack](#-tech-stack)
- [📦 Struttura del progetto](#-struttura-del-progetto)
- [⚙️ Configurazione routing & Vercel](#️-configurazione-routing--vercel)
- [🌐 Hosting e Reverse Proxy](#-hosting-e-reverse-proxy)
- [📄 Configurazione Nuxt](#-configurazione-nuxt)
- [📦 Configurazione dei file di progetto](#-configurazione-dei-file-di-progetto)
- [🗺️ Sitemap XML](#️-sitemap-xml)
- [▶️ Avvio del progetto](#️-avvio-del-progetto)
- [🔧 Scripts disponibili](#-scripts-disponibili)
- [🧠 SEO & Struttura Dati](#-seo--struttura-dati)
- [🗂️ Gestione dei dati](#️-gestione-dei-dati)
- [🧩 Componenti principali](#-componenti-principali)
- [🎨 Componenti UI & Layout](#-componenti-ui--layout)
- [🧾 Componenti lista & filtri vini](#-componenti-lista--filtri-vini)
- [🍷 Componenti pagina dettaglio vino](#-componenti-pagina-dettaglio-vino)
- [📚 Lib & Utils](#-lib--utils)
- [🧮 Composables](#-composables)
- [📄 License](#-license)

Piattaforma ufficiale della Classifica Berebene 2026 di Gambero Rosso, sviluppato in **Nuxt 3** e distribuito su **Vercel**, con routing avanzato, sitemap dinamica e dati caricati da JSON.\
Il sito è raggiungibile dal dominio [**https://berebene.gamberorosso.it**](https://berebene.gamberorosso.it) tramite **reverse proxy** gestito dall'IT Gambero, mentre l'applicazione è fisicamente hostata su Vercel.

---

## 🚀 Tech Stack

- **Nuxt 3** (Vue 3 + Nitro)
- **TypeScript**
- **Vue Router**
- **@nuxtjs/sitemap**
- **@vueuse/core / @vueuse/nuxt**
- **Iconify**
- Hosting su **Vercel**
- Dominio servito tramite reverse proxy del server Gambero Rosso

---

## 📦 Struttura del progetto

```
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
```

---

## ⚙️ Configurazione routing & Vercel

```json
{
  "redirects": [
    { "source": "/", "destination": "/classifica-vini-2026/vini/tutti", "permanent": false },
    { "source": "/classifica-vini-2026/vini/", "destination": "/classifica-vini-2026/vini/tutti", "permanent": false }
  ]
}
```

---

## 🌐 Hosting e Reverse Proxy

La build del progetto vive su Vercel.\
Il dominio produttivo è raggiunto tramite reverse proxy dal server Gambero.

---

## 📄 Configurazione Nuxt

## 📦 Configurazione dei file di progetto

### Data: wines.json

Parte della configurazione generale del progetto include anche la gestione del file dati **wines.json**, estratto dall’endpoint ufficiale Gambero e utilizzato come database locale all’interno dell’app Nuxt.

### package.json

Contiene gli script Nuxt e le dipendenze principali del progetto:

- **Nuxt 3**, **Vue 3**, **Vue Router**
- **@nuxtjs/sitemap** per la generazione automatica della sitemap
- **@vueuse/core** e **@vueuse/nuxt**
- **Iconify** per le icone
- **html-entities** per la decodifica sicura dei testi

Script disponibili:

- `dev`, `build`, `generate`, `preview`, `postinstall`, `test`

### tsconfig.json

File minimale che estende la configurazione generata automaticamente da Nuxt:

- eredita la configurazione TypeScript da `.nuxt/tsconfig.json`
- permette tipizzazione migliorata senza sovrascrivere le regole Nuxt

### vercel.json

Configurazione Vercel con gestione redirect:

- redirect automatico da `/` → `/classifica-vini-2026/vini/tutti`
- redirect per qualsiasi accesso a `/classifica-vini-2026/vini/`

### app.vue

File wrapper principale dell’app:

- definisce il layout generale dell'app

- include `<NuxtPage />` per il rendering delle pagine

- ospita logiche globali o wrapper per componenti comuni (es. header/footer, se presenti a livello globale)



- metadati del sito

- sitemap generata automaticamente

- caricamento dati da JSON

- moduli attivi: `@vueuse/nuxt`, `@nuxtjs/sitemap`

---

## 🗺️ Sitemap XML

La sitemap viene **generata automaticamente ad ogni commit sul branch `main`**, come parte del processo di **build su Vercel**.

L’URL ufficiale di generazione (dominio Vercel) è:

```
https://vini-gambero-rosso-2.vercel.app/sitemap.xml
```

La disponibilità della sitemap sotto il dominio produttivo Berebene è gestita dal **team IT di Gambero Rosso** tramite configurazione del reverse proxy, che inoltra la richiesta verso l'app su Vercel. 



````
## ▶️ Avvio del progetto

```bash
npm install
npm run dev
npm run build
npm run preview
````

---

## 🔧 Scripts disponibili

```json
"scripts": {
  "build": "nuxt build",
  "dev": "nuxt dev",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "postinstall": "nuxt prepare",
  "test": "node --test"
}
```

---

## 🧠 SEO & Struttura Dati

- JSON‑LD Product / ItemList
- date coerenti in ISO
- OpenGraph dinamici

---

## 🗂️ Gestione dei dati

### wines.json

`wines.json` funge da **database locale** dei vini.

- Origine: estrazione periodica dall’**endpoint ufficiale** messo a disposizione da Gambero Rosso (l’app Nuxt legge solo dal JSON locale, non chiama direttamente l’API in runtime).
- Struttura generale: array di oggetti, **un elemento per ogni vino**.
- Ogni oggetto contiene, tra gli altri, campi dedicati a:
  - identificativi e slug SEO (`id`, `slug`)
  - denominazione vino e produttore
  - categoria / tipologia (es. rosso, bianco, bollicine…)
  - informazioni geografiche (es. regione, area)
  - fascia di prezzo e/o prezzo di riferimento
  - premi e riconoscimenti (campi usati da `usePremioCleaner` e dalla UI)
  - risorse media (es. thumbnail / immagini)
  - descrizione testuale e dettagli tecnici (gradazione, vitigni, ecc.)
  - eventuali flag per sponsorizzazioni o logiche di evidenza in pagina

Questa struttura viene utilizzata dai composables (`useWines`, `useRelatedWines`, ecc.) e dai componenti di lista/dettaglio per popolare tutte le pagine della classifica.

---

## 🧩 Componenti principali

Di seguito una panoramica dei **componenti core** e del nuovo batch ricevuto, con spiegazione della funzione e delle pagine in cui vengono utilizzati.

---

## 🎨 Componenti UI & Layout

### HeaderGeneral.vue

Header principale del sito, utilizzato in tutte le pagine desktop.

- Logo Berebene
- Navigazione verso le principali sezioni della classifica
- Attivo su: **tutte le pagine desktop**

### HeaderMobile.vue

Versione mobile dell’header con menu a scomparsa.

- Hamburger menu
- Navigazione ottimizzata per mobile
- Attivo su: **tutte le pagine mobile**

### HeaderBereBene.vue

Variante dell’header brandizzata Berebene.

- Utilizzata in contesti specifici dove è richiesto branding più evidente
- Attivo su: pagine vino

### Footer.vue

Footer generale del sito.

- Contatti, copyright, link utili
- Attivo su: **tutte le pagine**

### ScrollToTopButton.vue

Bottone che appare durante lo scroll per tornare rapidamente in cima.

- Logica: visible on scroll
- Attivo su: pagine con liste lunghe (index / filtri / dettaglio)

### SocialMediaShareButtons.vue

Pulsantiera di condivisione social.

- Facebook, WhatsApp, X/Twitter, copia link
- Usata in: **pagine dettaglio vino**

### RichContent.vue

Wrapper per contenuti testuali ricchi.

- Decodifica HTML entities
- Applica formattazione sicura
- Usato per: descrizioni vino e contenuti editoriali

---

## 🧾 Componenti lista & filtri vini

Questi componenti gestiscono **filtri**, **ricerca** e **visualizzazione** dei vini nelle pagine:

- `pages/classifica-vini-2026/vini/index.vue`
- `pages/classifica-vini-2026/vini/[type]/index.vue`

### WineFiltersType.vue

Barra di filtro per la selezione della **tipologia di vino** (es. tutti, rossi, bianchi, bollicine…).

- Interagisce con la logica di `useWines` per aggiornare la lista
- Esposto in: pagina **generale** e pagina **per tipologia**

### WineTypeFilters.vue

Componente dedicato ai **filtri di tipologia** presentati come tab/chip selezionabili.

- Responsabile solo della UI e dell’emissione degli eventi di filtro
- Utilizzato come child nei template di lista vino
- Presente in: `index.vue` e `[type]/index.vue`

### WineSearchBar.vue

Barra di **ricerca testuale** dei vini.

- Permette di filtrare per nome vino, produttore o altre keyword
- Emmette eventi di input che vengono gestiti da `useWines`
- Presente in: `index.vue` e `[type]/index.vue`, integrata sopra la lista risultati

### WineList.vue

Container principale della **lista vini**.

- Richiama il composable `useWines` per ottenere i dati filtrati
- Coordina filtri, ordinamento e paginazione
- Rende al suo interno `WineListResult`
- Utilizzato sia nella pagina **/vini** che in **/vini/[type]**

### WineListResult.vue

Componente responsabile del **rendering effettivo dei risultati**.

- Mostra la lista di card vino
- Gestisce empty state (nessun vino trovato)
- Può mostrare info riepilogative su numero di risultati
- Usato come componente figlio dentro `WineList.vue`

---

## 🍷 Componenti pagina dettaglio vino

Questi componenti sono utilizzati esclusivamente nella pagina: `pages/classifica-vini-2026/vini/[type]/[slug].vue`

### WineDescriptionDetails.vue

Mostra la **descrizione estesa del vino**.

- Supporta contenuti HTML formattati tramite `RichContent`
- Include informazioni narrative, note di degustazione, contesto
- Posizionato nel blocco principale del dettaglio

### WineTechnicalDetails.vue

Sezione dedicata alle **informazioni tecniche** del vino.

- vitigno / uvaggio
- gradazione
- area geografica
- dettagli produttivi
- Presentata come tabella o lista tecnica

### WineRelatedWines.vue

Mostra un elenco di **vini correlati**, calcolati tramite `useRelatedWines`.

- Basato su tipologia, fascia di prezzo, affinità
- Inserito in fondo alla pagina dettaglio

### WineGoBackCta.vue

CTA per tornare alla lista vini.

- Mantiene il contesto della navigation history
- Posizionabile in alto o in chiusura pagina

### WineSingleSponsor.vue

Mostra un eventuale **sponsor associato al vino**.

- Banner o card sponsorizzata
- Resa condizionale: appare solo quando previsto nei dati

---

## 📚 Lib & Utils

### structuredData.ts

Genera lo **structured data JSON‑LD** per le pagine vino, includendo:

- Product
- AggregateRating
- Offer
- Winery metadata

### slugify.ts

Utility per creare **slug SEO-friendly** da stringhe:

- minuscole
- rimozione caratteri speciali
- sostituzione con `-`

### wineMenuItems.ts

Definisce le **macro‑categorie dei vini** per il menu:

- bollicine
- bianchi
- rosati
- rossi
- dolci

---

## 🧮 Composables

### useWines.ts

Gestisce il **core logico** della lista vini:

- caricamento dati da `wines.json`
- filtri per tipologia / regione / fascia di prezzo
- ordinamenti e paginazione

### useRelatedWines.ts

Espone una logica per calcolare i **vini correlati** a partire da:

- tipologia
- fascia di prezzo
- eventuale area geografica

### useHtmlEntities.ts

Utility composable per gestire le **HTML entities**:

- decodifica da testo proveniente dai dati
- sanificazione minima per l'output in pagina

### useShareLinks.ts

Genera i **link di condivisione** per social e canali esterni:

- Facebook
- X / Twitter
- WhatsApp
- copia link negli appunti

### usePremioCleaner.ts

Normalizza e pulisce le stringhe relative ai **premi**:

- rimozione rumore testuale
- alias unificati per la resa in UI

### useBreakpoints.ts

Composable reattivo per la **gestione dei breakpoint** responsive:

- mapping XS / SM / MD / LG / XL
- listener su `matchMedia`
- aiuta a gestire layout mobile/desktop nei componenti.

---



Pipeline:

1. Push su GitHub
2. Build automatica su Vercel
3. Reverse proxy configurato dal team IT verso il dominio principale

---

## 📄 License

Dalk Srl

