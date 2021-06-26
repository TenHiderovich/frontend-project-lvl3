export default (message) => {
  const feedback = document.querySelector('.feedback');

  if (!message) {
    return;
  }

  feedback.innerHTML = message;
  feedback.classList.add('text-danger');
};
