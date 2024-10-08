import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export class UnprocessedEntity {
  statusCode: number;
  message: string;
  errors: UnprocessedEntityErrors[];
}

export class UnprocessedEntityErrors {
  property: string;
  concern: string;
}

export const findConstraints = (
  error: ValidationError,
  path: string = '',
): { property: string; concern: string; position: string | null }[] => {
  const constraints = [];
  const propertyPath = path ? `${path}.${error.property}` : error.property;

  if (error.constraints) {
    let concern = Object.keys(error.constraints)[0];

    // Ucfirst for concern validateSync / validate from class-validator
    concern = concern?.charAt(0).toUpperCase() + concern?.slice(1);

    constraints.push({
      property: propertyPath,
      concern: concern,
    });
  }

  if (error.children && error.children.length > 0) {
    for (const element of error.children) {
      constraints.push(...findConstraints(element, propertyPath));
    }
  }

  return constraints;
};

export const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  stopAtFirstError: true,
  skipMissingProperties: false,
  exceptionFactory: (errors: ValidationError[]) => {
    const errMsg = errors.flatMap((err, index) => findConstraints(err));

    return new UnprocessableEntityException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Invalid Fields',
      errors: errMsg,
    });
  },
};
