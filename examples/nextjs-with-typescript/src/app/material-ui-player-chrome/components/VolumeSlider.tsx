import { Slider, Tooltip } from '@mui/material';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const label = 'Volume';

const VolumeSlider = ({
  orientation = 'horizontal',
}: {
  orientation?: 'horizontal' | 'vertical';
}) => {
  const dispatch = useMediaDispatch();
  const mediaVolume = useMediaSelector((state) => state.mediaVolume);
  const mediaMuted = useMediaSelector((state) => state.mediaMuted);
  const value = mediaMuted ? 0 : (mediaVolume ?? 0.5) * 100;
  return (
    <Tooltip title={label} placement="top">
      <Slider
        aria-label={label}
        min={0}
        max={100}
        value={value}
        onChange={(_event, value) => {
          const type = MediaActionTypes.MEDIA_VOLUME_REQUEST;
          const detail = (value as number) / 100;
          dispatch({ type, detail });
        }}
        orientation={orientation}
        size="small"
        sx={{
          mx: 2,
          width: 100,
        }}
      />
    </Tooltip>
  );
};

export default VolumeSlider;
