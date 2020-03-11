import express from 'express';
import { lifeCycleObserver } from '@loopback/core';
import { InstanceDto } from '../../models/cloud-service';
import * as fs from 'fs';

export interface CloudServiceMockServerData {
  port: number;
  instances: InstanceDto[];
}

@lifeCycleObserver('server')
export class CloudServiceMockServer {
  private _server = null;

  port: number;
  instances: InstanceDto[] = [];

  constructor() {
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._server != null) {
        return;
      }
      const rawAccountServiceData = fs.readFileSync('./resources/__tests__/cloudServiceData.json', 'utf8');
      const cloudServiceData = JSON.parse(rawAccountServiceData) as CloudServiceMockServerData;
      this.port = cloudServiceData.port;
      this.instances = cloudServiceData.instances;

      const app = express();
      app.use(express.json());


      app.get('/api/v1/instances', (req, res) => {
        res.status(200).send(this.instances);
      });


      app.get('/api/v1/users/:userId/instances', (req, res) => {
        const userId = +req.params.userId;
        const instances = this.instances.find(aUser => aUser.id === userId);
        res.status(200).send(instances);
      });




      app.listen(this.port, () => console.log(`Cloud Service Mock Server listening on port ${this.port}!`));

    });

  }



}
