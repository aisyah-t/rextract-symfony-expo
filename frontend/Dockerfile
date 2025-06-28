FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port for Expo development server
EXPOSE 8081

# Start Expo development server
CMD ["npm", "start"] 