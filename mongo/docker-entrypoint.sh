#!/bin/bash

set -eux
mongod --repair
mongod
mongo --eval "db.createUser({user: '${MONGO_USER}', pwd: '${MONGO_PASS}', roles:[{role:'readWrite',db:'mediaserver'}]})" 'mediaserver'
mongod --shutdown
exec "$@"