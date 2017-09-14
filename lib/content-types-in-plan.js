const Bluebird = require('bluebird');

const contentTypeIdsInPlan = require('./content-type-ids-in-plan');

module.exports =  Bluebird.coroutine(function * (plan, makeRequest) {
  const contentTypeIds = contentTypeIdsInPlan(plan);

  if (contentTypeIds.length === 0) {
    return [];
  }

  const response = yield makeRequest({
    method: 'GET',
    url: `/content_types?sys.id[in]=${contentTypeIds.join(',')}`
  });

  return response.items;
});