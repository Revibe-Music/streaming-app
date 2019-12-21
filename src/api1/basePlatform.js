import realm from './../realm/realm';
import RevibeAPI from './revibe';
import YouTubeAPI from './youtube';
import SpotifyAPI from './spotify';
import _ from "lodash";


export default class BasePlatformAPI {

  constructor(name) {
    this.name = name;
    this.platformType = "Public"
    this.library = this.getSongs();
  }

  async authenticatedOperation(callback) {
    //  ensure valud authentication for requests and retry up to 5 times before quiting
    var x = 0
    while(x<5) {
      if(this.isLoggedIn()) {
        try {
          await callback()
          break
        }
        catch(error) {
          console.log(error);
        }
      }
      else {
        this.refreshToken()
      }
    }

  }

  //////////////////////////////////////////////////////////////////////
  /////////////// CREDENTIAL/AUTHENTICATION OPERATIONS /////////////////
  //////////////////////////////////////////////////////////////////////
  hasLoggedIn() {
    //  see if user has ever logged in by seeing if platform credentials are in realm
    return !!this.getCredentials();
  }

  isLoggedIn() {
    //  check if token expire time is greater than current time, if so token is logged inalm
    return this.getCredentials().tokenExpiry > Math.round((new Date()).getTime() / 1000);
  }

  login(credentials) {
    //  implement in subclasses
    this.saveCredentials(credentials);
  }

  refreshToken(credentials) {
    //  implement in subclasses
    this.updateCredentials(credentials);
  }

  logout() {
    //  implement in subclasses
    this.removeCredentials()
    this.removeAllSongs();
  }

  getCredentials() {
    //  return credential object for platform
    return realm.objects('Credential').filtered(`platform = "${this.name}"`)["0"];
  }

  _validateCredentials(credentials) {
    // make sure credential object is in correct format
    if(credentials.accessToken === null) {
      throw "Access token cannot be null."
    }
    if(credentials.refreshToken !== null) {
      if(typeof credentials.refreshToken !== "string") {
        throw `Refresh token must be a string not a ${typeof credentials.refreshToken}.`
      }
    }
    if(credentials.tokenExpiry !== null) {
      if(typeof credentials.tokenExpiry !== "number") {
        throw `Token expiry must be a number not a ${typeof credentials.refrestokenExpiryhToken}.`
      }
    }
  }

  saveCredentials(credentials) {
    //  save new credential object to realm
    this._validateCredentials(credentials)
    var creds = this.getCredentials()
      realm.write(() => {
        if (!!creds) realm.delete(creds)
        credential.platform = this.name
        var credential_obj = realm.create('Credential', credential);
    })
  }

  updateCredentials(credentials) {
    //  update existing credential object in realm
    this._validateCredentials(credentials)
    try {
      realm.write(() => {
        var creds = this.getCredentials()
        if(creds) {
          creds.accessToken = accessToken;
        }
        else {
          creds = {accessToken: accessToken}
        }
        if(!!credentials.tokenExpiry) creds.tokenExpiry = credentials.tokenExpiry;
        if(!!credentials.refreshToken) creds.refreshToken = credentials.refreshToken;
      })
    }
    catch(error) {
      console.log("Error occured while attempting to update credentials:", error);
    }
  }

  removeCredentials() {
    //  remove credential object from realm
    realm.write(() => {
      let credentials = this.getCredentials()
      realm.delete(credentials);
    })
  }

  //////////////////////////////////////////////////////////////////////
  /////////// GETTER FUNCTIONS THAT RETURN PLATFORM OBJECTS ////////////
  //////////////////////////////////////////////////////////////////////
  getLibrary() {
    //  return songs from specific platform library
    return JSON.parse(JSON.stringify(realm.objects('Library').filtered(`platform = "${this.name}"`)["0"].songs.sorted("dateSaved",true).slice(0)))
  }

  getPlaylist(playlist) {
    //  return songs from specific playlist
    return JSON.parse(JSON.stringify(realm.objects('Playlist').filtered(`name = "${playlist}"`)["0"].songs.sorted("dateSaved",true).slice(0)))
  }

  getArtists() {
    //  return artist from specific platform
    return JSON.parse(JSON.stringify(realm.objects('Artist').filtered(`platform = "${this.name}"`).slice(0)))
  }

  getAlbums() {
    //  return albums from specific platform
    return JSON.parse(JSON.stringify(realm.objects('Album').filtered(`platform = "${this.name}"`).slice(0)))
  }

