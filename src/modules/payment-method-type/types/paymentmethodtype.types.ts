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


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { PaymentMethodType } from "../entities/payment-method-type.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de paymentmethodtype" })
export class PaymentMethodTypeResponse<T extends PaymentMethodType> extends GQResponseBase {
  @ApiProperty({ type: PaymentMethodType,nullable:false,description:"Datos de respuesta de PaymentMethodType" })
  @Field(() => PaymentMethodType, { description: "Instancia de PaymentMethodType", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de paymentmethodtypes" })
export class PaymentMethodTypesResponse<T extends PaymentMethodType> extends GQResponseBase {
  @ApiProperty({ type: [PaymentMethodType],nullable:false,description:"Listado de PaymentMethodType",default:[] })
  @Field(() => [PaymentMethodType], { description: "Listado de PaymentMethodType", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de PaymentMethodType",default:0 })
  @Field(() => Number, { description: "Cantidad de PaymentMethodType", nullable: false,defaultValue:0 })
  count: number = 0;
}






