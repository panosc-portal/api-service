import { del, get, getModelSchemaRef, HttpErrors, param, post, requestBody } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService } from '../services';
import { User, Query, Paginated, Role } from '../models/account-service';
import { BaseController } from './base.controller';


export class UserAdminController extends BaseController {
  constructor(
    @inject('services.AccountService') private _accountService: AccountService
  ) {
    super();
  }

  @post('/users/search', {
    summary: 'Search for users',
    tags: [
      'User Admin'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(Paginated) } }
      }
    }
  })
  async searchForUsers(@requestBody() query: Query): Promise<Paginated<User>> {
    await this._accountService.requireAdminRole();

    query = query ? query : {};
    query.pagination = query.pagination ? query.pagination : {offset: 0, limit: 200};
    if (query.pagination.limit > 200) {
      throw new HttpErrors.BadRequest(`Pagination limit must be less than 200`);
    }

    return this._accountService.searchForUsers(query);
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
  }

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


  @get('/users/roles', {
    summary: 'Gets all user roles',
    tags: [
      'User Admin'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Role) }
          }
        }
      }
    }
  })
  async getUserRoles(): Promise<Role[]> {
    await this._accountService.requireAdminRole();
    return this._accountService.getUserRoles();
  }

  @get('/users/support', {
    summary: 'Gets all support users',
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
  async getSupportUsers(): Promise<User[]> {
    await this._accountService.requireAdminRole();
    return this._accountService.getSupportUsers();
  }
}
