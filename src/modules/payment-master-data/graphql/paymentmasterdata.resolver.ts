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
import { PaymentMasterData } from "../entities/payment-master-data.entity";

//Definición de comandos
import {
  CreatePaymentMasterDataCommand,
  UpdatePaymentMasterDataCommand,
  DeletePaymentMasterDataCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentMasterDataQueryService } from "../services/paymentmasterdataquery.service";


import { PaymentMasterDataResponse, PaymentMasterDatasResponse } from "../types/paymentmasterdata.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentMasterDataDto, 
CreateOrUpdatePaymentMasterDataDto, 
PaymentMasterDataValueInput, 
PaymentMasterDataDto, 
CreatePaymentMasterDataDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentMasterData)
export class PaymentMasterDataResolver {

   //Constructor del resolver de PaymentMasterData
  constructor(
    private readonly service: PaymentMasterDataQueryService,
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentMasterDataResponse<PaymentMasterData>)
  async createPaymentMasterData(
    @Args("input", { type: () => CreatePaymentMasterDataDto }) input: CreatePaymentMasterDataDto
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
    return this.commandBus.execute(new CreatePaymentMasterDataCommand(input));
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Mutation(() => PaymentMasterDataResponse<PaymentMasterData>)
  async updatePaymentMasterData(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentMasterDataDto
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentMasterDataCommand(payLoad, {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Mutation(() => PaymentMasterDataResponse<PaymentMasterData>)
  async createOrUpdatePaymentMasterData(
    @Args("data", { type: () => CreateOrUpdatePaymentMasterDataDto })
    data: CreateOrUpdatePaymentMasterDataDto
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
    if (data.id) {
      const existingPaymentMasterData = await this.service.findById(data.id);
      if (existingPaymentMasterData) {
        return this.commandBus.execute(
          new UpdatePaymentMasterDataCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentMasterDataDto | UpdatePaymentMasterDataDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentMasterDataCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentMasterDataDto | UpdatePaymentMasterDataDto).createdBy ||
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentMasterData(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentMasterDataCommand(id));
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  // Queries
  @Query(() => PaymentMasterDatasResponse<PaymentMasterData>)
  async paymentmasterdatas(
    options?: FindManyOptions<PaymentMasterData>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentMasterDatasResponse<PaymentMasterData>> {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => PaymentMasterDatasResponse<PaymentMasterData>)
  async paymentmasterdata(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => PaymentMasterDatasResponse<PaymentMasterData>)
  async paymentmasterdatasByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentMasterDataValueInput }) value: PaymentMasterDataValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMasterDatasResponse<PaymentMasterData>> {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => PaymentMasterDatasResponse<PaymentMasterData>)
  async paymentmasterdatasWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMasterDatasResponse<PaymentMasterData>> {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => Number)
  async totalPaymentMasterDatas(): Promise<number> {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => PaymentMasterDatasResponse<PaymentMasterData>)
  async searchPaymentMasterDatas(
    @Args("where", { type: () => PaymentMasterDataDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMasterDatasResponse<PaymentMasterData>> {
    const paymentmasterdatas = await this.service.findAndCount(where);
    return paymentmasterdatas;
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => PaymentMasterDataResponse<PaymentMasterData>, { nullable: true })
  async findOnePaymentMasterData(
    @Args("where", { type: () => PaymentMasterDataDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMasterDataResponse<PaymentMasterData>> {
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
      .registerClient(PaymentMasterDataResolver.name)

      .get(PaymentMasterDataResolver.name),
    })
  @Query(() => PaymentMasterDataResponse<PaymentMasterData>)
  async findOnePaymentMasterDataOrFail(
    @Args("where", { type: () => PaymentMasterDataDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMasterDataResponse<PaymentMasterData> | Error> {
    return this.service.findOneOrFail(where);
  }
}

