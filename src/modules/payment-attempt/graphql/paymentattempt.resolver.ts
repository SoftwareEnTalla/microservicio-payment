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
import { PaymentAttempt } from "../entities/payment-attempt.entity";

//Definición de comandos
import {
  CreatePaymentAttemptCommand,
  UpdatePaymentAttemptCommand,
  DeletePaymentAttemptCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentAttemptQueryService } from "../services/paymentattemptquery.service";


import { PaymentAttemptResponse, PaymentAttemptsResponse } from "../types/paymentattempt.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentAttemptDto, 
CreateOrUpdatePaymentAttemptDto, 
PaymentAttemptValueInput, 
PaymentAttemptDto, 
CreatePaymentAttemptDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentAttempt)
export class PaymentAttemptResolver {

   //Constructor del resolver de PaymentAttempt
  constructor(
    private readonly service: PaymentAttemptQueryService,
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentAttemptResponse<PaymentAttempt>)
  async createPaymentAttempt(
    @Args("input", { type: () => CreatePaymentAttemptDto }) input: CreatePaymentAttemptDto
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
    return this.commandBus.execute(new CreatePaymentAttemptCommand(input));
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Mutation(() => PaymentAttemptResponse<PaymentAttempt>)
  async updatePaymentAttempt(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentAttemptDto
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentAttemptCommand(payLoad, {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Mutation(() => PaymentAttemptResponse<PaymentAttempt>)
  async createOrUpdatePaymentAttempt(
    @Args("data", { type: () => CreateOrUpdatePaymentAttemptDto })
    data: CreateOrUpdatePaymentAttemptDto
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
    if (data.id) {
      const existingPaymentAttempt = await this.service.findById(data.id);
      if (existingPaymentAttempt) {
        return this.commandBus.execute(
          new UpdatePaymentAttemptCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentAttemptDto | UpdatePaymentAttemptDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentAttemptCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentAttemptDto | UpdatePaymentAttemptDto).createdBy ||
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentAttempt(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentAttemptCommand(id));
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  // Queries
  @Query(() => PaymentAttemptsResponse<PaymentAttempt>)
  async paymentattempts(
    options?: FindManyOptions<PaymentAttempt>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentAttemptsResponse<PaymentAttempt>> {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => PaymentAttemptsResponse<PaymentAttempt>)
  async paymentattempt(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => PaymentAttemptsResponse<PaymentAttempt>)
  async paymentattemptsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentAttemptValueInput }) value: PaymentAttemptValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentAttemptsResponse<PaymentAttempt>> {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => PaymentAttemptsResponse<PaymentAttempt>)
  async paymentattemptsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentAttemptsResponse<PaymentAttempt>> {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => Number)
  async totalPaymentAttempts(): Promise<number> {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => PaymentAttemptsResponse<PaymentAttempt>)
  async searchPaymentAttempts(
    @Args("where", { type: () => PaymentAttemptDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentAttemptsResponse<PaymentAttempt>> {
    const paymentattempts = await this.service.findAndCount(where);
    return paymentattempts;
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => PaymentAttemptResponse<PaymentAttempt>, { nullable: true })
  async findOnePaymentAttempt(
    @Args("where", { type: () => PaymentAttemptDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentAttemptResponse<PaymentAttempt>> {
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
      .registerClient(PaymentAttemptResolver.name)

      .get(PaymentAttemptResolver.name),
    })
  @Query(() => PaymentAttemptResponse<PaymentAttempt>)
  async findOnePaymentAttemptOrFail(
    @Args("where", { type: () => PaymentAttemptDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentAttemptResponse<PaymentAttempt> | Error> {
    return this.service.findOneOrFail(where);
  }
}

