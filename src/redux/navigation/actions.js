const setSong = song => ({
    type: 'SET_SONG',
    song: song
});
const setArtist = artist => ({
    type: 'SET_ARTIST',
    artist: artist
});
const setAlbum = album => ({
    type: 'SET_ALBUM',
    album: album
});


export function selectSong(song) {
  return async (dispatch) => {
    dispatch(setSong(song))
  }
}

export function selectArtist(artist) {
  return async (dispatch) => {
    dispatch(setArtist(artist))
  }
}

export function selectAlbum(album) {
  return async (dispatch) => {
    dispatch(setArtist(album))
  }
}
