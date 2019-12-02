import { GoogleSignin } from '@react-native-community/google-signin';
import { IP } from './../config'


export default class RevibeAPI {

  constructor() {
    this.platformType = "private";
  }

  async _request(endpoint, method, body, headers={}) {
    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'application/json'
    var request;
    try {
      if(method === "GET") {
        request = {method: method, headers: headers }
      }
      else {
        request = {method: method, headers: headers, body: JSON.stringify(body) }
      }
      const response = await fetch( IP+endpoint, request);
      return await response.json();
    }
    catch(error) {
      return {key: null, error: error}
    }

  }

  _initializeGoogle() {
    GoogleSignin.configure({
      scopes: ['profile email'],
      webClientId: '1002979895434-pkqjm05f8u7nqbamln5n1d50s9vvueat.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceConsentPrompt: false, // [Android] if you want to show the authorization prompt at each login.
    });
  }

  async signup(body) {
    // params ex: {firstName: Riley, lastName: Stephens, email: riley,stephens28@gmail.com, password: Test123 }
    var response = await this._request("api/accounts/signup/", "POST", body)
    // console.log(response);
    if(response.key) {
      return {accessToken:response['key']};
    }
    else {
      return response
    }

  }

  async signupWithGoogle() {
    try {
      await GoogleSignin.signOut()

      // go through google sign in flow client side then on revibe server,
      this._initializeGoogle();
      var userInfo = await GoogleSignin.signIn();
      var response = await this._request("api/accounts/google-authentication/", "POST", {access_token: userInfo.idToken, code: userInfo.serverAuthCode})

      // make request to revibe to save first and last name of user in database
      let headers = {Authorization: `Token ${response['key']}`}
      let body = {first_name: userInfo.user.givenName, last_name: userInfo.user.familyName}
      await this._request("api/accounts/edit-name/", "POST", body, headers)
      return {accessToken: response['key']};
    }
    catch (error) {
      console.log("Error in 'Revibe.signupWithGoogle': "+ error);
    }
  }

  async login(body) {
    // params ex: {email: riley,stephens28@gmail.com, password: Test123 }
    try {

      var response = await this._request("api/accounts/login/", "POST", body)
      // console.log(response);
      if(response.key) {
        return {accessToken:response['key']};
      }
      else {
        console.log(response);
        return response
      }
    }
    catch(error) {
      console.log(error);
    }

  }

  async loginWithGoogle() {
    try {
      await GoogleSignin.signOut()
      this._initializeGoogle();
      var userInfo = await GoogleSignin.signIn();

      let body = {access_token: userInfo.idToken, code: userInfo.serverAuthCode}
      var response = await this._request("api/accounts/google-authentication/", "POST", body)
      return {accessToken: response['key']};
    }
    catch (error) {
      console.log("Error in 'Revibe.loginWithGoogle': "+ error);
    }
  }

  async logout() {
     // Need to logout server side or with google depending on how use signed in

     // this._initializeGoogle();
     // await GoogleSignin.signOut();
  }


  isLoggedIn() {
    // see if user is logged in server side (might not need)

    // return await GoogleSignin.isSignedIn();
  }

  async getUser(token) {
    let headers = {Authorization: `Token ${token}`}
    return await this._request("api/accounts/user/", "GET", null, headers)
  }

  async getConnectedPlatforms(token) {
    console.log("TOKENNNNN: ", token);
    let headers = {Authorization: `Token ${token}`}
    return await this._request("api/accounts/connected-platforms/", "GET", null, headers)
  }

  async getAllSongs() {
    // needed to conform to platform interface
    return []
  }

}
