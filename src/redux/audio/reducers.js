var initialState = {
   hasAudio: false,
   isPlaying: false,
   audioInterupted: false,  // will be caused when user has no connection
   audioInteruptTime: null, // time audio interupt occured
   scrubbing: false,
   activePlatform: "",
   currentIndex: 0,
   queueIndex: null, // where the queued song was inserted into playlist
   queue: [],
   playlist: [],    //should probably limit this to around 50 to reduce memory usage
   time: {
      current: null,
      max: null
   },
};

export const audioReducer = (state = initialState, action) => {
   switch (action.type) {
      case 'PLAY_SONG':
         return {
            ...state,
            hasAudio: true,
            isPlaying: true,
            inQueue: action.inQueue,
            activePlatform: action.activePlatform,
            playlist: [...action.playlist],
            currentIndex: action.index,
            time: {max: action.playlist[action.index].duration,
                  current: 0,
                  }
         };
      case 'RESUME':
         return {
            ...state,
            isPlaying: !!state.playlist.length,
         };
      case 'PAUSE':
         return {
            ...state,
            isPlaying: false,
         };
      case 'NEXT_SONG':
         return {
            ...state,
            isPlaying: (state.currentIndex + 1 !== state.playlist.length || state.queue.length > 0),
            currentIndex: (state.currentIndex + 1 < state.playlist.length) ? state.currentIndex + 1 : state.currentIndex,
         };
      case 'PREV_SONG':
         return {
            ...state,
            isPlaying: (state.currentIndex - 1 !== state.playlist.length),
            currentIndex: state.currentIndex > 0 ? state.currentIndex - 1 : state.currentIndex,
         };
      case 'UPDATE_PLAYLIST':
         return {
           ...state,
           playlist: [...action.playlist],
         }
      case 'UPDATE_CURRENT_INDEX':
          return {
            ...state,
            currentIndex: action.index,
          }
      case 'UPDATE_QUEUE_INDEX':
         return {
           ...state,
           queueIndex: action.index,
         }
      case "UPDATE_QUEUE":
        return {
          ...state,
          queue: [...action.queue],
        }
     case 'SCRUBBING':
        return {
           ...state,
           scrubbing: action.scrubbing,
        };
       case 'SET_DURATION':
          return {
          ...state,
          time: {...state.time,
                   max: action.duration
                }
       };
      case 'UPDATE_TIME':
         return {
         ...state,
         time: {max: state.time.max,
                current: action.current
              }
      };
      case 'UPDATE_AUDIO_INTERUPT':
         return {
            ...state,
            audioInterupted: action.audioInterupted,
            audioInteruptTime: action.audioInteruptTime,
         };
     case 'RESET_AUDIO':
        return initialState;
      default:
         return state;
   }
};
