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

EXPOSE 80
ENV HTML=/usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "envsubst < $HTML/config.template.json > $HTML/config.json && nginx -g 'daemon off;'"]