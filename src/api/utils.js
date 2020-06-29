import RevibeAPI from './revibe';
import SpotifyAPI from './spotify';
import YouTubeAPI from './youtube';

export function getPlatform(platformName) {
  if(platformName === "Revibe" || platformName.toLowerCase() === "revibe") {
    return new RevibeAPI()
  }
  else if(platformName === "Spotify" || platformName.toLowerCase() === "spotify") {
    return new SpotifyAPI()
  }
  else if(platformName === "YouTube" || platformName.toLowerCase() === "youtube") {
    return new YouTubeAPI()
  }
}
