ARG ENV_FILE=.env.dev

# The build is split up into two steps in order to have a bare bone Nginx image
# where we run the built app.

# Node.js build stage. Builds and compiles the app.
FROM tiangolo/node-frontend:10 as build-stage
ARG ENV_FILE

# Copy package json
COPY package.json package-lock.json /app/

# Install dependencies.
RUN cd /app/ && npm install

COPY ./ /app/
COPY ${ENV_FILE} /app/.env

# Build the app
RUN cd /app/ && npm run build

# Nginx production stage. Runs the app.
FROM nginx:1.15

# Copy the app from build-stage.
COPY --from=build-stage /app/build/ /usr/share/nginx/html/

# Copy the Nginx config provided by the tiangolo/node-frontend base image.
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
