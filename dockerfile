FROM node:16-alpine AS base

FROM base AS deps

WORKDIR /workspace

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY . .

FROM base AS builder

WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .

RUN npm run prisma:generate
RUN npm run build

FROM base as runner
WORKDIR /workspace
COPY --from=builder /workspace/. .

EXPOSE 3000

ENV PORT 3000

CMD ["node", "dist/main"]
