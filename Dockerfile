FROM node:current-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose port 8080
EXPOSE 8080

#
RUN apt-get update -y && apt-get install -y openssl`
# Start prisma
RUN npx prisma generate

# Start the app
CMD npm run start
