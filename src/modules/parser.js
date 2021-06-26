import _ from 'lodash';
import locale from './i18next';

function ValidRSSError(message) {
  this.message = message;
  this.name = 'notValidRSS';
}

export default (response) => {
  const parser = new DOMParser();
  const { contents } = response.data;

  const document = parser.parseFromString(contents, 'text/xml');
  const channel = document.querySelector('channel');

  if (!channel) {
    throw new ValidRSSError(locale.t('notValidRSS'));
  }

  const channelTitle = channel.querySelector('title');
  const channelDescription = channel.querySelector('description');
  const channelPosts = channel.querySelectorAll('item');

  const posts = Array.from(channelPosts).map((post) => {
    const postTitle = post.querySelector('title');
    const postDescription = post.querySelector('description');
    const postLink = post.querySelector('link');

    return {
      id: _.uniqueId('post'),
      title: postTitle.textContent,
      description: postDescription.textContent,
      link: postLink.textContent,
    };
  });

  return {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    posts,
  };
};
