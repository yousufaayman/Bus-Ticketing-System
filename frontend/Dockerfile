FROM node:14

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Install Firebase CLI
RUN npm install -g firebase-tools

# Build the React app
RUN npm run build

# Deploy to Firebase Hosting
RUN firebase login:ci --token "$FIREBASE_TOKEN"
RUN firebase deploy --only hosting

EXPOSE 3000

CMD ["npm", "start"]
