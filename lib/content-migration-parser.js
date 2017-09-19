'use strict';
const ROOT_DIR = process.cwd();

const _ = require('lodash');
const Bluebird = require('bluebird');

const buildSteps = require(`${ROOT_DIR}/lib/content-migration-steps`);
const buildChunks = require(`${ROOT_DIR}/migration-cli/lib/migration-chunks`);
const buildPlan = require(`${ROOT_DIR}/migration-cli/lib/migration-plan`);
const buildPayloads = require(`${ROOT_DIR}/lib/content-migration-payloads`);
const buildRequests = require(`${ROOT_DIR}/lib/content-requests-builder`);

const getContentTypesInChunks = require('./content-types-in-plan');
const getEntriesByContentTypes = require('./entries-by-content-types');

//const errors = require('./errors');

const createMigrationParser = function (makeRequest, hooks) {
  hooks = Object.assign({
    onSteps: () => {},
    onChunks: () => {},
    onPlan: () => {},
    onPayloads: () => {}
  }, hooks);

  // Ensure we follow the promise interface
  hooks = _.mapValues(hooks, (hook) => {
    return Bluebird.method(hook);
  });

  return Bluebird.coroutine(function * migration (migrationCreator) {
    const steps = yield buildSteps(migrationCreator);

    const chunks = buildChunks(steps);

    let contentTypes;
    let entries;
    try {
      contentTypes = yield getContentTypesInChunks(chunks, makeRequest);
      entries = yield getEntriesByContentTypes(contentTypes, makeRequest);
    } catch (error) {
      throw new Error(`Unhandled error: ${error}`);
    }

    yield hooks.onChunks(chunks);

    const plan = buildPlan(chunks);
    
    yield hooks.onPlan(plan);

    const payloads = buildPayloads(plan, entries);

    const requests = buildRequests(payloads);

    return requests;
  });
};

module.exports = createMigrationParser;
