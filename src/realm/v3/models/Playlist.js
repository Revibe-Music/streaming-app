import Realm from 'realm'
import { uniqBy } from 'lodash'

import PlaylistV1 from './../../v1/models/Playlist';
import realm from './../../realm';



export default class Playlist extends PlaylistV1 {

  static schema = {
    name: "Playlist",
    primaryKey: "id",
    properties: {
      name: "string",
      id: "string",
      songs: "SavedSong[]",
      dateCreated: "date",
    }
  }
}
