import { globalThis } from './utils/server-safe-globals.js';
import { MediaChromeDialog } from './media-chrome-dialog.js';

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
      ${formatKeyboardShortcuts()}
    </slot>
  `;
}

function formatKeyboardShortcuts() {
  const shortcuts = [
    { keys: ['Space', 'k'], description: 'Toggle Playback' },
    { keys: ['m'], description: 'Toggle mute' },
    { keys: ['f'], description: 'Toggle fullscreen' },
    { keys: ['c'], description: 'Toggle captions or subtitles, if available' },
    { keys: ['p'], description: 'Toggle Picture in Picture' },
    { keys: ['←', 'j'], description: 'Seek back 10s' },
    { keys: ['→', 'l'], description: 'Seek forward 10s' },
    { keys: ['↑'], description: 'Turn volume up' },
    { keys: ['↓'], description: 'Turn volume down' },
    { keys: ['< (SHIFT+,)'], description: 'Decrease playback rate' },
    { keys: ['> (SHIFT+.)'], description: 'Increase playback rate' },
  ];

  const rows = shortcuts.map(({ keys, description }) => {
    const keyCombo = keys.map((key, index) => 
      index > 0 
        ? `<span class="key-separator">or</span><span class="key">${key}</span>`
        : `<span class="key">${key}</span>`
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


class MediaKeyboardShortcutsDialog extends MediaChromeDialog {
  static getSlotTemplateHTML = getSlotTemplateHTML;

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

