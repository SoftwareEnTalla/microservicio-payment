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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreatePaymentGatewayDto, UpdatePaymentGatewayDto, DeletePaymentGatewayDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';


@Index('idx_payment_gateway_code', ['code'], { unique: true })
@Index('idx_payment_gateway_status_priority', ['status', 'priority'])
@Unique('uq_payment_gateway_code', ['code'])
@Check('chk_payment_gateway_priority_positive', '"priority" >= 0')
@ChildEntity('paymentgateway')
@ObjectType()
export class PaymentGateway extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PaymentGateway",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PaymentGateway", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PaymentGateway' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PaymentGateway",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PaymentGateway", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PaymentGateway' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la pasarela', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, unique: true, comment: 'Código de la pasarela' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Proveedor o tipo de pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Proveedor o tipo de pasarela', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Proveedor o tipo de pasarela' })
  providerType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo de la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo de la pasarela', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'DRAFT', comment: 'Estado operativo de la pasarela' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo de integración',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo de integración', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Modo de integración' })
  integrationMode!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si requiere onboarding del cliente',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si requiere onboarding del cliente', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica si requiere onboarding del cliente' })
  requiresCustomerOnboarding!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si requiere onboarding del comercio',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si requiere onboarding del comercio', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Indica si requiere onboarding del comercio' })
  requiresMerchantOnboarding!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta tokenización',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta tokenización', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Soporta tokenización' })
  supportsTokenization!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta autorización',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta autorización', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Soporta autorización' })
  supportsAuthorization!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta captura',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta captura', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Soporta captura' })
  supportsCapture!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta reembolso',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta reembolso', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Soporta reembolso' })
  supportsRefund!: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Soporta autenticación externa',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Soporta autenticación externa', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Soporta autenticación externa' })
  supportsExternalAuthentication!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de despliegue o presentación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de despliegue o presentación', nullable: false })
  @Column({ type: 'int', nullable: false, default: 100, comment: 'Prioridad de despliegue o presentación' })
  priority!: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Mensaje de mantenimiento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Mensaje de mantenimiento', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Mensaje de mantenimiento' })
  maintenanceMessage?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'URL de documentación interna o externa',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'URL de documentación interna o externa', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 250, comment: 'URL de documentación interna o externa' })
  documentationUrl?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Monedas soportadas por la pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Monedas soportadas por la pasarela', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Monedas soportadas por la pasarela' })
  supportedCurrencies?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Métodos de pago soportados',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Métodos de pago soportados', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Métodos de pago soportados' })
  supportedPaymentMethods?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de configuración de la pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de configuración de la pasarela', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de configuración de la pasarela' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: gateway-must-have-provider-type
    // Toda pasarela debe tener un proveedor definido.
    if (!((this.providerType !== undefined && this.providerType !== null && this.providerType !== ''))) {
      throw new Error('PAYMENT_GATEWAY_001: La pasarela requiere un proveedor definido');
    }

    // Rule: active-gateway-requires-supported-methods
    // Una pasarela activa debe declarar métodos de pago soportados.
    if (!(this.status === 'ACTIVE' && (this.supportedPaymentMethods !== undefined && this.supportedPaymentMethods !== null && this.supportedPaymentMethods !== ''))) {
      console.warn('PAYMENT_GATEWAY_002: Las pasarelas activas deben definir métodos de pago soportados');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'paymentgateway';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreatePaymentGatewayDto): PaymentGateway;
  static fromDto(dto: UpdatePaymentGatewayDto): PaymentGateway;
  static fromDto(dto: DeletePaymentGatewayDto): PaymentGateway;
  static fromDto(dto: any): PaymentGateway {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PaymentGateway, dto);
  }
}
