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
import { PaymentAttemptStatus } from "../entities/payment-attempt-status.entity";

//Definición de comandos
import {
  CreatePaymentAttemptStatusCommand,
  UpdatePaymentAttemptStatusCommand,
  DeletePaymentAttemptStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentAttemptStatusQueryService } from "../services/paymentattemptstatusquery.service";


import { PaymentAttemptStatusResponse, PaymentAttemptStatussResponse } from "../types/paymentattemptstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentAttemptStatusDto, 
CreateOrUpdatePaymentAttemptStatusDto, 
PaymentAttemptStatusValueInput, 
PaymentAttemptStatusDto, 
CreatePaymentAttemptStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentAttemptStatus)
export class PaymentAttemptStatusResolver {

   //Constructor del resolver de PaymentAttemptStatus
  constructor(
    private readonly service: PaymentAttemptStatusQueryService,
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentAttemptStatusResponse<PaymentAttemptStatus>)
  async createPaymentAttemptStatus(
    @Args("input", { type: () => CreatePaymentAttemptStatusDto }) input: CreatePaymentAttemptStatusDto
  ): Promise<PaymentAttemptStatusResponse<PaymentAttemptStatus>> {
    return this.commandBus.execute(new CreatePaymentAttemptStatusCommand(input));
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Mutation(() => PaymentAttemptStatusResponse<PaymentAttemptStatus>)
  async updatePaymentAttemptStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentAttemptStatusDto
  ): Promise<PaymentAttemptStatusResponse<PaymentAttemptStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentAttemptStatusCommand(payLoad, {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Mutation(() => PaymentAttemptStatusResponse<PaymentAttemptStatus>)
  async createOrUpdatePaymentAttemptStatus(
    @Args("data", { type: () => CreateOrUpdatePaymentAttemptStatusDto })
    data: CreateOrUpdatePaymentAttemptStatusDto
  ): Promise<PaymentAttemptStatusResponse<PaymentAttemptStatus>> {
    if (data.id) {
      const existingPaymentAttemptStatus = await this.service.findById(data.id);
      if (existingPaymentAttemptStatus) {
        return this.commandBus.execute(
          new UpdatePaymentAttemptStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentAttemptStatusDto | UpdatePaymentAttemptStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentAttemptStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentAttemptStatusDto | UpdatePaymentAttemptStatusDto).createdBy ||
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentAttemptStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentAttemptStatusCommand(id));
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  // Queries
  @Query(() => PaymentAttemptStatussResponse<PaymentAttemptStatus>)
  async paymentattemptstatuss(
    options?: FindManyOptions<PaymentAttemptStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentAttemptStatussResponse<PaymentAttemptStatus>> {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => PaymentAttemptStatussResponse<PaymentAttemptStatus>)
  async paymentattemptstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentAttemptStatusResponse<PaymentAttemptStatus>> {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => PaymentAttemptStatussResponse<PaymentAttemptStatus>)
  async paymentattemptstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentAttemptStatusValueInput }) value: PaymentAttemptStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentAttemptStatussResponse<PaymentAttemptStatus>> {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => PaymentAttemptStatussResponse<PaymentAttemptStatus>)
  async paymentattemptstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentAttemptStatussResponse<PaymentAttemptStatus>> {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => Number)
  async totalPaymentAttemptStatuss(): Promise<number> {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => PaymentAttemptStatussResponse<PaymentAttemptStatus>)
  async searchPaymentAttemptStatuss(
    @Args("where", { type: () => PaymentAttemptStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentAttemptStatussResponse<PaymentAttemptStatus>> {
    const paymentattemptstatuss = await this.service.findAndCount(where);
    return paymentattemptstatuss;
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => PaymentAttemptStatusResponse<PaymentAttemptStatus>, { nullable: true })
  async findOnePaymentAttemptStatus(
    @Args("where", { type: () => PaymentAttemptStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentAttemptStatusResponse<PaymentAttemptStatus>> {
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
      .registerClient(PaymentAttemptStatusResolver.name)

      .get(PaymentAttemptStatusResolver.name),
    })
  @Query(() => PaymentAttemptStatusResponse<PaymentAttemptStatus>)
  async findOnePaymentAttemptStatusOrFail(
    @Args("where", { type: () => PaymentAttemptStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentAttemptStatusResponse<PaymentAttemptStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

