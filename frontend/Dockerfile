FROM node:alpine
RUN mkdir frontend
WORKDIR /frontend
COPY package.json ./
RUN chmod -R 777 /usr/local/bin/npm
RUN npm install
RUN chmod +x node_modules/.bin/react-scripts

CMD ["npm", "run", "start"]
