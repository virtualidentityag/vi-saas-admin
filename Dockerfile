ARG DOCKER_MATRIX=ghcr.io
FROM $DOCKER_MATRIX/onlineberatung/onlineberatung-nginx/onlinebernlatung-nginx:dockerimage.v.003-main
COPY favicon.ico /usr/share/nginx/html/admin/
COPY index.html /usr/share/nginx/html/admin/
COPY robots.txt /usr/share/nginx/html/admin/
COPY src /usr/share/nginx/html/admin/src
COPY static /usr/share/nginx/html/admin/static
COPY fonts /usr/share/nginx/html/admin/fonts
COPY nginx.conf /etc/nginx/conf.d/default.conf
