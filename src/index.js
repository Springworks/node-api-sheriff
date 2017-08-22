import { constructRequests } from '@springworks/request-bakery';
import url from 'url';
import rp from 'request-promise';
import path from 'path';
const querystring = require('querystring');
const logger = console;

export async function testServer(base_url, swagger_spec, generateRequests = constructRequests) {
  const { requests } = await generateRequests(swagger_spec);
  for (const generated_request of requests) {
    const { method, body, qs, headers, base_path } = generated_request;
    const query_string = Object.keys(qs).length ? `?${querystring.stringify(qs)}` : '';
    const uri = `${url.resolve(base_url, path.join(base_path, generated_request.url))}${query_string}`;
    try {
      await rp({ uri, method, qs, headers, json: body });
    }
    catch (err) {
      logger.log('\n-------------------------------REQUEST FAILED-------------------------------');
      logger.log('The request failed which can either be caused by incorrectly generated request\n parameters or invalid returned data from the endpoint.');
      logger.log('In the former case please fix in https://github.com/springworks/node-swagger-example-requests.');
      logger.log('In the latter case make sure the returned data complies with the specification.\n');
      logger.log('Used request data:\n');
      logger.log({ uri, method, body, qs, headers });
      logger.log(`\nError returned from the request:\n ${err}`);
      throw err;
    }
  }
}
