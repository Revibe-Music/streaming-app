import MusicControl from 'react-native-music-control';
import BackgroundTimer from 'react-native-background-timer';
import { getPlatform } from './../../api/utils';
import RevibeAPI from './../../api/revibe';
import { logEvent } from './../../amplitude/amplitude';


const play = (index, playlist, activePlatform, inQueue, playedFromTab, playedFromPage) => {
  return {
   type: 'PLAY_SONG',
   activePlatform: activePlatform,
   playlist: playlist,
   index: index,
   inQueue: inQueue,
   playedFromTab: playedFromTab,
   playedFromPage: playedFromPage
 };
}
const resume = () => ({
    type: 'RESUME'
});
const pause = () => ({
    type: 'PAUSE'
});
const next = () => ({
    type: 'NEXT_SONG'
});
const prev = () => ({
    type: 'PREV_SONG'
});
const editPlaylist = playlist => ({
  type: 'UPDATE_PLAYLIST',
  playlist: playlist,
});
const editCurrentIndex = index => ({
  type: 'UPDATE_CURRENT_INDEX',
  index: index,
});
const editQueueIndex = index => ({
  type: 'UPDATE_QUEUE_INDEX',
  index: index,
});
const editQueue = queue => ({
  type: 'UPDATE_QUEUE',
  queue: queue,
});
const scrubbing = scrubbing => ({
    type: 'SCRUBBING',
    scrubbing: scrubbing
});
const setDuration = duration => ({
  type: 'SET_DURATION',
  duration: duration
});
const updateTime = currentTime => ({
  type: 'UPDATE_TIME',
  current: currentTime
});
const setAudioInterupt = (audioInterupted, audioInteruptTime) => ({
  type: 'UPDATE_AUDIO_INTERUPT',
  audioInterupted: audioInterupted,
  audioInteruptTime: audioInteruptTime
});

const reset = () => ({
  type: 'RESET_AUDIO',
});


// Audio Controls
 const playSong = (index, playlist=null, inQueue=false) => {
  return async (dispatch, getState) => {
      if(getState().audioState.playlist.length > 0) {
        if(getState().audioState.time.current > 5) {
          var song = getState().audioState.playlist[getState().audioState.currentIndex]
          var revibe = new RevibeAPI()
          revibe.recordStream(song, getState().audioState.time.current)
          var eventData = {
            "Platform": song.platform,
            "ID": song.id,
            "Stream Time": parseFloat(getState().audioState.time.current.toFixed(2)),
            "App Location" : {
              "Tab": getState().audioState.playedFromTab,
              "Page":getState().audioState.playedFromPage,
            }
          }
          logEvent("Play", "Song", eventData)
        }
      }

      if(!playlist) {
        playlist = getState().audioState.playlist
        var playedFromTab = getState().audioState.playedFromTab
        var playedFromPage = getState().audioState.playedFromPage
      }
      else {
        var availablePlatforms = Object.keys(getState().platformState.platforms)
        playlist = playlist.filter(song => availablePlatforms.includes(song.platform))  //only allow song from availablePlatforms in playlist
        var playedFromTab = getState().navigationState.currentTab
        var playedFromPage = getState().navigationState.currentPage
      }

      if(getState().audioState.queueIndex !== null) {
        if(getState().audioState.queueIndex !== index) {
          // remove queued song from playlist
          playlist = getState().audioState.playlist.slice(0,getState().audioState.queueIndex).concat(getState().audioState.playlist.slice(getState().audioState.queueIndex+1))
          dispatch(editQueueIndex(null))
        }
      }

      var platform = getState().platformState.platforms[playlist[index].platform]  // new platform operator object from platform value
      // if platforms switch, pause current platform before switching
      if(!!getState().audioState.activePlatform ) {
        var currentPlatform = getState().platformState.platforms[getState().audioState.activePlatform]  // current platform operator object
        if(currentPlatform.name !== platform.name) {
          currentPlatform.pause()  //  pause currently playing platform before switching
        }
      }

      dispatch(play(index, playlist, platform.name, inQueue, playedFromTab, playedFromPage));

      if(!Array.isArray(playlist[index].album.images)) {
        playlist[index].album.images = Object.keys(playlist[index].album.images).map(x => playlist[index].album.images[x])
      }
      var image = playlist[index].album.images.reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });
      platform.play(playlist[index])

      MusicControl.setNowPlaying({
        title: playlist[index].name,
        artwork: image.url, // URL or RN's image require()
        artist: playlist[index].contributors['0'].artist.name,
        album: playlist[index].platform !== "YouTube"? playlist[index].album.name : "YouTube",
        duration: !!playlist[index].duration ? playlist[index].duration : 0, // (Seconds)
      })
  }
}

const pauseSong = () => {
  return (dispatch, getState) => {
      let platform = getState().platformState.platforms[getState().audioState.activePlatform]  // get active platform
      if (!!platform){
        platform.pause()
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSE,
          elapsedTime:  getState().audioState.time.current
        })
        dispatch(pause());
      }
  }
}

 const resumeSong = () => {
  return (dispatch, getState) => {
      let platform = getState().platformState.platforms[getState().audioState.activePlatform]  // get active platform
      if (!!platform) {
        platform.resume()
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
          elapsedTime:  getState().audioState.time.current
        })
        dispatch(resume());
      }
  }
}

