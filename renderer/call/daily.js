let callFrame;

const playUrl = new URL('./play.png', document.baseURI);
playUrl.protocol = 'img';

const pauseUrl = new URL('./pause.png', document.baseURI);
pauseUrl.protocol = 'img';

const playButton = {
  iconPath: playUrl.href,
  label: 'Play',
  tooltip: 'Play Feed.fm music',
};

const pauseButton = {
  iconPath: pauseUrl.href,
  label: 'Pause',
  tooltip: 'Pause Feed.fm music',
};

const customTrayButtons = {
  toggleMusic: playButton,
};

let feedPlayer;
let musicIsPlaying = false;

window.addEventListener('DOMContentLoaded', () => {
  feedPlayer = initFeed();
  initCall();
});

function initCall() {
  const container = document.getElementById('container');

  callFrame = DailyIframe.createFrame(container, {
    showLeaveButton: true,
    iframeStyle: {
      position: 'fixed',
      width: 'calc(100% - 1rem)',
      height: 'calc(100% - 1rem)',
    },
    customTrayButtons,
  })
    .on('nonfatal-error', (e) => {
      console.warn('nonfatal error:', e);
    })
    .on('left-meeting', () => {
      initCall();
    })
    .on('custom-button-click', (ev) => {
      if (ev.button_id === 'toggleMusic') {
        if (!musicIsPlaying) {
          feedPlayer.initializeAudio();
          feedPlayer.play();
        } else {
          feedPlayer.pause();
        }
        musicIsPlaying = !musicIsPlaying;
        const musicBtn = musicIsPlaying ? pauseButton : playButton;
        customTrayButtons.toggleMusic = musicBtn;
        callFrame.updateCustomTrayButtons(customTrayButtons);
      }
    });

  // TODO: Replace the following URL with your own room URL.
  callFrame.join({ url: 'https://{DAILY_DOMAIN}.daily.co/{DAILY_ROOM_NAME}' });
}
