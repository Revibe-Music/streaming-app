import store from './../rootReducer';
import MusicControl from 'react-native-music-control';


const play = (index, playlist, activePlatform, inQueue) => {
  return {
   type: 'PLAY_SONG',
   activePlatform: activePlatform,
   playlist: playlist,
   index: index,
   inQueue: inQueue
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




// Audio Controls
 const playSong = (index, playlist=null, inQueue=false) => {
  return async (dispatch, getState) => {


      playlist = !!playlist ? playlist : getState().audioState.playlist

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

      dispatch(play(index, playlist, platform.name, inQueue));

      platform.play(playlist[index].uri)

      MusicControl.setNowPlaying({
        title: playlist[index].name,
        artwork: playlist[index].Album.image, // URL or RN's image require()
        artist: playlist[index].Artist.name,
        album: playlist[index].platform !== "YouTube"? playlist[index].Album.name : "YouTube",
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

const addToQueue = (song, platform) => {
 return (dispatch, getState) => {
   dispatch(editQueue(getState().audioState.queue.concat([song])));
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
        if(getState().platformState.platforms[platformNames[x]].library.length > 0) {
          combinedPlaylists = combinedPlaylists.concat(getState().platformState.platforms[platformNames[x]].library)
        }
      }
      let i = combinedPlaylists.length;
      while (i--) {
        const ri = Math.floor(Math.random() * (i + 1));
        [combinedPlaylists[i], combinedPlaylists[ri]] = [combinedPlaylists[ri], combinedPlaylists[i]];
      }
      dispatch(playSong(0, combinedPlaylists));
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

        MusicControl.updatePlayback({
          state: getState().audioState.isPlaying ? MusicControl.STATE_PLAY : MusicControl.STATE_PAUSE,
          title: playlist[index].name,
          artwork: playlist[index].Album.image, // URL or RN's image require()
          artist: playlist[index].Artist.name,
          album: playlist[index].platform !== "YouTube" ? playlist[index].Album.name : "YouTube",
          duration: !!playlist[index].duration ? playlist[index].duration : getState().audioState.duration, // (Seconds)
          elapsedTime: currentTime
        })
      }
  }
}

const updateAudioInterupt = (interupted, interuptTime) => {
   return (dispatch) => {
       dispatch(setAudioInterupt(interupted, interuptTime));
   }
}

export { playSong ,pauseSong ,resumeSong ,nextSong ,prevSong ,addToQueue, updateQueue, shuffleSongs, setScrubbing ,seek ,setSongDuration ,updateSongTime ,continuousTimeUpdate, updateAudioInterupt }
