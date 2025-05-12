import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsSortQuery(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSortQuery',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSortQueryValidator,
    });
  };
}

@ValidatorConstraint()
export class IsSortQueryValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return (
      typeof value === 'object' &&
      Object.values(value).every((s: string) => ['desc', 'asc'].includes(s))
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a Record<string, 'desc' | 'asc'>`;
  }
}
