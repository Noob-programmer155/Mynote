#!/bin/bash

# if using reverse proxy its better direct connect to reverse proxy 
# launch this after frontend and backend builded

docker network connect mynote back 
