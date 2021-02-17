import { del, get, getModelSchemaRef, param, post, put, requestBody } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { InstanceDto, InstanceCreatorDto, InstanceAuthorisationDto, InstanceMember, InstanceMemberCreatorDto, InstanceMemberUpdatorDto, CloudInstanceCommand, CloudInstanceState, CloudInstanceNetwork, InstanceUpdatorDto, CloudInstanceAccount } from '../models/cloud-service';
import { BaseController } from './base.controller';


export class AccountInstanceController extends BaseController {

  constructor(
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.CloudService') private _cloudService: CloudService
  ) {
    super();
  }


  //=== Instances objects

  @get('/account/instances/', {
    summary: 'Get all instances of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto, {title: 'Instance'}) }
          }
        }
      }
    }
  })
  async getInstances(): Promise<InstanceDto[]> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.getUserInstances(authenticationToken.user.id);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @get('/account/instances/{instanceId}', {
    summary: 'Get an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto, {title: 'Instance'}) }
          }
        }
      }
    }
  })
  async getInstance(@param.path.number('instanceId') instanceId: number): Promise<InstanceDto> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.getUserInstance(authenticationToken.user.id, instanceId);;

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances', {
    summary: 'Create a new instance for the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto, {title: 'Instance'}) }
          }
        }
      }
    }
  })
  async createInstance(@requestBody() instanceCreatorDto: InstanceCreatorDto): Promise<InstanceDto> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      const user = authenticationToken.user;
      const account = authenticationToken.account;

      // Create an account using details from the account service
      const cloudAccount = new CloudInstanceAccount({
        userId: account.userId,
        username: account.username,
        uid: account.uid,
        gid: account.gid,
        email: user.email,
        homePath: account.homePath
      });
      instanceCreatorDto.account = cloudAccount;

      return await this._cloudService.createUserInstance(user.id, instanceCreatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @put('/account/instances/{instanceId}', {
    summary: 'Update an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto, {title: 'Instance'}) }
          }
        }
      }
    }
  })
  async updateInstance(@param.path.number('instanceId') instanceId: number, @requestBody() instanceUpdatorDto: InstanceUpdatorDto): Promise<InstanceDto> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.updateUserInstance(authenticationToken.user.id, instanceId, instanceUpdatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @del('/account/instances/{instanceId}', {
    summary: 'Delete an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '204': {
        description: 'Ok',
      }
    }
  })
  async deleteInstance(@param.path.number('instanceId') instanceId: number): Promise<boolean> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.deleteUserInstance(authenticationToken.user.id, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  //=== Instances info and actions (State, Network...)

  @get('/account/instances/{instanceId}/state', {
    summary: 'Get the state of an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CloudInstanceState, {title: 'InstanceState'})
          }
        }
      }
    }
  })
  async getInstanceState(@param.path.number('instanceId') instanceId: number): Promise<CloudInstanceState> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.getUserInstanceState(authenticationToken.user.id, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @get('/account/instances/{instanceId}/network', {
    summary: 'Get the network of an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CloudInstanceNetwork, {title: 'InstanceNetwork'})
          }
        }
      }
    }
  })
  async getInstanceNetwork(@param.path.number('instanceId') instanceId: number): Promise<CloudInstanceNetwork> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.getUserInstanceNetwork(authenticationToken.user.id, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances/{instanceId}/actions', {
    summary: 'Invoke an action for an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '201': {
        description: 'Created'
      }
    }
  })
  async postInstanceAction(@param.path.number('instanceId') instanceId: number, @requestBody() command: CloudInstanceCommand): Promise<InstanceDto> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.executeUserInstanceAction(authenticationToken.user.id, instanceId, command);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances/{instanceId}/token', {
    summary: 'Creates an authorisation token for an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstanceAuthorisationDto, {title: 'InstanceAuthorisation'})
          }
        }
      }
    }
  })
  async createInstanceToken(@param.path.number('instanceId') instanceId: number): Promise<InstanceAuthorisationDto> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.createUserInstanceToken(authenticationToken.user.id, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }

  //=== Instances members

  @get('/account/instances/{instanceId}/members', {
    summary: 'Get all members of an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceMember) }
          }
        }
      }
    }
  })
  async getAllInstanceMembers(@param.path.number('instanceId') instanceId: number): Promise<InstanceMember[]> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.getAllUserInstanceMembers(authenticationToken.user.id, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances/{instanceId}/members', {
    summary: 'Create a member for an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '201': {
        description: 'Created',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstanceMember)
          }
        }
      }
    }
  })
  async createInstanceMember(@param.path.number('instanceId') instanceId: number, @requestBody() instanceMemberCreatorDto: InstanceMemberCreatorDto): Promise<InstanceMember> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.createUserInstanceMember(authenticationToken.user.id, instanceId, instanceMemberCreatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @put('/account/instances/{instanceId}/members/{memberId}', {
    summary: 'Update a member of an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstanceMember)
          }
        }
      }
    }
  })
  async updateInstanceMember(@param.path.number('instanceId') instanceId: number, @param.path.number('memberId') memberId: number, @requestBody() instanceMemberUpdatorDto: InstanceMemberUpdatorDto): Promise<InstanceMember> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.updateUserInstanceMember(authenticationToken.user.id, instanceId, memberId, instanceMemberUpdatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }

  @del('/account/instances/{instanceId}/members/{memberId}', {
    summary: 'Delete a member of an instance of the current user',
    tags: [
      'Account Instance'
    ],
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteInstanceMember(@param.path.number('instanceId') instanceId: number, @param.path.number('memberId') memberId: number): Promise<boolean> {
    try {
      const authenticationToken = await this._accountService.authenticate();
      return await this._cloudService.deleteUserInstanceMember(authenticationToken.user.id, instanceId, memberId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }

}
