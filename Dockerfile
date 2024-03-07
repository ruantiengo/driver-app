FROM node:current-slim

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

RUN npm run prisma:generate

# Build the TypeScript files
RUN npm run build

# Run tests
RUN npm run test

# Start the app
CMD npm run start
