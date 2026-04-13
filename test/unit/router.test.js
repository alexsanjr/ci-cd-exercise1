import test from 'node:test';
import assert from 'node:assert/strict';
import router from '../../router.js';

test('router exporta um middleware do Express', () => {
  assert.equal(typeof router, 'function');
  assert.equal(typeof router.use, 'function');
});
