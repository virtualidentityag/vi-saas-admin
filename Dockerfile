FROM docker.pkg.github.com/caritasdeutschland/caritas-onlineberatung-nginx/nginx-image:dockerimage.v.1
COPY favicon.ico /usr/share/nginx/html/
COPY index.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY ../src /usr/share/nginx/html/src
COPY static /usr/share/nginx/html/static
COPY ../nginx.conf /etc/nginx/conf.d/default.conf