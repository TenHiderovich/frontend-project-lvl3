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
  };
  feedback.innerHTML = errorTexts[keys[0]];
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
  const buttonSubmit = document.querySelector('button[type="submit"]');

  const processHandler = (processValue) => {
    switch (processValue) {
      case 'failded':
        buttonSubmit.disabled = false;
        break;
      case 'filling':
        buttonSubmit.disabled = false;
        break;
      case 'sending':
        buttonSubmit.disabled = true;
        break;
      case 'finished':
        feedback.innerHTML = 'RSS успешно загружен';
        feedback.classList.add('text-success');
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

    watchedState.searchForm.errors = errors;
    watchedState.searchForm.valid = _.isEqual(errors, {});

    if (!_.isEqual(errors, {})) {
      return;
    }

    watchedState.searchForm.process = 'sending';

    try {
      const { url } = watchedState.searchForm.data;
      const response = await axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`);
      const result = parser(response);

      watchedState.searchForm.process = 'finished';
      watchedState.searchForm.data.url = '';
    } catch (error) {
      console.error(errorMessages.network.error);
      watchedState.searchForm.process = 'failded';
      throw error;
    }
  });
};
