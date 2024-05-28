/** @jsxImportSource react */
import clsx from "clsx";

const toAttrsString = (
  htmlAttrs: { [k: string]: string | boolean | undefined } = {}
) => {
  const attrStrs = Object.entries(htmlAttrs).reduce<string[]>(
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
  if (!attrStrs.length) return "";
  return ` ${attrStrs.join(" ")}`;
};

const HtmlRenderer: React.FC<{
  name?: string;
  selectedName?: string;
  nameFormatter?: (name?: string) => string;
  htmlAttrs?: { [k: string]: string | boolean | undefined };
  children?: React.ReactNode;
}> = ({
  name,
  selectedName,
  htmlAttrs,
  nameFormatter = (x = "") => x,
  children,
}) => {
  if (!children) {
    return (
      <pre
        className={clsx({
          "text-primary-600 font-semibold": selectedName === name,
        })}
      >
        {`<${nameFormatter(name)}${toAttrsString(htmlAttrs)}>`}
        {`</${nameFormatter(name)}>`}
      </pre>
    );
  }

  return (
    <>
      <pre
        className={clsx({
          "text-primary-600 font-semibold": selectedName === name,
        })}
      >{`<${nameFormatter(name)}${toAttrsString(htmlAttrs)}>`}</pre>
      <div className="ml-4">{children}</div>
      <pre
        className={clsx({
          "text-primary-600 font-semibold": selectedName === name,
        })}
      >{`</${nameFormatter(name)}>`}</pre>
    </>
  );
};

export default HtmlRenderer;
