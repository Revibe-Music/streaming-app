import DefaultPreference from 'react-native-default-preference';
import axios from "axios"
var he = require('he');   // needed to decode html

import { IP } from './../config'
import BasePlatformAPI from './basePlatform'
import Song from './../realm/v2/models/Song'
import realm from './../realm/realm'

import { Player, MediaStates } from '@react-native-community/audio-toolkit';

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
      duration: song['duration'] ? parseFloat(song['duration']) : 0,
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
        dateCreated: playlist['date_created'] ? playlist['date_created'] : new Date(),
        curated: playlist['curated']
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

  async makeRequest(endpoint, method, body, authenticated=false, handlePagination=false, pageSize=100, limit=null) {
    /**
    * Summary: expose this endpoint to make variable requests
    *
    *
    */

    return await this._request(endpoint, method, body, authenticated, handlePagination, pageSize, limit)
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
    }
    this.library.batchAddSongs(songs)
    return songs
  }

  async fetchAllPlaylistsSongs() {
    /**
    * Summary: Fetch all of a user's playlists (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing playlist objects
    */
    const playlists = await this._request("music/playlist/", "GET", null, true, true)
    songPromises = []
    for(var x=0; x<playlists.length; x++) {
      playlists[x] = this._parsePlaylist(playlists[x])
      const playlistId = playlists[x].id
      songPromises.push(this.fetchPlaylistSongs(playlists[x].id).then((songs) => ({playlist: playlistId, songs: songs}) ))
    }
    realm.write(() => {
      for(var x=0; x<playlists.length; x++) {
        realm.create("Playlist", {name: playlists[x].name, id: playlists[x].id.toString(), dateCreated: playlists[x].dateCreated}, true)
      }
    })
    const playlistSongs = await Promise.all(songPromises)
    for(var x=0; x<playlists.length; x++) {
      var playlist = this.playlists.filtered(`id = "${playlists[x].id}"`)["0"]
      playlist.batchAddSongs(playlistSongs.filter(y => y.playlist == playlists[x].id)[0].songs)
    }
  }

  async fetchAllPlaylists() {
    /**
    * Summary: Fetch all of a user's playlists (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing playlist objects
    */
    var playlists = await this._request("music/playlist/", "GET", null, true, true)
    playlists = playlists.map(playlist => this._parsePlaylist(playlist))
    realm.write(() => {
      for(var x=0; x<playlists.length; x++) {
        realm.create("Playlist", {name: playlists[x].name, id: playlists[x].id.toString(), dateCreated: playlists[x].dateCreated}, true)
      }
    })
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

    var songs = await this._request("music/playlist/songs/?playlist_id="+id, "GET", null, true, true)
    // console.log(songs);
    for(var x=0; x<songs.length; x++) {
      var dateSaved = songs[x].date_saved
      songs[x] = this._parseSong(songs[x].song)
      songs[x].dateSaved = dateSaved
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

  async fetchAllBrowseContent() {
    /**
    * Summary: Fetch data to display on browse page
    *
    * @return {Object} List containing browse content(songs, albums, artists) objects
    */
    var response = await this._request("content/browse/", "GET", null, true)
    response = response.data
    for(var x=0; x<response.length; x++) {
      const that = this
      response[x].endpoint = `content/${response[x].endpoint}`
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

  async createPlaylist(name) {
    /**
    * Summary: Remove all songs from album to Revibe library. (Still need to implement)
    *
    * @param {Object}   album    album object
    */
    console.log(name);
    var response = await this._request("music/playlist/", "POST", {name: name}, true)
    console.log(response);
    var data = {}
    realm.write(() => {
      data.playlist = realm.create("Playlist", {name: name, id: String(response.data.id), dateCreated: new Date()})
    })
    return data.playlist
  }

  async deletePlaylist(id) {
    /**
    * Summary: Remove all songs from album to Revibe library. (Still need to implement)
    *
    * @param {Object}   album    album object
    */
    var response = await this._request("music/playlist/"+id, "DELETE", null, true)
    var playlist = this.playlists.filtered(`id = "${id}"`)[0]
    playlist.delete()
  }

  async batchAddSongsToPlaylist(songs, playlistId) {
    /**
    * Summary: Add song to Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {object}   song    seconds value to seek to
    * @param {string}   playlist    seconds value to seek to
    */
    var formattedSongs = []
    for(var j=0; j<songs.length; j++) {
      if(songs[j].platform === "Revibe") {
        var formattedSong = {song_id: songs[j].id, platform: songs[j].platform}
      }
      else {
        if(songs[j].contributors.length === undefined) {
          songs[j].contributors = Object.keys(songs[j].contributors).map(y => songs[j].contributors[y])
        }
        for(var x=0; x<songs[j].contributors.length; x++) {
          if(songs[j].contributors[x].artist.images.length === undefined) {
            songs[j].contributors[x].artist.images = Object.keys(songs[j].contributors[x].artist.images).map(y => songs[j].contributors[x].artist.images[y])
          }
        }

        if(songs[j].contributors.length === undefined) {
          songs[j].contributors[0].artist.images = Object.keys(songs[j].contributors[x].artist.images).map(y => songs[j].contributors[x].artist.images[y])
        }
        if(songs[j].contributors.length > 1) {
          var artists = []
          for(var x=0; x<songs[j].contributors.length; x++) {
            var artist = {
              artist_id: songs[j].contributors[x].artist.id,
              artist_uri: songs[j].contributors[x].artist.uri,
              name: songs[j].contributors[x].artist.name,
              image_refs: songs[j].contributors[x].artist.images.map(img => ({ref: img.url, height: img.height, width: img.width}))
            }
            artists.push(artist)
          }
        }
        else {
          var artists = {
            artist_id: songs[j].contributors[0].artist.id,
            artist_uri: songs[j].contributors[0].artist.uri,
            name: songs[j].contributors[0].artist.name,
            image_refs: songs[j].contributors[0].artist.images.map(x => ({ref: x.url, height: x.height, width: x.width}))
          }
        }
        var formattedSong = {
          platform: songs[j].platform,
          song: {
              song_id: songs[j].id,
              song_uri: songs[j].uri,
              title : songs[j].name,
              duration: parseFloat(songs[j].duration) ? songs[j].duration.toFixed(2) : 0
          },
          artist: artists,
          album: {
          	album_id: songs[j].album.id,
          	album_uri: songs[j].album.uri,
          	name: songs[j].album.name,
          	type: songs[j].album.type,
            image_refs: songs[j].album.images.map(x => ({ref: x.url, height: x.height, width: x.width}))
          },
        }
      }
      formattedSongs.push(formattedSong)
    }
    var data = {playlist_id: playlistId, songs: formattedSongs}
    var response = await this._request("music/playlist/songs/bulk/", "POST", data, true)
    var playlist = this.playlists.filtered(`id = "${playlistId}"`)["0"]
    playlist.batchAddSongs(songs)
  }

  async addSongToPlaylist(song, playlistId) {
    /**
    * Summary: Add song to Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {object}   song    seconds value to seek to
    * @param {string}   playlist    seconds value to seek to
    */

    if(song.platform === "Revibe") {
      var data = {song_id: song.id, playlist_id: playlistId}
    }
    else {
      if(song.contributors.length === undefined) {
        song.contributors = Object.keys(song.contributors).map(y => song.contributors[y])
      }
      for(var x=0; x<song.contributors.length; x++) {
        if(song.contributors[x].artist.images.length === undefined) {
          song.contributors[x].artist.images = Object.keys(song.contributors[x].artist.images).map(y => song.contributors[x].artist.images[y])
        }
      }

      if(song.contributors.length === undefined) {
        song.contributors[0].artist.images = Object.keys(song.contributors[x].artist.images).map(y => song.contributors[x].artist.images[y])
      }
      if(song.contributors.length > 1) {
        var artists = []
        for(var x=0; x<song.contributors.length; x++) {
          var artist = {
            artist_id: song.contributors[x].artist.id,
            artist_uri: song.contributors[x].artist.uri,
            name: song.contributors[x].artist.name,
            image_refs: song.contributors[x].artist.images.map(img => ({ref: img.url, height: img.height, width: img.width}))
          }
          artists.push(artist)
        }
      }
      else {
        var artists = {
          artist_id: song.contributors[0].artist.id,
          artist_uri: song.contributors[0].artist.uri,
          name: song.contributors[0].artist.name,
          image_refs: song.contributors[0].artist.images.map(x => ({ref: x.url, height: x.height, width: x.width}))
        }
      }
      var data = {
        playlist_id: playlistId,
        platform: song.platform,
        song: {
            song_id: song.id,
            song_uri: song.uri,
            title : song.name,
            duration: song.duration ? song.duration : 0
        },
        artist: artists,
        album: {
        	album_id: song.album.id,
        	album_uri: song.album.uri,
        	name: song.album.name,
        	type: song.album.type,
          image_refs: song.album.images.map(x => ({ref: x.url, height: x.height, width: x.width}))
        },
      }
    }
    var response = await this._request("music/playlist/songs/", "POST", data, true)
    this.saveToPlaylist(song, playlistId)   // save to realm database
  }

  async removeSongFromPlaylist(songId, playlistId) {
    /**
    * Summary: Remove song from Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */
    var data = {song_id: songId, playlist_id: playlistId}
    var response = await this._request("music/playlist/songs/", "DELETE", data, true)
    this.removeFromPlaylist(songId, playlistId)   // save to realm database
  }


  /// Player Methods ///

  async play(song) {
    /**
    * Summary: play revibe song by uri (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   uri    uri of song to play
    */

    if(this.player) {
      this.player.stop()
    }

    this.player = new Player(`https://d2xlcqvevg3fv2.cloudfront.net/media/audio/songs/${song.uri}/outputs/mp4/medium.mp4`,{autoDestroy: true, continuesToPlayInBackground: true}).play();
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

    // TrackPlayer.getInstance().pause()
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

    // TrackPlayer.getInstance().resume()
  }

  async getPosition() {
    /**
    * Summary: return current position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */
    if (this.player) {
      if(this.player.currentTime !== -1) {
        return parseFloat(this.player.currentTime/1000)
      }
    }
    return 0

    // return await TrackPlayer.getInstance().getPosition()
  }

  async getDuration() {
    /**
    * Summary: Get duration of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */

    if (this.player) {
      if (this.player.duration !== -1) {
        return parseFloat(this.player.duration)
      }
    }
    return 0

    // return await TrackPlayer.getInstance().getDuration()

  }

  seek(time) {
    /**
    * Summary: Set position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */

    if (this.player) {
      this.player.seek(time*1000)
    }

    // TrackPlayer.getInstance().seek(time)
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
      platform: song.platform,
      is_downloaded: false,
      is_saved: this.library.songIsSaved(song)
    }
    this.updateLastListenTime(song)
    var request = await this._request("metrics/stream/", "POST", data, true)
  }

  async fetchEnvVariables() {
    /**
    * Summary: Send data associated with streaming to revibe server.
    *
    *
    * @param {object}   song        song to record data about
    * @param {number}   duration    show long song was listened to
    */

    var response = await this._request("administration/variables/", "GET", null, true)
    responseVars = Object.keys(response.data)
    var variables = {}
    for(var x=0; x<responseVars.length; x++) {
      if(await DefaultPreference.get(responseVars[x]) !== response.data[responseVars[x]]) {
        if(response.data[responseVars[x]]) {
          variables[responseVars[x]] = response.data[responseVars[x]]
        }
      }
    }
    DefaultPreference.setMultiple(variables)
  }

}
