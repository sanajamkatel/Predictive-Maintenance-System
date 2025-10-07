#!/bin/bash

# Start Backend API Script
echo "========================================="
echo "  Predictive Maintenance - Backend API  "
echo "========================================="
echo ""

# Navigate to project directory
cd "/Users/sadhana/C++ project"

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Start Flask API
echo "Starting Flask API server..."
echo "API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================="
echo ""

python3 api.py

