# Deployment Guide

This guide covers deploying the Portfolio v2 application to various platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfolio-v2)

1. **Connect to Vercel**
   - Fork this repository
   - Connect your GitHub account to Vercel
   - Import the project

2. **Environment Variables**

   ```bash
   VITE_APP_NAME=Portfolio v2
   VITE_API_BASE_URL=https://api.yourdomain.com
   # Add other production environment variables
   ```

3. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/portfolio-v2)

1. **Connect Repository**
   - Connect your GitHub account
   - Select the repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables** Add the same environment variables as above in Netlify dashboard.

### GitHub Pages

1. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source

2. **Deploy Workflow** The `.github/workflows/ci-cd.yml` already includes GitHub Pages deployment.

## 🏗️ Manual Deployment

### Prerequisites

- Node.js >= 18.0.0
- Production server with web server (nginx, Apache, etc.)

### Build Process

1. **Install dependencies**

   ```bash
   npm ci --only=production
   ```

2. **Build the application**

   ```bash
   npm run build
   ```

3. **Upload dist folder** Upload the contents of the `dist` folder to your web server.

### Server Configuration

#### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/portfolio/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/portfolio/dist

    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png|ico)$ no-gzip dont-vary
    </Location>

    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>

    # Handle client-side routing
    <Directory /var/www/portfolio/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Commands

```bash
# Build and run
docker build -t portfolio-v2 .
docker run -p 80:80 portfolio-v2

# Using docker-compose
docker-compose up -d
```

## ☁️ Cloud Platforms

### AWS S3 + CloudFront

1. **Create S3 bucket**

   ```bash
   aws s3 mb s3://your-portfolio-bucket
   ```

2. **Upload build files**

   ```bash
   npm run build
   aws s3 sync dist/ s3://your-portfolio-bucket --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error pages for SPA routing

### Google Cloud Platform

1. **Build and deploy**

   ```bash
   npm run build
   gcloud app deploy
   ```

2. **app.yaml**
   ```yaml
   runtime: nodejs18
   handlers:
     - url: /.*
       static_files: dist/index.html
       upload: dist/index.html
     - url: /(.*)
       static_files: dist/\1
       upload: dist/(.*)
   ```

### Azure Static Web Apps

1. **Create Azure Static Web App**
2. **Connect to GitHub repository**
3. **Configure build settings**:
   - App location: `/`
   - Build location: `dist`
   - Build command: `npm run build`

## 🔧 Environment Configuration

### Production Environment Variables

Create a `.env.production` file or set these in your deployment platform:

```bash
VITE_APP_NAME=Portfolio v2
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## 📊 Performance Optimization

### Pre-deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Lighthouse audit scores > 90
- [ ] All tests passing
- [ ] Security vulnerabilities addressed
- [ ] Bundle size within limits

### CDN Configuration

Configure your CDN to cache static assets:

```
Cache-Control: public, max-age=31536000, immutable
```

For HTML files:

```
Cache-Control: public, max-age=0, must-revalidate
```

## 🔍 Monitoring

### Error Tracking

Configure Sentry or similar service:

```javascript
// In production
if (!import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: 'production',
  });
}
```

### Analytics

Configure Google Analytics or similar:

```javascript
// In production
if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
  gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Blank page after deployment**
   - Check browser console for errors
   - Verify all environment variables are set
   - Ensure server is configured for SPA routing

2. **Assets not loading**
   - Check network tab for 404 errors
   - Verify build output structure
   - Check server configuration for static file serving

3. **Performance issues**
   - Run Lighthouse audit
   - Check bundle size
   - Verify CDN configuration

### Health Checks

Add a health check endpoint:

```javascript
// Add to your server or create a separate endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

## 📝 Deployment Checklist

- [ ] All tests pass
- [ ] Security audit clean
- [ ] Performance benchmarks met
- [ ] Environment variables configured
- [ ] Domain/SSL configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Rollback plan documented

## 🔄 CI/CD Pipeline

The project includes automated deployment via GitHub Actions. See `.github/workflows/ci-cd.yml` for the complete
pipeline.

### Deployment Stages

1. **Quality Assurance**: Tests, linting, security audit
2. **Build**: Create production build
3. **Deploy**: Deploy to staging/production
4. **Post-deploy**: Health checks, notifications

For questions about deployment, please refer to the [Contributing Guide](CONTRIBUTING.md) or create an issue.
