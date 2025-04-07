import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { Payment } from "../entities/payment.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de payment" })
export class PaymentResponse<T extends Payment> extends GQResponseBase {
  @ApiProperty({ type: Payment,nullable:false,description:"Datos de respuesta de Payment" })
  @Field(() => Payment, { description: "Instancia de Payment", nullable: true })
  data?: T;
}

@ObjectType({ description: "Respuesta de payments" })
export class PaymentsResponse<T extends Payment> extends GQResponseBase {
  @ApiProperty({ type: [Payment],nullable:false,description:"Listado de Payment",default:[] })
  @Field(() => [Payment], { description: "Listado de Payment", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de Payment",default:0 })
  @Field(() => Number, { description: "Cantidad de Payment", nullable: false,defaultValue:0 })
  count: number = 0;
}




