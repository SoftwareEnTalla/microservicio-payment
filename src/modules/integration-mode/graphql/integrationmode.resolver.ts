/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { IntegrationMode } from "../entities/integration-mode.entity";

//Definición de comandos
import {
  CreateIntegrationModeCommand,
  UpdateIntegrationModeCommand,
  DeleteIntegrationModeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { IntegrationModeQueryService } from "../services/integrationmodequery.service";


import { IntegrationModeResponse, IntegrationModesResponse } from "../types/integrationmode.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateIntegrationModeDto, 
CreateOrUpdateIntegrationModeDto, 
IntegrationModeValueInput, 
IntegrationModeDto, 
CreateIntegrationModeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => IntegrationMode)
export class IntegrationModeResolver {

   //Constructor del resolver de IntegrationMode
  constructor(
    private readonly service: IntegrationModeQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  // Mutaciones
  @Mutation(() => IntegrationModeResponse<IntegrationMode>)
  async createIntegrationMode(
    @Args("input", { type: () => CreateIntegrationModeDto }) input: CreateIntegrationModeDto
  ): Promise<IntegrationModeResponse<IntegrationMode>> {
    return this.commandBus.execute(new CreateIntegrationModeCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Mutation(() => IntegrationModeResponse<IntegrationMode>)
  async updateIntegrationMode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateIntegrationModeDto
  ): Promise<IntegrationModeResponse<IntegrationMode>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateIntegrationModeCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Mutation(() => IntegrationModeResponse<IntegrationMode>)
  async createOrUpdateIntegrationMode(
    @Args("data", { type: () => CreateOrUpdateIntegrationModeDto })
    data: CreateOrUpdateIntegrationModeDto
  ): Promise<IntegrationModeResponse<IntegrationMode>> {
    if (data.id) {
      const existingIntegrationMode = await this.service.findById(data.id);
      if (existingIntegrationMode) {
        return this.commandBus.execute(
          new UpdateIntegrationModeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateIntegrationModeDto | UpdateIntegrationModeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateIntegrationModeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateIntegrationModeDto | UpdateIntegrationModeDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteIntegrationMode(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteIntegrationModeCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  // Queries
  @Query(() => IntegrationModesResponse<IntegrationMode>)
  async integrationmodes(
    options?: FindManyOptions<IntegrationMode>,
    paginationArgs?: PaginationArgs
  ): Promise<IntegrationModesResponse<IntegrationMode>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => IntegrationModesResponse<IntegrationMode>)
  async integrationmode(
    @Args("id", { type: () => String }) id: string
  ): Promise<IntegrationModeResponse<IntegrationMode>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => IntegrationModesResponse<IntegrationMode>)
  async integrationmodesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => IntegrationModeValueInput }) value: IntegrationModeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<IntegrationModesResponse<IntegrationMode>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => IntegrationModesResponse<IntegrationMode>)
  async integrationmodesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<IntegrationModesResponse<IntegrationMode>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => Number)
  async totalIntegrationModes(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => IntegrationModesResponse<IntegrationMode>)
  async searchIntegrationModes(
    @Args("where", { type: () => IntegrationModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<IntegrationModesResponse<IntegrationMode>> {
    const integrationmodes = await this.service.findAndCount(where);
    return integrationmodes;
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => IntegrationModeResponse<IntegrationMode>, { nullable: true })
  async findOneIntegrationMode(
    @Args("where", { type: () => IntegrationModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<IntegrationModeResponse<IntegrationMode>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(IntegrationModeResolver.name)

      .get(IntegrationModeResolver.name),
    })
  @Query(() => IntegrationModeResponse<IntegrationMode>)
  async findOneIntegrationModeOrFail(
    @Args("where", { type: () => IntegrationModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<IntegrationModeResponse<IntegrationMode> | Error> {
    return this.service.findOneOrFail(where);
  }
}

