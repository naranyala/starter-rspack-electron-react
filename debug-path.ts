import * as path from 'path';

const maliciousPaths = [
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32\\config\\sam',
  '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
];

maliciousPaths.forEach(pathStr => {
  console.log('Original:', pathStr);
  const decoded = pathStr.replace(/%2e/g, '.').replace(/%2f/g, '/');
  console.log('Decoded:', decoded);
  const normalized = path.normalize(decoded);
  console.log('Normalized:', normalized);
  const parts = normalized.split(/[\/\\]/);
  console.log('Parts:', parts);
  console.log('Has ..:', parts.includes('..'));
  console.log('---');
});