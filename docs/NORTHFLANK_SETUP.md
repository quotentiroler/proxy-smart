# Northflank Deployment Setup (Mono + Keycloak)

This guide will help you set up the Alpha environment on Northflank using the **mono architecture** (Backend + UI in one service).

## Architecture

- **Service 1:** Fullstack (Dockerfile.mono) - Backend API + UI served together on port 8445
- **Service 2:** Keycloak (Dockerfile.keycloak) - Authentication service on port 8080

This approach maximizes your free tier by combining backend and UI into a single service.

## Prerequisites

- Northflank account (free tier supports 2 services + 1 addon)
- GitHub repository with this project
- Access to GitHub repository settings (for secrets)

## Step 1: Create Northflank Project

1. Go to [Northflank Dashboard](https://app.northflank.com)
2. Create a new project named `proxy-smart` (or your preferred name)
3. Note your **Project ID** (you'll need this later)

## Step 2: Create PostgreSQL Addon

1. In your project, click **"Add Addon"**
2. Select **PostgreSQL**
3. Name it: `postgres-alpha`
4. Choose the free tier plan
5. Click **Create**
6. Wait for the database to provision

## Step 3: Create Keycloak Service

1. In your project, click **"Add Service"**
2. Select **"Combined Service"** (Build & Deploy)
3. **Source Configuration:**
   - Connect your GitHub repository
   - Select branch: `main` (or your deployment branch)
   - Build context: `/`
   - Dockerfile path: `Dockerfile.keycloak`

4. **Service Configuration:**
   - Name: `keycloak-alpha`
   - Port: `8080`
   - Protocol: HTTP

5. **Environment Variables:**
   ```
   KEYCLOAK_ADMIN=admin
   KEYCLOAK_ADMIN_PASSWORD=admin
   KC_DB=postgres
   KC_DB_URL=jdbc:postgresql://<postgres-addon-host>:<port>/<database>
   KC_DB_USERNAME=<postgres-username>
   KC_DB_PASSWORD=<postgres-password>
   KC_HOSTNAME_STRICT=false
   KC_PROXY=edge
   KC_HTTP_ENABLED=true
   ```
   
   **Note:** Get database connection details from your PostgreSQL addon in Northflank.

6. **Resources (Free Tier):**
   - CPU: 0.2 vCPU
   - Memory: 512 MB

7. Click **"Create Service"**
8. **Copy the Service ID** from the URL or service settings

## Step 4: Create Backend Service

1. In your project, click **"Add Service"**
2. Select **"Combined Service"** (Build & Deploy)
3. **Source Configuration:**
   - Connect your GitHub repository
   - Select branch: `main`
   - Build context: `/backend`
   - Dockerfile path: `backend/Dockerfile`

4. **Service Configuration:**
   - Name: `backend-alpha`
   - Port: `3000`
   - Protocol: HTTP

5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   KEYCLOAK_URL=<your-keycloak-service-url>
   KEYCLOAK_REALM=proxy-smart
   KEYCLOAK_CLIENT_ID=proxy-smart-client
   FHIR_SERVER_URL=https://hapi.fhir.org/baseR4
   DATABASE_URL=postgresql://<postgres-username>:<postgres-password>@<postgres-addon-host>:<port>/<database>
   ```
   
   **Note:** 
   - Replace `<your-keycloak-service-url>` with the public URL from your Keycloak service
   - Get database details from PostgreSQL addon

6. **Resources (Free Tier):**
   - CPU: 0.2 vCPU
   - Memory: 512 MB

7. Click **"Create Service"**
8. **Copy the Service ID** from the URL or service settings

## Step 5: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Add the following secrets:

   - `NORTHFLANK_API_TOKEN`
     - Go to Northflank → Settings → API Tokens
     - Create new token with "Project" scope
     - Copy and paste the token

   - `NORTHFLANK_PROJECT_ID`
     - Your project ID from Step 1

   - `NORTHFLANK_SERVICE_ID_KEYCLOAK`
     - Service ID from Step 3

   - `NORTHFLANK_SERVICE_ID_BACKEND`
     - Service ID from Step 4

## Step 6: Update Workflow Files

Replace your existing `deploy-alpha.yml` with the new Northflank version:

```bash
# Backup old file
mv .github/workflows/deploy-alpha.yml .github/workflows/deploy-alpha.old.yml

# Use new Northflank workflow
mv .github/workflows/deploy-alpha-northflank.yml .github/workflows/deploy-alpha.yml
```

Or manually copy the content from `deploy-alpha-northflank.yml` to `deploy-alpha.yml`.

## Step 7: Test Deployment

1. Push a commit to your main branch (or trigger workflow manually)
2. Go to **Actions** tab in GitHub
3. Watch the deployment workflow
4. Check the logs for any errors

## Step 8: Verify Services

After deployment completes:

1. **Check Keycloak:**
   - Open the Keycloak URL from deployment logs
   - Login: `admin` / `admin`
   - Verify `proxy-smart` realm exists

2. **Check Backend:**
   - Open the backend URL from deployment logs
   - Visit `/health` endpoint to verify service is running
   - Test FHIR proxy: `/proxy-smart-backend/hapi-fhir-server/R4/metadata`

## Troubleshooting

### Deployment Fails

1. Check service logs in Northflank dashboard
2. Verify environment variables are correct
3. Ensure PostgreSQL addon is running
4. Check GitHub Actions logs for API errors

### Database Connection Issues

- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
- Ensure PostgreSQL addon is in the same project
- Check addon connection details in Northflank

### Keycloak Not Starting

- Check if PostgreSQL is accessible
- Verify `KC_DB_URL` is correct
- Ensure memory limits are sufficient (min 512MB)
- Check if realm import is successful in logs

### Build Timeout

- Free tier builds can be slower
- Consider optimizing Dockerfile layers
- Check if dependencies are cached properly

## Free Tier Limits

Northflank free tier includes:
- **2 Services** (Keycloak + Backend) ✅
- **2 Jobs** (for CI/CD tasks)
- **1 Addon** (PostgreSQL) ✅
- **Shared CPU** (0.2 vCPU per service)
- **1 GB RAM total** (512MB per service)

**Note:** You're using the full free tier capacity with this setup.

## Monitoring

- **Service Health:** Check in Northflank dashboard
- **Logs:** View real-time logs in Northflank
- **Metrics:** Basic CPU/memory metrics available in free tier
- **Alerts:** Configure in Northflank settings (limited in free tier)

## Cost Optimization

To stay on free tier:
- Don't add more services/addons
- Monitor resource usage
- Optimize Docker images for faster builds
- Use caching effectively

## Next Steps

1. Set up custom domain (optional, requires DNS configuration)
2. Configure SSL/TLS certificates (handled by Northflank)
3. Set up monitoring and alerts
4. Configure backup strategy for PostgreSQL
5. Plan scaling strategy if needed (upgrade to paid tier)

## Support

- [Northflank Documentation](https://northflank.com/docs)
- [Northflank Community Discord](https://discord.gg/northflank)
- [GitHub Issues](https://github.com/your-repo/issues)
