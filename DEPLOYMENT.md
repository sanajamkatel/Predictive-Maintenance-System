# 🚀 Deployment Guide - Predictive Maintenance System

## 📋 Overview
This guide will help you deploy your Predictive Maintenance System to:
- **Frontend**: GitHub Pages (free)
- **Backend**: Railway (free tier)

## 🎯 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your repository

### 1.2 Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `Predictive-Maintenance-System` repository
3. Choose the `backend` folder as root directory
4. Railway will automatically detect it's a Python app

### 1.3 Configure Environment
Railway will automatically:
- Install dependencies from `requirements.txt`
- Run `python api.py`

### 1.4 Get Your Railway URL
After deployment, Railway will give you a URL like:
```
https://predictive-maintenance-production-xxxx.up.railway.app
```

## 🎯 Step 2: Update Frontend API Configuration

### 2.1 Update API URL
Edit `frontend/src/services/api.js` and replace:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-app.railway.app/api'  // Replace with your Railway URL
  : 'http://localhost:5002/api';
```

Replace `your-backend-app.railway.app` with your actual Railway URL.

### 2.2 Update Homepage URL
Edit `frontend/package.json` and replace:
```json
"homepage": "https://yourusername.github.io/Predictive-Maintenance-System"
```

Replace `yourusername` with your actual GitHub username.

## 🎯 Step 3: Deploy Frontend to GitHub Pages

### 3.1 Install GitHub Pages
```bash
cd frontend
npm install --save-dev gh-pages
```

### 3.2 Deploy
```bash
npm run deploy
```

This will:
- Build your React app
- Create a `gh-pages` branch
- Deploy to GitHub Pages

### 3.3 Enable GitHub Pages
1. Go to your GitHub repository
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages`
5. Save

## 🎯 Step 4: Access Your Live Website

Your website will be available at:
```
https://yourusername.github.io/Predictive-Maintenance-System
```

## 🔄 How It Works

1. **User visits** your GitHub Pages URL
2. **React app loads** from GitHub Pages
3. **API calls** are made to your Railway backend
4. **Real-time data** flows between frontend and backend

## 🛠️ Troubleshooting

### Backend Issues
- Check Railway logs for errors
- Ensure all dependencies are in `requirements.txt`
- Verify the API is running on Railway

### Frontend Issues
- Check browser console for API errors
- Verify the Railway URL is correct in `api.js`
- Ensure GitHub Pages is enabled

## 📊 Expected Results

After deployment, you should see:
- ✅ **Frontend**: Beautiful React dashboard on GitHub Pages
- ✅ **Backend**: Flask API serving real-time data from Railway
- ✅ **Integration**: Complete working predictive maintenance system
- ✅ **Data**: Real NASA engine data with 70% healthy, 18% warning, 12% critical engines

## 🎉 Success!

Your Predictive Maintenance System is now live on the internet! 🚀
