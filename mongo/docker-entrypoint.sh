#!/bin/bash

set -eux
mongod --fork --dbpath /mongo-data/ --syslog --repair
mongod --shutdown
exec "$@"