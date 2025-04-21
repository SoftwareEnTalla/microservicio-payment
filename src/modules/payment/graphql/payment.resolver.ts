import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  PaymentDto,
  CreatePaymentDto,
  CreateOrUpdatePaymentDto,
  PaymentValueInput,
} from "../dtos/createpayment.dto";
import { Payment } from "../entities/payment.entity";
import {
  CreatePaymentCommand,
  UpdatePaymentCommand,
  DeletePaymentCommand,
} from "../commands/exporting.command";
import { CommandBus } from "@nestjs/cqrs";
import { PaymentQueryService } from "../services/paymentquery.service";

import { UpdatePaymentDto } from "../dtos/updatepayment.dto";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Payment)
export class PaymentResolver {
  //Constructor del resolver de Payment
  constructor(
    private readonly service: PaymentQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  // Mutaciones
  @Mutation(() => PaymentResponse<Payment>)
  async createPayment(
    @Args("input", { type: () => CreatePaymentDto }) input: CreatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    return this.commandBus.execute(new CreatePaymentCommand(input));
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Mutation(() => PaymentResponse<Payment>)
  async updatePayment(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    return this.commandBus.execute(new UpdatePaymentCommand(id, input));
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Mutation(() => PaymentResponse<Payment>)
  async createOrUpdatePayment(
    @Args("data", { type: () => CreateOrUpdatePaymentDto })
    data: CreateOrUpdatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    if (data.id) {
      const existingPayment = await this.service.findById(data.id);
      if (existingPayment) {
        return this.commandBus.execute(
          new UpdatePaymentCommand(
            data.id,
            data.input as CreatePaymentDto | UpdatePaymentDto
          )
        );
      }
    }
    return this.commandBus.execute(new CreatePaymentCommand(data.input));
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Mutation(() => Boolean)
  async deletePayment(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentCommand(id));
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  // Queries
  @Query(() => PaymentsResponse<Payment>)
  async payments(
    options?: FindManyOptions<Payment>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentsResponse<Payment>> {
    return this.service.findAll(options, paginationArgs);
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => PaymentsResponse<Payment>)
  async payment(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentResponse<Payment>> {
    return this.service.findById(id);
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => PaymentsResponse<Payment>)
  async paymentsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentValueInput }) value: PaymentValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentsResponse<Payment>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => PaymentsResponse<Payment>)
  async paymentsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentsResponse<Payment>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => Number)
  async totalPayments(): Promise<number> {
    return this.service.count();
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => PaymentsResponse<Payment>)
  async searchPayments(
    @Args("where", { type: () => PaymentDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentsResponse<Payment>> {
    const payments = await this.service.findAndCount(where);
    return payments;
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => PaymentResponse<Payment>, { nullable: true })
  async findOnePayment(
    @Args("where", { type: () => PaymentDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentResponse<Payment>> {
    return this.service.findOne(where);
  }

  @LogExecutionTime({
    layer: "resolver",
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
      .registerClient(PaymentResolver.name)

      .get(PaymentResolver.name),
  })
  @Query(() => PaymentResponse<Payment>)
  async findOnePaymentOrFail(
    @Args("where", { type: () => PaymentDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentResponse<Payment> | Error> {
    return this.service.findOneOrFail(where);
  }
}
