import wines from './data/wines.json';

type WineEntry = {
  type: string;
  slug: string;
  modified?: string;
};

const winesData = wines as WineEntry[];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '@/assets/main.css'
  ],
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
  ],
  sitemap: {
    hostname: 'https://berebene.gamberorosso.it',
    gzip: true,
    urls: () => {
      const staticUrls = ['/', '/classifica-vini-2026'].map((loc) => ({ loc }));

      const typeSet = new Set<string>();
      const wineUrls = winesData
        .filter((wine): wine is WineEntry => Boolean(wine?.type && wine?.slug))
        .map((wine) => {
          typeSet.add(wine.type);
          const url = {
            loc: `/classifica-vini-2026/vini/${wine.type}/${wine.slug}`,
            lastmod: wine.modified
          };
          return url;
        });

      const typeUrls = Array.from(typeSet).map((type) => ({
        loc: `/classifica-vini-2026/vini/${type}`
      }));

      return [...staticUrls, ...typeUrls, ...wineUrls];
    }
  },
  app: {
    head: {
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
