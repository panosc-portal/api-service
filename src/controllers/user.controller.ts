import { del, get, getModelSchemaRef } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService } from '../services';
import { User } from '../models/account-service';
import { BaseController } from './base.controller';


export class UserController extends BaseController {

  constructor(
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }


  @get('/user', {
    summary: 'Gets the current connected user',
    tags: [
      'User'
    ],
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
  async getUser(): Promise<User> {
    const authenticationToken = await this._accountService.authenticate();
    return authenticationToken.user;
  }

}
