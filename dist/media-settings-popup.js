import{defineCustomElement as o}from"./utils/defineCustomElement.js";import{Document as t,Window as i}from"./utils/server-safe-globals.js";const e=t.createElement("template");e.innerHTML=`
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
`;class m extends i.HTMLElement{constructor(){super();const a=this.attachShadow({mode:"open"});this.shadowRoot.appendChild(e.content.cloneNode(!0))}}o("media-settings-popup",m);export default m;
