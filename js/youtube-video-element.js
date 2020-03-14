const template = document.createElement('template');

template.innerHTML = `
  <script src="https://www.youtube.com/iframe_api"></script>
  <script>
      onYouTubeIframeAPIReady() {
        console.log('HEEEEERE');
      };
  }
  </script>
  <style>
  .wrapper {
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;

    border: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  </style>

  <div class="wrapper">
    <iframe
      id="player"
      type="text/html"
      src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1"
      frameborder="0"
    ></iframe>
  </div>
`;

class YoutubeVideoElement extends YoutubeVideoElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
  }

  get src() {
    // Use the attribute value as the source of truth.
    // No need to store it in two places.
    // This avoids needing a to read the attribute initially and update the src.
    return this.getAttribute('src');
  }

  set src(val) {
    // If being set by attributeChangedCallback,
    // dont' cause an infinite loop
    if (val !== this.src) {
      this.setAttribute('src', val);
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  //   var player;
  //    onYouTubeIframeAPIReady() {
  //     player = new YT.Player('existing-iframe-example', {
  //         events: {
  //           'onReady': onPlayerReady,
  //           'onStateChange': onPlayerStateChange
  //         }
  //     });
  //   }
  //   function onPlayerReady(event) {
  //     document.getElementById('existing-iframe-example').style.borderColor = '#FF6D00';
  //   }
  // }
  }
}

window.customElements.define('youtube-video', YoutubeVideoElement);
window.YoutubeVideoElement = YoutubeVideoElement;

export default YoutubeVideoElement;
