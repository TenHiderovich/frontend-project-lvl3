export default (errors) => {
  const feedback = document.querySelector('.feedback');
  const errorMessage = Object.values(errors)[0];

  if (!errorMessage) {
    return;
  }

  feedback.innerHTML = errorMessage;
  feedback.classList.add('text-danger');
};
