import Realm from 'realm'
import * as v1 from './schemas/v1'

const schemas = [
  {
    schema: [
      v1.TokenSchema,
      v1.SongSchema,
      v1.AlbumSchema,
      v1.ArtistSchema,
      v1.LibrarySchema,
      v1.PlaylistSchema,
      v1.SavedSongSchema,
      v1.ContributorSchema,
      v1.ImageSchema
    ],
    schemaVersion: 1,
  },
]

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

realm.write(() => {
  let revibeToken = realm.objects('Token').filtered('platform = "Revibe"')["0"]
  if(revibeToken) realm.delete(revibeToken)
  // realm.deleteAll();
});

export default realm;
