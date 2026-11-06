/* Geometry and coloring rules, independent of the page. */
(function (root) {
  const letters = 'ABCDEF';
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function geometry() {
    const center = [600, 600];
    const radial = degrees => [600 + 540 * Math.cos(degrees * Math.PI / 180), 600 + 540 * Math.sin(degrees * Math.PI / 180)];
    return [...letters].map((letter, s) => {
      const left = radial(-90 + s * 60), right = radial(-30 + s * 60);
      const short = mix(center, right, .35), long = mix(center, left, .85);
      const outer = [0, .25, .5, .75, 1].map(t => mix(right, left, t));
      const inner = [0, .14, .30, .54, 1].map(t => mix(short, long, t));
      const pieces = Array.from({ length: 4 }, (_, n) => {
        const j = 3 - n;
        return { id: letter + (n + 1), points: [outer[j], outer[j + 1], inner[j + 1], inner[j]] };
      });
      pieces.push({ id: letter + '5', points: [center, short, long] });
      return { letter, pieces };
    });
  }
  function valid(assignment, count) {
    if (!Number.isInteger(count) || count < 2 || count > 24 || !Array.isArray(assignment) || assignment.length !== 24) return false;
    const totals = Array(count).fill(0);
    for (let i = 0; i < 24; i++) {
      const color = assignment[i];
      if (!Number.isInteger(color) || color < 0 || color >= count || color === assignment[(i + 1) % 24]) return false;
      totals[color]++;
    }
    return Math.max(...totals) - Math.min(...totals) <= 1;
  }
  function shuffle(values, random) {
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  }
  function arrange(count, previous = [], random = Math.random) {
    if (!Number.isInteger(count) || count < 2 || count > 24) throw new RangeError('Choose a whole number from 2 to 24.');
    if (count === 2) {
      const first = valid(previous, 2) ? 1 - previous[0] : Math.floor(random() * 2);
      return Array.from({ length: 24 }, (_, i) => (first + i) % 2);
    }
    const ids = shuffle(Array.from({ length: count }, (_, i) => i), random);
    const remaining = Array(count).fill(Math.floor(24 / count));
    for (let i = 0; i < 24 % count; i++) remaining[ids[i]]++;
    const result = [];
    function place() {
      if (result.length === 24) return result[23] !== result[0];
      const candidates = shuffle(ids.filter(id => remaining[id] && id !== result.at(-1) && (result.length !== 23 || id !== result[0])), random);
      for (const id of candidates) {
        remaining[id]--; result.push(id);
        const slots = 24 - result.length;
        if (Math.max(...remaining) <= Math.ceil(slots / 2) && place()) return true;
        result.pop(); remaining[id]++;
      }
      return false;
    }
    if (!place() || !valid(result, count)) throw new Error('Could not create a valid arrangement.');
    return result;
  }
  function shades(hex, count) {
    const rgb = hex.match(/\w\w/g).map(v => parseInt(v, 16));
    return Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0 : (i / (count - 1)) * 1.25 - .58;
      return '#' + rgb.map(v => Math.round(t < 0 ? v * (1 + t) : v + (255 - v) * t).toString(16).padStart(2, '0')).join('');
    });
  }
  const api = { geometry, valid, arrange, shades };
  if (typeof module !== 'undefined') module.exports = api;
  else root.Quilt = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
