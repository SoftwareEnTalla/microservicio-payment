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
import { PaymentMethodType } from "../entities/payment-method-type.entity";

//Definición de comandos
import {
  CreatePaymentMethodTypeCommand,
  UpdatePaymentMethodTypeCommand,
  DeletePaymentMethodTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentMethodTypeQueryService } from "../services/paymentmethodtypequery.service";


import { PaymentMethodTypeResponse, PaymentMethodTypesResponse } from "../types/paymentmethodtype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentMethodTypeDto, 
CreateOrUpdatePaymentMethodTypeDto, 
PaymentMethodTypeValueInput, 
PaymentMethodTypeDto, 
CreatePaymentMethodTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentMethodType)
export class PaymentMethodTypeResolver {

   //Constructor del resolver de PaymentMethodType
  constructor(
    private readonly service: PaymentMethodTypeQueryService,
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentMethodTypeResponse<PaymentMethodType>)
  async createPaymentMethodType(
    @Args("input", { type: () => CreatePaymentMethodTypeDto }) input: CreatePaymentMethodTypeDto
  ): Promise<PaymentMethodTypeResponse<PaymentMethodType>> {
    return this.commandBus.execute(new CreatePaymentMethodTypeCommand(input));
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Mutation(() => PaymentMethodTypeResponse<PaymentMethodType>)
  async updatePaymentMethodType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentMethodTypeDto
  ): Promise<PaymentMethodTypeResponse<PaymentMethodType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentMethodTypeCommand(payLoad, {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Mutation(() => PaymentMethodTypeResponse<PaymentMethodType>)
  async createOrUpdatePaymentMethodType(
    @Args("data", { type: () => CreateOrUpdatePaymentMethodTypeDto })
    data: CreateOrUpdatePaymentMethodTypeDto
  ): Promise<PaymentMethodTypeResponse<PaymentMethodType>> {
    if (data.id) {
      const existingPaymentMethodType = await this.service.findById(data.id);
      if (existingPaymentMethodType) {
        return this.commandBus.execute(
          new UpdatePaymentMethodTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentMethodTypeDto | UpdatePaymentMethodTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentMethodTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentMethodTypeDto | UpdatePaymentMethodTypeDto).createdBy ||
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentMethodType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentMethodTypeCommand(id));
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  // Queries
  @Query(() => PaymentMethodTypesResponse<PaymentMethodType>)
  async paymentmethodtypes(
    options?: FindManyOptions<PaymentMethodType>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentMethodTypesResponse<PaymentMethodType>> {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => PaymentMethodTypesResponse<PaymentMethodType>)
  async paymentmethodtype(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentMethodTypeResponse<PaymentMethodType>> {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => PaymentMethodTypesResponse<PaymentMethodType>)
  async paymentmethodtypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentMethodTypeValueInput }) value: PaymentMethodTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMethodTypesResponse<PaymentMethodType>> {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => PaymentMethodTypesResponse<PaymentMethodType>)
  async paymentmethodtypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMethodTypesResponse<PaymentMethodType>> {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => Number)
  async totalPaymentMethodTypes(): Promise<number> {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => PaymentMethodTypesResponse<PaymentMethodType>)
  async searchPaymentMethodTypes(
    @Args("where", { type: () => PaymentMethodTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMethodTypesResponse<PaymentMethodType>> {
    const paymentmethodtypes = await this.service.findAndCount(where);
    return paymentmethodtypes;
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => PaymentMethodTypeResponse<PaymentMethodType>, { nullable: true })
  async findOnePaymentMethodType(
    @Args("where", { type: () => PaymentMethodTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMethodTypeResponse<PaymentMethodType>> {
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
      .registerClient(PaymentMethodTypeResolver.name)

      .get(PaymentMethodTypeResolver.name),
    })
  @Query(() => PaymentMethodTypeResponse<PaymentMethodType>)
  async findOnePaymentMethodTypeOrFail(
    @Args("where", { type: () => PaymentMethodTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMethodTypeResponse<PaymentMethodType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

