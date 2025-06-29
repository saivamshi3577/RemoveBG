# Use official Node.js base image with Debian
FROM node:18

# Set working directory
WORKDIR /app

# Install Python 3, pip, and dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv python3-dev build-essential && \
    apt-get clean

# Copy only package files first to leverage Docker cache
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy entire app
COPY . .

# Create virtual environment and install Python packages
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r requirements.txt

# Add virtual env to path for Python scripts
ENV PATH="/venv/bin:$PATH"

# Set environment variables for production
ENV PORT=3000
EXPOSE 3000

# Start the Node.js app
CMD ["node", "app.js"]
