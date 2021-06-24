import locale from '../modules/i18next';

const renderPost = (post) => {
  const {
    title, link, id, description,
  } = post;

  const li = document.createElement('li');
  const a = document.createElement('a');
  const button = document.createElement('button');

  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  a.classList.add('fw-bold');
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.href = link;
  a.textContent = title;
  a.addEventListener('click', (event) => {
    event.target.classList.add('link-secondary', 'fw-normal');
    event.target.classList.remove('fw-bold');
  });

  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = locale.t('viewing');
  button.addEventListener('click', (event) => {
    const modal = document.querySelector(event.target.dataset.bsTarget);
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalLink = modal.querySelector('.full-article');

    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLink.href = link;
  });

  li.append(a);
  li.append(button);

  return li;
};

export default (posts) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const title = document.createElement('h2');
  const list = document.createElement('ul');

  card.classList.add('card', 'border-0');
  title.classList.add('card-title', 'h4');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  cardBody.append(title);

  posts.forEach((post) => {
    list.append(renderPost(post));
  });

  card.append(cardBody);
  card.append(list);

  return card;
};
