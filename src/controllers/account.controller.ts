import { del, get, getModelSchemaRef, param, post, requestBody, HttpErrors, RestBindings, Request } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { User, Instance } from '../models';
import { BaseController } from './base.controller';


export class AccountController extends BaseController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.CloudService') private _cloudService: CloudService
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
    const connectedUser = this._accountService.getConnectedUser(this._request);
    return connectedUser;
  }


  @del('/account', {
    summary: 'Deletes the current connected user',
    responses: {
      '204': {
        description: 'Ok'
      }
    }
  })
  async deleteAccount() {
    const connectedUser = await this._accountService.requiredRole(this._request, 'User');
    this._accountService.deleteUserById(connectedUser.id);
  }


  @get('/account/instances', {
    summary: 'Get all instances for the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Instance) }
          }
        }
      }
    }
  })
  async getAccountInstances(): Promise<object> {
    const connectedUser = await this._accountService.requiredRole(this._request, 'User');
    return this._cloudService.getInstancesByUserId(connectedUser.id);;
  }



}
