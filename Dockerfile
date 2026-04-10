# ── Stage 1: Build React frontend ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests first (layer-cache optimisation)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production — Node.js Express proxy ───────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Install only production deps (express, cors, dotenv)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the built React app + the secure proxy server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Environment
# PORT is configurable — Dokploy can map any host port to this
ENV PORT=4200
ENV NODE_ENV=production

# Do NOT copy .env — secrets come from Dokploy environment variables
# Set these in Dokploy UI:
#   OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY,
#   GEMINI_API_KEY_2, OPENROUTER_API_KEY

EXPOSE 4200

CMD ["node", "server.js"]
