var initialState = {
  selectedSong: null,     // full song object inlcuding album and contributors
  selectedArtist: null,   // full artist object
  selectedAlbum: null,    // full album object inlcuding contributors
  currentTab: null,
  currentPage: null
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
      case 'SET_CURRENT_TAB':
        return {
           ...state,
           currentTab: action.tab,
        };
      case 'SET_CURRENT_PAGE':
        return {
           ...state,
           currentPage: action.page,
        };
      default:
         return state;
   }
};
