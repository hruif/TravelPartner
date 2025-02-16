# Use the official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Install dotenv CLI (optional, in case it's needed for environment loading)
RUN npm install dotenv-cli -g

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to start the application
CMD ["node", "dist/main.js"]
