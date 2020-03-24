import express from 'express';
import { lifeCycleObserver } from '@loopback/core';
import { Account, Role } from "../../models/account-service";
import * as fs from 'fs';

export interface AccountServiceMockServerData {
  port: number;
  roles: Role[];
  accounts: Account[];
}

@lifeCycleObserver('server')
export class AccountServiceMockServer {
  private _server = null;

  port: number;
  roles: Role[] = [];
  accounts: Account[] = [];

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
      this.accounts = accountServiceData.accounts;

      const app = express();
      app.use(express.json());



      app.get('/api/v1/me', (req, res) => {
        //console.log("/api/v1/accounts");
        if (!req.header('access_token')) {
          res.status(403).send("Missing access token");
          return;
        }
        const access_token = req.header('access_token');
        let connectedUserAccountId: number = 1;
        if (!isNaN(Number(access_token))) {
          connectedUserAccountId = Number(access_token);
        }

        const account = this.accounts.find(aAccount => aAccount.id === connectedUserAccountId);
        res.status(200).send(account);
      });

      app.get('/api/v1/accounts', (req, res) => {
        res.status(200).send(this.accounts);
      });

      app.get('/api/v1/accounts/:accountId', (req, res) => {
        const accountId = +req.params.accountId;
        const account = this.accounts.find(aAccount => aAccount.id === accountId);
        if (account != null) {
          res.status(200).send(account);
        } else {
          res.status(404).send();
        }
      });

      this._server = app.listen(this.port, (error) => {
        if (error) {
          console.log(`Failed to start Account Service Mock Server on port ${this.port}: ${error}`);

        } else {
          //console.log(`Account Service Mock Server listening on port ${this.port}`)
          resolve();
        }
      });

      //      app.listen(this.port, () => console.log(`Account Service Mock Server listening on port ${this.port}!`));

    });

  }


  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this._server != null) {
        this._server.close((error: Error) => {
          if (error) {
            reject(error);

          } else {
            resolve();
          }
        });
        this._server = null;

        //console.log(`Account Service Mock Server stopped with port ${this.port}`);
      }
    });
  }



}
