import * as yup from 'yup';
import _ from 'lodash';
import locale from './i18next';

yup.setLocale({
  mixed: {
    required: locale.t('notToBeEmpty'),
  },
  string: {
    url: locale.t('urlMustBeValid'),
  },
});

const schema = yup.object().shape({
  url: yup.string().required().url(),
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
