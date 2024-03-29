import * as React from 'react';
import Button from '@mui/material/Button';
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
const PlaybackRateMenuButton = ({ rates = DEFAULT_RATES }) => {
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
  const mediaPlaybackRate = useMediaSelector(
    (state) => state.mediaPlaybackRate
  );

  return (
    <>
      <Button
        id="playback-rate"
        aria-controls={open ? 'close playback rate' : 'select playback rate'}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="primary"
        onClick={handleClick}
      >
        {/* This show the current playback rate for the button's text */}
        {`${mediaPlaybackRate ?? 1}×`}
      </Button>
      <Menu
        id="playback-rate"
        aria-labelledby="playback-rate"
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
        {/* This creates a list of <MenuItem/>s with a corresponding playback rate value */}
        {rates.map((rate) => {
          return (
            <MenuItem
              key={rate}
              // Indicate the menu item is selected if its rate matches the current playback rate
              selected={rate === mediaPlaybackRate}
              /**
               * This is an example of using dispatch() to make a state change request. In this case, whenever
               * someone clicks on one of the <MenuItem/>s (thus causing an onClick event), we want to make a MEDIA_PLAYBACK_RATE_REQUEST
               * to the <MediaProvider/>'s MediaStore to change the playback rate to the rate associated with the component.
               * This is an example of a state change request that requires a "detail" (in this case, a numeric "playback rate")
               * for it to make sense, since making a request to change the playback rate in the media begs the question: *What* rate?
               */
              onClick={() => {
                const type = MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST;
                const detail = rate;
                dispatch({ type, detail });
                handleClose();
              }}
              // Display the playback rate that corresponds to this <MenuItem/>
            >{`${rate}×`}</MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default PlaybackRateMenuButton;
