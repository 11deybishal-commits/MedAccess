import fetch from 'node-fetch';

async function testAuth() {
  console.log('--- Testing Registration ---');
  const timestamp = Date.now();
  const testUser = {
    name: 'Test CC User',
    email: `test_cc_${timestamp}@example.com`,
    password: 'password123',
    city: 'New York',
    phone: '1234567890'
  };

  try {
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const regData = await regRes.json();
    console.log('Register Status:', regRes.status);
    console.log('Register Response:', regData);

    console.log('\n--- Testing Login ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status);
    console.log('Login Response:', loginData);

  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

testAuth();
