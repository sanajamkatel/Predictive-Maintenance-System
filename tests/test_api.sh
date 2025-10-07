#!/bin/bash

echo "Testing API endpoints..."
echo ""

echo "1. Health Check:"
curl -s http://localhost:5000/api/health | python3 -m json.tool
echo ""

echo "2. Fleet Stats:"
curl -s http://localhost:5000/api/fleet/stats | python3 -m json.tool | head -20
echo ""

echo "3. First Engine:"
curl -s http://localhost:5000/api/engine/0 | python3 -m json.tool
echo ""

echo "✅ If you see JSON data above, the API is working!"

