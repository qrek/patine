# Patine — Site vitrine + Backoffice

Site web vitrine de l'atelier d'encadrement artisanal Patine (Paris).
Stack : **Next.js 14 (App Router)** · **Tailwind CSS** · **next-auth** · **Vercel KV**

---

## Démarrage en développement

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier de variables d'environnement
cp .env.local.example .env.local
# → Remplissez .env.local avec vos valeurs

# 3. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

### Variables `.env.local` à renseigner

| Variable | Description |
|---|---|
| `ADMIN_EMAIL` | Email de l'administrateur du backoffice |
| `ADMIN_PASSWORD` | Mot de passe du backoffice |
| `NEXTAUTH_SECRET` | Clé secrète aléatoire (générez avec `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `http://localhost:3000` en dev, URL Vercel en prod |
| `RESEND_API_KEY` | *(Optionnel)* Clé API Resend pour l'envoi d'emails |
| `CONTACT_EMAIL` | Email de réception des messages du formulaire |

---

## ⚠️ Point critique : Filesystem éphémère sur Vercel

**En production sur Vercel, les fichiers écrits dans `/content/*.json` ne persistent pas.** Le filesystem est réinitialisé à chaque déploiement. Les modifications du backoffice seraient perdues.

### Solution recommandée : Vercel KV (Redis managé, gratuit)

Le code est **déjà prêt** pour Vercel KV. Il suffit d'activer le service :

1. Dans votre [dashboard Vercel](https://vercel.com), allez dans votre projet → **Storage** → **Create Database** → choisissez **KV**
2. Donnez-lui un nom (ex. `patine-kv`), créez-le
3. Dans l'onglet **Connect to Project**, sélectionnez votre projet → Vercel ajoute automatiquement les variables d'environnement `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`
4. Redéployez le projet

**C'est tout.** Les contenus du backoffice seront stockés dans KV et persisteront entre les déploiements.

> **Première utilisation :** Après activation de KV, renseignez le contenu depuis le backoffice (`/admin`) — les données des fichiers JSON locaux ne sont pas migrées automatiquement vers KV en production.

---

## Déploiement sur Vercel + GitHub

### Étape 1 — Créer le dépôt GitHub

```bash
git init
git add .
git commit -m "Initial commit — Patine"
# Créez un repo sur github.com, puis :
git remote add origin https://github.com/VOTRE_COMPTE/patine.git
git push -u origin main
```

### Étape 2 — Connecter à Vercel

1. Rendez-vous sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importez votre repo GitHub `patine`
3. Vercel détecte Next.js automatiquement — pas de configuration nécessaire
4. Dans **Environment Variables**, ajoutez :
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_SECRET` (générez avec `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://votre-projet.vercel.app`
   - `RESEND_API_KEY` (si vous utilisez Resend)
   - `CONTACT_EMAIL`
5. Cliquez **Deploy**

### Déploiement continu

À chaque `git push` sur la branche `main`, Vercel redéploie automatiquement le site.

```bash
# Workflow quotidien
git add .
git commit -m "Mise à jour contenu"
git push
# → Vercel redéploie en ~30 secondes
```

---

## Domaine personnalisé (Amen.fr)

### Dans Vercel

1. Projet → **Settings** → **Domains** → **Add Domain**
2. Entrez votre domaine (ex. `patine.fr`)
3. Vercel vous donne une valeur CNAME : `cname.vercel-dns.com`

### Dans le dashboard Amen.fr

1. Connectez-vous → **Mes Domaines** → sélectionnez `patine.fr`
2. **DNS / Gestion des enregistrements**
3. Ajoutez un enregistrement :
   - **Type** : `CNAME`
   - **Nom/Hôte** : `www` (pour `www.patine.fr`) — ou `@` pour l'apex
   - **Valeur** : `cname.vercel-dns.com`
   - **TTL** : 3600

> **Note :** Pour un domaine apex (`patine.fr` sans www), certains registraires ne supportent pas les CNAME sur `@`. Dans ce cas, utilisez les **A records** Vercel : `76.76.21.21`.

4. Retournez dans Vercel → le domaine passera en vert une fois la propagation DNS effectuée (24–48h)
5. Mettez à jour `NEXTAUTH_URL` = `https://patine.fr` dans les variables d'environnement Vercel et redéployez

---

## Structure du projet

```
patine/
├── app/
│   ├── (public)/               Pages publiques
│   │   ├── page.tsx            → /
│   │   ├── savoir-faire/
│   │   ├── realisations/
│   │   └── contact/
│   ├── admin/                  Backoffice (protégé par next-auth)
│   │   ├── login/
│   │   ├── accueil/
│   │   ├── savoir-faire/
│   │   ├── realisations/
│   │   └── parametres/
│   └── api/
│       ├── auth/[...nextauth]/ Auth next-auth
│       ├── admin/get/          Lecture contenu
│       ├── admin/save/         Écriture contenu
│       ├── upload/             Upload images
│       └── contact/            Formulaire de contact
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   └── Lightbox.tsx
├── content/                    Fichiers JSON (développement)
│   ├── home.json
│   ├── savoir-faire.json
│   ├── realisations.json
│   └── settings.json
├── lib/
│   ├── content.ts              Abstraction lecture/écriture (local ↔ KV)
│   └── auth.ts                 Config next-auth
└── public/
    └── images/                 Images uploadées
```

---

## Backoffice

Accessible à `/admin/login` avec les identifiants définis dans `.env.local`.

| Section | URL | Contenu géré |
|---|---|---|
| Dashboard | `/admin` | Vue d'ensemble |
| Accueil | `/admin/accueil` | Hero, titre, intro |
| Savoir-faire | `/admin/savoir-faire` | 3 sections + photos |
| Réalisations | `/admin/realisations` | Galerie photos, légendes, ordre |
| Paramètres | `/admin/parametres` | Adresse, email, tél, Instagram |

---

## Technologies

- [Next.js 14](https://nextjs.org) — App Router, Server Components
- [Tailwind CSS](https://tailwindcss.com) — Styles utilitaires
- [next-auth](https://next-auth.js.org) — Authentification
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv) — Stockage persistant en production
- [Resend](https://resend.com) — Envoi d'emails (optionnel)
- Polices : [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [Jost](https://fonts.google.com/specimen/Jost) via Google Fonts
