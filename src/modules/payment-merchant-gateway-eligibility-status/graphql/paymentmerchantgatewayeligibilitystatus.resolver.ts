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
import { PaymentMerchantGatewayEligibilityStatus } from "../entities/payment-merchant-gateway-eligibility-status.entity";

//Definición de comandos
import {
  CreatePaymentMerchantGatewayEligibilityStatusCommand,
  UpdatePaymentMerchantGatewayEligibilityStatusCommand,
  DeletePaymentMerchantGatewayEligibilityStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentMerchantGatewayEligibilityStatusQueryService } from "../services/paymentmerchantgatewayeligibilitystatusquery.service";


import { PaymentMerchantGatewayEligibilityStatusResponse, PaymentMerchantGatewayEligibilityStatussResponse } from "../types/paymentmerchantgatewayeligibilitystatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentMerchantGatewayEligibilityStatusDto, 
CreateOrUpdatePaymentMerchantGatewayEligibilityStatusDto, 
PaymentMerchantGatewayEligibilityStatusValueInput, 
PaymentMerchantGatewayEligibilityStatusDto, 
CreatePaymentMerchantGatewayEligibilityStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentMerchantGatewayEligibilityStatus)
export class PaymentMerchantGatewayEligibilityStatusResolver {

   //Constructor del resolver de PaymentMerchantGatewayEligibilityStatus
  constructor(
    private readonly service: PaymentMerchantGatewayEligibilityStatusQueryService,
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>)
  async createPaymentMerchantGatewayEligibilityStatus(
    @Args("input", { type: () => CreatePaymentMerchantGatewayEligibilityStatusDto }) input: CreatePaymentMerchantGatewayEligibilityStatusDto
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
    return this.commandBus.execute(new CreatePaymentMerchantGatewayEligibilityStatusCommand(input));
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Mutation(() => PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>)
  async updatePaymentMerchantGatewayEligibilityStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentMerchantGatewayEligibilityStatusDto
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentMerchantGatewayEligibilityStatusCommand(payLoad, {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Mutation(() => PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>)
  async createOrUpdatePaymentMerchantGatewayEligibilityStatus(
    @Args("data", { type: () => CreateOrUpdatePaymentMerchantGatewayEligibilityStatusDto })
    data: CreateOrUpdatePaymentMerchantGatewayEligibilityStatusDto
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
    if (data.id) {
      const existingPaymentMerchantGatewayEligibilityStatus = await this.service.findById(data.id);
      if (existingPaymentMerchantGatewayEligibilityStatus) {
        return this.commandBus.execute(
          new UpdatePaymentMerchantGatewayEligibilityStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentMerchantGatewayEligibilityStatusDto | UpdatePaymentMerchantGatewayEligibilityStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentMerchantGatewayEligibilityStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentMerchantGatewayEligibilityStatusDto | UpdatePaymentMerchantGatewayEligibilityStatusDto).createdBy ||
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentMerchantGatewayEligibilityStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentMerchantGatewayEligibilityStatusCommand(id));
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  // Queries
  @Query(() => PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>)
  async paymentmerchantgatewayeligibilitystatuss(
    options?: FindManyOptions<PaymentMerchantGatewayEligibilityStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>)
  async paymentmerchantgatewayeligibilitystatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>)
  async paymentmerchantgatewayeligibilitystatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentMerchantGatewayEligibilityStatusValueInput }) value: PaymentMerchantGatewayEligibilityStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>)
  async paymentmerchantgatewayeligibilitystatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => Number)
  async totalPaymentMerchantGatewayEligibilityStatuss(): Promise<number> {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>)
  async searchPaymentMerchantGatewayEligibilityStatuss(
    @Args("where", { type: () => PaymentMerchantGatewayEligibilityStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>> {
    const paymentmerchantgatewayeligibilitystatuss = await this.service.findAndCount(where);
    return paymentmerchantgatewayeligibilitystatuss;
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>, { nullable: true })
  async findOnePaymentMerchantGatewayEligibilityStatus(
    @Args("where", { type: () => PaymentMerchantGatewayEligibilityStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusResolver.name)

      .get(PaymentMerchantGatewayEligibilityStatusResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>)
  async findOnePaymentMerchantGatewayEligibilityStatusOrFail(
    @Args("where", { type: () => PaymentMerchantGatewayEligibilityStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

