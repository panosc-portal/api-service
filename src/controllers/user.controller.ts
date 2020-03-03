import { del, get, getModelSchemaRef, param, post, requestBody, HttpErrors } from '@loopback/rest';
import { requiredRole } from '../decorators';
import { inject } from '@loopback/context';
import { AccountService } from '../services';
import { User, Role } from '../models';
import { BaseController } from './base.controller';


export class UserController extends BaseController {
  constructor(
    @inject('services.AccountService') private _accountService: AccountService,
    /*
    @inject('services.UserService') private _userService: UserService,
    @inject('services.RoleService') private _roleService: RoleService
    */
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
  @requiredRole('User')
  async getAccount(): Promise<object> {
    const connectedUser = this._accountService.getConnectedUser();
    return connectedUser;
  }



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
  async getUsers(): Promise<object> {
    await this._accountService.requiredRole('User');
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
  @requiredRole('User')
  async getUser(@param.path.number('id') id: number): Promise<object> {
    try {
      const res = await this._accountService.getUserById(id);
      return res;
    } catch (error) {
      //logger.error(`Got error getting ${this._baseUrl} from provider '${provider.name}': ${error}`);
      throw new HttpErrors[404](`The user id ${id} doesn't exist`);
    }
  }


  @post('/users/{userId}/roles/{roleId}', {
    summary: 'Adds a role to a user',
    responses: {
      '200': {
        description: 'Ok',
        content: { 'application/json': { schema: getModelSchemaRef(User) } }
      }
    }
  })
  async addUserRole(
    @param.path.number('userId') userId: number,
    @param.path.number('roleId') roleId: number
  ): Promise<object> {
    //TO BE COMPLETED
    return;
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
    //TO BE COMPLETED
    //const user: User = await this._userService.getById(userId);
    this.throwNotFoundIfNull('User with given id does not exist');
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
    //TO BE COMPLETED
    //const allUsers = await this._userService.getAll();
    //allUsers.forEach(user => this._userService.delete(user));
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
    //TO BE COMPLETED
    //const user = await this._userService.getById(id);
    //this.throwNotFoundIfNull(user, 'User with given id does not exist');
    //return this._userService.delete(user);
    return;
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
  async createUser(@requestBody({ description: 'A user' }) user: User): Promise<User> {
    //TO BE COMPLETED
    return;
  }


}
