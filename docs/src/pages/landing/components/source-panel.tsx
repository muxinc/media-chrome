/** @jsxImportSource react */
import { MediaChromeListItem } from "../../../types";
import HtmlRenderer from "./html-renderer";
import MediaChromeHtmlRenderer from "./media-chrome-html-renderer";

const SourcePanel: React.FC<{ selectedItem?: MediaChromeListItem }> = ({
  selectedItem,
}) => {
  const { name: selectedName } = selectedItem ?? {};
  return (
    <MediaChromeHtmlRenderer selectedName={selectedName} name="controller">
      <HtmlRenderer
        name="video"
        htmlAttrs={{
          slot: "media",
          src: "./video.mp4",
          crossOrigin: "",
          playsInline: true,
        }}
      >
        <HtmlRenderer
          htmlAttrs={{
            label: "English",
            kind: "captions",
            srcLang: "en",
            src: "./captions.vtt",
          }}
          name="track"
        />
        <HtmlRenderer
          htmlAttrs={{
            label: "thumbnails",
            default: true,
            kind: "metadata",
            src: "./thumbnails.vtt",
          }}
          name="track"
        />
      </HtmlRenderer>
      <MediaChromeHtmlRenderer selectedName={selectedName} name="control-bar">
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="play-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="seek-forward-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="seek-backward-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="mute-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="volume-range"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="time-range"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="time-display"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="captions-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="playback-rate-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="pip-button"
        />
        <MediaChromeHtmlRenderer
          selectedName={selectedName}
          name="fullscreen-button"
        />
      </MediaChromeHtmlRenderer>
    </MediaChromeHtmlRenderer>
  );
};

export default SourcePanel;
