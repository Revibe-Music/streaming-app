import Spotify from 'rn-spotify-sdk';
import realm from './../realm/realm';
import { IP } from './../config'



export default class SpotifyAPI {

  constructor() {
    this.platformType = "private";
    try{
      this.token = realm.objects('Platform').filtered(`name = "Revibe"`)["0"].credentials.accessToken
      this.initialize();
    }
    catch(error) {
      this.token = null
    }

  }

  async initialize() {
    try {
      this.spotifyOptions = {
        "clientID":"6d5b44efae95482fb4b82519e3114014",
        "redirectURL":"revibeapp://callback",
        "scopes":[ "user-read-private", "playlist-read", "playlist-read-private",'user-library-read','user-library-modify','user-top-read',"streaming"],
        "tokenSwapURL": IP+'api/accounts/spotify-authentication/',
        "tokenRefreshURL": IP+'api/accounts/spotify-refresh/',
        "tokenRefreshEarliness": 300,
        "sessionUserDefaultsKey": "RevibeSpotifySession",
        "revibeToken": this.token, //pull accessToken from realm
        "audioSessionCategory": "AVAudioSessionCategoryPlayback"
      };
      if (!Spotify.isInitialized()) {
        await Spotify.initialize(this.spotifyOptions)
      }
      console.log("SESSION");
      console.log(Spotify.getSession())
    }
    catch (error) {
      console.log("Error in 'Spotify.initialize': "+ error);
    }
  }

  async login() {
      try {
        this.initialize();
        await Spotify.login({showDialog:false});
        var session = Spotify.getSession();
        if (!!session) {
          if(!session.expireTime) {
            var today = new Date();
            var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
            var dateTime = date + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            dateTime=dateTime.split("-");
            dateTime=dateTime[1]+"/"+dateTime[0]+"/"+dateTime[2];
            session.expireTime = parseInt(new Date(dateTime).getTime())/1000
          }
          session.tokenExpiry = String(session.expireTime);
          session.secretToken = session.refreshToken;
          return session;
        }
        return null;
      }
      catch (error) {
        if(error != "Cannot call login multiple times before completing") {
          console.log("Error in 'Spotify.login': "+ error);
          console.log("Restarting login flow...");
          await Spotify.logout()
          this.initialize();
          await Spotify.login();
          var session = Spotify.getSession();
          if (!!session) {
            if(!session.expireTime)  {
              var today = new Date();
              var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
              var dateTime = date + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
              dateTime=dateTime.split("-");
              dateTime=dateTime[1]+"/"+dateTime[0]+"/"+dateTime[2];
              session.expireTime = parseInt(new Date(dateTime).getTime())/1000
            }
            session.tokenExpiry = String(session.expireTime);
            session.secretToken = session.refreshToken;
            return session;
          }
          return null;
        }
      }
  }

  isLoggedIn() {
    this.initialize();
    return Spotify.isLoggedIn();
  }

  async logout() {
    try {
      this.initialize();
      await Spotify.logout();
    }
    catch (error) {
      console.log("Error in 'Spotify.logout': "+ error);
    }
  }

  async silentLogin(params) {

    try {
      this.initialize();
    }
    catch (error) {
      console.log("Error on spotify initialize", error);
    }
    console.log(Spotify.isLoggedIn())
    if(Spotify.isLoggedIn() && Spotify.getSession() !== null) {
      try {
        await Spotify.renewSession();
        console.log("BOUTA RETURN SPOTIFY RENEWED CREDS");
        console.log("CREDS:",Spotify.getSession());
        return Spotify.getSession()
      }
      catch (error) {
        console.log("Error on Spotify.renewSession",error);
      }
    }
    else {
      try {
        if(!params.tokenExpiry)  {
          var today = new Date();
          var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
          var dateTime = date + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          dateTime=dateTime.split("-");
          dateTime=dateTime[1]+"/"+dateTime[0]+"/"+dateTime[2];
          params.tokenExpiry = parseInt(new Date(dateTime).getTime())/1000
        }
        if(typeof params.tokenExpiry !== "number") params.tokenExpiry = parseFloat(params.tokenExpiry)
        await Spotify.loginWithSession({accessToken: params.accessToken, expireTime: params.tokenExpiry, refreshToken: params.refreshToken, scopes:["streaming","user-read-private", "playlist-read", "playlist-read-private",'user-library-read','user-library-modify','user-top-read']})
        var session = Spotify.getSession();
        console.log("Silent login session",session);
        if (!!session) {
          if(Object.keys(session).length > 0) {
            session.tokenExpiry = String(session.expireTime);
            session.secretToken = session.refreshToken;
          }
          console.log(session);
          return session;
        }
        return null;
      }
      catch (error) {
        console.log("Error in 'Spotify.loginWithSession': "+ error);
        await this.login()
        return null;
      }
    }
  }

