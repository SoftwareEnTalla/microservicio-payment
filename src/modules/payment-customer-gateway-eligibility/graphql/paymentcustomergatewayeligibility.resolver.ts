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
import { PaymentCustomerGatewayEligibility } from "../entities/payment-customer-gateway-eligibility.entity";

//Definición de comandos
import {
  CreatePaymentCustomerGatewayEligibilityCommand,
  UpdatePaymentCustomerGatewayEligibilityCommand,
  DeletePaymentCustomerGatewayEligibilityCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentCustomerGatewayEligibilityQueryService } from "../services/paymentcustomergatewayeligibilityquery.service";


import { PaymentCustomerGatewayEligibilityResponse, PaymentCustomerGatewayEligibilitysResponse } from "../types/paymentcustomergatewayeligibility.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentCustomerGatewayEligibilityDto, 
CreateOrUpdatePaymentCustomerGatewayEligibilityDto, 
PaymentCustomerGatewayEligibilityValueInput, 
PaymentCustomerGatewayEligibilityDto, 
CreatePaymentCustomerGatewayEligibilityDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentCustomerGatewayEligibility)
export class PaymentCustomerGatewayEligibilityResolver {

   //Constructor del resolver de PaymentCustomerGatewayEligibility
  constructor(
    private readonly service: PaymentCustomerGatewayEligibilityQueryService,
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>)
  async createPaymentCustomerGatewayEligibility(
    @Args("input", { type: () => CreatePaymentCustomerGatewayEligibilityDto }) input: CreatePaymentCustomerGatewayEligibilityDto
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
    return this.commandBus.execute(new CreatePaymentCustomerGatewayEligibilityCommand(input));
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Mutation(() => PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>)
  async updatePaymentCustomerGatewayEligibility(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentCustomerGatewayEligibilityDto
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentCustomerGatewayEligibilityCommand(payLoad, {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Mutation(() => PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>)
  async createOrUpdatePaymentCustomerGatewayEligibility(
    @Args("data", { type: () => CreateOrUpdatePaymentCustomerGatewayEligibilityDto })
    data: CreateOrUpdatePaymentCustomerGatewayEligibilityDto
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
    if (data.id) {
      const existingPaymentCustomerGatewayEligibility = await this.service.findById(data.id);
      if (existingPaymentCustomerGatewayEligibility) {
        return this.commandBus.execute(
          new UpdatePaymentCustomerGatewayEligibilityCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentCustomerGatewayEligibilityDto | UpdatePaymentCustomerGatewayEligibilityDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentCustomerGatewayEligibilityCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentCustomerGatewayEligibilityDto | UpdatePaymentCustomerGatewayEligibilityDto).createdBy ||
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentCustomerGatewayEligibility(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentCustomerGatewayEligibilityCommand(id));
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  // Queries
  @Query(() => PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>)
  async paymentcustomergatewayeligibilitys(
    options?: FindManyOptions<PaymentCustomerGatewayEligibility>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>> {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>)
  async paymentcustomergatewayeligibility(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>)
  async paymentcustomergatewayeligibilitysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentCustomerGatewayEligibilityValueInput }) value: PaymentCustomerGatewayEligibilityValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>> {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>)
  async paymentcustomergatewayeligibilitysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>> {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => Number)
  async totalPaymentCustomerGatewayEligibilitys(): Promise<number> {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>)
  async searchPaymentCustomerGatewayEligibilitys(
    @Args("where", { type: () => PaymentCustomerGatewayEligibilityDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentCustomerGatewayEligibilitysResponse<PaymentCustomerGatewayEligibility>> {
    const paymentcustomergatewayeligibilitys = await this.service.findAndCount(where);
    return paymentcustomergatewayeligibilitys;
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>, { nullable: true })
  async findOnePaymentCustomerGatewayEligibility(
    @Args("where", { type: () => PaymentCustomerGatewayEligibilityDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>> {
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
      .registerClient(PaymentCustomerGatewayEligibilityResolver.name)

      .get(PaymentCustomerGatewayEligibilityResolver.name),
    })
  @Query(() => PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility>)
  async findOnePaymentCustomerGatewayEligibilityOrFail(
    @Args("where", { type: () => PaymentCustomerGatewayEligibilityDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentCustomerGatewayEligibilityResponse<PaymentCustomerGatewayEligibility> | Error> {
    return this.service.findOneOrFail(where);
  }
}

