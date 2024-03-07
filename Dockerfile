FROM node:current-slim

# Create app directory
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./


RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Install app dependencies
RUN npm ci

# Generate prisma schema
RUN npm run prisma:generate

# Bundle app source
COPY . .

# Run tests
RUN npm run test

# Build the TypeScript files
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD npm run start
