const { createServer } = require('@springworks/static-api-server').default;
const fixture_loader = require('fixture-loader');

const hapi_sov = require('@springworks/hapi-sov');
const m2h_schema_validator = require('@springworks/m2h-schema-validator');

const custom_validator = (schema, payload) => {
  try {
    return m2h_schema_validator.createValidator(schema)(payload);
  }
  catch (err) {
    if (err instanceof m2h_schema_validator.ValidationError) {
      throw new hapi_sov.ResponseValidationError(err);
    }
    throw err;
  }
};

export function createApiServer(params) {
  const created_fixture_loader = fixture_loader.create(params.fixtures_path);

  return createServer({
    swagger_spec: params.swagger_spec,
    fixture_loader: created_fixture_loader,
    host: params.host || 'localhost',
    port: params.port || 3001,
  }).then(server => {
    return server.register({
      register: hapi_sov.register,
      options: {
        swagger_document: params.swagger_spec,
        validator: custom_validator,
      },
    }).then(() => {
      return server;
    });
  });
}
