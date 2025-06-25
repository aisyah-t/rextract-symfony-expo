FROM node:18-alpine

# Install Expo CLI globally
RUN npm install -g @expo/cli

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
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "localhost"] 