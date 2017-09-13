const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const actionCreators = require(`${ROOT_DIR}/lib/content-migration-steps/action-creators`);

describe('action-creators', () => {
  describe('when executing a migration', () => {
    it.only('create actions', () => {
      const id = 1;
      const contentTypeInstanceId = 0;
      const property = 'name';
      const value = 'John';
      
      const result = actionCreators.content.update(id, contentTypeInstanceId, property, value);

      expect(result).to.be.a('object');
      expect(result).to.have.property('type', 'content/update');
      expect(result).to.have.deep.property('meta', { contentTypeInstanceId: 0 });
      expect(result).to.have.deep.property('payload', {
        contentTypeId: 1,
        props: {
          name: 'John'
        }
      });
    });
  });
});