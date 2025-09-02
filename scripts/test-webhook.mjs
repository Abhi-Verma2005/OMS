const API_BASE_URL = 'https://agents.outreachdeal.com/webhook/dummy-data'

async function postJson(url, payload) {
  console.log('[Payload]', JSON.stringify(payload, null, 2))
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'OMS-Test-Client/1.0',
    },
    body: JSON.stringify(payload),
  })

  const status = `${res.status} ${res.statusText}`
  const headers = Object.fromEntries(res.headers.entries())
  const raw = await res.text()
  let json
  try {
    json = raw ? JSON.parse(raw) : null
  } catch (e) {
    json = null
  }
  return { ok: res.ok, status, headers, raw, json }
}

async function main() {
  console.log('Testing webhook without filters...')
  let result = await postJson(API_BASE_URL, { limit: 5, domainAuthority: { min: 50, max: 75 } })
  console.log('Status:', result.status)
  console.log('Response headers:', result.headers)
  console.log('Parsed JSON:', result.json ? '[ok]' : '[none]')
  if (!result.json) {
    console.log('Raw body:', result.raw)
  } else {
    if (Array.isArray(result.json)) {
      console.log('Array length:', result.json.length)
      if (result.json.length > 0) {
        console.log('First item:')
        console.dir(result.json[0], { depth: null })
      }
    } else if (result.json && typeof result.json === 'object') {
      console.log('Top-level keys:', Object.keys(result.json))
      console.dir(result.json, { depth: null })
    } else {
      console.log('Value:', result.json)
    }
  }

  console.log('\nTesting webhook with filters (exact raw JSON from curl)...')
  const rawJsonFromCurl = '{"filters": "\\"domainAuthority\\" > 50 AND \\"pageAuthority\\" > 75", "limit": 5}'
  const res2 = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'OMS-Test-Client/1.0',
    },
    body: rawJsonFromCurl,
  })
  const status2 = `${res2.status} ${res2.statusText}`
  const headers2 = Object.fromEntries(res2.headers.entries())
  const raw2 = await res2.text()
  let json2
  try { json2 = raw2 ? JSON.parse(raw2) : null } catch { json2 = null }
  result = { ok: res2.ok, status: status2, headers: headers2, raw: raw2, json: json2 }
  console.log('Status:', result.status)
  console.log('Response headers:', result.headers)
  console.log('Parsed JSON:', result.json ? '[ok]' : '[none]')
  if (result.json) {
    if (Array.isArray(result.json)) {
      console.log('Items:', result.json.length)
    } else if (Array.isArray(result.json?.data)) {
      console.log('Items:', result.json.data.length)
    } else {
      console.log('Top-level keys:', Object.keys(result.json))
    }
  } else {
    console.log('Raw body:', result.raw)
  }
}

main().catch((e) => {
  console.error('Test failed:', e)
  process.exitCode = 1
})


