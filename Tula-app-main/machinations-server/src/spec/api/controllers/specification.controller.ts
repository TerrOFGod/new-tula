// src/api/controllers/specification.controller.ts

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe
} from '@nestjs/common';
import { SpecificationService } from '../services/specification.service';
import { SimulationService } from '../services/simulation.service';
import { GraphService } from '../services/graph.service';

@Controller('specifications')
export class SpecificationController {
  constructor(
    private readonly specService: SpecificationService,
    private readonly simulationService: SimulationService,
    private readonly graphService: GraphService
  ) {}

  @Post('parse')
  @HttpCode(HttpStatus.CREATED)
  async parseSpecification(
    @Body() body: {
      source: string;
      name?: string;
      description?: string;
      userId?: string;
    }
  ) {
    const result = await this.specService.parseSpecification(
      body.source,
      {
        name: body.name,
        description: body.description,
        userId: body.userId
      }
    );
    
    return {
      success: true,
      data: result,
      message: 'Specification parsed successfully'
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateSpecification(
    @Body() body: { source: string }
  ) {
    const result = await this.specService.validateSpecification(body.source);
    
    return {
      success: result.valid,
      data: result,
      message: result.valid ? 
        'Specification is valid' : 
        'Specification validation failed'
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getSpecification(
    @Param('id') id: string,
    @Query('includeGraph') includeGraph?: boolean,
    @Query('includeState') includeState?: boolean
  ) {
    const result = await this.specService.getSpecification(id);
    
    return {
      success: true,
      data: result
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listSpecifications(
    @Query('status') status?: string,
    @Query('hasTemporal') hasTemporal?: string,
    @Query('hasProbability') hasProbability?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    const filter: any = {};
    
    if (status) filter.status = status.split(',');
    if (hasTemporal !== undefined) filter.hasTemporal = hasTemporal === 'true';
    if (hasProbability !== undefined) filter.hasProbability = hasProbability === 'true';
    if (limit) filter.limit = limit;
    if (offset) filter.offset = offset;
    
    const result = await this.specService.listSpecifications(filter);
    
    return {
      success: true,
      data: result
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateSpecification(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      description?: string;
      source?: string;
    }
  ) {
    const metadata = await this.specService.updateSpecification(id, body);
    
    return {
      success: true,
      data: metadata,
      message: 'Specification updated successfully'
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSpecification(
    @Param('id') id: string
  ) {
    const deleted = await this.specService.deleteSpecification(id);
    
    return {
      success: deleted,
      message: deleted ? 
        'Specification deleted successfully' : 
        'Specification not found'
    };
  }

  @Post(':id/execute/event')
  @HttpCode(HttpStatus.OK)
  async executeEvent(
    @Param('id') specificationId: string,
    @Body() body: {
      entityType: string;
      instanceId: string;
      eventName: string;
      parameters?: Record<string, any>;
    }
  ) {
    const result = await this.specService.executeEvent(specificationId, body);
    
    return {
      success: result.success,
      data: result,
      message: result.success ?
        'Event executed successfully' :
        'Event execution failed'
    };
  }

  @Post(':id/execute/rule')
  @HttpCode(HttpStatus.OK)
  async executeRule(
    @Param('id') specificationId: string,
    @Body() body: {
      ruleName: string;
    }
  ) {
    const result = await this.specService.executeRule(specificationId, body.ruleName);
    
    return {
      success: result.success,
      data: result,
      message: result.success ?
        'Rule executed successfully' :
        'Rule execution failed'
    };
  }

  @Post(':id/simulations')
  @HttpCode(HttpStatus.CREATED)
  async createSimulation(
    @Param('id') specificationId: string,
    @Body() body: {
      name?: string;
      description?: string;
      maxSteps?: number;
      stepInterval?: number;
      initialState?: Record<string, any>;
    }
  ) {
    const result = await this.simulationService.createSimulation(
      specificationId,
      {
        name: body.name,
        description: body.description,
        maxSteps: body.maxSteps,
        stepInterval: body.stepInterval,
        initialState: body.initialState
      }
    );
    
    return {
      success: true,
      data: result,
      message: 'Simulation created successfully'
    };
  }

  @Get(':id/graph')
  @HttpCode(HttpStatus.OK)
  async getGraph(
    @Param('id') specificationId: string,
    @Query('format') format?: 'raw' | 'reactflow'
  ) {
    const graph = await this.graphService.generateGraph(specificationId);
    
    let data = graph;
    if (format === 'reactflow') {
      data = this.graphService.convertToReactFlow(graph);
    }
    
    return {
      success: true,
      data,
      message: 'Graph generated successfully'
    };
  }

  @Get(':id/analytics')
  @HttpCode(HttpStatus.OK)
  async getAnalytics(
    @Param('id') specificationId: string
  ) {
    const analytics = await this.graphService.generateAnalytics(specificationId);
    
    return {
      success: true,
      data: analytics,
      message: 'Analytics generated successfully'
    };
  }
}