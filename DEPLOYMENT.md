# ErAI Agent Deployment Guide

This guide provides detailed instructions for deploying ErAI Agent in various environments.

## Local Development Deployment

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- An OpenRouter API key from [OpenRouter](https://openrouter.ai/keys) (optional)

### Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/erai-agent.git
cd erai-agent
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

5. Enter your Gemini API key or OpenRouter API key when prompted

## Production Deployment

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `.next` folder containing the production build.

### Local Production Server

To run the production build locally:

```bash
npm start
```

This will start a production server at `http://localhost:3000`.

### Server Deployment

#### Deploying to Vercel

The easiest way to deploy ErAI Agent is using Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure environment variables if needed
4. Deploy

#### Deploying to Other Hosting Providers

To deploy to other hosting providers:

1. Build the application:

```bash
npm run build
```

2. Deploy the `.next` folder, `package.json`, and `package-lock.json` to your hosting provider

3. Install dependencies on the server:

```bash
npm install --production
```

4. Start the production server:

```bash
npm start
```

## Docker Deployment

### Prerequisites

- Docker installed on your system

### Building the Docker Image

1. Create a `Dockerfile` in the root of the project:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build the Docker image:

```bash
docker build -t erai-agent .
```

3. Run the Docker container:

```bash
docker run -p 3000:3000 erai-agent
```

4. Access the application at `http://localhost:3000`

### Docker Compose

For more complex setups, you can use Docker Compose:

1. Create a `docker-compose.yml` file:

```yaml
version: '3'
services:
  erai-agent:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

2. Start the services:

```bash
docker-compose up -d
```

## Environment Variables

ErAI Agent supports the following environment variables:

- `NEXT_PUBLIC_DEFAULT_MODEL`: Set the default AI model (optional)
- `NEXT_PUBLIC_DEFAULT_PROVIDER`: Set the default provider ('gemini' or 'openrouter') (optional)
- `NEXT_PUBLIC_API_URL`: Override the API URL (optional)

You can set these variables in a `.env.local` file for local development:

```
NEXT_PUBLIC_DEFAULT_MODEL=gemini-1.5-pro-latest
NEXT_PUBLIC_DEFAULT_PROVIDER=gemini
```

For production, set these variables in your hosting provider's environment configuration.

## Security Considerations

### API Key Security

The API keys are stored in the browser's local storage. This is convenient but has security implications:

- The keys are accessible to JavaScript running on the page
- They persist between sessions

For production deployments with multiple users, consider:

1. Implementing a backend service to proxy API requests
2. Using session-based storage instead of local storage
3. Implementing proper authentication and authorization

### Content Security Policy

To enhance security, consider adding a Content Security Policy (CSP) to restrict resource loading:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com https://openrouter.ai;">
```

## Troubleshooting

### Common Issues

#### CORS Errors

If you encounter CORS errors when calling the APIs:

1. Ensure you're using the correct API endpoints
2. Consider implementing a backend proxy for API requests

#### API Key Issues

If the API keys are not working:

1. Verify the keys are correct and active
2. Check that you have sufficient quota for the APIs
3. Try regenerating the API keys

#### Build Errors

If you encounter build errors:

1. Ensure you're using a compatible Node.js version
2. Clear the `.next` folder and node_modules:

```bash
rm -rf .next node_modules
npm install
```

3. Try building again

## Performance Optimization

For better performance in production:

1. Enable caching for static assets
2. Consider implementing API response caching
3. Use a CDN for static content delivery
4. Optimize images and other assets

## Scaling

For high-traffic deployments:

1. Deploy behind a load balancer
2. Implement horizontal scaling with multiple instances
3. Consider serverless deployment options
4. Monitor performance and adjust resources as needed

## Monitoring

To monitor your deployment:

1. Implement logging for server events
2. Set up error tracking (e.g., Sentry)
3. Monitor API usage and quotas
4. Set up alerts for critical issues

## Backup and Recovery

To ensure data safety:

1. Regularly backup configuration files
2. Implement a disaster recovery plan
3. Document the recovery process

## Updates and Maintenance

To keep your deployment up to date:

1. Regularly check for updates to dependencies
2. Test updates in a staging environment before deploying to production
3. Maintain a changelog of updates and changes
4. Schedule regular maintenance windows for updates

## Multi-Provider Configuration

ErAI Agent supports both Gemini API and OpenRouter API. Here are some considerations for deployment:

### Gemini API Configuration

- Requires a Gemini API key from Google AI Studio
- Provides access to Google's Gemini models
- No additional configuration needed beyond the API key

### OpenRouter API Configuration

- Requires an OpenRouter API key
- Provides access to 200+ AI models from various providers
- May require additional configuration for specific models
- Consider rate limits and pricing for different models

### Switching Between Providers

Users can switch between providers in the application UI. As an administrator, you can:

1. Set a default provider using environment variables
2. Pre-configure API keys for specific deployments
3. Restrict access to certain providers or models if needed