// should i just make
 const nextSong = () => {
  return (dispatch, getState) => {
    var index = getState().audioState.currentIndex +1 < getState().audioState.playlist.length ? getState().audioState.currentIndex +1 : 0; //going to need checks on curent index a d playlist index
    // if items are in the queue, insert the first item into the playlist at the index defined above
    if(getState().audioState.queue.length > 0) {
      var newPlaylist = getState().audioState.playlist.slice(0,getState().audioState.currentIndex+1).concat(getState().audioState.queue[0]).concat(getState().audioState.playlist.slice(getState().audioState.currentIndex+1))
      dispatch(editQueue(getState().audioState.queue.slice(1)));
      dispatch(editQueueIndex(index));
      dispatch(playSong(index, newPlaylist, true));
    }
    else {
      dispatch(playSong(index));
    }
  }
}

 const prevSong = () => {
  return (dispatch, getState) => {
    if(getState().audioState.time.current > 3) {
      dispatch(seek(0))
    }
    else {
      var index = getState().audioState.currentIndex -1 >= 0 ? getState().audioState.currentIndex -1 : 0 ; //going to need checks on curent index a d playlist index
      dispatch(playSong(index));
    }

  }
}

const addToQueue = (song) => {
 return (dispatch, getState) => {
   dispatch(editQueue(getState().audioState.queue.concat([song])));
   logEvent("Queue", "Add To Queue")
 }
}

// adds song to begining of queue
const addToPlayNext = (song) => {
 return (dispatch, getState) => {
   dispatch(editQueue([song].concat(getState().audioState.queue)));
   logEvent("Queue", "Play Next")
 }
}

const removeFromQueue = (index) => {
 return (dispatch, getState) => {
   var newQueue = getState().audioState.queue
   newQueue.splice(index, 1);
   dispatch(editQueue(newQueue));
   logEvent("Queue", "Remove From Queue")
 }
}

const updateQueue = queue => {
 return (dispatch, getState) => {
   dispatch(editQueue(queue));
 }
}

// should i just make
 const shuffleSongs = () => {
  return (dispatch, getState) => {
    // if items are in the queue, insert the first item into the playlist at the index defined above
      var combinedPlaylists = []
      var platforms = getState().platformState.platforms
      var platformNames = Object.keys(platforms)
      for(var x=0; x<platformNames.length; x++) {
        combinedPlaylists = combinedPlaylists.concat(getState().platformState.platforms[platformNames[x]].library.allSongs)
      }
      let i = combinedPlaylists.length;
      while (i--) {
        const ri = Math.floor(Math.random() * (i + 1));
        [combinedPlaylists[i], combinedPlaylists[ri]] = [combinedPlaylists[ri], combinedPlaylists[i]];
      }
      dispatch(playSong(0, combinedPlaylists));
      logEvent("Play", "Shuffle")
      return combinedPlaylists
  }
}

 const setScrubbing = (isScrubbing) => {
  return (dispatch) => {
      dispatch(scrubbing(isScrubbing));
  }
}

 const seek = (position) => {
  return (dispatch, getState) => {
      let platform = getState().platformState.platforms[getState().audioState.activePlatform]  // get active platform
      platform.seek(position)
      MusicControl.updatePlayback({
        elapsedTime:  position
      })
      dispatch(updateSongTime(position));
  }
}

 const setSongDuration = (duration) => {
  return (dispatch) => {
      dispatch(setDuration(duration));
      MusicControl.updatePlayback({
        duration: duration
      })
  }
}

const updateSongTime = (currentTime) => {
  return (dispatch, getState) => {
    let maxTime = getState().audioState.time.max
    if(maxTime > 0) {
      if(currentTime >= maxTime) {
          dispatch(nextSong());
      }
      else if(currentTime+1 >= maxTime && currentTime==getState().audioState.time.current) {
        dispatch(nextSong());
      }
      else {
        dispatch(updateTime(currentTime));
      }
    }

  }
}

 const continuousTimeUpdate = () => {
  return async (dispatch, getState) => {
      if (!getState().audioState.scrubbing && getState().audioState.isPlaying ) {
        var position = await getState().platformState.platforms[getState().audioState.activePlatform].getPosition()
        var currentTime = !!position ? position : getState().audioState.time.current
        var playlist = getState().audioState.playlist
        var index = getState().audioState.currentIndex
        dispatch(updateSongTime(currentTime));
        var image = playlist[index].album.images.length > 0 ? playlist[index].album.images[0].url : null
        var playbackData = {
          elapsedTime: currentTime,
          // duration: !!playlist[index].duration ? playlist[index].duration : getState().audioState.duration, // (Seconds)
        }
        MusicControl.updatePlayback(playbackData)
      }
  }
}

const updateAudioInterupt = (interupted, interuptTime) => {
   return (dispatch) => {
       dispatch(setAudioInterupt(interupted, interuptTime));
   }
}

const resetAudio = () => {
   return (dispatch) => {
       dispatch(pauseSong());
       dispatch(reset());
   }
}

export { playSong ,pauseSong ,resumeSong ,nextSong ,prevSong ,addToQueue, addToPlayNext, removeFromQueue, updateQueue, shuffleSongs, setScrubbing ,seek ,setSongDuration ,updateSongTime , updateAudioInterupt, continuousTimeUpdate,resetAudio }
