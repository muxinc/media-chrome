import { Typography } from '@mui/material';
import { useMediaSelector, timeUtils } from 'media-chrome/react/media-store';
const { formatTime } = timeUtils;

/**
 * A component to show the duration/remaining time of current media. In this example, we allow you to toggle
 * which kind of display you'd like with the "remaining" prop.
 */
const DurationDisplay = ({ remaining = true }) => {
  /**
   * The useMediaSelector() hook is how you get the latest bit(s) of media state you care about in your component.
   * This is a simple use case of grabbing a single bit of state (in this case mediaCurrentTime) and a pattern that
   * you'd likely use a lot.
   */
  const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
  /**
   * For this component, we're also grabbing the media's "seekable end" state. This is generally equivalent to "mediaDuration",
   * except it also accounts for things like live/DVR media playback.
   * NOTE: in this case, we're doing some mildly fancier logic to make sure (for things like SSR/async) that mediaSeekable + seekableEnd
   * have been set, since we're using it for math, below. In the future, we may account for more of these
   * kinds of cases automatically to reduce complexity/cognitive load for folks using the MediaStore and/or react hooks.
   */
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
      {/**
       * Media Chrome also has some handy utils that we use in our own web components. This one, formatTime() takes numeric seconds for time and a "guide"
       * for the maximum possible time and formats it as a time string (e.g. "5:32"). In this use case, we're also taking advantage of the fact
       * that passing in a negative numeric value for time represents it as a "count down" (e.g. "-2:14").
       */}
      {remaining
        ? formatTime(-(seekableEnd - (mediaCurrentTime ?? 0)), seekableEnd)
        : formatTime(seekableEnd, seekableEnd)}
    </Typography>
  );
};

export default DurationDisplay;
