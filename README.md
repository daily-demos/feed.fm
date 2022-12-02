# Daily Prebuit Feed.fm demo

This demo highlights [Daily Prebuilt](https://www.daily.co/blog/prebuilt-ui/), and how it can be used to integrate music from [Feed.fm](https://www.feed.fm) into the call participant's experience.

## Prerequisites

- [Sign up for a Daily account](https://dashboard.daily.co/signup).

## How the demo works

This demo embeds the Daily Prebuit iframe into an Electron application. It adds a custom "Play" button to the iframe, which starts playing music through Feed.fm when clicked.

## Running locally

1. Replace the room URL in `renderer/call/daily.js` with the URL of your own room. 
1. Install dependencies `npm i`
1. Run `npm start`

## Contributing and feedback

Let us know how experimenting with this demo goes! Feel free to reach out to us any time at `help@daily.co`.
