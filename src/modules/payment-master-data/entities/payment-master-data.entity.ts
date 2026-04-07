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
import { CreatePaymentMasterDataDto, UpdatePaymentMasterDataDto, DeletePaymentMasterDataDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { plainToInstance } from 'class-transformer';


@Index('idx_payment_master_data_code', ['code'], { unique: true })
@Index('idx_payment_master_data_category_sort', ['category', 'sortOrder'])
@Unique('uq_payment_master_data_code', ['code'])
@Check('chk_payment_master_data_sort_non_negative', '"sortOrder" >= 0')
@ChildEntity('paymentmasterdata')
@ObjectType()
export class PaymentMasterData extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PaymentMasterData",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PaymentMasterData", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PaymentMasterData' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PaymentMasterData",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PaymentMasterData", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PaymentMasterData' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría del dato maestro',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría del dato maestro', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Categoría del dato maestro' })
  category!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código técnico del dato maestro',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código técnico del dato maestro', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código técnico del dato maestro' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible del valor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible del valor', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 160, comment: 'Nombre visible del valor' })
  displayName!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden de presentación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden de presentación', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Orden de presentación' })
  sortOrder!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Indica si es valor por defecto',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Indica si es valor por defecto', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Indica si es valor por defecto' })
  isDefault!: boolean;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos adicionales del valor de catálogo',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos adicionales del valor de catálogo', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos adicionales del valor de catálogo' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: master-data-code-required
    // Todo dato maestro debe tener un código definido.
    if (!((this.code !== undefined && this.code !== null && this.code !== ''))) {
      throw new Error('PAYMENT_MD_001: El dato maestro requiere un código');
    }

    // Rule: master-data-category-required
    // Todo dato maestro debe pertenecer a una categoría.
    if (!((this.category !== undefined && this.category !== null && this.category !== ''))) {
      throw new Error('PAYMENT_MD_002: El dato maestro requiere una categoría');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'paymentmasterdata';
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
  static fromDto(dto: CreatePaymentMasterDataDto): PaymentMasterData;
  static fromDto(dto: UpdatePaymentMasterDataDto): PaymentMasterData;
  static fromDto(dto: DeletePaymentMasterDataDto): PaymentMasterData;
  static fromDto(dto: any): PaymentMasterData {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PaymentMasterData, dto);
  }
}
