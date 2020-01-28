var he = require('he');   // needed to decode html
import { IP } from './../config'


export default class YouTubeAPI {

  constructor() {
    this.platformType = "public";
    this.name = "YouTube";
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
    // parse content returned from Revibe API
    formattedContributors = []
    for(var x=0; x<contributors.length; x++) {
      let contributor = {
        type: contributors[x].contribution_type,
        artist: {
          name: contributors[x].artist_name,
          id: contributors[x].artist_id,
          uri: contributors[x].artist_uri,
          platform: "YouTube",
          images: []  // need to get these
        }
      }
      formattedContributors.push(contributor)
    }
    return formattedContributors
  }

  _parseSong(song) {
    // parse content returned from Revibe API
    var formattedSong = {
      name: song['title'],
      id: song['id'],
      uri: song['uri'],
      contributors: this._parseContributors(song['contributions']),
      duration: parseFloat(song['duration']),
      album: this._parseAlbum(song['album']),
      platform: "YouTube",
    }
    return formattedSong
  }

  _parseVideo(video) {
    // parse content returned from YouTube API
    var formattedVideo = {
      name: he.decode(video.snippet.title),
      id: video.id.videoId,
      uri: video.id.videoId,
      contributors: [{
        type: "Artist",
        artist: {
          name: video.snippet.channelTitle,
          id: video.snippet.channelId,
          uri: video.snippet.channelId,
          platform: "YouTube",
          images: []  // need to get these
        }
      }],
      album: {
        name: "YouTube",
        id: video.id.videoId,
        uri: video.id.videoId,
        platform: "YouTube",
        images: []  // need to get these
      },
      platform: "YouTube",
    }
    return formattedVideo
  }

  _parseAlbum(album) {
    // parse content returned from Revibe API
    var formattedAlbum = {
      name: album['name'],
      id: album['album_id'],
      uri: album['album_uri'],
      platform: "YouTube",
      type: album['type'],
      uploaded_date: album['uploaded_date'],
      images: []  // need to get these
    }
    return formattedAlbum
  }

  _parseArtist(artist) {
    // parse content returned from Revibe API
    var formattedArtist = {
      name: artist['name'],
      id: artist['artist_id'],
      uri: artist['artist_uri'],
      platform: "YouTube",
      images: []  // need to get these
    }
    return formattedArtist
  }

  async _getApiKey() {
    // need Jordan to implement this endpoint
    // return await this._request("administration/youtube-key/", "GET", null)
    // save to realm as accessToken

    return "AIzaSyDGF2iMfqVKbdkNwyJwQqD8VkaNwOSghBs"    // temp solution
  }

