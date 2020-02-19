/*
This will handle the checking and updating of all
account authentication state. All data will be pulled
from realm and any incoming data will be saved to realm
*/

import { getPlatform } from './../../api/utils';
import { getActivePlatforms} from './../../realm/utils/v1';


const assignPlatforms = platforms => ({
  type: 'ASSIGN_PLATFORMS',
  platforms: platforms,
  platformsInitialized: true,
})

// check if the app has checked the user's authentication status at all
const checkedAuthentication = bool => ({
    type: 'CHECK_AUTHENTICATION',
    checked: bool,
});

// check if a user has logged in to any platforms before
const checkHasLoggedIn = bool => ({
    type: 'HAS_AUTHENTICATED',
    hasLoggedIn: bool,
});

// check if user is currently logged into their platform(s)
const checkIsLoggedIn = bool => ({
    type: 'IS_AUTHENTICATED',
    isLoggedIn: bool,
});

const updatePlatform = platforms => ({
  type: 'UPDATE_PLATFORM',
  platforms: platforms,
})

const error = error => ({
    type: 'ERROR',
    error,
});



export function initializePlatforms() {
  return async (dispatch) => {
    var platformNames = getActivePlatforms()
    var platforms = {}
    for(var x=0; x<platformNames.length; x++) {
      platforms[platformNames[x]] = getPlatform(platformNames[x])
    }
    dispatch(assignPlatforms(platforms));
  }
}

export function checkRevibeAccount() {
  // just need to check if user has a revibe account
  return async (dispatch, getState) => {
    // if revibe is in platform state then it has been logged into before
    var revibe = getPlatform("Revibe")
    var hasLoggedIn = revibe.hasLoggedIn()
    dispatch(checkedAuthentication(true));
    dispatch(checkHasLoggedIn(hasLoggedIn));
  }
}

export function checkPlatformAuthentication() {
  // this will be called on launch
  return async (dispatch, getState) => {
    // if handle all platform login/silentLogin stuff here
    var platforms = getState().platformState.platforms
    var platformNames = Object.keys(platforms)
    for(var x=0; x<platformNames.length; x++) {
      if(platforms[platformNames[x]].platformType === "private") {
        if(!platforms[platformNames[x]].isLoggedIn()) {
          try {
            await platforms[platformNames[x]].silentLogin()
          }
          catch(error) {
            console.log("Error in checkPlatformAuthentication during silentLogin: "+error);
          }
        }
      }
    }
    dispatch(checkIsLoggedIn(true));   // may do more checks here to ensure platforms are actually logged into
  }
}


export function updatePlatformData(platform) {
  return async (dispatch, getState) => {
    var platforms = getState().platformState.platforms
    platforms[platform.name] = platform
    dispatch(updatePlatform(platforms));
  }
}

export function removePlatformData(platformName) {
  return async (dispatch, getState) => {
    var platforms = getState().platformState.platforms
    delete platforms[platformName]
    dispatch(updatePlatform(platforms));
  }
}
