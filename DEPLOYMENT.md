# Deployment Instructions

## GitHub Repository Setup

### 1. Initialize Git Repository

```bash
cd C:\Users\Usuario\Documents\liñan\web-app
git init
git add .
git commit -m "Initial commit: Predictive Edge of AI in Entrepreneurship"
```

### 2. Add GitHub Remote

```bash
git remote add origin https://github.com/upocuantitativo/aibridgesGap.git
git branch -M main
```

### 3. Push to GitHub

```bash
git push -u origin main
```

You will be prompted for credentials:
- **Username**: upocuantitativo
- **Password**: 1234uiOP$

> **Note**: GitHub no longer accepts passwords for git operations. You need to create a Personal Access Token (PAT):
> 1. Go to https://github.com/settings/tokens
> 2. Click "Generate new token (classic)"
> 3. Select scopes: `repo`, `workflow`
> 4. Copy the token and use it instead of the password

### 4. Enable GitHub Pages

1. Go to https://github.com/upocuantitativo/aibridgesGap
2. Click on "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The site will be deployed automatically on every push to main

### 5. Access the Application

After deployment, the application will be available at:
**https://upocuantitativo.github.io/aibridgesGap/**

## Manual Deployment (Alternative)

If you prefer manual deployment using gh-pages:

```bash
npm install
npm run build
npm run deploy
```

## Login Credentials

**Username**: upocuantitativo
**Password**: 1234uiOP$

## Updating the Application

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

The GitHub Action will automatically build and deploy the changes.

## Troubleshooting

### Issue: Authentication failed
**Solution**: Use a Personal Access Token instead of password

### Issue: Pages not updating
**Solution**:
1. Check GitHub Actions tab for build errors
2. Clear browser cache
3. Wait 2-3 minutes for deployment to complete

### Issue: 404 error on page
**Solution**: Ensure `vite.config.js` has correct base path: `/aibridgesGap/`

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
web-app/
├── .github/workflows/     # GitHub Actions for auto-deployment
├── src/
│   ├── components/        # React components
│   ├── data/             # Variable definitions
│   ├── model/            # Neural network model
│   ├── App.jsx           # Main app
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── dist/                 # Build output (git ignored)
└── package.json          # Dependencies
```

## Support

For issues or questions, contact the research team at upocuantitativo.
