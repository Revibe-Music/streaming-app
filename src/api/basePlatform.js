import realm from './../realm/realm';

export default class BasePlatformAPI {

  //////////////////////////////////////////////////////////////////////
  ///////////////// GENERAL AUTHENTICATION OPERATIONS //////////////////
  //////////////////////////////////////////////////////////////////////

  hasLoggedIn() {
    //  see if user has ever logged in by seeing if platform token are in realm
    return !!this.getToken();
  }

  isLoggedIn(platform=this.name) {
    //  check if token expire time is greater than current time, if so token is logged in
    return this.getToken(platform).expiration > Math.round((new Date()).getTime() / 1000);
  }

  getToken(platform=this.name) {
    //  return token object for platform
    return realm.objects('Token').filtered(`platform = "${platform}"`)["0"];
  }

  _validateToken(token) {
    // make sure token object is in correct format
    // should probably use this to handle errors rather than create them lol
    if(token.accessToken === null) {
      throw `${this.name} access token cannot be null.`
    }
    else if(typeof token.accessToken !== "string") {
      throw `${this.name} access token must be a string not a ${typeof token.accessToken}.`
    }
    if(typeof token.refreshToken !== "string") {
      throw `${this.name} refresh token must be a string not a ${typeof token.refreshToken}.`
    }
    if(token.expiration !== null) {
      if(typeof token.expiration !== "number") {
        throw `${this.name} token expiration must be a number not a ${typeof token.refresexpirationhToken}.`
      }
    }
  }

  _generateExpiration(hoursAhead) {
    var expiration = new Date();
    expiration.setHours( expiration.getHours() + hoursAhead )
    expiration = expiration.getTime() / 1000
    return expiration
  }

  saveToken(token) {
    //  save new token object to realm
    this._validateToken(token)
    var currentToken = this.getToken()
      realm.write(() => {
        if (!!currentToken) realm.delete(currentToken)
        token.platform = this.name
        var token_obj = realm.create('Token', token);

        // create library for platform if one does not already exist
        if(realm.objects('Library').filtered(`platform = "${this.name}"`).length < 1) {
          realm.create('Library', {platform: this.name})
        }
    })
  }

  updateToken(token, platform=this.name) {
    //  update existing token object in realm
    this._validateToken(token)
    try {
      realm.write(() => {
        var currentToken = this.getToken(platform)
        currentToken.accessToken = token.accessToken;
        if(token.refreshToken !== currentToken.refreshToken) currentToken.refreshToken = token.refreshToken;
        if(expiration) currentToken.expiration = expiration;
      })
    }
    catch(error) {
      console.log("Error occured while attempting to update token:", error);
    }
  }

  removeToken() {
    //  remove token object from realm
    realm.write(() => {
      let token = this.getToken()
      realm.delete(token);
    })
  }


  //////////////////////////////////////////////////////////////////////
  /////////// GETTER FUNCTIONS THAT RETURN PLATFORM OBJECTS ////////////
  //////////////////////////////////////////////////////////////////////

  getLibrary() {
    //  return songs from specific platform library
    return this.cloneArray(realm.objects('Library').filtered(`platform = "${this.name}"`)["0"].songs.sorted("dateSaved",true))
  }

  getPlaylist(playlistName) {
    //  return songs from specific playlist
    return this.cloneArray(realm.objects('Playlist').filtered(`name = "${playlistName}"`)["0"].songs.sorted("dateSaved",true))
  }

  getArtists() {
    //  return artist from specific platform
    return this.cloneArray(realm.objects('Artist').filtered(`platform = "${this.name}"`))
  }

  getAlbums() {
    //  return albums from specific platform
    return this.cloneArray(realm.objects('Album').filtered(`platform = "${this.name}"`))
  }

  getSavedArtistAlbums(id) {
    return this.cloneArray(realm.objects("Album").filtered(`contributors.artist.id = "${id}"`));
  }

  getSavedArtistTracks(id) {
    return this.cloneArray(realm.objects("Song").filtered(`Artist.id = "${id}"`));
  }

  getSavedAlbumTracks(id) {
    return this.cloneArray(realm.objects("Song").filtered(`Album.id = "${id}"`));
  }


  //////////////////////////////////////////////////////////////////////
  /////// HELPER FUNCTIONS THAT CHECK IF OBJECT EXISTS IN REALM ////////
  //////////////////////////////////////////////////////////////////////

  _songExists(song) {
    //  return whether a matching song already exists in realm
    return realm.objects('Song').filtered(`platform = "${this.name}" AND id=${id}`).length > 0
  }

  _librarySongExists(song) {
    //  return whether a matching song has already been saved to specific platform library
    return this.getLibrary().filter(x => x.id === song.id).length > 0
  }

