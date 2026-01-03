# Use slim instead of alpine to avoid the metadata/dependency headache
FROM node:20-slim AS build

# Install system dependencies needed for Strapi/Sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    autoconf \
    automake \
    libtool \
    pkg-config \
    libpng-dev \
    make \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim
RUN apt-get update && apt-get install -y libpng-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/app
COPY --from=build /opt/app ./
EXPOSE 1337
CMD ["npm", "run", "start"]
