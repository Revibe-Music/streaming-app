import { NavigationActions } from 'react-navigation';
import { getPlatform } from './../../api/utils';
import { logEvent } from './../../amplitude/amplitude';
import branch, { BranchEvent } from 'react-native-branch'
import { playSong } from '../audio/actions'
import { setError } from '../platform/actions'


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

function getNavigationState(nav){
  if(Array.isArray(nav.routes) && nav.routes.length>0){
    if(nav.routeName === "Browse" || nav.routeName === "Search" || nav.routeName === "Library" ) {
      return {tab: nav.routeName, page: nav.routes[nav.index].routeName, key: nav.routes[nav.index].key}
    }
    return getNavigationState(nav.routes[nav.index])
  }
}

export function subscribe() {

    return async (dispatch, getState) => {
      branch.subscribe(async ({error, params, uri}) => {
        if (error) {
          console.error('Error from Branch: ' + error)
          return
        }
        // params will never be null if error is null

        if (params['+non_branch_link']) {
          const nonBranchUrl = params['+non_branch_link']
          // Route non-Branch URL if appropriate.
          return
        }

        if (!params['+clicked_branch_link']) {
          // Indicates initialization success and some other conditions.
          // No link was opened.
          return
        }

        // A Branch link was opened.
        // Route link based on data in params, e.g.
        var contentPlatform = params.contentPlatform
        var contentType = params.contentType
        var contentId = params.contentId
        if(contentType.toLowerCase() === "artist") {
          var options = {key: params.$canonical_identifier}
          if(contentPlatform.toLowerCase() === "youtube") {
            options.routeName = "Album"
            options.params = {id: contentId, platform: "YouTube", songs: []}
          }
          else {
            options.routeName = "Artist"
            options.params = {id: contentId, platform: contentPlatform}
          }
          navigator.dispatch(NavigationActions.navigate(options));
        }
        else if(contentType.toLowerCase() === "album") {
          var options = {
           routeName: "Album",
           key: params.$canonical_identifier,
           params: {
             id: contentId,
             platform: contentPlatform,
             songs: []
           }
          }
          navigator.dispatch(NavigationActions.navigate(options));
        }
        else if(contentType.toLowerCase() === "song") {
          var availablePlatforms = Object.keys(getState().platformState.platforms)

          //only allow song from availablePlatforms
          if(availablePlatforms.includes(contentPlatform)) {
            var platformAPI = getPlatform(contentPlatform)
            var song = await platformAPI.fetchSong(contentId)
            dispatch(playSong(0, [song]))
          }
          else {
            dispatch(setError(`Please login to your ${contentPlatform} account before playing this song.` ))
          }

        }
    })
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
    logEvent("Visit", "Library Page", {"Content Type": type})
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
  return async (dispatch, getState) => {
    var options = {
     routeName: "Album",
     key: isLocal ? `Album:${album.id}:local` : songs.length > 0 ? `Album:${album.id}:${songs.length}:remote` : `Album:${album.id}:remote`,
     params: {
       album: album,
       songs: isLocal ? getPlatform(album.platform).getSavedAlbumSongs(album.id) : songs,
       isLocal: isLocal
     }
    }
    dispatch(setAlbum(album))
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
    logEvent("Visit", "Album Page", {"Platform": album.platform, "ID": album.id, "Active Tab": getState().navigationState.currentTab, "Local": isLocal})
  }
}

export function goToPlaylist(playlist, isLocal=true) {
  return async (dispatch, getState) => {
    if(isLocal) {
      songs = getPlatform("Revibe").getSavedPlaylistSongs(playlist.id)
    }
    else {
      songs = []
    }
    var options = {
      routeName: "Playlist",
      key: isLocal ? `Playlist:${playlist.id}:local` : songs.length > 0 ? `Playlist:${playlist.id}:${songs.length}:remote` : `Playlist:${playlist.id}:remote`,
      params: {
        playlist: playlist,
        songs: songs,
        isLocal: isLocal
      }
    }
    dispatch(setPlaylist(playlist))
    await navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
    logEvent("Visit", "Playlist Page", {"ID": playlist.id, "Active Tab": getState().navigationState.currentTab, "Local": isLocal})
  }
}

export function goToArtist(artist, isLocal=false) {
  return async (dispatch, getState) => {
    var options = {key: isLocal ? `Artist:${artist.id}:local` : `Artist:${artist.id}:remote`}
    if(isLocal) {
      options.routeName = "Album"
      options.params = {
        album: artist,
        songs: getPlatform(artist.platform).getSavedArtistSongs(artist.id),
        isLocal: isLocal
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
    logEvent("Visit", "Artist Page", {"Platform": artist.platform, "ID": artist.id, "Active Tab": getState().navigationState.currentTab, "Local": isLocal})
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

export function goToManageAccount() {
  return async (dispatch) => {
    var options = {
      key: `Settings`,
      routeName: "Settings",
    }
    navigator.dispatch(NavigationActions.navigate(options));
    dispatch(setPage())
  }
}

export function goBack() {
  return async (dispatch) => {
    if(getNavigationState(navigator.state.nav) === "Playlist") {
      dispatch(setPlaylist(null))
    }
    await navigator.dispatch(NavigationActions.back());
    dispatch(setPage())
  }
}


export function setTab(tab=null) {
  return async (dispatch) => {
    if(tab) {
      dispatch(setCurrentTab(tab))
    }
    else {
      var nav = getNavigationState(navigator.state.nav)
      dispatch(setCurrentTab(nav.tab))
    }
  }
}

export function setPage(page=null, key=null) {
  return async (dispatch) => {
    if(page) {
      dispatch(setCurrentPage(page, key))
    }
    else {
      var nav = getNavigationState(navigator.state.nav)
      dispatch(setCurrentPage(nav.page, nav.key))
      dispatch(setCurrentTab(nav.tab))
    }
  }
}
