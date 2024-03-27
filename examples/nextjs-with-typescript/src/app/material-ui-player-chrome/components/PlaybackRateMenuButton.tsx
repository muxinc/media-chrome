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

const PlaybackRateMenuButton = ({ rates = DEFAULT_RATES }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useMediaDispatch();
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
        {rates.map((rate) => {
          return (
            <MenuItem
              key={rate}
              selected={rate === mediaPlaybackRate}
              onClick={() => {
                const type = MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST;
                const detail = rate;
                dispatch({ type, detail });
                handleClose();
              }}
            >{`${rate}×`}</MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default PlaybackRateMenuButton;
