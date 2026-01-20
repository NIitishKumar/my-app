const http = require('http');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmYwYzIyMTc5NmNmMTAyOGQyMjQ3MyIsImVtYWlsIjoiam9obi5kb2VAc2Nob29sLmNvbSIsInJvbGUiOiJTVFVERU5UIiwiZW1wbG95ZWVJZCI6bnVsbCwic3R1ZGVudElkIjoiU1RVMDAyIiwiaWF0IjoxNzY4ODg1Mjg2LCJleHAiOjE3Njg5NzE2ODZ9.LYalZRjnNTB74fERjNqbt7b25WGHi4GsMjp6i4uOx9w";

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            error: true,
            raw: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testAttendance() {
  console.log('=== Testing Student Attendance Module (Verbose Mode) ===\n');

  // Test 1: Get Attendance Records
  console.log('Test 1: GET /api/student/attendance');
  console.log('URL: http://localhost:3000/api/student/attendance?page=1&limit=10');
  try {
    const result1 = await makeRequest('/api/student/attendance?page=1&limit=10');
    console.log('Status Code:', result1.statusCode);
    console.log('Response:', JSON.stringify(result1.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 2: Get Attendance Stats
  console.log('Test 2: GET /api/student/attendance/stats');
  console.log('URL: http://localhost:3000/api/student/attendance/stats?period=month');
  try {
    const result2 = await makeRequest('/api/student/attendance/stats?period=month');
    console.log('Status Code:', result2.statusCode);
    console.log('Response:', JSON.stringify(result2.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 3: Get Calendar
  console.log('Test 3: GET /api/student/attendance/calendar');
  console.log('URL: http://localhost:3000/api/student/attendance/calendar?year=2026&month=1');
  try {
    const result3 = await makeRequest('/api/student/attendance/calendar?year=2026&month=1');
    console.log('Status Code:', result3.statusCode);
    console.log('Response:', JSON.stringify(result3.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 4: Get Attendance with filters
  console.log('Test 4: GET /api/student/attendance?status=present');
  console.log('URL: http://localhost:3000/api/student/attendance?status=present&limit=5');
  try {
    const result4 = await makeRequest('/api/student/attendance?status=present&limit=5');
    console.log('Status Code:', result4.statusCode);
    console.log('Response:', JSON.stringify(result4.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
  }
  console.log('\n' + '='.repeat(80) + '\n');
}

testAttendance().catch(console.error);
