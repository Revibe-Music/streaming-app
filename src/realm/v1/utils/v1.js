import realm from './../realm';

export const getActivePlatforms = () => {
  // get platforms that have been signed into or are public
  platformNames = [] // include YouTube because its public and therefore wont have credentials
  var tokens = Object.values(Array.from(realm.objects('Token')))
  for(var x=0; x < tokens.length; x++) {
    platformNames.push(tokens[x].platform)
  }
  return platformNames;
}
