import test from 'node:test';
import assert from 'node:assert/strict';
import router from '../../router.js';

test('router exporta um middleware do Express', () => {
  assert.equal(typeof router, 'function');
  // Express Router costuma expor `stack` (detalhe interno), mas isso dá
  // uma sanidade rápida sem precisar de DB.
  assert.ok('stack' in router);
});
