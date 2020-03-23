import realm from './../../realm';

export default class SavedSong {

  static schema = {
    name: "SavedSong",
    properties: {
      song: "Song",
      dateSaved: "date",
    }
  }

  _validate(song) {
    // structure song and all nested objects to put in realm format
    if(!song.dateSaved) {
      song.dateSaved = new Date().toLocaleString()
    }
    if(!Array.isArray(song.album.images)) {
      song.album.images = Object.keys(song.album.images).map(x => song.album.images[x])
    }
    if(!Array.isArray(song.album.contributors)) {
      song.album.contributors = Object.keys(song.album.contributors).map(x => song.album.contributors[x])
    }
    if(!Array.isArray(song.contributors)) {
      song.contributors = Object.keys(song.contributors).map(x => song.contributors[x])
    }
    for(var y=0; y<song.album.contributors.length; y++) {
      const index = y
      if(!Array.isArray(song.album.contributors[index].artist.images)) {
        song.album.contributors[index].artist.images = Object.keys(song.album.contributors[index].artist.images).map(x => song.album.contributors[index].artist.images[x])
      }
    }
    for(var y=0; y<song.contributors.length; y++) {
      const index = y
      if(!Array.isArray(song.contributors[index].artist.images)) {
        song.contributors[index].artist.images = Object.keys(song.contributors[index].artist.images).map(x => song.contributors[index].artist.images[x])
      }
    }
    return song
  }

  prepare(song) {
    var formattedSong = this._validate(song)
    return {song: formattedSong, dateSaved: song.dateSaved}
  }

  create(song) {
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('SavedSong', this.prepare(song), true);
    })
    return newObject.object
  }

  delete() {
    if(realm.objects("SavedSong").filtered(`song.id = "${this.song.id}"`).length < 2) {
      // only one SavedSong object refers to this song object so delete the song object
      var song = realm.objects("Song").filtered(`id = "${this.song.id}"`)[0]
      song.delete()
    }
    realm.write(() => {
      realm.delete(this);
    })







  }
}
