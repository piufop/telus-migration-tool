const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const createSteps = require(`${ROOT_DIR}/lib/content-migration-steps`);

describe('content-migration-steps', () => {
  describe('when executing a migration', () => {
    it('create steps', (done) => {
      const contentMigrationScript = (migration) => {
          if (migration.supportsContent) {
            const songContent = migration.editContent('song');
            songContent.copyField('name').to('new name');
          }
      };

      createSteps(contentMigrationScript).then((steps) => {
        expect(false).to.be.a('string');
        done();
      });
    });
  });
});