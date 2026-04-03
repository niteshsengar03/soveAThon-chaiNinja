#!/bin/bash

# Hostel Management Backend Testing Script
# This script provides sample API calls to test the backend functionality

BASE_URL="http://localhost:4000/api"
JWT_TOKEN=""

echo "🏨 Hostel Management Backend Testing Script"
echo "============================================"

# Function to make API calls
call_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth=$4

    echo ""
    echo "📡 $method $endpoint"

    if [ "$auth" = "true" ] && [ -n "$JWT_TOKEN" ]; then
        if [ -n "$data" ]; then
            curl -s -X $method \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $JWT_TOKEN" \
                -d "$data" \
                $BASE_URL$endpoint | jq '.'
        else
            curl -s -X $method \
                -H "Authorization: Bearer $JWT_TOKEN" \
                $BASE_URL$endpoint | jq '.'
        fi
    else
        if [ -n "$data" ]; then
            curl -s -X $method \
                -H "Content-Type: application/json" \
                -d "$data" \
                $BASE_URL$endpoint | jq '.'
        else
            curl -s -X $method \
                $BASE_URL$endpoint | jq '.'
        fi
    fi
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq is required for pretty JSON output. Install it first:"
    echo "   Ubuntu/Debian: sudo apt install jq"
    echo "   macOS: brew install jq"
    exit 1
fi

echo ""
echo "🔍 Testing server health..."
call_api "GET" "/auth/me" "" "false"

echo ""
echo "📝 Step 1: Student Signup"
echo "Note: Make sure you have college student data seeded in the database"
call_api "POST" "/auth/student/signup" '{
  "regNo": "12345",
  "password": "password123"
}' "false"

echo ""
echo "🔑 Step 2: Student Login"
echo "Replace YOUR_REG_NO and YOUR_PASSWORD with actual values"
LOGIN_RESPONSE=$(call_api "POST" "/auth/student/login" '{
  "regNo": "12345",
  "password": "password123"
}' "false")

# Extract JWT token from login response
JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token // empty')

if [ -z "$JWT_TOKEN" ] || [ "$JWT_TOKEN" = "null" ]; then
    echo "❌ Login failed. Please check your credentials and try again."
    exit 1
fi

echo "✅ Login successful! JWT Token acquired."

echo ""
echo "👤 Step 3: Get Current User Profile"
call_api "GET" "/auth/me" "" "true"

echo ""
echo "📋 Step 4: Create a Complaint"
call_api "POST" "/complaints" '{
  "type": "ROOM",
  "category": "ELECTRICITY",
  "description": "Light bulb not working in room",
  "roomNo": "101"
}' "true"

echo ""
echo "📋 Step 5: Get My Complaints"
call_api "GET" "/complaints/my" "" "true"

echo ""
echo "🚶 Step 6: Create Movement Request"
call_api "POST" "/movements" '{
  "type": "GARAGE",
  "reason": "Need to get my bicycle",
  "requestedOutTime": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
  "expectedReturnTime": "'$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%S.000Z)'",
  "roomNo": "101"
}' "true"

echo ""
echo "🚶 Step 7: Get My Movements"
call_api "GET" "/movements/my" "" "true"

echo ""
echo "🔧 Step 8: Admin Login (if you have admin credentials)"
echo "Note: You need to create admin accounts first"
# call_api "POST" "/auth/admin/login" '{
#   "email": "admin@hostel.com",
#   "password": "admin123"
# }' "false"

echo ""
echo "🎉 Testing completed!"
echo ""
echo "📖 For more detailed API documentation, check API_DOCUMENTATION.md"
echo "🔧 To test admin endpoints, you need to:"
echo "   1. Create admin accounts in the database"
echo "   2. Use admin login endpoint"
echo "   3. Test admin-specific endpoints like /complaints/admin, /workers, etc."</content>
<parameter name="filePath">/home/nitesh/nitesh/Work/soveAThon-chaiNinja/backend/test-api.sh