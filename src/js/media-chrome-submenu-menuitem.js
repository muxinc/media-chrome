import MediaChromeMenuitem from './media-chrome-menuitem.js';

const addTemplate = document.createElement('template');

addTemplate.innerHTML = `
<style>
  :host {
    background-position: right 9px center;
    background-repeat: no-repeat;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIxMDAlIj48cGF0aCBkPSJtIDEyLjU5LDIwLjM0IDQuNTgsLTQuNTkgLTQuNTgsLTQuNTkgMS40MSwtMS40MSA2LDYgLTYsNiB6IiBmaWxsPSIjZmZmIiAvPjwvc3ZnPg==)
  }

  ::slotted([slot=menu]) {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    border: 1px solid #00f;
  }
</style>

<div id="menuContainer">
  <slot name="menu"></slot>
</div>
`;

class MediaChromeSubmenuMenuitem extends MediaChromeMenuitem {
  constructor() {
    super();

    this.shadowRoot.appendChild(addTemplate.content.cloneNode(true));
    this.menu = this.querySelector('[slot=menu]');
    this.menu.style.display = 'none';
  }

  onClick() {
    if (this.menu.style.display == 'block') {
      this.menu.style.display = 'none';
    } else {
      this.menu.style.display = 'block';
    }
  }
}

if (!window.customElements.get('media-chrome-submenu-menuitem')) {
  window.customElements.define('media-chrome-submenu-menuitem', MediaChromeSubmenuMenuitem);
  window.MediaChromeButton = MediaChromeSubmenuMenuitem;
}

export default MediaChromeSubmenuMenuitem;
