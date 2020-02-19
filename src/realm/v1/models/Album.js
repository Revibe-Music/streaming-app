import realm from './../../realm';
import Realm from 'realm'

export default class Album extends Realm.Object {

  static schema = {
    name: "Album",
    primaryKey: "id",
    properties: {
      platform: "string",
      type: "string",
      name: "string",
      id: "string", // could be artist of channel
      uri: "string",
      images: "Image[]",
      contributors: "Contributor[]",
      uploaded_date: "date"
    }
  }

  get smallImage() {
    if(Object.keys(this.images).length > 0) {
      return this.images["1"].url
    }
    return null
  }

  get mediumImage() {
    if(Object.keys(this.images).length > 0) {
      return this.images["2"].url
    }
    return null
  }

  get largeImage() {
    if(Object.keys(this.images).length > 0) {
      return this.images["3"].url
    }
    return null
  }

  _exists(album) {
    //  return whether a matching song already exists in realm
    return realm.objects('Album').filtered(`platform = "${album.name}" AND id="${album.id}"`).length > 0
  }

  create(album) {
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Album', album , true);
    })
    return newObject.object
  }

  delete() {
    // delete images
    while(this.images.length > 0) {
      this.images[0].delete()
    }
    // delete contributors
    while(this.contributors.length > 0) {
      this.contributors[0].delete()
    }

    // delete album
    realm.write(() => {
      realm.delete(this);
    })


  }
}