  async hasPremiumAccount() {
    this.initialize();
    var userData = await Spotify.getMe();
    return userData.product === "premium";
  }

  _parseTracks(data) {
    var songs = []
    var id, name, artist, uri, artistUri, album, albumUri,albumArt,dateSaved,duration;
    for (var i = 0; i < data['items'].length; i++) {
      id = data['items'][i]['track']['id'];
      name = data['items'][i]['track']['name'];
      uri = data['items'][i]['track']['uri'];
      artist = data['items'][i]['track']['album']['artists'][0]['name'].replace(/"/g, "'");
      artistUri = data['items'][i]['track']['album']['artists'][0]['id']
      album = data['items'][i]['track']['album']["name"];
      albumUri = data['items'][i]['track']['album']["id"];
      albumArt = data['items'][i]['track']['album']['images'][0]['url'];
      dateSaved = data["items"][i]["added_at"] ? new Date(data["items"][i]["added_at"]) : null
      duration = data['items'][i]['track']['duration_ms']/1000;
      let song = {id: id,
                  name: name,
                  uri: uri,
                  Artist: {
                    name: artist,
                    id: artistUri,
                  },
                  Album: {
                    name: album,
                    id: albumUri,
                    image: albumArt
                  },
                  duration: duration}
      if(!!dateSaved) song.dateSaved = dateSaved
      songs.push(song);
    }
    return songs
  }

  async getAllSongs() {
    try {
      this.initialize();
      var options = {limit:50,offset:0}
      var promiseArray = []
      var initialSongRequest = await Spotify.getMyTracks(options);
      var totalTracks = initialSongRequest['total'];
      var tracksRequested = 50;
      options.offset += 50;
      while (tracksRequested < totalTracks) {
      // while (tracksRequested < 50) {
        promiseArray.push(Spotify.getMyTracks(JSON.parse(JSON.stringify(options))));
        options.offset += 50;
        tracksRequested += 50;
        console.log(tracksRequested);
      }
      var tracks = await Promise.all(promiseArray);
      tracks.unshift(initialSongRequest);
      for(var x=0; x< tracks.length; x++) {
        tracks[x] = this._parseTracks(tracks[x]);
      }
      tracks = [].concat.apply([], tracks);   //merge arrays of songs into one array
      return tracks
    }
    catch (error) {
      console.log("Error in 'Spotify.getAllSongs': "+ error);
    }
  }

  async refreshSongs() {
    try {
      var options = {limit:50,offset:0}
      var promiseArray = []
      var initialSongRequest = await Spotify.getMyTracks(options);
      var totalTracks = initialSongRequest['total'];
      var tracksRequested = 50;
      options.offset += 50;
      while (tracksRequested < 150) {
        promiseArray.push(Spotify.getMyTracks(JSON.parse(JSON.stringify(options))));
        options.offset += 50;
        tracksRequested += 50;
        console.log(tracksRequested);
      }
      var tracks = await Promise.all(promiseArray);
      tracks.unshift(initialSongRequest);
      for(var x=0; x< tracks.length; x++) {
        tracks[x] = this._parseTracks(tracks[x]);
      }
      tracks = [].concat.apply([], tracks);   //merge arrays of songs into one array
      return {tracks:tracks, total: totalTracks}
    }
    catch (error) {
      console.log("Error in 'Spotify.refreshSongs': "+ error);
    }
  }

  async saveSong(song) {
    // save song to spotify
    await Spotify.sendRequest("v1/me/tracks", "PUT", {ids: [song.id]}, true)
  }

  async removeSong(song) {
    // remove song to spotify
    await Spotify.sendRequest("v1/me/tracks", "DELETE", {ids: [song.id]}, true)
  }


  play(uri) {
    Spotify.playURI(uri, 0, 0 );
  }

  pause() {
    Spotify.setPlaying(false)
  }

  resume() {
    Spotify.setPlaying(true)
  }

  getPosition() {
    var time;
    try {
      var playbackInfo = Spotify.getPlaybackState()
      if (playbackInfo.playing) {
        time = playbackInfo.position;
      }
      else {
        time = null;
      }
    }
    catch(error) {
      time = null;
    }
    return time;
  }

  getDuration() {
    //  dont need this for saved tracks, only searched tracks? maybe not tho
  }

  seek(time) {
    try {
      Spotify.seek(time)
    }
    catch(error) {
      console.log("Error in 'Spotify.seek': "+ error);
    }
  }

  async search(text) {
    var search = await Spotify.search(text,['track', 'artist'])
    // console.log(search);
    songSearch = search.tracks.items;
    artistSearch = search.artists.items
    var results = {artists: [], songs: []};
    var artist,song_name,song_uri,album_cover,duration_ms;
    for(var x=0; x<songSearch.length; x++) {
      id = songSearch[x]['id'];
      name = songSearch[x]['name'];
      artist = songSearch[x]['artists'][0]['name'].replace(/"/g, "'");
      artistUri = songSearch[x]['artists'][0]['id']
      album = songSearch[x]['album']["name"];
      albumUri = songSearch[x]['album']["id"];
      albumArt = songSearch[x]['album']['images'][0]['url'];
      uri = songSearch[x]['uri'];
      duration = songSearch[x]['duration_ms']/1000;
      results.songs.push({id: id, name: name, Artist: {name: artist, id: artistUri, image: ""}, Album: {name: album, id: albumUri, image: albumArt}, uri: uri, duration: duration});
    }

    var name,id,image;
    for(var x=0; x<artistSearch.length; x++) {
      name = artistSearch[x]['name'];
      id = artistSearch[x]['id']
      if(!!artistSearch[x]['images'].length > 0) {
        image = artistSearch[x]['images'][0]['url'];
        results.artists.push({name: name, id: id, image: image});
      }
    }

    return results;
  }

  async getArtistAlbums(artistUri) {
    var artist = await Spotify.getArtist(artistUri)
    artist = artist.images[1].url
    var results = await Spotify.getArtistAlbums(artistUri)
    results = results.items
    results = Array.from(new Set(results.map(a => a.id))).map(id => {
       return results.find(a => a.id === id)
     })
    albums = results.filter(x => x.album_type === "album");
    singles = results.filter(x => x.album_type === "single");

    for(var x=0; x<albums.length; x++) {
      albums[x] = {name: albums[x]['name'], image: albums[x]['images'][0]['url'], id: albums[x]['id'], numTracks: albums[x]['total_tracks']};
    }
    for(var x=0; x<singles.length; x++) {
      singles[x] = {name: singles[x]['name'], image: singles[x]['images'][0]['url'], id: singles[x]['id'], numTracks: singles[x]['total_tracks']};
    }
    return {artistImg: artist, albums: albums, singles: singles};
  }

  async getAlbumTracks(albumUri) {
    var results = await Spotify.getAlbumTracks(albumUri)
    results = results.items
    var tracks = []

    for(var x=0; x<results.length; x++) {
      id = results[x]['id'];
      name = results[x]['name'];
      artist = results[x]['artists'][0]['name'].replace(/"/g, "'");
      artistUri = results[x]['artists'][0]['id']
      uri = results[x]['uri'];
      duration = results[x]['duration_ms']/1000;
      tracks.push({id: id, name: name, Artist: {name: artist, id: artistUri, image: ""}, uri: uri, duration: duration});
    }
    return tracks;
  }

  async getArtists(ids) {
    var results = await Spotify.getArtists(ids).artists

    var artists = []
    var name,id,image;
    for(var x=0; x<results.length; x++) {
      name = results[x]['name'];
      id = results[x]['id']
      if(!!results[x]['images']) {
        if(results[x]['images'].length > 0) {
          image = results[x]['images'][0]['url'];
          artists.push({name: name, id: id, image: image});
          }
      }
    }
    return artists
  }

  async getArtistImage(id) {
    var results = await Spotify.getArtist(id)

    if(!!artistData[x]['images']) {
      if(artistData[x]['images'].length > 0) {
        return artistData[x]['images'][0]['url'];
        }
    }

    return ""
  }

}
