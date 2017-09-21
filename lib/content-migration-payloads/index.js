const _ = require('lodash');

module.exports = (plan, entries) => {
  const entryPayloads = entries.map((entry) => {
    return {
      payload: _.cloneDeep(_.omit(entry, 'sys')),
      meta: { version: entry.sys.version, entryId: entry.sys.id, contentTypeId: entry.sys.contentType.sys.id }
    };
  });

  const initialEntryMap = _.keyBy(entryPayloads, (entry) => entry.meta.contentTypeId);
  const entryMap = {};
  
  const payloads = [];

  plan.forEach((chunk) => {
    const contentTypeId = chunk[0].payload.contentTypeId;
    const entries = entryPayloads.filter((entry) => entry.meta.contentTypeId === contentTypeId);
    entries.forEach((entry) => {

      const clonedEntry = _.cloneDeep(entry);
      let payloadVersion = entry.meta.version;
      if (entryMap[entry.meta.entryId]) {
        payloadVersion += 2;
      }
      clonedEntry.meta.version = payloadVersion;

      chunk.forEach((step) => {
        if (step.transform) {
          clonedEntry.payload = step.transform(clonedEntry.payload);
        } else {
          if (typeof clonedEntry.payload.fields[step.payload.fromId] === 'object') {
            Object.keys(clonedEntry.payload.fields[step.payload.fromId]).forEach((key) => {
              clonedEntry.payload.fields[step.payload.toId][key] = step.payload.transform(clonedEntry.payload.fields[step.payload.fromId][key]);
            });
          } else {
            clonedEntry.payload.fields[step.payload.toId] = _.cloneDeep(clonedEntry.payload.fields[step.payload.fromId]);
          }
        }
      });
      
      payloads.push(clonedEntry);
      entryMap[entry.meta.entryId] = clonedEntry;
    });
  });

  return payloads;
}