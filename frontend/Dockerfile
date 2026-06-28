# ---------- Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_SHORT_BASE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SHORT_BASE_URL=$VITE_SHORT_BASE_URL

RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:1.28-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]