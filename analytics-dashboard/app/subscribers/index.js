let next = null;

const subscriber = (store) => {
  return () => {
    const _previous = next;
    next = store.getState();
  };
};

export default subscriber;
