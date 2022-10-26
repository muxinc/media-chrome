import React from "react";
import { MediaChromeListItem } from "../../../types";

const toAttrsStrings = (
  htmlAttrs: { [k: string]: string | boolean | undefined } = {}
) => {
  return Object.entries(htmlAttrs).reduce<string[]>(
    (attrStrs, [attrName, attrValue]) => {
      if (typeof attrValue === "undefined") return attrStrs;
      if (typeof attrValue === "boolean") {
        if (!attrValue) return attrStrs;
        return [...attrStrs, attrName];
      }
      if (!attrValue) return [...attrStrs, attrName];
      return [...attrStrs, `${attrName}="${attrValue}"`];
    },
    []
  );
};

const A11YDescription: React.FC<{ value?: MediaChromeListItem["a11y"] }> = ({
  value,
}) => {
  if (!value) return null;
  const label = "Accessibility Features";
  return (
    <div className="flex flex-col items-top">
      <h3
        aria-hidden="true"
        style={{ fontSize: "13px", letterSpacing: "1px" }}
        className="uppercase font-semibold"
      >
        {label}
      </h3>
      <div className="inline-block">
        {toAttrsStrings(value).map((str, i) => (
          <code key={i} className="block break-words">
            {str}
          </code>
        ))}
      </div>
    </div>
  );
};

const Description: React.FC<{
  selectedItem?: MediaChromeListItem;
  defaultDescription?: string;
}> = ({
  selectedItem,
  defaultDescription = "Hover over each player element to explore more.",
}) => {
  const { description = defaultDescription, a11y } = selectedItem ?? {};

  return (
    <div
      role="region"
      aria-atomic="true"
      aria-hidden={!selectedItem}
      aria-live="polite"
      className="text-sm break-words border-t border-b border-black py-4 my-2 lg:py-0 lg:my-0 lg:border-transparent lg:grid lg:grid-cols-2 lg:gap-12 lg:h-24"
    >
      <p className="pb-4">{description}</p>
      <A11YDescription value={a11y} />
    </div>
  );
};

export default Description;
