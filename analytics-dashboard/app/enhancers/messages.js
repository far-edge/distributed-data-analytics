import { reducer, slice } from 'helpers/messages';

// Computes the next state for the messages slice.
const messagesReducer = (state, action) => {
  if (!state) {
    return reducer(undefined, action);
  }
  const toastr = state[slice];
  return reducer(toastr, action);
};

// Enhances the root reducer to accomodate the messages slice.
const enhance = (rootReducer) => {
  return (state, action) => {
    // Compute the next state for the messages slice.
    const nextMessagesState = messagesReducer(state, action);
    // Compute the next state of the rest of the state tree.
    const s = { ...state };
    delete s[slice];
    const nextState = rootReducer(s, action);
    // Merge them together.
    return { ...nextState, [slice]: nextMessagesState };
  };
};

const createStore = (next) => {
  return (rootReducer, state, enhancer) => {
    const enhancedState = { ...state, [slice]: messagesReducer(undefined, { }) };
    const enhancedReducer = enhance(rootReducer);
    return next(enhancedReducer, enhancedState, enhancer);
  };
};

export default createStore;
