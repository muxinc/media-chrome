import { globalThis } from './utils/server-safe-globals.js';
import { MediaChromeDialog } from './media-chrome-dialog.js';
import { AttributeTokenList } from './utils/attribute-token-list.js';
import {
  getBooleanAttr,
  setBooleanAttr,
  setStringAttr,
} from './utils/element-utils.js';

export const Attributes = {
  HOTKEYS: 'hotkeys',
  NO_HOTKEYS: 'nohotkeys',
};

type Shortcut = {
  keys: { label: string; token: string }[];
  description: string;
};

/**
 * The keyboard shortcuts this dialog advertises, in display order.
 *
 * Each key carries the `hotkeys` token that turns it off, so a shortcut that has
 * been disabled is not shown as if it still works. Keep in sync with
 * `keyboardShortcutHandler()` in `media-controller.ts`.
 */
const shortcuts: Shortcut[] = [
  {
    keys: [
      { label: 'Space', token: 'nospace' },
      { label: 'k', token: 'nok' },
    ],
    description: 'Toggle Playback',
  },
  { keys: [{ label: 'm', token: 'nom' }], description: 'Toggle mute' },
  { keys: [{ label: 'f', token: 'nof' }], description: 'Toggle fullscreen' },
  {
    keys: [{ label: 'c', token: 'noc' }],
    description: 'Toggle captions or subtitles, if available',
  },
  {
    keys: [{ label: 'p', token: 'nop' }],
    description: 'Toggle Picture in Picture',
  },
  {
    keys: [
      { label: '←', token: 'noarrowleft' },
      { label: 'j', token: 'noj' },
    ],
    description: 'Seek back 10s',
  },
  {
    keys: [
      { label: '→', token: 'noarrowright' },
      { label: 'l', token: 'nol' },
    ],
    description: 'Seek forward 10s',
  },
  {
    keys: [{ label: '↑', token: 'noarrowup' }],
    description: 'Turn volume up',
  },
  {
    keys: [{ label: '↓', token: 'noarrowdown' }],
    description: 'Turn volume down',
  },
  {
    keys: [{ label: '< (SHIFT+,)', token: 'no<' }],
    description: 'Decrease playback rate',
  },
  {
    keys: [{ label: '> (SHIFT+.)', token: 'no>' }],
    description: 'Increase playback rate',
  },
];

/**
 * Filter out the shortcuts that have been turned off, either individually via
 * `hotkeys` or all at once via `nohotkeys`.
 *
 * Filtering is per key rather than per row, matching how the hotkeys are
 * blocked: `hotkeys="nok"` leaves `Space` listed for Toggle Playback, and only
 * `hotkeys="nok nospace"` drops the row entirely.
 */
function getEnabledShortcuts(attrs: Record<string, string>): Shortcut[] {
  if (attrs[Attributes.NO_HOTKEYS] != null) return [];

  const disabled = new Set(attrs[Attributes.HOTKEYS]?.split(' ') ?? []);
  if (!disabled.size) return shortcuts;

  return shortcuts
    .map(({ keys, description }) => ({
      keys: keys.filter(({ token }) => !disabled.has(token)),
      description,
    }))
    .filter(({ keys }) => keys.length);
}

function getSlotTemplateHTML(_attrs: Record<string, string>) {
  return /*html*/ `
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${formatKeyboardShortcuts(_attrs)}
    </slot>
  `;
}

function formatKeyboardShortcuts(attrs: Record<string, string>) {
  const enabledShortcuts = getEnabledShortcuts(attrs);

  if (!enabledShortcuts.length) {
    return `
      <h2>Keyboard Shortcuts</h2>
      <p class="description">All keyboard shortcuts are turned off.</p>
    `;
  }

  const rows = enabledShortcuts.map(({ keys, description }) => {
    const keyCombo = keys.map(({ label }, index) =>
      index > 0
        ? `<span class="key-separator">or</span><span class="key">${label}</span>`
        : `<span class="key">${label}</span>`
    ).join('');

    return `
      <tr>
        <td>
          <div class="key-combo">${keyCombo}</div>
        </td>
        <td class="description">${description}</td>
      </tr>
    `;
  }).join('');

  return `
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${rows}</table>
  `;
}


