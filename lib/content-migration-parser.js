'use strict';
const ROOT_DIR = process.cwd();

const _ = require('lodash');
const Bluebird = require('bluebird');


const buildSteps = require('./content-migration-steps');
const buildChunks = require(`${ROOT_DIR}/migration-cli/lib/migration-chunks`);
const buildPlan = require(`${ROOT_DIR}/migration-cli/lib/migration-plan`);
//const buildPayloads = require('./content-migration-payloads');
//const buildRequests = require('./requests-builder');

const getContentTypesInChunks = require('./content-types-in-plan');

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
    // Create content migration
    // - steps
    // - chunks
    // - plan
    // - payloads
    // - requests

    const steps = yield buildSteps(migrationCreator);

    const chunks = buildChunks(steps);

    let contentTypes;
    /*try {
      contentTypes = yield getContentTypesInChunks(chunks, makeRequest);
    } catch (error) {
      throw new Error('SpaceAccessError'); // errors.SpaceAccessError();
    }*/

    yield hooks.onChunks(chunks);
    const plan = buildPlan(chunks);
    yield hooks.onPlan(plan);

    console.log('Plan', JSON.stringify(plan));

    //const payloads = buildPayloads(plan, contentTypes);
    
    //const requests = buildRequests(payloads, contentTypes);

    //return requests;
    return [];
  });
};

module.exports = createMigrationParser;
