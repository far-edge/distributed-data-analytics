const resettable = (resetType) => {
  return (reducer) => {
    return (state, action) => {
      if (action && action.type === resetType) {
        return reducer(undefined, { });
      }
      return reducer(state, action);
    };
  };
};

export default resettable;
