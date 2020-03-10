import Sound from 'react-native-sound';
import DefaultPreference from 'react-native-default-preference';
import axios from "axios"

import { IP } from './../config'
import BasePlatformAPI from './basePlatform'

Sound.setCategory('Playback', false);

export default class RevibeAPI extends BasePlatformAPI {

  constructor() {
    super()
    this.platformType = "private";
    this.name = "Revibe";
  }

  async initialize() {
    if(this.hasLoggedIn()) {
      if(!this.isLoggedIn()) {
        await this.refreshToken()
      }
    }
  }

  async _handleErrors(response) {
    var errors = {}
    if(response.status === 400) {
      // bad request ish

    }
    if(response.status === 401) {
      // unauthorized ish
      await this.refreshToken()
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
        if(errorKeys[x] === "profile") {
          var errorKey2 = Object.keys(response.data[errorKeys[x]])[0]
          errors[errorKey2] = response.data[errorKeys[x]][errorKey2]
        }
        else {
          errors[errorKeys[x]] = response.data[errorKeys[x]]
        }
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

  _parseContributors(contributors, itemId) {
    formattedContributors = []
    for(var x=0; x<contributors.length; x++) {
      var imageKey = contributors[x]['artist_images'] ? 'artist_images' : 'images'
      var nameKey = contributors[x]['artist_name'] ? 'artist_name' : 'name'
      let contributor = {
        id: contributors[x].artist_id + itemId,
        type: contributors[x].contribution_type ? contributors[x].contribution_type : "Artist",
        artist: {
          name: contributors[x][nameKey],
          id: contributors[x].artist_id,
          uri: contributors[x].artist_uri,
          platform: contributors[x].platform,
          images: this._parseImages(contributors[x][imageKey])
        }
      }
      formattedContributors.push(contributor)
    }
    return formattedContributors
  }

  _parseSong(song) {
    if(song['platform'] === "YouTube") {
      var contributorKey = 'uploaded_by'
      song.uploaded_by.type = "Artist"
      song.uploaded_by = [song.uploaded_by]
    }
    else {
      var contributorKey = 'contributors'
    }
    var formattedSong = {
      name: song['title'],
      id: song['song_id'],
      uri: song['song_uri'],
      contributors: this._parseContributors(song[contributorKey], song['song_id']),
      duration: parseFloat(song['duration']),
      album: this._parseAlbum(song['album']),
      platform: song['platform'],
    }
    return formattedSong
  }

  _parseAlbum(album) {
    if(album['platform'] === "YouTube") {
      var contributorKey = 'uploaded_by'
      album.uploaded_by.type = "Artist"
      album.uploaded_by = [album.uploaded_by]
    }
    else {
      var contributorKey = 'contributors'
    }
    if(!album['type']) {
      album.type = album['platform'] === "YouTube" ? "Single" : "Album"
    }
    var formattedAlbum = {
      name: album['name'],
      id: album['album_id'],
      uri: album['album_uri'],
      platform: album['platform'],
      contributors: this._parseContributors(album[contributorKey], album['album_id']),
      type: album['type'],
      uploaded_date: album['uploaded_date'],
      images: this._parseImages(album.images)
    }
    return formattedAlbum
  }

  _parseArtist(artist) {
    var formattedArtist = {
      name: artist['name'],
      id: artist['artist_id'],
      uri: artist['artist_uri'],
      platform: artist['platform'],
      bio: artist['bio'],
      images: this._parseImages(artist['images'])
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

  _parseImages(images) {
    formattedImages = []
    for(var x=0; x<images.length; x++) {
      let image = {
        height: images[x].height,
        width: images[x].width,
        url: images[x].url,
      }
      formattedImages.push(image)
    }
    return formattedImages
  }

  async _request(endpoint, method, body, authenticated=false, handlePagination=false, pageSize=100, limit=null) {
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (authenticated) {
      // if token id expired, refresh before sending with new request
      if(this.hasLoggedIn()) {
        if(!this.isLoggedIn()) {
          await this.refreshToken()
        }
        headers['Authorization'] = `Bearer ${this.getToken().accessToken}`
      }
    }
    var numRequestsSent = 0
    var maxRequestAttempts = 2
    var response = null
    var request = {method:method, headers:headers, responseType:"json", data:body} // must assign url before passing to axios
    while(numRequestsSent < maxRequestAttempts) {
      try {
        if(handlePagination) {
          if(endpoint.includes("?")) {
            request.url = `${IP}${endpoint}&limit=${pageSize}`
          }
          else {
            request.url = `${IP}${endpoint}?limit=${pageSize}`
          }
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
          response.unshift(initialRequest);     // add tracks from initial request
          // possible root key: results
          for(var x=0; x<response.length; x++) {
            if(response[x].data.hasOwnProperty('results')) {
              response[x] = response[x].data.results
            }
            else {
              console.log("Could not find 'results' root key in:",response[x]);
            }
          }
          response = [].concat.apply([], response);    //merge arrays of songs into one array
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
        response.data = await this._handleErrors(error.response)
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
      device_type: "mobile" // change to give actual device data
    }
    var response = await this._request("account/register/", "POST", data)
    if(response.data.hasOwnProperty("access_token")) {
      var token = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiration: this._generateExpiration(1.9),
        platform: "Revibe"
      }
      this.saveToken(token)

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
      device_type: "mobile"
    }
    var response = await this._request("account/login/", "POST", data)
    if(response.data.hasOwnProperty("access_token")) {
      var token = {
        platform: "Revibe",
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiration: this._generateExpiration(1.9),
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

      // save token to realm
      this.saveToken(token)

      // save user to default preferences
      DefaultPreference.setMultiple(user)

      return response.data.user
    }

    return response.data
  }

  async refreshToken() {
    /**
    * Summary: Swap current refresh token for new access token (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    var token = this.getToken()
    var data = {
      refresh_token: token.refreshToken,
      device_type: "mobile"
    }
    var response = await this._request("account/refresh-token/", "POST", data)
    var newToken = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiration: this._generateExpiration(1.9),
      platform: "Revibe"
    }
    token.update(newToken)
  }

  async logout() {
    /**
    * Summary: Logout of Revibe account (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    var token = this.getToken()
    var data = {access_token: token.accessToken}
    await this._request("account/logout/", "POST", data)
    token.delete()
    this.library.delete()
  }

  async resetPassword(username) {
    /**
    * Summary: Send email to user with temp password.
    *
    *
    */

    return await this._request("account/profile/reset-password/", "POST", {username: username})
  }

  async changePassword(oldPassword, newPassword1, newPassword2) {
    /**
    * Summary: Change password for all future logins
    *
    *
    */
    var data = {
      old_password: oldPassword,
      new_password: newPassword1,
      confirm_new_password: newPassword2
    }
    return await this._request("account/profile/change-password/", "POST", data, true)
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

    var response = await this._request("account/linked-accounts/", "GET", null, true)
    var tokens = []
    for(var x=0; x<response.data.length; x++) {
      var formattedToken = {
        accessToken: response.data[x].token,
        refreshToken: response.data[x].token_secret,
        expiration: this._generateExpiration(-5),
        platform: response.data[x].platform
      }
      tokens.push(formattedToken)
    }
    return tokens
  }


  async fetchLibrarySongs() {
    /**
    * Summary: Fetch all songs saved to library (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing song objects
    */

    var songs =  await this._request("music/library/songs/?platform=Revibe", "GET", null, true, true)
    for(var x=0; x<songs.length; x++) {
      var dateSaved = songs[x].date_saved
      songs[x] = this._parseSong(songs[x].song)
      songs[x].dateSaved = dateSaved
      this.saveToLibrary(songs[x])   // save to realm database
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

    var albums = await this._request(`content/artist/${id}/albums/`, "GET", null, true, true)
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

    var response = await this._request(`content/artist/${id}/top-songs/`, "GET", null, true)
    songs = response.data.results
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
    var songs = await this._request(`content/album/${id}/songs/`, "GET", null, true)
    songs = songs.data
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
      // probably need to look at date added here
    }
    return songs
  }

  async fetchBrowseContent() {
    /**
    * Summary: Fetch data to display on browse page
    *
    * @return {Object} List containing browse content(songs, albums, artists) objects
    */
    var response = await this._request("content/browse/", "GET", null, true)
    response = response.data
    for(var x=0; x<response.length; x++) {
      const that = this
      if(response[x].type==="songs") {
        response[x].results = response[x].results.map(x => that._parseSong(x))
      }
      else if(response[x].type==="albums") {
        response[x].results = response[x].results.map(x => that._parseAlbum(x))
      }
      else if(response[x].type==="artists") {
        response[x].results = response[x].results.map(x => that._parseArtist(x))
      }
      else if(response[x].type==="artist") {
        if(response[x].results) {
          response[x].results = this._parseArtist(response[x].results)
        }
      }
      if(response[x].name == "Top Hits - All-Time") {
        delete response[x]
      }
    }
    return response
  }

  async fetchArtist(id) {
    /**
    * Summary: Fetch artist from id (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of album to get songs from
    *
    * @return {Object} List containing song objects
    */
    var response = await this._request(`content/artist/${id}/`, "GET", null, true)
    return this._parseArtist(response.data)
  }

  async fetchAlbum(id) {
    /**
    * Summary: Fetch artist from id (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of album to get songs from
    *
    * @return {Object} List containing song objects
    */
    var response = await this._request(`content/album/${id}/`, "GET", null, true)
    return this._parseAlbum(response.data)
  }

  async fetchSong(id) {
    /**
    * Summary: Fetch artist from id (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of album to get songs from
    *
    * @return {Object} List containing song objects
    */
    var response = await this._request(`content/song/${id}/`, "GET", null, true)
    return this._parseSong(response.data)
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
    if(search.data.songs) {
      for(var x=0; x<search.data.songs.length; x++) {
        results.songs.push(this._parseSong(search.data.songs[x]));
      }
    }
    if(search.data.artists) {
      for(var x=0; x<search.data.artists.length; x++) {
        results.artists.push(this._parseArtist(search.data.artists[x]));
      }
    }
    if(search.data.albums) {
      for(var x=0; x<search.data.albums.length; x++) {
        results.albums.push(this._parseAlbum(search.data.albums[x]));
      }
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
    var data = {song_id: song.id, platform: "Revibe"}
    await this._request("music/library/songs/", "POST", data, true)
    this.saveToLibrary(song)   // save to realm database
  }

  async removeSongFromLibrary(id) {
    /**
    * Summary: Remove song from Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */
    var data = {song_id: id}
    await this._request("music/library/songs/", "DELETE", data, true)
    this.removeFromLibrary(id)   // save to realm database
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
    this.player = new Sound(`https://revibe-media.s3.amazonaws.com/media/audio/songs/${uri}/outputs/mp4/medium.mp4`, null, (error) => {
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

  async recordStream(song, duration) {
    /**
    * Summary: Send data associated with streaming to revibe server.
    *
    *
    * @param {object}   song        song to record data about
    * @param {number}   duration    show long song was listened to
    */
    var data = {
      song_id: song.id,
      stream_duration: duration.toFixed(2),
      is_downloaded: false,
      is_saved: this.library.songIsSaved(song)
    }
    var request = await this._request("metrics/stream/", "POST", data, true)

  }

}
