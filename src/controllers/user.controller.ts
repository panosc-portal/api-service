import { del, get, getModelSchemaRef, param, post, requestBody, RestBindings, Request } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService } from '../services';
import { User, Role } from '../models';
import { BaseController } from './base.controller';


export class UserController extends BaseController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }

  //=== Users

  @get('/users', {
    summary: 'Gets a list of users',
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
  async getUsers(): Promise<User[]> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.getUsers();
  }



  @get('/users/{id}', {
    summary: 'Gets a user',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async getUser(@param.path.number('id') id: number): Promise<User> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.getUser(id);
    /*
    try {
      const res = await this._accountService.getUserById(id);
      return res;
    } catch (error) {
      throw new HttpErrors[404](`The user id ${id} doesn't exist`);
    }
    */
  }


  @del('/users', {
    summary: 'Deletes all user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteAllUser() {
    await this._accountService.requireAdminRole(this._request);
    this._accountService.deleteUsers();
  }


  @del('/users/{id}', {
    summary: 'Deletes a user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUser(@param.path.number('id') id: number) {
    await this._accountService.requireAdminRole(this._request);
    this._accountService.deleteUser(id);
  }


  @post('/users', {
    summary: 'Creates a User',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async createUser(@requestBody({ description: 'A user' }) userCreatorDto: Object): Promise<User> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.createUser(userCreatorDto);
  }


  //=== Users roles

  @post('/users/{userId}/roles/{roleId}', {
    summary: 'Adds a role to a user',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async addUserRole(@param.path.number('userId') userId: number, @param.path.number('roleId') roleId: number): Promise<User> {
    await this._accountService.requireAdminRole(this._request);
    return this._accountService.addUserRole(userId, roleId);
  }


  @del('/users/{userId}/roles/{roleId}', {
    summary: 'Deletes the role from a user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUserRole(@param.path.number('userId') userId: number, @param.path.string('roleId') roleId: number) {
    await this._accountService.requireAdminRole(this._request);
    this._accountService.deleteUserRole(userId, roleId);
  }



}
