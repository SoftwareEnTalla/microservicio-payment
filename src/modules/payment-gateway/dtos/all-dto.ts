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
export class BasePaymentGatewayDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePaymentGateway',
    example: 'Nombre de instancia CreatePaymentGateway',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentGatewayDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePaymentGateway).',
    example: 'Fecha de creación de la instancia (CreatePaymentGateway).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePaymentGateway).',
    example: 'Fecha de actualización de la instancia (CreatePaymentGateway).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePaymentGateway).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePaymentGateway).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePaymentGateway).',
    example: 'Estado de activación de la instancia (CreatePaymentGateway).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la pasarela', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Proveedor o tipo de pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Proveedor o tipo de pasarela', nullable: false })
  providerType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo de la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo de la pasarela', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo de integración',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo de integración', nullable: false })
  integrationMode!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si requiere onboarding del cliente',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si requiere onboarding del cliente', nullable: false })
  requiresCustomerOnboarding!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si requiere onboarding del comercio',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si requiere onboarding del comercio', nullable: false })
  requiresMerchantOnboarding!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta tokenización',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta tokenización', nullable: false })
  supportsTokenization!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta autorización',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta autorización', nullable: false })
  supportsAuthorization!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta captura',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta captura', nullable: false })
  supportsCapture!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta reembolso',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta reembolso', nullable: false })
  supportsRefund!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta autenticación externa',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta autenticación externa', nullable: false })
  supportsExternalAuthentication!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de despliegue o presentación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de despliegue o presentación', nullable: false })
  priority!: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Mensaje de mantenimiento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Mensaje de mantenimiento', nullable: true })
  maintenanceMessage?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'URL de documentación interna o externa',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'URL de documentación interna o externa', nullable: true })
  documentationUrl?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Monedas soportadas por la pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Monedas soportadas por la pasarela', nullable: true })
  supportedCurrencies?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Métodos de pago soportados',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Métodos de pago soportados', nullable: true })
  supportedPaymentMethods?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de configuración de la pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de configuración de la pasarela', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BasePaymentGatewayDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PaymentGatewayDto extends BasePaymentGatewayDto {
  // Propiedades específicas de la clase PaymentGatewayDto en cuestión

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
  constructor(partial: Partial<PaymentGatewayDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentGatewayDto>): PaymentGatewayDto {
    const instance = new PaymentGatewayDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PaymentGatewayValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PaymentGatewayDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PaymentGatewayDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PaymentGatewayOutPutDto extends BasePaymentGatewayDto {
  // Propiedades específicas de la clase PaymentGatewayOutPutDto en cuestión

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
  constructor(partial: Partial<PaymentGatewayOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentGatewayOutPutDto>): PaymentGatewayOutPutDto {
    const instance = new PaymentGatewayOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePaymentGatewayDto extends BasePaymentGatewayDto {
  // Propiedades específicas de la clase CreatePaymentGatewayDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePaymentGateway a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePaymentGatewayDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentGatewayDto>): CreatePaymentGatewayDto {
    const instance = new CreatePaymentGatewayDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePaymentGatewayDto {
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
    type: () => CreatePaymentGatewayDto,
    description: 'Instancia CreatePaymentGateway o UpdatePaymentGateway',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePaymentGatewayDto, { nullable: true })
  input?: CreatePaymentGatewayDto | UpdatePaymentGatewayDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePaymentGatewayDto {
  // Propiedades específicas de la clase DeletePaymentGatewayDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePaymentGateway a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePaymentGateway a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePaymentGatewayDto extends BasePaymentGatewayDto {
  // Propiedades específicas de la clase UpdatePaymentGatewayDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePaymentGateway a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePaymentGatewayDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePaymentGatewayDto>): UpdatePaymentGatewayDto {
    const instance = new UpdatePaymentGatewayDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

