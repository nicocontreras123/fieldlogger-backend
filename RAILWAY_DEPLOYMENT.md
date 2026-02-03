# Railway Deployment Guide - Backend

## 🚂 Deploying to Railway

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Backend code pushed to GitHub repository

### Step 1: Create PostgreSQL Database

1. Go to Railway dashboard
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Railway will create a PostgreSQL database and provide connection details

### Step 2: Deploy Backend

1. In the same project, click **"New Service"**
2. Select **"GitHub Repo"**
3. Choose your repository and select the `backend` folder
4. Railway will auto-detect the NestJS app

### Step 3: Configure Environment Variables

In the backend service settings, add these variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=3000
```

**Important**: Railway automatically provides `Postgres.DATABASE_URL` when you link the PostgreSQL service.

### Step 4: Run Database Migration

After first deployment, go to the backend service and run:

```bash
npm run db:push
```

Or add a deploy script in `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run db:push && npm run start:prod"
  }
}
```

### Step 5: Configure CORS

The backend is already configured to accept requests from the frontend. Once deployed, update the CORS origins in `main.ts` if needed:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.railway.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

## 🔧 Railway Configuration

The `railway.json` file is already configured:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 📊 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway auto-assigns) | `3000` |

## 🔍 Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure PostgreSQL service is linked and `DATABASE_URL` is set correctly.

### Build Fails
```
Error: Cannot find module '@nestjs/core'
```
**Solution**: Railway should run `npm install` automatically. Check build logs.

### Migration Not Applied
```
Error: relation "inspections" does not exist
```
**Solution**: Run `npm run db:push` manually in Railway's service terminal.

## 🚀 Automatic Deployments

Railway automatically deploys when you push to your GitHub repository's main branch.

To deploy from a different branch:
1. Go to service settings
2. Change **"Production Branch"** to your desired branch

## 💡 Pro Tips

1. **Use Railway's CLI** for faster deployments:
   ```bash
   npm i -g @railway/cli
   railway login
   railway up
   ```

2. **Monitor logs in real-time**:
   ```bash
   railway logs
   ```

3. **Connect to production database**:
   ```bash
   railway connect postgres
   ```

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app)
- [Railway PostgreSQL Guide](https://docs.railway.app/databases/postgresql)
- [NestJS Deployment](https://docs.nestjs.com/faq/deployment)
