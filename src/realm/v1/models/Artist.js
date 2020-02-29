import realm from './../../realm';

export default class Artist {

  static schema = {
    name: "Artist",
    primaryKey: "id",
    properties: {
      platform: "string",
      name: "string",
      id: "string", // could be artist of channel
      uri: "string",
      images: "Image[]",
    }
  }

  get smallImage() {
    if(Object.keys(this.images).length > 0) {
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
    return null
  }

  get mediumImage() {
    if(Object.keys(this.images).length > 0) {
      return this.images[Math.round((this.images.length - 1) / 2)].url;
    }
    return null
  }

  get largeImage() {
    if(Object.keys(this.images).length > 0) {
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
    return null
  }

  _exists(artist) {
    //  return whether a matching song already exists in realm
    return realm.objects('Artist').filtered(`platform = "${artist.name}" AND id="${artist.id}"`).length > 0
  }

  create(artist) {
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Artist', artist , true);
    })
    return newObject.object
  }

  delete() {
    // delete imgages
    while(this.images.length > 0) {
      this.images[0].delete()
    }

    // delete artist
    realm.write(() => {

      realm.delete(this);
    })

  }
}
