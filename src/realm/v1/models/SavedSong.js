import realm from './../../realm';

export default class SavedSong {

  static schema = {
    name: "SavedSong",
    properties: {
      song: "Song",
      dateSaved: "date",
    }
  }

  create(song) {
    if(!song.dateSaved) {
      song.dateSaved = new Date().toLocaleString()
    }
    var savedSong = {song: song, dateSaved: song.dateSaved}
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('SavedSong', savedSong, true);
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
      console.log('DELETING SAVED SONG');
      realm.delete(this);
    })







  }
}
