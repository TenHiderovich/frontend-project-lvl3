import onChange from 'on-change';
import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
  url: yup.string().url(),
});

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const validate = (fields) => {
  try {
    schema.validateSync(fields, {
      abortEarly: false,
    });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const renderError = (errors) => {
  const feedback = document.querySelector('.feedback');
  const key = Object.keys(errors)[0];
  const errorTexts = {
    url: 'Ссылка должна быть валидным URL',
    rss: 'Ресурс не содержит валидный RSS',
  };
  feedback.innerHTML = errorTexts[key];
};

export default () => {
  const state = {
    searchForm: {
      data: {
        url: '',
      },
      valid: true,
      errors: {},
      process: 'filling',
    },
  };

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');

  const processHandler = (processValue) => {
    switch (processValue) {
      case 'failded':

        break;
      case 'filling':

        break;
      case 'sending':

        break;
      case 'finished':

        break;
      default:
        throw new Error(`Unknown state: ${processValue}`);
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'signUpForm.process':
        processHandler(value);
        break;
      case 'searchForm.errors':
        renderError(value);
        break;
      case 'searchForm.valid':
        if (value) {
          feedback.innerHTML = '';
          feedback.classList.remove('text-danger');
        } else {
          feedback.classList.add('text-danger');
        }
        break;
      default:
        break;
    }
  });

  input.addEventListener('input', (e) => {
    watchedState.searchForm.data.url = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const errors = validate(state.searchForm.data);

    watchedState.searchForm.errors = errors;
    watchedState.searchForm.valid = _.isEqual(errors, {});
  });
};
