export class CustomElement extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(
    attrName: string, // eslint-disable-line
    oldValue: string | null, // eslint-disable-line
    newValue: string | null // eslint-disable-line
  ) {}

  connectedCallback(): void {}

  disconnectedCallback(): void {}
}
