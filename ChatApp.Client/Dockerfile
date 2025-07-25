    # Use a Node.js base image for development
    FROM node:20-alpine AS development

    # Set the working directory inside the container
    WORKDIR /app

    # Copy package.json and package-lock.json to install dependencies
    COPY package*.json ./

    # Install Node.js dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Expose the port Vite's development server runs on (default 5173)
    EXPOSE 5173

    # Command to run the development server
    CMD ["npm", "run", "dev"]