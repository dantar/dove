# nginx stage
FROM nginx:alpine

# copia build vue
COPY ./dist /usr/share/nginx/html
# copia configurazione nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY config.template.js /usr/share/nginx/html/config.template.js

ENV HTML=/usr/share/nginx/html
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
CMD ["/bin/sh",  "-c",  "envsubst < $HTML/config.template.js > $HTML/config.js && nginx -g 'daemon off;'"]
