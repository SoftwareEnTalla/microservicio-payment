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
import { PaymentStatus } from "../entities/payment-status.entity";

//Definición de comandos
import {
  CreatePaymentStatusCommand,
  UpdatePaymentStatusCommand,
  DeletePaymentStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentStatusQueryService } from "../services/paymentstatusquery.service";


import { PaymentStatusResponse, PaymentStatussResponse } from "../types/paymentstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentStatusDto, 
CreateOrUpdatePaymentStatusDto, 
PaymentStatusValueInput, 
PaymentStatusDto, 
CreatePaymentStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentStatus)
export class PaymentStatusResolver {

   //Constructor del resolver de PaymentStatus
  constructor(
    private readonly service: PaymentStatusQueryService,
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentStatusResponse<PaymentStatus>)
  async createPaymentStatus(
    @Args("input", { type: () => CreatePaymentStatusDto }) input: CreatePaymentStatusDto
  ): Promise<PaymentStatusResponse<PaymentStatus>> {
    return this.commandBus.execute(new CreatePaymentStatusCommand(input));
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Mutation(() => PaymentStatusResponse<PaymentStatus>)
  async updatePaymentStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentStatusDto
  ): Promise<PaymentStatusResponse<PaymentStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentStatusCommand(payLoad, {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Mutation(() => PaymentStatusResponse<PaymentStatus>)
  async createOrUpdatePaymentStatus(
    @Args("data", { type: () => CreateOrUpdatePaymentStatusDto })
    data: CreateOrUpdatePaymentStatusDto
  ): Promise<PaymentStatusResponse<PaymentStatus>> {
    if (data.id) {
      const existingPaymentStatus = await this.service.findById(data.id);
      if (existingPaymentStatus) {
        return this.commandBus.execute(
          new UpdatePaymentStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentStatusDto | UpdatePaymentStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentStatusDto | UpdatePaymentStatusDto).createdBy ||
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentStatusCommand(id));
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  // Queries
  @Query(() => PaymentStatussResponse<PaymentStatus>)
  async paymentstatuss(
    options?: FindManyOptions<PaymentStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentStatussResponse<PaymentStatus>> {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => PaymentStatussResponse<PaymentStatus>)
  async paymentstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentStatusResponse<PaymentStatus>> {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => PaymentStatussResponse<PaymentStatus>)
  async paymentstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentStatusValueInput }) value: PaymentStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentStatussResponse<PaymentStatus>> {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => PaymentStatussResponse<PaymentStatus>)
  async paymentstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentStatussResponse<PaymentStatus>> {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => Number)
  async totalPaymentStatuss(): Promise<number> {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => PaymentStatussResponse<PaymentStatus>)
  async searchPaymentStatuss(
    @Args("where", { type: () => PaymentStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentStatussResponse<PaymentStatus>> {
    const paymentstatuss = await this.service.findAndCount(where);
    return paymentstatuss;
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => PaymentStatusResponse<PaymentStatus>, { nullable: true })
  async findOnePaymentStatus(
    @Args("where", { type: () => PaymentStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentStatusResponse<PaymentStatus>> {
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
      .registerClient(PaymentStatusResolver.name)

      .get(PaymentStatusResolver.name),
    })
  @Query(() => PaymentStatusResponse<PaymentStatus>)
  async findOnePaymentStatusOrFail(
    @Args("where", { type: () => PaymentStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentStatusResponse<PaymentStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

