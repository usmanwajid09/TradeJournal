const BASE_URL = 'https://tradejournal-api-production.up.railway.app/api';

async function testRateLimitAuth() {
  console.log("\n--- Testing Auth Rate Limiter (20 limit) ---");
  let hitLimit = false;
  for (let i = 1; i <= 25; i++) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "spam@spam.com", password: "test" })
    });
    if (res.status === 429) {
      console.log(`Request ${i}: Blocked by rate limiter! Status 429`);
      hitLimit = true;
      break;
    }
  }
  if (!hitLimit) console.log("Did not hit rate limit for auth.");
}

async function testRateLimitGeneral() {
  console.log("\n--- Testing General Rate Limiter (100 limit) ---");
  let hitLimit = false;
  // Send 105 requests rapidly
  const promises = [];
  for (let i = 1; i <= 105; i++) {
    promises.push(fetch(`https://tradejournal-api-production.up.railway.app/health`));
  }
  
  const results = await Promise.all(promises);
  const tooManyReqs = results.filter(r => r.status === 429);
  
  if (tooManyReqs.length > 0) {
    console.log(`General Rate Limiter triggered! ${tooManyReqs.length} requests returned 429.`);
  } else {
    console.log("Did not hit rate limit for general endpoints.");
  }
}

async function runRateLimitTests() {
  await testRateLimitAuth();
  await testRateLimitGeneral();
  console.log("\nFinished rate limit tests.");
}

runRateLimitTests();
