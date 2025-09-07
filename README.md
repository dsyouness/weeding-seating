# wedding-seating

## Prérequis
- Node.js LTS (installé via nvm)

## Démarrage

### Backend (Express)
```bash
cd server
npm install
npm run dev
```

Le backend lit `data/guests.csv` et expose:
- `GET /api/guests`
- `GET /api/guests/search?q=...`

### Frontend (Vite React + Tailwind)
```bash
cd client/frontend
npm install
npm run dev
```

Un proxy Vite redirige `/api` vers `http://localhost:5174`.

### Vidéo de célébration
Placez un fichier `celebration.mp4` dans `client/frontend/public/`.
