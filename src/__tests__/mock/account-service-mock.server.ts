import express from 'express';
import { lifeCycleObserver } from '@loopback/core';
import { User, Role } from "../../models";
import * as fs from 'fs';

export interface AccountServiceMockServerData {
  port: number;
  roles: Role[];
  users: User[];
}

@lifeCycleObserver('server')
export class AccountServiceMockServer {
  private _server = null;

  port: number;
  roles: Role[] = [];
  users: User[] = [];

  constructor() {
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._server != null) {
        return;
      }
      const rawAccountServiceData = fs.readFileSync('./resources/__tests__/accountServiceData.json', 'utf8');
      const accountServiceData = JSON.parse(rawAccountServiceData) as AccountServiceMockServerData;
      this.port = accountServiceData.port;
      this.roles = accountServiceData.roles;
      this.users = accountServiceData.users;

      const app = express();
      app.use(express.json());



      app.get('/api/v1/me', (req, res) => {
        //console.log("/api/v1/users");
        if (!req.header('access_token')) {
          res.status(403).send("Missing access token");
          return;
        }
        const access_token = req.header('access_token');
        let connectedUserId: number = 1;
        if (!isNaN(Number(access_token))) {
          connectedUserId = Number(access_token);
        }

        const user = this.users.find(aUser => aUser.id === connectedUserId);
        res.status(200).send(user);
      });

      app.get('/api/v1/users', (req, res) => {
        res.status(200).send(this.users);
      });

      app.get('/api/v1/users/:userId', (req, res) => {
        const userId = +req.params.userId;
        const user = this.users.find(aUser => aUser.id === userId);
        if (user != null) {
          res.status(200).send(user);
        } else {
          res.status(404).send();
        }
      });




      app.listen(this.port, () => console.log(`Account Service Mock Server listening on port ${this.port}!`));

    });

  }



}
