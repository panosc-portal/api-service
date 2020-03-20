import { bind, BindingScope } from '@loopback/core';
import Axios, { AxiosInstance } from 'axios';
import { APPLICATION_CONFIG } from '../application-config';
import { InstanceDto, InstanceCreatorDto, InstanceUpdatorDto, InstanceAuthorisationDto, InstanceMember, InstanceMemberCreatorDto, InstanceMemberUpdatorDto, CloudInstanceState, CloudInstanceNetwork, CloudInstanceCommand } from '../models/cloud-service';


export class CloudServiceResponseError extends Error {
  isCloudServiceResponseError = true;
  constructor(message: string, public code: number) {
    super(message);
  }
}

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

    // Add interceptor to encapsulate cloud service response errors
    this._axiosInstance.interceptors.response.use((response) => response, (error) => {
      return Promise.reject(new CloudServiceResponseError(error.response.statusText, error.response.status));
    });
  }

  //=== Instances objects

  async getUserInstances(id: number): Promise<InstanceDto[]> {
    const res = await this._axiosInstance.get(`users/${id}/instances`);
    return res.data;
  }

  // Problèmes a regler:
  // Coté Cloud Service les post/put retournent un dto et non l'objet entier, Ca ne colle pas avec les def swagger
  // Pleins de Dto différents (create+update par entité) en params => trop de models à maintenir  => utilisation d'Object assumé :)
  // (mais jamais en résultat pour que ça colle avec swagger)

  async createUserInstance(userId: number, instanceCreator: InstanceCreatorDto): Promise<InstanceDto> {
    const res = await this._axiosInstance.post(`users/${userId}/instances`, InstanceCreatorDto);
    return res.data;
  }

  async updateUserInstance(userId: number, instanceId: number, instanceUpdatorDto: InstanceUpdatorDto): Promise<InstanceDto> {
    const res = await this._axiosInstance.post(`users/${userId}/instances/${instanceId}`, InstanceUpdatorDto);
    return res.data;
  }

  async getUserInstance(userId: number, instanceId: number): Promise<InstanceDto> {
    const res = await this._axiosInstance.get(`users/${userId}/instances/${instanceId}`);
    return res.data;
  }

  async deleteUserInstance(userId: number, instanceId: number) {
    const res = await this._axiosInstance.delete(`users/${userId}/instances/${instanceId}`);
  }

  //=== Instances info and actions (State, Network...)

  async getUserInstanceState(userId: number, instanceId: number): Promise<CloudInstanceState> {
    const res = await this._axiosInstance.get(`users/${userId}/instances/${instanceId}/state`);
    return res.data;
  }

  async getUserInstanceNetwork(userId: number, instanceId: number): Promise<CloudInstanceNetwork> {
    const res = await this._axiosInstance.get(`users/${userId}/instances/${instanceId}/network`);
    return res.data;
  }

  async executeUserInstanceAction(userId: number, instanceId: number, command: CloudInstanceCommand): Promise<InstanceDto> {
    const res = await this._axiosInstance.post(`users/${userId}/instances/${instanceId}/actions`, command);
    return res.data;
  }

  async validateUserInstanceToken(userId: number, instanceId: number, token: string): Promise<InstanceAuthorisationDto> {
    const res = await this._axiosInstance.post(`users/${userId}/instances/${instanceId}/token`, token);
    return res.data;
  }

  //=== Instances members

  async getAllUserInstanceMembers(userId: number, instanceId: number): Promise<InstanceMember[]> {
    const res = await this._axiosInstance.get(`users/${userId}/instances/${instanceId}/members`);
    return res.data;
  }

  async createUserInstanceMember(userId: number, instanceId: number, instanceMemberCreatorDto: InstanceMemberCreatorDto): Promise<InstanceMember> {
    const res = await this._axiosInstance.post(`users/${userId}/instances/${instanceId}/members`, instanceMemberCreatorDto);
    return res.data;
  }

  async updateUserInstanceMember(userId: number, instanceId: number, memberId: number, instanceMemberUpdatorDto: InstanceMemberUpdatorDto): Promise<InstanceMember> {
    const res = await this._axiosInstance.put(`users/${userId}/instances/${instanceId}/members/${memberId}`, instanceMemberUpdatorDto);
    return res.data;
  }

  async deleteUserInstanceMember(userId: number, instanceId: number, memberId: number) {
    const res = await this._axiosInstance.delete(`users/${userId}/instances/${instanceId}/members/${memberId}`);
  }



}
