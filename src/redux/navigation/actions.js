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
const setPlaylist = playlist => ({
    type: 'SET_PLAYLIST',
    playlist: playlist
});
const setCurrentTab = tab => ({
    type: 'SET_CURRENT_TAB',
    tab: tab
});
const setCurrentPage = (page, key) => ({
    type: 'SET_CURRENT_PAGE',
    page: page,
    key: key,
});


export function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function getCurrentTab(nav){
  if(Array.isArray(nav.routes) && nav.routes.length>0){
    if(nav.routeName === "Browse" || nav.routeName === "Search" || nav.routeName === "Library" ) {
      return {tab: nav.routeName, page: nav.routes[nav.index].routeName, key: nav.routes[nav.index].key}
    }
    return getCurrentTab(nav.routes[nav.index])
  }
}

export function selectSong(song) {
  return async (dispatch) => {
    dispatch(setSong(song))
    dispatch(setPage())
  }
}

export function goToContentPage(type) {
  return async (dispatch) => {
    var options = {
      key: "LibraryContent",
      routeName: "LibraryContent",
      params: {
        contentType: type,
      }
    }
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
  }
}

export function goToPlaylistPage() {
  return async (dispatch) => {
    var options = {
      key: "PlaylistContent",
      routeName: "PlaylistContent",
    }
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
  }
}

export function goToAlbum(album, songs=[],isLocal=false) {
  return async (dispatch) => {
    var options = {
     routeName: "Album",
     key: isLocal ? `Album:${album.id}:local` : songs.length > 0 ? `Album:${album.id}:${songs.length}:remote` : `Album:${album.id}:remote`,
     params: {
       album: album,
       songs: isLocal ? getPlatform(album.platform).getSavedAlbumSongs(album.id) : songs
     }
    }
    dispatch(setAlbum(album))
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
  }
}

export function goToPlaylist(playlist) {
  return async (dispatch) => {
    songs = getPlatform("Revibe").getSavedPlaylistSongs(playlist.id)
    var options = {
      routeName: "Playlist",
      key: `Playlist:${playlist.id}`,
      params: {
        playlist: playlist,
        songs: songs,
      }
    }
    dispatch(setPlaylist(playlist))
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
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

    dispatch(setArtist(artist))
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
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
    dispatch(setPage())
  }
}

export function goBack() {
  return async (dispatch, getState) => {
    if(getCurrentTab(navigator.state.nav) === "Playlist") {
      dispatch(setPlaylist(null))
    }
    await navigator.dispatch(NavigationActions.back());
    dispatch(setPage())
  }
}


export function setTab(tab) {
  return async (dispatch) => {
    dispatch(setCurrentTab(tab))
  }
}

export function setPage(page) {
  return async (dispatch) => {
    var nav = getCurrentTab(navigator.state.nav)
    dispatch(setCurrentPage(nav.page, nav.key))
    dispatch(setCurrentTab(nav.tab))
  }
}
