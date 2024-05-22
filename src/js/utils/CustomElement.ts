export class CustomElement extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ) {}

  connectedCallback() {}

  disconnectedCallback() {}
}
