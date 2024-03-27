import { Typography } from '@mui/material';
import { useMediaSelector, timeUtils } from 'media-chrome/react/media-store';
const { formatTime } = timeUtils;

const CurrentTimeDisplay = () => {
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  const [, seekableEnd] = useMediaSelector((state) => state.mediaSeekable) ?? [];
  return (
    <Typography
      variant="button"
      color="primary"
      sx={{
        mx: 2,
      }}
    >
      {formatTime(mediaCurrentTime ?? 0, seekableEnd)}
    </Typography>
  );
};

export default CurrentTimeDisplay;
