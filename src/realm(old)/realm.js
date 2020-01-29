/*
* @todo: consider creating User, Artist, and album scheme
*/

import Realm from 'realm'
import * as v6 from './schemas/v6'
import * as v7 from './schemas/v7'
import Spotify from 'rn-spotify-sdk';
import YouTubeAPI from './../api/youtube'

const schemas = [
  { schema: [v6.SongSchema, v6.PlatformSchema, v6.CredentialSchema],
    schemaVersion: 6
  },
  { schema: [v7.SongSchema, v7.ArtistSchema,v7.AlbumSchema,v7.PlatformSchema, v7.CredentialSchema], schemaVersion: 7, migration: v7.migrate},
]

// The first schema to update to is the current schema version
// since the first schema in our array is at nextSchemaIndex:

// Realm.clearTestState()

console.log("default path:",Realm.defaultPath);

// If Realm.schemaVersion() returned -1, it means this is a new Realm file
// so no migration is needed.
let nextSchemaVersion = Realm.schemaVersion(Realm.defaultPath);
if (nextSchemaVersion !== -1) {
  while (nextSchemaVersion < schemas[schemas.length-1].schemaVersion) {
    let schemaVersion = schemas[schemas.findIndex(x => x.schemaVersion === nextSchemaVersion)]
    const migratedRealm = new Realm(schemaVersion);
    migratedRealm.close();
    nextSchemaVersion++
  }
}


export const realm = new Realm(schemas[schemas.length-1])



// realm.write(() => {
  // let spotify = realm.objects('Platform').filtered('name = "Spotify"')["0"]
  // if(spotify.credentials) realm.delete(spotify.credentials)
  // console.log(realm.objects('Platform'));
  // Create a book object
  // let allSongs = realm.objects('Song');
  // realm.delete(allSongs);
  // let allCred = realm.objects('Credential');
  // realm.deleteAll();
// });

export default realm;
