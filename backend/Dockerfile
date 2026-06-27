# -----------------------------
# Base Stage
# -----------------------------
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

# -----------------------------
# Production Stage
# -----------------------------
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

USER nodeuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["npm", "start"]