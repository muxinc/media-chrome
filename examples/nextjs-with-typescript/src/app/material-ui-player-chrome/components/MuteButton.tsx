import { IconButton, Tooltip } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
  useMediaDispatch,
  useMediaSelector,
  MediaActionTypes,
} from 'media-chrome/react/media-store';

const VolumeLevel = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  OFF: 'off',
} as const;

const VolumeIconComponentMap = {
  [VolumeLevel.HIGH]: VolumeUpIcon,
  [VolumeLevel.MEDIUM]: VolumeDownIcon,
  [VolumeLevel.LOW]: VolumeDownIcon,
  [VolumeLevel.OFF]: VolumeOffIcon,
  DEFAULT: VolumeOffIcon,
};

const MuteButton = () => {
  const dispatch = useMediaDispatch();
  const mediaVolumeLevel = useMediaSelector((state) => state.mediaVolumeLevel);
  const mediaPseudoMuted = mediaVolumeLevel === 'off';
  const IconComponent = VolumeIconComponentMap[mediaVolumeLevel ?? 'DEFAULT'];
  const label = mediaPseudoMuted ? 'Unmute' : 'Mute';
  return (
    <Tooltip title={label} placement="top">
      <IconButton
        aria-label={label}
        color="primary"
        onClick={() => {
          const type = mediaPseudoMuted
            ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
            : MediaActionTypes.MEDIA_MUTE_REQUEST;
          dispatch({ type });
        }}
      >
        <IconComponent />
      </IconButton>
    </Tooltip>
  );
};

export default MuteButton;
