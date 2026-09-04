const test = require('node:test');
const assert = require('node:assert/strict');
const conference = require('../src/data/conference.js');

test('keeps the six CFP deadlines in display order', () => {
  assert.deepEqual(
    conference.deadlines.map((item) => item.dateLabel),
    ['15 AUG 2026', '30 SEP 2026', '30 OCT 2026', '30 NOV 2026', '30 NOV 2026', '27–30 DEC 2026']
  );
});

test('contains the four CFP tracks', () => {
  assert.deepEqual(
    conference.tracks.map((track) => track.title),
    ['Systems & Architectures', 'Technologies & Tools', 'Applications & Services', 'Security & Block-chain']
  );
});

test('keeps every chair category from the CFP', () => {
  assert.deepEqual(
    conference.chairGroups.map((group) => group.label),
    [
      'General Chairs',
      'Program Chairs',
      'Program Vice-Chairs',
      'Local Chairs',
      'Workshop / Special Session Chairs',
      'Publicity Chairs',
      'Publication Chairs',
      'Web Chairs',
      'Steering Committee',
    ]
  );
});
