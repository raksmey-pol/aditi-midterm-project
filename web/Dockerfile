# ============================================================
# Stage 1 – Install dependencies
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ============================================================
# Stage 2 – Build
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined at build time
ARG NEXT_PUBLIC_API_URL=https://ecom-api.fograinstudio.com
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# ============================================================
# Stage 3 – Runtime
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Unprivileged user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next  ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public  ./public
COPY --from=builder                        /app/node_modules ./node_modules
COPY --from=builder                        /app/package.json ./package.json
COPY --from=builder                        /app/next.config.ts ./next.config.ts

USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
