import onChange from 'on-change';

export default (state, processHandler, renderError) => onChange(state, (path, value) => {
  const feedback = document.querySelector('.feedback');
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
      } else {
        feedback.classList.add('text-danger');
      }
      break;
    default:
      break;
  }
});
