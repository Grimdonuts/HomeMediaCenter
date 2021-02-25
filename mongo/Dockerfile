FROM andresvidal/rpi3-mongodb3

EXPOSE 27017
COPY . .
RUN chmod 777 /var/lib/mongodb
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["mongod","--config","mongod.conf"]