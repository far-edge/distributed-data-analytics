// Finds the distinct elements in the given array.
const distinct = (array) => {
  if (!array || !array.length) {
    return [];
  }
  return [ ...(new Set(array)) ];
};

// Returns the first element of the given array.
const first = (array) => {
  return array && array.length ? array[0] : undefined;
};

module.exports = {
  distinct,
  first
};
