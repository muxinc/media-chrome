import { Slider } from '@mui/material';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const Seekbar = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  const [min, max] = useMediaSelector((state) => state.mediaSeekable) ?? [];
  return (
    <Slider
      aria-label="seekbar"
      value={mediaCurrentTime ?? 0}
      min={min}
      max={max}
      onChange={(_event, value) => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = value;
        dispatch({ type, detail });
      }}
      size="small"
      sx={{
        mx: 2,
      }}
    ></Slider>
  );
};

export default Seekbar;
