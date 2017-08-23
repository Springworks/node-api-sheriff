import { constructRequests } from '@springworks/request-baker';
import url from 'url';
import rp from 'request-promise';
import path from 'path';
const querystring = require('querystring');

export async function testServer(base_url, swagger_spec, generateRequests = constructRequests) {
  const { requests } = await generateRequests(swagger_spec);
  for (const generated_request of requests) {
    const { method, body, qs, headers, base_path } = generated_request;
    const query_string = Object.keys(qs).length ? `?${querystring.stringify(qs)}` : '';
    const uri = `${url.resolve(base_url, path.join(base_path, generated_request.path))}${query_string}`;
    try {
      await rp({ uri, method, qs, headers, json: body });
    }
    catch (err) {
      const message = `
-------------------------------REQUEST FAILED-------------------------------
The request failed which can either be caused by incorrectly generated request
parameters or invalid returned data from the endpoint.
In the former case please fix in https://github.com/springworks/node-swagger-example-requests.
In the latter case make sure the returned data complies with the specification.
Used request data:
${JSON.stringify({ uri, method, body, qs, headers }, null, 2)}
Error returned from the request:
${err}`;
      throw new Error(message);
    }
  }
}
