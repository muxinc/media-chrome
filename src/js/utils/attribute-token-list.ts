export class AttributeTokenList
  implements
    Pick<
      DOMTokenList,
      | 'length'
      | 'value'
      | 'toString'
      | 'item'
      | 'add'
      | 'remove'
      | 'contains'
      | 'toggle'
      | 'replace'
    >
{
  #el: HTMLElement;
  #attr: string;
  #defaultSet: Set<string>;
  #tokenSet: Set<string> = new Set<string>();

  constructor(
    el?: HTMLElement,
    attr?: string,
    { defaultValue } = { defaultValue: undefined }
  ) {
    this.#el = el;
    this.#attr = attr;
    this.#defaultSet = new Set(defaultValue);
  }

  [Symbol.iterator]() {
    return this.#tokens.values();
  }

  get #tokens(): Set<string> {
    return this.#tokenSet.size ? this.#tokenSet : this.#defaultSet;
  }

  get length(): number {
    return this.#tokens.size;
  }

  get value(): string {
    return [...this.#tokens].join(' ') ?? '';
  }

  set value(val: string) {
    if (val === this.value) return;
    this.#tokenSet = new Set();
    this.add(...(val?.split(' ') ?? []));
  }

  toString(): string {
    return this.value;
  }

  item(index): string {
    return [...this.#tokens][index];
  }

  values(): Iterable<string> {
    return this.#tokens.values();
  }

  forEach(
    callback: (value: string, key: string, parent: Set<string>) => void,
    thisArg?: any
  ) {
    this.#tokens.forEach(callback, thisArg);
  }

  add(...tokens: string[]): void {
    tokens.forEach((t) => this.#tokenSet.add(t));
    // if the attribute was removed don't try to add it again.
    if (this.value === '' && !this.#el?.hasAttribute(`${this.#attr}`)) {
      return;
    }
    this.#el?.setAttribute(`${this.#attr}`, `${this.value}`);
  }

  remove(...tokens: string[]): void {
    tokens.forEach((t) => this.#tokenSet.delete(t));
    this.#el?.setAttribute(`${this.#attr}`, `${this.value}`);
  }

  contains(token: string): boolean {
    return this.#tokens.has(token);
  }

  toggle(token: string, force: boolean): boolean {
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

  replace(oldToken: string, newToken: string): boolean {
    this.remove(oldToken);
    this.add(newToken);
    return oldToken === newToken;
  }
}
