import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const here = new URL('./', import.meta.url);

test('quality workflow runs every configured test', async () => {
  const [workflow, gates] = await Promise.all([
    readFile(new URL('quality.yml', here), 'utf8'),
    readFile(new URL('../../hard-eng.gates.json', here), 'utf8').then(JSON.parse),
  ]);

  assert.match(workflow, /\non:\n  push:\n    branches: \[master\]\n  pull_request:/u);
  assert.match(workflow, /permissions:\n  contents: read\n  checks: read/u);
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/u);
  assert.match(workflow, /fetch-depth: 0\n          persist-credentials: false/u);
  assert.match(workflow, /pnpm\/setup@703c52620218391530e48b9e8870d5c0082e1b9b/u);
  assert.match(workflow, /version: latest/u);
  assert.match(workflow, /runtime: node@26/u);
  assert.match(workflow, /install: false/u);
  assert.match(workflow, /python \.hooks\/hard-eng\.py check --base "\$BASE_SHA"/u);
  assert.equal(gates.shipping.base, 'master');
  assert.deepEqual(gates.shipping.checks, ['Tests']);

  const formattingIndex = gates.shared.findIndex((gate) => gate.name === 'skill-format');
  const contractsIndex = gates.shared.findIndex((gate) => gate.name === 'skill-contracts');
  assert.ok(formattingIndex >= 0, 'quality must check JavaScript skill formatting with Biome');
  assert.ok(formattingIndex < contractsIndex, 'quality must check formatting before skill contracts');
  assert.deepEqual(gates.shared[formattingIndex].command, [
    'biome',
    'check',
    '--vcs-enabled=false',
    '--linter-enabled=false',
    '--assist-enabled=false',
    '--indent-style=space',
    '--line-width=140',
    '--javascript-formatter-quote-style=single',
    'skills/appwrite-backend/scripts',
  ]);
  assert.deepEqual(gates.shared[contractsIndex].command, [
    'node',
    '--test',
    'skills/appwrite-backend/scripts/appwrite-query-contract.test.mjs',
    'skills/appwrite-backend/scripts/skill-safety-contract.test.mjs',
    '.github/workflows/quality-contract.test.mjs',
  ]);
});
