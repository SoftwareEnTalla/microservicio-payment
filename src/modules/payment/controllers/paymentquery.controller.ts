import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { PaymentQueryService } from "../services/paymentquery.service";
import { FindManyOptions } from "typeorm";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { Payment } from "../entities/payment.entity";
import { Order, PaginationArgs } from "src/common/dto/args/pagination.args";
import { Helper } from "src/common/helpers/helpers";
import { PaymentDto } from "../dtos/createpayment.dto";

@ApiTags("Payment Query")
@Controller("payments/query")
export class PaymentQueryController {
  #logger = new Logger(PaymentQueryController.name);

  constructor(private readonly service: PaymentQueryService) {}

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
      const payments = await this.service.findAll(options);
      this.#logger.verbose("Retrieving all payment");
      return payments;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get payment by ID" })
  @ApiResponse({ status: 200, type: PaymentResponse<Payment> })
  @ApiResponse({ status: 404, description: "Payment not found" })
  @ApiParam({
    name: "id",
    required: true,
    description: "ID of the payment to retrieve",
    type: String,
  })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<PaymentResponse<Payment>> {
    try {
      const payment = await this.service.findOne({ where: { id } });
      if (!payment) {
        throw new NotFoundException(
          "Payment no encontrado para el id solicitado"
        );
      }
      return payment;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find payment by specific field" })
  @ApiQuery({
    name: "value",
    required: true,
    description: "Value to search for",
    type: String,
  }) // Documenta el parámetro de consulta
  @ApiParam({
    name: "field",
    required: true,
    description: "Field to filter payment",
    type: String,
  }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: PaymentsResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const entities = await this.service.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      if (!entities) {
        throw new NotFoundException(
          "Payment no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("pagination")
  @ApiOperation({ summary: "Find payments with pagination" })
  @ApiResponse({ status: 200, type: PaymentsResponse<Payment> })
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
  async findWithPagination(
    @Query() options: FindManyOptions<Payment>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: Order,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        order || Order.asc, // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades Payments no encontradas.");
      }
      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all payments" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count payments with conditions" })
  @ApiResponse({ status: 200, type: PaymentsResponse<Payment> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
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
  async findAndCount(
    @Query() where: Record<string, any> = {},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: Order,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<PaymentsResponse<Payment>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        order || Order.asc, // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount({
        where: where,
        paginationArgs: paginationArgs,
      });

      if (!entities) {
        throw new NotFoundException(
          "Entidades Payments no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one payment with conditions" })
  @ApiResponse({ status: 200, type: PaymentResponse<Payment> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findOne(
    @Query() where: Record<string, any> = {}
  ): Promise<PaymentResponse<Payment>> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        throw new NotFoundException("Entidad Payment no encontrada.");
      }
      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one payment or return error" })
  @ApiResponse({ status: 200, type: PaymentResponse<Payment> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(PaymentQueryService.name)
      .get(PaymentQueryService.name),
  })
  async findOneOrFail(
    @Query() where: Record<string, any> = {}
  ): Promise<PaymentResponse<Payment> | Error> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        return new NotFoundException("Entidad Payment no encontrada.");
      }
      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}
