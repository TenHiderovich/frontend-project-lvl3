const renderFeed = (feed) => {
  const { title, description } = feed;
  return `
  <li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${title}</h3>
    <p class="m-0 small text-black-50">${description}</p>
  </li>
`;
};

export default (feeds) => {
  const feedsHtml = feeds.reduce((acc, feed) => `${acc}${renderFeed(feed)}`, '');

  return `
    <div class="card border-0">
      <div class="card-body">
          <h2 class="card-title h4">Фиды</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
          ${feedsHtml}
      </ul>
    </div>
  `;
};
