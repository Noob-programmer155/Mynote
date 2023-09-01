#!/bin/bash

#setup network
docker network create mynote

#=============================================

#build image
docker build -t frontend-mynote .
#run container
docker run -d -p 8082:3000 --net mynote --name front --expose 3000 frontend-mynote