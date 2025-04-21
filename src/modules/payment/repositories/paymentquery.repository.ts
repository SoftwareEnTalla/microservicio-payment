import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
  DeleteResult,
  UpdateResult,
} from "typeorm";
import { BaseEntity } from "../entities/base.entity";
import { Payment } from "../entities/payment.entity";
import { generateCacheKey } from "src/utils/functions";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentRepository } from "./payment.repository";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

@Injectable()
export class PaymentQueryRepository {
  //Constructor del repositorio de datos: PaymentQueryRepository
  constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>
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
  async findAll(options?: FindManyOptions<Payment>): Promise<Payment[]> {
    return this.repository.find(options);
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
  async findById(id: string): Promise<Payment | null> {
    const tmp: FindOptionsWhere<Payment> = { id } as FindOptionsWhere<Payment>;
    return this.repository.findOneBy(tmp);
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
  async findByField(
    field: string,
    value: any,
    page: number,
    limit: number
  ): Promise<Payment[]> {
    const [entities] = await this.repository.findAndCount({
      where: { [field]: value },
      skip: (page - 1) * limit,
      take: limit,
    });
    return entities;
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
  async findWithPagination(
    options: FindManyOptions<Payment>,
    page: number,
    limit: number
  ): Promise<Payment[]> {
    const skip = (page - 1) * limit;
    return this.repository.find({ ...options, skip, take: limit });
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
  async count(): Promise<number> {
    return this.repository.count();
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
  async findAndCount(
    where?: Record<string, any>
  ): Promise<[Payment[], number]> {
    return this.repository.findAndCount({
      where: where,
    });
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
  async findOne(where?: Record<string, any>): Promise<Payment | null> {
    return this.repository.findOne({
      where: where,
    });
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
  async findOneOrFail(where?: Record<string, any>): Promise<Payment> {
    const entity = await this.repository.findOne({
      where: where,
    });
    if (!entity) {
      throw new Error("Entity not found");
    }
    return entity;
  }
}
