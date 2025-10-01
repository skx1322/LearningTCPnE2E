FROM oven/bun:alpine AS build

WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY src ./

ENV VITE_BACKEND_URL=http://localhost:8080

RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]