/**
 * @extends {MediaChromeDialog}
 *
 * @attr {string} hotkeys - Space separated list of hotkeys that are turned off.
 *   Shortcuts listed here are omitted from the dialog.
 * @attr {boolean} nohotkeys - All hotkeys are turned off, no shortcuts are listed.
 */
class MediaKeyboardShortcutsDialog extends MediaChromeDialog {
  static getSlotTemplateHTML = getSlotTemplateHTML;
  static formatKeyboardShortcuts = formatKeyboardShortcuts;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      Attributes.HOTKEYS,
      Attributes.NO_HOTKEYS,
    ];
  }

  #hotKeys = new AttributeTokenList(this, Attributes.HOTKEYS);

  // Added string to support JSX compatibility
  get hotkeys(): AttributeTokenList | string {
    return this.#hotKeys;
  }

  set hotkeys(value: string | undefined) {
    setStringAttr(this, Attributes.HOTKEYS, value);
  }

  get noHotkeys(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_HOTKEYS);
  }

  set noHotkeys(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_HOTKEYS, value);
  }

  formatKeyboardShortcuts(attrs: Record<string, string>) {
    return (this.constructor as typeof MediaKeyboardShortcutsDialog).formatKeyboardShortcuts(attrs);
  }

  #renderShortcuts() {
    const content = this.shadowRoot?.querySelector('#content');
    if (!content) return;

    content.innerHTML = this.formatKeyboardShortcuts({
      [Attributes.HOTKEYS]: this.#hotKeys.value,
      ...(this.noHotkeys ? { [Attributes.NO_HOTKEYS]: '' } : null),
    });
  }

  connectedCallback() {
    super.connectedCallback();
    
    if (this.open) {
      this.addEventListener('click', this.#clickHandler);
      document.addEventListener('keydown', this.#keyDownHandler);
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#clickHandler);
    document.removeEventListener('keydown', this.#keyDownHandler);
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(attrName, oldValue, newValue);
    if (attrName === 'open') {
      if (this.open) {
        this.addEventListener('click', this.#clickHandler);
        document.addEventListener('keydown', this.#keyDownHandler);
      } else {
        this.removeEventListener('click', this.#clickHandler);
        document.removeEventListener('keydown', this.#keyDownHandler);
      }
    } else if (attrName === Attributes.HOTKEYS && newValue !== oldValue) {
      this.#hotKeys.value = newValue;
      this.#renderShortcuts();
    } else if (attrName === Attributes.NO_HOTKEYS && newValue !== oldValue) {
      this.#renderShortcuts();
    }
  }

  #clickHandler = (e: MouseEvent) => {
    if (!this.open) return;
    
    const content = this.shadowRoot?.querySelector('#content');
    if (!content) return;
    
    // Check if click is on the background (outside content)
    const path = e.composedPath();
    const isClickOnHost = path[0] === this || path.includes(this);
    const isClickInsideContent = path.includes(content);
    
    if (isClickOnHost && !isClickInsideContent) {
      this.open = false;
    }
  };

  #keyDownHandler = (e: KeyboardEvent) => {
    if (!this.open) return;
    
    const isShiftSlash = e.shiftKey && (e.key === '/' || e.key === '?');
    if ((e.key === 'Escape' || isShiftSlash) && !e.ctrlKey && !e.altKey && !e.metaKey) {
      this.open = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };
}

if (!globalThis.customElements.get('media-keyboard-shortcuts-dialog')) {
  globalThis.customElements.define('media-keyboard-shortcuts-dialog', MediaKeyboardShortcutsDialog);
}

export { MediaKeyboardShortcutsDialog };
export default MediaKeyboardShortcutsDialog;

