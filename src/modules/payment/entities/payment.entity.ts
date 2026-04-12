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
import { CreatePaymentDto, UpdatePaymentDto, DeletePaymentDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { PaymentGateway } from '../../payment-gateway/entities/payment-gateway.entity';
import { PaymentAttempt } from '../../payment-attempt/entities/payment-attempt.entity';

@Index('idx_payment_code', ['code'], { unique: true })
@Index('idx_payment_external_reference', ['externalReference'], { unique: true })
@Index('idx_payment_merchant_status', ['merchantId', 'status'])
@Index('idx_payment_customer_status', ['customerId', 'status'])
@Index('idx_payment_idempotency_key', ['idempotencyKey'], { unique: true })
@Check('chk_payment_amount_positive', '"amount" > 0')
@Unique('uq_payment_code', ['code'])
@Unique('uq_payment_idempotency_key', ['idempotencyKey'])
@ChildEntity('payment')
@ObjectType()
export class Payment extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Payment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Payment", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Payment' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Payment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Payment", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Payment' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código interno del pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código interno del pago', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 50, unique: true, comment: 'Código interno del pago' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia externa del pago',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia externa del pago', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, unique: true, comment: 'Referencia externa del pago' })
  externalReference?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del comercio',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del comercio', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Identificador del comercio' })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del cliente',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del cliente', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Identificador del cliente' })
  customerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador de la orden asociada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Identificador de la orden asociada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Identificador de la orden asociada' })
  orderId?: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Monto total del pago',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Monto total del pago', nullable: false })
  @Column({ type: 'decimal', nullable: false, precision: 12, scale: 2, comment: 'Monto total del pago' })
  amount!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda del pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda del pago', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'USD', comment: 'Moneda del pago' })
  currency!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado actual del pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado actual del pago', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'CREATED', comment: 'Estado actual del pago' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave de idempotencia para evitar cobros duplicados',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave de idempotencia para evitar cobros duplicados', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 150, unique: true, comment: 'Clave de idempotencia para evitar cobros duplicados' })
  idempotencyKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Método de pago seleccionado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Método de pago seleccionado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Método de pago seleccionado' })
  selectedPaymentMethodType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Red de tarjeta seleccionada si aplica',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Red de tarjeta seleccionada si aplica', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Red de tarjeta seleccionada si aplica' })
  selectedCardNetwork?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de aprobación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de aprobación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de aprobación' })
  approvedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de fallo',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de fallo', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de fallo' })
  failedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de cancelación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de cancelación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de cancelación' })
  cancelledAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de expiración',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de expiración', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de expiración' })
  expiredAt?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos adicionales del pago',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos adicionales del pago', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos adicionales del pago' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela responsable del pago',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela responsable del pago', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Pasarela responsable del pago' })
  gatewayId!: string;

  @ApiProperty({
    type: () => PaymentGateway,
    nullable: false,
    description: 'Relación con PaymentGateway',
  })
  @Field(() => PaymentGateway, { nullable: false })
  @ManyToOne(() => PaymentGateway, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'gatewayId' })
  paymentGateway!: PaymentGateway;

  // Referencia externa a Merchant del bounded context merchant; se integra vía event-driven sin dependencia ORM directa.

  // Referencia externa a Customer del bounded context customer; se integra vía event-driven sin dependencia ORM directa.

  @ApiProperty({
    type: () => [PaymentAttempt],
    nullable: true,
    description: 'Intentos registrados del pago',
  })
  @Field(() => [PaymentAttempt], { nullable: true })
  @OneToMany(() => PaymentAttempt, (paymentAttempt) => paymentAttempt.payment)
  paymentAttempts?: PaymentAttempt[];

  protected executeDslLifecycle(): void {
    // Rule: payment-amount-must-be-positive
    // Todo pago debe tener un monto positivo.
    if (!(this.amount > 0)) {
      throw new Error('PAYMENT_001: El monto del pago debe ser mayor que cero');
    }

    // Rule: payment-must-have-idempotency-key
    // Todo pago debe incluir una clave de idempotencia.
    if (!(!(this.idempotencyKey === undefined || this.idempotencyKey === null || (typeof this.idempotencyKey === 'string' && String(this.idempotencyKey).trim() === '') || (Array.isArray(this.idempotencyKey) && this.idempotencyKey.length === 0) || (typeof this.idempotencyKey === 'object' && !Array.isArray(this.idempotencyKey) && Object.prototype.toString.call(this.idempotencyKey) === '[object Object]' && Object.keys(Object(this.idempotencyKey)).length === 0)))) {
      throw new Error('PAYMENT_002: El pago requiere una clave de idempotencia');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'payment';
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
  static fromDto(dto: CreatePaymentDto): Payment;
  static fromDto(dto: UpdatePaymentDto): Payment;
  static fromDto(dto: DeletePaymentDto): Payment;
  static fromDto(dto: any): Payment {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Payment, dto);
  }
}
