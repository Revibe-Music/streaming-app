var initialState = {
  selectedSong: null,     // full song object inlcuding album and contributors
  selectedArtist: null,   // full artist object
  selectedAlbum: null,    // full album object inlcuding contributors
  selectedPlaylist: null,
  currentTab: null,
  currentPage: null,
  currentKey: null,
  referrerId: null
};

export const navigationReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'SET_SONG':
         return {
            ...state,
            selectedSong: JSON.parse(JSON.stringify(action.song))
         };
      case 'SET_ARTIST':
         return {
            ...state,
            selectedArtist: JSON.parse(JSON.stringify(action.artist))
         };
      case 'SET_ALBUM':
        return {
           ...state,
           selectedAlbum: JSON.parse(JSON.stringify(action.album))
        };
      case 'SET_PLAYLIST':
        return {
           ...state,
           selectedPlaylist: JSON.parse(JSON.stringify(action.playlist))
        };
      case 'SET_CURRENT_TAB':
        return {
           ...state,
           currentTab: action.tab,
        };
      case 'SET_CURRENT_PAGE':
        return {
           ...state,
           currentPage: action.page,
           currentKey: action.key,
        };
      case 'SET_REFERRER':
        return {
           ...state,
           referrerId: action.id,
        };
      default:
         return state;
   }
};
