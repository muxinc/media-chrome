import { t } from '../utils/i18n.js';

export type MediaErrorLike = {
  code: number;
  message: string;
  [key: string]: any;
};

// Returning null makes the error not show up in the UI.
export const formatError = (error: MediaErrorLike) => {
  if (error.code === 1) return null;

  let title = '';
  let message = '';

  switch (error.code) {
    case 2:
      title = t('Network Error');
      message = t('A network error caused the media download to fail.');
      break;
    case 3:
      title = t('Decode Error');
      message = t(
        'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.'
      );
      break;
    case 4:
      title = t('Source Not Supported');
      message = t(
        'An unsupported error occurred. The server or network failed, or your browser does not support this format.'
      );
      break;
    case 5:
      title = t('Encryption Error');
      message = t('The media is encrypted and there are no keys to decrypt it.');
      break;
    default:
      title = `Error ${error.code}`;
      message = error.message;
  }

  return { title, message };
};