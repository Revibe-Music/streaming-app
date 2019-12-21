import { seek, currentTime} from 'react-native-youtube'
var he = require('he');   // needed to decode html
import realm from './../realm/realm';
import { IP } from './../config'



export default class YouTubeAPI {
  constructor() {
    this.platformType = "public";
  }

  getToken() {
    try{
      return realm.objects('Platform').filtered(`name = "Revibe"`)["0"].credentials.accessToken
    }
    catch(error) {
      return null
    }
  }

  async _request(endpoint) {
    // Revibe-music2 project, Revibe-music3 project, Revibe project
    var endpoints = ["AIzaSyDGF2iMfqVKbdkNwyJwQqD8VkaNwOSghBs", "AIzaSyDIM9qW_RDWwHwsz0aU6a-mNZEs4blBXPg","AIzaSyDZWG14yynoPmGrSO84ysBUAmRF3XKMe20"]
    var headers, request;
    try {
      for(x=0; x<2; x++) {
        headers = { 'Accept': 'application/json','Content-Type': 'application/json'}
        request = {method: "GET", headers: headers }
        var response = await fetch('https://www.googleapis.com/youtube/v3/'+endpoint+"&key="+endpoints[x], request);
        var responseJson = await response.json();
        if (!!!responseJson.error) {
          return responseJson;
        }
      }
      return {}
    }
    catch(error) {
      console.log("ERROR",error);
    }
  }


  async _authRequest(endpoint, method, body) {
    var headers = { 'Authorization': `Token ${this.getToken()}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'}
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

  async getAllSongs() {
    // params ex: {email: riley,stephens28@gmail.com, password: Test123 }
    var response = await this._authRequest("api/library/songs/?platform=YouTube", "GET", null)
    var tracks = response.songs
    for(x=0; x<tracks.length; x++) {
      tracks[x].id = tracks[x].uri
      tracks[x].Artist = {name: tracks[x].artist, id: tracks[x].artistUri}
      tracks[x].Album = {image: tracks[x].albumArt}
    }
    return tracks
  }

  async refreshSongs() {
    // refresh saved youtube songs from revibe server
    var tracks = await this.getAllSongs()
    return {tracks: tracks, total: tracks.length}
  }

  async saveSong(song) {
    // save song to youtube library (on revibe server)
    var formattedSong = {
      name: song.name,
      songID:song.id,
      artist:song.Artist.name,
      artistUri:song.Artist.id,
      albumArt:song.Album.image,
      uri:song.uri,
      dateSaved:song.dateSaved,
    }
    body = {platform: "YouTube", song: formattedSong}
    var resp = await this._authRequest("api/library/save-song/", "POST", body)
    return resp
  }

  async removeSong(song) {
    // remove song to youtube library (on revibe server)
    body = {platform: "YouTube", song: song}
    await this._authRequest("api/library/remove-song/", "POST", body)
  }

  play(uri) {
    // controled by redux audio so this is a dummy function to work with platform interface
    console.log("playing YouTube");
  }

  pause() {
    // controled by redux audio so this is a dummy function to work with platform interface
    console.log("pausing YouTube");
  }

  resume() {
    // controled by redux audio so this is a dummy function to work with platform interface
    console.log("resuming YouTube");
  }

  async getPosition(player) {
    try {
      var position = await player.current.getCurrentTime()
    }
    catch(error) {
      var position = 0
    }
    return position;
  }

  async getDuration(player) {
    // may need to implement this for android
    // var duration = await player.duration()
  }

  seek(player, time) {
    try {
      player.current.seekTo(time);
    }
    catch(error) {
      console.log("Cant seek until player initialized");
    }
  }

  async search(text) {

    var response
    var searchEndpoint = 'search?part=snippet&videoCategoryId=10&type=video&maxResults=10&q='+text;
    response = await this._request(searchEndpoint)
    var results = {songs: [], artists: []};

    if (Object.keys(response).filter(x=> x==="items").length>0) {
      var searchResults = response.items;
      for(var x=0; x<searchResults.length; x++) {
        id = searchResults[x].id.videoId;
        name = he.decode(searchResults[x].snippet.title)
        artist = searchResults[x].snippet.channelTitle; // video channel
        artistUri = searchResults[x].snippet.channelId;
        albumArt = searchResults[x].snippet.thumbnails.medium.url;
        results.songs.push({id: id, name: name, Artist: {name: artist, id: artistUri, image: ""}, Album: {image: albumArt}, uri: id});
      }
    }
    return results;
  }

  // really geting channel videos
  // this is just a temporary solution
  async getAlbumTracks(channelId) {
    var searchEndpoint = 'search?part=snippet&videoCategoryId=10&type=video&maxResults=10&channelId='+channelId;
    var response = await this._request(searchEndpoint)
    var results = [];

    if (Object.keys(response).filter(x=> x==="items").length>0) {
      var searchResults = response.items;
      for(var x=0; x<searchResults.length; x++) {
        id = searchResults[x].id.videoId;
        name = he.decode(searchResults[x].snippet.title)
        artist = searchResults[x].snippet.channelTitle; // video channel
        artistUri = searchResults[x].snippet.channelId;
        albumArt = searchResults[x].snippet.thumbnails.high.url;
        results.push({id: id, name: name, Artist: {name: artist, id: artistUri, image:""}, Album: {image: albumArt}, uri: id});
      }
    }
    return results;
  }

  async getChannelImages(channelIds) {
    if(channelIds.length > 1) {
      channelIds = channelIds.join(",")
    }
    else {
      channelIds = channelIds[0]
    }
    var channels = 'channels?part=snippet&&maxResults=50&id='+channelIds;
    response = await this._request(channels)
    var results = [];

    if (Object.keys(response).filter(x=> x==="items").length>0) {
      var channeResults = response.items;
      for(var x=0; x<channeResults.length; x++) {
        name = channeResults[x].snippet.title; // video channel
        id = channeResults[x].id;
        image = channeResults[x].snippet.thumbnails.high.url;
        results.push({name: name, id: id, image: image});
      }
    }
    return results;
  }

}
