const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const requestsBuilder = require(`${ROOT_DIR}/lib/content-requests-builder`);

describe('content-requests-builder', () => {
  it('create requests from the payload', () => {
    const payloads = [{
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Break on through"
          },
          "name": {
            "en-US": "The Doors"
          },
          "albumName": {
            "en-US": "The Doors"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }];

    const requests = requestsBuilder(payloads);

    expect(requests).to.be.a('Array');
    expect(requests).to.have.length(2);
    expect(requests).to.deep.equal([
      {
        method: 'PUT',
        url: '/entries/2DiUM9ZZMsIGKsM08YYQge',
        headers: {
          'X-Contentful-Content-Type': 'song',
          'X-Contentful-Version': 8
        },
        data: {
          fields: {
            'title': {
              'en-US': 'Break on through'
            },
            'track': {
              'en-US': 'Break on through'
            },
            'name': {
              'en-US': 'The Doors'
            },
            'albumName': {
              'en-US': 'The Doors'
            }
          }
        }
      },
      {
        method: 'PUT',
        url: '/entries/2DiUM9ZZMsIGKsM08YYQge/published',
        headers: {
          'X-Contentful-Version': 9
        }
      }
    ]);
  });
});