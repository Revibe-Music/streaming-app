import Spotify from 'rn-spotify-sdk';
import axios from "axios"

import { IP } from './../config'
import BasePlatformAPI from './basePlatform'


export default class SpotifyAPI extends BasePlatformAPI {

  constructor() {
    super()
    this.platformType = "private";
    this.name = "Spotify";
    this.initialize();
  }

  _displayError(functionName, message) {
    console.log(`ERROR: ${functionName} failed with error message "${message}"`)
  }

  _parseContributors(contributors) {
    // need to account for simplified and full objects
    formattedContributors = []
    for(var x=0; x<contributors.length; x++) {
      let contributor = {
        type: "Artist",
        artist: {
          name: contributors[x].name,
          id: contributors[x].id,
          uri: contributors[x].uri,
          platform: "Spotify",
          images: []  // need to get these
        }
      }
      formattedContributors.push(contributor)
    }
    return formattedContributors
  }

  _parseSong(song) {
    // need to account for simplified and full objects
    var formattedSong = {
      name: song['name'],
      id: song['id'],
      uri: song['uri'],
      contributors: this._parseContributors(song['artists']),
      duration: parseFloat(song['duration_ms']/1000),
      album: this._parseAlbum(song['album']),
      platform: "Spotify",
    }
    return formattedSong
  }

  _parseAlbum(data) {
    // need to account for simplified and full objects
    var formattedAlbum = {
      name: album['name'],
      id: album['id'],
      uri: album['uri'],
      platform: "Spotify",
      type: album['album_type'],
      uploaded_date: new Date(album['release_date']),
      images: []  // need to get these
    }
    return formattedAlbum
  }

