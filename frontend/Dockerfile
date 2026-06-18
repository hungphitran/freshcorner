# Use the official Node.js image as the base image
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# # Define build-time arguments for environment variables
# ARG NEXT_PUBLIC_API_URL
# ARG NEXT_PUBLIC_ACCESS_EXPIRATION
# ARG NEXT_PUBLIC_REFRESH_EXPIRATION

# # Set environment variables for the build process
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_ACCESS_EXPIRATION=$NEXT_PUBLIC_ACCESS_EXPIRATION
# ENV NEXT_PUBLIC_REFRESH_EXPIRATION=$NEXT_PUBLIC_REFRESH_EXPIRATION

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Use a lightweight image for the production environment
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3000

# # Ensure environment variables are available at runtime
# ENV PORT=4000
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_ACCESS_EXPIRATION=$NEXT_PUBLIC_ACCESS_EXPIRATION
# ENV NEXT_PUBLIC_REFRESH_EXPIRATION=$NEXT_PUBLIC_REFRESH_EXPIRATION

# Start the Next.js application
CMD ["yarn", "start"]