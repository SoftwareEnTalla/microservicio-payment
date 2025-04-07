import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { CreatePaymentDto } from "../dtos/createpayment.dto";
import { UpdatePaymentDto } from "../dtos/updatepayment.dto";
import { createUnionType } from "@nestjs/graphql";

@ValidatorConstraint({ name: "isCreateOrUpdatePaymentDtoType", async: false })
export class IsPaymentTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // Verifica si el valor es un objeto y tiene la estructura esperada
    return (
      value instanceof CreatePaymentDto || value instanceof UpdatePaymentDto
    );
  }

  defaultMessage() {
    return "El valor debe ser un objeto de tipo CreatePaymentDto o UpdatePaymentDto";
  }
}

export function isCreateOrUpdatePaymentDtoType(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPaymentTypeConstraint,
    });
  };
}

// Crear un tipo de unión para GraphQL
export const PaymentUnion = createUnionType({
  name: 'PaymentUnion',
  types: () => [CreatePaymentDto, UpdatePaymentDto] as const,
});

