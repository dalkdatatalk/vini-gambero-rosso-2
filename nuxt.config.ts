import wines from './data/wines.json';

type WineEntry = {
  slug: string;
  modified?: string;
  vino_categoria?: { name: string }[];
};

const winesData = wines as WineEntry[];

function formatDateTimeForSitemap(input?: string): string | undefined {
  if (!input) return undefined;

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

// Mappa categorie → macro-type usato dalle tue pagine
const CATEGORY_TO_TYPE: Record<string, string> = {
  'bianco': 'bianchi',
  'bianco macerato/orange wine': 'bianchi',
  'bianco liquoroso': 'bianchi',

  'rosso': 'rossi',

  'spumante bianco': 'bollicine',
  'spumante rosato': 'bollicine',
  'spumante rosso': 'bollicine',
  'spumante dolce bianco': 'bollicine',

  'rose': 'rosati',

  'dolce bianco': 'vini-dolci',
  'dolce rosso': 'vini-dolci',
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://berebene.gamberorosso.it',
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
  ],

  // Dominio canonico del progetto (non il .vercel.app)
  site: {
    url: 'https://berebene.gamberorosso.it',
    name: 'Berebene – Classifica Vini 2026',
  },

  sitemap: {
    hostname: 'https://berebene.gamberorosso.it',
    // gzip: true,

    urls: () => {
      const urls: { loc: string; lastmod?: string }[] = [];

      const allModifiedDates = winesData
        .map((wine) => wine.modified)
        .filter((date): date is string => Boolean(date))
        .sort();

      const lastmodForAll = allModifiedDates.length
        ? allModifiedDates.at(-1)
        : undefined;

      const formattedLastmodForAll = formatDateTimeForSitemap(lastmodForAll);

      // 👉 Pagina statica principale: /classifica-vini-2026.html
      urls.push({
        loc: '/classifica-vini-2026.html',
        lastmod: formattedLastmodForAll ?? '2025-11-20T12:46:17Z',
      });

      // 1) Pagine statiche della piattaforma vini
      urls.push(
        { loc: '/classifica-vini-2026/vini', lastmod: formattedLastmodForAll },        // index.vue
        { loc: '/classifica-vini-2026/vini/tutti', lastmod: formattedLastmodForAll },  // vista "tutti"
      );

      const typeSet = new Set<string>();
      const typeModifiedMap = new Map<string, string[]>();

      // 2) Pagine di dettaglio vino /classifica-vini-2026/vini/[type]/[slug]
      for (const wine of winesData) {
        if (!wine?.slug) continue;

        const categoryName = wine.vino_categoria?.[0]?.name;
        if (!categoryName) continue;

        const derivedType = CATEGORY_TO_TYPE[categoryName];
        if (!derivedType) continue;

        typeSet.add(derivedType);

        if (wine.modified) {
          const arr = typeModifiedMap.get(derivedType) ?? [];
          arr.push(wine.modified);
          typeModifiedMap.set(derivedType, arr);
        }

        urls.push({
          loc: `/classifica-vini-2026/vini/${derivedType}/${wine.slug}`,
          lastmod: formatDateTimeForSitemap(wine.modified),
        });
      }

      // 3) Pagine lista per type /classifica-vini-2026/vini/[type]
      for (const type of typeSet) {
        const modifiedDatesForType = typeModifiedMap.get(type)?.sort();
        const lastmodForType = modifiedDatesForType?.length
          ? modifiedDatesForType.at(-1)
          : undefined;

        urls.push({
          loc: `/classifica-vini-2026/vini/${type}`,
          lastmod: formatDateTimeForSitemap(lastmodForType),
        });
      }

      return urls;
    },
  },

  app: {
    head: {
      link: [ {rel: 'icon', type: "image/x-icon", href: 'https://vini-gambero-rosso-2.vercel.app/favicon.ico'} ],
      meta: [
        {
          property: 'og:image',
          content: 'https://vini-gambero-rosso-2.vercel.app/og-image.png'
        },
        {
          name: 'twitter:image',
          content: 'https://vini-gambero-rosso-2.vercel.app/og-image.png'
        }
      ],
      script: [
        // --- CMP: configurazione del Default Consent Mode ---
        {
          key: 'cmp-consent-inline',
          tagPosition: 'head',
          innerHTML: `
            //<![CDATA[
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted',
                'functionality_storage': 'granted',
                'personalization_storage': 'granted',
                'security_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'wait_for_update': 1500
            });
            gtag('consent', 'default', {
                'region': ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH'],
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 1500
            });
            gtag('set', 'ads_data_redaction', true);
            gtag('set', 'url_passthrough', false);
            (function(){
                const s={adStorage:{storageName:"ad_storage",serialNumber:0},analyticsStorage:{storageName:"analytics_storage",serialNumber:1},functionalityStorage:{storageName:"functionality_storage",serialNumber:2},personalizationStorage:{storageName:"personalization_storage",serialNumber:3},securityStorage:{storageName:"security_storage",serialNumber:4},adUserData:{storageName:"ad_user_data",serialNumber:5},adPersonalization:{storageName:"ad_personalization",serialNumber:6}};
                let c=localStorage.getItem("__lxG__consent__v2");
                if(c){
                    c=JSON.parse(c);
                    if(c&&c.cls_val)c=c.cls_val;
                    if(c)c=c.split("|");
                    if(c&&c.length&&typeof c[14]!==undefined){
                        c=c[14].split("").map(e=>e-0);
                        if(c.length){
                            let t={};
                            Object.values(s).sort((e,t)=>e.serialNumber-t.serialNumber).forEach(e=>{t[e.storageName]=c[e.serialNumber]?"granted":"denied"});
                            gtag("consent","update",t);
                        }
                    }
                }
                if(Math.random() < 0.05) {
                    if (window.dataLayer && (window.dataLayer.some(e => e[0] === 'js' && e[1] instanceof Date) || window.dataLayer.some(e => e['event'] === 'gtm.js' && e['gtm.start'] == true ))) {
                        document.head.appendChild(document.createElement('img')).src = "//clickiocdn.com/utr/gtag/?sid=242589";
                    }
                }
            })();
            //]]>
          `
        },
        // --- CMP: script principale di Clickio ---
        {
          key: 'cmp-clickio',
          src: '//clickiocmp.com/t/consent_242589.js',
          async: true,
          tagPosition: 'head'
        },

        // --- Google Analytics 4 (GA4) ---
        {
          key: 'ga4-loader',
          src: 'https://www.googletagmanager.com/gtag/js?id=G-EDS3S3Z9ZL',
          async: true,
          tagPosition: 'head'
        },
        {
          key: 'ga4-inline',
          tagPosition: 'head',
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EDS3S3Z9ZL');
          `
        }
      ]
    }
  }
});
