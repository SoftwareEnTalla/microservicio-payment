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
import { PaymentGatewayStatus } from "../entities/payment-gateway-status.entity";

//Definición de comandos
import {
  CreatePaymentGatewayStatusCommand,
  UpdatePaymentGatewayStatusCommand,
  DeletePaymentGatewayStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentGatewayStatusQueryService } from "../services/paymentgatewaystatusquery.service";


import { PaymentGatewayStatusResponse, PaymentGatewayStatussResponse } from "../types/paymentgatewaystatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentGatewayStatusDto, 
CreateOrUpdatePaymentGatewayStatusDto, 
PaymentGatewayStatusValueInput, 
PaymentGatewayStatusDto, 
CreatePaymentGatewayStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentGatewayStatus)
export class PaymentGatewayStatusResolver {

   //Constructor del resolver de PaymentGatewayStatus
  constructor(
    private readonly service: PaymentGatewayStatusQueryService,
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentGatewayStatusResponse<PaymentGatewayStatus>)
  async createPaymentGatewayStatus(
    @Args("input", { type: () => CreatePaymentGatewayStatusDto }) input: CreatePaymentGatewayStatusDto
  ): Promise<PaymentGatewayStatusResponse<PaymentGatewayStatus>> {
    return this.commandBus.execute(new CreatePaymentGatewayStatusCommand(input));
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Mutation(() => PaymentGatewayStatusResponse<PaymentGatewayStatus>)
  async updatePaymentGatewayStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentGatewayStatusDto
  ): Promise<PaymentGatewayStatusResponse<PaymentGatewayStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentGatewayStatusCommand(payLoad, {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Mutation(() => PaymentGatewayStatusResponse<PaymentGatewayStatus>)
  async createOrUpdatePaymentGatewayStatus(
    @Args("data", { type: () => CreateOrUpdatePaymentGatewayStatusDto })
    data: CreateOrUpdatePaymentGatewayStatusDto
  ): Promise<PaymentGatewayStatusResponse<PaymentGatewayStatus>> {
    if (data.id) {
      const existingPaymentGatewayStatus = await this.service.findById(data.id);
      if (existingPaymentGatewayStatus) {
        return this.commandBus.execute(
          new UpdatePaymentGatewayStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentGatewayStatusDto | UpdatePaymentGatewayStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentGatewayStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentGatewayStatusDto | UpdatePaymentGatewayStatusDto).createdBy ||
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentGatewayStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentGatewayStatusCommand(id));
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  // Queries
  @Query(() => PaymentGatewayStatussResponse<PaymentGatewayStatus>)
  async paymentgatewaystatuss(
    options?: FindManyOptions<PaymentGatewayStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentGatewayStatussResponse<PaymentGatewayStatus>> {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => PaymentGatewayStatussResponse<PaymentGatewayStatus>)
  async paymentgatewaystatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentGatewayStatusResponse<PaymentGatewayStatus>> {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => PaymentGatewayStatussResponse<PaymentGatewayStatus>)
  async paymentgatewaystatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentGatewayStatusValueInput }) value: PaymentGatewayStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentGatewayStatussResponse<PaymentGatewayStatus>> {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => PaymentGatewayStatussResponse<PaymentGatewayStatus>)
  async paymentgatewaystatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentGatewayStatussResponse<PaymentGatewayStatus>> {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => Number)
  async totalPaymentGatewayStatuss(): Promise<number> {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => PaymentGatewayStatussResponse<PaymentGatewayStatus>)
  async searchPaymentGatewayStatuss(
    @Args("where", { type: () => PaymentGatewayStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentGatewayStatussResponse<PaymentGatewayStatus>> {
    const paymentgatewaystatuss = await this.service.findAndCount(where);
    return paymentgatewaystatuss;
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => PaymentGatewayStatusResponse<PaymentGatewayStatus>, { nullable: true })
  async findOnePaymentGatewayStatus(
    @Args("where", { type: () => PaymentGatewayStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentGatewayStatusResponse<PaymentGatewayStatus>> {
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
      .registerClient(PaymentGatewayStatusResolver.name)

      .get(PaymentGatewayStatusResolver.name),
    })
  @Query(() => PaymentGatewayStatusResponse<PaymentGatewayStatus>)
  async findOnePaymentGatewayStatusOrFail(
    @Args("where", { type: () => PaymentGatewayStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentGatewayStatusResponse<PaymentGatewayStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

