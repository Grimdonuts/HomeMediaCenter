#!/bin/bash

set -euv

if [ -f /mongo-data/mongod.lock ]; then
    echo "Old mongod.lock file found! Removing..."
    sudo rm /mongo-data/mongod.lock
    echo "Removed successfully!"
else
    echo "No old mongod.lock file found, starting normally..."
fi
trap 'kill -2 1; wait 1' SIGTERM

mongod --fork --dbpath /mongo-data/ --syslog
mongo --eval "db.dropAllUsers()" mediaserver
mongo --eval "db.createUser({user: 'jnelson', pwd: 'pass', roles:[{role:'readWrite', db:'mediaserver'}]})" mediaserver
mongod --shutdown --dbpath /mongo-data/

exec "$@"
