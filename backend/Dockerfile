FROM node:22-alpine3.22 AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

RUN npx prisma generate

COPY . .
RUN npm run build; echo "--- exit code: $? ---"; echo "--- dist contents ---"; ls -la dist/ 2>/dev/null || echo "dist/ does not exist"; test -f dist/main.js

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
