FROM public.ecr.aws/docker/library/alpine
# Set env for container
ARG REACT_APP_MT
ENV REACT_APP_MT=${REACT_APP_MT}

WORKDIR /var/www/localhost/htdocs
COPY ./.env.dev /var/www/localhost/htdocs/.env

EXPOSE 80
ADD nginx/nginx.conf /etc/nginx/http.d/default.conf
COPY . /var/www/localhost/htdocs
RUN apk add nginx
RUN apk add nodejs
RUN apk add npm
RUN cd /var/www/localhost/htdocs
RUN npm install
RUN npm run build
RUN apk del nodejs
RUN apk del npm
RUN mv /var/www/localhost/htdocs/build /var/www/localhost
RUN cd /var/www/localhost/htdocs
RUN rm -rf *
RUN mv /var/www/localhost/build /var/www/localhost/htdocs;
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
