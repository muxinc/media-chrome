import { Typography } from '@mui/material';
import { useMediaSelector, timeUtils } from 'media-chrome/react/media-store';
const { formatTime } = timeUtils;

const DurationDisplay = ({ remaining = true }) => {
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  const [, seekableEnd = 0] =
    useMediaSelector((state) => state.mediaSeekable) ?? [];
  return (
    <Typography
      variant="button"
      color="primary"
      sx={{
        mx: 2,
      }}
    >
      {remaining
        ? formatTime(-(seekableEnd - (mediaCurrentTime ?? 0)), seekableEnd)
        : formatTime(seekableEnd, seekableEnd)}
    </Typography>
  );
};

export default DurationDisplay;
