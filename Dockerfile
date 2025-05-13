FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p dist/views

# Build TypeScript code and copy views
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"] 