import { bind, BindingScope } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import Axios, { AxiosInstance } from 'axios';
import { APPLICATION_CONFIG } from '../application-config';
import { User } from '../models/user.model';

@bind({ scope: BindingScope.SINGLETON })
export class AccountService {

  private _axiosInstance: AxiosInstance;

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


  async getConnectedUser(request: Request): Promise<User> {
    if (!request.headers.access_token) {
      throw new HttpErrors[403](`The user is not connected`);
    }

    const res = await this._axiosInstance.get('me', {
      headers: {
        'Content-Type': 'application/json',
        'access_token': request.headers.access_token
      }
    });
    return res.data;
  }


  async requiredRole(request: Request, roleName: string): Promise<User> {
    const connectedUser = await this.getConnectedUser(request);
    if (roleName == 'User') return; //Anyone is User => no role check required
    let connectedUserRoleName: string = 'User';
    if (connectedUser.role) {
      connectedUserRoleName = connectedUser.role.name;
    }
    if (connectedUserRoleName != roleName) {
      throw new HttpErrors[403](`The connected required role is ${roleName}`);
    }
    return connectedUser;
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

  async deleteUserById(id: Number) {
    this._axiosInstance.delete('users/' + id);
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
