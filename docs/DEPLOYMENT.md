# Deployment Guide

## 🚀 Production Deployment Options

### Quick Comparison

| Platform | Difficulty | Cost | Scalability | Best For |
|----------|-----------|------|-------------|----------|
| **Render** | ⭐ Easy | Free-$7/mo | Medium | Beginners, small projects |
| **Railway** | ⭐⭐ Easy | $5-50/mo | Medium | Good free tier |
| **Heroku** | ⭐⭐ Easy | $7-50/mo | Medium | Legacy, not recommended |
| **AWS** | ⭐⭐⭐ Hard | $0-100+/mo | High | Enterprise |
| **DigitalOcean** | ⭐⭐ Medium | $4-24/mo | Medium-High | Developers |

---

## 📦 Option 1: Render (Recommended for Beginners)

### Total Cost: FREE to $7/month

### Prerequisites
- GitHub account with repository
- Render account (render.com)
- MongoDB Atlas account (free tier)

### Step 1: Prepare Repository

```bash
# Create GitHub repo structure
smart-agriculture-monitoring/
├── backend/          # Backend code
├── frontend/         # Frontend code
├── simulator/        # Simulator (optional for deployment)
└── docs/

# Push to GitHub
git add .
git commit -m "Initial commit: Smart Agriculture System"
git push origin main
```

### Step 2: Deploy Backend

1. **Create Render account** → render.com
2. **Create New "Web Service"**
   - Connect GitHub
   - Select repository
   - Select branch: `main`
   - Root directory: `backend`

3. **Configure Build Settings**
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `node src/index.js`

4. **Add Environment Variables**
   - `MONGODB_URI`: (MongoDB Atlas connection string)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
   - `PORT`: `5000`

5. **Deploy** → Click "Create Web Service"
   - Wait 3-5 minutes
   - You get URL like: `https://smart-agriculture-api.onrender.com`

### Step 3: Deploy Frontend

1. **Create Vercel account** → vercel.com
2. **Import Project**
   - Select GitHub repo
   - Select root directory: `frontend`

3. **Configure Build Settings**
   - Framework: `Create React App`
   - Build command: `npm run build`
   - Output: `build`

4. **Add Environment Variables**
   - `REACT_APP_API_URL`: `https://smart-agriculture-api.onrender.com/api`

5. **Deploy** → Click "Deploy"
   - You get URL like: `https://smart-agriculture.vercel.app`

### Step 4: Setup MongoDB Atlas

1. Go to mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user
4. Get connection string
5. Update Render backend environment variable

### Step 5: Update Backend FRONTEND_URL

1. Go to Render dashboard
2. Select backend service
3. Go to Settings → Environment
4. Update `FRONTEND_URL` to your Vercel URL
5. Service auto-redeploys

### Access Your System
- **Dashboard**: https://your-app.vercel.app
- **API**: https://your-api.onrender.com/api/health
- **Backend Logs**: View in Render dashboard

---

## 🌍 Option 2: AWS Deployment (Enterprise)

### Architecture
```
AWS CloudFront (CDN)
    ↓
AWS S3 (Frontend static files)
    ↓
AWS Route 53 (Domain)
    ↓
AWS ALB (Load Balancer)
    ↓
AWS EC2 (Backend Node.js)
    ↓
AWS RDS or MongoDB Atlas (Database)
```

### Step 1: Frontend - S3 + CloudFront

#### Build Frontend
```bash
cd frontend
npm run build
# Creates `build/` folder
```

#### Create S3 Bucket
1. AWS Console → S3
2. Create bucket: `smart-agriculture-frontend`
3. Upload `build/` contents
4. Enable Static Website Hosting
5. Set index.html as default

#### Create CloudFront Distribution
1. CloudFront → Create Distribution
2. Origin: S3 bucket
3. Default root: `index.html`
4. Caching policy: 24 hours for HTML, 1 year for assets

**Result:** https://your-distribution.cloudfront.net

### Step 2: Backend - EC2

#### Launch EC2 Instance
1. EC2 Dashboard → Launch Instance
2. AMI: `Ubuntu 22.04 LTS`
3. Instance type: `t3.small` (1GB RAM, $0.0208/hour)
4. Storage: 20GB
5. Security group: Allow ports 22, 80, 443, 5000

#### Setup Backend

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd smart-agriculture-monitoring/backend

# Create .env
nano .env
# Add: MONGODB_URI, PORT=5000, FRONTEND_URL, etc.

# Install dependencies
npm install

# Start with PM2
pm2 start src/index.js --name "agriculture-api"
pm2 startup
pm2 save

