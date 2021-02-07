FROM node

# Create app directory
WORKDIR /usr/src/app

COPY . .
RUN mkdir assets
# ADD /assets /usr/src/app/assets
EXPOSE 3000
CMD [ "node", "server.js" ]