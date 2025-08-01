FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY src ./src
COPY public ./public
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY index.html ./
COPY components.json ./
COPY eslint.config.js ./

RUN npm ci
# Set the API URL environment variable during build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-https://eco-audit-ai-backend.onrender.com}
# Skip TypeScript checks and just build with Vite
RUN npm run build

# Create dist directory if it doesn't exist (fallback)
RUN mkdir -p /app/dist
RUN touch /app/dist/index.html

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh
RUN apk add --no-cache bash gettext
EXPOSE 3000
CMD ["/start-nginx.sh"]