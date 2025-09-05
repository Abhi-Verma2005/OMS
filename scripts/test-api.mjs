#!/usr/bin/env node

/**
 * API Test Script for OMS
 * 
 * This script tests the external API endpoints used by the filter page
 * to help debug connectivity and response issues.
 * 
 * Requires Node.js 18+ for built-in fetch support
 */

// API endpoints
const API_BASE_URL = 'https://agents.outreachdeal.com/webhook/dummy-data'
const CATEGORIES_API_URL = 'https://agents.outreachdeal.com/webhook/fetch-categories'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
}

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

function logHeader(message) {
  log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`)
  log(`${colors.bright}${colors.cyan}${message}${colors.reset}`)
  log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
}

// Test 1: Basic API connectivity
async function testBasicConnectivity() {
  logHeader('TEST 1: Basic API Connectivity')
  
  try {
    logInfo(`Testing basic connectivity to: ${API_BASE_URL}`)
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'OMS-Test-Script/1.0'
      },
      body: JSON.stringify({
        limit: 5
      })
    })

    logInfo(`Response Status: ${response.status} ${response.statusText}`)
    logInfo(`Response Headers:`)
    for (const [key, value] of response.headers.entries()) {
      log(`  ${key}: ${value}`, 'cyan')
    }

    if (!response.ok) {
      const errorText = await response.text()
      logError(`API Error Response: ${errorText}`)
      return false
    }

    const responseText = await response.text()
    logInfo(`Response Body Length: ${responseText.length} characters`)
    
    if (!responseText || responseText.trim() === '') {
      logWarning('API returned empty response body')
      return false
    }

    try {
      const data = JSON.parse(responseText)
      logSuccess(`Successfully parsed JSON response`)
      logInfo(`Response Type: ${Array.isArray(data) ? 'Array' : typeof data}`)
      
      if (Array.isArray(data)) {
        logInfo(`Array Length: ${data.length}`)
        if (data.length > 0) {
          logInfo(`First Item Keys: ${Object.keys(data[0]).join(', ')}`)
        }
      } else if (data && typeof data === 'object') {
        logInfo(`Object Keys: ${Object.keys(data).join(', ')}`)
      }
      
      return true
    } catch (parseError) {
      logError(`Failed to parse JSON: ${parseError.message}`)
      logInfo(`Raw Response (first 500 chars): ${responseText.substring(0, 500)}`)
      return false
    }

  } catch (error) {
    logError(`Network/Request Error: ${error.message}`)
    if (error.code) {
      logError(`Error Code: ${error.code}`)
    }
    return false
  }
}

// Test 2: API with different filter combinations
async function testWithFilters() {
  logHeader('TEST 2: API with Different Filter Combinations')
  
  const testCases = [
    {
      name: 'Basic limit only',
      filters: { limit: 10 }
    },
    {
      name: 'Domain Authority filter',
      filters: { 
        limit: 5,
        domainAuthority: { min: 20, max: 50 }
      }
    },
    {
      name: 'Niche filter',
      filters: { 
        limit: 5,
        niche: 'technology'
      }
    },
    {
      name: 'Multiple filters',
      filters: { 
        limit: 5,
        domainAuthority: { min: 10 },
        availability: true,
        language: 'english'
      }
    },
    {
      name: 'Price range filter',
      filters: { 
        limit: 5,
        costPrice: { min: 50, max: 200 }
      }
    }
  ]

  for (const testCase of testCases) {
    logInfo(`\nTesting: ${testCase.name}`)
    logInfo(`Filters: ${JSON.stringify(testCase.filters, null, 2)}`)
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'OMS-Test-Script/1.0'
        },
        body: JSON.stringify(testCase.filters)
      })

      logInfo(`Status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        logError(`Error: ${errorText}`)
        continue
      }

      const responseText = await response.text()
      const data = JSON.parse(responseText)
      
      if (Array.isArray(data)) {
        logSuccess(`Returned ${data.length} items`)
        if (data.length > 0 && data[0].json) {
          const site = data[0].json
          logInfo(`Sample site: ${site.website} (DA: ${site.domainAuthority}, Niche: ${site.niche})`)
        }
      } else {
        logWarning(`Unexpected response format: ${typeof data}`)
      }

    } catch (error) {
      logError(`Test failed: ${error.message}`)
    }
  }
}

