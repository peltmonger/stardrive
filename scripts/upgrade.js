import { execSync, spawnSync } from 'node:child_process';

const UPSTREAM_URL = 'https://github.com/Peltmonger/stardrive.git';
const UPSTREAM_REMOTE = 'stardrive-upstream';

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...opts }).trim();

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  const result = spawnSync(cmd, {
    stdio: 'inherit',
    shell: true,
  });
  return result.status ?? 1;
};

const fail = (msg) => {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
};

try {
  sh('git rev-parse --is-inside-work-tree');
} catch {
  fail('Not inside a git repository.');
}

try {
  const dirty = sh('git status --porcelain');
  if (dirty) {
    fail('Working tree has uncommitted changes. Commit or stash them before upgrading.');
  }
} catch {
  fail('Failed to check git status.');
}

let remotes = '';
try {
  remotes = sh('git remote');
} catch {
  fail('Failed to list git remotes.');
}

const hasUpstream = remotes.split('\n').includes(UPSTREAM_REMOTE);
if (!hasUpstream) {
  console.log(`Adding remote "${UPSTREAM_REMOTE}" -> ${UPSTREAM_URL}`);
  if (run(`git remote add ${UPSTREAM_REMOTE} ${UPSTREAM_URL}`) !== 0) {
    fail('Failed to add upstream remote.');
  }
} else {
  try {
    const currentUrl = sh(`git remote get-url ${UPSTREAM_REMOTE}`);
    if (currentUrl.toLowerCase() !== UPSTREAM_URL.toLowerCase()) {
      console.log(`Updating remote "${UPSTREAM_REMOTE}" URL to ${UPSTREAM_URL}`);
      run(`git remote set-url ${UPSTREAM_REMOTE} ${UPSTREAM_URL}`);
    }
  } catch {
    /* ignore */
  }
}

console.log(`\nFetching tags from ${UPSTREAM_REMOTE}...`);
if (run(`git fetch --tags --force ${UPSTREAM_REMOTE}`) !== 0) {
  fail('Failed to fetch from upstream.');
}

let tags = [];
try {
  const raw = sh(`git ls-remote --tags --refs ${UPSTREAM_REMOTE}`);
  tags = raw
    .split('\n')
    .map((line) => line.split('refs/tags/')[1])
    .filter(Boolean);
} catch {
  fail('Failed to list upstream tags.');
}

if (tags.length === 0) {
  fail('No tags found on upstream repository.');
}

const semverRe = /^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/;
const semverTags = tags
  .filter((t) => semverRe.test(t))
  .map((t) => {
    const [, a, b, c] = t.match(semverRe);
    return { tag: t, parts: [Number(a), Number(b), Number(c)] };
  })
  .sort((x, y) => {
    for (let i = 0; i < 3; i++) {
      if (x.parts[i] !== y.parts[i]) return y.parts[i] - x.parts[i];
    }
    return 0;
  });

const latestTag = semverTags[0]?.tag ?? tags.sort().reverse()[0];

console.log(`\nLatest upstream tag: ${latestTag}`);

const mergeStatus = run(`git merge --no-edit refs/tags/${latestTag}`);

if (mergeStatus !== 0) {
  console.error('\n✖ Merge resulted in conflicts (or otherwise failed). Aborting merge.');
  run('git merge --abort');
  console.error('\nPlease pull and merge upstream manually:\n' + `  git fetch ${UPSTREAM_REMOTE} --tags\n` + `  git merge ${latestTag}\n` + 'and resolve any conflicts before re-running the upgrade.');
  process.exit(1);
}

console.log('\n✓ Merge succeeded. Installing dependencies...');
if (run('npm install') !== 0) {
  fail('`npm install` failed.');
}

console.log('\nRunning npm run fix...');
if (run('npm run fix') !== 0) {
  fail('`npm run fix` failed.');
}

console.log(`\n✓ Upgraded to upstream ${latestTag}.`);
