import Realm from 'realm'
import { uniqBy } from 'lodash'

import PlaylistV3 from './../../v3/models/Playlist';
import realm from './../../realm';



export default class Playlist extends PlaylistV3 {

  static schema = {
    name: "Playlist",
    primaryKey: "id",
    properties: {
      name: "string",
      id: "string",
      songs: "SavedSong[]",
      dateCreated: "date",
      curated: {type: 'bool', default: false},
    }
  }
}
