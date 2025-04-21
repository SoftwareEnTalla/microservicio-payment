import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";

import { BaseEntity } from "../entities/base.entity";
import { Payment } from "../entities/payment.entity";
import { PaymentQueryRepository } from "./paymentquery.repository";
import { generateCacheKey } from "src/utils/functions";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentRepository } from "./payment.repository";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class PaymentCommandRepository {
  //Constructor del repositorio de datos: PaymentCommandRepository
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
    private readonly paymentRepository: PaymentQueryRepository
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(Payment.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${Payment.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payment>("createPayment", args[0], args[1]),
    ttl: 60,
  })
  async create(entity: Payment): Promise<Payment> {
    return this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Payment[]>("createPayments", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(entities: Payment[]): Promise<Payment[]> {
    return this.repository.save(entities);
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<Payment>("updatePayment", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: Partial<Payment>
  ): Promise<Payment | null> {
    let result: UpdateResult = await this.repository.update(id, partialEntity);
    return this.paymentRepository.findById(id);
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Payment[]>("updatePayments", args[0], args[1]),
    ttl: 60,
  })
  async bulkUpdate(entities: Partial<Payment>[]): Promise<Payment[]> {
    const updatedEntities: Payment[] = [];
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
        }
      }
    }
    return updatedEntities;
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string>("deletePayment", args[0]),
    ttl: 60,
  })
  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete({ id });
  }

  @LogExecutionTime({
    layer: "repository",
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
      .registerClient(PaymentRepository.name)
      .get(PaymentRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePayments", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.delete(ids);
  }
}
