const Bluebird = require('bluebird');
const ROOT_DIR = process.cwd();
const DispatchProxy = require(`${ROOT_DIR}/migration-cli/lib/migration-steps/dispatch-proxy`);
const actionCreators = require(`${ROOT_DIR}/lib/content-migration-steps/action-creators`);

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
  constructor (id, idFrom, instanceId, fieldInstanceId, dispatch) {
    const empty = () => {};
    super({ empty });
    this.id = id;
    this.idFrom = idFrom;
    this.instanceId = instanceId;
    this.fieldInstanceId = fieldInstanceId;
    this.dispatch = dispatch;
    this.transformation = (content) => { return content };
  }

  toField(idTo) {
    this.dispatch(actionCreators.contentField.copy(this.id, this.idFrom, idTo, this.transformation, this.instanceId, this.fieldInstanceId));
  }

  transform(transformation) {
    this.transformation = transformation;
    return this;
  }
}

class Content extends DispatchProxy {
  constructor(contentTypeId, instanceId, dispatch) {
    const empty = () => {};
    super({ empty });

    this.fieldInstanceIds = createInstanceIdManager();
    this.id = contentTypeId;
    this.instanceId = instanceId;
    this.dispatch = dispatch;
  }

  copyField(idFrom) {
    const fieldInstanceId = this.fieldInstanceIds.getNew(idFrom);
    return new ContentField(this.id, idFrom, this.instanceId, fieldInstanceId, this.dispatch);
  }

  transform(transformation) {
    this.dispatch(actionCreators.content.transform(this.id, this.instanceId, transformation));
  }
}

module.exports = Bluebird.coroutine(function * migration (migrationCreator) {
  const actions = [];
  const instanceIdManager = createInstanceIdManager();

  const dispatch = (action) => {
    actions.push(action)
  };

  const migration = {
    supportsContent: true,

    editContent: (id) => {
      const instanceId = instanceIdManager.getNew(id);
      return new Content(id, instanceId, dispatch);
    }
  };

  // Create the migration
  yield Bluebird.try(function () {
    return migrationCreator(migration);
  });

  return actions;
});
