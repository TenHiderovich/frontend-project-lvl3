import i18next from 'i18next';
import ru from '../locale/ru.json';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        ...ru,
      },
    },
  },
});

export default i18next;
