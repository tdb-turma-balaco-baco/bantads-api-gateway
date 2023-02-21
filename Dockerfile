FROM node:18.12.1-alpine

# App directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle
COPY . .
RUN npx tsc

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
