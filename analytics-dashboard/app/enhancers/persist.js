
const persist = (next) => {
  return (reducer, initialState, enhancer) => {
    const name = process.env.NAME.replace(/\s+/g, '_').toLowerCase();
    const key = `__${name}__redux_immutable_store__`;
    // Try to load the state from local storage.
    let finalInitialState = initialState;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const persistedState = JSON.parse(stored);
        finalInitialState = { ...initialState, ...persistedState };
      }
    } catch (e) {
      console.warn('Failed to retrieve initialize state from localStorage:', e);
    }
    const store = next(reducer, finalInitialState, enhancer);

    // Store the state in local storage after every change.
    store.subscribe(() => {
      const state = store.getState();
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.warn('Unable to persist state to localStorage:', e);
      }
    });
    return store;
  };
};

export default persist;
