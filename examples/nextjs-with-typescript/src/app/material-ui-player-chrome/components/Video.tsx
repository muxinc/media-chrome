import { useMediaRef } from 'media-chrome/react/media-store';
import {
  ElementType,
  VideoHTMLAttributes,
  DetailedHTMLProps,
  createElement,
} from 'react';
const Video = (
  props: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > & {
    component?: ElementType<
      DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
    >;
  }
) => {
  const { children, component = 'video', ...restProps } = props;
  const mediaRefCallback = useMediaRef();
  // While this may feel like magic to folks, in the "default" use case, you can think of it as:
  // return (<video ref={mediaRefCallback} {...restProps} >{children}</video>);
  return createElement(
    component,
    { ref: mediaRefCallback, ...restProps },
    children
  );
};

export default Video;
