FROM node:latest

WORKDIR /app

COPY . . 
RUN npm install

EXPOSE 4008

ENTRYPOINT [ "node","index.js"]