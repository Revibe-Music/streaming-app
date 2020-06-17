import realm from './../../realm';
import Realm from 'realm'
import { uniqBy, values, flatMapDeep } from 'lodash'
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
      var ids = uniqBy(this.songs.map(x => x.song.album.id))
      var query = ids.map((id) =>`id = "${id}"`).join(' OR ')
      const result = realm.objects('Album').filtered(`${query} SORT(name ASC)`, ...ids);
      return result
    }
    return []
  }

  get allArtists() {
    var artistIds = flatMapDeep(this.songs, function(savedSong) {
      return savedSong.song.contributors.map(contrib => contrib.artist.id).concat(savedSong.song.album.contributors.map(contrib => contrib.artist.id))
    })
    var artistIds = uniqBy(artistIds)
    if(artistIds.length > 0) {
      var query = artistIds.map((id) =>`id = "${id}"`).join(' OR ')
      const result = realm.objects('Artist').filtered(`${query} SORT(name ASC)`, ...artistIds);
      return result
    }
    return []
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
          results = this._formatQuery(this.allSongs.filtered(queryString))
        }
      }
      else if(type === "Albums"){
        if(this.platform === "YouTube") {
          return []
        }
        // var allAlbums = realm.objects('Album').filtered(`platform = "${this.platform}"`)
        if(!text) {
          return this._formatQuery(this.allAlbums)
        }
        else {
          queryString = `name BEGINSWITH[c] "${text}" OR name CONTAINS[c] "${text}" OR \
                         contributors.artist.name BEGINSWITH[c] "${text}" OR contributors.artist.name CONTAINS[c] "${text}"`
          results = this._formatQuery(this.allAlbums.filtered(queryString))
        }
      }
      else {
        // var allArtists = realm.objects('Artist').filtered(`platform = "${this.platform}"`)
        if(!text) {
          return this._formatQuery(this.allArtists)
        }
        else {
          queryString = `name BEGINSWITH[c] "${text}" OR name CONTAINS[c] "${text}"`
          results = this._formatQuery(this.allArtists.filtered(queryString))
        }
      }
      return results
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
    realm.write(() => {
      this.songs = this.songs.filter(x => x.song.id !== savedSong.id)
    })
    savedSong.delete()
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

  // deleteAllSongs() {
  //   // delete Contributors
  //   const songs = realm.objects("Song").filtered(`platform = "${this.platform}"`)
  //   const artists = realm.objects("Artist").filtered(`platform = "${this.platform}"`)
  //   const albums = realm.objects("Album").filtered(`platform = "${this.platform}"`)
  //
  //   var contributors = songs.map(song => JSON.parse(JSON.stringify(song.contributors.slice())))
  //   contributors = contributors.concat(albums.map(album => JSON.parse(JSON.stringify(album.contributors.slice()))))
  //
  //   var images = artists.map(artist => JSON.parse(JSON.stringify(artist.images.slice())))
  //   images = images.concat(albums.map(album => JSON.parse(JSON.stringify(album.images.slice()))))
  //
  //   var allImages = []
  //   for(var x=0; x<images.length; x++) {
  //     for(var y=0; y<images[x].length; y++) {
  //       allImages.push(images[x][y])
  //     }
  //   }
  //
  //   var allContributors = []
  //   for(var x=0; x<contributors.length; x++) {
  //     for(var y=0; y<contributors[x].length; y++) {
  //       allContributors.push(contributors[x][y])
  //     }
  //   }
  //
  //   realm.write(() => {
  //     for(var x=0; x<allImages.length; x++) {
  //       let image = realm.objects("Image").filtered(`url = "${allImages[x].url}"`)[0]
  //       if(image) {
  //         realm.delete(image);
  //       }
  //     }
  //     for(var x=0; x<allContributors.length; x++) {
  //       let contributor = realm.objects("Contributor").filtered(`id = "${allContributors[x].id}"`)[0]
  //       realm.delete(contributor);
  //     }
  //     realm.delete(songs);
  //     realm.delete(albums);
  //     realm.delete(artists);
  //     realm.delete(this.songs);
  //   })
  // }

  delete() {
    this.deleteAllSongs()
    realm.write(() => {
      realm.delete(this);
    })
  }
}
