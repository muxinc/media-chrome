/** @jsxImportSource react */
import clsx from 'clsx';
import React, { useEffect } from 'react';
import type { MediaChromeListItem } from '../../../types';
import Description from './description';
import X from './icons/x';

const noop = () => {};

const ComponentNameRenderer: React.FC<{
  value: MediaChromeListItem;
  selected?: boolean;
}> = ({ value, selected }) => {
  const { name } = value;
  return (
    <>
      <span
        className={clsx({
          invisible: !selected,
        })}
      >{`<media-`}</span>
      <span>{name}</span>
      <span
        className={clsx({
          invisible: !selected,
        })}
      >{`>`}</span>
    </>
  );
};

const MediaChromeListItemRenderer: React.FC<{
  value: MediaChromeListItem;
  id: string;
  listId: string;
  selected?: boolean;
  active?: boolean;
  showActive?: boolean;
  selectItem?: (value: MediaChromeListItem) => void;
  deselectItem?: (value: MediaChromeListItem) => void;
}> = ({
  value,
  selected,
  active,
  showActive = true,
  selectItem = noop,
  deselectItem = noop,
  listId,
  id,
}) => {
  const { name } = value;

  return (
    <li
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      aria-label={name}
      id={id}
      onMouseEnter={() => selectItem(value)}
      onMouseLeave={(evt) => {
        const { relatedTarget } = evt;
        // NOTE: Don't deselect item if we're about to select another item
        // to avoid potential timing cosmetic issues (CJP)
        if (
          relatedTarget instanceof Node &&
          document.getElementById(listId)?.contains(relatedTarget)
        ) {
          return;
        }
        deselectItem(value);
      }}
      // NOTE: Semi-hacky way of ensuring that focus isn't set to element
      // (should only be set to list itself) (CJP)
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => selectItem(value)}
      className={clsx('block w-full', {
        'outline-black': active && showActive && !selected,
        outline: active && showActive && !selected,
      })}
    >
      <div
        aria-hidden="true"
        className={clsx('flex leading-7', {
          'text-primary-600': selected,
        })}
      >
        <ComponentNameRenderer value={value} selected={selected} />
        {selected ? (
          <>
            <span className="flex-grow"></span>
            <button
              aria-hidden="true"
              tabIndex={-1}
              // NOTE: Semi-hacky way of ensuring that focus isn't set to element
              // (should only be set to list itself) (CJP)
              onMouseDown={(e) => e.preventDefault()}
              onClick={(evt) => {
                // NOTE: Doing this to make sure the ancestor onClick() doesn't
                // get triggered to immediately re-select the corresponding item (CJP)
                evt.stopPropagation();
                evt.preventDefault();
                deselectItem(value);
              }}
            >
              <X className="inline h-4 lg:hidden" />
            </button>
          </>
        ) : null}
      </div>
      {selected ? (
        <div aria-hidden="true" className="text-left lg:hidden">
          <Description selectedItem={value} />
        </div>
      ) : null}
    </li>
  );
};

export default MediaChromeListItemRenderer;
