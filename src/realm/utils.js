import realm from './realm';

export const createPlatformsIfNeeded = () => {
  // Create Revibe platform in realm
  if (Object.keys(realm.objects('Platform').filtered('name = "Revibe"')).length === 0) {
    realm.write(() => {
      let platform = realm.create('Platform', {name:"Revibe"});
    })
  }

  // Create Spotify platform in realm
  if (Object.keys(realm.objects('Platform').filtered('name = "Spotify"')).length === 0) {
    realm.write(() => {
      let platform = realm.create('Platform', {name:"Spotify"});
    })
  }

  // Create YouTube platform in realm
  if (Object.keys(realm.objects('Platform').filtered('name = "YouTube"')).length === 0) {
    realm.write(() => {
      let platform = realm.create('Platform', {name:"YouTube"});
    })
  }
}

export const getAvailablePlatforms = () => {
  // get all available platforms on the app
  var platforms = realm.objects('Platform');
  var platformNames = []
  for(var x=0; x<platforms.length; x++) {
    platformNames.push(platforms[x].name)
  }
  return platformNames;
}

export const getActivePlatforms = () => {
  // get platforms that have been signed into or are public

  platformNames = ["YouTube"] // include YouTube because its public and therefore wont have credentials
  var platforms = Object.values(Array.from(realm.objects('Platform').filtered(`credentials != null`)))
  for(var x=0; x < platforms.length; x++) {
    platformNames.push(platforms[x].name)
  }
  return platformNames;
}