  async _request(endpoint, method, body, authenticated=false) {
    var headers = {'Accept': 'application/json', 'Content-Type': 'application/json' }
    if (authenticated) {
      // if token id expired, refresh before sending with new request
      if(!this.isLoggedIn("Revibe")) {
        await this.refreshToken()
      }
      headers['Authorization'] = `Bearer ${this.getToken("Revibe").accessToken}`
      var url = IP + endpoint
    }
    else {
      var url = `https://www.googleapis.com/youtube/v3/${endpoint}&key=${this.getToken().accessToken}`
    }

    var numRequestsSent = 0
    var maxRequestAttempts = 2
    var response = null
    var request = {method:requestType, headers:headers, responseType:"json", data:body} // must assign url before passing to axios

    while(numRequestsSent < maxRequestAttempts) {
      try {
        if(handlePagination) {
          // may also have to consider pagination for YouTube
          request.url = `${IP}${endpoint}?limit=${pageSize}`
          var initialRequest = await axios(request)
          var total = limit !== null ? limit : initialRequest['count'];
          var promiseArray = []
          var offset = pageSize;
          while (offset < total) {
            request.url = `${url}?offset=${offset}&limit=${pageSize}`
            promiseArray.push(axios(request);
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
          response.unshift(initialRequest);           // add tracks from initial request
        }
        else {
          request.url = url
          response = await axios(request)
        }
        break
      }
      catch(error) {
        // need to check if youtube api token needs to be exchanged
        response = error.response
        response.data = this._handleErrors(error.response)
        numRequestsSent += 1
      }
    }
    return response
  }


  async login() {
    // Maybe get Youtube api key here?
    /**
    * Summary: This function does not apply because YouTube is a public platform (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */
  }

  async refreshToken() {
    /**
    * Summary: Copy of Revibe's refreshToken function (required implementation).
    *
    * @see  BasePlatformAPI
    */

    var refreshToken = this.getToken("Revibe").refreshToken
    var data = {
      refresh_token: refreshToken,
      device_type: "phone"
    }
    var response = await this._request("account/refresh-token/", "POST", data, true)
    var token = {
      accessToken: response.data.access_token,
      refreshToken: refreshToken,
      expiration: this._generateExpiration(1)
    }
    this.updateToken(token, "Revibe");
  }

  async logout() {
    /**
    * Summary: Remove YouTube API key from database (required implementation).
    *
    * @see  BasePlatformAPI
    */
    this.removeToken()
  }


  async fetchLibrarySongs() {
    /**
    * Summary: Fetch all songs saved to library (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} List containing song objects
    */

    var songs =  await this._request("music/library/songs/?platform=YouTube", "GET", null, true)
    for(var x=0; x<songs.length; x++) {
      songs[x] = this._parseSong(songs[x])
      // probably need to look at date added here
    }
    return songs
  }

  async fetchAllPlaylists() {
    /**
    * Summary: Does not apply to YouTube (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} Empty list
    */

    return []
  }

  async fetchPlaylistSongs(id) {
    /**
    * Summary: Does not apply to YouTube (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} Empty list
    */

    return []
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

    return await this._request(`content/artist/${id}/albums/`, "GET", null, true)
  }

  async fetchArtistTopSongs(id) {
    /**
    * Summary: Does not apply to YouTube (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} Empty list
    */

    return []
  }

  async fetchAlbumSongs(id) {
    /**
    * Summary: Fetch all videos from specific channel (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {string}   id    id of album to get songs from
    *
    * @return {Object} List containing song objects
    */

    var songs = await this._request('search?part=snippet&videoCategoryId=10&type=video&maxResults=10&channelId='+id, "GET", null)
    for(var x=0; x<search.items.length; x++) {
      songs[x] = this._parseVideo(search.songs[x]);
    }
    return results;
  }

  async fetchNewReleases() {
    /**
    * Summary: Does not apply to YouTube (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {Object} Empty list
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

    var search = await this._request('search?part=snippet&videoCategoryId=10&type=video&maxResults=10&q='+query, "GET", null)
    var results = {songs: [], albums: [], artists: []};
    for(var x=0; x<search.items.length; x++) {
      results.songs.push(this._parseVideo(search.songs[x]));
    }
    return results;
  }

  async addSongToLibrary(song) {
    /**
    * Summary: Add song to Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {Object}   song    song to add to library
    */
    var data = {
      platform: song.platform,
      song: {
        song_id: song.id,
        song_uri: song.uri,
        title: song.name,
        duration: song.duration,
      },
      album: song.album,
      artist: song.artist,
    }
    await this._request("music/library/songs/", "POST", data, true)
    this.saveToLibrary(song)   // save to realm database
  }

  async removeSongFromLibrary(song) {
    /**
    * Summary: Remove song from Revibe library.
    *
    * @see  BasePlatformAPI
    *
    * @param {Object}   song    song to add to library
    */
    var data = {song_id: song.id}
    await this._request("music/library/songs/", "DELETE", data, true)
    this.removeFromLibrary(song)   // save to realm database
  }

  async addAlbumToLibrary(album) {
    /**
    * Summary: Does not apply to YouTube (required implementation).
    *
    * @see  BasePlatformAPI
    */
  }

  async removeAlbumFromLibrary(album) {
    /**
    * Summary: Does not apply to YouTube (required implementation).
    *
    * @see  BasePlatformAPI
    */
  }


  /// Player Methods ///

  play(uri) {
    /**
    * Summary: Dummy function because this is controled by redux audio (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */
  }

  pause() {
    /**
    * Summary: Dummy function because this is controled by redux audio (required implementation).
    *
    * @see  BasePlatformAPI
    */
  }

  resume() {
    /**
    * Summary: Dummy function because this is controled by redux audio (required implementation).
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

    try {
      var position = await player.current.getCurrentTime()
    }
    catch(error) {
      var position = 0
    }
    return position;
  }

  getDuration() {
    /**
    * Summary: Dummy function because this is controled by react-native-youtube (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */

    // may need to implement this for android
    // var duration = await player.duration()
  }

  seek(time) {
    /**
    * Summary: Set position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */

    try {
      player.current.seekTo(time);
    }
    catch(error) {
      console.log("Cant seek until player initialized");
    }
  }
}
