import { reducer, toastr } from 'react-redux-toastr';

import { tr } from 'helpers/languages';

// The slice of the store to be used.
const slice = 'toastr';

// Shows an error message.
const error = (message) => {
  return toastr.error(tr('ERROR'), message);
};

// Shows an info message.
const info = (message) => {
  return toastr.info(tr('INFO'), message);
};

// Shows a success message.
const success = (message) => {
  return toastr.success(tr('SUCCESS'), message);
};

// Shows a warning message.
const warning = (message) => {
  return toastr.warning(tr('WARNING'), message);
};

export default {
  error,
  info,
  reducer,
  slice,
  success,
  warning
};
