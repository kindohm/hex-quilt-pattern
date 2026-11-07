const { test } = require('node:test');
const assert = require('node:assert/strict');
const { geometry, arrange, valid, shades } = require('../quilt.js');
function seeded(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }
test('balanced, edge-safe arrangements for every supported count and many seeds', () => {
  for (let count = 4; count <= 24; count++) {
    for (let seed = 1; seed <= 100; seed++) {
      const result = arrange(count, [], seeded(seed));
      assert.equal(result.length, 24);
      const uses = Array(count).fill(0);
      for (let i = 0; i < 24; i++) {
        assert.notEqual(result[i], result[(i + 1) % 24]);
        assert.ok(result[i] >= 0 && result[i] < count); uses[result[i]]++;
      }
      for (let start = 0; start < 24; start += 4) assert.equal(new Set(result.slice(start, start + 4)).size, 4);
      assert.ok(valid(result, count));
      assert.ok(uses.every(n => n === Math.floor(24 / count) || n === Math.ceil(24 / count)));
    }
  }
});
test('rejects unsupported counts and balanced edge-safe layouts with sector repeats', () => {
  for (const n of [0, 1, 2, 3, 25, 4.5, NaN]) assert.throws(() => arrange(n), RangeError);
  const repeated = Array.from({ length: 6 }, (_, s) => s % 2 ? [2, 3, 2, 3] : [0, 1, 0, 1]).flat();
  assert.equal(valid(repeated, 4), false);
  assert.equal(valid(Array.from({ length: 24 }, (_, i) => i % 4), 4), true);
});
function sharedEdge(a, b) {
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    const p = a[i], q = a[(i + 1) % a.length], r = b[j], s = b[(j + 1) % b.length];
    const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
    const cross = v => Math.abs(dx * (v[1] - p[1]) - dy * (v[0] - p[0])) / len;
    if (cross(r) > 1e-6 || cross(s) > 1e-6) continue;
    const project = v => ((v[0] - p[0]) * dx + (v[1] - p[1]) * dy) / len;
    const lo = Math.max(0, Math.min(project(r), project(s)));
    const hi = Math.min(len, Math.max(project(r), project(s)));
    if (hi - lo > 1e-6) return true;
  }
  return false;
}
test('actual polygon geometry has exactly the adjacency ring used by the solver', () => {
  const sectors = geometry();
  assert.deepEqual(sectors.map(s => s.letter), [...'ABCDEF']);
  const pieces = sectors.flatMap(s => s.pieces.slice(0, 4));
  for (let i = 0; i < 24; i++) for (let j = i + 1; j < 24; j++) {
    assert.equal(sharedEdge(pieces[i].points, pieces[j].points), j === i + 1 || (i === 0 && j === 23), `${pieces[i].id}/${pieces[j].id}`);
  }
  assert.deepEqual(sectors[0].pieces[0].points[1].map(Math.round), [600, 60]);
  assert.equal(new Set(sectors.flatMap(s => s.pieces.map(p => p.id))).size, 30);
});
test('palettes contain valid editable hex colors', () => {
  for (const base of ['#000000', '#ffffff', '#75547d']) for (let count = 4; count <= 24; count++) {
    const palette = shades(base, count);
    assert.equal(palette.length, count);
    assert.ok(palette.every(c => /^#[0-9a-f]{6}$/.test(c)));
  }
});