  //////////////////////////////////////////////////////////////////////
  /////// HELPER FUNCTIONS THAT CHECK IF OBJECT EXISTS IN REALM ////////
  //////////////////////////////////////////////////////////////////////
  _songExists(song) {
    //  return whether a matching song already exists in realm
    return JSON.parse(JSON.stringify(realm.objects('Song').filtered(`platform = "${this.name}"`).slice(0))).filter(x => x.id === song.id).length > 0
  }

  _librarySongExists(song) {
    //  return whether a matching song has already been saved to specific platform library
    return this.getLibrary().filter(x => x.id === song.id).length > 0
  }

  _playlistSongExists(song, playlist) {
    //  return whether a matching song has already been saved to specific platform library
    return this.getLibrary().filter(x => x.id === song.id).length > 0
  }

  _artistExists(artist) {
    //  return whether a matching artist already exists in realm
    return this.getArtists().filter(x => x.id === artist.id).length > 0
  }

  _albumExists(album) {
    //  return whether a matching album already exists in realm
    return this.getAlbum().filter(x => x.id === album.id).length > 0
  }

  //////////////////////////////////////////////////////////////////////
  ///////////// SAVE FUNCTIONS THAT SAVE OBJECTS TO REALM //////////////
  //////////////////////////////////////////////////////////////////////
  saveSong(song) {
    //  save song object and any child objects to realm
    //  returns realm song object
    realm.write(() => {
      if(!this._songExists(song)) {
        var songContributors = []
        for(var x=0; x<song.contributors.length; x++) {
          var artist = this.saveArtist(song.contributors[x])
          var contributionType = song.contributors[x].contributionType ? song.contributors[x].contributionType : null
          songContributors.push(this.saveContribution(artist, contributionType))
        }
        var album = this.saveAlbum(song.album)
        var formattedSong = {id: song.id,
                             uri: song.uri,
                             name: song.name,
                             album: album,
                             contributors: songContributors,
                             duration: song.duration,
                             platform: this.name,
                             // dateSaved: song.dateSaved ? song.dateSaved : new Date().toLocaleString()
                            }
        return realm.create('Song', formattedSong);
      }
      return realm.objects('Song').filtered(`id = "${song.id}"`)[0]
    })
  }

  saveArtist(artist) {
    //  save artist object and any child objects to realm
    //  returns realm artist object
    realm.write(() => {
      if(!this._artistExists(artist)) {
        artist.platform = this.name
        return realm.create('Artist', artist);
      }
      return realm.objects("Artist").filtered(`id = "${artist.id}"`)[0]
    })
  }

  saveAlbum(album) {
    //  save album object and any child objects to realm
    //  returns realm album object
    realm.write(() => {
      if(!this._albumExists(artist)) {
        var albumContributors = []
        for(var x=0; x<album.contributors.length; x++) {
          var artist = this.saveArtist(album.contributors[x])
          var contributionType = album.contributors[x].contributionType ? album.contributors[x].contributionType : null
          albumContributors.push(this.saveContribution(artist, contributionType))
        }
        album.contributors = albumContributors
        album.platform = this.name
        return realm.create('Album', album);
      }
      return realm.objects("Album").filtered(`id = "${album.id}"`)[0]
    })
  }

  saveContribution(artist, contributionType=null) {
    //  save contribution object and any child objects to realm
    //  returns realm contribution object
    realm.write(() => {
      if(this._artistExists(artist)) {
        if(contributionType !== null) {
          return realm.create('Contributor', {contributionType: contributionType, artist: artist} );
        }
        return realm.create('Contributor', {artist: artist});
      }
      else {
        throw "Artist must be saved in realm before they can be part of contribution."
      }
    })
  }

  // consider adding batched operations here

  //////////////////////////////////////////////////////////////////////
  ////////// REMOVE FUNCTIONS THAT REMOVE OBJECTS FROM REALM ///////////
  //////////////////////////////////////////////////////////////////////
  removeSong(song) {
    realm.write(() => {
      let songObj = realm.objects("Song").filtered(`id = "${song.id}"`)
      realm.delete(songObj.contributors);
      realm.delete(songObj);
    })
  }

  removeArtist(artist) {
    realm.write(() => {
      let artistObj = realm.objects("Artist").filtered(`id = "${artist.id}"`)
      realm.delete(artistObj.images);
      realm.delete(artistObj);
    })
  }

  removeAlbum(album) {
    realm.write(() => {
      let albumObj = realm.objects("Album").filtered(`id = "${album.id}"`)
      realm.delete(albumObj.contributors);
      realm.delete(albumObj.images);
      realm.delete(albumObj);
    })
  }

  // Batch operations

