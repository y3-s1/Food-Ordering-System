FROM node:17-alpine
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
EXPOSE 5005
CMD ["npm","run","dev"]
