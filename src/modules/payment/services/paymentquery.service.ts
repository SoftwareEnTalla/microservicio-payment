import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { Payment } from "../entities/payment.entity";
import { BaseEntity } from "../entities/base.entity";
import { PaymentQueryRepository } from "../repositories/paymentquery.repository";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class PaymentQueryService {
  // Private properties
  readonly #logger = new Logger(PaymentQueryService.name);
  private readonly loggerClient = new LoggerClient();

  constructor(private readonly repository: PaymentQueryRepository) {
    this.validate();
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(Payment.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${Payment.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        this.#logger.verbose(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      this.#logger.error(error);
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<Payment>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const payments = await this.repository.findAll(options);
      // Devolver respuesta
      this.#logger.verbose("sms");
      return {
        ok: true,
        message: "Listado de payments obtenido con éxito",
        data: payments,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          payments.length
        ),
        count: payments.length,
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findById(id: string): Promise<PaymentResponse<Payment>> {
    try {
      const payment = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el payment no existe
      if (!payment)
        throw new NotFoundException(
          "Payment no encontrado para el id solicitado"
        );
      // Devolver payment
      return {
        ok: true,
        message: "Payment obtenido con éxito",
        data: payment,
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException(
          "Payments no encontrados para la propiedad y valor especificado"
        );
      // Devolver payment
      return {
        ok: true,
        message: "Payments obtenidos con éxito.",
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<Payment>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException("Entidades Payments no encontradas.");
      // Devolver payment
      return {
        ok: true,
        message: "Payment obtenido con éxito.",
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: where,
      });

      // Respuesta si el payment no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades Payments no encontradas para el criterio especificado."
        );
      // Devolver payment
      return {
        ok: true,
        message: "Payments obtenidos con éxito.",
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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findOne(
    where?: Record<string, any>
  ): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

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
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<PaymentResponse<Payment> | Error> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

      // Respuesta si el payment no existe
      if (!entity)
        return new NotFoundException("Entidad Payment no encontrada.");
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
}
