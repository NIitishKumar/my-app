const http = require('http');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NmYwYzIyMTc5NmNmMTAyOGQyMjQ3MyIsImVtYWlsIjoiam9obi5kb2VAc2Nob29sLmNvbSIsInJvbGUiOiJTVFWRU5UIiwiZW1wbG95ZWVJZCI6bnVsbCwic3R1ZGVudElkIjoiU1RVMDAyIiwiaWF0IjoxNzY4ODg1Mjg2LCJleHAiOjE3Njg5NzE2ODZ9.LYalZRjnNTB74fERjNqbt7b25WGHi4GsMjp6i4uOx9w";

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
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: true, data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testAttendance() {
  console.log('=== Testing Student Attendance Module ===\n');

  // Test 1: Get Attendance Records
  console.log('Test 1: GET /api/student/attendance');
  const data1 = await makeRequest('/api/student/attendance?page=1&limit=10');
  console.log('Status:', data1.success ? 'Success' : 'Failed');
  console.log('Records:', data1.data?.records?.length || 0);
  console.log('Summary:', JSON.stringify(data1.data?.summary || {}, null, 2));
  console.log('');

  // Test 2: Get Attendance Stats
  console.log('Test 2: GET /api/student/attendance/stats?period=month');
  const data2 = await makeRequest('/api/student/attendance/stats?period=month');
  console.log('Status:', data2.success ? 'Success' : 'Failed');
  console.log('Overall:', JSON.stringify(data2.data?.overall || {}, null, 2));
  console.log('Monthly breakdown:', data2.data?.monthlyBreakdown?.length || 0, 'months');
  console.log('');

  // Test 3: Get Calendar
  console.log('Test 3: GET /api/student/attendance/calendar?year=2026&month=1');
  const data3 = await makeRequest('/api/student/attendance/calendar?year=2026&month=1');
  console.log('Status:', data3.success ? 'Success' : 'Failed');
  console.log('Year:', data3.data?.year);
  console.log('Month:', data3.data?.month);
  console.log('Days:', data3.data?.days?.length || 0);
  console.log('');

  // Test 4: Get Attendance with filters
  console.log('Test 4: GET /api/student/attendance?status=present');
  const data4 = await makeRequest('/api/student/attendance?status=present&limit=5');
  console.log('Status:', data4.success ? 'Success' : 'Failed');
  console.log('Present records:', data4.data?.records?.length || 0);
  console.log('');
}

testAttendance().catch(console.error);
