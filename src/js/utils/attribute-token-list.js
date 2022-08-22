export class AttributeTokenList {
  #el;
  #attr;
  #tokens = [];

  constructor(el, attr) {
    this.#el = el;
    this.#attr = attr;
  }

  [Symbol.iterator]() {
    return this.#tokens.values();
  }

  get length() {
    return this.#tokens.length;
  }

  get value() {
    return this.#tokens.join(' ') ?? '';
  }

  set value(val) {
    if (val === this.value) return;
    this.#tokens = [];
    this.add(...(val?.split(' ') ?? []));
  }

  toString() {
    return this.value;
  }

  item(index) {
    return this.#tokens[index];
  }

  values() {
    return this.#tokens.values();
  }

  keys() {
    return this.#tokens.keys();
  }

  forEach(callback) {
    this.#tokens.forEach(callback);
  }

  add(...tokens) {
    tokens.forEach((t) => {
      if (!this.contains(t)) this.#tokens.push(t);
    });
    // if the attribute was removed don't try to add it again.
    if (this.value === '' && !this.#el?.hasAttribute(`${this.#attr}`)) {
      return;
    }
    this.#el?.setAttribute(`${this.#attr}`, `${this.value}`);
  }

  remove(...tokens) {
    tokens.forEach((t) => {
      this.#tokens.splice(this.#tokens.indexOf(t), 1);
    });
    this.#el?.setAttribute(`${this.#attr}`, `${this.value}`);
  }

  contains(token) {
    return this.#tokens.includes(token);
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
  }
}
