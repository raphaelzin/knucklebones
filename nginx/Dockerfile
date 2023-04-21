FROM nginx:latest

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]