import { del, get, getModelSchemaRef, param, post } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService } from '../services';
import { User } from '../models/account-service';
import { BaseController } from './base.controller';


export class UserAdminController extends BaseController {
  constructor(
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }

  //=== Users

  @get('/users', {
    summary: 'Gets a list of users',
    tags: [
      'User Admin'
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
  async getUsers(): Promise<User[]> {
    await this._accountService.requireAdminRole();
    return this._accountService.getUsers();
  }


  @get('/users/{id}', {
    summary: 'Gets an user',
    tags: [
      'User Admin'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async getUser(@param.path.number('id') id: number): Promise<User> {
    await this._accountService.requireAdminRole();
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


  //=== Users roles

  @post('/users/{userId}/roles/{roleId}', {
    summary: 'Adds a role to an user',
    tags: [
      'User Admin'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async addUserRole(@param.path.number('userId') userId: number, @param.path.number('roleId') roleId: number): Promise<User> {
    await this._accountService.requireAdminRole();
    return this._accountService.addUserRole(userId, roleId);
  }


  @del('/users/{userId}/roles/{roleId}', {
    summary: 'Deletes the role from an user',
    tags: [
      'User Admin'
    ],
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteUserRole(@param.path.number('userId') userId: number, @param.path.string('roleId') roleId: number): Promise<boolean> {
    await this._accountService.requireAdminRole();
    return this._accountService.deleteUserRole(userId, roleId);
  }



}
