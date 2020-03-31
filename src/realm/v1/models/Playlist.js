import realm from './../../realm';
import { uniqBy } from 'lodash'
import SavedSong from './SavedSong';

export default class Playlist extends Realm.Object {

  static schema = {
    name: "Playlist",
    properties: {
      name: "string",
      id: "string",
      images: "Image[]",
      songs: "SavedSong[]",
    }
  }

  get allSongs() {
    return this.songs.sorted("dateSaved",true)
  }

  get smallImage() {
    var songs = JSON.parse(JSON.stringify(this.allSongs.map(x => x.song)))
    var albums = uniqBy(songs.map(x => x.album), "id")
    if(albums.length >= 4) {
      var albumArts = albums.slice(0,4)
      var images = []
      for(var x=0; x<albumArts.length; x++) {
        albumArts[x].images = Object.keys(albumArts[x].images).map(j => albumArts[x].images[j])
        var size=100000
        var index = 0
        for(var y=0; y<albumArts[x].images.length; y++) {
          if(albumArts[x].images[y].height < size) {
            size = albumArts[x].images[y].height
            index = y
          }
        }
        images.push({uri: albumArts[x].images[index].url})
      }
      return images
    }
    else if (albums.length > 0) {
      albums[0].images = Object.keys(albums[0].images).map(x => albums[0].images[x])
      if(albums[0].images.length > 0) {
        var size=0
        var index = 0
        for(var x=0; x<albums[0].images.length; x++) {
          if(albums[0].images[x].height < 1000) {
            if(albums[0].images[x].height > size) {
              size = albums[0].images[x].height
              index = x
            }
          }
        }
        return {uri: albums[0].images[index].url}
      }
    }
    return require("./../../../../assets/albumArtPlaceholder.png")
  }

  get regularImage() {
    var songs = JSON.parse(JSON.stringify(this.allSongs.map(x => x.song)))
    var albums = songs.map(x => x.album)
    var albums = uniqBy(albums,'id')
    if(albums.length >= 4) {
      var albumArts = albums.slice(0,4)
      var images = []
      for(var x=0; x<albumArts.length; x++) {
        albumArts[x].images = Object.keys(albumArts[x].images).map(j => albumArts[x].images[j])
        var size=100000
        var index = 0
        for(var y=0; y<albumArts[x].images.length; y++) {
          if(albumArts[x].images[y].height < size) {
            if(albumArts[x].images[y].height > 64) {
              size = albumArts[x].images[y].height
              index = y
            }
          }
        }
        images.push({uri: albumArts[x].images[index].url})
      }
      return images
    }
    else if (albums.length > 0) {
      albums[0].images = Object.keys(albums[0].images).map(x => albums[0].images[x])
      if(albums[0].images.length > 0) {
        var size=0
        var index = 0
        for(var x=0; x<albums[0].images.length; x++) {
          if(albums[0].images[x].height < 1000) {
            if(albums[0].images[x].height > size) {
              size = albums[0].images[x].height
              index = x
            }
          }
        }
        return {uri: albums[0].images[index].url}
      }
    }
    return require("./../../../../assets/albumArtPlaceholder.png")
  }

  create(name, id) {
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Playlist', {name: name, id: id});
    })
    return newObject.object
  }

  songIsSaved(song) {
    //  return whether a matching song has already been saved to specific platform library
    return this.songs.filtered(`song.id = "${song.id}"`).length > 0
  }

  addSong(song) {
    var newSavedSong = SavedSong.create(song)
    realm.write(() => {
      this.songs.push(newSavedSong)
    })
  }

  batchAddSongs(songs) {
    realm.write(() => {
      for(var x=0; x<songs.length; x++) {
        var preparedSong = SavedSong.prepare(songs[x])
        var newSavedSong = realm.create('SavedSong', preparedSong, true);
        this.songs.push(newSavedSong)
      }
    })
  }

  removeSong(id) {
    //must be SavedSong object
    var savedSong = this.songs.filtered(`song.id = "${id}"`)["0"]
    // realm.write(() => {
    //   this.songs = this.songs.filter(x => x.song.id !== savedSong.id)
    // })

    savedSong.delete()
  }

  getAllSongs() {
    // returns songs in order of most recently saved
    return this.songs.map(function(x) {return x.song})
  }

  filter(text) {

  }

  deleteAllSongs() {
    // delete Contributors

    const songs = this.songs.map(x => x.song)

    realm.write(() => {
      for(var x=0; x<songs.length; x++) {
        if(realm.objects("SavedSong").filtered(`song.id = "${songs[x].id}"`).length < 2) {
          // only one SavedSong object refers to this song object so delete the song object
          var song = realm.objects("Song").filtered(`id = "${songs[x].id}"`)[0]
          if(realm.objects("Song").filtered(`album.id = "${song.album.id}"`).length < 2) {
            const album = realm.objects("Album").filtered(`id = "${song.album.id}"`)[0]
            // delete album images
            while(album.images.length > 0) {
              realm.delete(album.images[0])
            }
            // delete album contributors
            while(album.contributors.length > 0) {
              if(realm.objects("Contributor").filtered(`artist.id = "${album.contributors[0].artist.id}"`).length < 2) {
                // only one Contributor object refers to this artist object so delete the artist object
                var artist = realm.objects("Artist").filtered(`id = "${album.contributors[0].artist.id}"`)[0]
                while(artist.images.length > 0) {
                  realm.delete(artist.images[0])
                }
                realm.delete(artist)
              }
              realm.delete(album.contributors[0])
            }
            realm.delete(album)

            // delete song Contributors
            while(song.contributors.length > 0) {
              if(realm.objects("Contributor").filtered(`artist.id = "${song.contributors[0].artist.id}"`).length < 2) {
                // only one Contributor object refers to this artist object so delete the artist object
                var artist = realm.objects("Artist").filtered(`id = "${song.contributors[0].artist.id}"`)[0]
                while(artist.images.length > 0) {
                  realm.delete(artist.images[0])
                }
                realm.delete(artist)
              }
              realm.delete(song.contributors[0])
            }
          }
          realm.delete(song)
        }
      }
      realm.delete(this.songs)
    })
  }

  delete() {
    this.deleteAllSongs()
    realm.write(() => {
      realm.delete(this);
    })
  }

}
