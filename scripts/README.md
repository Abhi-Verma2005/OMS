# API Test Scripts

This directory contains test scripts to help debug API connectivity issues with the OMS application.

## Available Scripts

### 1. `test-api.mjs` - Comprehensive API Test Suite

A comprehensive test script that runs multiple tests against the external API endpoints.

**Usage:**
```bash
# Run from project root
npm run test:api

# Or run directly
node scripts/test-api.mjs
```

**What it tests:**
- Basic API connectivity
- API with different filter combinations
- Categories API endpoint
- Error scenarios (GET requests, invalid JSON, etc.)
- Performance metrics

### 2. `browser-test.js` - Browser Console Test

A simple test script that can be run directly in the browser's developer console.

**Usage:**
1. Open your browser's developer console (F12)
2. Copy and paste the contents of `browser-test.js`
3. The tests will run automatically

**What it tests:**
- Basic API connectivity
- API with filters
- Categories API
- Error scenarios

## API Endpoints Being Tested

- **Main API**: `https://agents.outreachdeal.com/webhook/dummy-data`
- **Categories API**: `https://agents.outreachdeal.com/webhook/fetch-categories`

## Common Issues and Solutions

### 1. "Webhook is not registered for GET requests"
- **Cause**: The API endpoint only accepts POST requests
- **Solution**: Ensure all requests use POST method with proper headers

### 2. "API endpoint not found" (404)
- **Cause**: The webhook URL might be incorrect or the service is down
- **Solution**: Verify the API URL and check if the service is running

### 3. "Network error: Unable to connect to the API"
- **Cause**: Network connectivity issues or CORS problems
- **Solution**: Check internet connection and CORS configuration

### 4. "Unexpected API response: not valid JSON"
- **Cause**: The API is returning non-JSON data
- **Solution**: Check the API response format and content-type headers

## Debugging Tips

1. **Check the console output** - Both scripts provide detailed logging
2. **Test individual endpoints** - Use the browser test for quick checks
3. **Verify request format** - Ensure POST requests with proper JSON body
4. **Check response headers** - Look for content-type and other relevant headers
5. **Test with minimal data** - Start with simple requests (limit: 5) before complex filters

## Expected Response Format

The main API should return an array of objects with this structure:
```json
[
  {
    "json": {
      "id": 1,
      "website": "example.com",
      "niche": "technology",
      "domainAuthority": 50,
      "costPrice": 100,
      // ... other fields
    },
    "pairedItem": {
      "item": 1
    }
  }
]
```

The categories API should return an array of category objects:
```json
[
  {
    "category": "technology",
    "count": 150,
    "relevance": 0.95
  }
]
```
