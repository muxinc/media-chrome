/** @jsxImportSource react */
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import type { MediaChromeListItem } from "../../../types";
import mux from 'mux-embed';
import {
  MediaController,
  MediaControlBar,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaPlaybackRateButton,
  MediaPipButton,
  MediaFullscreenButton,
} from "media-chrome/react";

const hasSelectedAncestor = (...ancestors: any) => {
  return (self: any, selectedItem?: MediaChromeListItem) =>
    !!selectedItem?.component &&
    [self, ...ancestors].some(
      (ancestorOrSelf: any) => ancestorOrSelf === selectedItem.component
    );
};

const isSelectedInController = hasSelectedAncestor(MediaController);
const isSelectedInControlBar = hasSelectedAncestor(
  MediaController,
  MediaControlBar
);

export const PlayerPanel: React.FC<{
  selectedItem?: MediaChromeListItem;
  tabIndex?: number;
}> = ({ selectedItem, tabIndex = 0 }) => {
  // const autohidePropObj = selectedItem ? {autohide: -1} : {};
  const autohidePropObj = { autohide: -1 };
  const videoRef = useRef(null);
  const [playerInitTime] = useState(Date.now());

  useEffect(() => {
    if (videoRef.current) {
      mux.monitor(videoRef.current, {
        data: {
          env_key: 'l9ktpqf9uc2ktpg0novkql02d',
          video_title: 'Media Chrome marketing site hero video',
          player_init_time: playerInitTime,
        }
      });
    }
  }, [playerInitTime, videoRef]);

  return (
    <MediaController
      tabIndex={tabIndex}
      {...autohidePropObj}
      className={clsx(
        "w-full",
        "h-auto",
        "max-w-full",
        "bg-black",
        "object-contain",
        "lg:mr-auto",
        "lg:flex-grow",
        "lg:flex-shrink",
        {
          "bg-primary-600": isSelectedInController(MediaController, selectedItem),
        }
      )}
      style={{
        aspectRatio: "16/9",
      }}
    >
      <video
        slot="media"
        src="https://stream.mux.com/ddBx5002F02xe7ftFvTFkYBxEdQ2inQ2o029CMqu9A4IcY/high.mp4"
        poster="https://image.mux.com/ddBx5002F02xe7ftFvTFkYBxEdQ2inQ2o029CMqu9A4IcY/thumbnail.jpg?time=0"
        crossOrigin=""
        playsInline
        muted
        className="h-full w-full"
        ref={videoRef}
        tabIndex={-1}
      >
        <track
          label="English"
          kind="captions"
          srcLang="en"
          src="/vtt/en-cc-mashup.vtt"
        ></track>
        <track
          label="thumbnails"
          default
          kind="metadata"
          src="https://image.mux.com/ddBx5002F02xe7ftFvTFkYBxEdQ2inQ2o029CMqu9A4IcY/storyboard.vtt"
        />
      </video>
      <div
        slot="centered-chrome"
        className="w-full flex justify-center align-center lg:hidden"
      >
        <MediaSeekBackwardButton
          className={clsx("p-0", {
            "bg-primary-600": isSelectedInController(
              MediaSeekBackwardButton,
              selectedItem
            ),
            "bg-transparent": !isSelectedInController(
              MediaSeekBackwardButton,
              selectedItem
            ),
          })}
          style={{
            width: "10%",
            margin: "5%",
          }}
        ></MediaSeekBackwardButton>
        <MediaPlayButton
          className={clsx("w-3", "p-0", {
            "bg-primary-600": isSelectedInController(
              MediaPlayButton,
              selectedItem
            ),
            "bg-transparent": !isSelectedInController(
              MediaPlayButton,
              selectedItem
            ),
          })}
          style={{
            width: "15%",
            margin: "5%",
          }}
        ></MediaPlayButton>
        <MediaSeekForwardButton
          className={clsx("w-3/20", "p-0", {
            "bg-primary-600": isSelectedInController(
              MediaSeekForwardButton,
              selectedItem
            ),
            "bg-transparent": !isSelectedInController(
              MediaSeekForwardButton,
              selectedItem
            ),
          })}
          style={{
            width: "10%",
            margin: "5%",
          }}
        ></MediaSeekForwardButton>
      </div>
      <MediaControlBar className={clsx("h-8", "lg:hidden")}>
        <MediaTimeRange
          className={clsx("h-auto", {
            "bg-primary-600": isSelectedInControlBar(MediaTimeRange, selectedItem),
            "bg-transparent": !isSelectedInControlBar(
              MediaTimeRange,
              selectedItem
            ),
          })}
        ></MediaTimeRange>
        <MediaTimeDisplay
          className={clsx({
            "bg-primary-600": isSelectedInControlBar(
              MediaTimeDisplay,
              selectedItem
            ),
            "bg-transparent": !isSelectedInControlBar(
              MediaTimeDisplay,
              selectedItem
            ),
          })}
        ></MediaTimeDisplay>
      </MediaControlBar>
      <MediaControlBar className={clsx("h-9 lg:h-11")}>
        <MediaPlayButton
          className={clsx(
            "hidden",
            "lg:block",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaPlayButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaPlayButton,
                selectedItem
              ),
            }
          )}
        ></MediaPlayButton>
        <MediaSeekForwardButton
          className={clsx(
            "hidden",
            "lg:block",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaSeekForwardButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaSeekForwardButton,
                selectedItem
              ),
            }
          )}
        ></MediaSeekForwardButton>
        <MediaSeekBackwardButton
          className={clsx(
            "hidden",
            "lg:block",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaSeekBackwardButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaSeekBackwardButton,
                selectedItem
              ),
            }
          )}
        ></MediaSeekBackwardButton>
        <MediaMuteButton
          className={clsx(
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaMuteButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaMuteButton,
                selectedItem
              ),
            }
          )}
        ></MediaMuteButton>
        <MediaVolumeRange
          className={clsx(
            "h-auto",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaVolumeRange,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaVolumeRange,
                selectedItem
              ),
            }
          )}
        ></MediaVolumeRange>
        <div
          className={clsx(
            "flex-grow",
            "lg:hidden ",
            {
              "bg-primary-600": isSelectedInControlBar(null, selectedItem),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(null, selectedItem),
            }
          )}
        ></div>
        <MediaTimeRange
          className={clsx(
            "hidden",
            "h-auto",
            "lg:block",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaTimeRange,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaTimeRange,
                selectedItem
              ),
            }
          )}
        ></MediaTimeRange>
        <MediaTimeDisplay
          className={clsx(
            "hidden",
            "lg:flex",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaTimeDisplay,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaTimeDisplay,
                selectedItem
              ),
            }
          )}
        ></MediaTimeDisplay>
        <MediaCaptionsButton
          className={clsx(
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaCaptionsButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaCaptionsButton,
                selectedItem
              ),
            }
          )}
        ></MediaCaptionsButton>
        <MediaPlaybackRateButton
          className={clsx(
            "self-center",
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaPlaybackRateButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaPlaybackRateButton,
                selectedItem
              ),
            }
          )}
        ></MediaPlaybackRateButton>
        <MediaPipButton
          className={clsx(
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaPipButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaPipButton,
                selectedItem
              ),
            }
          )}
        ></MediaPipButton>
        <MediaFullscreenButton
          className={clsx(
            "p-1.5",
            "lg:p-2.5",
            {
              "bg-primary-600": isSelectedInControlBar(
                MediaFullscreenButton,
                selectedItem
              ),
              "bg-gray-900 bg-opacity-60": !isSelectedInControlBar(
                MediaFullscreenButton,
                selectedItem
              ),
            }
          )}
        ></MediaFullscreenButton>
      </MediaControlBar>
    </MediaController>
  );
};

export default PlayerPanel;
