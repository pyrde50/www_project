FROM node:16
WORKDIR ./
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7777 7778
CMD [ "npm", "run", "docker" ]