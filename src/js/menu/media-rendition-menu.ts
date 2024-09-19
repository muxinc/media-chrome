import { globalThis } from '../utils/server-safe-globals.js';
import { MediaUIAttributes, MediaUIEvents } from '../constants.js';
import {
  getMediaController,
  getStringAttr,
  setStringAttr,
  getNumericAttr,
  setNumericAttr,
} from '../utils/element-utils.js';
import { parseRenditionList } from '../utils/utils.js';
import {
  MediaChromeMenu,
  createMenuItem,
  createIndicator,
} from './media-chrome-menu.js';
import { Rendition } from '../media-store/state-mediator.js';

/**
 * @extends {MediaChromeMenu}
 * 
 * @slot - Default slotted elements.
 * @slot header - An element shown at the top of the menu.
 * @slot checked-indicator - An icon element indicating a checked menu-item.
 *
 * @attr {string} mediarenditionselected - (read-only) Set to the selected rendition id.
 * @attr {string} mediarenditionlist - (read-only) Set to the rendition list.
 */
class MediaRenditionMenu extends MediaChromeMenu {
  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      MediaUIAttributes.MEDIA_RENDITION_LIST,
      MediaUIAttributes.MEDIA_RENDITION_SELECTED,
      MediaUIAttributes.MEDIA_RENDITION_UNAVAILABLE,
      MediaUIAttributes.MEDIA_HEIGHT,
    ];
  }

  #renditionList: Rendition[] = [];
  #prevState: Record<string, any> = {};

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (
      attrName === MediaUIAttributes.MEDIA_RENDITION_SELECTED &&
      oldValue !== newValue
    ) {
      this.value = newValue ?? 'auto';
    } else if (
      attrName === MediaUIAttributes.MEDIA_RENDITION_LIST &&
      oldValue !== newValue
    ) {
      this.#renditionList = parseRenditionList(newValue);
      this.#render();
    } else if (
      attrName === MediaUIAttributes.MEDIA_HEIGHT &&
      oldValue !== newValue
    ) {
      this.#render();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('change', this.#onChange);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('change', this.#onChange);
  }

  /**
   * Returns the anchor element when it is a floating menu.
   */
  get anchorElement() {
    if (this.anchor !== 'auto') return super.anchorElement;
    return getMediaController(this).querySelector<HTMLElement>(
      'media-rendition-menu-button'
    );
  }

  get mediaRenditionList(): Rendition[] {
    return this.#renditionList;
  }

  set mediaRenditionList(list: Rendition[]) {
    this.#renditionList = list;
    this.#render();
  }

  /**
   * Get selected rendition id.
   */
  get mediaRenditionSelected(): string {
    return getStringAttr(this, MediaUIAttributes.MEDIA_RENDITION_SELECTED);
  }

  set mediaRenditionSelected(id: string) {
    setStringAttr(this, MediaUIAttributes.MEDIA_RENDITION_SELECTED, id);
  }

  get mediaHeight(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_HEIGHT);
  }

  set mediaHeight(height: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_HEIGHT, height);
  }

  #render(): void {
    if (
      this.#prevState.mediaRenditionList === JSON.stringify(this.mediaRenditionList) &&
      this.#prevState.mediaHeight === this.mediaHeight
    ) return;

    this.#prevState.mediaRenditionList = JSON.stringify(this.mediaRenditionList);
    this.#prevState.mediaHeight = this.mediaHeight;

    const renditionList = this.mediaRenditionList.sort(
      (a: any, b: any) => b.height - a.height
    );

    for (const rendition of renditionList) {
      // `selected` is not serialized in the rendition list because
      // each selection would cause a re-render of the menu.
      // @ts-ignore
      rendition.selected = rendition.id === this.mediaRenditionSelected;
    }

    this.defaultSlot.textContent = '';

    const isAuto = !this.mediaRenditionSelected;

    for (const rendition of renditionList) {
      const text = this.formatMenuItemText(
        `${Math.min(rendition.width as number, rendition.height as number)}p`,
        rendition
      );

      const item = createMenuItem({
        type: 'radio',
        text,
        value: `${rendition.id}`,
        checked: rendition.selected && !isAuto,
      });
      item.prepend(createIndicator(this, 'checked-indicator'));
      this.defaultSlot.append(item);
    }

    const item = createMenuItem({
      type: 'radio',
      text: this.formatMenuItemText('Auto'),
      value: 'auto',
      checked: isAuto,
    });

    const autoDescription = this.mediaHeight > 0 ? `Auto (${this.mediaHeight}p)` : 'Auto';
    item.dataset.description = autoDescription;

    item.prepend(createIndicator(this, 'checked-indicator'));
    this.defaultSlot.append(item);
  }

  #onChange(): void {
    if (this.value == null) return;

    const event = new globalThis.CustomEvent(
      MediaUIEvents.MEDIA_RENDITION_REQUEST,
      {
        composed: true,
        bubbles: true,
        detail: this.value,
      }
    );
    this.dispatchEvent(event);
  }
}

if (!globalThis.customElements.get('media-rendition-menu')) {
  globalThis.customElements.define('media-rendition-menu', MediaRenditionMenu);
}

export { MediaRenditionMenu };
export default MediaRenditionMenu;
