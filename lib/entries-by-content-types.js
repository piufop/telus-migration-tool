const Bluebird = require('bluebird');

module.exports =  Bluebird.coroutine(function * (contentTypes, makeRequest) {

  if (contentTypes.length === 0) {
    return [];
  }

  const contentTypeIds = contentTypes.map((contentType) => {
    return contentType.sys.id;
  });

  const response = yield makeRequest({
    method: 'GET',
    url: `/entries?sys.contentType.sys.id[in]=${contentTypeIds.join(',')}`
  });

  return response.items;
});