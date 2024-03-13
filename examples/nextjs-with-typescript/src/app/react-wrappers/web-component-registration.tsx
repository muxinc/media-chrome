'use client';
import 'media-chrome';

// Clever little hack way to allow our web components' usage to be RSCs (instead of client side components) but ensure
// the code that needs to run in the browser (e.g. the web component definitions and registration) is actually
// included & executed on the client side. See usage in player.tsx for complete example. (CJP)
export default () => <></>;
