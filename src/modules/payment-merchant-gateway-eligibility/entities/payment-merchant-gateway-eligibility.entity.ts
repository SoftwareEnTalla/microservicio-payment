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
import { CreatePaymentMerchantGatewayEligibilityDto, UpdatePaymentMerchantGatewayEligibilityDto, DeletePaymentMerchantGatewayEligibilityDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { PaymentGateway } from '../../payment-gateway/entities/payment-gateway.entity';

@Index('idx_payment_merchant_gateway_eligibility_config_id', ['merchantGatewayConfigId'], { unique: true })
@Index('idx_payment_merchant_gateway_eligibility_merchant_gateway', ['merchantId', 'gatewayId'], { unique: true })
@Unique('uq_payment_merchant_gateway_eligibility_config_id', ['merchantGatewayConfigId'])
@Unique('uq_payment_merchant_gateway_eligibility_merchant_gateway', ['merchantId', 'gatewayId'])
@ChildEntity('paymentmerchantgatewayeligibility')
@ObjectType()
export class PaymentMerchantGatewayEligibility extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PaymentMerchantGatewayEligibility",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PaymentMerchantGatewayEligibility", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PaymentMerchantGatewayEligibility' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PaymentMerchantGatewayEligibility",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PaymentMerchantGatewayEligibility", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PaymentMerchantGatewayEligibility' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del aggregate merchant-gateway-config que origina la proyección',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del aggregate merchant-gateway-config que origina la proyección', nullable: false })
  @Column({ type: 'uuid', nullable: false, unique: true, comment: 'Identificador del aggregate merchant-gateway-config que origina la proyección' })
  merchantGatewayConfigId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Merchant al que aplica la elegibilidad de pasarela',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Merchant al que aplica la elegibilidad de pasarela', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Merchant al que aplica la elegibilidad de pasarela' })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela evaluada en el contexto de pago',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela evaluada en el contexto de pago', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Pasarela evaluada en el contexto de pago' })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo recibido desde merchant-gateway-config',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo recibido desde merchant-gateway-config', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'NOT_CONFIGURED', comment: 'Estado operativo recibido desde merchant-gateway-config' })
  status!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Monedas habilitadas por la configuración del merchant',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Monedas habilitadas por la configuración del merchant', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Monedas habilitadas por la configuración del merchant' })
  acceptedCurrencies?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Métodos de pago aceptados por la configuración del merchant',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Métodos de pago aceptados por la configuración del merchant', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Métodos de pago aceptados por la configuración del merchant' })
  acceptedPaymentMethodTypes?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Modo de liquidación proyectado localmente en payment',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Modo de liquidación proyectado localmente en payment', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, default: 'AUTOMATIC', comment: 'Modo de liquidación proyectado localmente en payment' })
  settlementMode?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de elegibilidad de pasarela por merchant',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de elegibilidad de pasarela por merchant', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de elegibilidad de pasarela por merchant' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => PaymentGateway,
    nullable: false,
    description: 'Relación con PaymentGateway',
  })
  @Field(() => PaymentGateway, { nullable: false })
  @ManyToOne(() => PaymentGateway, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'gatewayId' })
  paymentGateway!: PaymentGateway;

  protected executeDslLifecycle(): void {
    // Rule: active-eligibility-requires-active-flag
    // Una elegibilidad activa debe conservar el indicador isActive en verdadero.
    if (!(this.status === 'ACTIVE' && this.isActive === true)) {
      throw new Error('PAYMENT_GATEWAY_ELIGIBILITY_001: No puede existir elegibilidad activa sin isActive=true');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'paymentmerchantgatewayeligibility';
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
  static fromDto(dto: CreatePaymentMerchantGatewayEligibilityDto): PaymentMerchantGatewayEligibility;
  static fromDto(dto: UpdatePaymentMerchantGatewayEligibilityDto): PaymentMerchantGatewayEligibility;
  static fromDto(dto: DeletePaymentMerchantGatewayEligibilityDto): PaymentMerchantGatewayEligibility;
  static fromDto(dto: any): PaymentMerchantGatewayEligibility {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PaymentMerchantGatewayEligibility, dto);
  }
}
