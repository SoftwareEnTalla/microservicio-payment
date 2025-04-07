import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean, IsDate, IsOptional,IsObject, ValidateNested } from "class-validator";
import { InputType, Field } from '@nestjs/graphql'; 
import { Type } from 'class-transformer';

@InputType()
export class DeletePaymentDto {
 // Propiedades específicas de la clase DeletePaymentDto en cuestión
  
 
  @ApiProperty({
    description: "Identificador de instancia a eliminar",
    example: "Se proporciona un identificador de DeletePayment a eliminar",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String,{ nullable: false })
  id: string='';
  

  @ApiProperty({
    description: "Lista de identificadores de instancias a eliminar",
    example:"Se proporciona una lista de identificadores de DeletePayment a eliminar",
  })
  @IsString()
  @IsOptional()
  @Field(() => String,{ nullable: true })
  ids?: string[];  
  

}
