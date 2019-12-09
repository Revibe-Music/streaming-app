import { GoogleSignin } from '@react-native-community/google-signin';
import Sound from 'react-native-sound';
import { IP } from './../config'

Sound.setCategory('Playback');


export default class RevibeAPI {

  constructor() {
    this.platformType = "private";
  }

  async _request(endpoint, method, body, headers={}) {
    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'
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
      return {key: null, error: error}
    }

  }

  _initializeGoogle() {
    GoogleSignin.configure({
      scopes: ['profile email'],
      webClientId: '1002979895434-pkqjm05f8u7nqbamln5n1d50s9vvueat.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceConsentPrompt: false, // [Android] if you want to show the authorization prompt at each login.
    });
  }

  async signup(body) {
    // params ex: {firstName: Riley, lastName: Stephens, email: riley,stephens28@gmail.com, password: Test123 }
    var response = await this._request("api/accounts/signup/", "POST", body)
    // console.log(response);
    if(response.key) {
      return {accessToken:response['key']};
    }
    else {
      return response
    }

  }

  async signupWithGoogle() {
    try {
      await GoogleSignin.signOut()

      // go through google sign in flow client side then on revibe server,
      this._initializeGoogle();
      var userInfo = await GoogleSignin.signIn();
      var response = await this._request("api/accounts/google-authentication/", "POST", {access_token: userInfo.idToken, code: userInfo.serverAuthCode})

      // make request to revibe to save first and last name of user in database
      let headers = {Authorization: `Token ${response['key']}`}
      let body = {first_name: userInfo.user.givenName, last_name: userInfo.user.familyName}
      await this._request("api/accounts/edit-name/", "POST", body, headers)
      return {accessToken: response['key']};
    }
    catch (error) {
      console.log("Error in 'Revibe.signupWithGoogle': "+ error);
    }
  }

  async login(body) {
    // params ex: {email: riley,stephens28@gmail.com, password: Test123 }
    try {

      var response = await this._request("api/accounts/login/", "POST", body)
      // console.log(response);
      if(response.key) {
        return {accessToken:response['key']};
      }
      else {
        console.log(response);
        return response
      }
    }
    catch(error) {
      console.log(error);
    }

  }

  silentLogin() {
    console.log("NOO");
  }

  async loginWithGoogle() {
    try {
      await GoogleSignin.signOut()
      this._initializeGoogle();
      var userInfo = await GoogleSignin.signIn();

      let body = {access_token: userInfo.idToken, code: userInfo.serverAuthCode}
      var response = await this._request("api/accounts/google-authentication/", "POST", body)
      return {accessToken: response['key']};
    }
    catch (error) {
      console.log("Error in 'Revibe.loginWithGoogle': "+ error);
    }
  }

  async logout() {
     // Need to logout server side or with google depending on how use signed in

     // this._initializeGoogle();
     // await GoogleSignin.signOut();
  }


  isLoggedIn() {
    // see if user is logged in server side (might not need)

    // return await GoogleSignin.isSignedIn();
  }

  async getUser(token) {
    let headers = {Authorization: `Token ${token}`}
    return await this._request("api/accounts/user/", "GET", null, headers)
  }

  async getConnectedPlatforms(token) {
    console.log("TOKENNNNN: ", token);
    let headers = {Authorization: `Token ${token}`}
    return await this._request("api/accounts/connected-platforms/", "GET", null, headers)
  }

  async getAllSongs() {
    // needed to conform to platform interface
    return []
  }

  getPosition() {
    this.player.getCurrentTime((seconds) => {
      this.position = seconds
    });
    return parseFloat(this.position)
  }

  async search(text) {
    var headers = {}
    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'
    var request;
    var body = {text: text}
    try {
      // request = {method: "GET", headers: headers, body: JSON.stringify(body) }
      request = {method: "GET", headers: headers}
      const response = await fetch( "http://apiv2-dev.ty5eizxmfb.us-east-2.elasticbeanstalk.com/music/search?text="+text , request);
      var search  = await response.json();

    }
    catch(error) {
      console.log("Error dawg", error);
    }
    songSearch = search.songs;
    artistSearch = search.artists
    var results = {artists: [], songs: []};
    var artist,song_name,song_uri,album_cover,duration_ms;
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

  saveSong(song) {
    console.log(song);
  }

  removeSong(song) {
    console.log(song);
  }

}
