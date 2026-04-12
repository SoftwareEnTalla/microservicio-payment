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
export class BasePaymentMerchantGatewayEligibilityDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePaymentMerchantGatewayEligibility',
    example: 'Nombre de instancia CreatePaymentMerchantGatewayEligibility',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentMerchantGatewayEligibilityDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePaymentMerchantGatewayEligibility).',
    example: 'Fecha de creación de la instancia (CreatePaymentMerchantGatewayEligibility).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePaymentMerchantGatewayEligibility).',
    example: 'Fecha de actualización de la instancia (CreatePaymentMerchantGatewayEligibility).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePaymentMerchantGatewayEligibility).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePaymentMerchantGatewayEligibility).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePaymentMerchantGatewayEligibility).',
    example: 'Estado de activación de la instancia (CreatePaymentMerchantGatewayEligibility).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del aggregate merchant-gateway-config que origina la proyección',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del aggregate merchant-gateway-config que origina la proyección', nullable: false })
  merchantGatewayConfigId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Merchant al que aplica la elegibilidad de pasarela',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Merchant al que aplica la elegibilidad de pasarela', nullable: false })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela evaluada en el contexto de pago',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela evaluada en el contexto de pago', nullable: false })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo recibido desde merchant-gateway-config',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo recibido desde merchant-gateway-config', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Monedas habilitadas por la configuración del merchant',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Monedas habilitadas por la configuración del merchant', nullable: true })
  acceptedCurrencies?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Métodos de pago aceptados por la configuración del merchant',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Métodos de pago aceptados por la configuración del merchant', nullable: true })
  acceptedPaymentMethodTypes?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Modo de liquidación proyectado localmente en payment',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Modo de liquidación proyectado localmente en payment', nullable: true })
  settlementMode?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de elegibilidad de pasarela por merchant',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de elegibilidad de pasarela por merchant', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BasePaymentMerchantGatewayEligibilityDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PaymentMerchantGatewayEligibilityDto extends BasePaymentMerchantGatewayEligibilityDto {
  // Propiedades específicas de la clase PaymentMerchantGatewayEligibilityDto en cuestión

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
  constructor(partial: Partial<PaymentMerchantGatewayEligibilityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentMerchantGatewayEligibilityDto>): PaymentMerchantGatewayEligibilityDto {
    const instance = new PaymentMerchantGatewayEligibilityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PaymentMerchantGatewayEligibilityValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PaymentMerchantGatewayEligibilityDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PaymentMerchantGatewayEligibilityDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PaymentMerchantGatewayEligibilityOutPutDto extends BasePaymentMerchantGatewayEligibilityDto {
  // Propiedades específicas de la clase PaymentMerchantGatewayEligibilityOutPutDto en cuestión

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
  constructor(partial: Partial<PaymentMerchantGatewayEligibilityOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentMerchantGatewayEligibilityOutPutDto>): PaymentMerchantGatewayEligibilityOutPutDto {
    const instance = new PaymentMerchantGatewayEligibilityOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePaymentMerchantGatewayEligibilityDto extends BasePaymentMerchantGatewayEligibilityDto {
  // Propiedades específicas de la clase CreatePaymentMerchantGatewayEligibilityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePaymentMerchantGatewayEligibility a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePaymentMerchantGatewayEligibilityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentMerchantGatewayEligibilityDto>): CreatePaymentMerchantGatewayEligibilityDto {
    const instance = new CreatePaymentMerchantGatewayEligibilityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePaymentMerchantGatewayEligibilityDto {
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
    type: () => CreatePaymentMerchantGatewayEligibilityDto,
    description: 'Instancia CreatePaymentMerchantGatewayEligibility o UpdatePaymentMerchantGatewayEligibility',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePaymentMerchantGatewayEligibilityDto, { nullable: true })
  input?: CreatePaymentMerchantGatewayEligibilityDto | UpdatePaymentMerchantGatewayEligibilityDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePaymentMerchantGatewayEligibilityDto {
  // Propiedades específicas de la clase DeletePaymentMerchantGatewayEligibilityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePaymentMerchantGatewayEligibility a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePaymentMerchantGatewayEligibility a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePaymentMerchantGatewayEligibilityDto extends BasePaymentMerchantGatewayEligibilityDto {
  // Propiedades específicas de la clase UpdatePaymentMerchantGatewayEligibilityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePaymentMerchantGatewayEligibility a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePaymentMerchantGatewayEligibilityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePaymentMerchantGatewayEligibilityDto>): UpdatePaymentMerchantGatewayEligibilityDto {
    const instance = new UpdatePaymentMerchantGatewayEligibilityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

