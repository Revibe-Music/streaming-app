import Sound from 'react-native-sound';
import DefaultPreference from 'react-native-default-preference';
import axios from "axios"

import { IP } from './../config'
import BasePlatformAPI from './basePlatform'

Sound.setCategory('Playback');

export default class RevibeAPI extends BasePlatformAPI {

  constructor() {
    super()
    this.platformType = "private";
    this.name = "Revibe";
  }

  _handleErrors(response) {
    var errors = {}
    if(response.status === 400) {
      // bad request ish

    }
    if(response.status === 401) {
      // unauthorized ish
      this.refreshToken()
    }
    if(response.status === 403) {
      // forbidden ish

    }
    if(response.status === 404) {
      // not found ish

    }
    else if(response.status === 409) {
      // conflict ish
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]]
      }
    }
    else if(response.status === 415) {
      // unsupported media type ish
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]]
      }
    }
    else if(response.status === 417) {
      var errorKeys = Object.keys(response.data)
      for(var x=0; x<errorKeys.length; x++) {
        errors[errorKeys[x]] = response.data[errorKeys[x]][0]
      }
    }
    else if(response.status === 500) {
      // internal server error ish

    }
    else if(response.status === 501){
      // not implemented error ish

    }
    else if(response.status === 503){
      // Service unavailable error ish

    }
    return errors
  }

  _parseContributors(contributors) {
    formattedContributors = []
    for(var x=0; x<contributors.length; x++) {
      let contributor = {
        type: contributors[x].contribution_type,
        artist: {
          name: contributors[x].artist_name,
          id: contributors[x].artist_id,
          uri: contributors[x].artist_uri,
          platform: "Revibe",
          images: []  // need to get these
        }
      }
      formattedContributors.push(contributor)
    }
    return formattedContributors
  }

  _parseSong(song) {
    var formattedSong = {
      name: song['title'],
      id: song['id'],
      uri: song['uri'],
      contributors: this._parseContributors(song['contributions']),
      duration: parseFloat(song['duration']),
      album: this._parseAlbum(song['album']),
      platform: "Revibe",
    }
    return formattedSong
  }

  _parseAlbum(album) {
    var formattedAlbum = {
      name: album['name'],
      id: album['album_id'],
      uri: album['album_uri'],
      platform: "Revibe",
      type: album['type'],
      uploaded_date: album['uploaded_date'],
      images: []  // need to get these
    }
    return formattedAlbum
  }

  _parseArtist(artist) {
    var formattedArtist = {
      name: artist['name'],
      id: artist['artist_id'],
      uri: artist['artist_uri'],
      platform: "Revibe",
      images: []  // need to get these
    }
    return formattedArtist
  }

  _parsePlaylist(playlist) {
      var formattedPlaylist = {
        name: playlist['name'],
        id: playlist['id'],
        images: []  // need to get these
      }
      return formattedPlaylist
  }

  async _request(endpoint, method, body, authenticated=false, handlePagination=false, pageSize=100, limit=null) {
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (authenticated) {
      // if token id expired, refresh before sending with new request
      if(!this.isLoggedIn()) {
        await this.refreshToken()
      }
      headers['Authorization'] = `Bearer ${this.getToken().accessToken}`
    }
    var numRequestsSent = 0
    var maxRequestAttempts = 2
    var response = null
    var request = {method:method, headers:headers, responseType:"json", data:body} // must assign url before passing to axios
    while(numRequestsSent < maxRequestAttempts) {
      try {
        if(handlePagination) {
          request.url = `${IP}${endpoint}?limit=${pageSize}`
          var initialRequest = await axios(request)
          var total = limit !== null ? limit : initialRequest['count'];
          var promiseArray = []
          var offset = pageSize;
          while (offset < total) {
            request.url = `${IP}${endpoint}?offset=${offset}&limit=${pageSize}`
            promiseArray.push(axios(request))
            offset += pageSize;
            console.log(offset);
          }
          var response = await Promise.all(promiseArray);
          // possible root key: results
          for(var x=0; x<response.length; x++) {
            if(response.hasOwnProperty('results')) {
              response[x] = response[x].results
            }
            else {
              console.log("Could not find 'results' root key in:",response[x]);
            }
            if(!response[x].isArray()) {
              console.log("Yo this bitch is not an array!");
            }
          }
          response = [].concat.apply([], objects);    //merge arrays of songs into one array
          response.unshift(initialRequest);     // add tracks from initial request
        }
        else {
          request.url = `${IP}${endpoint}`
          response = await axios(request)
        }
        break
      }
      catch(error) {
        console.log(error);
        response = error.response
        response.data = this._handleErrors(error.response)
        numRequestsSent += 1
      }
    }
    return response
  }

  async register(firstName, lastName, username, email, password) {
    /**
    * Summary: Register new Revibe account.
    *
    * @param {string}   username          username for new account
    * @param {string}   password          password for new account
    * @param {string}   firstName         first name for new account
    * @param {string}   lastName          last name for new account
    * @param {Object}   profile           profile object
    * @param {string}   profile.email     email in profile object
    * @param {string}   [profile.image]   image in profile (optional)
    *
    * @return {Object} Revibe user object, access token, and refresh token
    */

    var data = {
      username: username,
      password: password,
      first_name: firstName,
	    last_name: lastName,
      profile: {email: email},
      device_type: "phone" // change to give actual device data
    }
    var response = await this._request("account/register/", "POST", data)
    if(response.data.hasOwnProperty("access_token")) {
      var token = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiration: this._generateExpiration(1)
      }
      var user = {
        "first_name": response.data.user.first_name,
        "last_name": response.data.user.last_name,
        "allow_email_marketing": response.data.user.profile.allow_email_marketing,
        "allow_explicit": response.data.user.profile.allow_explicit,
        "allow_listening_data": response.data.user.profile.allow_listening_data,
        "email": response.data.user.profile.email,
        "skip_youtube_when_phone_is_locked": response.data.user.profile.skip_youtube_when_phone_is_locked,
        "user_id": response.data.user.user_id,
        "username": response.data.user.username
      }
      if(response.data.user.profile.country) user.country = response.data.user.profile.country
      if(response.data.user.profile.image) user.image = response.data.user.profile.image
      this.saveToken(token)
      DefaultPreference.setMultiple(user)
    }
    return response.data

  }

  async login(username, password) {
    /**
    * Summary: Login to Revibe account (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   username    username associated with an account
    * @param {string}   password    password associated with an account
    *
    * @return {Object} Revibe user object, access token, and refresh token
    */

    var data = {
      username: username,
      password: password,
    }
    var response = await this._request("account/login/", "POST", data)
    var token = {
      accessToken: response.date.token,
      refreshToken: response.date.refresh_token,
      expiration: this._generateExpiration(1)
    }
    this.saveToken(token)
    return response.data.user
  }

  async refreshToken() {
    /**
    * Summary: Swap current refresh token for new access token (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    var refreshToken = this.getToken().refreshToken
    var data = {
      refresh_token: refreshToken,
      device_type: "phone"
    }
    var response = await this._request("account/refresh-token/", "POST", data)
    var token = {
      accessToken: response.data.access_token,
      refreshToken: refreshToken,
      expiration: this._generateExpiration(1)
    }
    this.updateToken(token);
  }

  async logout() {
    /**
    * Summary: Logout of Revibe account (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    var data = {access_token: this.getToken().accessToken}
    await this._request("account/logout/", "POST", data)
    this.removeToken()
  }

  async getProfile() {
    /**
    * Summary: Get user's profile.
    *
    * @return {Object} User and profile object
    */

    return await this._request("account/profile/", "GET", null, true)  //should probably parse this
  }

  async editProfile(username=null,firstName=null,lastName=null,email=null) {
    /**
    * Summary: Edit user profile data.
    *
    * @param {string}   [username]    username to change to (optional)
    * @param {string}   [password]    password to change to (optional)
    * @param {string}   [firstName]   first name to change to (optional)
    * @param {string}   [lastName]    last name to change to (optional)
    * @param {string}   [email]       email to change to (optional)
    *
    * @return {Object} Revibe user object
    */

    var data = {}
    if(name !== null) data.username = name
    if(firstName !== null) data.first_name = firstName
    if(lastName !== null) data.last_name = lastName
    if(email !== null) data.email = email
    return await this._request("account/profile/", "PATCH", data, true)  //should probably parse this
  }

  async fetchConnectedPlatforms() {
    /**
    * Summary: Get platforms linked to Revibe account.
    *
    * @return {Object} List of linked accounts
    */

    return await this._request("account/linked-accounts/", "GET", null, true)
  }


  async fetchLibrarySongs() {
    /**
    * Summary: Fetch all songs saved to library (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing song objects
    */

    var songs =  await this._request("music/library/songs/?platform=Revibe", "GET", null, true)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
      // probably need to look at date added here
    }
    return songs
  }

  async fetchAllPlaylists() {
    /**
    * Summary: Fetch all of a user's playlists (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing playlist objects
    */

    var playlists = await this._request("music/playlist/", "GET", null, true)
    for(var x=0; x<playlists.length; x++) {
      playlists[x] = this._parsePlaylist(playlists[x])
      // probably need to look at date added here
    }
    return playlists

  }

  async fetchPlaylistSongs(id) {
    /**
    * Summary: Fetch all songs in specific playlist (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of playlist to get songs from
    *
    * @return {Object} List containing song objects
    */

    var songs = await this._request("music/playlist/songs/?playlist_id="+id, "GET", null, true)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
      // probably need to look at date added here
    }
    return songs
  }

  async fetchArtistAlbums(id) {
    /**
    * Summary: Fetch all albums from specific artist (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of artist to get albums from
    *
    * @return {Object} List containing album objects
    */

    var albums = await this._request(`content/artist/${id}/albums/`, "GET", null, true)
    for(var x=0; x<albums.length; x++) {
      albums[x] = this._parseAlbum(albums[x])
      // probably need to look at date added here
    }
    return albums
  }

  async fetchArtistTopSongs(id) {
    /**
    * Summary: Fetch top songs from specific artist (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of artist to get top songs from
    *
    * @return {Object} List containing song objects
    */

    var songs = await this._request(`content/artist/${id}/top_songs/`, "GET", null, true)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
      // probably need to look at date added here
    }
    return songs

  }

  async fetchAlbumSongs(id) {
    /**
    * Summary: Fetch all songs from specific album (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of album to get songs from
    *
    * @return {Object} List containing song objects
    */

    var songs = await this._request(`content/artist/${id}/albums/`, "GET", null, true)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
      // probably need to look at date added here
    }
    return songs
  }

  async fetchNewReleases() {
    /**
    * NOT IMPLEMENTED *
    * Summary: Fetch list of newly released content (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing song objects
    */

    return []
  }

  async search(query) {
    /**
    * Summary: Search songs, albums, and artist based on query string (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   query    string to search content with
    *
    * @return {Object} List containing song objects, list containing album objects, list containing artist objects
    */

    var search = await this._request("content/search/?text="+query, "GET", null, true)
    var results = {artists: [], songs: [], albums: []};
    for(var x=0; x<search.songs.length; x++) {
      results.songs.push(this._parseSong(search.songs[x]));
    }
    for(var x=0; x<search.artists.length; x++) {
      results.artists.push(this._parseArtist(search.artists[x]));
    }
    for(var x=0; x<search.albums.length; x++) {
      results.albums.push(this._parseAlbum(search.albums[x]));
    }
    return results;
  }

  async addSongToLibrary(song) {
    /**
    * Summary: Add song to Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */
    var data = {song_id: song.id}
    await this._request("music/library/songs/", "POST", data, true)
    this.saveToLibrary(song)   // save to realm database
  }

  async removeSongFromLibrary(song) {
    /**
    * Summary: Remove song from Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */
    var data = {song_id: song.id}
    await this._request("music/library/songs/", "DELETE",data, true)
    this.removeFromLibrary(song)   // save to realm database
  }

  async addAlbumToLibrary(album) {
    /**
    * Summary: Add all songs from album to Revibe library. (Still need to implement)
    *
    * @param {Object}   album    album object
    */
    await this._request("music/library/albums/", "POST", album, true)
  }

  async removeAlbumFromLibrary(album) {
    /**
    * Summary: Remove all songs from album to Revibe library. (Still need to implement)
    *
    * @param {Object}   album    album object
    */
    await this._request("music/library/albums/", "DELETE", album, true)
  }


  /// Player Methods ///

  play(uri) {
    /**
    * Summary: play revibe song by uri (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   uri    uri of song to play
    */

    this.pause() // pause current song if one is playing
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
    /**
    * Summary: if player exists, pause song (required implementation).
    *
    * @see  BasePlatformAPI
    */

    if (this.player) {
      this.player.pause()
    }
  }

  resume() {
    /**
    * Summary: if player exists, resume song (required implementation).
    *
    * @see  BasePlatformAPI
    */

    if (this.player) {
      this.player.play()
    }
  }

  getPosition() {
    /**
    * Summary: return current position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */

    this.player.getCurrentTime((seconds) => {
      this.position = seconds
    });
    return parseFloat(this.position)
  }

  getDuration() {
    /**
    * Summary: Get duration of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */

    return parseFloat(this.player.getDuration())
  }

  seek(time) {
    /**
    * Summary: Set position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */

    this.player.setCurrentTime(time);
  }
}
