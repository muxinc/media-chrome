import { assert, fixture } from '@open-wc/testing';
import '../../src/js/experimental/index.js';

it('listbox selects the first option by default', async function () {
  const listbox = await fixture(`
    <media-chrome-listbox>
      <media-chrome-option>Option 1</media-chrome-option>
      <media-chrome-option>Option 2</media-chrome-option>
    </media-chrome-listbox>`);
  assert.equal(listbox.value, 'Option 1');
});

it('listbox only fires a change event when selected option changed', async function () {
  const listbox = await fixture(`
    <media-chrome-listbox>
      <media-chrome-option>Option 1</media-chrome-option>
      <media-chrome-option>Option 2</media-chrome-option>
    </media-chrome-listbox>`);

  let count = 0;
  listbox.addEventListener('change', () => {
    count++;
  });

  listbox.value = 'Option 2';
  listbox.value = 'Option 2';
  listbox.value = 'Option 2';

  assert.equal(listbox.value, 'Option 2');
  assert.equal(count, 1);
});
