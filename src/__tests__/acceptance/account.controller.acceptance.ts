import { Client, expect } from '@loopback/testlab';
import { ApiServiceApplication } from '../..';
import { setupApplication } from '../helpers/application.helper';
import { AccountServiceMockServer } from '../mock/account-service-mock.server';
import { CloudServiceMockServer } from '../mock/cloud-service-mock.server';

import { User } from '../../models/account-service';

describe('AccountController', () => {
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


  it('fails on /api/v1/account without token', async () => {
    const res = await client.get('/api/v1/account').expect(403);

  });

  it('invokes GET /api/v1/account with the user 1 token', async () => {
    const res = await client.get('/api/v1/account').set({ 'access_token': '1' }).expect(200);

    const user = res.body as User;
    expect(user.roles[0].name).to.equal('admin');
  });



});
