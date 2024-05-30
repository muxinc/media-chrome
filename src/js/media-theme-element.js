import { MediaStateChangeEvents } from './constants.js';
import { globalThis, document } from './utils/server-safe-globals.js';
import { TemplateInstance } from './utils/template-parts.js';
import { processor } from './utils/template-processor.js';
import { camelCase, isNumericString } from './utils/utils.js';

// Export Template parts for players.
export * from './utils/template-parts.js';

const observedMediaAttributes = {
  mediatargetlivewindow: 'targetlivewindow',
  mediastreamtype: 'streamtype',
};

const prependTemplate = document.createElement('template');

prependTemplate.innerHTML = /*html*/ `
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-controller:not([mediasubtitleslist]) media-captions-selectmenu,
    media-captions-button:not([mediasubtitleslist]),
    media-rendition-selectmenu[mediarenditionunavailable],
    media-audio-track-selectmenu[mediaaudiotrackunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;

/**
 * @extends {HTMLElement}
 *
 * @attr {string} template - The element `id` of the template to render.
 */
export class MediaThemeElement extends globalThis.HTMLElement {
  static template;
  static observedAttributes = ['template'];
  static processor = processor;

  renderRoot;
  renderer;
  #template;
  #prevTemplate;
  #prevTemplateId;

  constructor() {
    super();

    if (this.shadowRoot) {
      this.renderRoot = this.shadowRoot;
    } else {
      // Set up the Shadow DOM if not using Declarative Shadow DOM.
      this.renderRoot = this.attachShadow({ mode: 'open' });
      this.createRenderer();
    }

    const observer = new MutationObserver((mutationList) => {
      // Only update if `<media-controller>` has computed breakpoints at least once.
      if (this.mediaController && !this.mediaController?.breakpointsComputed)
        return;

      if (
        mutationList.some((mutation) => {
          const target = /** @type {HTMLElement} */ (mutation.target);

          // Render on each attribute change of the `<media-theme(-x)>` element.
          if (target === this) return true;

          // Only check `<media-controller>`'s attributes below.
          if (target.localName !== 'media-controller') return false;

          // Render if this attribute is directly observed.
          if (observedMediaAttributes[mutation.attributeName]) return true;

          // Render if `breakpointx` attributes change.
          if (mutation.attributeName.startsWith('breakpoint')) return true;

          return false;
        })
      ) {
        this.render();
      }
    });

    // Observe the `<media-theme>` element for attribute changes.
    observer.observe(this, { attributes: true });

    // Observe the subtree of the render root, by default the elements in the shadow dom.
    observer.observe(this.renderRoot, {
      attributes: true,
      subtree: true,
    });

    this.addEventListener(
      MediaStateChangeEvents.BREAKPOINTS_COMPUTED,
      this.render
    );

    // In case the template prop was set before custom element upgrade.
    // https://web.dev/custom-elements-best-practices/#make-properties-lazy
    this.#upgradeProperty('template');
  }

  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      // Delete the set property from this instance.
      delete this[prop];
      // Set the value again via the (prototype) setter on this class.
      this[prop] = value;
    }
  }

  /** @type {HTMLElement & { breakpointsComputed?: boolean }} */
  get mediaController() {
    // Expose the media controller if API access is needed
    return this.renderRoot.querySelector('media-controller');
  }

  get template() {
    // @ts-ignore
    return this.#template ?? this.constructor.template;
  }

  set template(element) {
    this.#prevTemplateId = null;
    this.#template = element;
    this.createRenderer();
  }

  get props() {
    const observedAttributes = [
      ...Array.from(this.mediaController?.attributes ?? []).filter(
        ({ name }) => {
          return observedMediaAttributes[name] || name.startsWith('breakpoint');
        }
      ),
      ...Array.from(this.attributes),
    ];

    const props = {};
    for (let attr of observedAttributes) {
      const name = observedMediaAttributes[attr.name] ?? camelCase(attr.name);
      let { value } = attr;

      if (value != null) {
        if (isNumericString(value)) {
          // @ts-ignore
          value = parseFloat(value);
        }

        props[name] = value === '' ? true : value;
      } else {
        props[name] = false;
      }
    }

    return props;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'template' && oldValue != newValue) {
      this.#updateTemplate();
    }
  }

  connectedCallback() {
    this.#updateTemplate();
  }

  #updateTemplate() {
    const templateId = this.getAttribute('template');
    if (!templateId || templateId === this.#prevTemplateId) return;

    // First try to get a template element by id
    const rootNode = /** @type HTMLDocument | ShadowRoot */ (
      this.getRootNode()
    );
    const template = rootNode?.getElementById?.(templateId);

    if (template) {
      // Only save prevTemplateId if a template was found.
      this.#prevTemplateId = templateId;
      this.#template = template;
      this.createRenderer();
      return;
    }

    if (isValidUrl(templateId)) {
      // Save prevTemplateId on valid URL before async fetch to prevent duplicate fetch.
      this.#prevTemplateId = templateId;

      // Next try to fetch a HTML file if it looks like a valid URL.
      request(templateId)
        .then((data) => {
          const template = document.createElement('template');
          template.innerHTML = data;

          this.#template = template;
          this.createRenderer();
        })
        .catch(console.error);
    }
  }

  createRenderer() {
    if (this.template && this.template !== this.#prevTemplate) {
      this.#prevTemplate = this.template;

      this.renderer = new TemplateInstance(
        this.template,
        this.props,
        // @ts-ignore
        this.constructor.processor
      );

      this.renderRoot.textContent = '';
      this.renderRoot.append(
        prependTemplate.content.cloneNode(true),
        this.renderer
      );
    }
  }

  render() {
    this.renderer?.update(this.props);
  }
}

function isValidUrl(url) {
  // Valid URL e.g. /absolute, ./relative, http://, https://
  if (!/^(\/|\.\/|https?:\/\/)/.test(url)) return false;

  // Add base if url doesn't start with http:// or https://
  const base = /^https?:\/\//.test(url) ? undefined : location.origin;
  try {
    new URL(url, base);
  } catch (e) {
    return false;
  }
  return true;
}

async function request(resource) {
  const response = await fetch(resource);

  if (response.status !== 200) {
    throw new Error(
      `Failed to load resource: the server responded with a status of ${response.status}`
    );
  }

  return response.text();
}

if (!globalThis.customElements.get('media-theme')) {
  globalThis.customElements.define('media-theme', MediaThemeElement);
}
