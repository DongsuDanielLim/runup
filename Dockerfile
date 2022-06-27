FROM node:14

WORKDIR /app

COPY package.json .
COPY . .
RUN npm install
RUN npm run --script build
EXPOSE 3000
CMD ["npm", "run", "start"]