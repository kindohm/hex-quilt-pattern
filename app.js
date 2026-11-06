(() => {
  const $ = id => document.getElementById(id);
  const key = 'hex-quilt-planner-v1';
  const hex = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
  let state = { count: 5, base: '#75547d', palette: Quilt.shades('#75547d', 5), assignment: Quilt.arrange(5), labels: true };
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && Quilt.valid(stored.assignment, stored.count) && hex(stored.base) && Array.isArray(stored.palette) && stored.palette.length === stored.count && stored.palette.every(hex) && typeof stored.labels === 'boolean') state = stored;
  } catch { /* Storage may be unavailable or contain older data. */ }
  const geometry = Quilt.geometry();
  const ns = 'http://www.w3.org/2000/svg';
  function svgNode(name, attrs, text) {
    const node = document.createElementNS(ns, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text) node.textContent = text;
    return node;
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); $('save-status').textContent = 'Saved in this browser.'; }
    catch { $('save-status').textContent = 'Browser storage is unavailable; this arrangement is not saved.'; }
  }
  function draw() {
    $('quilt').querySelectorAll('g').forEach(node => node.remove());
    geometry.forEach((sector, s) => {
      const group = svgNode('g', { 'data-sector': sector.letter });
      sector.pieces.forEach((piece, p) => {
        const color = p === 4 ? null : state.assignment[s * 4 + p];
        const polygon = svgNode('polygon', { id: piece.id, points: piece.points.map(point => point.join(',')).join(' '), fill: color === null ? '#d4d2d8' : state.palette[color], 'data-color': color === null ? 'gray' : color + 1 });
        polygon.append(svgNode('title', {}, `${piece.id}: ${color === null ? 'Gray' : 'Color ' + (color + 1)}`));
        group.append(polygon);
        if (state.labels) {
          const x = piece.points.reduce((sum, point) => sum + point[0], 0) / piece.points.length;
          const y = piece.points.reduce((sum, point) => sum + point[1], 0) / piece.points.length;
          if (p !== 4) group.append(svgNode('rect', { x: x - 49, y: y - 17, width: 98, height: 34, rx: 6, class: 'label-backing' }));
          group.append(svgNode('text', { x, y, class: 'piece-label' + (p === 4 ? ' inner-label' : '') }, p === 4 ? piece.id : `${piece.id} · C${color + 1}`));
        }
      });
      $('quilt').append(group);
    });
  }
  function table() {
    $('assignments').replaceChildren();
    geometry.forEach((sector, s) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th'); heading.scope = 'row'; heading.textContent = sector.letter; row.append(heading);
      for (let p = 0; p < 5; p++) {
        const color = p === 4 ? null : state.assignment[s * 4 + p];
        const cell = document.createElement('td');
        const dot = document.createElement('span'); dot.className = 'dot'; dot.style.backgroundColor = color === null ? '#d4d2d8' : state.palette[color]; dot.setAttribute('aria-hidden', 'true');
        cell.append(dot, color === null ? 'Gray' : `Color ${color + 1}`); row.append(cell);
      }
      $('assignments').append(row);
    });
    // Any previous manual-copy fallback represents an older arrangement.
    $('copy-fallback').hidden = true; $('copy-status').textContent = '';
  }
  function palette() {
    $('palette').replaceChildren();
    state.palette.forEach((color, i) => {
      const item = document.createElement('div'); item.className = 'swatch';
      const input = document.createElement('input'); input.type = 'color'; input.value = color; input.id = `color-${i + 1}`;
      const label = document.createElement('label'); label.htmlFor = input.id; label.append(`Color ${i + 1}`);
      const usage = document.createElement('small'); usage.textContent = `${state.assignment.filter(value => value === i).length} pieces`; label.append(usage);
      input.addEventListener('input', () => { state.palette[i] = input.value; draw(); table(); save(); });
      item.append(input, label); $('palette').append(item);
    });
  }
  function render() {
    $('count').value = state.count; $('base').value = state.base; $('labels').checked = state.labels;
    $('two-note').hidden = state.count !== 2;
    draw(); palette(); table(); save();
    $('status').textContent = '24 pieces balanced. No matching neighbors.';
  }
  function countInput() {
    const count = Number($('count').value);
    if (!Number.isInteger(count) || count < 2 || count > 24) {
      $('count').setCustomValidity('Choose a whole number from 2 to 24.'); $('count').reportValidity(); return null;
    }
    $('count').setCustomValidity(''); return count;
  }
  $('count').addEventListener('input', () => $('count').setCustomValidity(''));
  $('count').addEventListener('change', () => {
    const count = countInput(); if (count === null || count === state.count) return;
    state.count = count; state.palette = Quilt.shades(state.base, count); state.assignment = Quilt.arrange(count); render();
  });
  $('base').addEventListener('input', () => { state.base = $('base').value; save(); });
  $('shades').addEventListener('click', () => {
    if (countInput() === null) return;
    state.palette = Quilt.shades(state.base, state.count); render(); $('status').textContent = 'New shades applied. Piece assignments kept.';
  });
  $('randomize').addEventListener('click', () => {
    if (countInput() === null) return;
    state.assignment = Quilt.arrange(state.count, state.assignment); render();
  });
  $('labels').addEventListener('change', () => { state.labels = $('labels').checked; draw(); save(); });
  $('copy').addEventListener('click', async () => {
    const rows = ['Sector\tPiece 1\tPiece 2\tPiece 3\tPiece 4\tPiece 5'];
    geometry.forEach((sector, s) => rows.push([sector.letter, ...state.assignment.slice(s * 4, s * 4 + 4).map(c => `Color ${c + 1}`), 'Gray'].join('\t')));
    rows.push('', 'Color\tHex\tPiece count');
    state.palette.forEach((color, i) => rows.push(`Color ${i + 1}\t${color}\t${state.assignment.filter(c => c === i).length}`));
    rows.push('Gray\t#d4d2d8\t6');
    const text = rows.join('\n');
    try { await navigator.clipboard.writeText(text); $('copy-status').textContent = 'Table and color legend copied.'; }
    catch { $('copy-fallback').value = text; $('copy-fallback').hidden = false; $('copy-fallback').focus(); $('copy-fallback').select(); $('copy-status').textContent = 'Select and copy the table below.'; }
  });
  render();
})();
