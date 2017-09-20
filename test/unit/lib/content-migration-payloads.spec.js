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
            "fieldInstanceId": "fields/title/new-title/0"
          },
          "payload": {
            "contentTypeId": "song",
            "fromId": "title",
            "toId": "new-title"
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
            "en-US": "Bacon Cru"
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
            "fieldInstanceId": "fields/title/new-title/0"
          },
          "payload": {
            "contentTypeId": "song",
            "fromId": "title",
            "toId": "new-title"
          }
        },
        {
          "type": "contentField/copy",
          "meta": {
            "contentTypeInstanceId": "content/song/0",
            "fieldInstanceId": "fields/name/album-name/0"
          },
          "payload": {
            "contentTypeId": "song",
            "fromId": "name",
            "toId": "album-name"
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
            "en-US": ""
          },
          "name": {
            "en-US": "Open Doors"
          },
          "album-name": {
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
            "en-US": "Bacon Cru"
          },
          "name": {
            "en-US": "Open Doors"
          },
          "album-name": {
            "en-US": "Open Doors"
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
              entry.fields['new-title'][key] = entry.fields.title[key].slice(0, 5);
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
            "en-US": "Bacon"
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
            "fieldInstanceId": "fields/title/new-title/0"
          },
          "payload": {
            "contentTypeId": "song",
            "fromId": "title",
            "toId": "new-title"
          }
        }, {
          type: "content/transform",
          transform: (entry) => {
            Object.keys(entry.fields.title).forEach((key) => {
              entry.fields['new-title'][key] = entry.fields.title[key].slice(0, 5);
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
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
            "en-US": "Bacon Cru"
          },
          "new-title": {
            "en-US": "Bacon"
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