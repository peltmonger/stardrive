import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function verifyMetadata(root) {
  const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));

  if (packageJson.stardriveVersion !== packageJson.version) {
    throw new Error(`package.json stardriveVersion ${packageJson.stardriveVersion} must match version ${packageJson.version}`);
  }

  const lockfile = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf-8'));

  if (lockfile.version !== packageJson.version) {
    throw new Error(`package-lock.json version ${lockfile.version} must match package.json version ${packageJson.version}`);
  }

  const lockRootVersion = lockfile.packages?.['']?.version;

  if (lockRootVersion !== packageJson.version) {
    throw new Error(`package-lock.json root version ${lockRootVersion} must match package.json version ${packageJson.version}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifyMetadata(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
}
