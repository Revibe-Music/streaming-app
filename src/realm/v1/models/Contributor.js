import realm from './../../realm';
import Artist from './Artist';

export default class Contributor {

  static schema = {
    name: "Contributor",
    primaryKey: "id",   // this will be a string consisting of artist id and id of song or album
    properties: {
      id: "string",
      type: {type: "string", default: "Artist"},
      artist: "Artist",
    }
  }

  create(contribution) {
    artists = new Artist()
    contribution.artist = artists.create(contribution.artist)
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Contributor', contribution);
    })
    return newObject.object
  }

  delete() {
    if(this.artist.linkingObjectsCount() < 2) {
      // only one Contributor object refers to this artist object so delete the artist object
      var artist = realm.objects("Artist").filtered(`id = "${this.artist.id}"`)[0]
      artist.delete()
    }

    // delete contributor
    realm.write(() => {
      realm.delete(this);
    })


  }
}
