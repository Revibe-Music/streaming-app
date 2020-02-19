import realm from './../../realm';

export default class Image {

  static schema = {
    name: "Image",
    primaryKey: "url",
    properties: {
      url: "string",
      height: "int",
      width: "int",
    }
  }

  create(image) {
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Image', image, true);
    })
    return newObject.object
  }

  delete() {
    //  delete image
    realm.write(() => {
      realm.delete(this);
    })
  }
}
