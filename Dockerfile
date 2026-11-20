# Michael Lapidary — production image (deploy via Coolify / Docker)
# Pendekatan pragmatis self-host: node_modules penuh (prisma CLI tersedia
# untuk `migrate deploy` saat start), tanpa standalone output.
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

# 1) Dependensi — .npmrc ikut di-copy agar settings pnpm cocok dengan lockfile
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# 2) Build
COPY . .
RUN pnpm prisma generate && pnpm build

# 3) Runtime
FROM node:22-alpine
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
ENV UPLOAD_DIR=/app/uploads

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/next.config.ts ./next.config.ts

# Volume foto produk (pasang persistent volume Coolify di sini)
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]

EXPOSE 3000

# Migrasi DB dulu (aman idempoten), seed sekali pertama bila SEED_ON_START=true, lalu server
CMD ["sh", "-c", "pnpm prisma migrate deploy && if [ \"$SEED_ON_START\" = \"true\" ]; then pnpm tsx prisma/seed.ts; fi; pnpm start"]
