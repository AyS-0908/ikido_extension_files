const MAX_REQUESTS_PER_MINUTE = 10;
let requestsThisMinute = 0;
let lastResetTime = Date.now();

function checkRateLimit() {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    requestsThisMinute = 0;
    lastResetTime = now;
  }
  if (requestsThisMinute >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  requestsThisMinute++;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Replace with your actual spreadsheet ID
const SPREADSHEET_ID = '1mqkDPT1BAngyHwqTD4-N93jhnmdPHEggO1tti5UjOBE';

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey'], function(result) {
      resolve(result.apiKey);
    });
  });
}

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

async function makeRequest(method, endpoint, body = null) {
  try {
    checkRateLimit();
    await delay(100);  // Add a 100ms delay between requests
    const token = await getAccessToken();
    const apiKey = await getApiKey();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/${endpoint}?key=${apiKey}`;
    
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
}

async function addUserProfile(profile) {
  try {
    const values = [
      [
        profile.language,
        profile.role,
        profile.country,
        profile.class.join(', '),
        profile.subject.join(', '),
        profile.town,
        profile.birthDate,
        profile.gender,
        profile.email,
        new Date().toISOString(),
        1
      ]
    ];

    await makeRequest('POST', 'values/Sheet1!A:K:append', {
      valueInputOption: 'USER_ENTERED',
      values: values
    });
  } catch (error) {
    if (error.message === 'Rate limit exceeded. Please try again later.') {
      console.error('Rate limit exceeded:', error);
      // You might want to inform the user here
    } else {
      console.error('Error adding user profile to Google Sheets:', error);
    }
    throw error;
  }
}

async function incrementRequestCount(email) {
  try {
    const response = await makeRequest('GET', 'values/Sheet1!A:K');
    const rows = response.values;
    let rowIndex = rows.findIndex(row => row[8] === email);

    if (rowIndex === -1) {
      throw new Error('User not found');
    }

    const currentCount = parseInt(rows[rowIndex][10], 10) || 0;
    const newCount = currentCount + 1;

    await makeRequest('PUT', `values/Sheet1!K${rowIndex + 1}`, {
      valueInputOption: 'USER_ENTERED',
      values: [[newCount]]
    });
  } catch (error) {
    if (error.message === 'Rate limit exceeded. Please try again later.') {
      console.error('Rate limit exceeded:', error);
      // You might want to inform the user here
    } else {
      console.error('Error incrementing request count:', error);
    }
    throw error;
  }
}

export { addUserProfile, incrementRequestCount };