/** @jsxImportSource react */
import { MediaChromeListItem } from "../types";
import HtmlRenderer from "./html-renderer";

const toMediaChromeName = (name: string = "") => `media-${name}`;

const MediaChromeHtmlRenderer: React.FC<
  {
    selectedName?: string;
    nameFormatter?: (name?: string) => string;
    htmlAttrs?: { [k: string]: string | boolean | undefined };
  } & Partial<MediaChromeListItem>
> = ({ children, nameFormatter = toMediaChromeName, ...restProps }) => {
  return (
    <HtmlRenderer {...restProps} nameFormatter={nameFormatter}>
      {children}
    </HtmlRenderer>
  );
};

export default MediaChromeHtmlRenderer;
