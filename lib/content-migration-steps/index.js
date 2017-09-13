const Bluebird = require('bluebird');
const ROOT_DIR = process.cwd();
const DispatchProxy = require(`${ROOT_DIR}/migration-cli/lib/migration-steps/dispatch-proxy`);

const createInstanceIdManager = () => {
  const instanceCounts = {};

  return {
    getNew: (id) => {
      let instanceId;

      if ((typeof instanceCounts[id]) === 'undefined') {
        instanceId = 0;
      } else {
        instanceId = instanceCounts[id] + 1;
      }

      instanceCounts[id] = instanceId;

      return instanceId;
    }
  };
};

class ContentField extends DispatchProxy {

  constructor (id, props = {}, { dispatchUpdate }) {
    super({ dispatchUpdate });
  }

  toField() {

  }
}

class Content extends DispatchProxy {
  constructor(id, instanceId, props = {}, dispatch) {
    const dispatchUpdate = (callsite, propertyName, propertyValue) => {
      dispatch(actionCreators.contentType.update(id, instanceId, callsite, propertyName, propertyValue));
    };
    super({ dispatchUpdate });

    this.fieldInstanceIds = createInstanceIdManager();
  }

  copyField(id, init) {
    const fieldInstanceId = this.fieldInstanceIds.getNew(id);
    return new ContentField(id, init, {
      dispatchUpdate: (callsite, property, value) => {
        return this.dispatch(updateField(callsite, property, value));
      }
    });
  }
}

module.exports = Bluebird.coroutine(function * migration (migrationCreator) {
  const actions = [];
  const instanceIdManager = createInstanceIdManager();

  const dispatch = (action) => actions.push(action);

  const migration = {
    supportsContent: true,

    editContent: (id, changes) => {
      const instanceId = instanceIdManager.getNew(id);
      const content = new Content(id, instanceId, changes, dispatch);
      return content;
    }
  };

  // Create the migration
  yield Bluebird.try(function () {
    return migrationCreator(migration);
  });

  return actions;
});
