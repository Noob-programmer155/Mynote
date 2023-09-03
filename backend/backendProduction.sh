#!/bin/bash

# remember: install backend after frontend will cause error CORS (if using direct connection)...

#setup network database
docker network create --internal mynote-internal
#setup database postgres
docker pull postgres
#run postgress
docker run -d -p 5432:5432 --net mynote-internal --name db -e "POSTGRESS_PASSWORD=admin123" postgres
docker cp ./dbdump_mynote.sql db:/dbsql.sql
#set up name
docker exec -i db bash <<EOF
  dbpassmain='admin123'
  PGPASSWORD=${dbpassmain} psql -U postgres -c "CREATE USER admin WITH CREATEDB PASSWORD 'admin'"
  dbpass='admin'
  PGPASSWORD=${dbPass} psql -U admin -d postgres -c "CREATE DATABASE mynote"
  PGPASSWORD=${dbPass} psql -U admin mynote < dbsql.sql
  exit
EOF
#=========================================================================================================
# build image
docker build -t backend-mynote .
# run container
docker run -d -p 8081:8080 --net mynote-internal --name back --env-file ./env -e "ORIGINS_URL=http://localhost:8082::http://127.0.0.1:8082::https://hostname" --expose 8080 backend-mynote
