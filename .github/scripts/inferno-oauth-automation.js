/**
 * Playwright script to automate Inferno SMART App Launch tests
 * Handles OAuth flow through Keycloak automatically
 */

const { chromium } = require('playwright');

const INFERNO_URL = process.env.INFERNO_URL || 'http://localhost:4567';
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const FHIR_SERVER_URL = process.env.FHIR_SERVER_URL || 'http://localhost:8445/proxy-smart-backend/hapi-fhir-server/R4';
const TEST_SUITE = process.env.TEST_SUITE || 'smart_stu2_2';

// Keycloak test user credentials
const KC_USERNAME = process.env.KC_USERNAME || 'testuser';
const KC_PASSWORD = process.env.KC_PASSWORD || 'testpass';

// Inferno client configuration
const CLIENT_ID = process.env.CLIENT_ID || 'inferno-test-client';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForInferno() {
  console.log('Checking Inferno availability...');
  for (let i = 0; i < 30; i++) {
    try {
      const response = await fetch(`${INFERNO_URL}/api/test_suites`);
      if (response.ok) {
        console.log('✓ Inferno is ready');
        return true;
      }
    } catch (e) {
      // Inferno not ready yet
    }
    await sleep(2000);
  }
  throw new Error('Inferno failed to start');
}

async function createTestSession() {
  console.log(`Creating test session for suite: ${TEST_SUITE}`);
  
  const response = await fetch(`${INFERNO_URL}/api/test_sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_suite_id: TEST_SUITE,
      suite_options: {}
    })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create test session: ${response.status} - ${text}`);
  }
  
  const session = await response.json();
  console.log(`✓ Created test session: ${session.id}`);
  return session;
}

async function getTestGroups(suiteId) {
  const response = await fetch(`${INFERNO_URL}/api/test_suites/${suiteId}`);
  if (!response.ok) {
    throw new Error(`Failed to get test suite: ${response.status}`);
  }
  const suite = await response.json();
  return suite.test_groups || [];
}

async function runTestGroup(sessionId, groupId, inputs) {
  console.log(`Starting test group: ${groupId}`);
  
  // Note: The Inferno API endpoint is /api/test_runs, not /api/test_sessions/{id}/test_runs
  const response = await fetch(`${INFERNO_URL}/api/test_runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_session_id: sessionId,
      test_group_id: groupId,
      inputs: inputs
    })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to start test run: ${response.status} - ${text}`);
  }
  
  const run = await response.json();
  console.log(`✓ Started test run: ${run.id}`);
  return run;
}

async function waitForTestResult(sessionId, runId, browser, page) {
  console.log(`Waiting for test run ${runId} to complete...`);
  
  const maxWait = 120000; // 2 minutes
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    const response = await fetch(`${INFERNO_URL}/api/test_sessions/${sessionId}/test_runs/${runId}`);
    if (!response.ok) {
      throw new Error(`Failed to get test run status: ${response.status}`);
    }
    
    const run = await response.json();
    
    // Check if test is waiting for user action (OAuth)
    if (run.status === 'waiting') {
      console.log('Test is waiting for OAuth - checking for redirect...');
      
      // Check if there's a wait result with a redirect URL
      const results = run.results || [];
      for (const result of results) {
        if (result.result === 'wait' && result.requests) {
          for (const req of result.requests) {
            if (req.direction === 'outgoing' && req.url && req.url.includes('authorize')) {
              console.log(`Found OAuth redirect: ${req.url}`);
              await handleOAuthFlow(page, req.url);
            }
          }
        }
      }
    }
    
    if (run.status === 'done' || run.status === 'error' || run.status === 'cancelled') {
      console.log(`Test run completed with status: ${run.status}`);
      return run;
    }
    
    await sleep(2000);
  }
  
  throw new Error('Test run timed out');
}

