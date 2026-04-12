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
import { PaymentMerchantGatewayEligibility } from "../entities/payment-merchant-gateway-eligibility.entity";

//Definición de comandos
import {
  CreatePaymentMerchantGatewayEligibilityCommand,
  UpdatePaymentMerchantGatewayEligibilityCommand,
  DeletePaymentMerchantGatewayEligibilityCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentMerchantGatewayEligibilityQueryService } from "../services/paymentmerchantgatewayeligibilityquery.service";


import { PaymentMerchantGatewayEligibilityResponse, PaymentMerchantGatewayEligibilitysResponse } from "../types/paymentmerchantgatewayeligibility.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentMerchantGatewayEligibilityDto, 
CreateOrUpdatePaymentMerchantGatewayEligibilityDto, 
PaymentMerchantGatewayEligibilityValueInput, 
PaymentMerchantGatewayEligibilityDto, 
CreatePaymentMerchantGatewayEligibilityDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentMerchantGatewayEligibility)
export class PaymentMerchantGatewayEligibilityResolver {

   //Constructor del resolver de PaymentMerchantGatewayEligibility
  constructor(
    private readonly service: PaymentMerchantGatewayEligibilityQueryService,
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>)
  async createPaymentMerchantGatewayEligibility(
    @Args("input", { type: () => CreatePaymentMerchantGatewayEligibilityDto }) input: CreatePaymentMerchantGatewayEligibilityDto
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
    return this.commandBus.execute(new CreatePaymentMerchantGatewayEligibilityCommand(input));
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Mutation(() => PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>)
  async updatePaymentMerchantGatewayEligibility(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentMerchantGatewayEligibilityDto
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentMerchantGatewayEligibilityCommand(payLoad, {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Mutation(() => PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>)
  async createOrUpdatePaymentMerchantGatewayEligibility(
    @Args("data", { type: () => CreateOrUpdatePaymentMerchantGatewayEligibilityDto })
    data: CreateOrUpdatePaymentMerchantGatewayEligibilityDto
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
    if (data.id) {
      const existingPaymentMerchantGatewayEligibility = await this.service.findById(data.id);
      if (existingPaymentMerchantGatewayEligibility) {
        return this.commandBus.execute(
          new UpdatePaymentMerchantGatewayEligibilityCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentMerchantGatewayEligibilityDto | UpdatePaymentMerchantGatewayEligibilityDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentMerchantGatewayEligibilityCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentMerchantGatewayEligibilityDto | UpdatePaymentMerchantGatewayEligibilityDto).createdBy ||
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentMerchantGatewayEligibility(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentMerchantGatewayEligibilityCommand(id));
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  // Queries
  @Query(() => PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>)
  async paymentmerchantgatewayeligibilitys(
    options?: FindManyOptions<PaymentMerchantGatewayEligibility>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>)
  async paymentmerchantgatewayeligibility(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>)
  async paymentmerchantgatewayeligibilitysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentMerchantGatewayEligibilityValueInput }) value: PaymentMerchantGatewayEligibilityValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>)
  async paymentmerchantgatewayeligibilitysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => Number)
  async totalPaymentMerchantGatewayEligibilitys(): Promise<number> {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>)
  async searchPaymentMerchantGatewayEligibilitys(
    @Args("where", { type: () => PaymentMerchantGatewayEligibilityDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>> {
    const paymentmerchantgatewayeligibilitys = await this.service.findAndCount(where);
    return paymentmerchantgatewayeligibilitys;
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>, { nullable: true })
  async findOnePaymentMerchantGatewayEligibility(
    @Args("where", { type: () => PaymentMerchantGatewayEligibilityDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
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
      .registerClient(PaymentMerchantGatewayEligibilityResolver.name)

      .get(PaymentMerchantGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>)
  async findOnePaymentMerchantGatewayEligibilityOrFail(
    @Args("where", { type: () => PaymentMerchantGatewayEligibilityDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility> | Error> {
    return this.service.findOneOrFail(where);
  }
}

