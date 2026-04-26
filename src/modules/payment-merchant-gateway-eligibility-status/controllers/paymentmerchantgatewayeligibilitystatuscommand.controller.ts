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
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PaymentMerchantGatewayEligibilityStatusCommandService } from "../services/paymentmerchantgatewayeligibilitystatuscommand.service";
import { PaymentMerchantGatewayEligibilityStatusAuthGuard } from "../guards/paymentmerchantgatewayeligibilitystatusauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { PaymentMerchantGatewayEligibilityStatus } from "../entities/payment-merchant-gateway-eligibility-status.entity";
import { PaymentMerchantGatewayEligibilityStatusResponse, PaymentMerchantGatewayEligibilityStatussResponse } from "../types/paymentmerchantgatewayeligibilitystatus.types";
import { CreatePaymentMerchantGatewayEligibilityStatusDto, UpdatePaymentMerchantGatewayEligibilityStatusDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { PaymentMerchantGatewayEligibilityStatusCreatedEvent } from "../events/paymentmerchantgatewayeligibilitystatuscreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("PaymentMerchantGatewayEligibilityStatus Command")
@UseGuards(PaymentMerchantGatewayEligibilityStatusAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("paymentmerchantgatewayeligibilitystatuss/command")
export class PaymentMerchantGatewayEligibilityStatusCommandController {

  #logger = new Logger(PaymentMerchantGatewayEligibilityStatusCommandController.name);

  //Constructor del controlador: PaymentMerchantGatewayEligibilityStatusCommandController
  constructor(
  private readonly service: PaymentMerchantGatewayEligibilityStatusCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new paymentmerchantgatewayeligibilitystatus" })
  @ApiBody({ type: CreatePaymentMerchantGatewayEligibilityStatusDto })
  @ApiResponse({ status: 201, type: PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus> })
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusCommandController.name)
      .get(PaymentMerchantGatewayEligibilityStatusCommandController.name),
  })
  async create(
    @Body() createPaymentMerchantGatewayEligibilityStatusDtoInput: CreatePaymentMerchantGatewayEligibilityStatusDto
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
    try {
      logger.info("Receiving in controller:", createPaymentMerchantGatewayEligibilityStatusDtoInput);
      const entity = await this.service.create(createPaymentMerchantGatewayEligibilityStatusDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response paymentmerchantgatewayeligibilitystatus entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("PaymentMerchantGatewayEligibilityStatus entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id paymentmerchantgatewayeligibilitystatus is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple paymentmerchantgatewayeligibilitystatuss" })
  @ApiBody({ type: [CreatePaymentMerchantGatewayEligibilityStatusDto] })
  @ApiResponse({ status: 201, type: PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus> })
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusCommandController.name)
      .get(PaymentMerchantGatewayEligibilityStatusCommandController.name),
  })
  async bulkCreate(
    @Body() createPaymentMerchantGatewayEligibilityStatusDtosInput: CreatePaymentMerchantGatewayEligibilityStatusDto[]
  ): Promise<PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>> {
    try {
      const entities = await this.service.bulkCreate(createPaymentMerchantGatewayEligibilityStatusDtosInput);

      if (!entities) {
        throw new NotFoundException("PaymentMerchantGatewayEligibilityStatus entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an paymentmerchantgatewayeligibilitystatus" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdatePaymentMerchantGatewayEligibilityStatusDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia PaymentMerchantGatewayEligibilityStatus a actualizar.",
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusCommandController.name)
      .get(PaymentMerchantGatewayEligibilityStatusCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs (auto-asigna id de la URL si el body no lo trae)
      if (partialEntity?.id && id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de PaymentMerchantGatewayEligibilityStatus a actualizar."
        );
      }
      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de PaymentMerchantGatewayEligibilityStatus no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple paymentmerchantgatewayeligibilitystatuss" })
  @ApiBody({ type: [UpdatePaymentMerchantGatewayEligibilityStatusDto] })
  @ApiResponse({ status: 200, type: PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus> })
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusCommandController.name)
      .get(PaymentMerchantGatewayEligibilityStatusCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdatePaymentMerchantGatewayEligibilityStatusDto[]
  ): Promise<PaymentMerchantGatewayEligibilityStatussResponse<PaymentMerchantGatewayEligibilityStatus>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("PaymentMerchantGatewayEligibilityStatus entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an paymentmerchantgatewayeligibilitystatus" })   
  @ApiResponse({ status: 200, type: PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>,description:
    "Instancia de PaymentMerchantGatewayEligibilityStatus eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia PaymentMerchantGatewayEligibilityStatus a eliminar.",
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusCommandController.name)
      .get(PaymentMerchantGatewayEligibilityStatusCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<PaymentMerchantGatewayEligibilityStatusResponse<PaymentMerchantGatewayEligibilityStatus>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("PaymentMerchantGatewayEligibilityStatus entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple paymentmerchantgatewayeligibilitystatuss" })
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
      .registerClient(PaymentMerchantGatewayEligibilityStatusCommandController.name)
      .get(PaymentMerchantGatewayEligibilityStatusCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