async function handleOAuthFlow(page, authorizeUrl) {
  console.log('Handling OAuth flow...');
  
  try {
    // Navigate to the authorize URL
    await page.goto(authorizeUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Check if we're on Keycloak login page
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('keycloak') || currentUrl.includes('/auth/') || currentUrl.includes('/realms/')) {
      console.log('On Keycloak login page, entering credentials...');
      
      // Wait for and fill username
      await page.waitForSelector('#username, input[name="username"]', { timeout: 10000 });
      await page.fill('#username, input[name="username"]', KC_USERNAME);
      
      // Fill password
      await page.fill('#password, input[name="password"]', KC_PASSWORD);
      
      // Click login button
      await page.click('#kc-login, button[type="submit"], input[type="submit"]');
      
      // Wait for redirect back to Inferno
      await page.waitForURL(url => url.toString().includes('localhost:4567'), { timeout: 30000 });
      console.log('✓ OAuth flow completed, redirected back to Inferno');
    }
  } catch (error) {
    console.error('OAuth flow error:', error.message);
    // Take screenshot for debugging
    await page.screenshot({ path: 'oauth-error.png' });
    throw error;
  }
}

async function runStandalonePatientTests(browser, sessionId) {
  console.log('\n=== Running Standalone Patient App Tests ===\n');
  
  const page = await browser.newPage();
  
  // Configure inputs for standalone patient app tests
  const inputs = [
    { name: 'url', value: FHIR_SERVER_URL },
    { name: 'standalone_client_id', value: CLIENT_ID },
    { name: 'standalone_requested_scopes', value: 'launch/patient openid fhirUser patient/*.read' },
    { name: 'use_pkce', value: 'true' },
    { name: 'pkce_code_challenge_method', value: 'S256' },
    { name: 'client_auth_type', value: 'public' }
  ];
  
  try {
    // Find the standalone patient launch group
    const groups = await getTestGroups(TEST_SUITE);
    const standaloneGroup = groups.find(g => 
      g.id.includes('standalone_patient') || 
      g.title?.toLowerCase().includes('standalone patient')
    );
    
    if (!standaloneGroup) {
      console.log('Available test groups:');
      groups.forEach(g => console.log(`  - ${g.id}: ${g.title}`));
      console.log('No standalone patient test group found, skipping...');
      return null;
    }
    
    console.log(`Found test group: ${standaloneGroup.id} - ${standaloneGroup.title}`);
    
    // Start the test run
    const run = await runTestGroup(sessionId, standaloneGroup.id, inputs);
    
    // Wait for completion, handling OAuth when needed
    const result = await waitForTestResult(sessionId, run.id, browser, page);
    
    return result;
  } finally {
    await page.close();
  }
}

async function runWellKnownTests(sessionId) {
  console.log('\n=== Running SMART Discovery Tests ===\n');
  
  const inputs = [
    { name: 'url', value: FHIR_SERVER_URL }
  ];
  
  try {
    const groups = await getTestGroups(TEST_SUITE);
    
    // List all available test groups for debugging
    console.log('Available test groups:');
    groups.forEach(g => console.log(`  - ${g.id}: ${g.title || 'No title'}`));
    console.log('');
    
    // Look for discovery/well-known tests - in SMART 2.2 it might be named differently
    const discoveryGroup = groups.find(g => {
      const id = (g.id || '').toLowerCase();
      const title = (g.title || '').toLowerCase();
      return id.includes('discovery') || 
             id.includes('well_known') ||
             id.includes('smart_configuration') ||
             title.includes('discovery') ||
             title.includes('well-known') ||
             title.includes('smart configuration');
    });
    
    if (!discoveryGroup) {
      // If no specific discovery group, try to run the first available group
      if (groups.length > 0) {
        console.log(`No discovery test group found, trying first group: ${groups[0].id}`);
        const run = await runTestGroup(sessionId, groups[0].id, inputs);
        return await waitForSimpleTestCompletion(sessionId, run.id);
      }
      console.log('No test groups available');
      return null;
    }
    
    console.log(`Found test group: ${discoveryGroup.id} - ${discoveryGroup.title}`);
    
    const run = await runTestGroup(sessionId, discoveryGroup.id, inputs);
    return await waitForSimpleTestCompletion(sessionId, run.id);
    
  } catch (error) {
    console.error('Discovery tests error:', error.message);
    return null;
  }
}

