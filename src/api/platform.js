import realm from './../realm/realm';
import RevibeAPI from './revibe';
import YouTubeAPI from './youtube';
import SpotifyAPI from './spotify';
import _ from "lodash";


export default class Platform {

  constructor(name) {
    this.name = name;
    if(name.toLowerCase() === "youtube") this.api = new YouTubeAPI()
    else if(name.toLowerCase() === "spotify") this.api = new SpotifyAPI()
    else if(name.toLowerCase() === "revibe") this.api = new RevibeAPI()
    this.platformType = this.api.platformType
    this.library = this.getSongs();
    this.player = null  // component object (only used by YouTube)
  }

  async getUser(params) {
    return await this.api.getUser(params)
  }

  hasLoggedIn() {
      // see if user has ever logged in by seeing if platform credentials are in realm
      return !!realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].credentials;
  }

  isLoggedIn() {
    // see if user has ever logged in by seeing if platform credentials are in realm
      return this.api.isLoggedIn();
  }

  async login(params=null) {
    var credential = await this.api.login(params);
    console.log(credential);

    if (Object.keys(credential).filter(x=> x==="accessToken").length > 0) {
      console.log("IN THIS BITCH");
      this.saveCredentials(credential);
      return credential;
    }

    return credential
  }

  async silentLogin() {
    var credential, currentCredentials;
      try {
        currentCredentials = this.getCredentials()
        credential = await this.api.silentLogin(currentCredentials);
        console.log("Credentials",credential);
        if(credential !== null) {
          this.updateCredentials(credential.accessToken, String(credential.expireTime), credential.refreshToken);
        }
        else {
          console.log("DIDNT UPDATE CREDS");
        }
      }
      catch(error) {
        console.log("Going to need to login to "+this.name+" again. Error:", error);
      }
  }

  async logout() {
    if(this.platformType === "private") await this.api.logout();
    this.removeCredentials()
    this.removeAllSongs();
  }

  getCredentials() {
      var creds = JSON.parse(JSON.stringify(realm.objects('Platform').filtered(`name = "${this.name}"`)["0"]));
      return creds.credentials;
  }

  saveCredentials(credential) {
    // Need to pass object with the same attributes as credential schema
    var platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
    realm.write(() => {
      if (!!platform.credentials) realm.delete(platform.credentials)
      if (!!credential.tokenExpiry) credential.tokenExpiry = credential.tokenExpiry.toString()
      var credential_obj = realm.create('Credential', credential);
      platform.credentials = credential_obj
    })
  }

  updateCredentials(accessToken, expireTime=null, refreshToken=null) {
    realm.write(() => {
      var platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
      if(platform.credentials) {
        platform.credentials.accessToken = accessToken;
      }
      else {
        platform.credentials = {accessToken: accessToken}
      }
      if(!!expireTime) platform.credentials.tokenExpiry = String(expireTime);
      if(!!refreshToken) platform.credentials.secretToken = String(refreshToken);
    })
  }

  removeCredentials() {
    realm.write(() => {
      let platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
      realm.delete(platform.credentials);
    })
  }

  getSongs() {
    return JSON.parse(JSON.stringify(realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].songs.sorted("dateSaved",true).slice(0)))
  }

  filterData(type, text) {
    var data = []
    var songs = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].songs.slice(0)

    if(type === "Artists") {
      if(text) {
        var artists = _.map(songs, function(o) {
            return o.Artist;
        })
        artists = _.compact(artists)
        artists = _.uniqBy(artists, 'id');
        // console.log(artists);

        if(artists.length > 0 ) {
          for(x=0; x<artists.length; x++) {
            if(_.startsWith(_.lowerCase(artists[x].name),_.lowerCase(text))) {
              data.push(artists[x])
            }
          }
          // console.log(data);
          if(data.length < 1)  {
            for(x=0; x<artists.length; x++) {
              if(_.includes(_.lowerCase(artists[x].name),_.lowerCase(text))) {
                data.push(artists[x])
              }
            }
          }
        }
        else {
          return []
        }
        if(data.length > 0) data.sort((a, b) => (a.name > b.name) ? 1 : -1)
      }
      else {
        var artists = _.map(songs, function(o) {
            return o.Artist;
        });
        if(artists.length > 0 ) {
          data = _.uniqBy(artists, 'id');
          data.sort((a, b) => (a.name > b.name) ? 1 : -1)
        }
        else {
          return []
        }
      }
    }
    else if(type === "Albums") {
      if(this.name === "YouTube") {
        return []
      }
      var data = []
      var songs = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].songs.slice(0)
      if(text) {
        var albums = _.map(songs, function(o) {
            return o.Album;
        })
        albums = _.compact(albums)
        albums = _.uniqBy(albums, 'id');

        if(albums.length > 0 ) {
          for(x=0; x<albums.length; x++) {
            if(_.startsWith(_.lowerCase(albums[x].name),_.lowerCase(text))) {
              data.push(albums[x])
            }
          }
          if(data.length < 1)  {
            for(x=0; x<albums.length; x++) {
              if(_.includes(_.lowerCase(albums[x].name),_.lowerCase(text))) {
                data.push(albums[x])
              }
            }
          }
        }
        else {
          return []
        }
        if(data.length > 0) data.sort((a, b) => (a.name > b.name) ? 1 : -1)
      }
      else {
        var albums = _.map(songs, function(o) {
            if (o.Album !== null) return o.Album;
        });
        if(albums.length > 0 ) {
          data = _.uniqBy(albums, 'id');
          data.sort((a, b) => (a.name > b.name) ? 1 : -1)
        }
        else {
          return []
        }
      }
    }
    else {
      if(text) {
        data = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].songs.filtered(`name BEGINSWITH[c] "${text}"`)
        if(data.length < 1)  {
          data = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].songs.filtered(`name CONTAINS[c] "${text}"`)
        }
      }
      else {
        data = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"].songs.slice(0)
        if(data.length > 0) data.sort((a, b) => (a.name > b.name) ? 1 : -1)
      }
    }
    data = JSON.parse(JSON.stringify(data.slice(0)));
    return data
  }

  async refreshSongs() {
    //returns most recent 150 songs
    const response = await this.api.refreshSongs();
    const recentSongs = response.tracks

    var totalSongs = response.total
    var platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];

    realm.write(async () => {

      for(var x=0; x<recentSongs.length; x++) {
        if(!recentSongs[x].dateSaved) {
          let date = new Date().toLocaleString();
          recentSongs[x].dateSaved = date
        }

        var songId = recentSongs[x].id;
        var artist, album
        if(platform.songs.filter(x => x.id === songId).length < 1) {
          if(realm.objects("Artist").filtered(`id = "${recentSongs[x].Artist.id}"`).length < 1) {
            artist = realm.create('Artist', {name: recentSongs[x].Artist.name, id: recentSongs[x].Artist.id, image: ""});
          }
          else {
            artist = realm.objects("Artist").filtered(`id = "${recentSongs[x].Artist.id}"`)[0]
          }
          if(this.name === "YouTube") {
            if(realm.objects("Album").filtered(`image = "${recentSongs[x].Album.image}"`).length < 1) {
              album = realm.create('Album', {name: "", id: "", image: recentSongs[x].Album.image});
            }
            else {
              album = realm.objects("Album").filtered(`image = "${recentSongs[x].Album.image}"`)[0]
            }
          }
          else {
            if(realm.objects("Album").filtered(`id = "${recentSongs[x].Album.id}"`).length < 1) {
              album = realm.create('Album', {name: recentSongs[x].Album.name, id: recentSongs[x].Album.id, image: recentSongs[x].Album.image});
            }
            else {
              album = realm.objects("Album").filtered(`id = "${recentSongs[x].Album.id}"`)[0]
            }
          }
          let song_obj = realm.create('Song', {id: recentSongs[x].id, name: recentSongs[x].name, uri: recentSongs[x].uri, Artist: artist, Album: album, platform: this.name, dateSaved: recentSongs[x].dateSaved, duration: recentSongs[x].duration});
          platform.songs.push(song_obj);
        }
      }

      var recentSongIds = recentSongs.map(function (e) { return e.id; });
      var savedSongIds = this.getSongs().map(function (e) { return e.id; });

      if(JSON.stringify(recentSongIds) !== JSON.stringify(savedSongIds) ) {
        var recentSongIds = recentSongs.map(function (e) { return e.id; });
        var removedSongs = this.getSongs().slice(0,recentSongIds.length).filter(e => !recentSongIds.includes(e.id) )
        for(var x=0; x<removedSongs.length; x++) {
          let songObj = platform.songs.filtered(`id = "${removedSongs[x].id}"`)
          realm.delete(songObj);
        }
      }

      if(this.getSongs().length != totalSongs) {
        // if it still isnt right, just update it all
        this.updateAllSongs()
      }

    })
    return this.getSongs()
  }

  async updateAllSongs() {

    // var allSongs =  this.getSongs()
    var platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
    var songs = await this.api.getAllSongs()
    this.removeAllSongs()

    realm.write(async () => {
      for(x=0; x<songs.length; x++) {
        if(!songs[x].dateSaved) {
          let date = new Date().toLocaleString();
          songs[x].dateSaved = date
        }
        var songId = songs[x].id;
        var artist, album
        if(platform.songs.filter(x => x.id === songId).length < 1) {
          if(realm.objects("Artist").filtered(`id = "${songs[x].Artist.id}"`).length < 1) {
            artist = realm.create('Artist', {name: songs[x].Artist.name, id: songs[x].Artist.id, image: ""});
          }
          else {
            artist = realm.objects("Artist").filtered(`id = "${songs[x].Artist.id}"`)[0]
          }
          if(this.name === "YouTube") {
            if(realm.objects("Album").filtered(`image = "${songs[x].Album.image}"`).length < 1) {
              album = realm.create('Album', {name: "", id: "", image: songs[x].Album.image});
            }
            else {
              album = realm.objects("Album").filtered(`image = "${songs[x].Album.image}"`)[0]
            }
          }
          else {
            if(realm.objects("Album").filtered(`id = "${songs[x].Album.id}"`).length < 1) {
              album = realm.create('Album', {name: songs[x].Album.name, id: songs[x].Album.id, image: songs[x].Album.image});
            }
            else {
              album = realm.objects("Album").filtered(`id = "${songs[x].Album.id}"`)[0]
            }
          }
          let song_obj = realm.create('Song', {id: songs[x].id, name: songs[x].name, uri: songs[x].uri, Artist: artist, Album: album, platform: this.name, dateSaved: songs[x].dateSaved, duration: songs[x].duration});
          platform.songs.push(song_obj);
        }
      }
    })
    this.library = await this.getSongs()
  }

  removeAllSongs() {
    let platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
    realm.write(() => {
      for(x=0; x<platform.songs.slice(0).length; x++) {
        if(platform.songs[x].Album) {
          realm.delete(platform.songs[x].Album)
        }
        if(platform.songs[x].Artist) {
          realm.delete(platform.songs[x].Artist)
        }
      }
      realm.delete(platform.songs)
      platform.songs = []
    })
    this.library = []
  }

  saveSong(song) {
    // Need to pass object with the same attributes as song schema
    let platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
    if(!song.dateSaved) {
      let date = new Date().toLocaleString();
      song.dateSaved = date
    }
    realm.write(async () => {
      if(platform.songs.slice(0).filter(x => x.id === song.id).length < 1) {
        if(realm.objects("Artist").filtered(`id = "${song.Artist.id}"`).length < 1) {
          // song.Artist.image = await this.api.getArtistImage(song.Artist.id)
          artist = realm.create('Artist', song.Artist);
        }
        else {
          artist = realm.objects("Artist").filtered(`id = "${song.Artist.id}"`)[0]
        }
        if(this.name === "YouTube") {
          if(realm.objects("Album").filtered(`image = "${song.Album.image}"`).length < 1) {
            album = realm.create('Album', {name: "", id: "", image: song.Album.image});
          }
          else {
            album = realm.objects("Album").filtered(`image = "${song.Album.image}"`)[0]
          }
        }
        else {
          if(realm.objects("Album").filtered(`id = "${song.Album.id}"`).length < 1) {
            album = realm.create('Album', song.Album);
          }
          else {
            album = realm.objects("Album").filtered(`id = "${song.Album.id}"`)[0]
          }
        }
        let song_obj = realm.create('Song', {id: song.id, name: song.name, uri: song.uri, Artist: artist, Album: album, platform: this.name, dateSaved: song.dateSaved, duration: song.duration});
        platform.songs.push(song_obj);
        this.api.saveSong(song_obj)
      }
    })
  }

  removeSong(song) {
    // Need to pass object with the same attributes as song schema
    this.api.removeSong(song)

    realm.write(() => {
      let platform = realm.objects('Platform').filtered(`name = "${this.name}"`)["0"];
      let songObj = platform.songs.filtered(`id = "${song.id}"`)
      realm.delete(songObj);
    })
  }

  getSavedArtistTracks(id) {
    return JSON.parse(JSON.stringify(realm.objects("Song").filtered(`Artist.id = "${id}"`).slice(0)));
  }

  getSavedAlbumTracks(id) {
    return JSON.parse(JSON.stringify(realm.objects("Song").filtered(`Album.id = "${id}"`).slice(0)));
  }

  async getArtistAlbums(id) {
    try {
      return await this.api.getArtistAlbums(id)
    }
    catch(error) {
      await this.silentLogin()
      return await this.api.getArtistAlbums(id)
    }
  }

  async getAlbumTracks(id) {
    try {
      return await this.api.getAlbumTracks(id)
    }
    catch(error) {
      await this.silentLogin()
      return await this.api.getAlbumTracks(id)
    }
  }


  async play(uri) {
    try {
      this.api.play(uri)
    }
    catch(error) {
      await this.silentLogin()
      this.api.play(uri)
    }
  }

  async pause() {
    try {
      this.api.pause();
    }
    catch(error) {
      await this.silentLogin()
      this.api.pause();
    }
  }

  async resume() {
    try {
      this.api.resume();
    }
    catch(error) {
      await this.silentLogin()
      this.api.resume();
    }
  }

  async getPosition() {
    try {
      if(this.player) {
        return await this.api.getPosition(this.player);
      }
      return this.api.getPosition();
    }
    catch(error) {
      await this.silentLogin()
      return this.api.getPosition();
    }
  }

  async getDuration() {
    try {
      if(this.player) {
        return await this.api.getDuration(this.player);
      }
      return this.api.getDuration();
    }
    catch(error) {
      await this.silentLogin()
      return this.api.getDuration();
    }
  }

  async seek(time) {
    try {
      if(this.player) {
        this.api.seek(this.player, time)
      }
      else {
        this.api.seek(time)
      }
    }
    catch(error) {
      await this.silentLogin()
      this.api.seek(time)
    }
  }

  async search(text) {
    try {
      const platform = this.name
      var response = await this.api.search(text)

      // add platform as object attribute
      response.songs = response.songs.map(function(el) {
        var song = Object.assign({}, el);
        song.platform = platform;
        return song;
      })
      return response
    }
    catch(error) {
      await this.silentLogin()
      console.log("ERROR", error);
      const platform = this.name
      var response = await this.api.search(text)

      // add platform as object attribute
      response.songs = response.songs.map(function(el) {
        var song = Object.assign({}, el);
        song.platform = platform;
        return song;
      })
      return response
    }
  }

}
