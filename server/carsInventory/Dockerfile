FROM node:18.12.1-bullseye-slim

# 1. Set working directory
WORKDIR /app

# 2. Copy only package.json & package-lock.json first
COPY package*.json ./

# 3. Install dependencies using "npm ci" for clea reproducible builds
RUN npm ci  # Note : "ci" = "Clean Install" for production environments

COPY data/car_records.json .

# 4. Copy the rest of your app (app.js, data/, etc.)
COPY . .

# 5. Expose and start
EXPOSE 3050
CMD [ "node", "app.js" ]
