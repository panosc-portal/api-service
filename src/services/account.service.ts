import { bind, BindingScope, inject } from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { AxiosInstance } from 'axios';
import { AuthenticationToken, Paginated, Query, Role, User } from '../models/account-service';
import { PanoscCommonTsComponentBindings } from '@panosc-portal/panosc-common-ts';

@bind({ scope: BindingScope.CONTEXT })
export class AccountService {

  constructor(@inject(PanoscCommonTsComponentBindings.GATEWAY_CLIENT) private _axiosInstance: AxiosInstance) {
    this._axiosInstance.defaults.baseURL += "account-service/api/";
  }

  async authenticate(): Promise<AuthenticationToken> {
    if (!this._axiosInstance.defaults.headers.access_token) {
      throw new HttpErrors[403](`The user is not connected`);
    }

    const res = await this._axiosInstance.get('authenticate', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  }

  async requiredRole(roleName: string): Promise<AuthenticationToken> {
    const authenticationToken = await this.authenticate();

    if (roleName == null) {
      return;
    }

    const user = authenticationToken.user;

    if (user.roles == null || user.roles.find(role => role.name === roleName) == null) {
      throw new HttpErrors[403](`The connected required role is ${roleName}`);
    }
    return authenticationToken;
  }

  async requireAdminRole(): Promise<AuthenticationToken> {
    return this.requiredRole('ADMIN');
  }

  isAdmin(user: User): boolean {
    if (user.roles == null) {
      return false;
    }

    return user.roles.find(role => role.name === 'ADMIN') != null;
  }

  async searchForUsers(query: Query): Promise<Paginated<User>> {
    const res = await this._axiosInstance.post('users/search', query);
    return res.data;
  }

  async getUser(id: number): Promise<User> {
    const res = await this._axiosInstance.get(`users/${id}`);
    return res.data;
  }

  async addUserRole(userId: number, roleId: number): Promise<User> {
    const res = await this._axiosInstance.post(`users/${userId}/roles/${roleId}`);
    return res.data;
  }

  async deleteUserRole(userId: number, roleId: number): Promise<boolean> {
    const res = await this._axiosInstance.delete(`users/${userId}/roles/${roleId}`);
    return res.data;
  }

  async getSupportUsers(): Promise<User[]> {
    const query: Query = {
      join: [
        {alias: 'role', member: 'user.roles', select: true, type: 'LEFT_OUTER_JOIN'},
        {alias: 'role2', member: 'user.roles', select: false, type: 'LEFT_JOIN'}
      ],
      filter: [{
        alias: 'role2.name',
        parameter: 'roleName',
        valueType: 'string[]',
        value: '["IT_SUPPORT", "INSTRUMENT_CONTROL", "INSTRUMENT_SCIENTIST", "SCIENTIFIC_COMPUTING"]',
        comparator: 'IN'
      }]
    }

    const res = await this._axiosInstance.post('users/search', query);
    const paginated: Paginated<User> = res.data;
    return paginated.data;
  }

  async getUserRoles(): Promise<Role[]> {
    const res = await this._axiosInstance.get(`roles`);
    return res.data;
  }


}
