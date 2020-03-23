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

  batchAddSongs(songs) {
    realm.write(() => {
      for(var x=0; x<songs.length; x++) {
        var savedSongs = new SavedSong()
        var preparedSong = savedSongs.prepare(songs[x])
        var newSavedSong = realm.create('SavedSong', preparedSong, true);
        this.songs.push(newSavedSong)
      }
    })
  }

  removeSong(id) {
    //must be SavedSong object
    var savedSong = this.songs.filtered(`song.id = "${id}"`)["0"]
    savedSong.delete()
  }

  deleteAllSongs() {
    // delete Contributors
    const songs = realm.objects("Song").filtered(`platform = "${this.platform}"`)
    const artists = realm.objects("Artist").filtered(`platform = "${this.platform}"`)
    const albums = realm.objects("Album").filtered(`platform = "${this.platform}"`)

    var contributors = songs.map(song => JSON.parse(JSON.stringify(song.contributors.slice())))
    contributors = contributors.concat(albums.map(album => JSON.parse(JSON.stringify(album.contributors.slice()))))

    var images = artists.map(artist => JSON.parse(JSON.stringify(artist.images.slice())))
    images = images.concat(albums.map(album => JSON.parse(JSON.stringify(album.images.slice()))))

    var allImages = []
    for(var x=0; x<images.length; x++) {
      for(var y=0; y<images[x].length; y++) {
        allImages.push(images[x][y])
      }
    }

    var allContributors = []
    for(var x=0; x<contributors.length; x++) {
      for(var y=0; y<contributors[x].length; y++) {
        allContributors.push(contributors[x][y])
      }
    }

    realm.write(() => {
      for(var x=0; x<allImages.length; x++) {
        let image = realm.objects("Image").filtered(`url = "${allImages[x].url}"`)[0]
        if(image) {
          realm.delete(image);
        }
      }
      for(var x=0; x<allContributors.length; x++) {
        let contributor = realm.objects("Contributor").filtered(`id = "${allContributors[x].id}"`)[0]
        realm.delete(contributor);
      }
      realm.delete(songs);
      realm.delete(albums);
      realm.delete(artists);
      realm.delete(this.songs);
    })
  }

  delete() {
    this.deleteAllSongs()
    realm.write(() => {
      realm.delete(this);
    })
  }
}
