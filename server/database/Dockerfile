FROM node:18.12.1-bullseye-slim

# Define the workig directory
WORKDIR /app

# Only copy the dependency configuration files to optimize the Docker cache.
# If package.json or package-lock.json have not changed, this stage is reused.
COPY package.json package-lock.json .

# Install dependencies using "npm ci" for clean reproducible builds
RUN npm ci  # Note : "ci" = "Clean Install" for production environments

# Copy the rest of the source code ( the files .js and the folder data/ )
COPY . .

# Define the listening port of the application
EXPOSE 3030

# Command to start the application
CMD [ "node", "app.js" ]
