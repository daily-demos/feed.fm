let callFrame;

window.addEventListener('DOMContentLoaded', () => {
  initCall();
});

function initCall() {
  const container = document.getElementById('container');

  const url = new URL('./backgroundButton.png', document.baseURI);
  url.protocol = 'bg';

  callFrame = DailyIframe.createFrame(container, {
    showLeaveButton: true,
    iframeStyle: {
      position: 'fixed',
      width: 'calc(100% - 1rem)',
      height: 'calc(100% - 1rem)',
    },
    // Specify a custom button for background controls
    customTrayButtons: {
      backgrounds: {
        iconPath: url.href,
        label: 'Background',
        tooltip: 'Set Custom Background',
      },
    },
  })
    .on('nonfatal-error', (e) => {
      console.warn('nonfatal error:', e);
    })
    .on('left-meeting', () => {
      initCall();
    })
    .on('custom-button-click', (ev) => {
      // If the event is triggered by clicking
      // our background button, show the
      // background selection window
      if (ev.button_id === 'backgrounds') {
        api.tryEnableBackgrounds();
      }
    });

  // TODO: Replace the following URL with your own room URL.
  callFrame.join({ url: 'https://lizashul.daily.co/carrot' });
}

window.addEventListener('set-background', (ev) => {
  const data = ev.detail;
  let { imgPath } = data;
  imgPath = `bg://${imgPath}`;

  callFrame.updateInputSettings({
    video: {
      processor: {
        type: 'background-image',
        config: {
          source: imgPath,
        },
      },
    },
  });
});

window.addEventListener('reset-background', () => {
  callFrame.updateInputSettings({
    video: {
      processor: {
        type: 'none',
      },
    },
  });
});
