#!/usr/bin/env node

/**
 * Niche Recommendations API Test Script for OMS
 * 
 * This script tests the niche recommendations functionality that's used
 * in the filter page when users type in the niche field.
 * 
 * Requires Node.js 18+ for built-in fetch support
 */

// API endpoints
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

// Test the fetchCategoryRecommendations function logic
async function fetchCategoryRecommendations(query) {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    logInfo(`Fetching category recommendations for: "${query}"`)
    
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        limit: 10
      }),
    })

    logInfo(`Response Status: ${response.status} ${response.statusText}`)
    logInfo(`Response Headers:`)
    for (const [key, value] of response.headers.entries()) {
      log(`  ${key}: ${value}`, 'cyan')
    }

    if (!response.ok) {
      const errorText = await response.text()
      logError(`API Error Response: ${errorText}`)
      
      if (response.status === 404) {
        throw new Error(`Categories API endpoint not found: ${CATEGORIES_API_URL}`)
      }
      
      throw new Error(`Categories API request failed: ${response.status} ${response.statusText}`)
    }

    const responseText = await response.text()
    if (!responseText || responseText.trim() === '') {
      logWarning('Categories API returned empty body.')
      return []
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      logError(`Failed to parse categories API response as JSON. Raw response: ${responseText}`)
      throw new Error('Unexpected categories API response: not valid JSON')
    }

    logInfo(`Raw Response Data: ${JSON.stringify(data, null, 2)}`)
    
    // Handle different possible response formats
    if (Array.isArray(data)) {
      const recommendations = data.map((item) => ({
        category: item.category || item.name || item,
        count: item.count,
        relevance: item.relevance
      }))
      logSuccess(`Parsed ${recommendations.length} recommendations from array format`)
      return recommendations
    }
    
    // If it's an object with categories array
    if (data && typeof data === 'object' && Array.isArray(data.categories)) {
      const recommendations = data.categories.map((item) => ({
        category: item.category || item.name || item,
        count: item.count,
        relevance: item.relevance
      }))
      logSuccess(`Parsed ${recommendations.length} recommendations from object.categories format`)
      return recommendations
    }
    
    // If it's a single category string
    if (typeof data === 'string') {
      const recommendations = [{ category: data }]
      logSuccess(`Parsed single category from string format`)
      return recommendations
    }
    
    logWarning(`Unexpected response format: ${typeof data}`)
    return []
  } catch (error) {
    logError(`Error fetching category recommendations: ${error.message}`)
    
    // If it's a network error, provide a helpful message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the categories API.')
    }
    
    throw error
  }
}

// Test 1: Basic niche recommendations
async function testBasicNicheRecommendations() {
  logHeader('TEST 1: Basic Niche Recommendations')
  
  const testQueries = [
    'tech',
    'health',
    'finance',
    'travel',
    'food',
    'fashion',
    'business',
    'education'
  ]

  for (const query of testQueries) {
    logInfo(`\nTesting query: "${query}"`)
    
    try {
      const recommendations = await fetchCategoryRecommendations(query)
      
      if (recommendations.length > 0) {
        logSuccess(`Found ${recommendations.length} recommendations:`)
        recommendations.forEach((rec, index) => {
          const countStr = rec.count ? ` (${rec.count} sites)` : ''
          const relevanceStr = rec.relevance ? ` [relevance: ${rec.relevance}]` : ''
          log(`  ${index + 1}. ${rec.category}${countStr}${relevanceStr}`, 'white')
        })
      } else {
        logWarning(`No recommendations found for "${query}"`)
      }
      
    } catch (error) {
      logError(`Test failed for "${query}": ${error.message}`)
    }
  }
}

// Test 2: Edge cases
async function testEdgeCases() {
  logHeader('TEST 2: Edge Cases')
  
  const edgeCases = [
    { query: '', description: 'Empty string' },
    { query: 'a', description: 'Single character (should be ignored)' },
    { query: '   ', description: 'Whitespace only' },
    { query: 'verylongquerythatmightnotexist', description: 'Very long query' },
    { query: '123', description: 'Numbers only' },
    { query: '!@#$%', description: 'Special characters' },
    { query: 'tech health finance', description: 'Multiple words' }
  ]

  for (const testCase of edgeCases) {
    logInfo(`\nTesting: ${testCase.description} - "${testCase.query}"`)
    
    try {
      const recommendations = await fetchCategoryRecommendations(testCase.query)
      
      if (recommendations.length > 0) {
        logSuccess(`Found ${recommendations.length} recommendations`)
        recommendations.slice(0, 3).forEach((rec, index) => {
          log(`  ${index + 1}. ${rec.category}`, 'white')
        })
        if (recommendations.length > 3) {
          log(`  ... and ${recommendations.length - 3} more`, 'cyan')
        }
      } else {
        logInfo(`No recommendations (expected for some edge cases)`)
      }
      
    } catch (error) {
      logError(`Test failed: ${error.message}`)
    }
  }
}

