/** @jsxImportSource react */
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { MediaChromeListItem } from "../../../types";
import MediaChromeListItemRenderer from "./media-chrome-list-item-renderer";

const noop = () => {};

const ComponentsList: React.FC<{
  tabIndex?: number;
  items: MediaChromeListItem[];
  selectedItem?: MediaChromeListItem;
  onItemSelected?: (value: MediaChromeListItem) => void;
  onItemDeselected?: (value: MediaChromeListItem) => void;
  name?: string;
}> = ({
  tabIndex = 0,
  items,
  selectedItem,
  onItemSelected = noop,
  onItemDeselected = noop,
  name = "componentsList",
}) => {
  const labelId = `${name}Label`;
  const listId = `${name}:listbox`;
  const [activeItem, setActiveItem] = useState<MediaChromeListItem>();
  const [mouseFocus, setMouseFocus] = useState(false);

  useEffect(() => {
    if (!items.length || !selectedItem) return;
    setActiveItem(selectedItem);
  }, [selectedItem, items]);

  const activeId = activeItem ? `${name}:listitem:${activeItem.name}` : "";
  return (
    <>
      <div className="hidden lg:block">{`<media-chrome>`}</div>
      <div id={labelId} className="lg:hidden pb-8">
        Explore web components:
      </div>
      <ul
        role="listbox"
        id={listId}
        aria-labelledby={labelId}
        // NOTE: Semi-hacky way of ensuring that focus is set to list
        // when user clicks/taps a list item (CJP)
        onMouseDown={({ currentTarget }) => {
          setMouseFocus(true);
          currentTarget.focus();
        }}
        onFocus={() => {
          if (activeItem) return;
          const nextActiveItem = selectedItem ?? items?.[0];
          setActiveItem(nextActiveItem);
        }}
        onBlur={() => {
          setActiveItem(undefined);
          setMouseFocus(false);
        }}
        onKeyDown={(evt) => {
          const { key } = evt;
          setMouseFocus(false);
          const curActiveIdx = items.findIndex((item) => item === activeItem) || 0;
          if (key === "ArrowDown" || key === "ArrowRight") {
            if (curActiveIdx + 1 < items.length) {
              setActiveItem(items[curActiveIdx + 1]);
            }
          }
          if (key === "ArrowUp" || key === "ArrowLeft") {
            if (curActiveIdx - 1 >= 0) {
              setActiveItem(items[curActiveIdx - 1]);
            }
          }
          if (activeItem && (key === "Enter" || key === " ")) {
            evt.stopPropagation();
            evt.preventDefault();
            const selected = activeItem === selectedItem;
            const selectionFn = selected ? onItemDeselected : onItemSelected;
            selectionFn(activeItem);
          }
        }}
        tabIndex={tabIndex}
        className={clsx("flex-grow overflow-auto", {
          "focus:outline-none": mouseFocus,
        })}
        aria-activedescendant={activeId}
      >
        {items.map((value, i) => {
          const selected = value === selectedItem;
          const active = value === activeItem;
          return (
            <MediaChromeListItemRenderer
              key={value.name}
              id={`${name}:listitem:${value.name}`}
              listId={listId}
              value={value}
              selected={selected}
              active={active}
              showActive={!mouseFocus}
              selectItem={onItemSelected}
              deselectItem={(item) => {
                setActiveItem(undefined);
                onItemDeselected(item);
              }}
            />
          );
        })}
      </ul>
    </>
  );
};

export default ComponentsList;
