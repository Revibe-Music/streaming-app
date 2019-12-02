var initialState = {
  connected: true,
  error: null,
};

export const connectionReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'CONNECTION':
            return { ...state, connected: action.connected };
        case 'ERROR':
            return { ...state, error: action.error };
        default:
            return state;
    }
};
