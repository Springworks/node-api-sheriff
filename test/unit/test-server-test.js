import { ApiBuilder } from '../../test-util/api-builder';
import autoRestoredSandbox from '@springworks/test-harness/autorestored-sandbox';

const proxyquire = require('proxyquire');
describe('test/unit/test-server-test.js', () => {
  let api;
  const sinon_sandbox = autoRestoredSandbox();

  describe('testServer', () => {

    beforeEach(() => {
      api = {
        swagger: '2.0',
        info: {
          version: '1.0.0',
          title: 'something',
        },
        consumes: [
          'application/json',
        ],
        produces: [
          'application/json',
        ],
        paths: {},
      };
    });

    describe('with a valid api spec', () => {
      let rpStub;
      let testServer;

      beforeEach(() => {
        new ApiBuilder(api)
            .addPath('/users')
            .addOperation('post')
            .addQueryParameter({ name: 'id', type: 'string' })
            .addBodyParameter({
              name: 'user',
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  age: { type: 'integer' },
                  sex: { type: 'string', enum: ['female', 'male', 'other'] },
                },
              },
            });
      });

      beforeEach('stub rp', () => {
        rpStub = sinon_sandbox.stub();
        rpStub.resolves({});
        testServer = proxyquire('../../src/', { 'request-promise': rpStub }).testServer;
      });

      describe('without base path', () => {
        beforeEach('stub rp', () => {
          return testServer({ base_url: 'http://localhost/', port: 3001, swagger_spec: api });
        });

        it('should invoke a request once with correct params', () => {
          rpStub.should.be.calledOnce();
          rpStub.firstCall.args[0].should.match({
            baseUrl: 'http://localhost:3001',
            json: {
              age: 0,
              name: /.*/,
              sex: /\b(female|male|other)\b/,
            },
            method: 'post',
            qs: {
              id: /.*/,
            },
            uri: '/users',
          });
        });

      });

      describe('including base path', () => {
        beforeEach(() => {
          new ApiBuilder(api)
              .setBasePath('/api');
        });

        beforeEach('stub rp', () => {
          return testServer({ base_url: 'http://localhost/', port: 3001, swagger_spec: api });
        });

        it('should invoke a request once with correct params', () => {
          rpStub.should.be.calledOnce();
          rpStub.firstCall.args[0].should.match({
            baseUrl: 'http://localhost:3001',
            json: {
              age: 0,
              name: /.*/,
              sex: /\b(female|male|other)\b/,
            },
            method: 'post',
            qs: {
              id: /.*/,
            },
            uri: '/api/users',
          });
        });
      });

      describe('excluding port', () => {
        beforeEach('stub rp', () => {
          return testServer({ base_url: 'http://localhost/', swagger_spec: api });
        });

        it('should invoke a request once with correct params', () => {
          rpStub.should.be.calledOnce();
          rpStub.firstCall.args[0].should.match({
            baseUrl: 'http://localhost',
            json: {
              age: 0,
              name: /.*/,
              sex: /\b(female|male|other)\b/,
            },
            method: 'post',
            qs: {
              id: /.*/,
            },
            uri: '/users',
          });
        });
      });

    });

  });
});
