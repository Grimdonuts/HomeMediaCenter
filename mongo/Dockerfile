#
# MongoDB Dockerfile
#
# https://github.com/dockerfile/mongodb
#

# Pull base image.
FROM andresvidal/rpi3-mongodb3

EXPOSE 27017
COPY . .
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["mongod"]