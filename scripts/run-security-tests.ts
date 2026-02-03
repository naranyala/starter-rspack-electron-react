#!/usr/bin/env bun

import { $ } from 'bun';

async function runSecurityTests() {
  console.log('\x1b[34m%s\x1b[0m', '\n🔒 Running Security Tests...\n'); // Blue color

  try {
    // Run the security tests
    console.log('\x1b[33m%s\x1b[0m', '🧪 Executing security test suite...'); // Yellow color
    const testResult = await $`bun test tests/security.test.ts`.nothrow();

    if (testResult.exitCode === 0) {
      console.log('\x1b[32m%s\x1b[0m', '✅ All security tests passed!\n'); // Green color
      return true;
    } else {
      console.log('\x1b[31m%s\x1b[0m', '❌ Some security tests failed:\n'); // Red color
      console.log(testResult.stdout.toString());
      console.log('\x1b[31m%s\x1b[0m', '\n🚨 Security tests failed - please address the issues before proceeding.\n'); // Red color
      return false;
    }
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `\n💥 Error running security tests: ${error}\n`); // Red color
    return false;
  }
}

// Run the security tests
runSecurityTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Error running security tests:', error);
  process.exit(1);
});