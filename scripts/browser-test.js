/**
 * Browser Console Test Script for OMS API
 * 
 * Copy and paste this script into your browser's developer console
 * to test the API endpoints directly from the browser.
 */

// API endpoints
const API_BASE_URL = 'https://agents.outreachdeal.com/webhook/dummy-data'
const CATEGORIES_API_URL = 'https://agents.outreachdeal.com/webhook/fetch-categories'

// Test functions
async function testBasicAPI() {
  console.log('🧪 Testing Basic API...')
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ limit: 5 })
    })

    console.log('📊 Response Status:', response.status, response.statusText)
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      return false
    }

    const responseText = await response.text()
    console.log('📄 Response Length:', responseText.length, 'characters')
    
    if (!responseText || responseText.trim() === '') {
      console.warn('⚠️ Empty response body')
      return false
    }

    const data = JSON.parse(responseText)
    console.log('✅ Successfully parsed JSON')
    console.log('📊 Response Type:', Array.isArray(data) ? 'Array' : typeof data)
    
    if (Array.isArray(data)) {
      console.log('📊 Array Length:', data.length)
      if (data.length > 0) {
        console.log('🔍 First Item Structure:', Object.keys(data[0]))
        if (data[0].json) {
          console.log('🌐 Sample Site:', {
            website: data[0].json.website,
            niche: data[0].json.niche,
            domainAuthority: data[0].json.domainAuthority,
            costPrice: data[0].json.costPrice
          })
        }
      }
    } else if (data && typeof data === 'object') {
      console.log('🔍 Object Keys:', Object.keys(data))
    }
    
    return true
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

async function testWithFilters() {
  console.log('🧪 Testing API with Filters...')
  
  const testFilters = {
    limit: 3,
    domainAuthority: { min: 20, max: 50 },
    niche: 'technology'
  }
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(testFilters)
    })

    console.log('📊 Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      return false
    }

    const data = await response.json()
    console.log('✅ Filter test successful')
    console.log('📊 Returned items:', Array.isArray(data) ? data.length : 'Not an array')
    
    return true
  } catch (error) {
    console.error('❌ Filter test failed:', error.message)
    return false
  }
}

async function testCategoriesAPI() {
  console.log('🧪 Testing Categories API...')
  
  try {
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: 'tech',
        limit: 5
      })
    })

    console.log('📊 Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Categories API Error:', errorText)
      return false
    }

    const data = await response.json()
    console.log('✅ Categories API test successful')
    console.log('📊 Response:', data)
    
    return true
  } catch (error) {
    console.error('❌ Categories test failed:', error.message)
    return false
  }
}

async function testErrorScenarios() {
  console.log('🧪 Testing Error Scenarios...')
  
  // Test GET request (should fail)
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET'
    })
    console.log('📊 GET Request Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('📄 GET Error Response:', errorText)
    }
  } catch (error) {
    console.log('📄 GET Request Error:', error.message)
  }
  
  // Test invalid JSON
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    })
    console.log('📊 Invalid JSON Status:', response.status, response.statusText)
  } catch (error) {
    console.log('📄 Invalid JSON Error:', error.message)
  }
}

async function runAllTests() {
  console.log('🚀 Starting OMS API Test Suite...')
  console.log('=' .repeat(50))
  
  const results = {
    basic: await testBasicAPI(),
    filters: await testWithFilters(),
    categories: await testCategoriesAPI(),
    errors: await testErrorScenarios()
  }
  
  console.log('=' .repeat(50))
  console.log('📊 TEST RESULTS:')
  console.log('Basic API:', results.basic ? '✅ PASS' : '❌ FAIL')
  console.log('Filters:', results.filters ? '✅ PASS' : '❌ FAIL')
  console.log('Categories:', results.categories ? '✅ PASS' : '❌ FAIL')
  console.log('Error Scenarios:', results.errors ? '✅ PASS' : '❌ FAIL')
  
  const passed = Object.values(results).filter(Boolean).length
  const total = Object.keys(results).length
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`)
  
  if (passed === total) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️ Some tests failed. Check the output above.')
  }
}

// Auto-run tests
runAllTests()

// Export functions for manual testing
window.testBasicAPI = testBasicAPI
window.testWithFilters = testWithFilters
window.testCategoriesAPI = testCategoriesAPI
window.testErrorScenarios = testErrorScenarios
window.runAllTests = runAllTests

console.log('\n💡 You can also run individual tests:')
console.log('  testBasicAPI()')
console.log('  testWithFilters()')
console.log('  testCategoriesAPI()')
console.log('  testErrorScenarios()')
console.log('  runAllTests()')
