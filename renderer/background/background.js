window.addEventListener('DOMContentLoaded', () => {
  init();
});

// Initialize relevant handlers
function init() {
  const resetBtn = document.getElementById('reset');
  resetBtn.onclick = () => {
    api.resetBackground();
  };
}

// Listen for the "load-backgrounds" event sent by the preload,
// and load the given image files for the user to select from.
window.addEventListener('load-backgrounds', (event) => {
  const container = document.getElementById('bgImages');
  const { backgrounds } = event.detail;
  for (let i = 0; i < backgrounds.length; i += 1) {
    const img = document.createElement('img');
    const imgPath = backgrounds[i];
    img.src = imgPath;
    img.onclick = () => {
      api.setBackground(imgPath, false);
    };
    container.appendChild(img);
  }
});
