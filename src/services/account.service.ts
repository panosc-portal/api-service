import { bind, BindingScope, inject } from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import { AxiosInstance } from 'axios';
import { Account } from '../models/account-service';
import { PanoscCommonTsComponentBindings } from '@panosc-portal/panosc-common-ts';

@bind({ scope: BindingScope.CONTEXT })
export class AccountService {

  constructor(@inject(PanoscCommonTsComponentBindings.GATEWAY_CLIENT) private _axiosInstance: AxiosInstance) {
    this._axiosInstance.defaults.baseURL += "account-service/api/v1/";
  }

  //=== Connected Account and Role

  // Return the connected account for convenience
  async getConectedUserAccount(): Promise<Account> {
    if (!this._axiosInstance.defaults.headers.access_token) {
      throw new HttpErrors[403](`The user is not connected`);
    }

    const res = await this._axiosInstance.get('account', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  }


  async requiredRole(roleName: string): Promise<Account> {
    const connectedUserAccount = await this.getConectedUserAccount();
    if (roleName == 'user') return; //Anyone is user => no role check required
    if (connectedUserAccount.roles == null || connectedUserAccount.roles.find(role => role.name === roleName) == null) {
      throw new HttpErrors[403](`The connected required role is ${roleName}`);
    }
    return connectedUserAccount;
  }

  async requireAdminRole(): Promise<Account> {
    return this.requiredRole('admin');
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
