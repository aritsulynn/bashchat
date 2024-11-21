# Use the official Node.js LTS Alpine image
FROM node:lts-alpine

# Set the environment to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json (or npm-shrinkwrap.json if it exists)
# This allows Docker to cache dependencies and speed up the build
COPY ["package.json", "package-lock.json*", "./"]

# Install production dependencies only
RUN npm install --production --silent

# Copy the rest of the application files into the container
COPY . .

# Expose the port that your app will be running on
EXPOSE 3000

# Set the user to 'node' for security reasons
RUN chown -R node /usr/src/app
USER node

# Set the default command to serve the built app
CMD ["npm", "start"]
