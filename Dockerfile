FROM nginx:1.23-alpine-slim

RUN apk add --update nodejs npm

RUN npm install -g @oracle/ojet-cli

WORKDIR /usr/share/build

RUN mkdir -p /usr/share/build/src \
    && mkdir -p /usr/share/build/scripts

COPY src/ /usr/share/build/src/

COPY scripts/ /usr/share/build/scripts/

COPY *.json /usr/share/build/

RUN ojet restore
RUN ojet build web --release 

EXPOSE 8000

RUN cp -R /usr/share/build/web/* /usr/share/nginx/html/
