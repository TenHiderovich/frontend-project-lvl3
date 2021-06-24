import axios from 'axios';
import locale from './i18next';
import parser from './parser';

// http://lorem-rss.herokuapp.com/feed
// http://lorem-rss.herokuapp.com/feed?unit=second&interval=30
// http://lorem-rss.herokuapp.com/feed?length=42

const length = 10;

const checkUpdate = async (state) => {
  const { urls, chanals } = state;

  return setTimeout(() => {
    Object.entries(urls).forEach(async (url) => {
      const [id, urlValue] = url;

      try {
        const response = await axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(`${urlValue}?length=${length}`)}`);
        const result = parser(response);

        if (chanals.posts[id].length < result.posts.length) {
          state.chanals.posts[id] = result.posts;
        }
      } catch (error) {
        console.error(locale.t('networkProblems'));

        throw error;
      }
    });

    checkUpdate(state);
  }, 5000);
};

export default checkUpdate;
