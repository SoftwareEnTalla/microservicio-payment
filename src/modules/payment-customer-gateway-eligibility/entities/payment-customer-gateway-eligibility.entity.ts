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
import { CreatePaymentCustomerGatewayEligibilityDto, UpdatePaymentCustomerGatewayEligibilityDto, DeletePaymentCustomerGatewayEligibilityDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { PaymentGateway } from '../../payment-gateway/entities/payment-gateway.entity';

@Index('idx_payment_customer_gateway_eligibility_onboarding_id', ['customerGatewayOnboardingId'], { unique: true })
@Index('idx_payment_customer_gateway_eligibility_customer_gateway', ['customerId', 'gatewayId'], { unique: true })
@Unique('uq_payment_customer_gateway_eligibility_onboarding_id', ['customerGatewayOnboardingId'])
@Unique('uq_payment_customer_gateway_eligibility_customer_gateway', ['customerId', 'gatewayId'])
@ChildEntity('paymentcustomergatewayeligibility')
@ObjectType()
export class PaymentCustomerGatewayEligibility extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PaymentCustomerGatewayEligibility",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PaymentCustomerGatewayEligibility", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PaymentCustomerGatewayEligibility' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PaymentCustomerGatewayEligibility",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PaymentCustomerGatewayEligibility", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PaymentCustomerGatewayEligibility' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del aggregate customer-gateway-onboarding que origina la proyección',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del aggregate customer-gateway-onboarding que origina la proyección', nullable: false })
  @Column({ type: 'uuid', nullable: false, unique: true, comment: 'Identificador del aggregate customer-gateway-onboarding que origina la proyección' })
  customerGatewayOnboardingId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Cliente al que aplica la elegibilidad',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Cliente al que aplica la elegibilidad', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Cliente al que aplica la elegibilidad' })
  customerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela cuya elegibilidad del cliente se proyecta localmente',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela cuya elegibilidad del cliente se proyecta localmente', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Pasarela cuya elegibilidad del cliente se proyecta localmente' })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado actual del onboarding del cliente para la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado actual del onboarding del cliente para la pasarela', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'NOT_STARTED', comment: 'Estado actual del onboarding del cliente para la pasarela' })
  status!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si el cliente debe revalidar su onboarding antes de volver a pagar',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si el cliente debe revalidar su onboarding antes de volver a pagar', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica si el cliente debe revalidar su onboarding antes de volver a pagar' })
  requiresRevalidation!: boolean;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha local de expiración del onboarding del cliente',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha local de expiración del onboarding del cliente', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha local de expiración del onboarding del cliente' })
  expiresAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia externa útil para correlación con checkout o reanudación del flujo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia externa útil para correlación con checkout o reanudación del flujo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 150, comment: 'Referencia externa útil para correlación con checkout o reanudación del flujo' })
  externalSessionReference?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de elegibilidad de cliente para la pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de elegibilidad de cliente para la pasarela', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de elegibilidad de cliente para la pasarela' })
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
    // Rule: approved-eligibility-cannot-require-revalidation-by-default
    // Una elegibilidad aprobada no debería requerir revalidación salvo señal explícita del bounded context customer.
    if (!(this.status !== 'APPROVED' && this.requiresRevalidation === false)) {
      console.warn('PAYMENT_CUSTOMER_GATEWAY_ELIGIBILITY_001: Una elegibilidad aprobada no debe marcar revalidación salvo decisión explícita');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'paymentcustomergatewayeligibility';
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
  static fromDto(dto: CreatePaymentCustomerGatewayEligibilityDto): PaymentCustomerGatewayEligibility;
  static fromDto(dto: UpdatePaymentCustomerGatewayEligibilityDto): PaymentCustomerGatewayEligibility;
  static fromDto(dto: DeletePaymentCustomerGatewayEligibilityDto): PaymentCustomerGatewayEligibility;
  static fromDto(dto: any): PaymentCustomerGatewayEligibility {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PaymentCustomerGatewayEligibility, dto);
  }
}
