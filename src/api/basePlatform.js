import realm from './../realm/realm';
import Token from './../realm/v1/models/Token'
import Song from './../realm/v1/models/Song'
import Album from './../realm/v1/models/Album'
import Artist from './../realm/v1/models/Artist'
import Playlist from './../realm/v1/models/Playlist'
import SavedSong from './../realm/v1/models/SavedSong'
import Contributor from './../realm/v1/models/Contributor'
import Image from './../realm/v1/models/Image'

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

  _generateExpiration(hoursAhead) {
    var expiration = new Date();
    expiration.setHours( expiration.getHours() + hoursAhead )
    expiration = expiration.getTime() / 1000
    return expiration
  }

  saveToken(token) {
    // save token to realm
    var tokens = new Token()
    tokens.create(token)
  }


  //////////////////////////////////////////////////////////////////////
  /////////// GETTER FUNCTIONS THAT RETURN PLATFORM OBJECTS ////////////
  //////////////////////////////////////////////////////////////////////

  get library() {
    //  return songs from specific platform library
    return realm.objects('Library').filtered(`platform = "${this.name}"`)["0"]
  }

  get artists() {
    //  return artist from specific platform
    return realm.objects('Library').filtered(`platform = "${this.name}"`)["0"].allArtists
  }

  get albums() {
    //  return artist from specific platform
    return realm.objects('Library').filtered(`platform = "${this.name}"`)["0"].allAlbums
  }

  getPlaylist(playlistName) {
    //  return songs from specific playlist
    return this.cloneArray(realm.objects('Playlist').filtered(`name = "${playlistName}"`)["0"].songs.sorted("dateSaved",true))
  }

  getSavedArtistAlbums(id) {
    return this.cloneArray(realm.objects("Album").filtered(`contributors.artist.id = "${id}"`));
  }

  getSavedArtistTracks(id) {
    return this.cloneArray(realm.objects("Song").filtered(`artist.id = "${id}"`));
  }

  getSavedAlbumTracks(id) {
    return this.cloneArray(realm.objects("Song").filtered(`album.id = "${id}"`));
  }


  //////////////////////////////////////////////////////////////////////
  /////// HELPER FUNCTIONS THAT CHECK IF OBJECT EXISTS IN REALM ////////
  //////////////////////////////////////////////////////////////////////

  _songExists(song) {
    //  return whether a matching song already exists in realm
    return realm.objects('Song').filtered(`platform = "${this.name}" AND id="${song.id}"`).length > 0
  }

  _librarySongExists(song) {
    //  return whether a matching song has already been saved to specific platform library
    return this.library.filter(x => x.id === song.id).length > 0
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
    return this.artists().filter(x => x.id === artist.id).length > 0
  }

  _albumExists(album) {
    //  return whether a matching album already exists in realm
    return this.albums().filter(x => x.id === album.id).length > 0
  }

  //////////////////////////////////////////////////////////////////////
  ///////////// SAVE FUNCTIONS THAT SAVE OBJECTS TO REALM //////////////
  //////////////////////////////////////////////////////////////////////
  saveSong(song, source) {
    //  source can be "library" or name of playlist

    var savedsong = source.addSong(song)

    // if(!this._songExists(song)) {
    //   var songContributors = []
    //   for(var x=0; x<song.contributors.length; x++) {
    //     var artist = this.saveArtist(song.contributors[x].artist)
    //     var type = song.contributors[x].type ? song.contributors[x].type : null
    //     songContributors.push(this.saveContributor(artist, type))
    //   }
    //   var album = this.saveAlbum(song.album)
    //   var formattedSong = {
    //     id: song.id,
    //     uri: song.uri,
    //     name: song.name,
    //     album: album,
    //     contributors: songContributors,
    //     duration: song.duration,
    //     platform: this.name,
    //   }
    //   realm.write(() => {
    //     var songObj = realm.create('Song', formattedSong);
    //     var savedSong = realm.create('SavedSong', {song: songObj, dateSaved: new Date().toLocaleString()});
    //     source.songs.push(savedSong)
    //   })
    // }
    // else if(source.songs.filtered(`song.id = "${song.id}"`).length < 1) {
    //   realm.write(() => {
    //     var songObj = realm.objects('Song').filtered(`id = "${song.id}"`)[0]
    //     var savedSong = realm.create('SavedSong', {song: songObj, dateSaved: new Date().toLocaleString()});
    //     source.songs.push(savedSong)
    //   })
    // }
  }

  saveArtist(artist) {
    //  save artist object and any child objects to realm
    //  returns realm artist object
    var artistObj
    if(!this._artistExists(artist)) {
      artist.platform = this.name
      realm.write(() => {
        artistObj = realm.create('Artist', artist);
      })
    }
    else {
      artistObj = realm.objects("Artist").filtered(`id = "${artist.id}"`)[0]
    }
    return artistObj
  }

  saveAlbum(album) {
    //  save album object and any child objects to realm
    //  returns realm album object
    var albumObj
    if(!this._albumExists(album)) {
      var albumContributors = []
      for(var x=0; x<album.contributors.length; x++) {
        var artist = this.saveArtist(album.contributors[x].artist)
        var type = album.contributors[x].type ? album.contributors[x].type : null
        albumContributors.push(this.saveContributor(artist, type))
      }
      album.contributors = albumContributors
      album.platform = this.name
      realm.write(() => {
        albumObj = realm.create('Album', album);
      })
    }
    else {
      albumObj = realm.objects("Album").filtered(`id = "${album.id}"`)[0]
    }
    return albumObj
  }

  saveContributor(artist, type) {
    //  save contribution object and any child objects to realm
    //  returns realm contribution object
    var contributorObj
    if(!this._artistExists(artist)) {
      artist = this.saveArtist(artist)
    }
    realm.write(() => {
      if(type !== null) {
        contributorObj = realm.create('Contributor', {type: type, artist: artist} );
      }
      contributorObj = realm.create('Contributor', {artist: artist});
    })
    return contributorObj

  }


  //////////////////////////////////////////////////////////////////////
  ////////// REMOVE FUNCTIONS THAT REMOVE OBJECTS FROM REALM ///////////
  //////////////////////////////////////////////////////////////////////

  removeSong(song, source) {
    // source can be of type realm Library or realm Playlist


    var savedSong = realm.objects("SavedSong").filtered(`song.id = "${song.id}"`)[0]
    var album = savedSong.song.album
    if(realm.objects("SavedSong").filtered(`song.id = "${song.id}"`).length > 1) {
      // dont delete song obj just saveSong from source
      var savedSong = source.songs.filtered(`song.id = "${song.id}"`)[0]
      realm.write(() => {
        realm.delete(savedSong);
      })
    }
    else {
      // delete Contributors
      for(var x=0; x<savedSong.contributors.length; x++) {
        this.removeContributor(savedSong.contributors[x])
      }
      realm.write(() => {
        realm.delete(savedSong.song);   // delete Song
        realm.delete(savedSong);        // delete SavedSong
      })
    }
    //  check whether album should be deleted from realm
    if(realm.objects("Song").filtered(`album.id = "${album.id}"`).length < 2) {
      this.removeAlbum(album)
    }
  }

  removeAlbum(album) {
    let albumObj = realm.objects("Album").filtered(`id = "${album.id}"`)
    // remove contributors
    for(var x=0; x<albumObj.contributors.length; x++) {
      this.removeContributor(albumObj.contributors[x])
    }
    realm.write(() => {
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
    for(var x=0; x<songs.length; x++) {
      this.removeSong(songs[x])
    }
  }

  removeAllArtist() {
    // not sure if this is neccessary because removeAllSongs will handle deleting artists
    let artists = realm.objects('Artist').filtered(`platform = "${this.name}"`);
    for(var x=0; x<artists.length; x++) {
      this.removeArtist(artists[x])
    }
  }

  removeAllAlbums() {
    // not sure if this is neccessary because removeAllSongs will handle deleting albums
    let albums = realm.objects('Albums').filtered(`platform = "${this.name}"`);
    for(var x=0; x<albums.length; x++) {
      this.removeAlbums(albums[x])
    }
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////// LIBRARY OPERATIONS  /////////////////////////
  //////////////////////////////////////////////////////////////////////

  saveToLibrary(song) {
    var library = realm.objects('Library').filtered(`platform = "${this.name}"`)["0"]
    library.addSong(song)
  }

  removeFromLibrary(id) {
    var library = realm.objects('Library').filtered(`platform = "${this.name}"`)["0"]
    library.removeSong(id)
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
      var savedSongIds = this.library.map(function (e) { return e.id; });

      if(JSON.stringify(recentSongIds) !== JSON.stringify(savedSongIds) ) {
        var recentSongIds = recentSongs.map(function (e) { return e.id; });
        var removedSongs = this.library.slice(0,recentSongIds.length).filter(e => !recentSongIds.includes(e.id) )
        for(var x=0; x<removedSongs.length; x++) {
          let songObj = realm.objects('Song').filtered(`id = "${removedSongs[x].id}"`)
          this.removeSongFromLibrary(removedSongs[x])
        }
      }

      if(this.library.length != totalSongs) {
        this.resyncLibrary()
      }
    })
    return this.library
  }

  resyncLibrary(songs) {
    this.removeAllSongs()
    realm.write(async () => {
      for(x=0; x<songs.length; x++) {
        this.saveSong(songs[x])
      }
    })
    return this.library
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
