# Instructions de déploiement pour votre site de mariage

## 🚀 Déploiement sur Vercel (Recommandé)

### Étapes :

1. **Créer un compte sur Vercel**
   - Aller sur https://vercel.com
   - Se connecter avec GitHub

2. **Pousser votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Site de mariage prêt pour déploiement"
   git branch -M main
   git remote add origin https://github.com/VOTRE-USERNAME/wedding-seating.git
   git push -u origin main
   ```

3. **Importer le projet sur Vercel**
   - Cliquer sur "New Project"
   - Sélectionner votre repo GitHub
   - Vercel détectera automatiquement la configuration

4. **Configuration des variables d'environnement**
   - Dans Vercel Dashboard → Settings → Environment Variables
   - Ajouter : `NODE_ENV=production`

### Configuration automatique ✅
- ✅ vercel.json configuré
- ✅ Package.json optimisé
- ✅ Serveur adapté pour serverless
- ✅ Frontend React optimisé

## 🔄 Alternatives gratuites

### Option 2: Netlify + Railway
1. **Frontend sur Netlify** (gratuit)
2. **Backend sur Railway** (500h/mois gratuit)

### Option 3: Render (tout-en-un)
1. Connecter GitHub à Render
2. Déployer comme "Web Service"

## 📊 Limites des plans gratuits

| Plateforme | Limite Bande Passante | Uptime | Domaine |
|------------|----------------------|--------|---------|
| Vercel     | 100GB/mois           | 99.9%  | .vercel.app |
| Netlify    | 100GB/mois           | 99.9%  | .netlify.app |
| Render     | Illimité             | Veille après 15min | .onrender.com |

## 🎯 Prochaines étapes

1. Pousser le code sur GitHub
2. Connecter à Vercel
3. Déployer en un clic !

Votre site sera accessible sur : `https://votre-projet.vercel.app`
