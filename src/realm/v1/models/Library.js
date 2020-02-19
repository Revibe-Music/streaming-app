import realm from './../../realm';
import Realm from 'realm'
import { uniqBy } from 'lodash'
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
    return this.songs.map(x => x.song)
  }

  get allAlbums() {
    return uniqBy(this.songs.map(x => x.song.album), 'id');
  }

  get allArtists() {
    var artists = []
    var songs = this.allSongs
    for(var x=0; x<songs.length; x++) {
      artists = artists.concat(songs[x].artists)
    }
    return uniqBy(artists, 'id');
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

  filter(text, type) {


  }

  deleteAllSongs() {
    for(var x=0; x<this.songs.length; x++) {
      this.songs[x].delete()
    }
  }

  delete() {
    this.deleteAllSongs()
    realm.write(() => {
      realm.delete(this);
    })
  }
}
