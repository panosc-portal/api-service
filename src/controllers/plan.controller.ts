import { del, get, getModelSchemaRef, RestBindings, Request, param } from '@loopback/rest';
import { inject } from '@loopback/context';
import { AccountService, CloudService } from '../services';
import { BaseController } from './base.controller';
import { PlanDto } from '../models/cloud-service';


export class PlanController extends BaseController {

  constructor(
    @inject(RestBindings.Http.REQUEST) private _request: Request,
    @inject('services.AccountService') private _accountService: AccountService,
    @inject('services.CloudService') private _cloudService: CloudService
  ) {
    super();
  }

  @get('/plans', {
    summary: 'Get a list of all plans',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(PlanDto) }
          }
        }
      }
    }
  })
  async getAll(): Promise<PlanDto[]> {
    try {
      // Ensure user is authenticated
      await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getPlans();

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }

  @get('/plans/{planId}', {
    summary: 'Get a plan by a given identifier',
    responses: {
      '200': {
        description: 'Ok',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PlanDto)
          }
        }
      }
    }
  })
  async getById(@param.path.number('planId') planId: number): Promise<PlanDto> {
    try {
        // Ensure user is authenticated
      await this._accountService.getConnectedUser(this._request);
      return await this._cloudService.getPlan(planId);

    } catch (error) {
      this.handleAPIResponseError(error);
    }
  }

}
