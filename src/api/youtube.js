var he = require('he');   // needed to decode html
import axios from "axios"
import { IP } from './../config'
import BasePlatformAPI from './basePlatform'


export default class YouTubeAPI extends BasePlatformAPI {

  constructor() {
    super()
    this.platformType = "public";
    this.name = "YouTube";
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
      await this.login()
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
        id: contributors[x].artist_id + itemId,
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
      id: song['song_id'],
      uri: song['song_uri'],
      contributors: this._parseContributors(song['contributions'],song['song_id']),
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
        id:video.snippet.channelId + video.id.videoId + "song",
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
        type: "single",
        contributors: [{
          id:video.snippet.channelId + video.id.videoId + "album",
          type: "Artist",
          artist: {
            name: video.snippet.channelTitle,
            id: video.snippet.channelId,
            uri: video.snippet.channelId,
            platform: "YouTube",
            images: []  // need to get these
          }
        }],
        uploaded_date: video.snippet.publishedAt,
        platform: "YouTube",
        images: [
          {
            height: video.snippet.thumbnails.default.height,
            width: video.snippet.thumbnails.default.width,
            url: video.snippet.thumbnails.default.url,
          },
          {
            height: video.snippet.thumbnails.medium.height,
            width: video.snippet.thumbnails.medium.width,
            url: video.snippet.thumbnails.medium.url,
          },
          {
            height: video.snippet.thumbnails.high.height,
            width: video.snippet.thumbnails.high.width,
            url: video.snippet.thumbnails.high.url,
          }
        ]  // need to get these
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
      images: this._parseImages(artist['images'])
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
      images: this._parseImages(artist['images'])
    }
    return formattedArtist
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


  _formatResponse(response) {
    if(response.hasOwnProperty('data')) {
      response = response.data
    }
    if(response.hasOwnProperty('results')) {
      response = response.results
    }
    if(response.hasOwnProperty('items')) {
      response = response.items
    }
    // else {
    //   console.log("Could not find 'results' root key in:",response[x]);
    // }
    return response
  }

  async _request(endpoint, method, body, authenticated=false, handlePagination=false, pageSize=50, limit=null) {
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
      if(!this.getToken()) {
        await this.login()
      }
      var url = `https://www.googleapis.com/youtube/v3/${endpoint}&key=${this.getToken().accessToken}`
    }

    var numRequestsSent = 0
    var maxRequestAttempts = 2
    var response = null
    var request = {method:method, headers:headers, responseType:"json", data:body} // must assign url before passing to axios

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
            promiseArray.push(axios(request));
            offset += pageSize;
            console.log(offset);
          }
          var response = await Promise.all(promiseArray);
          response.unshift(initialRequest);           // add tracks from initial request
          // possible root key: results
          for(var x=0; x<response.length; x++) {
            response[x] = this._formatResponse(response[x])
          }
          response = [].concat.apply([], objects);    //merge arrays of songs into one array
        }
        else {
          request.url = url
          response = await axios(request)
          response = this._formatResponse(response)
        }
        break
      }
      catch(error) {
        // need to check if youtube api token needs to be exchanged
        console.log(error);
        response = error.response
        response.data = await this._handleErrors(error.response)
        numRequestsSent += 1
      }
    }
    return response
  }

  isLoggedIn() {
    /**
    * Summary: Override BasePlatformAPI isLoggedIn function.
    *
    * @see  BasePlatformAPI
    *
    */
    return true
  }



  async login() {
    /**
    * Summary: Fetch YouTube API key and store (required implementation).
    *
    * @see  BasePlatformAPI
    *
    */
    var response = await this._request("administration/youtubekey/", "GET", null, true)
    var token = {
      platform: "YouTube",
      accessToken: response.key,
    }
    this.saveToken(token)
  }

  async refreshToken() {
    /**
    * Summary: Copy of Revibe's refreshToken function (required implementation).
    *
    * @see  BasePlatformAPI
    */

    var token = this.getToken("Revibe")
    var data = {
      refresh_token: token.refreshToken,
      device_type: "phone"
    }
    var response = await this._request("account/refresh-token/", "POST", data)
    var newToken = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiration: this._generateExpiration(1),
      platform: "Revibe"
    }
    token.update(newToken)
  }

  async logout() {
    /**
    * Summary: Remove YouTube API key from database (required implementation).
    *
    * @see  BasePlatformAPI
    */
    var token = this.getToken()
    token.remove()
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

    var search = await this._request('search?part=snippet&videoCategoryId=10&type=video&maxResults=10&channelId='+id, "GET", null)
    for(var x=0; x<search.length; x++) {
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
    for(var x=0; x<search.length; x++) {
      results.songs.push(this._parseVideo(search[x]));
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
    // await this._request("music/library/songs/", "POST", data, true)
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
  }

  async getPosition(player) {
    /**
    * Summary: return current position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @return {number} decimal value representing seconds
    */

    try {
      // var position = await player.current.getCurrentTime()
      var position = await this.player.current.getCurrentTime()
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

  seek(player, time) {
    /**
    * Summary: Set position of song (required implementation).
    *
    * @see  BasePlatformAPI
    *
    * @param {number}   time    seconds value to seek to
    */

    try {
      this.player.current.seekTo(time);
    }
    catch(error) {
      console.log("Cant seek until player initialized");
    }
  }
}
