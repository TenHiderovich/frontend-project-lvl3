import onChange from 'on-change';

export default (state, processHandler, renderError) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');

  switch (path) {
    case 'searchForm.process':
      processHandler(value);
      break;
    case 'searchForm.errors':
      renderError(value);
      break;
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
