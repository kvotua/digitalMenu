FROM node:20-alpine
EXPOSE 4173
WORKDIR /app
COPY ./package*.json .
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm", "run", "preview", "--", "--host" ]
