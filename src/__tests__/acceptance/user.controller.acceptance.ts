import { Client, expect } from '@loopback/testlab';
import { ApiServiceApplication } from '../..';
import { setupApplication } from '../helpers/application.helper';
import { AccountServiceMockServer } from '../mock/account-service-mock.server';
import { CloudServiceMockServer } from '../mock/cloud-service-mock.server';

import { User } from '../../models/account-service';

describe('UserController', () => {
  let app: ApiServiceApplication;
  let client: Client;
  let accountServiceServer: AccountServiceMockServer;
  let cloudServiceServer: CloudServiceMockServer;

  before('setupApplication', async () => {
    ({ app, client, accountServiceServer, cloudServiceServer } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach('Start mock servers', async () => {
    await Promise.all([
      accountServiceServer.start()
    ]);
  });

  afterEach('Stop mock servers', async () => {
    await Promise.all([
      accountServiceServer.stop()
    ]);
  });


  it('pemission denied on GET /api/v1/users with a no admin user', async () => {
    const res = await client.get('/api/v1/users').set({ 'access_token': '2' }).expect(403);
  });

  it('invokes GET /api/v1/users with an admin user', async () => {
    const res = await client.get('/api/v1/users').set({ 'access_token': '1' }).expect(200);
    const users = res.body as User[];
    expect(users.length).to.equal(3);
  });

});
