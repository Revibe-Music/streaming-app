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
const setCurrentPage = page => ({
    type: 'SET_PAGE',
    page: page
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

export function setPage(page) {
  return async (dispatch) => {
    dispatch(setCurrentPage(album))
  }
}
