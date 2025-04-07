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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { PaymentCommandService } from "../services/paymentcommand.service";

import { DeleteResult, FindManyOptions } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { Payment } from "../entities/payment.entity";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { CreatePaymentDto, PaymentDto } from "../dtos/createpayment.dto";
import { UpdatePaymentDto } from "../dtos/updatepayment.dto";
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { Order } from "@common/dto/args/pagination.args";
import { PaymentQueryService } from "../services/paymentquery.service";

@ApiTags("Payment Command")
@Controller("payments/command")
export class PaymentCommandController {
  #logger = new Logger(PaymentCommandController.name);

  //Constructor del controlador: PaymentCommandController
  constructor(private readonly service: PaymentCommandService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all payment with optional pagination" })
  @ApiResponse({ status: 200, type: PaymentsResponse })
  @ApiQuery({ name: "options", required: false, type: PaymentDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: () => Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<Payment>
  ): Promise<PaymentsResponse<Payment>> {
    try {
      return {
        data: [new Payment()],
        ok: true,
        count: 0,
        message: "Paginación exitosa",
      };
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @ApiOperation({ summary: "Create a new payment" })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, type: PaymentResponse<Payment> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandController.name)
      .get(PaymentCommandController.name),
  })
  async create(
    @Body() createPaymentDtoInput: CreatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.service.create(createPaymentDtoInput);

      if (!entity) {
        throw new NotFoundException("Payment entity not found.");
      }

      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandController.name)
      .get(PaymentCommandController.name),
  })
  @Post("bulk")
  @ApiOperation({ summary: "Create multiple payments" })
  @ApiBody({ type: [CreatePaymentDto] })
  @ApiResponse({ status: 201, type: PaymentsResponse<Payment> })
  async bulkCreate(
    @Body() createPaymentDtosInput: CreatePaymentDto[]
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.service.bulkCreate(createPaymentDtosInput);

      if (!entities) {
        throw new NotFoundException("Payment entities not found.");
      }

      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandController.name)
      .get(PaymentCommandController.name),
  })
  @Put(":id")
  @ApiOperation({ summary: "Update an payment" })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ status: 200, type: PaymentResponse<Payment> })
  async update(
    @Param("id") id: string,
    @Body() partialEntity: UpdatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Payment entity not found.");
      }

      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandController.name)
      .get(PaymentCommandController.name),
  })
  @Put("bulk")
  @ApiOperation({ summary: "Update multiple payments" })
  @ApiBody({ type: [UpdatePaymentDto] })
  @ApiResponse({ status: 200, type: PaymentsResponse<Payment> })
  async bulkUpdate(
    @Body() partialEntities: UpdatePaymentDto[]
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("Payment entities not found.");
      }

      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandController.name)
      .get(PaymentCommandController.name),
  })
  @Delete(":id")
  @ApiOperation({ summary: "Delete an payment" })
  @ApiResponse({ status: 200, type: PaymentResponse<Payment> })
  async delete(@Param("id") id: string): Promise<PaymentResponse<Payment>> {
    try {
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("Payment entity not found.");
      }

      return result;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentCommandController.name)
      .get(PaymentCommandController.name),
  })
  @Delete("bulk")
  @ApiOperation({ summary: "Delete multiple payments" })
  @ApiResponse({ status: 200, type: DeleteResult })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}
