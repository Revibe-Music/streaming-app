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
    return this.songs.sorted("dateSaved",true)
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

  _formatQuery(query) {
    return JSON.parse(JSON.stringify(query.map(x => x)))
  }


  filter(type, text) {
      var results = []
      if(type === "Songs") {
        if(!text) {
          return this._formatQuery(this.allSongs)
        }
        else {
          queryString = `song.name BEGINSWITH[c] "${text}" OR song.name CONTAINS[c] "${text}" OR \
                         song.contributors.artist.name BEGINSWITH[c] "${text}" OR song.contributors.artist.name CONTAINS[c] "${text}" OR \
                         song.album.name BEGINSWITH[c] "${text}" OR song.album.name CONTAINS[c] "${text}"`
          results = this._formatQuery(this.songs.filtered(queryString))
        }
      }
      else if(type === "Albums"){
        if(this.platform === "YouTube") {
          return []
        }
        var allAlbums = realm.objects('Album').filtered(`platform = "${this.platform}"`)
        if(!text) {
          return this._formatQuery(allAlbums)
        }
        else {
          queryString = `name BEGINSWITH[c] "${text}" OR name CONTAINS[c] "${text}" OR \
                         contributors.artist.name BEGINSWITH[c] "${text}" OR contributors.artist.name CONTAINS[c] "${text}"`
          results = this._formatQuery(allAlbums.filtered(queryString))
        }
      }
      else {
        var allArtists = realm.objects('Artist').filtered(`platform = "${this.platform}"`)
        if(!text) {
          return this._formatQuery(allArtists)
        }
        else {
          queryString = `name BEGINSWITH[c] "${text}" OR name CONTAINS[c] "${text}"`
          results = this._formatQuery(allArtists.filtered(queryString))
        }
      }
      return results
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
