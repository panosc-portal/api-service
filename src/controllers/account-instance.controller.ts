import { del, get, getModelSchemaRef, param, post, put, requestBody, RestBindings, Request } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { Instance, InstanceAuthorisation, InstanceMember, CloudInstanceCommand, CloudInstanceState, CloudInstanceNetwork } from '../models';
import { BaseController } from './base.controller';


export class AccountInstanceController extends BaseController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.CloudService') private _cloudService: CloudService
  ) {
    super();
  }


  //=== Instances objects

  @get('/account/instances/', {
    summary: 'Get all instances of the current user',
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
  async getInstances(): Promise<Instance[]> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.getUserInstances(connectedUser.id);
  }


  @get('/account/instances/{instanceId}', {
    summary: 'Get an instance of the current user',
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
  async getInstance(instanceId: number): Promise<Instance> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return await this._cloudService.getUserInstance(connectedUser.id, instanceId);;
  }


  @post('/account/instances', {
    summary: 'Create a new instance for the current user',
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
  async createInstance(instanceDto: object): Promise<Instance> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.createUserInstance(connectedUser.id, instanceDto);
  }


  @put('/account/instances/{instanceId}', {
    summary: 'Update an instance of the current user',
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
  async updateInstance(instanceId: number, instanceDto: object): Promise<Instance> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.updateUserInstance(connectedUser.id, instanceId, instanceDto);
  }


  @del('/account/instances/{instanceId}', {
    summary: 'Delete an instance of the current user',
    responses: {
      '204': {
        description: 'Ok',
      }
    }
  })
  async deleteInstance(instanceId: number) {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    this._cloudService.deleteUserInstance(connectedUser.id, instanceId);
  }


  //=== Instances info and actions (State, Network...)

  @get('/account/instances/{instanceId}/state', {
    summary: 'Get the state of an instance of the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CloudInstanceState)
          }
        }
      }
    }
  })
  async getInstanceState(@param.path.number('instanceId') instanceId: number): Promise<CloudInstanceState> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.getUserInstanceState(connectedUser.id, instanceId);
  }


  @get('/account/instances/{instanceId}/network', {
    summary: 'Get the network of an instance of the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CloudInstanceNetwork)
          }
        }
      }
    }
  })
  async getInstanceNetwork(@param.path.number('instanceId') instanceId: number): Promise<CloudInstanceNetwork> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.getUserInstanceNetwork(connectedUser.id, instanceId);
  }


  @post('/account/instances/{instanceId}/actions', {
    summary: 'Invoke an action for an instance of the current user',
    responses: {
      '201': {
        description: 'Created'
      }
    }
  })
  async postInstanceAction(@param.path.number('instanceId') instanceId: number, @requestBody() command: CloudInstanceCommand): Promise<Instance> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.executeUserInstanceAction(connectedUser.id, instanceId);

  }


  @get('/account/instances/{instanceId}/token/{token}/validate', {
    summary: 'Validates an authorisation token for an instance of the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstanceAuthorisation)
          }
        }
      }
    }
  })
  async validateInstanceToken(@param.path.number('instanceId') instanceId: number, @param.path.string('token') token: string): Promise<InstanceAuthorisation> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.validateUserInstanceToken(connectedUser.id, instanceId, token);

  }

  //=== Instances members

  @get('/account/instances/{instanceId}/members', {
    summary: 'Get all members of an instance of the current user',
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
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.getAllUserInstanceMembers(connectedUser.id, instanceId);
  }


  @post('/account/instances/{instanceId}/members', {
    summary: 'Create a member for an instance of the current user',
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
  async createInstanceMember(@param.path.number('instanceId') instanceId: number, @requestBody() instanceMemberCreatorDto: Object): Promise<InstanceMember> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.createUserInstanceMember(connectedUser.id, instanceId, instanceMemberCreatorDto);
  }


  @put('/account/instances/{instanceId}/members/{memberId}', {
    summary: 'Update a member of an instance of the current user',
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
  async updateInstanceMember(@param.path.number('instanceId') instanceId: number, @param.path.number('memberId') memberId: number, @requestBody() instanceMemberUpdatorDto: Object): Promise<InstanceMember> {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.updateUserInstanceMember(connectedUser.id, instanceId, memberId, instanceMemberUpdatorDto);

  }

  @del('/account/instances/{instanceId}/members/{memberId}', {
    summary: 'Delete a member of an instance of the current user',
    responses: {
      '200': {
        description: 'Ok'
      }
    }
  })
  async deleteInstanceMember(@param.path.number('instanceId') instanceId: number, @param.path.number('memberId') memberId: number) {
    const connectedUser = await this._accountService.getConnectedUser(this._request);
    return this._cloudService.deleteUserInstanceMember(connectedUser.id, instanceId, memberId);

  }





}
