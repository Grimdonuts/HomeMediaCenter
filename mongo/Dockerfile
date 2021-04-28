FROM andresvidal/rpi3-mongodb3

EXPOSE 27017
COPY . .
RUN chmod 755 ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["mongod","--config","mongod.conf"]