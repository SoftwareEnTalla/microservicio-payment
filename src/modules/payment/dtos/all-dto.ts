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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BasePaymentDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePayment',
    example: 'Nombre de instancia CreatePayment',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePayment).',
    example: 'Fecha de creación de la instancia (CreatePayment).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePayment).',
    example: 'Fecha de actualización de la instancia (CreatePayment).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePayment).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePayment).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePayment).',
    example: 'Estado de activación de la instancia (CreatePayment).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código interno del pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código interno del pago', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia externa del pago',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia externa del pago', nullable: true })
  externalReference?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del comercio',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del comercio', nullable: false })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del cliente',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del cliente', nullable: false })
  customerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador de la orden asociada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Identificador de la orden asociada', nullable: true })
  orderId?: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Monto total del pago',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Monto total del pago', nullable: false })
  amount!: number;

  @ApiProperty({ type: () => Number, nullable: false, description: 'Monto asignado como ingreso de plataforma' })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto asignado como ingreso de plataforma', nullable: false })
  platformAmount: number = 0;

  @ApiProperty({ type: () => Number, nullable: false, description: 'Monto reservado para cashback' })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto reservado para cashback', nullable: false })
  cashbackAmount: number = 0;

  @ApiProperty({ type: () => Number, nullable: false, description: 'Monto reservado para referidos o comisión multinivel' })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto reservado para referidos o comisión multinivel', nullable: false })
  referralAmount: number = 0;

  @ApiProperty({ type: () => Number, nullable: false, description: 'Costo transaccional del gateway o fee financiero' })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Costo transaccional del gateway o fee financiero', nullable: false })
  stripeFee: number = 0;

  @ApiProperty({ type: () => Number, nullable: false, description: 'Monto reintegrado o refund aplicado al pago' })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto reintegrado o refund aplicado al pago', nullable: false })
  refundAmount: number = 0;

  @ApiProperty({ type: () => Number, nullable: false, description: 'Ingreso neto comercial después de comisiones y fees' })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Ingreso neto comercial después de comisiones y fees', nullable: false })
  netIncome: number = 0;

  @ApiProperty({ type: () => String, nullable: false, description: 'Estado del accounting comercial del pago' })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Estado del accounting comercial del pago', nullable: false })
  accountingStatus: string = 'PENDING_ALLOCATION';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda del pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda del pago', nullable: false })
  currency!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado actual del pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado actual del pago', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave de idempotencia para evitar cobros duplicados',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave de idempotencia para evitar cobros duplicados', nullable: false })
  idempotencyKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Método de pago seleccionado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Método de pago seleccionado', nullable: false })
  selectedPaymentMethodType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Red de tarjeta seleccionada si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Red de tarjeta seleccionada si aplica', nullable: true })
  selectedCardNetwork?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de aprobación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de aprobación', nullable: true })
  approvedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de fallo',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de fallo', nullable: true })
  failedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de cancelación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de cancelación', nullable: true })
  cancelledAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de expiración',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de expiración', nullable: true })
  expiredAt?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos adicionales del pago',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos adicionales del pago', nullable: true })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela responsable del pago',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela responsable del pago', nullable: false })
  gatewayId!: string;

  // Constructor
  constructor(partial: Partial<BasePaymentDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PaymentDto extends BasePaymentDto {
  // Propiedades específicas de la clase PaymentDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<PaymentDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentDto>): PaymentDto {
    const instance = new PaymentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PaymentValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PaymentDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PaymentDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PaymentOutPutDto extends BasePaymentDto {
  // Propiedades específicas de la clase PaymentOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<PaymentOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentOutPutDto>): PaymentOutPutDto {
    const instance = new PaymentOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePaymentDto extends BasePaymentDto {
  // Propiedades específicas de la clase CreatePaymentDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePayment a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePaymentDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentDto>): CreatePaymentDto {
    const instance = new CreatePaymentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePaymentDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreatePaymentDto,
    description: 'Instancia CreatePayment o UpdatePayment',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePaymentDto, { nullable: true })
  input?: CreatePaymentDto | UpdatePaymentDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePaymentDto {
  // Propiedades específicas de la clase DeletePaymentDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePayment a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeletePayment a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePaymentDto extends BasePaymentDto {
  // Propiedades específicas de la clase UpdatePaymentDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePayment a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePaymentDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePaymentDto>): UpdatePaymentDto {
    const instance = new UpdatePaymentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

