FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Custom log locations (so we can mount them)
RUN mkdir -p /var/log/nginx
RUN sed -i 's|access_log /var/log/nginx/access.log;|access_log /var/log/nginx/access.log;|' /etc/nginx/nginx.conf \
 && sed -i 's|error_log /var/log/nginx/error.log;|error_log /var/log/nginx/error.log;|' /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
