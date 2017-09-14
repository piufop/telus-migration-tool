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
  }
};

module.exports = actionCreators;