import RevibeAPI from './revibe';
import SpotifyAPI from './spotify';
import YouTubeAPI from './youtube';

export function getPlatform(platformName) {
  if(platformName === "Revibe") {
    return new RevibeAPI()
  }
  else if(platformName === "Spotify") {
    return new SpotifyAPI()
  }
  else if(platformName === "YouTube") {
    return new YouTubeAPI()
  }
}
