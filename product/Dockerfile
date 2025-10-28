# Use Node.js image to build the Angular app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Angular app in production mode
RUN npm run build --prod

# Use Nginx to serve the app
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/dist/product /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf  
# Ensure this file exists in your project root

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
