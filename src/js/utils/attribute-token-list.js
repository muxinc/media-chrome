/** @implements {Pick<DOMTokenList, 'length' | 'value' | 'toString' | 'item' | 'add' | 'remove' | 'contains' | 'toggle' | 'replace'>} */
export class AttributeTokenList {
  #el;
  #attr;
  #defaultSet;
  #tokenSet = new Set();

  constructor(el, attr, { defaultValue } = { defaultValue: undefined }) {
    this.#el = el;
    this.#attr = attr;
    this.#defaultSet = new Set(defaultValue);
  }

  [Symbol.iterator]() {
    return this.#tokens.values();
  }

  get #tokens() {
    return this.#tokenSet.size ? this.#tokenSet : this.#defaultSet;
  }

  get length() {
    return this.#tokens.size;
  }

  get value() {
    return [...this.#tokens].join(' ') ?? '';
  }

  set value(val) {
    if (val === this.value) return;
    this.#tokenSet = new Set();
    this.add(...(val?.split(' ') ?? []));
  }

  toString() {
    return this.value;
  }

  item(index) {
    return [...this.#tokens][index];
  }

  values() {
    return this.#tokens.values();
  }

  forEach(callback) {
    this.#tokens.forEach(callback);
  }

  add(...tokens) {
    tokens.forEach((t) => this.#tokenSet.add(t));
    // if the attribute was removed don't try to add it again.
    if (this.value === '' && !this.#el?.hasAttribute(`${this.#attr}`)) {
      return;
    }
    this.#el?.setAttribute(`${this.#attr}`, `${this.value}`);
  }

  remove(...tokens) {
    tokens.forEach((t) => this.#tokenSet.delete(t));
    this.#el?.setAttribute(`${this.#attr}`, `${this.value}`);
  }

  contains(token) {
    return this.#tokens.has(token);
  }

  toggle(token, force) {
    if (typeof force !== 'undefined') {
      if (force) {
        this.add(token);
        return true;
      } else {
        this.remove(token);
        return false;
      }
    }

    if (this.contains(token)) {
      this.remove(token);
      return false;
    }

    this.add(token);
    return true;
  }

  replace(oldToken, newToken) {
    this.remove(oldToken);
    this.add(newToken);
    return oldToken === newToken;
  }
}
