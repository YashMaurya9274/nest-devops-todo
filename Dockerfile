# ===========================
# 1. Builder Stage
# ===========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


# ===========================
# 2. Production Image
# ===========================
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production --legacy-peer-deps

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
