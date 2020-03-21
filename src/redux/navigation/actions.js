import { NavigationActions } from 'react-navigation';
import { getPlatform } from './../../api/utils';

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
const setCurrentTab = tab => ({
    type: 'SET_TAB',
    tab: tab
});
const setCurrentPage = page => ({
    type: 'SET_PAGE',
    page: page
});


export function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function getCurrentTab(nav){
    if(Array.isArray(nav.routes)&&nav.routes.length>0){
        return getCurrentTab(nav.routes[nav.index])
    }
    else {
        return nav.routeName
    }
}

export function selectSong(song) {
  return async (dispatch) => {
    dispatch(setSong(song))
  }
}

export function goToAlbum(album, songs=[],isLocal=false) {
  return async (dispatch) => {
    var options = {
     routeName: "Album",
     key: isLocal ? `Album:${album.id}:local` : `Album:${album.id}:remote`,
     params: {
       album: album,
       songs: isLocal ? getPlatform(album.platform).getSavedAlbumSongs(album.id) : songs
     }
    }

    navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setAlbum(album))
    dispatch(setPage(getCurrentTab(navigator.state.nav)))
    dispatch(setPage("Album"))
  }
}

export function goToPlaylist(playlist) {
  return async (dispatch) => {
    songs = getPlatform("Revibe").getSavedPlaylistSongs(playlist.name)
    var options = {
      routeName: "Playlist",
      key: `Playlist:${playlist.id}`,
      params: {
        playlist: this.props.playlist,
        songs: songs,
      }
    }
    navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage(getCurrentTab(navigator.state.nav)))
    dispatch(setPage("Album"))
  }
}

export function goToArtist(artist, isLocal=false) {
  return async (dispatch) => {
    var options = {key: isLocal ? `Artist:${artist.id}:local` : `Artist:${artist.id}:remote`}
    if(isLocal) {
      options.routeName = "Album"
      options.params = {
        album: artist,
        songs: getPlatform(artist.platform).getSavedArtistSongs(artist.id)
      }
    }
    else if(artist.platform === "YouTube") {
      options.routeName = "Album"
      options.params = {
        album: artist,
        songs: []
      }
    }
    else {
      options.routeName = "Artist"
      options.params = {artist: artist}
    }

    navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setArtist(artist))
    dispatch(setPage(getCurrentTab(navigator.state.nav)))
    dispatch(setPage("Artist"))
  }
}

export function goToViewAll(data, type, title="", endpoint="",platform="Revibe",displayLogo=false) {
  return async (dispatch) => {
    var options = {
      key: `ViewAll:${type}`,
      routeName: "ViewAll",
      params: {
        data: data,
        type: type,
        title: title,
        endpoint: endpoint,
        platform: platform,
        displayLogo: displayLogo,
      }
    }
    navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage(getCurrentTab(navigator.state.nav)))
    dispatch(setPage("ViewAll"))
  }
}

export function goBack() {
  return async (dispatch, getState) => {

    navigator.dispatch(NavigationActions.back());
    dispatch(setPage(getCurrentTab(navigator.state.nav)))
    dispatch(setPage("ViewAll"))
    console.log(getCurrentTab(navigator.state.nav));
  }
}


export function setTab(tab) {
  return async (dispatch) => {
    dispatch(setCurrentTab(tab))
  }
}

export function setPage(page) {
  return async (dispatch) => {
    dispatch(setCurrentPage(page))
  }
}
