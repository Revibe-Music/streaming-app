var initialState = {
  selectedSong: null,     // full song object inlcuding album and contributors
  selectedArtist: null,   // full artist object
  selectedAlbum: null,    // full album object inlcuding contributors
};

export const navigationReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'SET_SONG':
         return {
            ...state,
            selectedSong: JSON.parse(JSON.stringify(action.song)),
         };
      case 'SET_ARTIST':
         return {
            ...state,
            selectedArtist: action.artist,
         };
      case 'SET_ALBUM':
        return {
           ...state,
           selectedAlbum: action.album,
        };
      default:
         return state;
   }
};
