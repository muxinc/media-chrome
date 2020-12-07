/*
  Set the media property of all child elements
  except for any that are <media-chrome> or media elements with slot=media

  This allows media-chrome-html-elements to live inside generic native elements
  or other custom elements and still have their media prop auto set.
*/

export function setMedia(el, media) {
  const elName = el.nodeName.toLowerCase();

  // Only custom elements might have the correct media attribute
  if (elName.includes('-')) {
    window.customElements.whenDefined(elName).then(()=>{
      if (el instanceof MediaChromeHTMLElement) {
        // Media-chrome html els propogate to their children automatically
        // including to shadow dom children
        el.media = media;
      } else {
        propagateMedia(el, media);
      }
    });
  } else if (el.slot !== 'media' && elName !== 'media-chrome') {
    propagateMedia(el, media);
  }
};

export function propagateMedia(parent, media) {
  // Recursively add to children
  Array.prototype.forEach.call(parent.children, (child)=>{
    setMedia(child, media);
  });
}
