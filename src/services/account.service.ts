import { bind, BindingScope } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import Axios, { AxiosInstance } from 'axios';
import { APPLICATION_CONFIG } from '../application-config';
import { Account } from '../models/account-service';
import { APIResponseError } from '../utils';

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

    // Add interceptor to encapsulate account service response errors
    this._axiosInstance.interceptors.response.use((response) => response, (error) => {
      let responseErrorMessage = null;
      if (error.response.data && error.response.data.error) {
        responseErrorMessage = error.response.data.error.message;
      }
      const errorMessage = error.response.statusText + (responseErrorMessage ? ': ' + responseErrorMessage : '');

      return Promise.reject(new APIResponseError(errorMessage, error.response.status));
    });
  }

  //=== Connected Account and Role

  // Return the connected account for convenience
  async getConectedUserAccount(request: Request): Promise<Account> {
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


  async requiredRole(request: Request, roleName: string): Promise<Account> {
    const connectedUserAccount = await this.getConectedUserAccount(request);
    if (roleName == 'user') return; //Anyone is user => no role check required
    if (connectedUserAccount.roles == null || connectedUserAccount.roles.find(role => role.name === roleName) == null) {
      throw new HttpErrors[403](`The connected required role is ${roleName}`);
    }
    return connectedUserAccount;
  }

  async requireAdminRole(request: Request): Promise<Account> {
    return this.requiredRole(request, 'admin');
  }

  isAdmin(account: Account): boolean {
    if (!account.roles) return false;
    return account.roles.find(role => role.name === 'admin') != null;
  }


  //=== Accounts object

  async getAccounts(): Promise<Account[]> {
    const res = await this._axiosInstance.get('accounts');
    return res.data;
  }

  async getAccount(id: number): Promise<Account> {
    const res = await this._axiosInstance.get(`accounts/${id}`);
    return res.data;
  }

  async createAccount(accountCreatorDto: Object): Promise<Account> {
    const res = await this._axiosInstance.post('accounts', accountCreatorDto);
    return res.data;
  }

  async updateAccount(id: number, accountUpdatorDto: Object): Promise<Account> {
    const res = await this._axiosInstance.put(`accounts/${id}`, accountUpdatorDto);
    return res.data;
  }

  async deleteAccount(id: Number): Promise<boolean> {
    const res = await this._axiosInstance.delete(`accounts/${id}`);
    return res.data
  }

  //=== Accounts roles

  async addAccountRole(accountId: number, roleId: number): Promise<Account> {
    const res = await this._axiosInstance.post(`accounts/${accountId}/roles/${roleId}`);
    return res.data;
  }

  async deleteAccountRole(accountId: number, roleId: number): Promise<boolean> {
    const res = await this._axiosInstance.delete(`accounts/${accountId}/roles/${roleId}`);
    return res.data;
  }


  //=== Roles



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
