import { del, get, getModelSchemaRef, param, post, requestBody, RestBindings, Request } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService } from '../services';
import { Account, Role } from '../models/account-service';
import { BaseController } from './base.controller';


export class AccountAdminController extends BaseController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }

  //=== Accounts

  @get('/accounts', {
    summary: 'Gets a list of accounts',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Account) }
          }
        }
      }
    }
  })
  async getAccounts(): Promise<Account[]> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.getAccounts();
  }


  @get('/accounts/{id}', {
    summary: 'Gets an account',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async getAccount(@param.path.number('id') id: number): Promise<Account> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.getAccount(id);
    /*
    try {
      const res = await this._accountService.getAccountById(id);
      return res;
    } catch (error) {
      throw new HttpErrors[404](`The account id ${id} doesn't exist`);
    }
    */
  }


  @del('/accounts/{id}', {
    summary: 'Deletes an account',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAccount(@param.path.number('id') id: number): Promise<boolean> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.deleteAccount(id);
  }


  //=== Accounts roles

  @post('/accounts/{accountId}/roles/{roleId}', {
    summary: 'Adds a role to an account',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Account) } }
      }
    }
  })
  async addAccountRole(@param.path.number('accountId') accountId: number, @param.path.number('roleId') roleId: number): Promise<Account> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.addAccountRole(accountId, roleId);
  }


  @del('/accounts/{accountId}/roles/{roleId}', {
    summary: 'Deletes the role from an account',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAccountRole(@param.path.number('accountId') accountId: number, @param.path.string('roleId') roleId: number): Promise<boolean> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.deleteAccountRole(accountId, roleId);
  }



}
