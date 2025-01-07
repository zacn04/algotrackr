#!/bin/bash
# Install backend dependencies
cd backend
go mod tidy
# Install frontend dependencies
cd ../frontend/leettrack
npm install
echo "Setup complete! Run 'npm start' in /frontend/leettrack and 'go run main.go' in /backend to start."
