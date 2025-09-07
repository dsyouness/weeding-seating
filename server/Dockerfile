FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev=false
COPY . .
ENV PORT=5174
ENV DATA_DIR=/data
EXPOSE 5174
CMD ["npm","run","dev"]
