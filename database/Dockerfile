FROM mysql:8.0

COPY init.sql /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD=vidhaanviswas
ENV MYSQL_DATABASE=serverless_platform

EXPOSE 3306