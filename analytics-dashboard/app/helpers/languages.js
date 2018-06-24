import LocalizedStrings from 'react-localization';

// Load all available translations.
import languages from 'languages';

const defaultLanguage = 'en';

// Set up localization.
const localization = new LocalizedStrings(languages);

// Translates a message.
// If the message contains placeholders, it also replaces them with the arguments.
const tr = (message, ...args) => {
  const trmessage = localization[message];
  if (!trmessage) {
    // For debugging.
    return message;
  }
  if (!args || !args.length) {
    return trmessage;
  }
  return localization.formatString(trmessage, ...args);
};

// Gets the displayed language.
const getLanguage = () => {
  return localization.getLanguage();
};

// Sets the displayed language.
const setLanguage = (language) => {
  return localization.setLanguage(language);
};

// Gets all available languages.
const getLanguages = () => {
  return localization.getAvailableLanguages();
};

export default {
  defaultLanguage,
  getLanguage,
  getLanguages,
  setLanguage,
  tr
};
