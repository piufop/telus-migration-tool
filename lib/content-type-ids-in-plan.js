module.exports = (plan) => {
  const updated = [];

  plan.forEach((chunk) => {
    const id = chunk[0].payload.contentTypeId;
    const types = chunk.map((action) => action.type);

    for (const type of types) {
      if (type === 'contentField/copy') {
        updated.push(id);
      }
    }
  });

  return updated;
};