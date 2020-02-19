import realm from './../../realm';
import Library from './Library';

export default class Token {

  static schema = {
    name: "Token",
    primaryKey: 'platform',
    properties: {
      platform: "string",
      accessToken:  'string',
      refreshToken:  'string?',
      expiration:  "float?",
    }
  }

  _validate(token) {
    // make sure token object is in correct format
    // should probably use this to handle errors rather than create them lol
    if(token.accessToken === null) {
      throw `${this.platform} access token cannot be null.`
    }
    else if(typeof token.accessToken !== "string") {
      throw `${this.platform} access token must be a string not a ${typeof token.accessToken}.`
    }
    if(token.refreshToken) {
      if(typeof token.refreshToken !== "string") {
        throw `${this.platform} refresh token must be a string not a ${typeof token.refreshToken}.`
      }
    }
    if(token.expiration) {
      if(typeof token.expiration !== "number") {
        throw `${this.platform} token expiration must be a number not a ${typeof token.expiration}.`
      }
    }
  }

  create(token) {
    //  save new token object to realm
    this._validate(token)
    var newObject = {}
    realm.write(() => {
      newObject.object = realm.create('Token', token , true);
      if(realm.objects('Library').filtered(`platform = "${token.platform}"`).length > 0) {
        realm.delete(realm.objects('Library').filtered(`platform = "${token.platform}"`)[0])
      }
      newObject.object = realm.create('Library', {platform: token.platform});
    })
    return newObject.object
  }

  update(token) {
    //  update existing token object in realm
    realm.write(() => {
      realm.create('Token', token , true);
    })
  }

  delete() {
    //  remove token object from realm
    realm.write(() => {
      realm.delete(this);
    })
  }
}
