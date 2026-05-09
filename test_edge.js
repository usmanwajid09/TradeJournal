const BASE_URL = 'https://tradejournal-api-production.up.railway.app/api';

async function test(name, url, options) {
  console.log(`\n--- ${name} ---`);
  try {
    const res = await fetch(`${BASE_URL}${url}`, options);
    const body = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Body: ${body.substring(0, 200)}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

async function runAll() {
  // 1. NoSQL Injection
  await test('NoSQL Injection', '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: { "$gt": "" }, password: "test" })
  });

  // 2. Massive Payload
  const bigStr = "a".repeat(20000); // > 10kb
  await test('Massive Payload', '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: bigStr, password: "test" })
  });

  // 3. Invalid JSON
  await test('Invalid JSON', '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"email": "test@test.com", "passwo'
  });

  // 4. Missing email/password
  await test('Missing Fields', '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: "test@test.com" }) // missing password
  });

  // 5. Missing JWT
  await test('Missing JWT', '/trades', {
    method: 'GET'
  });

  // 6. Malformed JWT
  await test('Malformed JWT', '/trades', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer 12345invalid' }
  });

  // 7. 404 Route
  await test('404 Route', '/nonexistent', {
    method: 'GET'
  });

  console.log("\nFinished basic tests.");
}

runAll();
