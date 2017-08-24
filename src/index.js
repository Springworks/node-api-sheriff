import { constructRequests } from '@springworks/request-baker';
import rp from 'request-promise';
import path from 'path';

export async function testServer({ base_url, port, swagger_spec, generateRequests }) {
  const getRequests = generateRequests || constructRequests;
  const { requests } = await getRequests(swagger_spec);
  for (const generated_request of requests) {
    const { method, body: json, qs, headers, base_path } = generated_request;
    const request_path = path.join(base_path || '', generated_request.path);
    const base_url_with_port = `${base_url.replace(/\/+$/, '')}${port ? `:${port}` : ''}`;
    try {
      await rp({ uri: request_path, baseUrl: base_url_with_port, method, qs, headers, json });
    }
    catch (err) {
      const message = `
-------------------------------REQUEST FAILED-------------------------------
The request failed which can either be caused by incorrectly generated request
parameters or invalid returned data from the endpoint.
In the former case please fix in https://github.com/springworks/node-swagger-example-requests.
In the latter case make sure the returned data complies with the specification.
Used request data:
${JSON.stringify(generated_request, null, 2)}
Error returned from the request:
${err}`;
      throw new Error(message);
    }
  }
}
