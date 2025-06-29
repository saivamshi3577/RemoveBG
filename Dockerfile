# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install Python 3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean

# Copy Node.js package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application code
COPY . .

# Set up Python virtual environment and install Python packages
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r requirements.txt

# Make venv binaries available in path
ENV PATH="/venv/bin:$PATH"

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start the Node.js app
CMD ["node", "app.js"]
