import { ApiServiceApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import * as dotenv from 'dotenv';
dotenv.config();
import { APPLICATION_CONFIG } from './application-config';
import { logger } from './utils';



export { ApiServiceApplication };

export async function main(options: ApplicationConfig = {}) {
  /*
  if (APPLICATION_CONFIG().port) {
    options.rest.port = APPLICATION_CONFIG().port;
  }
  */
  const app = new ApiServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  logger.info(`Server is running at ${url}`);

  return app;

}
