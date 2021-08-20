const excludeKeys = ["webkitDisplayingFullscreen", "webkitSupportsFullscreen"];

// for (var k in HTMLElement.prototype) {
//   excludeKeys.push(k);
// }

const vidEl = document.createElement("video");

const vidElKeys = [];
const allVidElKeys = [];
for (let k in vidEl) {
  allVidElKeys.push(k);
  if (excludeKeys.includes(k)) break;
  vidElKeys.push(k);
}

console.log("excludeKeys", excludeKeys);
console.log("allVidElKeys", allVidElKeys);
console.log("vidElKeys", vidElKeys);

const desiredKeys = [
  "width",
  "height",
  "videoWidth",
  "videoHeight",
  "poster",
  "webkitDecodedFrameCount",
  "webkitDroppedFrameCount",
  "playsInline",
  "onenterpictureinpicture",
  "onleavepictureinpicture",
  "disablePictureInPicture",
  "cancelVideoFrameCallback",
  "requestVideoFrameCallback",
  "webkitEnterFullScreen",
  "webkitEnterFullscreen",
  "webkitExitFullScreen",
  "webkitExitFullscreen",
  "requestPictureInPicture",
  "getVideoPlaybackQuality",
  "error",
  "src",
  "currentSrc",
  "crossOrigin",
  "networkState",
  "preload",
  "buffered",
  "readyState",
  "seeking",
  "currentTime",
  "duration",
  "paused",
  "defaultPlaybackRate",
  "playbackRate",
  "played",
  "seekable",
  "ended",
  "autoplay",
  "loop",
  "controls",
  "controlsList",
  "volume",
  "muted",
  "defaultMuted",
  "textTracks",
  "webkitAudioDecodedByteCount",
  "webkitVideoDecodedByteCount",
  "onencrypted",
  "onwaitingforkey",
  "srcObject",
  "NETWORK_EMPTY",
  "NETWORK_IDLE",
  "NETWORK_LOADING",
  "NETWORK_NO_SOURCE",
  "HAVE_NOTHING",
  "HAVE_METADATA",
  "HAVE_CURRENT_DATA",
  "HAVE_FUTURE_DATA",
  "HAVE_ENOUGH_DATA",
  "addTextTrack",
  "canPlayType",
  "captureStream",
  "load",
  "pause",
  "play",
  "sinkId",
  "remote",
  "disableRemotePlayback",
  "preservesPitch",
  "setSinkId",
  "mediaKeys",
  "setMediaKeys",
];

const desiredEventTargetKeys = [
  "addEventListener",
  "dispatchEvent",
  "removeEventListener",
];

const getProtoChainList = (o, shouldTerminate = (protoObj) => !protoObj) => {
  const currentProtoObj = Object.getPrototypeOf(o);
  if (shouldTerminate(currentProtoObj)) return [];
  return [
    currentProtoObj,
    ...getProtoChainList(currentProtoObj, shouldTerminate),
  ];
};

const protoList = [
  EventTarget.prototype,
  ...getProtoChainList(
    document.createElement("video"),
    (protoObj) => HTMLElement.prototype === protoObj
  ),
].flatMap((protoObj) =>
  Object.keys(protoObj)
    .filter((k) => excludeKeys.includes(k))
    .map((k) => {
      [k, Object.getOwnPropertyDescriptor(protoObj, k)];
    })
);

// console.log('proto chain list', ...getProtoChainList(document.createElement('video'), protoObj => HTMLElement.prototype === protoObj));
console.log("proto chain list", ...protoList, "length", protoList.length);
