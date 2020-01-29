import RevibeAPI from './Revibe';
import SpotifyAPI from './Spotify';
import YouTubeAPI from './Youtube';

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
