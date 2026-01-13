import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional,IsObject, ValidateNested } from 'class-validator';
import { InputType, Field, ObjectType} from '@nestjs/graphql';  
import { UpdatePaymentDto } from './updatepayment.dto';
import { isCreateOrUpdatePaymentDtoType } from '../decorators/payment.decorators';


@InputType()
export class CreatePaymentDto {

  // Propiedades específicas de la clase CreatePaymentDto en cuestión
  
   
  @ApiProperty({
    description: "Identificador de instancia a crear",
    example: "Se proporciona un identificador de CreatePayment a crear \(opcional\) ",
  })
  @IsString()
  @IsOptional()
  @Field(() => String,{ nullable: true })
  id?: string;

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


        
        @InputType()
        export class PaymentDto {
          // Propiedades específicas de la clase PaymentDto en cuestión

          @ApiProperty({ type: String ,nullable: true, description: 'Identificador único de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string;

          @ApiProperty({ type: String ,nullable: false, description: 'Nombre de la instancia' })
          @IsString()
          @IsNotEmpty()
          @Field(() => String, { nullable: false })
          name: string = '';

          // Propiedades predeterminadas de la clase PaymentDto según especificación del sistema

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de creaciónde la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de modificación de la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: String ,nullable: true, description: 'Creador de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          createdBy?: string; // Usuario que crea el objeto

          @ApiProperty({ type: Boolean ,nullable: false, description: 'Describe si la instancia está activa o no' })
          @IsBoolean()
          @IsNotEmpty()
          @Field(() => Boolean, { nullable: false })
          isActive: boolean = false; // Por defecto, el objeto no está activo

          // Constructor
          constructor(partial: Partial<PaymentDto>) {
            Object.assign(this, partial);
          }

          // Método estático para construir la instancia
          static build(data: Partial<PaymentDto>): PaymentDto {
            const instance = new PaymentDto(data);
            instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
            instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
            return instance;
          }
        }

        @ObjectType()
        export class PaymentOutPutDto {
          // Propiedades específicas de la clase PaymentDto en cuestión

          @ApiProperty({ type: String ,nullable: true, description: 'Identificador único de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string;

          @ApiProperty({ type: String ,nullable: false, description: 'Nombre de la instancia' })
          @IsString()
          @IsNotEmpty()
          @Field(() => String, { nullable: false })
          name: string = '';

          // Propiedades predeterminadas de la clase PaymentDto según especificación del sistema
          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de creaciónde la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: Date ,nullable: false, description: 'Fecha de modificación de la instancia' })
          @IsDate()
          @IsNotEmpty()
          @Field(() => Date, { nullable: false })
          modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

          @ApiProperty({ type: String ,nullable: true, description: 'Creador de la instancia' })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          createdBy?: string; // Usuario que crea el objeto

          @ApiProperty({ type: Boolean ,nullable: false, description: 'Describe si la instancia está activa o no' })
          @IsBoolean()
          @IsNotEmpty()
          @Field(() => Boolean, { nullable: false })
          isActive: boolean = false; // Por defecto, el objeto no está activo

          // Constructor
          constructor(partial: Partial<PaymentDto>) {
            Object.assign(this, partial);
          }

          // Método estático para construir la instancia
          static build(data: Partial<PaymentDto>): PaymentDto {
            const instance = new PaymentDto(data);
            instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
            instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
            return instance;
          }
        }

        //Create or Update Dto

        @InputType()
        export class CreateOrUpdatePaymentDto {
          @ApiProperty({
            type: String,
            description: "Identificador de la instancia CreatePayment",
            example: "Nombre de instancia CreatePayment",
            nullable: true,
          })
          @IsString()
          @IsOptional()
          @Field(() => String, { nullable: true })
          id?: string; // Si tiene ID, es una actualización

          @ApiProperty({
            type: ()=>CreatePaymentDto || UpdatePaymentDto,
            description: "Nombre de instancia CreatePayment",
            example: "Nombre de instancia CreatePayment",
            nullable: true
          })
          @IsOptional()
          @IsObject()
          @ValidateNested() // Asegúrate de validar los objetos anidados
          @isCreateOrUpdatePaymentDtoType({
            message:
              "input debe ser un objeto de tipo CreatePaymentDto o UpdatePaymentDto",
          }) // Usar class-transformer para la transformación de tipos
          @Field(() => CreatePaymentDto, { nullable: true }) // Asegúrate de que el campo sea nullable si es opcional
          input?: CreatePaymentDto | UpdatePaymentDto;
        }

        @InputType()
        export class PaymentValueInput {
          @ApiProperty({ type: String ,nullable: false, description: 'Campo de filtro' })
          @Field({ nullable: false })
          fieldName: string = 'id';

          @ApiProperty({ type: PaymentDto ,nullable: false, description: 'Valor del filtro' })
          @Field(() => PaymentDto, { nullable: false })
          fieldValue: any; // Permite cualquier tipo
        }

        


