import { Document as document } from "./server-safe-globals";

export const getElementBySelector = (selector, nameStr, root = document) => {
    const matches = root.querySelectorAll(selector);

    if (!matches.length) return undefined;

    if (matches.length > 1) {
        const namePhraseStr = nameStr ? ` ${nameStr} ` : '';
        console.info(`Multiple elements matches found for${namePhraseStr}selector ${selector}. Will yield first match.`);
    }

    const [matchEl] = matches;
    return matchEl;
};

export const getElementBySelectorOrId = (selectorOrId, nameStr, root = document) => {
    const match = getElementBySelector(selectorOrId, nameStr, root);
    // If we didn't find a matching element via a selector, try an id-based selector instead.
    if (!match) return getElementBySelectorOrId(`#${selectorOrId}`, nameStr, root);
    return match;
};
