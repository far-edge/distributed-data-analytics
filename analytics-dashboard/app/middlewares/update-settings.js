import actions from 'actions/settings';
import { setLanguage } from 'helpers/languages';

const updateSettings = (_store) => {
  return (next) => {
    return (action) => {
      if (action.type === actions.SET_LANGUAGE) {
        setLanguage(action.payload);
      }
      return next(action);
    };
  };
};

export default updateSettings;