# Setup reverse proxy (Nginx)
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/default
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-api-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Certificate (Free with Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-api-domain.com
```

### Step 3: Database - MongoDB Atlas

1. Create cluster (M0 free or M10 production)
2. Get connection string
3. Add to backend `.env`

### Estimated AWS Monthly Cost
- EC2 t3.small: ~$15
- Data transfer: ~$5-10
- DNS/Other: ~$1-2
- **Total: ~$20-30/month**

---

## 🚂 Option 3: Railway (Balanced)

### Cost: Starting at $5/month (very generous free tier)

### Step 1: Connect GitHub
1. Go to railway.app
2. Sign up
3. Connect GitHub account

### Step 2: Create Backend Service
1. New Project
2. Deploy from GitHub
3. Select backend folder
4. Add variables:
   - `MONGODB_URI`
   - `NODE_ENV=production`

### Step 3: Create MongoDB Service
1. Add Service → Database → MongoDB
2. Auto-configures connection

### Step 4: Deploy Frontend
1. Use Vercel (same as Render option)
2. Set `REACT_APP_API_URL` to Railway backend URL

---

## 🐳 Option 4: Docker + Any VPS

### Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy source
COPY backend/src ./src

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "src/index.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: smart-agriculture

  backend:
    build:
      context: .
      dockerfile: backend.Dockerfile
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: "mongodb://mongodb:27017/smart-agriculture"
      NODE_ENV: "production"
    depends_on:
      - mongodb

  frontend:
    build:
      context: .
      dockerfile: frontend.Dockerfile
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: "http://localhost:5000/api"

volumes:
  mongo_data:
```

### Deploy to VPS
```bash
# SSH to VPS
ssh root@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Clone repo and deploy
git clone your-repo
cd smart-agriculture-monitoring
docker-compose up -d

# Access: http://your-vps-ip:3000
```

---

## 🔒 Production Security Checklist

- [ ] **HTTPS/SSL enabled** everywhere
- [ ] **Environment variables** not in code (use `.env` with `.gitignore`)
- [ ] **MongoDB credentials** secured
- [ ] **CORS** configured for production domain
- [ ] **RATE LIMITING** on backend (prevent abuse)
- [ ] **Input validation** on all API endpoints
- [ ] **Error logging** without exposing sensitive data
- [ ] **Database backups** automated
- [ ] **Monitoring** setup (errors, uptime)
- [ ] **API authentication** (JWT for future users)

### Add Rate Limiting

```javascript
// backend/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests',
});

// In index.js:
app.use(limiter);
```

---

## 📊 Monitoring Setup

### Render: Built-in monitoring
- View logs in dashboard
- Email alerts for errors
- Performance metrics

### AWS: CloudWatch
```bash
# View logs
aws logs tail /aws/ec2/agriculture-api --follow
```

### Datadog (Free for monitoring)
1. Create Datadog account
2. Install agent on EC2
3. Get real-time metrics

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

---

## 💰 Cost Estimates (Annual)

| Option | Free Tier | Small Scale | Production |
|--------|-----------|------------|-----------|
| Render | Yes | $60-100/yr | $200-500/yr |
| Railway | Generous | $60-100/yr | $200-500/yr |
| AWS | Yes (1 year) | $200-300/yr | $500-2000/yr |
| DigitalOcean | No | $60/yr | $200-600/yr |

---

## ✅ Verification After Deployment

```bash
# Test API health
curl https://your-api-domain.com/api/health

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" https://your-api-domain.com/api/health

# Check API response times
curl -I https://your-api-domain.com/api/health

# Monitor logs
# Render: Dashboard → Logs
# AWS: CloudWatch console
# Railway: Service → Logs
```

---

## 🆘 Troubleshooting Deployment

### Issue: "Build failed"
- Check Node version compatibility
- Run `npm install` locally to verify
- View build logs in deployment platform

### Issue: "Cannot connect to MongoDB"
- Verify MongoDB URI is correct
- Check IP whitelist (for Atlas)
- Ensure Atlas cluster is running

### Issue: "CORS errors"
- Verify `FRONTEND_URL` env var matches deployed frontend URL
- Check backend is allowing requests from frontend origin

### Issue: "Application crashes"
- View logs in dashboard
- Check environment variables are set
- Verify MongoDB connection
- Run locally first to debug

---

## 🎓 Learning Resources

- Render Docs: https://render.com/docs
- AWS Deployment: https://docs.aws.amazon.com/
- Docker: https://docs.docker.com/
- GitHub Actions: https://docs.github.com/en/actions

---

**Happy Deploying! 🚀**
