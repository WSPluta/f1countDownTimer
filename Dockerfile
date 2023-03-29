FROM nginx:1.23-alpine-slim

EXPOSE 8000

COPY web/ /usr/share/nginx/html/