import React from 'react';
import { ReactMediaChromeContext } from './Context.js';
import createMediaStore from '../../js/mediaStore.js';
const mediaUIStore = createMediaStore({})
function Provider({
  // mediaUIStore = createMediaStore({}),
  context,
  children,
  // serverState,
}) {
  const Context = context || ReactMediaChromeContext;

  // In a real version of this, we may want to make the store overridable and rely on some memoization "under the hood"
  return React.createElement(
    Context.Provider,
    { value: mediaUIStore },
    children
  );
}

export default Provider;
