import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import CheckIcon from '@mui/icons-material/Check';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

export const DEFAULT_RATES = [1, 1.2, 1.5, 1.7, 2];
export const DEFAULT_RATE = 1;

/**
 * A menu button that shows/hides the playback rate options and allows a user to select between them, with
 * the option to provide different playback rates options via the "rates" prop
 */
const RenditionsMenuButton = () => {
  /**
   * This is typical/boilerplate MUI menu button code, so we won't focus on it, but
   * you can check out its {@link https://mui.com/material-ui/react-menu/|Menu docs}
   */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * The useMediaDispatch() hook is returns a function for dispatching media state change requests to the <MediaProvider/>'s
   * MediaStore. State change requests, or "actions," have a well defined "type" (defined in MediaActionTypes) and, depending on the type of request, may
   * also require some well defined "detail" about the request. For an example of a state change request, see below.
   */
  const dispatch = useMediaDispatch();
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * This is a simple use case of grabbing a single bit of state (in this case mediaPlaybackRate) and a pattern that
   * you'd likely use a lot.
   */
  const mediaRenditions = useMediaSelector(
    (state) => state.mediaRenditionList ?? []
  );
  const mediaRenditionSelected = useMediaSelector(
    (state) => state.mediaRenditionSelected
  );

  const label = open ? 'close renditions menu' : 'select rendition';

  return (
    <>
      <Tooltip title={label} placement="top">
        <IconButton
          id="renditions"
          aria-controls={label}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          color="primary"
          onClick={handleClick}
        >
          <GraphicEqIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="renditions"
        aria-labelledby="renditions"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem
          key={'auto'}
          selected={!mediaRenditionSelected}
          onClick={() => {
            const type = MediaActionTypes.MEDIA_RENDITION_REQUEST;
            const detail = undefined;
            dispatch({ type, detail });
            handleClose();
          }}
        >
          <CheckIcon
            sx={{
              opacity: !mediaRenditionSelected ? 1 : 0,
            }}
          />
          Auto
        </MenuItem>
        {mediaRenditions.map((rendition) => {
          const selected = rendition.id === mediaRenditionSelected;
          return (
            <MenuItem
              key={rendition.id}
              selected={selected}
              onClick={() => {
                const type = MediaActionTypes.MEDIA_RENDITION_REQUEST;
                const detail = rendition.id;
                dispatch({ type, detail });
                handleClose();
              }}
            >
              <CheckIcon
                sx={{
                  opacity: selected ? 1 : 0,
                }}
              />
              {/** @ts-ignore */}
              {`${rendition.height}×${rendition.width}`}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default RenditionsMenuButton;