  _playlistSongExists(song) {
    //  return whether a matching song has already been saved to any playlist
    return realm.objects('Playlist').filtered(`platform = "${this.name}" AND songs.song.id="${song.id}"`).length > 0
  }

  _songInPlaylist(song, playlistName) {
    //  return whether a matching song has already been saved to specific playlist
    return this.getPlaylist(playlistName).filter(x => x.id === song.id).length > 0
  }

  _artistExists(artist) {
    //  return whether a matching artist already exists in realm
    return this.getArtists().filter(x => x.id === artist.id).length > 0
  }

  _albumExists(album) {
    //  return whether a matching album already exists in realm
    return this.getAlbums().filter(x => x.id === album.id).length > 0
  }

  //////////////////////////////////////////////////////////////////////
  ///////////// SAVE FUNCTIONS THAT SAVE OBJECTS TO REALM //////////////
  //////////////////////////////////////////////////////////////////////
  saveSong(song, source) {
    //  source can be of type realm Library or realm Playlist
    //  save song object and any child objects to realm
    //  returns realm song object
    realm.write(() => {
      if(!this._songExists(song)) {
        var songContributors = []
        for(var x=0; x<song.contributors.length; x++) {
          var artist = this.saveArtist(song.contributors[x])
          var type = song.contributors[x].type ? song.contributors[x].type : null
          songContributors.push(this.saveContributor(artist, type))
        }
        var album = this.saveAlbum(song.album)
        var formattedSong = {
          id: song.id,
          uri: song.uri,
          name: song.name,
          album: album,
          contributors: songContributors,
          duration: song.duration,
          platform: this.name,
        }
        var songObj = realm.create('Song', formattedSong);
        var savedSong = realm.create('SavedSong', {song: songObj, dateSaved: new Date().toLocaleString()});
        source.songs.push(savedSong)
      }
      else if(source.songs.filtered(`song.id = "${song.id}"`).length < 1) {
        var songObj = realm.objects('Song').filtered(`id = "${song.id}"`)[0]
        var savedSong = realm.create('SavedSong', {song: songObj, dateSaved: new Date().toLocaleString()});
        source.songs.push(savedSong)
      }
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
          var type = album.contributors[x].type ? album.contributors[x].type : null
          albumContributors.push(this.saveContributor(artist, type))
        }
        album.contributors = albumContributors
        album.platform = this.name
        return realm.create('Album', album);
      }
      return realm.objects("Album").filtered(`id = "${album.id}"`)[0]
    })
  }

  saveContributor(artist, type) {
    //  save contribution object and any child objects to realm
    //  returns realm contribution object
    realm.write(() => {
      if(this._artistExists(artist)) {
        if(type !== null) {
          return realm.create('Contributor', {type: type, artist: artist} );
        }
        return realm.create('Contributor', {artist: artist});
      }
      else {
        throw "Artist must be saved in realm before they can be part of contribution."
      }
    })
  }


  //////////////////////////////////////////////////////////////////////
  ////////// REMOVE FUNCTIONS THAT REMOVE OBJECTS FROM REALM ///////////
  //////////////////////////////////////////////////////////////////////

  removeSong(song, source) {
    // source can be of type realm Library or realm Playlist
    var savedSong = realm.objects("SavedSong").filtered(`song.id = "${song.id}"`)[0]
    var album = savedSong.song.album

    realm.write(() => {
      if(realm.objects("SavedSong").filtered(`song.id = "${song.id}"`).length > 1) {
        // dont delete song obj just saveSong from source
        var savedSong = source.songs.filtered(`song.id = "${song.id}"`)[0]
        realm.delete(savedSong);
      }
      else {
        // delete Contributors
        for(var x=0; x<savedSong.contributors.length; x++) {
          this.removeContributor(savedSong.contributors[x])
        }
        realm.delete(savedSong.song);   // delete Song
        realm.delete(savedSong);        // delete SavedSong

      }
    })
    //  check whether album should be deleted from realm
    if(realm.objects("Song").filtered(`album.id = "${album.id}"`).length < 2) {
      this.removeAlbum(album)
    }
  }

  removeAlbum(album) {
    realm.write(() => {
      let albumObj = realm.objects("Album").filtered(`id = "${album.id}"`)

      // remove contributors
      for(var x=0; x<albumObj.contributors.length; x++) {
        this.removeContributor(albumObj.contributors[x])
      }

      realm.delete(albumObj.images);    // remove album images
      realm.delete(albumObj);           // remove album obj
    })
  }

  removeContributor(contributor) {
    realm.write(() => {
      //  check whether artists should be deleted from realm
      if(realm.objects("Contributor").filtered(`artist.id = "${contributor.artists.id}"`).length < 2) {
        this.removeArtist(contributor.artists)
      }
      realm.delete(contributor)
    })
  }

  removeArtist(artist) {
    realm.write(() => {
      let artistObj = realm.objects("Artist").filtered(`id = "${artist.id}"`)
      realm.delete(artistObj.images);
      realm.delete(artistObj);
    })
  }

  // Batch operations
  removeAllSongs() {
    // not sure if SavedSong must also be deleted or if is already deleted
    let songs = realm.objects('Song').filtered(`platform = "${this.name}"`);
    realm.write(() => {
      for(var x=0; x<songs.length; x++) {
        this.removeSong(songs[x])
      }
    })
  }

  removeAllArtist() {
    // not sure if this is neccessary because removeAllSongs will handle deleting artists
    let artists = realm.objects('Artist').filtered(`platform = "${this.name}"`);
    realm.write(() => {
      for(var x=0; x<artists.length; x++) {
        this.removeArtist(artists[x])
      }
    })
  }

  removeAllAlbums() {
    // not sure if this is neccessary because removeAllSongs will handle deleting albums
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

  saveToLibrary(song) {
    var library = realm.objects('Library').filtered(`platform = "${this.name}"`)["0"]
    this.saveSong(song, library)
  }

  removeFromLibrary(song) {
    var library = realm.objects('Library').filtered(`platform = "${this.name}"`)["0"]
    this.removeSong(song, library)
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
    return this.getLibrary()
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////// PLAYLIST OPERATIONS  ////////////////////////
  //////////////////////////////////////////////////////////////////////

  saveToPlaylist(song, playlistName) {
    var playlist = realm.objects('Playlist').filtered(`name = "${playlistName}"`)["0"]
    this.saveSong(song, playlist)
  }

  removeFromPlaylist(song, playlistName) {
    var playlist = realm.objects('Playlist').filtered(`name = "${playlistName}"`)["0"]
    this.removeSong(song, playlist)
  }

  refreshPlaylist(playlist) {
    // Implement
  }

  resyncPlaylist(playlist) {
    // Implement
  }


  //////////////////////////////////////////////////////////////////////
  /////////////////////////////// UTILS  ///////////////////////////////
  //////////////////////////////////////////////////////////////////////

  displayUnimplementedError(methodName) {
    console.warn(`WARNING: method '${methodName}' has not been implemented for ${this.name}.`)
  }

  cloneArray(array) {
    return JSON.parse(JSON.stringify(array.slice(0)));
  }


  ////////////////////////////////////////////////////////////////
  /////// MUST IMPLEMENT FOLLOWING METHODS IN SUBCLASSES /////////
  ////////////////////////////////////////////////////////////////

  /// Authentication Methods ///

  login() {
    /* implement in subclasses */
    // this.saveToken(token);
    this.displayUnimplementedError("login")
  }

  refreshToken() {
    /* implement in subclasses */
    // this.updateToken(token);
    this.displayUnimplementedError("refreshToken")
  }

  logout() {
     /* implement in subclasses */
    // this.removeToken()
    // this.removeAllSongs();
    this.displayUnimplementedError("logout")
  }

  /// Fetch Content Methods ///

  fetchLibrarySongs() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchLibrarySongs")
  }

  fetchAllPlaylists() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchAllPlaylists")
  }

  fetchPlaylistSongs() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchPlaylistSongs")
  }

  fetchArtistAlbums() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchArtistAlbums")
  }

  fetchArtistTopSongs() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchArtistTopSongs")
  }

  fetchAlbumSongs() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchAlbumSongs")
  }

  fetchNewReleases() {
    /* implement in subclasses */
    this.displayUnimplementedError("fetchNewReleases")
  }

  search(query) {
    /* implement in subclasses */
    this.displayUnimplementedError("search")
  }

  addSongToLibrary(song) {
    /* implement in subclasses */
    this.displayUnimplementedError("addSongToLibrary")
  }

  removeSongFromLibrary(song) {
    /* implement in subclasses */
    this.displayUnimplementedError("removeSongFromLibrary")
  }

  addAlbumToLibrary(album) {
    /* implement in subclasses */
    this.displayUnimplementedError("addAlbumToLibrary")
  }

  removeAlbumFromLibrary(album) {
    /* implement in subclasses */
    this.displayUnimplementedError("removeAlbumFromLibrary")
  }


  /// Player Methods ///

  play() {
    /* implement in subclasses */
    this.displayUnimplementedError("play")
  }

  pause() {
    /* implement in subclasses */
    this.displayUnimplementedError("pause")
  }

  resume() {
    /* implement in subclasses */
    this.displayUnimplementedError("resume")
  }

  getPosition() {
    /* implement in subclasses */
    this.displayUnimplementedError("getPosition")
  }

  getDuration() {
    /* implement in subclasses */
    this.displayUnimplementedError("getDuration")
  }

  seek() {
    /* implement in subclasses */
    this.displayUnimplementedError("seek")
  }

}
