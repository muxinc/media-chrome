// Work in progress

import MediaChromeHTMLElement from './media-chrome-html-element.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Document as document } from './utils/server-safe-globals.js';

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

class MediaSettingsPopup extends MediaChromeHTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

defineCustomElement('media-settings-popup', MediaSettingsPopup);

export default MediaSettingsPopup;