  removeAllSongs() {
    let songs = realm.objects('Song').filtered(`platform = "${this.name}"`);
    realm.write(() => {
      for(var x=0; x<songs.length; x++) {
        this.removeSong(songs[x])
      }
    })
    this.library = []
  }

  removeAllArtist() {
    let artists = realm.objects('Artist').filtered(`platform = "${this.name}"`);
    realm.write(() => {
      for(var x=0; x<artists.length; x++) {
        this.removeArtist(artists[x])
      }
    })
  }

  removeAllAlbums() {
    let albums = realm.objects('Albums').filtered(`platform = "${this.name}"`);
    realm.write(() => {
      for(var x=0; x<albums.length; x++) {
        this.removeAlbums(albums[x])
      }
    })
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////// LIBRARY OPERATIONS  /////////////////////////
  //////////////////////////////////////////////////////////////////////
  addSongToLibrary(song) {
    // check if song exists
    // check if song is in library already
    // if it isnt then add it to library songs
  }

  removeSongFromLibrary(song) {
    // check if song exists
    // check if song is in library
    // check if song only exists in library or if its in a playlist too
    // if its only in library remove it from library songs and delete the song object
    // if its in a playlist then only remove it from library songs, dont delete song from realm
  }

  refreshLibrary(tracks) {
    //returns most recent 150 songs
    const recentSongs = response.tracks
    var totalSongs = response.total

    realm.write(() => {
      for(var x=0; x<recentSongs.length; x++) {
        this.addSongToLibrary(recentSongs[x])
      }

      var recentSongIds = recentSongs.map(function (e) { return e.id; });
      var savedSongIds = this.getLibrary().map(function (e) { return e.id; });

      if(JSON.stringify(recentSongIds) !== JSON.stringify(savedSongIds) ) {
        var recentSongIds = recentSongs.map(function (e) { return e.id; });
        var removedSongs = this.getLibrary().slice(0,recentSongIds.length).filter(e => !recentSongIds.includes(e.id) )
        for(var x=0; x<removedSongs.length; x++) {
          let songObj = realm.objects('Song').filtered(`id = "${removedSongs[x].id}"`)
          this.removeSongFromLibrary(removedSongs[x])
        }
      }

      if(this.getLibrary().length != totalSongs) {
        this.resyncLibrary()
      }
    })
    return this.getLibrary()
  }

  resyncLibrary(songs) {
    this.removeAllSongs()
    realm.write(async () => {
      for(x=0; x<songs.length; x++) {
        this.saveSong(songs[x])
      }
    })
    this.library = await this.getLibrary()
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////// PLAYLIST OPERATIONS  ////////////////////////
  //////////////////////////////////////////////////////////////////////
  addSongToPlaylist(song, playlist) {
    // Implement
  }

  removeSongFromPlaylist(song, playlist) {
    // Implement
  }

  refreshPlaylist(playlist) {
    // Implement
  }

  resyncPlaylist(playlist) {
    // Implement
  }


  //////////////////////////////////////////////////////////////////////
  ////////////////// LOCAL DATA QUERYING OPERATIONS  ///////////////////
  //////////////////////////////////////////////////////////////////////
  getSavedArtistAlbums(id) {
    return JSON.parse(JSON.stringify(realm.objects("Album").filtered(`contributors.artist.id = "${id}"`).slice(0)));
  }

  getSavedArtistTracks(id) {
    return JSON.parse(JSON.stringify(realm.objects("Song").filtered(`Artist.id = "${id}"`).slice(0)));
  }

  getSavedAlbumTracks(id) {
    return JSON.parse(JSON.stringify(realm.objects("Song").filtered(`Album.id = "${id}"`).slice(0)));
  }

  filterData(type, text) {
    var data = []
    return data
  }


  //////////////////////////////////////////////////////////////////////
  ///////////////// PLATFORM SPECIFIC API OPERATIONS  //////////////////
  //////////////////////////////////////////////////////////////////////
  getArtistAlbums() {
    throw "Need to implement getArtistAlbums for " + this.name
  }

  getAlbumTracks() {
    throw "Need to implement getAlbumTracks for " + this.name
  }

  play() {
    throw "Need to implement play for " + this.name
  }

  pause() {
    throw "Need to implement pause for " + this.name
  }

  resume() {
    throw "Need to implement resume for " + this.name
  }

  getPosition() {
    throw "Need to implement getPosition for " + this.name
  }

  getDuration() {
    throw "Need to implement getDuration for " + this.name
  }

  seek() {
    throw "Need to implement seek for " + this.name
  }

  search() {
    throw "Need to implement search for " + this.name
  }
}
