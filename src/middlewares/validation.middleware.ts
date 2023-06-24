import { HttpException } from '@/exceptions/http.exception';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        console.log('Validation failed. errors: ', JSON.stringify(errors));
        const message = collectConstraintMessages(errors);
        next(new HttpException(400, message));
      });
  };
};

const collectConstraintMessages = (errors: ValidationError[]): string => {
  const messages: string[] = [];

  const traverse = (node: ValidationError) => {
    if (node.constraints) {
      Object.values(node.constraints).forEach(msg => messages.push(msg));
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  };

  errors.forEach(traverse);

  return messages.join(', ');
};
