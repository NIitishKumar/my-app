# Stage 1: build
FROM node:20-alpine AS build

# Set WORKDIR inside the container (does not need to match host folder)
WORKDIR /my-app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, using legacy-peer-deps to avoid React 19 conflicts
RUN npm install --legacy-peer-deps

# Copy all source files from your host my-app folder
COPY . .

# Build the app (Vite outputs to /app/dist by default)
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /my-app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]