import _ from 'lodash';
import axios from 'axios';
import locale from './modules/i18next';
import watcher from './modules/watcher';
import validate from './modules/validate';
import parser from './modules/parser';
import checkUpdate from './modules/checkUpdate';

import renderError from './view/renderError';

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
    chanals: {
      posts: [],
      feeds: [],
    },
  };

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input[name="url"]');
  const feedback = document.querySelector('.feedback');
  const buttonSubmit = document.querySelector('button[type="submit"]');
  let checkUpdateTimerId;

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
    clearTimeout(checkUpdateTimerId);

    const { url } = watchedState.searchForm.data;
    const errors = validate(state.searchForm.data);
    const hasUrl = Object.values(watchedState.urls).includes(url);

    watchedState.searchForm.errors = errors;
    watchedState.searchForm.valid = _.isEqual(errors, {}) && !hasUrl;

    if (hasUrl) {
      renderError({ hasUrl: locale.t('urlAlreadyExist') });
    }

    if (!watchedState.searchForm.valid) {
      return;
    }

    watchedState.searchForm.process = 'sending';

    try {
      const response = await axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`);
      const { title, description, posts } = parser(response);
      const id = _.uniqueId();

      watchedState.chanals.posts[id] = posts;
      watchedState.chanals.feeds[id] = {
        title,
        description,
      };
      watchedState.urls[id] = url;
      watchedState.searchForm.data.url = '';
      watchedState.searchForm.process = 'finished';

      checkUpdateTimerId = checkUpdate(watchedState);
    } catch (error) {
      console.error(locale.t('networkProblems'));
      watchedState.searchForm.process = 'failded';

      throw error;
    }
  });
};
