#prod idea...
FROM node:14.15.4-buster-slim as build
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install -g @angular/cli
RUN npm run build --prod

FROM nginx

COPY --from=build /usr/src/app/dist/homemediaplayer /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200

# run nginx
CMD ["nginx", "-g", "daemon off;"]
# For dev only and local
# FROM node:14.15.4-buster-slim
# WORKDIR /usr/src/app
# COPY . .
# RUN npm install -g @angular/cli
# EXPOSE 4200
# CMD ["ng", "serve", "--prod=true", "--host=0.0.0.0", "--live-reload=false"]