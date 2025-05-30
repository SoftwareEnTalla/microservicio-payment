import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional,IsObject, ValidateNested } from 'class-validator';
import { InputType, Field, ObjectType} from '@nestjs/graphql';  
import { CreatePaymentDto } from './createpayment.dto';
import { isCreateOrUpdatePaymentDtoType } from '../decorators/payment.decorators';


@InputType()
export class UpdatePaymentDto {

  // Propiedades específicas de la clase UpdatePaymentDto en cuestión
  
   
  @ApiProperty({
    description: "Identificador de instancia a actualizar",
    example:"Se proporciona un identificador de UpdatePayment a actualizar",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String,{ nullable: false })
  id: string='';

  @ApiProperty({
    type: String,
    description: "Nombre de instancia CreatePayment",
    example: "Nombre de instancia CreatePayment",
    nullable: false
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentDto según especificación del sistema

  @ApiProperty({
    type: Date,
    description: "Fecha de creación de la instancia (CreatePayment).",
    example: "Fecha de creación de la instancia (CreatePayment).",
    nullable: false
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: Date,
    description: "Fecha de actualización de la instancia (CreatePayment).",
    example: "Fecha de actualización de la instancia (CreatePayment).",
    nullable: false
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: String,
    description:
      "Usuario que realiza la creación de la instancia (CreatePayment).",
    example: "Usuario que realiza la creación de la instancia (CreatePayment).",
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: Boolean,
    description: "Estado de activación de la instancia (CreatePayment).",
    example: "Estado de activación de la instancia (CreatePayment).",
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Constructor
  constructor(partial: Partial<CreatePaymentDto>) {
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentDto>): CreatePaymentDto {
    const instance = new CreatePaymentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }

}




