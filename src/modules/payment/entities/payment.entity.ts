import { Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreatePaymentDto } from '../dtos/createpayment.dto';
import { UpdatePaymentDto } from '../dtos/updatepayment.dto';
import { DeletePaymentDto } from '../dtos/deletepayment.dto';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity('Payment')
export class Payment extends BaseEntity {

  // Propiedades de Payment
  @ApiProperty({
      type: String,
      nullable: false,
      description: "Nombre de la instancia de Payment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Payment", nullable: false })
  private name: string = "";

  // Constructor de Payment
  constructor() {
    super();
  }
  
  // Getters y Setters

  get getName(): string {
    return this.name;
  }

  set setName(value: string) {
    this.name = value;
  }

  //Métodos o funciones de Payment

  static fromDto(dto:CreatePaymentDto|UpdatePaymentDto|DeletePaymentDto):Payment{
       return plainToClass(Payment, dto);
  }

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Payment> {

    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data;  // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const paymentDto = plainToInstance(CreatePaymentDto, data as CreatePaymentDto);

    // Validar el DTO
    const errors = await validate(paymentDto);
    if (errors.length > 0) {
      throw new Error('Validation failed creating payment!'); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    paymentDto.modificationDate = new Date();
    return {...this,...paymentDto};
  }
  async update(data: any): Promise<Payment>{

    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data;  // Si es un array, tomamos el primer objeto


    // Convertir el objeto data a una instancia del DTO
    const paymentDto = plainToInstance(CreatePaymentDto, singleData as CreatePaymentDto);


    // Validar el DTO
    const errors = await validate(paymentDto);
    if (errors.length > 0) {
      throw new Error('Validation failed creating payment!'); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    paymentDto.modificationDate = new Date();
    return {...this,...paymentDto};
  }
  async delete():  Promise<Payment>{
    return {...this};
  }

}
