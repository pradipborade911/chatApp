# Use the official Node.js image as the base image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install backend dependencies
RUN cd backend && npm install

# Install frontend dependencies
RUN cd frontend && npm install

# Copy the remaining application files to the working directory
COPY . .

# Expose ports
EXPOSE 3001 3000

# Command to run the application
CMD ["npm", "start"]
