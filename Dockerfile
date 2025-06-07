# Step 1: Use Node.js base image with Python included
FROM node:18

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean

# Step 4: Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Step 5: Copy the entire app
COPY . .

# Ensure folders exist inside the container
RUN mkdir -p uploads output


# Step 6: Set up a Python virtual environment and install requirements
RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r requirements.txt

# Step 7: Set environment variable so Python and pip use the venv
ENV PATH="/venv/bin:$PATH"

# Step 8: Expose port and start the app
EXPOSE 3000
CMD ["node", "app.js"]


