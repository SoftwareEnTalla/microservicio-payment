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
export class BasePaymentAttemptDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePaymentAttempt',
    example: 'Nombre de instancia CreatePaymentAttempt',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentAttemptDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePaymentAttempt).',
    example: 'Fecha de creación de la instancia (CreatePaymentAttempt).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePaymentAttempt).',
    example: 'Fecha de actualización de la instancia (CreatePaymentAttempt).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePaymentAttempt).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePaymentAttempt).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePaymentAttempt).',
    example: 'Estado de activación de la instancia (CreatePaymentAttempt).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del pago asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del pago asociado', nullable: false })
  paymentId!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Número secuencial del intento',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Número secuencial del intento', nullable: false })
  attemptNumber!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela utilizada en el intento',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela utilizada en el intento', nullable: false })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del intento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del intento', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Monto solicitado en el intento',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Monto solicitado en el intento', nullable: false })
  requestedAmount!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda del intento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda del intento', nullable: false })
  currency!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia del request al proveedor',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia del request al proveedor', nullable: true })
  requestReference?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia de la respuesta del proveedor',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia de la respuesta del proveedor', nullable: true })
  responseReference?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código de error del intento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código de error del intento', nullable: true })
  errorCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Mensaje de error del intento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Mensaje de error del intento', nullable: true })
  errorMessage?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de ejecución del intento',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de ejecución del intento', nullable: false })
  executedAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de finalización del intento',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de finalización del intento', nullable: true })
  finishedAt?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si el intento es reintentable',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si el intento es reintentable', nullable: false })
  retryable!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del intento',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del intento', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BasePaymentAttemptDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PaymentAttemptDto extends BasePaymentAttemptDto {
  // Propiedades específicas de la clase PaymentAttemptDto en cuestión

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
  constructor(partial: Partial<PaymentAttemptDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentAttemptDto>): PaymentAttemptDto {
    const instance = new PaymentAttemptDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PaymentAttemptValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PaymentAttemptDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PaymentAttemptDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PaymentAttemptOutPutDto extends BasePaymentAttemptDto {
  // Propiedades específicas de la clase PaymentAttemptOutPutDto en cuestión

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
  constructor(partial: Partial<PaymentAttemptOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentAttemptOutPutDto>): PaymentAttemptOutPutDto {
    const instance = new PaymentAttemptOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePaymentAttemptDto extends BasePaymentAttemptDto {
  // Propiedades específicas de la clase CreatePaymentAttemptDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePaymentAttempt a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePaymentAttemptDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentAttemptDto>): CreatePaymentAttemptDto {
    const instance = new CreatePaymentAttemptDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePaymentAttemptDto {
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
    type: () => CreatePaymentAttemptDto,
    description: 'Instancia CreatePaymentAttempt o UpdatePaymentAttempt',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePaymentAttemptDto, { nullable: true })
  input?: CreatePaymentAttemptDto | UpdatePaymentAttemptDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePaymentAttemptDto {
  // Propiedades específicas de la clase DeletePaymentAttemptDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePaymentAttempt a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePaymentAttempt a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePaymentAttemptDto extends BasePaymentAttemptDto {
  // Propiedades específicas de la clase UpdatePaymentAttemptDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePaymentAttempt a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePaymentAttemptDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePaymentAttemptDto>): UpdatePaymentAttemptDto {
    const instance = new UpdatePaymentAttemptDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

