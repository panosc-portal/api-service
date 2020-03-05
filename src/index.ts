import { ApiServiceApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import * as dotenv from 'dotenv';
dotenv.config();
import { APPLICATION_CONFIG } from './application-config';



export { ApiServiceApplication };

export async function main(options: ApplicationConfig = {}) {
  if (APPLICATION_CONFIG().port) {
    options.rest.port = APPLICATION_CONFIG().port;
  }
  const app = new ApiServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;

}
