import Realm from 'realm'
import { uniqBy } from 'lodash'

import realm from './../../realm';



export default class Song extends Realm.Object {

  static schema = {
    name: "Song",
    primaryKey: "id",
    properties: {
      platform: "string",
      name: "string",
      id: "string", // this may be the same as uri for youtube
      uri: "string",
      album: "Album",
      contributors: "Contributor[]",
      duration: "int?",
    }
  }

  get artists() {
    var artists = []
    var numContributors = Object.keys(this.contributors).length
    for(var x=0; x<numContributors; x++) {
      artists.push(this.contributors[x].artist)
    }
    return uniqBy(artists, 'id');
  }

  _exists(song) {
    //  return whether a matching song already exists in realm
    return realm.objects('Song').filtered(`platform = "${song.name}" AND id="${song.id}"`).length > 0
  }

  create(song) {
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Song', song , true);
    })
    return newObject.object
  }

  delete() {
    if(realm.objects("Song").filtered(`album.id = "${this.album.id}"`).length < 2) {
      const album = realm.objects("Album").filtered(`id = "${this.album.id}"`)[0]
      album.delete()
    }

    // delete Contributors
    while(this.contributors.length > 0) {
      this.contributors[0].delete()
    }

    realm.write(() => {
      // delete song
      realm.delete(this);
    })
  }
}
