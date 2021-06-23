import _ from 'lodash';
import axios from 'axios';
import locale from './modules/i18next';
import watcher from './modules/watcher';
import validate from './modules/validate';
import parser from './modules/parser';

const renderError = (errors) => {
  const feedback = document.querySelector('.feedback');
  const errorMessage = Object.values(errors)[0];

  if (!errorMessage) {
    return;
  }

  feedback.innerHTML = errorMessage;
  feedback.classList.add('text-danger');
};

export default () => {
  const state = {
    urls: [],
    searchForm: {
      data: {
        url: '',
      },
      valid: true,
      errors: {},
      process: 'filling',
    },
    chanals: [],
  };

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');
  const buttonSubmit = document.querySelector('button[type="submit"]');

  const processHandler = (processValue) => {
    switch (processValue) {
      case 'failded':
        buttonSubmit.disabled = false;
        break;
      case 'sending':
        buttonSubmit.disabled = true;
        break;
      case 'finished':
        feedback.innerHTML = locale.t('RSSUploadedSuccessfully');
        feedback.classList.add('text-success');
        buttonSubmit.disabled = false;
        break;
      default:
        throw new Error(`Unknown state: ${processValue}`);
    }
  };

  const watchedState = watcher(state, processHandler, renderError);

  input.addEventListener('input', (e) => {
    watchedState.searchForm.data.url = e.target.value;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errors = validate(state.searchForm.data);
    const { url } = watchedState.searchForm.data;
    const hasUrl = watchedState.urls.includes(url);

    watchedState.searchForm.errors = errors;
    watchedState.searchForm.valid = _.isEqual(errors, {}) && !hasUrl;

    if (hasUrl) {
      renderError({ hasUrl: locale.t('RSSAlreadyExist') });
    }

    if (!watchedState.searchForm.valid) {
      return;
    }

    watchedState.searchForm.process = 'sending';

    try {
      const response = await axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`);
      const result = parser(response);

      watchedState.chanals.push(result);
      watchedState.searchForm.process = 'finished';
      watchedState.urls.push(url);
      watchedState.searchForm.data.url = '';
    } catch (error) {
      console.error(locale.t('networkProblems'));
      watchedState.searchForm.process = 'failded';
      throw error;
    }
  });
};
