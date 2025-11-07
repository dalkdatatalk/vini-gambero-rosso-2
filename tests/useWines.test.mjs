import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import test from 'node:test';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadUseWinesModule() {
  const result = await build({
    absWorkingDir: projectRoot,
    entryPoints: ['composables/useWines.ts'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    sourcemap: false,
    loader: {
      '.json': 'json',
    },
    plugins: [
      {
        name: 'nuxt-alias',
        setup(build) {
          build.onResolve({ filter: /^~\// }, (args) => {
            const basePath = path.resolve(projectRoot, args.path.slice(2));
            const candidates = [
              basePath,
              `${basePath}.ts`,
              `${basePath}.js`,
              path.join(basePath, 'index.ts'),
              path.join(basePath, 'index.js'),
            ];

            for (const candidate of candidates) {
              if (existsSync(candidate)) {
                return { path: candidate };
              }
            }

            return { path: basePath };
          });
          build.onResolve({ filter: /^#imports$/ }, () => ({
            path: path.resolve(projectRoot, 'tests/mocks/nuxt-imports.mjs'),
          }));
        },
      },
    ],
  });

  const tempDir = await mkdtemp(path.join(tmpdir(), 'wine-tests-'));
  const outfile = path.join(tempDir, 'useWines.mjs');
  await writeFile(outfile, result.outputFiles[0].text, 'utf8');
  return import(pathToFileURL(outfile).href);
}

const modulePromise = loadUseWinesModule();

test('normalizeWine extracts type and region names', async () => {
  const { normalizeWine } = await modulePromise;

  const wine = normalizeWine({
    id: 99,
    title: 'Test Bianco',
    link: '#',
    status: 'publish',
    modified: '2024-01-01T00:00:00Z',
    vino_categoria: [{ id: 1, name: 'bianco' }],
    regioni: [{ id: 2, name: 'Lazio' }],
  });

  assert.equal(wine.type, 'bianco');
  assert.equal(wine.region, 'Lazio');
});

test('normalizeWine converts numeric strings to numbers', async () => {
  const { normalizeWine } = await modulePromise;

  const wine = normalizeWine({
    id: 100,
    title: 'Annata 2024',
    link: '#',
    status: 'publish',
    modified: '2024-01-01T00:00:00Z',
    anno: '2024',
    vino_centesimi: '90',
  });

  assert.equal(wine.year, 2024);
  assert.equal(wine.score, 90);
});

test('normalizeWine generates slug fallback when missing', async () => {
  const { normalizeWine } = await modulePromise;

  const wine = normalizeWine({
    id: 101,
    title: 'Vino Élite',
    link: '#',
    status: 'publish',
    modified: '2024-01-01T00:00:00Z',
  });

  assert.equal(wine.slug, 'vino-elite');
});