  _parseArtist(artist) {
    // need to account for simplified and full objects
    var formattedArtist = {
      name: artist['name'].replace(/"/g, "'"),
      id: artist['id'],
      uri: artist['uri'],
      platform: "Spotify",
      images: []  // need to get these
    }
    return formattedArtist
  }

  _parsePlaylist(playlist) {
    // need to account for simplified and full objects
    var formattedPlaylist = {
      name: playlist['name'].replace(/"/g, "'"),
      id: playlist['id'],
      images: []  // need to get these
    }
    return formattedPlaylist
  }


  async initialize() {
      var options = {
        "clientID":"6d5b44efae95482fb4b82519e3114014",
        "redirectURL":"revibeapp://callback",
        "scopes":[ "user-read-private", "playlist-read", "playlist-read-private",'user-library-read','user-library-modify','user-top-read',"streaming"],
        "tokenSwapURL": IP+'account/spotify-authentication/',
        "tokenRefreshURL": IP+'account/spotify-refresh/',
        "tokenRefreshEarliness": 600,
        "sessionUserDefaultsKey": "RevibeSpotifySession",
        "revibeToken": this.getToken("Revibe").accessToken, //pull Revibe accessToken from realm
        "audioSessionCategory": "AVAudioSessionCategoryPlayback"
      };
      try {
        var isLoggedIn = await Spotify.initialize(options)
      }
      catch(error) {
        this._displayError('Spotify.initialize',error)
      }
      if(this.hasLoggedIn() && !isLoggedIn) {
        await this.refreshToken()
      }
  }

  _handleErrors(error) {
    // https://developer.spotify.com/documentation/web-api/#response-status-codes
  }


  async _execute(callback, callbackArgs=[], authenticated=false, handlePagination=false, pageSize=50, limit=null) {
    if(!Spotify.isInitialized()) {
      await this.initialize()
    }
    if (authenticated) {
      // if token id expired, refresh before sending request
      if(!this.isLoggedIn() || !Spotify.isLoggedIn()) {
        await this.refreshToken()
      }
    }

    var numRequestsSent = 0
    var maxRequestAttempts = 2
    var response = null
    while(numRequestsSent < maxRequestAttempts) {
      try {
        if(handlePagination) {
          var offset = 0
          var initialRequest = await callback(...callbackArgs,{offset: offset, limit: pageSize})
          var total = limit !== null ? limit : initialRequest['total'];
          var promiseArray = []
          offset += pageSize;
          while (offset < total) {
            promiseArray.push(callback(...callbackArgs, {offset: offset, limit: pageSize}));
            offset += pageSize;
            console.log(offset);
          }
          var response = await Promise.all(promiseArray);
          // possible root keys: items, tracks, artists,
          for(var x=0; x<response.length; x++) {
            if(response.hasOwnProperty('items')) {
              response[x] = response[x].items
            }
            else if(response.hasOwnProperty('tracks')) {
              if(response[x].tracks.hasOwnProperty("items")) {
                response[x] = response[x].tracks.items
              }
              else {
                response[x] = response[x].tracks
              }
            }
            else if(response.hasOwnProperty('albums')) {
              if(response[x].albums.hasOwnProperty("items")) {
                response[x] = response[x].albums.items
              }
              else {
                response[x] = response[x].albums
              }
            }
            else if(response.hasOwnProperty('artists')) {
              if(response[x].artists.hasOwnProperty("items")) {
                response[x] = response[x].artists.items
              }
              else {
                response[x] = response[x].artists
              }
            }
            else {
              console.log("Could not find any root keys in:",response[x]);
            }
            if(!response[x].isArray()) {
              console.log("Yo this bitch is not an array!");
            }
          }
          // need to clean up json to get unified list or object
          response = [].concat.apply([], objects);    //merge arrays of songs into one array
          response.unshift(initialRequest);     // add tracks from initial request
        }
        else {
          response = await callback(...callbackArgs)
        }
        break
      }
      catch(error) {
        // need to handle errors here
        this._displayError(callback.name,error)
        numRequestsSent += 1
      }
    }
    return response
  }



  ////////////////////////////////////////////////////////////////
  //////////////// BasePlatformAPI REQUIRED METHODS //////////////
  ////////////////////////////////////////////////////////////////

  async login() {
    /**
    * Summary: Login to Spotify account (required implementation).
    *
    * @see  BasePlatformAPI
    */

    var loginSuccessfull = await this._request(Spotify.login)
    if (loginSuccessfull) {
      var session = Spotify.getSession();
      var token = {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiration: session.expireTime ? session.expireTime : this._generateExpiration(1)
      }
      this.saveToken(token)
    }
  }

  async refreshToken() {
    /**
    * Summary: Swap current Spotify refresh token for new access token (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    if(this.isLoggedIn() && Spotify.isLoggedIn()) {
      await this._execute(Spotify.renewSession);
    }
    else {
      var token = this.getToken()
      // need to add a way to update revibe access token or our
      // servers will kick back requests to refresh spotify token.
      var session = {
        accessToken: token.accessToken,
        expireTime: token.expiration,
        refreshToken: token.refreshToken,
        scopes:[
          "streaming",
          "user-read-private",
          "playlist-read",
          "playlist-read-private",
          'user-library-read',
          'user-library-modify',
          'user-top-read'
        ]
      }
      await this._execute(Spotify.loginWithSession, [session])
    }
    var newSession = Spotify.getSession();
    var token = {
      accessToken: newSession.accessToken,
      refreshToken: newSession.refreshToken,
      expiration: newSession.expireTime ? newSession.expireTime : this._generateExpiration(1)
    }
    this.updateToken(token);
  }

  async logout() {
    /**
    * Summary: Logout of Spotify account (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    await this._execute(Spotify.logout)
    this.removeToken()
  }

  async getProfile() {
    /**
    * Summary: Get user's Spotify profile.
    *
    * @return {Object} User and profile object
    */

    return await this._execute(Spotify.getMe)
  }


  async fetchLibrarySongs() {
    /**
    * Summary: Fetch all songs saved to library (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing song objects
    */

    var songs = await this._execute(Spotify.getMyTracks, [], true, true, 50)
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

    var playlists = await this._execute(Spotify.getMyPlaylists, [], true, true, 50)
    for(var x=0; x<songs.length; x++) {
      playlists[x] = this._parsePlaylist(playlists[x])
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

    var songs = await this._execute(Spotify.getPlaylistTracks, [id], true, true, 100)
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

    var albums = await this._execute(Spotify.getArtistAlbums, [id, {include_groups:["album","single"]}], true, true, 50)
    for(var x=0; x<albums.length; x++) {
      albums[x] = this._parseAlbum(albums[x])
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

    var songs = await this._execute(Spotify.getArtistTopTracks, [id, "from_token"], true)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
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

    var songs = await this._execute(Spotify.getAlbumTracks, [id], true, true, 50)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
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

    var albums = await this._execute(Spotify.getNewReleases, [{limit:35}])
    for(var x=0; x<albums.length; x++) {
      albums[x] = this._parseAlbum(albums[x])
    }
    return albums
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

    var search = await this._execute(Spotify.search, [text,['track', 'artist', 'album'],{limit:50}])
    var results = {artists: [], songs: [], albums: []};
    for(var x=0; x<search.tracks.items.length; x++) {
      results.songs.push(this._parseSong(search.tracks.items[x]));
    }
    for(var x=0; x<search.artists.items.length; x++) {
      results.artists.push(this._parseArtist(search.artists.items[x]));
    }
    for(var x=0; x<search.artists.items.length; x++) {
      results.albums.push(this._parseAlbum(search.artists.items[x]));
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
    var data = {ids: [song.id]}
    await Spotify.sendRequest("v1/me/tracks", "PUT", data, true)
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
    var data = {ids: [song.id]}
    await Spotify.sendRequest("v1/me/tracks", "DELETE", data, true)
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
    this._execute(Spotify.playURI, [uri, 0, 0])
  }

  pause() {
    /**
    * Summary: if player exists, pause song (required implementation).
    *
    * @see  BasePlatformAPI
    */
    this._execute(Spotify.setPlaying, [false])
  }

  resume() {
    /**
    * Summary: if player exists, resume song (required implementation).
    *
    * @see  BasePlatformAPI
    */
    this._execute(Spotify.setPlaying, [true])
  }

  getPosition() {
    /**
    * Summary: return current position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */

    var playbackInfo = Spotify.getPlaybackState()
    if(playbackInfo !== null) {
      return playbackInfo.position
    }
    return 0;
  }

  getDuration() {
    /**
    * Summary: Get duration of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */

    var playbackMetadata = Spotify.getPlaybackMetadata()
    if(playbackMetadata !== null) {
      return playbackMetadata.currentTrack.duration
    }
    return 0;
  }

  seek(time) {
    /**
    * Summary: Set position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */

    this._execute(Spotify.seek, [time])
  }
}
