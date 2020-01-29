import realm from './../realm';

export const createPlatformsIfNeeded = () => {
  // Create Revibe platform in realm
  if (Object.keys(realm.objects('Token').filtered('name = "Revibe"')).length === 0) {
    realm.write(() => {
      let platform = realm.create('Token', {name:"Revibe"});
    })
  }
  // Create YouTube platform in realm
  if (Object.keys(realm.objects('Platform').filtered('name = "YouTube"')).length === 0) {
    realm.write(() => {
      let platform = realm.create('Platform', {name:"YouTube"});
    })
  }
}

export const getActivePlatforms = () => {
  // get platforms that have been signed into or are public
  platformNames = ["YouTube"] // include YouTube because its public and therefore wont have credentials
  var platforms = Object.values(Array.from(realm.objects('Token').filtered(`accessToken != null`)))
  for(var x=0; x < platforms.length; x++) {
    platformNames.push(platforms[x].name)
  }
  return platformNames;
}
