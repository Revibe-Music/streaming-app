var initialState = {
  checkedLogin: false,
  hasLoggedIn: false,   // refers to revibe
  isLoggedIn: false,    // refers to revibe, youtube, and spotify
  platformsInitialized: false,    // refers to revibe, youtube, and spotify
  platforms: {},
  error: null,
};

// maybe switch revibe, google, spotify to object with keys that represent account and values that are platform objects

export const platformReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'ASSIGN_PLATFORMS':
          return { ...state,
                  platforms: action.platforms,
                  platformsInitialized: action.platformsInitialized };
        case "CHECK_AUTHENTICATION":
          return { ...state, checkedLogin: action.checked };
        case 'HAS_AUTHENTICATED':
            return { ...state, hasLoggedIn: action.hasLoggedIn };
        case 'IS_AUTHENTICATED':
            return { ...state, isLoggedIn: action.isLoggedIn };
        case 'UPDATE_PLATFORM':
            return { ...state, platforms: Object.assign({}, action.platforms) }
        case 'ERROR':
            return { ...state, error: action.error };
        default:
            return state;
    }
};
