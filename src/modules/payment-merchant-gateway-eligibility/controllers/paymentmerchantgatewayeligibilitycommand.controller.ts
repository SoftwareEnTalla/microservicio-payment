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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { PaymentMerchantGatewayEligibilityCommandService } from "../services/paymentmerchantgatewayeligibilitycommand.service";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { PaymentMerchantGatewayEligibility } from "../entities/payment-merchant-gateway-eligibility.entity";
import { PaymentMerchantGatewayEligibilityResponse, PaymentMerchantGatewayEligibilitysResponse } from "../types/paymentmerchantgatewayeligibility.types";
import { CreatePaymentMerchantGatewayEligibilityDto, UpdatePaymentMerchantGatewayEligibilityDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { PaymentMerchantGatewayEligibilityCreatedEvent } from "../events/paymentmerchantgatewayeligibilitycreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("PaymentMerchantGatewayEligibility Command")
@Controller("paymentmerchantgatewayeligibilitys/command")
export class PaymentMerchantGatewayEligibilityCommandController {

  #logger = new Logger(PaymentMerchantGatewayEligibilityCommandController.name);

  //Constructor del controlador: PaymentMerchantGatewayEligibilityCommandController
  constructor(
  private readonly service: PaymentMerchantGatewayEligibilityCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new paymentmerchantgatewayeligibility" })
  @ApiBody({ type: CreatePaymentMerchantGatewayEligibilityDto })
  @ApiResponse({ status: 201, type: PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMerchantGatewayEligibilityCommandController.name)
      .get(PaymentMerchantGatewayEligibilityCommandController.name),
  })
  async create(
    @Body() createPaymentMerchantGatewayEligibilityDtoInput: CreatePaymentMerchantGatewayEligibilityDto
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
    try {
      logger.info("Receiving in controller:", createPaymentMerchantGatewayEligibilityDtoInput);
      const entity = await this.service.create(createPaymentMerchantGatewayEligibilityDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response paymentmerchantgatewayeligibility entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("PaymentMerchantGatewayEligibility entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id paymentmerchantgatewayeligibility is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple paymentmerchantgatewayeligibilitys" })
  @ApiBody({ type: [CreatePaymentMerchantGatewayEligibilityDto] })
  @ApiResponse({ status: 201, type: PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMerchantGatewayEligibilityCommandController.name)
      .get(PaymentMerchantGatewayEligibilityCommandController.name),
  })
  async bulkCreate(
    @Body() createPaymentMerchantGatewayEligibilityDtosInput: CreatePaymentMerchantGatewayEligibilityDto[]
  ): Promise<PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>> {
    try {
      const entities = await this.service.bulkCreate(createPaymentMerchantGatewayEligibilityDtosInput);

      if (!entities) {
        throw new NotFoundException("PaymentMerchantGatewayEligibility entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an paymentmerchantgatewayeligibility" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdatePaymentMerchantGatewayEligibilityDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia PaymentMerchantGatewayEligibility a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMerchantGatewayEligibilityCommandController.name)
      .get(PaymentMerchantGatewayEligibilityCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (partialEntity?.id && id !== partialEntity.id) {

        throw new BadRequestException(

          "El ID en la URL no coincide con el ID en la instancia de PaymentMerchantGatewayEligibility a actualizar."

        );

      }

      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de PaymentMerchantGatewayEligibility no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple paymentmerchantgatewayeligibilitys" })
  @ApiBody({ type: [UpdatePaymentMerchantGatewayEligibilityDto] })
  @ApiResponse({ status: 200, type: PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMerchantGatewayEligibilityCommandController.name)
      .get(PaymentMerchantGatewayEligibilityCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdatePaymentMerchantGatewayEligibilityDto[]
  ): Promise<PaymentMerchantGatewayEligibilitysResponse<PaymentMerchantGatewayEligibility>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("PaymentMerchantGatewayEligibility entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an paymentmerchantgatewayeligibility" })   
  @ApiResponse({ status: 200, type: PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>,description:
    "Instancia de PaymentMerchantGatewayEligibility eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia PaymentMerchantGatewayEligibility a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMerchantGatewayEligibilityCommandController.name)
      .get(PaymentMerchantGatewayEligibilityCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<PaymentMerchantGatewayEligibilityResponse<PaymentMerchantGatewayEligibility>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("PaymentMerchantGatewayEligibility entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple paymentmerchantgatewayeligibilitys" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMerchantGatewayEligibilityCommandController.name)
      .get(PaymentMerchantGatewayEligibilityCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

