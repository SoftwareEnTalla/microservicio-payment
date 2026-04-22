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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { PaymentGateway } from "../entities/payment-gateway.entity";
import { BaseEntity } from "../entities/base.entity";
import { PaymentGatewayQueryRepository } from "../repositories/paymentgatewayquery.repository";
import { PaymentGatewayResponse, PaymentGatewaysResponse } from "../types/paymentgateway.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { ModuleRef } from "@nestjs/core";
import { logger } from '@core/logs/logger';



@Injectable()
export class PaymentGatewayQueryService implements OnModuleInit{
  // Private properties
  readonly #logger = new Logger(PaymentGatewayQueryService.name);
  private readonly loggerClient = LoggerClient.getInstance();

  constructor(private readonly repository: PaymentGatewayQueryRepository,
  private moduleRef: ModuleRef
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(PaymentGateway.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${PaymentGateway.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        logger.info(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<PaymentGateway>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
    try {
      const paymentgateways = await this.repository.findAll(options);
      // Devolver respuesta
      logger.info("sms");
      return {
        ok: true,
        message: "Listado de paymentgateways obtenido con éxito",
        data: paymentgateways,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          paymentgateways.length
        ),
        count: paymentgateways.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findById(id: string): Promise<PaymentGatewayResponse<PaymentGateway>> {
    try {
      const paymentgateway = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el paymentgateway no existe
      if (!paymentgateway)
        throw new NotFoundException(
          "PaymentGateway no encontrado para el id solicitado"
        );
      // Devolver paymentgateway
      return {
        ok: true,
        message: "PaymentGateway obtenido con éxito",
        data: paymentgateway,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }



  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      // Respuesta si el paymentgateway no existe
      if (!entities)
        throw new NotFoundException(
          "PaymentGateways no encontrados para la propiedad y valor especificado"
        );
      // Devolver paymentgateway
      return {
        ok: true,
        message: "PaymentGateways obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
 

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<PaymentGateway>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el paymentgateway no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentGateways no encontradas.");
      // Devolver paymentgateway
      return {
        ok: true,
        message: "PaymentGateway obtenido con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
  


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
  }

 

  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentGatewaysResponse<PaymentGateway>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: where,
      });

      // Respuesta si el paymentgateway no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades PaymentGateways no encontradas para el criterio especificado."
        );
      // Devolver paymentgateway
      return {
        ok: true,
        message: "PaymentGateways obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }




  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<PaymentGatewayResponse<PaymentGateway>> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

      // Respuesta si el paymentgateway no existe
      if (!entity)
        throw new NotFoundException("Entidad PaymentGateway no encontrada.");
      // Devolver paymentgateway
      return {
        ok: true,
        message: "PaymentGateway obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
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
      .registerClient(PaymentGatewayQueryService.name)
      .get(PaymentGatewayQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<PaymentGatewayResponse<PaymentGateway> | Error> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

      // Respuesta si el paymentgateway no existe
      if (!entity)
        return new NotFoundException("Entidad PaymentGateway no encontrada.");
      // Devolver paymentgateway
      return {
        ok: true,
        message: "PaymentGateway obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
}



