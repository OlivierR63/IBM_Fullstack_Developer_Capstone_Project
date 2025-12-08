# Use a light and stable Node.js image for the running environment
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency configuration files to leverage Docker cache
# It avoids to reinstall dependencies if only the source code has changed
COPY package.json package-lock.json ./

# Install the dependencies using "npm ci" for clean and reproducible builds
RUN npm ci  # Note: "ci" = "Clean Install" for production environments

# Copy the rest of the files (the React source code)
COPY . .

# Expose the default React development server port
EXPOSE 3000

# Command to start the React development server
CMD [ "npm", "start" ]