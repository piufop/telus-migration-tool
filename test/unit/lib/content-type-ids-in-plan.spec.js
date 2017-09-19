const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const contentTypeIdsInPlan = require(`${ROOT_DIR}/lib/content-type-ids-in-plan`);

describe('content-type-ids-in-plan', () => {
  it('get content type ids from plan', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/song/newName/0"
          },
          "payload": {
            "contentTypeId": "song",
            "fromId": "song",
            "toId": "newName"
          }
        }
      ],
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song1/0",
            "fieldInstanceId": "fields/song1/newName2/0"
          },
          "payload": {
            "contentTypeId": "song1",
            "fromId": "song1",
            "toId": "newName2"
          }
        }
      ]
    ];

    const contentTypeIds = contentTypeIdsInPlan(plan);

    expect(contentTypeIds).to.be.a('Array');
    expect(contentTypeIds).to.have.length(2);
    expect(contentTypeIds).to.deep.equal(['song', 'song1']);
  });

  it('get content type ids from transformation plan', () => {
    const plan = [
      [
        {
          "type": "content/transform",
          "meta": {
            "contentTypeInstanceId": "content/song/0"
          },
          "payload": {
            "contentTypeId": "song"
          }
        }
      ]
    ];

    const contentTypeIds = contentTypeIdsInPlan(plan);

    expect(contentTypeIds).to.be.a('Array');
    expect(contentTypeIds).to.have.length(1);
    expect(contentTypeIds).to.deep.equal(['song']);
  });
});