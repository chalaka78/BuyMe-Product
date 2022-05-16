FROM node:latest

WORKDIR /app

COPY . . 
RUN npm install

EXPOSE 4004

ENTRYPOINT [ "node","index.js"]