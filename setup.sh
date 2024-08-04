#!/bin/bash

# Exit on error
set -e

# Function to print messages
print_message() {
  echo -e "\n\033[1m$1\033[0m\n"
}

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  print_message "PostgreSQL not found. Please install PostgreSQL before running this script."
  exit 1
fi

print_message "Setting up PostgreSQL database..."

# Create the database and user
DB_NAME="db"
DB_USER="postgres"
DB_PASS="password"

# Create a PostgreSQL database
psql -U postgres -c "CREATE DATABASE $DB_NAME;"

# Create a PostgreSQL user
psql -U postgres -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"

# Grant privileges to the user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

print_message "PostgreSQL setup complete."

print_message "Building and running the backend..."

# Build and run the backend
(cd backend && go build -o main . && ./main &)

print_message "Starting the frontend..."

# Build and run the frontend
(cd frontend && npm install && npm run build)

print_message "Setup complete. The application should now be running."
