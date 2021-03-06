const ROOT_DIR = process.cwd();
const { expect } = require('chai');

const contentMigrationPayloads = require(`${ROOT_DIR}/lib/content-migration-payloads`);

describe('content-migration-payloads', () => {
  it('creates payloads for copying 1 field', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "transform": (content) => (content),
            "contentTypeId": "song",
            "fromId": "title",
            "toId": "track"
          }
        }]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": ""
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Break on through"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('creates payloads for copying 2 field', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content),
            "fromId": "title",
            "toId": "track"
          }
        },
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/name/album/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content),
            "fromId": "name",
            "toId": "album"
          }
        }]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": ""
          },
          "name": {
            "en-US": "The Doors"
          },
          "album": {
            "en-US": ""
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
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
          "album": {
            "en-US": "The Doors"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('transform entries', () => {
    const plan = [
      [
        {
          type: "content/transform",
          transform: (entry) => {
            Object.keys(entry.fields.title).forEach((key) => {
              entry.fields['track'][key] = entry.fields.title[key].slice(0, 5);
            });
            return entry;
          },
          meta: {
            contentTypeInstanceId: "content/song/0"
          },
          payload: {
            contentTypeId: "song"
          }
        }
      ]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": ""
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Break"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('copy and transform entries', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content),
            "fromId": "title",
            "toId": "track"
          }
        }, {
          type: "content/transform",
          transform: (entry) => {
            Object.keys(entry.fields.title).forEach((key) => {
              entry.fields['track'][key] = entry.fields.title[key].slice(0, 5);
            });
            return entry;
          },
          meta: {
            contentTypeInstanceId: "content/song/0"
          },
          payload: {
            contentTypeId: "song"
          }
        } 
      ]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": ""
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Break"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('controls version for more than one change in the same content type', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content),
            "fromId": "title",
            "toId": "track"
          }
        }, {
          type: "content/transform",
          transform: (entry) => {
            Object.keys(entry.fields.title).forEach((key) => {
              entry.fields['track'][key] = entry.fields.title[key].slice(0, 5);
            });
            return entry;
          },
          meta: {
            contentTypeInstanceId: "content/song/0"
          },
          payload: {
            contentTypeId: "song"
          },
        }
      ], [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content),
            "fromId": "title",
            "toId": "track"
          }
        }
      ]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": ""
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(2);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Break"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }, {
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Break on through"
          }
        }
      },
      "meta": {
        "version": 10,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('applies transform to a content with locale', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content.slice(0, 2)),
            "fromId": "title",
            "toId": "track"
          }
        }
      ]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": ""
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": {
            "en-US": "Break on through"
          },
          "track": {
            "en-US": "Br"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('applies transform to a content without locale', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content.slice(0, 2)),
            "fromId": "title",
            "toId": "track"
          }
        }
      ]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": "Break on through",
          "track": ""
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": "Break on through",
          "track": "Br"
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });

  it('applies transform to a content that was created in the same script', () => {
    const plan = [
      [
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/title/track/0"
          },
          "payload": {
            "contentTypeId": "song",
            "transform": (content) => (content.slice(0, 2)),
            "fromId": "title",
            "toId": "track"
          }
        }
      ]
    ];

    const entries = [
      {
        "sys": {
          "space": {
            "sys": {
              "type": "Link",
              "linkType": "Space",
              "id": "tjj66gb8nfwn"
            }
          },
          "id": "2DiUM9ZZMsIGKsM08YYQge",
          "type": "Entry",
          "createdAt": "2017-09-07T19:50:04.231Z",
          "updatedAt": "2017-09-07T19:51:07.532Z",
          "createdBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "updatedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedCounter": 1,
          "version": 8,
          "publishedBy": {
            "sys": {
              "type": "Link",
              "linkType": "User",
              "id": "4EHGw9NLlQYCVy1RY5kHuI"
            }
          },
          "publishedVersion": 7,
          "firstPublishedAt": "2017-09-07T19:51:07.532Z",
          "publishedAt": "2017-09-07T19:51:07.532Z",
          "contentType": {
            "sys": {
              "type": "Link",
              "linkType": "ContentType",
              "id": "song"
            }
          }
        },
        "fields": {
          "title": {
            "en-US": "The arrival"
          }
        }
      }
    ];

    const payloads = contentMigrationPayloads(plan, entries);

    expect(payloads).to.be.a('Array');
    expect(payloads).to.have.length(1);
    expect(payloads).to.have.deep.equal([{
      "payload": {
        "fields": {
          "title": {
            "en-US": "The arrival"
          },
          "track": {
            "en-US": "Th"
          }
        }
      },
      "meta": {
        "version": 8,
        "entryId": "2DiUM9ZZMsIGKsM08YYQge",
        "contentTypeId": "song"
      }
    }]);
  });
  
});