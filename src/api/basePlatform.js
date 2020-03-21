import realm from './../realm/realm';
import Token from './../realm/v1/models/Token'
import Song from './../realm/v1/models/Song'
import Album from './../realm/v1/models/Album'
import Artist from './../realm/v1/models/Artist'
import Playlist from './../realm/v1/models/Playlist'
import SavedSong from './../realm/v1/models/SavedSong'
import Contributor from './../realm/v1/models/Contributor'
import Image from './../realm/v1/models/Image'
import _ from "lodash";


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

  get playlists() {
    //  return songs from specific platform library
    return realm.objects('Playlist')
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

  getSavedArtistSongs(id) {
    return this.cloneArray(realm.objects("Song").filtered(`contributors.artist.id = "${id}"`));
  }

  getSavedAlbumSongs(id) {
    return this.cloneArray(realm.objects("Song").filtered(`album.id = "${id}"`));
  }

  getSavedPlaylistSongs(name) {
    var playlist = JSON.parse(JSON.stringify(realm.objects("Playlist").filtered(`name = "${name}"`)[0]))
    if(Object.keys(playlist.songs).length > 0) {
      var songs = JSON.parse(JSON.stringify(playlist.songs)).map(x => x.song)
      return this.cloneArray(songs);
    }
    return []
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

  filterData(type, text) {
    var results = []
    if(text) {
      return this.library.filter(type, text)
    }
    else {
      if(type === "Artists") {
        return this.library.allArtists
      }
      else if(type === "Albums") {
        return this.library.allAlbums
      }
      else {
        return this.library.allSongs
      }
    }

    return results
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
  ////////////////////////// SONG OPERATIONS  //////////////////////////
  //////////////////////////////////////////////////////////////////////

  updateLastListenTime(song) {
    const songs = realm.objects('Song').filtered(`id = "${song.id}"`)
    realm.write(() => {
      if(songs.length > 0) {
        var songObj = realm.objects('Song').filtered(`id = "${song.id}"`)[0]
      }
      else {
        var songObj = realm.create('Song', song, true)
      }
      songObj.lastListenTime = new Date()
    })
  }

  getRecentlyPlayed() {
    var recentlyPlayedSongs = realm.objects('Song').filtered(`lastListenTime != null`).sorted('lastListenTime', "ASC")
    return this.cloneArray(recentlyPlayedSongs.slice(0,50))
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
