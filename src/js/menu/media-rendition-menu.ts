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
import { t } from '../utils/i18n.js';

export type FormatRenditionOptions = {
  showBitrate?: boolean;
};

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
      MediaUIAttributes.MEDIA_WIDTH,
    ];
  }

  static override formatMenuItemText(
    text: string,
    rendition?: Rendition
  ): string {
    return super.formatMenuItemText(text, rendition);
  }

  static formatRendition(
    rendition: Rendition,
    { showBitrate = false }: FormatRenditionOptions = {}
  ): string {
    const renditionText = `${Math.min(
      rendition.width as number,
      rendition.height as number
    )}p`;

    if (showBitrate && rendition.bitrate) {
      const mbps = rendition.bitrate / 1000000;
      const bitrateText = `${mbps.toFixed(mbps < 1 ? 1 : 0)} Mbps`;
      return `${renditionText} (${bitrateText})`;
    }

    return this.formatMenuItemText(renditionText, rendition);
  }

  static compareRendition(a: Rendition, b: Rendition): number {
    return b.height === a.height
      ? (b.bitrate ?? 0) - (a.bitrate ?? 0)
      : b.height - a.height;
  }

  #renditionList: Rendition[] = [];
  #prevState: Record<string, any> = {};

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (oldValue !== newValue) {
      switch (attrName) {
        case MediaUIAttributes.MEDIA_RENDITION_SELECTED:
          this.value = newValue ?? 'auto';
          this.#render();
          break;
        case MediaUIAttributes.MEDIA_RENDITION_LIST:
          this.#renditionList = parseRenditionList(newValue);
          this.#render();
          break;
        case MediaUIAttributes.MEDIA_HEIGHT:
        case MediaUIAttributes.MEDIA_WIDTH:
          this.#render();
          break
      }
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

  get mediaWidth(): number {
    return getNumericAttr(this, MediaUIAttributes.MEDIA_WIDTH);
  }

  set mediaWidth(width: number) {
    setNumericAttr(this, MediaUIAttributes.MEDIA_WIDTH, width);
  }

  #render(): void {
    const isAuto = !this.mediaRenditionSelected;

    if (
      this.#prevState.mediaRenditionList ===
        JSON.stringify(this.mediaRenditionList) &&
      this.#prevState.mediaHeight === this.mediaHeight &&
      this.#prevState.mediaWidth === this.mediaWidth && 
      this.#prevState.isAuto === isAuto
    )
      return;

    this.#prevState.mediaRenditionList = JSON.stringify(
      this.mediaRenditionList
    );
    this.#prevState.mediaHeight = this.mediaHeight;
    this.#prevState.mediaWidth = this.mediaWidth;
    this.#prevState.isAuto = isAuto;

    const renditionList = this.mediaRenditionList.sort(
      this.compareRendition.bind(this)
    );

    const selectedRendition: Rendition | undefined = renditionList.find(
      (rendition) => rendition.id === this.mediaRenditionSelected
    );

    for (const rendition of renditionList) {
      // `selected` is not serialized in the rendition list because
      // each selection would cause a re-render of the menu.
      // @ts-ignore
      rendition.selected = rendition === selectedRendition;
    }

    this.defaultSlot.textContent = '';

    for (const rendition of renditionList) {
      const text = this.formatRendition(rendition, {
        showBitrate: this.showRenditionBitrate(rendition),
      });

      const item = createMenuItem({
        type: 'radio',
        text,
        value: `${rendition.id}`,
        checked: rendition.selected && !isAuto,
      });
      item.prepend(createIndicator(this, 'checked-indicator'));
      this.defaultSlot.append(item);
    }

    const showSelectedBitrate =
      selectedRendition && this.showRenditionBitrate(selectedRendition);
    
    let autoText = undefined;
    if (isAuto) {
      // TODO: If isAuto === true -> selectedRendition will be undefined
      //    so this is effectively dead code, but I'm leaving it here because
      //    it's a nice to have. 
      // We would need a way to get the active rendition in a similar way as we
      // get selectedRendition or a way to get mediaBitrate (not currently provided by state).
      if (selectedRendition) {
        // Auto • 1080p (4 Mbps)
        autoText = this.formatMenuItemText(
          `${t('Auto')} • ${this.formatRendition(selectedRendition, {
            showBitrate: showSelectedBitrate,
          })}`,
          selectedRendition
        )
      } else if (this.mediaHeight > 0 && this.mediaWidth > 0) {
        autoText = this.formatMenuItemText(`${t('Auto')} (${Math.min(this.mediaWidth, this.mediaHeight)}p)`)
      }
    }
    
    if (!autoText) {
      autoText = this.formatMenuItemText(t('Auto'));
    }

    const item = createMenuItem({
      type: 'radio',
      text: autoText,
      value: 'auto',
      checked: isAuto,
    });

    item.dataset.description = autoText;

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

  compareRendition(a: Rendition, b: Rendition): number {
    const ctor = this.constructor as typeof MediaRenditionMenu;
    return ctor.compareRendition(a, b);
  }

  override formatMenuItemText(text: string, rendition?: Rendition): string {
    const ctor = this.constructor as typeof MediaRenditionMenu;
    return ctor.formatMenuItemText(text, rendition);
  }

  formatRendition(
    rendition: Rendition,
    options?: FormatRenditionOptions
  ): string {
    const ctor = this.constructor as typeof MediaRenditionMenu;
    return ctor.formatRendition(rendition, options);
  }

  showRenditionBitrate(rendition: Rendition): boolean {
    return this.mediaRenditionList.some(
      (r) =>
        r !== rendition &&
        r.height === rendition.height &&
        r.bitrate !== rendition.bitrate
    );
  }
}

if (!globalThis.customElements.get('media-rendition-menu')) {
  globalThis.customElements.define('media-rendition-menu', MediaRenditionMenu);
}

export { MediaRenditionMenu };
export default MediaRenditionMenu;
