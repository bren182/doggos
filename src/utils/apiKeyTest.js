/**
 * Utility to test the API Ninjas key validity
 * Run this with: node src/utils/apiKeyTest.js
 */

const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;
const TEST_URL = 'https://api.api-ninjas.com/v1/quotes?category=inspirational';

async function testApiKey() {
  console.log('Testing API key validity...');
  console.log(`API key length: ${API_KEY.length}`);
  console.log(`First few characters: ${API_KEY.substring(0, 3)}...`);

  try {
    const headers = new Headers();
    headers.append('X-Api-Key', API_KEY);
    
    console.log('Making test request to API Ninjas...');
    const response = await fetch(TEST_URL, {
      method: 'GET',
      headers: headers
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API key is valid! Sample response:');
      console.log(JSON.stringify(data, null, 2));
      return true;
    } else {
      const errorText = await response.text();
      console.error('API key validation failed:');
      console.error(`Status: ${response.status}`);
      console.error(`Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error('Error testing API key:', error.message);
    return false;
  }
}

// Run the test
testApiKey();
