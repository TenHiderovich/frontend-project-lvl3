import * as yup from 'yup';
import _ from 'lodash';
import locale from './i18next';

yup.setLocale({
  string: {
    url: locale.t('linkMustBeValid'),
  },
});

const schema = yup.object().shape({
  url: yup.string().url(),
});

export default (fields) => {
  try {
    schema.validateSync(fields, {
      abortEarly: false,
    });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};
