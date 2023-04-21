import { createContext } from 'react';

export const ReactMediaChromeContext = createContext(null);
if (process.env.NODE_ENV !== 'production') {
  ReactMediaChromeContext.displayName = 'ReactMediaChrome';
}

export default ReactMediaChromeContext;
