import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const here = new URL("./", import.meta.url);

test("quality workflow runs every configured test", async () => {
  const [workflow, gates] = await Promise.all([
    readFile(new URL("quality.yml", here), "utf8"),
    readFile(new URL("../../hard-eng.gates.json", here), "utf8").then(
      JSON.parse,
    ),
  ]);

  assert.match(workflow, /\non:\n  push:\n  pull_request:/u);
  assert.match(workflow, /permissions:\n  contents: read/u);
  assert.match(workflow, /actions\/checkout@v6/u);
  assert.match(workflow, /actions\/setup-node@v7/u);
  assert.match(workflow, /node-version: 26/u);
  assert.match(workflow, /package-manager-cache: false/u);

  const formattingCheck = [
    "npx --yes @biomejs/biome@2.5.11 check",
    "--vcs-enabled=false",
    "--linter-enabled=false",
    "--assist-enabled=false",
    "--indent-style=space",
    "--line-width=140",
    "--javascript-formatter-quote-style=single",
    "skills/appwrite-backend/scripts",
  ].join("\n          ");
  const formattingIndex = workflow.indexOf(formattingCheck);
  const contractsIndex = workflow.indexOf("node --test");
  assert.ok(
    formattingIndex >= 0,
    "quality workflow must check JavaScript skill formatting with Biome",
  );
  assert.ok(
    formattingIndex < contractsIndex,
    "quality workflow must check formatting before skill contracts",
  );

  let previous = -1;
  for (const path of gates.families.tests) {
    const current = workflow.indexOf(path);
    assert.ok(current > previous, `quality workflow is missing or reorders ${path}`);
    previous = current;
  }
});
