const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const createSteps = require(`${ROOT_DIR}/lib/content-migration-steps`);

describe('content-migration-steps', () => {
  describe('when executing a migration', () => {
    it('create steps', (done) => {
      const contentMigrationScript = (migration) => {
        if (migration.supportsContent) {
          const songContent = migration.editContent('song');
          songContent.copyField('author').toField('singer');
        }
      };
      createSteps(contentMigrationScript).then((steps) => {
        expect(steps).to.be.a('Array');
        expect(steps).to.have.length(1);
        expect(steps[0].type).to.equal('contentField/copy');
        expect(steps[0].meta).to.include({
          contentTypeInstanceId: 'content/song/0',
          fieldInstanceId: 'fields/author/singer/0'
        });
        expect(steps[0].payload).to.include({
          contentTypeId: 'song',
          fromId: 'author',
          toId: 'singer'
        });
        done();
      });
    });
  });

  it('transform entries', (done) => {
    const transformation = () => {};

    const contentMigrationScript = (migration) => {
      if (migration.supportsContent) {
        const songContent = migration.editContent('song');
        songContent.transform(transformation);
      }
    };
    
    createSteps(contentMigrationScript).then((steps) => {
      expect(steps).to.be.a('Array');
      expect(steps).to.have.length(1);
      expect(steps).to.deep.include({
        type: 'content/transform',
        transform: transformation,
        meta: {
          contentTypeInstanceId: 'content/song/0'
        },
        payload: {
          contentTypeId: 'song'
        }
      });
      done();
    });
  });

  it('transform a single field', (done) => {
    const transformation = () => {};

    const contentMigrationScript1 = (migration) => {
      if (migration.supportsContent) {
        const songContent = migration.editContent('song');
        songContent.copyField('author').transform(transformation).toField('singer');
      }
    };

    createSteps(contentMigrationScript1).then((steps) => {
      expect(steps).to.be.a('Array');
      expect(steps).to.have.length(1);
      expect(steps).to.deep.include({
        type: 'contentField/copy',
        meta: {
          contentTypeInstanceId: 'content/song/0',
          fieldInstanceId: 'fields/author/singer/0'
        },
        payload: {
          contentTypeId: 'song',
          transform: transformation,
          fromId: 'author',
          toId: 'singer'
        }
      });
      done();
    });
  });

});