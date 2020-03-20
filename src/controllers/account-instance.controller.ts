import { del, get, getModelSchemaRef, param, post, put, requestBody, RestBindings, Request, HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { InstanceDto, InstanceCreatorDto, InstanceAuthorisationDto, InstanceMember, InstanceMemberCreatorDto, InstanceMemberUpdatorDto, CloudInstanceCommand, CloudInstanceState, CloudInstanceNetwork, InstanceUpdatorDto, CloudInstanceAccount } from '../models/cloud-service';
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
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto) }
          }
        }
      }
    }
  })
  async getInstances(): Promise<InstanceDto[]> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getUserInstances(connectedUser.facilityUserId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @get('/account/instances/{instanceId}', {
    summary: 'Get an instance of the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto) }
          }
        }
      }
    }
  })
  async getInstance(@param.path.number('instanceId') instanceId: number): Promise<InstanceDto> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getUserInstance(connectedUser.facilityUserId, instanceId);;

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances', {
    summary: 'Create a new instance for the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto) }
          }
        }
      }
    }
  })
  async createInstance(@requestBody() instanceCreatorDto: InstanceCreatorDto): Promise<InstanceDto> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);

      // Create an account using details from the account service
      const account = new CloudInstanceAccount({
        userId: connectedUser.facilityUserId,
        username: connectedUser.username,
        uid: connectedUser.uid,
        gid: connectedUser.gid,
        email: connectedUser.email,
        homePath: connectedUser.homePath
      });
      instanceCreatorDto.account = account;

      return await this._cloudService.createUserInstance(connectedUser.facilityUserId, instanceCreatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @put('/account/instances/{instanceId}', {
    summary: 'Update an instance of the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InstanceDto) }
          }
        }
      }
    }
  })
  async updateInstance(@param.path.number('instanceId') instanceId: number, @requestBody() instanceUpdatorDto: InstanceUpdatorDto): Promise<InstanceDto> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.updateUserInstance(connectedUser.facilityUserId, instanceId, instanceUpdatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @del('/account/instances/{instanceId}', {
    summary: 'Delete an instance of the current user',
    responses: {
      '204': {
        description: 'Ok',
      }
    }
  })
  async deleteInstance(@param.path.number('instanceId') instanceId: number) {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      await this._cloudService.deleteUserInstance(connectedUser.facilityUserId, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
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
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getUserInstanceState(connectedUser.facilityUserId, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
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
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getUserInstanceNetwork(connectedUser.facilityUserId, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances/{instanceId}/actions', {
    summary: 'Invoke an action for an instance of the current user',
    responses: {
      '201': {
        description: 'Created'
      }
    }
  })
  async postInstanceAction(@param.path.number('instanceId') instanceId: number, @requestBody() command: CloudInstanceCommand): Promise<InstanceDto> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.executeUserInstanceAction(connectedUser.facilityUserId, instanceId, command);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }


  @post('/account/instances/{instanceId}/token', {
    summary: 'Creates an authorisation token for an instance of the current user',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InstanceAuthorisationDto)
          }
        }
      }
    }
  })
  async createInstanceToken(@param.path.number('instanceId') instanceId: number): Promise<InstanceAuthorisationDto> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.createUserInstanceToken(connectedUser.facilityUserId, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
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
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getAllUserInstanceMembers(connectedUser.facilityUserId, instanceId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
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
  async createInstanceMember(@param.path.number('instanceId') instanceId: number, @requestBody() instanceMemberCreatorDto: InstanceMemberCreatorDto): Promise<InstanceMember> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.createUserInstanceMember(connectedUser.facilityUserId, instanceId, instanceMemberCreatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
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
  async updateInstanceMember(@param.path.number('instanceId') instanceId: number, @param.path.number('memberId') memberId: number, @requestBody() instanceMemberUpdatorDto: InstanceMemberUpdatorDto): Promise<InstanceMember> {
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.updateUserInstanceMember(connectedUser.facilityUserId, instanceId, memberId, instanceMemberUpdatorDto);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
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
    try {
      const connectedUser = await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.deleteUserInstanceMember(connectedUser.facilityUserId, instanceId, memberId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }

}
