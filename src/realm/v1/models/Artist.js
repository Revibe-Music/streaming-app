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
