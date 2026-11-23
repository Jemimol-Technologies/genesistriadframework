# Multi-stage: build Angular in node, serve via nginx.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --loglevel=error
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY public ./public
COPY src ./src
RUN npx ng build --configuration production

# --- runtime ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist/genesis-triad-wireframe/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4920
CMD ["nginx", "-g", "daemon off;"]
