import Realm from 'realm'
import { uniqBy } from 'lodash'

import SongV1 from './../../v1/models/Song';
import realm from './../../realm';



export default class Song extends SongV1 {

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
      lastListenTime: "date?",
    }
  }

  updateLastListenTime() {
    realm.write(() => {
      this.lastListenTime = new Date()
    })
  }
}
