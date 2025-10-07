#!/bin/bash

# Start Backend API Script
echo "========================================="
echo "  Predictive Maintenance - Backend API  "
echo "========================================="
echo ""

# Navigate to project directory
cd "/Users/sadhana/Predictive-Maintenance-System/Predictive-Maintenance-System"

# Activate virtual environment (if exists)
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Start Flask API
echo "Starting Flask API server..."
echo "API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================="
echo ""

cd backend
python3 api.py

