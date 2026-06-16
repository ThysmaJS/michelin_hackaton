FROM node:22-alpine3.22 AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

RUN npx prisma generate

COPY . .
RUN npm run build && test -f dist/main.js || (echo "ERROR: dist/main.js not found" && exit 1)

# ---- runner ----
FROM node:22-alpine3.22
WORKDIR /app
ENV NODE_ENV=production

# Copy full node_modules (includes devDeps) so ts-node/prisma CLI are available for Jobs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma/
COPY data ./data/

EXPOSE 3000
CMD ["node", "dist/main.js"]
