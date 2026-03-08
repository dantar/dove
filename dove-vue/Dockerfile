# build stage
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install

COPY . .
RUN npm run build

# nginx stage
FROM nginx:alpine

# copia build vue
COPY --from=build /app/dist /usr/share/nginx/html
# copia configurazione nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY config.template.js /usr/share/nginx/html/config.template.js

EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
#CMD ["envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js", "&&", "nginx", "-g", "daemon off;"]
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js && nginx -g 'daemon off;'"]
