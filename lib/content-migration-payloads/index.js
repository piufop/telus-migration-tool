const _ = require('lodash');

module.exports = (plan, entries) => {
  const entryPayloads = entries.map((entry) => {
    return {
      payload: _.cloneDeep(_.omit(entry, 'sys')),
      meta: { version: entry.sys.version, entryId: entry.sys.id, contentTypeId: entry.sys.contentType.sys.id }
    };
  });

  const payloads = [];

  plan.forEach((chunk) => {
    const contentTypeId = chunk[0].payload.contentTypeId;
    const entries = entryPayloads.filter((entry) => entry.meta.contentTypeId === contentTypeId);
    
    entries.forEach((entry) => {
      chunk.forEach((step) => {
        entry.payload.fields[step.payload.toId] = entry.payload.fields[step.payload.fromId];
      });
    });

    payloads.push(entryPayloads);
  });

  return payloads;
}