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
import { CardNetwork } from "../entities/card-network.entity";

//Definición de comandos
import {
  CreateCardNetworkCommand,
  UpdateCardNetworkCommand,
  DeleteCardNetworkCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CardNetworkQueryService } from "../services/cardnetworkquery.service";


import { CardNetworkResponse, CardNetworksResponse } from "../types/cardnetwork.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCardNetworkDto, 
CreateOrUpdateCardNetworkDto, 
CardNetworkValueInput, 
CardNetworkDto, 
CreateCardNetworkDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CardNetwork)
export class CardNetworkResolver {

   //Constructor del resolver de CardNetwork
  constructor(
    private readonly service: CardNetworkQueryService,
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  // Mutaciones
  @Mutation(() => CardNetworkResponse<CardNetwork>)
  async createCardNetwork(
    @Args("input", { type: () => CreateCardNetworkDto }) input: CreateCardNetworkDto
  ): Promise<CardNetworkResponse<CardNetwork>> {
    return this.commandBus.execute(new CreateCardNetworkCommand(input));
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Mutation(() => CardNetworkResponse<CardNetwork>)
  async updateCardNetwork(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCardNetworkDto
  ): Promise<CardNetworkResponse<CardNetwork>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCardNetworkCommand(payLoad, {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Mutation(() => CardNetworkResponse<CardNetwork>)
  async createOrUpdateCardNetwork(
    @Args("data", { type: () => CreateOrUpdateCardNetworkDto })
    data: CreateOrUpdateCardNetworkDto
  ): Promise<CardNetworkResponse<CardNetwork>> {
    if (data.id) {
      const existingCardNetwork = await this.service.findById(data.id);
      if (existingCardNetwork) {
        return this.commandBus.execute(
          new UpdateCardNetworkCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCardNetworkDto | UpdateCardNetworkDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCardNetworkCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCardNetworkDto | UpdateCardNetworkDto).createdBy ||
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCardNetwork(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCardNetworkCommand(id));
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  // Queries
  @Query(() => CardNetworksResponse<CardNetwork>)
  async cardnetworks(
    options?: FindManyOptions<CardNetwork>,
    paginationArgs?: PaginationArgs
  ): Promise<CardNetworksResponse<CardNetwork>> {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => CardNetworksResponse<CardNetwork>)
  async cardnetwork(
    @Args("id", { type: () => String }) id: string
  ): Promise<CardNetworkResponse<CardNetwork>> {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => CardNetworksResponse<CardNetwork>)
  async cardnetworksByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CardNetworkValueInput }) value: CardNetworkValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CardNetworksResponse<CardNetwork>> {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => CardNetworksResponse<CardNetwork>)
  async cardnetworksWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CardNetworksResponse<CardNetwork>> {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => Number)
  async totalCardNetworks(): Promise<number> {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => CardNetworksResponse<CardNetwork>)
  async searchCardNetworks(
    @Args("where", { type: () => CardNetworkDto, nullable: false })
    where: Record<string, any>
  ): Promise<CardNetworksResponse<CardNetwork>> {
    const cardnetworks = await this.service.findAndCount(where);
    return cardnetworks;
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => CardNetworkResponse<CardNetwork>, { nullable: true })
  async findOneCardNetwork(
    @Args("where", { type: () => CardNetworkDto, nullable: false })
    where: Record<string, any>
  ): Promise<CardNetworkResponse<CardNetwork>> {
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
      .registerClient(CardNetworkResolver.name)

      .get(CardNetworkResolver.name),
    })
  @Query(() => CardNetworkResponse<CardNetwork>)
  async findOneCardNetworkOrFail(
    @Args("where", { type: () => CardNetworkDto, nullable: false })
    where: Record<string, any>
  ): Promise<CardNetworkResponse<CardNetwork> | Error> {
    return this.service.findOneOrFail(where);
  }
}

