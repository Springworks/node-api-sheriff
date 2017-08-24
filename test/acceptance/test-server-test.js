import { testServer } from '../../src';
import { createApiServer } from '../test-server';
const path = require('path');
const fs = require('fs');

describe('test/acceptance/test-server-test.js', () => {

  describe('when running server tester', () => {
    let server;
    let fixtures_path;
    let swagger_spec;

    describe('when there are valid fixtures for all endpoints', () => {
      fixtures_path = path.join(__dirname, '../fixtures/valid_fixtures');

      before(done => {
        fs.readFile(path.join(fixtures_path, 'api.json'), (err, data) => {
          if (err) {
            throw err;
          }
          swagger_spec = JSON.parse(data);
          done();
        });
      });

      before(() => {
        return createApiServer({ fixtures_path, host: 'localhost', port: 3001, swagger_spec })
            .then(srv => {
              server = srv;
              return server.start().then(() => {
                return server;
              });
            });
      });

      after(() => {
        return server.stop();
      });

      it('should not err', () => {
        return testServer({ base_url: 'http://localhost', port: 3001, swagger_spec }).then(res => {
        });
      });

    });

    describe('when there are invalid fixtures for some endpoints', () => {
    });
  });
});
