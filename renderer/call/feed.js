const feedInfoEleID = 'feed-info';

// eslint-disable-next-line no-unused-vars
function initFeed() {
  const player = new Feed.Player('demo', 'demo');

  // Display all the events the player triggers
  player.on('all', (event) => {
    console.log(`player triggered event '${event}':`, event);
  });

  player.on('play-started', onPlayStarted, onPlayStarted);
  return player;
}

function hideInfo() {
  document.getElementById(feedInfoEleID).style.opacity = 0;
}

function toggleInfo() {
  document.getElementById(feedInfoEleID).style.transition = 'opacity 1s';
  document.getElementById(feedInfoEleID).style.opacity = 1;
  setTimeout(hideInfo, 5000);
}

function onPlayStarted(x) {
  toggleInfo();

  const audioFile = x.audio_file;
  const artist = audioFile.artist.name;
  const release = audioFile.release.title;
  const { title } = audioFile.track;

  const feedTitle = document.getElementById('title');
  const feedArtist = document.getElementById('artist');
  const feedRelease = document.getElementById('release');
  feedTitle.innerHTML = title;
  feedArtist.innerHTML = artist;
  feedRelease.innerHTML = release;
}
