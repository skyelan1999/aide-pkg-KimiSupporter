'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const manifest = require('../manifest.json');
const catalog = require('../provider-support.json');
const plugin = require('../index.js');

test('MIT plugin declares the host catalog and runs without a host or credentials', () => {
  assert.equal(manifest.id, 'kimi-supporter');
  assert.equal(manifest.version, '0.1.0');
  assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.main, 'index.js');
  assert.deepEqual(manifest.providerSupport, { protocol: 1, catalog: 'provider-support.json' });
  assert.equal(manifest.settingsSchema, undefined);
  assert.deepEqual(Object.keys(plugin).sort(), ['apply', 'name']);
  assert.equal(plugin.name, manifest.id);
  assert.equal(plugin.apply(new Proxy({}, {
    get() { throw new Error('Data-only provider support must never read from the host'); },
  })), undefined);
});

test('exact CNY catalog is limited to the supported China API and host-owned balance', () => {
  assert.equal(catalog.protocol, 1);
  assert.equal(catalog.id, 'moonshot');
  assert.equal(catalog.currency, 'CNY');
  assert.equal(catalog.revision, '2026-11-19');
  assert.deepEqual(catalog.providers, [{ host: 'api.moonshot.cn', paths: ['/v1'] }]);
  assert.equal(catalog.accountBalance, 'moonshot');
  assert.equal(catalog.balance, undefined);
  assert.equal(catalog.peak, undefined);
  assert.deepEqual(catalog.sources, [
    'https://platform.kimi.com/docs/pricing/chat',
    'https://platform.kimi.com/docs/models',
    'https://platform.kimi.com/docs/api/balance',
  ]);
});

test('only the exact confirmed model IDs carry a single published standard tariff', () => {
  const tariffs = {
    'kimi-k3.1-pro': [13, 1.3, 68],
    'kimi-k3.1-pro-highspeed': [26, 1.3, 136],
    'kimi-k3': [20, 2, 100],
    'kimi-k2.7-code': [6.5, 1.3, 27],
    'kimi-k2.7-code-highspeed': [13, 2.6, 54],
    'kimi-k2.6': [6.5, 1.1, 27],
  };
  assert.equal(catalog.models.length, Object.keys(tariffs).length);
  assert.deepEqual(catalog.models, Object.entries(tariffs).map(([id, rates]) => ({
    names: [id],
    tiers: [{ maxInput: 0, priceIn: rates[0], priceInCacheHit: rates[1], priceOut: rates[2] }],
  })));
});
