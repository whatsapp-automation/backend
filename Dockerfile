FROM node:18-alpine

# Install Python and pip
RUN apk add --no-cache python3 py3-pip python3-dev

WORKDIR /app

# Copy backend package files
COPY package*.json ./

RUN npm install

# Copy backend source code
COPY . .

# Install TypeScript and build the project
RUN npm install -g typescript
RUN tsc

# Create a directory where we'll mount the MCP scripts
RUN mkdir -p /app/whatsapp-mcp

# Create a Python virtual environment and install MCP
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN /app/venv/bin/pip install mcp[cli]>=1.6.0 httpx>=0.28.1 requests>=2.32.3

EXPOSE 3002

CMD ["node", "dist/api/index.js"] 