const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const actionCreators = require(`${ROOT_DIR}/lib/content-migration-steps/action-creators`);

describe('action-creators', () => {
  describe('when executing a migration', () => {
    it('creates field copy action', () => {
      const contentTypeId = 0;
      const contentTypeInstanceId = 1;
      const fromId = 'author';
      const toId = 'new-author';
      const fieldInstanceId = 3;

      const result = actionCreators.contentField.copy(contentTypeId, fromId, toId, contentTypeInstanceId, fieldInstanceId);
      
      expect(result).to.be.a('object');
      expect(result).to.have.property('type', 'contentField/copy');
      expect(result).to.have.deep.property('meta', {
        contentTypeInstanceId: 'content/0/1',
        fieldInstanceId: 'fields/author/new-author/3'
      });
      expect(result).to.have.deep.property('payload', {
        contentTypeId: 0,
        fromId: 'author',
        toId: 'new-author'
      });
    });
  });
});