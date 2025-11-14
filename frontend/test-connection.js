#!/usr/bin/env node

/**
 * Frontend-Backend Connection Test
 * 
 * This script tests the connection between the frontend and backend
 * by making API calls to verify connectivity.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

console.log('🔍 Testing Frontend-Backend Connection...\n');
console.log(`API Base URL: ${API_BASE_URL}\n`);

async function testConnection() {
  const tests = [
    {
      name: 'Health Check',
      url: API_BASE_URL.replace('/api', '/'),
      method: 'GET',
    },
    {
      name: 'Register Endpoint',
      url: `${API_BASE_URL}/register`,
      method: 'POST',
      body: {
        full_name: 'Test Connection User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpass123'
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`  URL: ${test.url}`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      
      if (response.ok) {
        console.log(`  ✅ PASSED (${response.status} ${response.statusText})`);
        
        // Try to parse response
        try {
          const data = await response.text();
          if (data && data.length < 200) {
            console.log(`  Response: ${data}`);
          }
        } catch (e) {
          // Ignore parse errors
        }
        
        passed++;
      } else {
        console.log(`  ❌ FAILED (${response.status} ${response.statusText})`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ FAILED - ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════\n');

  if (failed === 0) {
    console.log('✅ All tests passed! Frontend is connected to backend.');
  } else {
    console.log('❌ Some tests failed. Check the following:');
    console.log('   1. Backend server is running on http://localhost:3000');
    console.log('   2. NEXT_PUBLIC_API_BASE_URL in .env.local is set to http://localhost:3000/api');
    console.log('   3. CORS is enabled in backend');
    console.log('   4. Database is connected');
  }

  process.exit(failed > 0 ? 1 : 0);
}

testConnection();
