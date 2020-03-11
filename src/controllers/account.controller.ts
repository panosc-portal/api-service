import { del, get, getModelSchemaRef, RestBindings, Request } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { User } from '../models/account-service';
import { BaseController } from './base.controller';


export class AccountController extends BaseController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }


  @get('/account', {
    summary: 'Gets the current connected user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(User) }
          }
        }
      }
    }
  })
  async getAccount(): Promise<User> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return connectedUser;
  }


  @del('/account', {
    summary: 'Delete the current connected user',
    responses: {
      '204': {
        description: 'Ok'
      }
    }
  })
  async deleteAccount() {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    this._accountService.deleteUser(connectedUser.id);
  }


}
