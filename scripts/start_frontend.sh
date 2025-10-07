#!/bin/bash

# Start React Frontend Script
echo "========================================="
echo " Predictive Maintenance - React Frontend"
echo "========================================="
echo ""

# Navigate to frontend directory
cd "/Users/sadhana/Predictive-Maintenance-System/Predictive-Maintenance-System/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (first time only)..."
    echo "This may take 1-2 minutes..."
    npm install
    echo ""
fi

# Start React app
echo "Starting React development server..."
echo "Dashboard will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================="
echo ""

npm start

