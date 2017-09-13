const actionCreators = {
  content: {
    update: (id, contentTypeInstanceId, property, value) => (
      {
        type: 'content/update',
        meta: {
          contentTypeInstanceId: contentTypeInstanceId
        },
        payload: {
          contentTypeId: id,
          props: {
            [property]: value
          }
        }
      }
    )
  }
}

module.exports = actionCreators;