// http://lorem-rss.herokuapp.com/feed

export default (response) => {
  const parser = new DOMParser();
  const { contents } = response.data;
  const doc = parser.parseFromString(contents, 'text/html');
  console.log(doc);
  return doc;
};
