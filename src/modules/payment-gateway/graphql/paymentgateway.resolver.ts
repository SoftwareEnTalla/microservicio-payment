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
import { PaymentGateway } from "../entities/payment-gateway.entity";

//Definición de comandos
import {
  CreatePaymentGatewayCommand,
  UpdatePaymentGatewayCommand,
  DeletePaymentGatewayCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentGatewayQueryService } from "../services/paymentgatewayquery.service";


import { PaymentGatewayResponse, PaymentGatewaysResponse } from "../types/paymentgateway.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentGatewayDto, 
CreateOrUpdatePaymentGatewayDto, 
PaymentGatewayValueInput, 
PaymentGatewayDto, 
CreatePaymentGatewayDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentGateway)
export class PaymentGatewayResolver {

   //Constructor del resolver de PaymentGateway
  constructor(
    private readonly service: PaymentGatewayQueryService,
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentGatewayResponse<PaymentGateway>)
  async createPaymentGateway(
    @Args("input", { type: () => CreatePaymentGatewayDto }) input: CreatePaymentGatewayDto
  ): Promise<PaymentGatewayResponse<PaymentGateway>> {
    return this.commandBus.execute(new CreatePaymentGatewayCommand(input));
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Mutation(() => PaymentGatewayResponse<PaymentGateway>)
  async updatePaymentGateway(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentGatewayDto
  ): Promise<PaymentGatewayResponse<PaymentGateway>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentGatewayCommand(payLoad, {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Mutation(() => PaymentGatewayResponse<PaymentGateway>)
  async createOrUpdatePaymentGateway(
    @Args("data", { type: () => CreateOrUpdatePaymentGatewayDto })
    data: CreateOrUpdatePaymentGatewayDto
  ): Promise<PaymentGatewayResponse<PaymentGateway>> {
    if (data.id) {
      const existingPaymentGateway = await this.service.findById(data.id);
      if (existingPaymentGateway) {
        return this.commandBus.execute(
          new UpdatePaymentGatewayCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentGatewayDto | UpdatePaymentGatewayDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentGatewayCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentGatewayDto | UpdatePaymentGatewayDto).createdBy ||
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentGateway(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentGatewayCommand(id));
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  // Queries
  @Query(() => PaymentGatewaysResponse<PaymentGateway>)
  async paymentgateways(
    options?: FindManyOptions<PaymentGateway>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => PaymentGatewaysResponse<PaymentGateway>)
  async paymentgateway(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentGatewayResponse<PaymentGateway>> {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => PaymentGatewaysResponse<PaymentGateway>)
  async paymentgatewaysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentGatewayValueInput }) value: PaymentGatewayValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => PaymentGatewaysResponse<PaymentGateway>)
  async paymentgatewaysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => Number)
  async totalPaymentGateways(): Promise<number> {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => PaymentGatewaysResponse<PaymentGateway>)
  async searchPaymentGateways(
    @Args("where", { type: () => PaymentGatewayDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
    const paymentgateways = await this.service.findAndCount(where);
    return paymentgateways;
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => PaymentGatewayResponse<PaymentGateway>, { nullable: true })
  async findOnePaymentGateway(
    @Args("where", { type: () => PaymentGatewayDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentGatewayResponse<PaymentGateway>> {
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
      .registerClient(PaymentGatewayResolver.name)

      .get(PaymentGatewayResolver.name),
    })
  @Query(() => PaymentGatewayResponse<PaymentGateway>)
  async findOnePaymentGatewayOrFail(
    @Args("where", { type: () => PaymentGatewayDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentGatewayResponse<PaymentGateway> | Error> {
    return this.service.findOneOrFail(where);
  }
}

