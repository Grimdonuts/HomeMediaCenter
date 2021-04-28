FROM node:14.15.4-buster-slim
WORKDIR /usr/src/app
COPY . .
RUN mkdir assets
EXPOSE 3000
CMD [ "node", "server.js" ]