// Test 3: Performance test
async function testPerformance() {
  logHeader('TEST 3: Performance Test')
  
  const testQueries = ['tech', 'health', 'finance', 'travel', 'food']
  const iterations = 2
  const times = []
  
  for (const query of testQueries) {
    logInfo(`\nPerformance test for "${query}"`)
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()
      
      try {
        await fetchCategoryRecommendations(query)
        const endTime = Date.now()
        const duration = endTime - startTime
        times.push(duration)
        logSuccess(`Request ${i + 1} completed in ${duration}ms`)
        
      } catch (error) {
        const endTime = Date.now()
        const duration = endTime - startTime
        times.push(duration)
        logError(`Request ${i + 1} failed in ${duration}ms: ${error.message}`)
      }
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

// Test 4: Response format validation
async function testResponseFormats() {
  logHeader('TEST 4: Response Format Validation')
  
  const testQuery = 'tech'
  logInfo(`Testing response format for query: "${testQuery}"`)
  
  try {
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: testQuery,
        limit: 10
      }),
    })

    if (!response.ok) {
      logError(`API Error: ${response.status} ${response.statusText}`)
      return
    }

    const responseText = await response.text()
    logInfo(`Response Length: ${responseText.length} characters`)
    
    try {
      const data = JSON.parse(responseText)
      logSuccess(`Response is valid JSON`)
      logInfo(`Response Type: ${Array.isArray(data) ? 'Array' : typeof data}`)
      
      if (Array.isArray(data)) {
        logInfo(`Array Length: ${data.length}`)
        if (data.length > 0) {
          logInfo(`First Item Structure:`)
          log(JSON.stringify(data[0], null, 2), 'cyan')
        }
      } else if (data && typeof data === 'object') {
        logInfo(`Object Keys: ${Object.keys(data).join(', ')}`)
        if (data.categories && Array.isArray(data.categories)) {
          logInfo(`Categories Array Length: ${data.categories.length}`)
          if (data.categories.length > 0) {
            logInfo(`First Category Structure:`)
            log(JSON.stringify(data.categories[0], null, 2), 'cyan')
          }
        }
      }
      
    } catch (parseError) {
      logError(`Failed to parse JSON: ${parseError.message}`)
      logInfo(`Raw Response (first 500 chars): ${responseText.substring(0, 500)}`)
    }

  } catch (error) {
    logError(`Test failed: ${error.message}`)
  }
}

// Test 5: Simulate real user interaction
async function testUserInteraction() {
  logHeader('TEST 5: Simulate Real User Interaction')
  
  const userTypingSequence = ['t', 'te', 'tec', 'tech', 'techno', 'technology']
  
  logInfo('Simulating user typing "technology" character by character...')
  
  for (let i = 0; i < userTypingSequence.length; i++) {
    const currentQuery = userTypingSequence[i]
    logInfo(`\nUser typed: "${currentQuery}"`)
    
    try {
      const recommendations = await fetchCategoryRecommendations(currentQuery)
      
      if (recommendations.length > 0) {
        logSuccess(`Found ${recommendations.length} recommendations:`)
        recommendations.slice(0, 3).forEach((rec, index) => {
          log(`  ${index + 1}. ${rec.category}`, 'white')
        })
        if (recommendations.length > 3) {
          log(`  ... and ${recommendations.length - 3} more`, 'cyan')
        }
      } else {
        logInfo(`No recommendations yet (query too short or no matches)`)
      }
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      logError(`Error for query "${currentQuery}": ${error.message}`)
    }
  }
}

// Main test runner
async function runTests() {
  logHeader('OMS Niche Recommendations Test Suite')
  logInfo(`Testing Categories API: ${CATEGORIES_API_URL}`)
  logInfo(`Test started at: ${new Date().toISOString()}`)
  
  const results = {
    basicRecommendations: false,
    edgeCases: false,
    performance: false,
    responseFormats: false,
    userInteraction: false
  }
  
  try {
    results.basicRecommendations = await testBasicNicheRecommendations()
    results.edgeCases = await testEdgeCases()
    results.performance = await testPerformance()
    results.responseFormats = await testResponseFormats()
    results.userInteraction = await testUserInteraction()
  } catch (error) {
    logError(`Test suite failed: ${error.message}`)
  }
  
  // Summary
  logHeader('TEST SUMMARY')
  logInfo(`Basic Recommendations: ${results.basicRecommendations ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Edge Cases: ${results.edgeCases ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Performance: ${results.performance ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`Response Formats: ${results.responseFormats ? '✅ PASS' : '❌ FAIL'}`)
  logInfo(`User Interaction: ${results.userInteraction ? '✅ PASS' : '❌ FAIL'}`)
  
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
