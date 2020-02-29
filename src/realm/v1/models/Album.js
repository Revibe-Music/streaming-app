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
    var size=100000
    var index = 0
    for(var x=0; x<this.images.length; x++) {
      if(this.images[x].height < size) {
        size = this.images[x].height
        index = x
      }
    }
    return this.images[index].url
  }

  get mediumImage() {
    if(Object.keys(this.images).length > 0) {
      return this.images[Math.round((this.images.length - 1) / 2)].url;
    }
    return null
  }

  get largeImage() {
    var size=0
    var index = 0
    for(var x=0; x<this.images.length; x++) {
      if(this.images[x].height > size) {
        size = this.images[x].height
        index = x
      }
    }
    return this.images[index].url
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
