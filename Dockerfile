# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=18

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-bullseye-slim AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Install system build tools for native modules (e.g., sharp)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 \
       make \
       g++ \
    && rm -rf /var/lib/apt/lists/*

# Install production dependencies with lockfile for reproducibility.
COPY package.json package-lock.json ./
RUN npm config set legacy-peer-deps true \
    && npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Install devDependencies for building the app (Gatsby build requires them).
COPY package.json package-lock.json ./
RUN npm config set legacy-peer-deps true \
    && npm ci

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/.cache ./.cache

# Expose the port that the application listens on.
EXPOSE 9000

# Run the application (serve built Gatsby site on 0.0.0.0:9000).
ENV PORT=9000
CMD ["npm", "run", "serve", "--", "-H", "0.0.0.0", "-p", "9000"]
