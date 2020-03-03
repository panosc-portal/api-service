import { bind, BindingScope } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import Axios, { AxiosInstance } from 'axios';
import { APPLICATION_CONFIG } from '../application-config';
import { User } from '../models/user.model';

@bind({ scope: BindingScope.SINGLETON })
export class AccountService {

  private _axiosInstance: AxiosInstance;
  private _connectedUser: User = null;

  constructor() {
    //https://levelup.gitconnected.com/a-typescript-safe-api-82cc22c4f92d
    this._axiosInstance = Axios.create({
      baseURL: 'http://' + APPLICATION_CONFIG().accountService.host + ':' + APPLICATION_CONFIG().accountService.port + '/api/v1/',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }


  async getConnectedUser(): Promise<User> {
    if (!this._connectedUser) {
      const res = await this._axiosInstance.get('me');
      this._connectedUser = res.data;
    }
    return this._connectedUser;
  }

  async requiredRole(roleName: string): Promise<void> {
    const connectedUser = await this.getConnectedUser();
    const connectedUserRoleName = connectedUser.role.name;
    if (connectedUserRoleName != roleName) {
      throw new HttpErrors[403](`The connected required role is ${roleName}`);
    }
  }



  async getUsers(): Promise<User[]> {
    const res = await this._axiosInstance.get('users');
    return res.data;
  }


  async getUserById(id: number): Promise<User> {
    try {
      const res = await this._axiosInstance.get('users/' + id);
      return res.data;
    } catch (error) {
      //logger.error(`Got error getting ${this._baseUrl} from provider '${provider.name}': ${error}`);
      throw error;
      //return {};
    }


  }







  /*
      private async _getApi(endpoint: string): Promise<any> {
        try {
          const res = await this._axiosInstance.get(endpoint);
          return res.data;
        } catch (error) {
          //logger.error(`Got error getting ${this._baseUrl} from provider '${provider.name}': ${error}`);
          throw error;
        }
      }
      */

}
