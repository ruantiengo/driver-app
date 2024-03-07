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

# Expose port 8080
EXPOSE 8080

# Start the app
CMD npm run start
