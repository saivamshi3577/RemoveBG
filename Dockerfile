FROM node:18

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean

COPY package*.json ./
RUN npm install

COPY . .

RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r requirements.txt

ENV PATH="/venv/bin:$PATH"

EXPOSE 3000
CMD ["node", "app.js"]
