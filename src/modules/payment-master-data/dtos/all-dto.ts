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
export class BasePaymentMasterDataDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePaymentMasterData',
    example: 'Nombre de instancia CreatePaymentMasterData',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentMasterDataDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePaymentMasterData).',
    example: 'Fecha de creación de la instancia (CreatePaymentMasterData).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePaymentMasterData).',
    example: 'Fecha de actualización de la instancia (CreatePaymentMasterData).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePaymentMasterData).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePaymentMasterData).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePaymentMasterData).',
    example: 'Estado de activación de la instancia (CreatePaymentMasterData).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría del dato maestro',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría del dato maestro', nullable: false })
  category!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código técnico del dato maestro',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código técnico del dato maestro', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible del valor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible del valor', nullable: false })
  displayName!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden de presentación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden de presentación', nullable: false })
  sortOrder!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si es valor por defecto',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si es valor por defecto', nullable: false })
  isDefault!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos adicionales del valor de catálogo',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos adicionales del valor de catálogo', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BasePaymentMasterDataDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PaymentMasterDataDto extends BasePaymentMasterDataDto {
  // Propiedades específicas de la clase PaymentMasterDataDto en cuestión

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
  constructor(partial: Partial<PaymentMasterDataDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentMasterDataDto>): PaymentMasterDataDto {
    const instance = new PaymentMasterDataDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PaymentMasterDataValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PaymentMasterDataDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PaymentMasterDataDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PaymentMasterDataOutPutDto extends BasePaymentMasterDataDto {
  // Propiedades específicas de la clase PaymentMasterDataOutPutDto en cuestión

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
  constructor(partial: Partial<PaymentMasterDataOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentMasterDataOutPutDto>): PaymentMasterDataOutPutDto {
    const instance = new PaymentMasterDataOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePaymentMasterDataDto extends BasePaymentMasterDataDto {
  // Propiedades específicas de la clase CreatePaymentMasterDataDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePaymentMasterData a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePaymentMasterDataDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentMasterDataDto>): CreatePaymentMasterDataDto {
    const instance = new CreatePaymentMasterDataDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePaymentMasterDataDto {
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
    type: () => CreatePaymentMasterDataDto,
    description: 'Instancia CreatePaymentMasterData o UpdatePaymentMasterData',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePaymentMasterDataDto, { nullable: true })
  input?: CreatePaymentMasterDataDto | UpdatePaymentMasterDataDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePaymentMasterDataDto {
  // Propiedades específicas de la clase DeletePaymentMasterDataDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePaymentMasterData a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePaymentMasterData a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePaymentMasterDataDto extends BasePaymentMasterDataDto {
  // Propiedades específicas de la clase UpdatePaymentMasterDataDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePaymentMasterData a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePaymentMasterDataDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePaymentMasterDataDto>): UpdatePaymentMasterDataDto {
    const instance = new UpdatePaymentMasterDataDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

