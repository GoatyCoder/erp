FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY . .

RUN npm --workspace apps/web run build
RUN mkdir -p apps/api/public && cp -R apps/web/dist/. apps/api/public/
RUN npm --workspace apps/api run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/public ./apps/api/public

EXPOSE 3000
CMD ["node", "apps/api/dist/apps/api/src/main.js"]
