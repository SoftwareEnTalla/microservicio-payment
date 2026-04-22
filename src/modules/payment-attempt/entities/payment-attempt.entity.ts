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
import { CreatePaymentAttemptDto, UpdatePaymentAttemptDto, DeletePaymentAttemptDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Payment } from '../../payment/entities/payment.entity';
import { PaymentGateway } from '../../payment-gateway/entities/payment-gateway.entity';

@Index('idx_payment_attempt_payment_number', ['paymentId', 'attemptNumber'], { unique: true })
@Index('idx_payment_attempt_gateway_status', ['gatewayId', 'status'])
@Check('chk_payment_attempt_number_positive', '"attemptNumber" > 0')
@Check('chk_payment_attempt_amount_positive', '"requestedAmount" > 0')
@ChildEntity('paymentattempt')
@ObjectType()
export class PaymentAttempt extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PaymentAttempt",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PaymentAttempt", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PaymentAttempt' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PaymentAttempt",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PaymentAttempt", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PaymentAttempt' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Identificador del pago asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Identificador del pago asociado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Identificador del pago asociado' })
  paymentId!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Número secuencial del intento',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Número secuencial del intento', nullable: false })
  @Column({ type: 'int', nullable: false, comment: 'Número secuencial del intento' })
  attemptNumber!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela utilizada en el intento',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela utilizada en el intento', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Pasarela utilizada en el intento' })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del intento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del intento', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'INITIATED', comment: 'Estado del intento' })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Monto solicitado en el intento',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Monto solicitado en el intento', nullable: false })
  @Column({ type: 'decimal', nullable: false, precision: 12, scale: 2, comment: 'Monto solicitado en el intento' })
  requestedAmount!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda del intento',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda del intento', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'USD', comment: 'Moneda del intento' })
  currency!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia del request al proveedor',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia del request al proveedor', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 150, comment: 'Referencia del request al proveedor' })
  requestReference?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia de la respuesta del proveedor',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Referencia de la respuesta del proveedor', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 150, comment: 'Referencia de la respuesta del proveedor' })
  responseReference?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código de error del intento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código de error del intento', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Código de error del intento' })
  errorCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Mensaje de error del intento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Mensaje de error del intento', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Mensaje de error del intento' })
  errorMessage?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de ejecución del intento',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de ejecución del intento', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Fecha de ejecución del intento' })
  executedAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de finalización del intento',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de finalización del intento', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de finalización del intento' })
  finishedAt?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si el intento es reintentable',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si el intento es reintentable', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: true, comment: 'Indica si el intento es reintentable' })
  retryable!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del intento',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del intento', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos del intento' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => Payment,
    nullable: false,
    description: 'Relación con Payment',
  })
  @Field(() => Payment, { nullable: false })
  @ManyToOne(() => Payment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentId' })
  payment!: Payment;

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
    // Rule: attempt-number-must-be-positive
    // Todo intento debe tener un número secuencial positivo.
    if (!(this.attemptNumber > 0)) {
      throw new Error('PAYMENT_ATTEMPT_001: El número del intento debe ser mayor que cero');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'paymentattempt';
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
  static fromDto(dto: CreatePaymentAttemptDto): PaymentAttempt;
  static fromDto(dto: UpdatePaymentAttemptDto): PaymentAttempt;
  static fromDto(dto: DeletePaymentAttemptDto): PaymentAttempt;
  static fromDto(dto: any): PaymentAttempt {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PaymentAttempt, dto);
  }
}
