FROM node:19.0.0 AS frontend

# Set working directory where everything will happen
WORKDIR /var/temp

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY ./ ./

RUN npm run build 

FROM nginx:stable

WORKDIR /usr/share/nginx/html 

RUN rm -rf ./*

COPY --from=frontend /var/temp/build ./

EXPOSE 80