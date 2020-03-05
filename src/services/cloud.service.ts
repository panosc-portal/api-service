import { bind, BindingScope } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import Axios, { AxiosInstance } from 'axios';
import { APPLICATION_CONFIG } from '../application-config';
import { Instance } from '../models';

@bind({ scope: BindingScope.SINGLETON })
export class CloudService {

  private _axiosInstance: AxiosInstance;

  constructor() {
    this._axiosInstance = Axios.create({
      baseURL: 'http://' + APPLICATION_CONFIG().cloudService.host + ':' + APPLICATION_CONFIG().cloudService.port + '/api/v1/',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }


  async getInstancesByUserId(id: number): Promise<Instance[]> {
    const res = await this._axiosInstance.get(`users/${id}/instances`);
    return res.data;
  }

  // Problèmes a regler:
  // Coté Cloud Service tous les post/put instances retournent un InstanceDto et non une Instance
  // Ca ne colle pas avec la def swagger
  // Et il ne passe pas le meme objet en get/post/put => ici instanceDto = Object

  async postInstanceByUserId(userId: number, instanceDto: object): Promise<Instance> {
    const res = await this._axiosInstance.post(`users/${userId}/instances`, instanceDto);
    return res.data;
  }

  async putInstanceByUserId(userId: number, instanceId: number, instanceDto: object): Promise<Instance> {
    const res = await this._axiosInstance.post(`users/${userId}/instances/${instanceId}`, instanceDto);
    return res.data;
  }

  async getInstanceByUserIdInstanceId(userId: number, instanceId: number): Promise<Instance> {
    const res = await this._axiosInstance.get(`users/${userId}/instances/${instanceId}`);
    return res.data;
  }

  async deleteInstanceByUserIdInstanceId(userId: number, instanceId: number) {
    const res = await this._axiosInstance.delete(`users/${userId}/instances/${instanceId}`);
  }


  async getXxx(): Promise<Instance> {
    const res = await this._axiosInstance.get('xxx');
    return res.data;
  }


}
