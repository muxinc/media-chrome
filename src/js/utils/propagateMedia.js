/*
  Set the media property of all child elements
  except for any that are <media-chrome> or media elements with slot=media

  This allows media-chrome-html-elements to live inside generic native elements
  or other custom elements and still have their media prop auto set.
*/

export function setAndPropagateMedia(el, media) {
  const elName = el.nodeName.toLowerCase();

  // Can't set <media-chrome> media
  // and shouldn't propagate into a child media-chrome
  if (elName == 'media-chrome') return;

  // Only custom elements might have the correct media attribute
  if (elName.includes('-')) {
    window.customElements.whenDefined(elName).then(()=>{
      if (el instanceof MediaChromeHTMLElement) {
        // Media-chrome html els propogate to their children automatically
        // including to shadow dom children
        el.media = media;
      } else {
        // Otherwise continue to this el's children
        propagateMedia(el, media);
      }
    });
  } else if (el.slot !== 'media') {
    // If not a custom element or media element, continue to children
    propagateMedia(el, media);
  }
};

/*
  Recursively set the media prop of all child MediaChromeHTMLElements
*/
export function propagateMedia(parent, media) {
  Array.prototype.forEach.call(parent.children, (child)=>{
    setAndPropagateMedia(child, media);
  });
}