async function waitForSimpleTestCompletion(sessionId, runId) {
  const maxWait = 120000; // 2 minutes
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    const response = await fetch(`${INFERNO_URL}/api/test_sessions/${sessionId}/test_runs/${runId}`);
    const runStatus = await response.json();
    
    if (runStatus.status === 'done' || runStatus.status === 'error' || runStatus.status === 'cancelled') {
      console.log(`Test completed with status: ${runStatus.status}`);
      return runStatus;
    }
    
    // Log current progress
    if (runStatus.results && runStatus.results.length > 0) {
      const passed = runStatus.results.filter(r => r.result === 'pass').length;
      const failed = runStatus.results.filter(r => r.result === 'fail').length;
      console.log(`  Progress: ${passed} passed, ${failed} failed, ${runStatus.results.length} total`);
    }
    
    await sleep(2000);
  }
  
  throw new Error('Test run timed out');
}

async function getSessionResults(sessionId) {
  const response = await fetch(`${INFERNO_URL}/api/test_sessions/${sessionId}/results`);
  if (!response.ok) {
    throw new Error(`Failed to get session results: ${response.status}`);
  }
  return response.json();
}

async function printResults(results) {
  console.log('\n========================================');
  console.log('          TEST RESULTS SUMMARY          ');
  console.log('========================================\n');
  
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const result of results) {
    const status = result.result || 'unknown';
    const title = result.test?.title || result.test_id || 'Unknown test';
    
    switch (status) {
      case 'pass':
        passed++;
        console.log(`✓ PASS: ${title}`);
        break;
      case 'fail':
        failed++;
        console.log(`✗ FAIL: ${title}`);
        if (result.messages) {
          result.messages.forEach(m => console.log(`    ${m.message}`));
        }
        break;
      case 'skip':
        skipped++;
        console.log(`○ SKIP: ${title}`);
        break;
      case 'error':
        errors++;
        console.log(`⚠ ERROR: ${title}`);
        break;
      default:
        console.log(`? ${status.toUpperCase()}: ${title}`);
    }
  }
  
  console.log('\n========================================');
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped} | Errors: ${errors}`);
  console.log('========================================\n');
  
  return { passed, failed, skipped, errors, total: results.length };
}

async function main() {
  console.log('========================================');
  console.log('  Inferno SMART App Launch Test Runner  ');
  console.log('========================================\n');
  
  console.log('Configuration:');
  console.log(`  Inferno URL: ${INFERNO_URL}`);
  console.log(`  FHIR Server: ${FHIR_SERVER_URL}`);
  console.log(`  Test Suite: ${TEST_SUITE}`);
  console.log(`  Client ID: ${CLIENT_ID}`);
  console.log('');
  
  let browser;
  
  try {
    // Wait for Inferno to be ready
    await waitForInferno();
    
    // Launch browser for OAuth automation
    console.log('Launching browser for OAuth automation...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create test session
    const session = await createTestSession();
    
    // Run well-known configuration tests (no OAuth needed)
    const wellKnownResult = await runWellKnownTests(session.id);
    
    // Run standalone patient tests (requires OAuth)
    // const standaloneResult = await runStandalonePatientTests(browser, session.id);
    
    // Get all results
    const results = await getSessionResults(session.id);
    const summary = await printResults(results);
    
    // Output for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      const fs = require('fs');
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `passed=${summary.passed}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `failed=${summary.failed}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `total=${summary.total}\n`);
    }
    
    // Exit with error if any tests failed
    if (summary.failed > 0 || summary.errors > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Test execution failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
