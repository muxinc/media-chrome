'use client';
import '@mux/mux-video';
import { useMediaRef } from 'media-chrome/react/media-store';
import {
  ElementType,
  VideoHTMLAttributes,
  DetailedHTMLProps,
  createElement,
} from 'react';

export type MuxVideoProps = {
  'playback-id'?: string;
};

/**
 * @description This is a "thin wrapper" around the media component whose primary responsibility is to wire up the element
 * to the <MediaProvider/>'s MediaStore for the media state.
 * @param props - Identical to both a <video/>'s props and the <Player/> props, with one addition that may be familiar to
 * MUI users: a `component` prop that allows you to use something other than the <video/> element under the hood.
 * @returns A media react component (e.g. <video/>), wired up as the media element.
 */
const Video = (
  props: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > &
    MuxVideoProps & {
      component?: ElementType<
        DetailedHTMLProps<
          VideoHTMLAttributes<HTMLVideoElement>,
          HTMLVideoElement
        >
      >;
    }
) => {
  const { children, component = 'mux-video', poster, ...restProps } = props;
  /**
   * The useMediaRef() hook returns a ref callback function that will "wire up" an element to be used by the MediaStore as the media
   * element whose state you want to monitor and make state change requests to.
   * In most cases, you can just pass it to the ref property of the relevant component you want to use as your "media element".
   */
  const mediaRefCallback = useMediaRef();
  // Just some light-touch fanciness to infer a Mux Video poster image when using a (Mux Video) playback-id.
  const posterSrc = poster
    ? poster
    : restProps['playback-id']
    ? `https://image.mux.com/${restProps['playback-id']}/thumbnail.webp`
    : undefined;
  // NOTE: While this may feel like magic to folks, in the "default" use case, you can think of it as:
  // return (<video ref={mediaRefCallback} {...restProps} >{children}</video>);
  return createElement(
    component,
    { ref: mediaRefCallback, poster: posterSrc, ...restProps },
    children
  );
};

export default Video;
