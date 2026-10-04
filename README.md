# NADIA TIFAWT — Miel · Cosmétiques · Naturel

Boutique e-commerce de luxe (Next.js 14 App Router · Tailwind CSS · MongoDB/Mongoose · Framer Motion).

## Démarrage rapide

```bash
npm install
npm run dev                    # http://localhost:3000
```

Pour la version production : `npm start` (compile automatiquement puis démarre).

**Admin :** http://localhost:3000/admin, mot de passe **`Tifawt-Miel-2026!`**
(défini dans `.env.local` → `ADMIN_PASSWORD`). Changez-le avant la mise en ligne.

> **Sans MongoDB**, le site tourne immédiatement en **mode démo** : produits, prix, commandes, avis et réglages
> sont sauvegardés dans `data/demo-store.json`, les photos dans `data/uploads/` — **copiez le dossier `data` quand vous changez de version du projet**.
> **Avec MongoDB** : renseignez `MONGODB_URI`, puis `npm run seed` pour importer le catalogue.

## Mobile, tablette, ordinateur

Le site s’adapte à tous les écrans (testé à 360, 390, 768, 1024 et 1440 px, en français et en arabe, sans défilement horizontal) :
menu hamburger jusqu’à 1280 px, cartes produits compactes en 2 colonnes, barre « Ajouter au panier » collante sur mobile,
boutons d’au moins 44–48 px pour le tactile, champs en 16 px (pas de zoom automatique sur iPhone). L’admin passe en cartes sur téléphone.

## Langues

Le site est disponible en **français, arabe (RTL) et anglais**. Sélecteur FR · ع · EN en haut de page
(et dans le menu mobile) ; le choix est mémorisé. Liens directs : `/?lang=ar`, `/?lang=en`, `/?lang=fr`.
Sans choix, la langue du navigateur est utilisée.

- Textes de l’interface : `lib/i18n/dictionaries.js`
- Traductions des produits : `lib/catalog.js` (`PRODUCT_I18N`) ou dans l’admin → produit → « Traduction »
- L’administration reste en français.

## Pages

| URL | Description |
|---|---|
| `/` | Accueil : hero médaillon amazigh, best-sellers, univers, « De l’Atlas à votre peau », avis, Instagram |
| `/boutique` | Catégories Miel Pur / Amlou / Cosmétiques, recherche, filtre prix, tri |
| `/produit/[slug]` | Galerie + zoom, quantité, panier, WhatsApp, bénéfices, onglets Description / Ingrédients / Avis, JSON-LD |
| `/panier`, `/checkout` | Panier (Context + localStorage), livraison Oujda / Agadir / Maroc, COD, Wafacash, MoPay, CMI |
| `/commande/[ref]` | Confirmation de commande |
| `/admin` | Tableau de bord, commandes (statuts, paiement, WhatsApp client) |
| `/admin/produits` | Prix et prix barrés modifiables directement dans le tableau, ajustement en masse (±%), stock, CRUD |
| Photos produits | Admin → produit → « Choisir des photos » (PC, glisser-déposer) ou « Prendre une photo » (téléphone). Réduites automatiquement à 1600 px. Stockées dans `data/uploads`. |
| `/admin/avis` | Modération des avis : publier, refuser, mettre en avant sur l’accueil, modifier, répondre, supprimer, ajouter |
| `/admin/parametres` | Attestation ONSSA : numéro, titulaire, activité, date, téléversement du scan (PDF/photo) |
| `/mentions-legales` | Mentions légales : ICE, IF, TP, N° auto-entrepreneur, contact, données personnelles (loi 09-08) |
| `/qualite` | Page publique « Qualité & sécurité sanitaire » avec l’attestation (visible une fois activée) |

## Structure

```
app/
  (site)/            vitrine (header sticky, footer, tiroir panier, bouton WhatsApp)
  admin/             login + (panel) dashboard / commandes / produits
  api/               products, orders, admin/*, payments/{mopay,cmi}/callback
components/          home/ shop/ product/ checkout/ layout/ admin/ ui/
context/CartContext  panier global persistant
lib/                 catalog (seed), data (Mongo ⇄ mémoire), payments, auth, utils
models/              Product, Order, User (Mongoose)
middleware.js        protège /admin et /api/admin (cookie HMAC signé)
```

## Paiements

- **Paiement à la livraison** : actif.
- **Wafacash** : actif (instructions envoyées par WhatsApp, voir page confirmation).
- **MoPay** : renseignez `MOPAY_API_KEY`, `MOPAY_MERCHANT_ID`, `MOPAY_API_URL` puis adaptez `createMoPayPayment()` dans `lib/payments/index.js` au contrat d’API fourni par MoPay. L’option s’active automatiquement au checkout.
- **CMI** : renseignez `CMI_CLIENT_ID`, `CMI_STORE_KEY`, `CMI_GATEWAY_URL`. Le formulaire 3D Secure (hash SHA-512 ver3) et le callback sont prêts.

## Charte

| Rôle | Couleur |
|---|---|
| Vert forêt (fond) | `#12291B` / `#1A3C26` |
| Or luxe | `#C5A059` / `#D4AF37` / `#B8922E` |
| Crème | `#F5F1E8` |
| Terracotta (badges) | `#8B1E1E` |

Polices auto-hébergées (Fontsource) : Cormorant Garamond (titres), Montserrat (texte), Amiri (arabe).
Le symbole ⵣ est dessiné en SVG (`components/ui/Yaz.js`) pour un rendu identique partout.

## À remplacer avant la mise en ligne

- **Visuels produits** : les visuels JPG de `public/images/products/` sont des rendus de démo —
  remplacez-les par de vraies photos (mêmes noms, ou via l’admin → champ Images).
- **Avis** : le site ne crée plus aucun avis d’exemple. Si une ancienne base en contient, un bouton « Supprimer les avis d’exemple » apparaît dans `/admin/avis`. Les clients peuvent joindre des photos et leur n° de commande (badge « Achat vérifié »).
- **ONSSA** : saisissez dans `/admin/parametres` le numéro de l’attestation délivrée à VOTRE établissement, puis activez le badge.
- **Prix, stocks, textes produits** : à valider avec la marque.
- **Instagram** : `NEXT_PUBLIC_INSTAGRAM` + éventuellement brancher l’API Instagram dans `components/home/InstagramFeed.js`.
- **E-mail** `contact@nadiatifawt.ma` et `NEXT_PUBLIC_SITE_URL`.

Régénérer les visuels (optionnel, `npm i -D playwright` puis `npx playwright install chromium`) :
`node scripts/art/render-products.mjs` (produits) et `node scripts/art/render-logo.mjs` (emblème anime + favicons).

## Déploiement

Vercel (recommandé) ou tout hébergeur Node 18+ : `npm run build && npm start`.
Base de données : MongoDB Atlas (offre gratuite suffisante pour démarrer).
