import { GoogleSignin } from '@react-native-community/google-signin';
import Sound from 'react-native-sound';
import { IP } from './../config'
import realm from './../realm/realm';


Sound.setCategory('Playback');


export default class RevibeAPI {

  constructor() {
    this.platformType = "private";
    try{
      this.token = realm.objects('Token').filtered(`platform = "Revibe"`)
    }
    catch(error) {
      this.token = null
    }
  }

  async _request(endpoint, method, body, authenticated=false) {
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (authenticated) {
      headers['Authorization'] = `Bearer ${this.token.accessToken}`
    }
    var request;
    try {
      if(method === "GET") {
        request = {method: method, headers: headers }
      }
      else {
        request = {method: method, headers: headers, body: JSON.stringify(body) }
      }
      const response = await fetch( IP+endpoint, request);
      return await response.json();
    }
    catch(error) {
      return {error: error}
    }
  }

  async signup(body) {
    /*
    * Params
  	* username: string
  	* password: string
  	* first_name: string
  	* last_name: string
  	* email: string
  	* profile: {
  	* 	image: file,
  	* 	counrty: string
  	* }
    */

    return await this._request("account/register/", "POST", body)
  }

  async login(body) {
    /*
    * Params
  	* username: string
  	* password: string
    */
    return await this._request("account/login/", "POST", body)
  }

  refreshToken(body) {
    /*
    * Params
  	* refresh_token: string
    */
    return await this._request("account/token/refresh/", "POST", body, authenticated=true)
  }

  async logout(body) {
    /*
    * Params
  	* access_token: string
    */
      return await this._request("account/logout/", "POST", body, authenticated=true)
  }

  async logoutAllDevices() {
      return await this._request("account/logout-all/", "POST", {}, authenticated=true)
  }

  isLoggedIn() {
    // check if token expire time is greater than current time, if so token is logged in
    return this.token.tokenExpiry > Math.round((new Date()).getTime() / 1000);
  }

  async getProfile() {
    return await this._request("account/profile/", "GET", null, authenticated=true)
  }

  async editProfile(body) {
    /*
    * Params
    * username: string
    * first_name: string
    * last_name: string
    * email: string
    * profile: {
    * 	image: file,
    * 	counrty: string
    * }
    */
    return await this._request("account/profile/", "PATCH", body, authenticated=true)

  }

  async getConnectedPlatforms(token) {
    return await this._request("account/linked-accounts/", "GET", null, authenticated=true)
  }

  async getAllSongs() {
    return await this._request("music/library/", "GET", null, authenticated=true)
  }

  getPosition() {
    this.player.getCurrentTime((seconds) => {
      this.position = seconds
    });
    return parseFloat(this.position)
  }

  async search(text) {
    var search = await this._request("music/search?text="+text", "GET", null, authenticated=true)
    search  = await response.json();

    songSearch = search.songs;
    artistSearch = search.artists
    var results = {artists: [], songs: []};
    var artist,song_name,song_uri,album_cover,duration;
    for(var x=0; x<songSearch.length; x++) {
      id = songSearch[x]['id'];
      uri = songSearch[x]['uri'];
      name = songSearch[x]['title'];
      artist = songSearch[x]['contributions'][0]['name'];
      artistUri = songSearch[x]['contributions'][0]['id']
      album = songSearch[x]['album']["name"];
      albumUri = songSearch[x]['album']["id"];
      albumArt = songSearch[x]['album']['image']
      duration = parseFloat(songSearch[x]['duration']);
      results.songs.push({id: id, name: name, Artist: {name: artist, id: artistUri, image: ""}, Album: {name: album, id: albumUri, image: albumArt}, uri: uri, duration: duration});
    }

    var name,id,image;
    for(var x=0; x<artistSearch.length; x++) {
      name = artistSearch[x]['name'];
      id = artistSearch[x]['id']
      image = artistSearch[x]['image']
      results.artists.push({name: name, id: id, image: image});

    }
    return results;
  }

  play(uri) {
    if (this.player) {
      this.player.pause()
    }
    this.player = new Sound("https://revibe-media.s3.us-east-2.amazonaws.com/media/audio/songs/"+uri+".mp3", null, (error) => {
      if (error) {
        console.log('failed to load the song', error);
        return;
      }
      else {
        this.player.play()
      }
    });
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.play();
  }

  seek(time) {
    this.player.setCurrentTime(time);
  }

  async saveSong(song) {
    await this._request("music/library/songs/", "POST", song, authenticated=true)
  }

  async removeSong(song) {
    await this._request("music/library/songs/", "DELETE",song, authenticated=true)
  }

  async saveAlbum(album) {
    await this._request("music/library/albums/", "POST", album, authenticated=true)
  }

  async removeSong(album) {
    await this._request("music/library/albums/", "DELETE", album, authenticated=true)
  }

}
