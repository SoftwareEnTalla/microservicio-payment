import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { Payment } from "../entities/payment.entity";
import { CreatePaymentDto } from "../dtos/createpayment.dto";
import { UpdatePaymentDto } from "../dtos/updatepayment.dto";
import { DeletePaymentDto } from "../dtos/deletepayment.dto";
import { generateCacheKey } from "src/utils/functions";
import { PaymentCommandRepository } from "../repositories/paymentcommand.repository";
import { PaymentQueryRepository } from "../repositories/paymentquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class PaymentCommandService {
  // Private properties
  readonly #logger = new Logger(PaymentCommandService.name);
  //Constructo del servicio PaymentCommandService
  constructor(
    private readonly repository: PaymentCommandRepository,
    private readonly queryRepository: PaymentQueryRepository
  ) {
    //Inicialice aquí propiedades o atributos
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePaymentDto>("createPayment", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPaymentDtoInput: CreatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.repository.create(
        Payment.fromDto(createPaymentDtoInput)
      );

      // Respuesta si el payment no existe
      if (!entity)
        throw new NotFoundException("Entidad Payment no encontrada.");
      // Devolver payment
      return {
        ok: true,
        message: "Payment obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Payment>("createPayments", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPaymentDtosInput: CreatePaymentDto[]
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPaymentDtosInput.map((entity) => Payment.fromDto(entity))
      );

      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payments creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentDto>("updatePayment", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.repository.update(
        id,
        Payment.fromDto(partialEntity)
      );
      // Respuesta si el payment no existe
      if (!entity)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payment actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentDto>("updatePayments", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePaymentDto[]
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Payment.fromDto(entity))
      );
      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payments actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePaymentDto>("deletePayment", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el payment no existe
      if (!entity)
        throw new NotFoundException("Instancias de Payment no encontradas.");

      const result = await this.repository.delete(id);
      // Devolver payment
      return {
        ok: true,
        message: "Instancia de Payment eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try {
        return await client.send(logData);
      } catch (error) {
        console.info(
          "Ha ocurrido un error al enviar la traza de log: ",
          logData
        );
        console.info("ERROR-LOG: ", error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandService.name)
      .get(PaymentCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePayments", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}
