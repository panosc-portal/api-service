import { ApiServiceApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import * as dotenv from 'dotenv';
dotenv.config();
import { AccountServiceMockServer } from './__tests__/mock/account-service-mock.server';


export { ApiServiceApplication };

export async function main(options: ApplicationConfig = {}) {

  const app = new ApiServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;

}
