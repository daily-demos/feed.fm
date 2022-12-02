var player = new Feed.Player("demo", "demo");

window.addEventListener("DOMContentLoaded", () => {
  initFeed();
});

function hideInfo(x){
    document.getElementById("feed-info").style.opacity = 0
  }

  function toggleInfo(x){
    document.getElementById("feed-info").style.transition ="opacity 1s"
    document.getElementById("feed-info").style.opacity = 1
    setTimeout(hideInfo, 5000);
  }

function play_started(x) {
  
  toggleInfo();
  
  let audio_file = x.audio_file;
  let artist = audio_file.artist.name;
  let release = audio_file.release.title;
  let title = audio_file.track.title;
  
  let feedTitle = document.getElementById("title");
  let feedArtist = document.getElementById("artist");
  let feedRelease = document.getElementById("release");
  feedTitle.innerHTML = title;
  feedArtist.innerHTML = artist;
  feedRelease.innerHTML = release;
}

function initFeed() {
  // Display all the events the player triggers
  player.on("all", function (event) {
    console.log(
      "player triggered event '" + event + "' with arguments:",
      Array.prototype.splice.call(arguments, 1)
    );
  });

  player.on("play-started", play_started, play_started);
}
