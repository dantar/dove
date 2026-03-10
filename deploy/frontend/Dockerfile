# nginx stage
FROM nginx:alpine

# copia build vue
COPY ./dist /usr/share/nginx/html
# copia configurazione nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENV HTML=/usr/share/nginx/html
CMD ["/bin/sh",  "-c",  "envsubst < $HTML/config.template.json > $HTML/config.json && nginx -g 'daemon off;'"]
