import Realm from 'realm'

import Image from './v1/models/Image'
import Contributor from './v1/models/Contributor'
import Song from './v1/models/Song'
import Album from './v1/models/Album'
import Artist from './v1/models/Artist'
import Library from './v1/models/Library'
import Token from './v1/models/Token'
import Playlist from './v1/models/Playlist'
import SavedSong from './v1/models/SavedSong'

const schemas = [
  {
    schema: [
      Token,
      Song,
      Album,
      Artist,
      Library,
      Playlist,
      SavedSong,
      Contributor,
      Image
    ],
    schemaVersion: 1,
  },
]

console.log(Realm.defaultPath);

// If Realm.schemaVersion() returned -1, it means this is a new Realm file so no migration is needed.
let nextSchemaVersion = Realm.schemaVersion(Realm.defaultPath);
if (nextSchemaVersion !== -1) {
  while (nextSchemaVersion < schemas[schemas.length-1].schemaVersion) {
    let schemaVersion = schemas[schemas.findIndex(x => x.schemaVersion === nextSchemaVersion)]
    const migratedRealm = new Realm(schemaVersion);
    migratedRealm.close();
    nextSchemaVersion++
  }
}

const realm = new Realm(schemas[schemas.length-1])


// realm.write(() => {
//   // let revibeToken = realm.objects('Token').filtered('platform = "Revibe"')["0"]
//   // if(revibeToken) realm.delete(revibeToken)
//   // realm.deleteAll();
// });

export default realm;
