const actionCreators = {
  contentField: {
    copy: (contentTypeId, fromId, toId, contentTypeInstanceId, fieldInstanceId) => ({
      type: 'contentField/copy',
      meta: {
        contentTypeInstanceId: `content/${contentTypeId}/${contentTypeInstanceId}`,
        fieldInstanceId: `fields/${fromId}/${toId}/${fieldInstanceId}`
      },
      payload: {
        contentTypeId: contentTypeId,
        fromId: fromId,
        toId: toId,
      }
    })
  },
  content: {
    transform: (contentTypeId, contentTypeInstanceId, transformation) => ({
      type: 'content/transform',
      transform: transformation,
      meta: {
        contentTypeInstanceId: `content/${contentTypeId}/${contentTypeInstanceId}`
      },
      payload: {
        contentTypeId: contentTypeId
      }
    })
  }
};

module.exports = actionCreators;