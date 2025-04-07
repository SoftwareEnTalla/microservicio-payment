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
import { PaymentCommandService } from "../services/paymentcommand.service";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { Payment } from "../entities/payment.entity";
import { PaymentResponse, PaymentsResponse } from "../types/payment.types";
import { CreatePaymentDto } from "../dtos/createpayment.dto";
import { UpdatePaymentDto } from "../dtos/updatepayment.dto";
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";

import { BadRequestException } from "@nestjs/common";

@ApiTags("Payment Command")
@Controller("payments/command")
export class PaymentCommandController {

  #logger = new Logger(PaymentCommandController.name);

  //Constructor del controlador: PaymentCommandController
  constructor(private readonly service: PaymentCommandService) {}

  
  
  @ApiOperation({ summary: "Create a new payment" })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, type: PaymentResponse<Payment> })
  @Post()
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

  
  
  @ApiOperation({ summary: "Create multiple payments" })
  @ApiBody({ type: [CreatePaymentDto] })
  @ApiResponse({ status: 201, type: PaymentsResponse<Payment> })
  @Post("bulk")
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

  
  
  @ApiOperation({ summary: "Update an payment" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdatePaymentDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: PaymentResponse<Payment> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia Payment a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
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
  async update(
    @Param("id") id: string,
    @Body() partialEntity: UpdatePaymentDto
  ): Promise<PaymentResponse<Payment>> {
    try {
      // ✅ Validación de coincidencia de IDs
      if (id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de Payment a actualizar."
        );
      }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de Payment no encontrada.");
      }

      return entity;
    } catch (error) {
      this.#logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple payments" })
  @ApiBody({ type: [UpdatePaymentDto] })
  @ApiResponse({ status: 200, type: PaymentsResponse<Payment> })
  @Put("bulk")
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

  
  
  @ApiOperation({ summary: "Delete an payment" })   
  @ApiResponse({ status: 200, type: PaymentResponse<Payment>,description:
    "Instancia de Payment eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia Payment a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
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

  
  
  @ApiOperation({ summary: "Delete multiple payments" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
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
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

