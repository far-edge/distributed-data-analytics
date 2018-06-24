// Creates and returns a clone of the given object that does not contain keys with empty values,unless those keys are
// explicitly excluded.
const clean = (object, excluded) => {
  const clone = { ...object };
  Object.keys(clone).forEach((key) => {
    (!excluded || excluded.indexOf(key) === -1) && !clone[key] && delete clone[key];
  });
  return clone;
};

// Returns the first element of the given array.
const first = (array) => {
  return array && array.length ? array[0] : undefined;
};

export default {
  clean,
  first
};
