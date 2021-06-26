import onChange from 'on-change';
import renderPosts from '../view/renderPosts';
import renderFeeds from '../view/renderFeeds';

export default (state, processHandler, renderError) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const posts = document.querySelector('.posts');
  const feeds = document.querySelector('.feeds');

  if (path.includes('posts')) {
    posts.append(renderPosts(value));
  }

  if (path.includes('feeds')) {
    feeds.innerHTML = renderFeeds(state.chanals.feeds);
  }

  switch (path) {
    case 'searchForm.process':
      processHandler(value);
      break;
    case 'searchForm.errors': {
      const error = Object.values(value)[0];
      const { message } = error;
      renderError(message);
      break;
    }
    case 'searchForm.valid':
      if (value) {
        feedback.innerHTML = '';
        feedback.classList.remove('text-danger');
      }
      break;
    case 'searchForm.data.url':
      if (value === '') {
        form.reset();
      }
      break;
    default:
      break;
  }
});
