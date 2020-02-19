import thunkMiddleware from 'redux-thunk';
// import { devToolsEnhancer } from 'redux-devtools-extension';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { audioReducer } from './audio/reducers';
import { platformReducer } from './platform/reducers';
import { connectionReducer } from './connection/reducers';
import { navigationReducer } from './navigation/reducers';



const rootReducer = combineReducers({
  audioState: audioReducer,
  platformState: platformReducer,
  connectionState: connectionReducer,
  naviationState: navigationReducer,
});

const store = createStore(
   rootReducer,
   applyMiddleware(thunkMiddleware),    // Need thunk for async calls in action creators
   // devToolsEnhancer(),
);

export default store;
