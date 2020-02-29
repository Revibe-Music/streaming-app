import realm from './../../realm';
import Realm from 'realm'
import { uniqBy, values } from 'lodash'
import SavedSong from './SavedSong';

export default class Library extends Realm.Object {

  static schema = {
    name: "Library",
    properties: {
      platform: "string",
      songs: "SavedSong[]",
    }
  }

  get allSongs() {
    // need to do json stuff so there is no reference to realm
    var sortedSongs = this.songs.sorted("dateSaved",true)
    return JSON.parse(JSON.stringify(sortedSongs.map(x => x.song)))
  }

  get allAlbums() {
    if(this.platform !== "YouTube") {
      var sortedAlbums = realm.objects('Album').filtered(`platform = "${this.platform}" SORT(name ASC)`)
      return JSON.parse(JSON.stringify(sortedAlbums.map(x => x)))
    }
    return []
  }

  get allArtists() {
    var sortedArtists = realm.objects('Artist').filtered(`platform = "${this.platform}" SORT(name ASC)`)
    return JSON.parse(JSON.stringify(sortedArtists.map(x => x)))
  }

  _formatQuery(query, type) {
    if(type==="Songs") {
      return JSON.parse(JSON.stringify(query.map(x => x.song)))
    }
    else {
      return JSON.parse(JSON.stringify(query.map(x => x)))
    }
  }

  filter(type, text) {
      var results = []
      if(type === "Songs") {
        results = results.concat(this._formatQuery(this.songs.filtered(`song.name BEGINSWITH[c] "${text}"`), type))
        results = results.concat(this._formatQuery(this.songs.filtered(`song.name CONTAINS[c] "${text}"`), type))
        results = results.concat(this._formatQuery(this.songs.filtered(`song.contributors.artist.name BEGINSWITH[c] "${text}"`), type))
        results = results.concat(this._formatQuery(this.songs.filtered(`song.contributors.artist.name CONTAINS[c] "${text}"`), type))
        results = results.concat(this._formatQuery(this.songs.filtered(`song.album.name BEGINSWITH[c] "${text}"`), type))
        results = results.concat(this._formatQuery(this.songs.filtered(`song.album.name CONTAINS[c] "${text}"`), type))
      }
      else if(type === "Albums"){
        var allAlbums = realm.objects('Album').filtered(`platform = "${this.platform}"`)
        results = results.concat(this._formatQuery(allAlbums.filtered(`name BEGINSWITH[c] "${text}"`)))
        results = results.concat(this._formatQuery(allAlbums.filtered(`name CONTAINS[c] "${text}"`)))
        results = results.concat(this._formatQuery(allAlbums.filtered(`contributors.artist.name BEGINSWITH[c] "${text}"`)))
        results = results.concat(this._formatQuery(allAlbums.filtered(`contributors.artist.name CONTAINS[c] "${text}"`)))
      }
      else {
        var allAlbums = realm.objects('Artist').filtered(`platform = "${this.platform}"`)
        results = results.concat(this._formatQuery(allAlbums.filtered(`name BEGINSWITH[c] "${text}"`)))
        results = results.concat(this._formatQuery(allAlbums.filtered(`name CONTAINS[c] "${text}"`)))
      }
      return uniqBy(results, "id")
  }

  songIsSaved(song) {
    //  return whether a matching song has already been saved to specific platform library
    return this.songs.filtered(`song.id = "${song.id}"`).length > 0
  }

  addSong(song) {
    var savedSongs = new SavedSong()
    var newSavedSong = savedSongs.create(song)
    realm.write(() => {
      this.songs.push(newSavedSong)
    })
  }

  removeSong(id) {
    //must be SavedSong object
    var savedSong = this.songs.filtered(`song.id = "${id}"`)["0"]
    savedSong.delete()
  }

  deleteAllSongs() {
    // delete Contributors
    while(this.songs.length > 0) {
      // const song = realm.objects("SavedSong").filtered(`id = "${this.songs[0].id}"`)[0]
      this.songs[0].delete()
    }
  }

  delete() {
    this.deleteAllSongs()
    realm.write(() => {
      realm.delete(this);
    })
  }
}
