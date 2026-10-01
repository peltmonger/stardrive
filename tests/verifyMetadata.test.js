import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { verifyMetadata } from '../scripts/verifyMetadata.js';

function makeFixture({ packageVersion = '1.6.0', stardriveVersion = '1.6.0', lockVersion = '1.6.0', lockfileVersion = lockVersion } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'stardrive-metadata-'));
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(join(root, 'package.json'), JSON.stringify({ version: packageVersion, stardriveVersion }, null, 2));
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(join(root, 'package-lock.json'), JSON.stringify({ version: lockfileVersion, packages: { '': { version: lockVersion } } }, null, 2));
  return root;
}

test('verifyMetadata rejects a stardriveVersion that differs from package version', () => {
  const root = makeFixture({ stardriveVersion: '1.5.15' });

  try {
    assert.throws(() => verifyMetadata(root), /stardriveVersion.*1\.6\.0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('verifyMetadata rejects a package-lock root version that differs from package version', () => {
  const root = makeFixture({ lockVersion: '1.5.15', lockfileVersion: '1.6.0' });

  try {
    assert.throws(() => verifyMetadata(root), /package-lock\.json root version.*1\.6\.0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('verifyMetadata rejects a package-lock metadata version that differs from package version', () => {
  const root = makeFixture({ lockfileVersion: '1.5.15' });

  try {
    assert.throws(() => verifyMetadata(root), /package-lock\.json version.*1\.6\.0/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
