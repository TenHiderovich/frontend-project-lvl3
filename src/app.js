import _ from 'lodash';
import axios from 'axios';
import watcher from './modules/watcher';
import { validate, errorMessages } from './modules/validate';

import parser from './modules/parser';

const renderError = (errors) => {
  const feedback = document.querySelector('.feedback');
  const keys = Object.keys(errors);
  if (!keys.length) {
    return;
  }
  const errorTexts = {
    url: 'Ссылка должна быть валидным URL',
    rss: 'Ресурс не содержит валидный RSS',
    hasUrl: 'RSS уже существует',
  };
  feedback.innerHTML = errorTexts[keys[0]];
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
        feedback.innerHTML = 'RSS успешно загружен';
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
      renderError({ hasUrl });
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
      console.error(errorMessages.network.error);
      watchedState.searchForm.process = 'failded';
      throw error;
    }
  });
};