// Test 3: Categories API
async function testCategoriesAPI() {
  logHeader('TEST 3: Categories API')
  
  const testQueries = [
    'tech',
    'health',
    'finance',
    'travel',
    'food'
  ]

  for (const query of testQueries) {
    logInfo(`\nTesting category query: "${query}"`)
    
    try {
      const response = await fetch(CATEGORIES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'OMS-Test-Script/1.0'
        },
        body: JSON.stringify({
          query: query,
          limit: 10
        })
      })

      logInfo(`Status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        logError(`Error: ${errorText}`)
        continue
      }

      const responseText = await response.text()
      const data = JSON.parse(responseText)
      
      if (Array.isArray(data)) {
        logSuccess(`Returned ${data.length} categories`)
        data.slice(0, 3).forEach((cat, index) => {
          logInfo(`  ${index + 1}. ${cat.category || cat.name || cat}`)
        })
      } else if (data && data.categories) {
        logSuccess(`Returned ${data.categories.length} categories`)
        data.categories.slice(0, 3).forEach((cat, index) => {
          logInfo(`  ${index + 1}. ${cat.category || cat.name || cat}`)
        })
      } else {
        logWarning(`Unexpected response format: ${typeof data}`)
        logInfo(`Response: ${JSON.stringify(data, null, 2)}`)
      }

    } catch (error) {
      logError(`Test failed: ${error.message}`)
    }
  }
}

// Test 4: Error scenarios
async function testErrorScenarios() {
  logHeader('TEST 4: Error Scenarios')
  
  const errorTests = [
    {
      name: 'GET request (should fail)',
      method: 'GET',
      body: null
    },
    {
      name: 'Invalid JSON body',
      method: 'POST',
      body: 'invalid json'
    },
    {
      name: 'Empty body',
      method: 'POST',
      body: ''
    },
    {
      name: 'Very large limit',
      method: 'POST',
      body: JSON.stringify({ limit: 10000 })
    }
  ]

  for (const test of errorTests) {
    logInfo(`\nTesting: ${test.name}`)
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'OMS-Test-Script/1.0'
        },
        body: test.body
      })

      logInfo(`Status: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        logWarning(`Expected error but got success`)
      } else {
        const errorText = await response.text()
        logInfo(`Error Response: ${errorText}`)
      }

    } catch (error) {
      logInfo(`Caught Error: ${error.message}`)
    }
  }
}

// Test 5: Performance test
async function testPerformance() {
  logHeader('TEST 5: Performance Test')
  
  const iterations = 3
  const times = []
  
  for (let i = 0; i < iterations; i++) {
    logInfo(`Performance test ${i + 1}/${iterations}`)
    
    const startTime = Date.now()
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'OMS-Test-Script/1.0'
        },
        body: JSON.stringify({ limit: 20 })
      })

      const responseText = await response.text()
      const endTime = Date.now()
      const duration = endTime - startTime
      
      times.push(duration)
      
      if (response.ok) {
        logSuccess(`Request completed in ${duration}ms`)
      } else {
        logError(`Request failed in ${duration}ms`)
      }
      
    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - startTime
      times.push(duration)
      logError(`Request failed in ${duration}ms: ${error.message}`)
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    
    logInfo(`\nPerformance Summary:`)
    logInfo(`  Average: ${avgTime.toFixed(2)}ms`)
    logInfo(`  Min: ${minTime}ms`)
    logInfo(`  Max: ${maxTime}ms`)
  }
}

// Main test runner
async function runTests() {
  logHeader('OMS API Test Suite')
  logInfo(`Testing API endpoints:`)
  logInfo(`  Main API: ${API_BASE_URL}`)
  logInfo(`  Categories API: ${CATEGORIES_API_URL}`)
  logInfo(`  Test started at: ${new Date().toISOString()}`)
  
  const results = {
    basicConnectivity: false,
    filters: false,
    categories: false,
    errors: false,
    performance: false
  }
  
  try {
    results.basicConnectivity = await testBasicConnectivity()
    results.filters = await testWithFilters()
    results.categories = await testCategoriesAPI()
    results.errors = await testErrorScenarios()
    results.performance = await testPerformance()
  } catch (error) {
    logError(`Test suite failed: ${error.message}`)
  }
  
  // Summary
  logHeader('TEST SUMMARY')
  logInfo(`Basic Connectivity: ${results.basicConnectivity ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Filter Tests: ${results.filters ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Categories API: ${results.categories ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Error Scenarios: ${results.errors ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Performance: ${results.performance ? '✅ PASS' : '❌ FAIL'}`)
  
  const passedTests = Object.values(results).filter(Boolean).length
  const totalTests = Object.keys(results).length
  
  logInfo(`\nOverall: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    logSuccess('All tests passed! 🎉')
  } else {
    logWarning('Some tests failed. Check the output above for details.')
  }
  
  logInfo(`\nTest completed at: ${new Date().toISOString()}`)
}

// Run the tests
runTests().catch(console.error)
