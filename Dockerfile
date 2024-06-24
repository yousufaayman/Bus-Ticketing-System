FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g firebase-tools

RUN npm run build

RUN firebase login:ci --token "$FIREBASE_TOKEN"
RUN firebase deploy --only hosting

EXPOSE 3000

CMD ["npm", "start"]
