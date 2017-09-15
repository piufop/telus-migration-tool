
module.exports = (payloads) => {
  const requests = [];

  payloads.forEach((payload) => {
    requests.push({
      method: 'PUT',
      url: `/entries/${payload.meta.entryId}`,
      headers: {
        'X-Contentful-Content-Type': payload.meta.contentTypeId,
        'X-Contentful-Version': payload.meta.version
      },
      data: payload.payload
    });

    requests.push({
      method: 'PUT',
      url: `/entries/${payload.meta.entryId}/published`,
      headers: {
        'X-Contentful-Version': payload.meta.version + 1
      }
    });
  });

  return requests;
}