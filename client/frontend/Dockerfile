FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev=false

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV VITE_BACKEND_URL=http://backend:5174
COPY --from=builder /app /app
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
