import realm from './../../realm';
import SavedSong from './SavedSong';

export default class Playlist {

  static schema = {
    name: "Playlist",
    properties: {
      name: "string",
      id: "string",
      images: "Image[]",
      songs: "SavedSong[]",
    }
  }

  create(name, id) {
    console.log("Creating playlist");
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Playlist', {name: name, id: id});
    })
    return newObject.object
  }

  addSong(song) {
    var savedSongs = new SavedSong()
    var newSavedSong = savedSongs.create(song)
    realm.write(() => {
      this.songs.push(newSavedSong)
    })
  }

  removeSong(song) {
    //must be SavedSong object
    //must be SavedSong object
    var savedSong = this.songs.filter(x => x.song.id===song.id)[0]
    savedSong.delete()
  }

  getAllSongs() {
    // returns songs in order of most recently saved
    return this.songs.map(function(x) {return x.song})
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
    const images = this.images
    realm.write(() => {
      realm.delete(this);
    })
    // delete images
    for(var x=0; x<images.length; x++) {
      images[x].delete()
    }
  }
}
