// Work in progress

import { globalThis, document } from '../utils/server-safe-globals.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      position: absolute;
      width: 300px;
      height: auto;
      right: 5px;
      bottom: 45px;
      padding: 10px;
      border: 1px solid #333;
      color: #ccc;
      background-color: #000;
    }
  </style>
  <slot></slot>

  <!-- This is too much for a menu... -->

  <media-chrome-panel>
  <media-chrome-menu>
    <media-chrome-submenu-menuitem label="Playback speed" value="1.2">
    </media-chrome-submenu-menuitem>
    <media-chrome-menuitem>Hello1</media-chrome-menuitem>
    <media-chrome-menuitem>Hello1</media-chrome-menuitem>
    <media-chrome-menuitem>Hello1</media-chrome-menuitem>
    <media-chrome-menuitem>Hello1</media-chrome-menuitem>
  </media-chrome-menu>
  <media-chrome-menu slot="menu">
    <media-chrome-menuitem>Normal</media-chrome-menuitem>
    <media-chrome-menuitem>1.5</media-chrome-menuitem>
  </media-chrome-menu>
`;

class MediaSettingsPopup extends globalThis.HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!globalThis.customElements.get('media-settings-popup')) {
  globalThis.customElements.define('media-settings-popup', MediaSettingsPopup);
}

export default MediaSettingsPopup;
