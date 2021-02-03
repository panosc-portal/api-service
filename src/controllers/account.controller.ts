import { del, get, getModelSchemaRef } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { Account } from '../models/account-service';
import { BaseController } from './base.controller';


export class AccountController extends BaseController {

  constructor(
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }


  @get('/account', {
    summary: 'Gets the account of the current connected user',
    tags: [
      'User Account'
    ],
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
  async getAccount(): Promise<Account> {
    const connectedUserAccount = await this._accountService.getConectedUserAccount();
    return connectedUserAccount;
  }


  @del('/account', {
    summary: 'Delete the account of the current connected user',
    tags: [
      'User Account'
    ],
    responses: {
      '204': {
        description: 'Ok'
      }
    }
  })
  async deleteAccount() {
    const connectedUserAccount = await this._accountService.getConectedUserAccount();
    this._accountService.deleteAccount(connectedUserAccount.id);
  }


}
