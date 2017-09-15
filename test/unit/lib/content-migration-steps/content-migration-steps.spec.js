const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const createSteps = require(`${ROOT_DIR}/lib/content-migration-steps`);

describe('content-migration-steps', () => {
  describe('when executing a migration', () => {
    it('create steps', (done) => {
      const contentMigrationScript = (migration) => {
          if (migration.supportsContent) {
            const songContent = migration.editContent('song');
            songContent.copyField('author').toField('new-author');
          }
      };
      createSteps(contentMigrationScript).then((steps) => {
        expect(steps).to.be.a('Array');
        expect(steps).to.have.length(1);
        expect(steps).to.deep.include({
          type: 'contentField/copy',
          meta: { 
            contentTypeInstanceId: 'content/song/0',
            fieldInstanceId: 'fields/author/new-author/0' 
          },
          payload: { 
            contentTypeId: 'song', 
            fromId: 'author', 
            toId: 'new-author' 
          }
        });
        done();
      });
    });
  });
});