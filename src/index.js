import { constructRequests } from '@springworks/swagger-example-requests';
import url from 'url';
const querystring = require('querystring');

export async function testServer(server, base_url, swagger_spec, generateRequests = constructRequests) {
  const generated_requests = await generateRequests(swagger_spec);
  for (const generated_request of generated_requests.requests) {
    const { method, body, qs, headers } = generated_request;
    const query_string = Object.keys(qs).length ? `?${querystring.stringify(qs)}` : '';
    const uri = `${url.resolve(base_url, generated_request.url)}${query_string}`;
    await server.inject({ url: uri, method, payload: body, headers });
  }
}
