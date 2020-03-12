import { ApiServiceApplication } from '../..';
import { createRestAppClient, givenHttpServerConfig, Client } from '@loopback/testlab';
import { AccountServiceMockServer } from '../mock/account-service-mock.server';
import { CloudServiceMockServer } from '../mock/cloud-service-mock.server';


export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new ApiServiceApplication({
    rest: restConfig,
    ignoreDotenv: true
  });

  // Stuart !!!
  //app.add(createBindingFromClass(KubernetesMockServer));

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  const accountServiceServer = new AccountServiceMockServer();
  const cloudServiceServer = new CloudServiceMockServer();

  return { app, client, accountServiceServer, cloudServiceServer };
}

export interface AppWithClient {
  app: ApiServiceApplication;
  client: Client;
  accountServiceServer: AccountServiceMockServer;
  cloudServiceServer: CloudServiceMockServer;
}
