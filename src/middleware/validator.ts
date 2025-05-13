import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import type { ValidationChain, ValidationError as _ExpressValidationError } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    throw new AppError('Validation failed', 400);
  };
};

// Common validation rules
export const userValidationRules = {
  register: [
    // Username validation
    {
      field: 'username',
      rules: [
        { validator: 'notEmpty', message: 'Username is required' },
        { validator: 'isLength', options: { min: 3, max: 30 }, message: 'Username must be between 3 and 30 characters' },
        { validator: 'matches', options: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
      ]
    },
    // Email validation
    {
      field: 'email',
      rules: [
        { validator: 'notEmpty', message: 'Email is required' },
        { validator: 'isEmail', message: 'Invalid email format' }
      ]
    },
    // Password validation
    {
      field: 'password',
      rules: [
        { validator: 'notEmpty', message: 'Password is required' },
        { validator: 'isLength', options: { min: 6 }, message: 'Password must be at least 6 characters long' }
      ]
    },
    // Full name validation
    {
      field: 'full_name',
      rules: [
        { validator: 'notEmpty', message: 'Full name is required' },
        { validator: 'isLength', options: { min: 2, max: 100 }, message: 'Full name must be between 2 and 100 characters' }
      ]
    }
  ],
  login: [
    {
      field: 'email',
      rules: [
        { validator: 'notEmpty', message: 'Email is required' },
        { validator: 'isEmail', message: 'Invalid email format' }
      ]
    },
    {
      field: 'password',
      rules: [
        { validator: 'notEmpty', message: 'Password is required' }
      ]
    }
  ]
};

export const productValidationRules = {
  create: [
    {
      field: 'name',
      rules: [
        { validator: 'notEmpty', message: 'Product name is required' },
        { validator: 'isLength', options: { min: 2, max: 100 }, message: 'Product name must be between 2 and 100 characters' }
      ]
    },
    {
      field: 'category_id',
      rules: [
        { validator: 'notEmpty', message: 'Category ID is required' },
        { validator: 'isInt', message: 'Category ID must be a number' }
      ]
    },
    {
      field: 'price',
      rules: [
        { validator: 'notEmpty', message: 'Price is required' },
        { validator: 'isFloat', options: { min: 0 }, message: 'Price must be a positive number' }
      ]
    },
    {
      field: 'stock_quantity',
      rules: [
        { validator: 'notEmpty', message: 'Stock quantity is required' },
        { validator: 'isInt', options: { min: 0 }, message: 'Stock quantity must be a non-negative number' }
      ]
    }
  ],
  update: [
    {
      field: 'name',
      rules: [
        { validator: 'optional' },
        { validator: 'isLength', options: { min: 2, max: 100 }, message: 'Product name must be between 2 and 100 characters' }
      ]
    },
    {
      field: 'price',
      rules: [
        { validator: 'optional' },
        { validator: 'isFloat', options: { min: 0 }, message: 'Price must be a positive number' }
      ]
    },
    {
      field: 'stock_quantity',
      rules: [
        { validator: 'optional' },
        { validator: 'isInt', options: { min: 0 }, message: 'Stock quantity must be a non-negative number' }
      ]
    }
  ]
};

export const orderValidationRules = {
  create: [
    {
      field: 'items',
      rules: [
        { validator: 'notEmpty', message: 'Order items are required' },
        { validator: 'isArray', message: 'Items must be an array' },
        {
          validator: 'custom',
          options: (items: any[]) => items.length > 0,
          message: 'Order must contain at least one item'
        }
      ]
    },
    {
      field: 'shipping_address',
      rules: [
        { validator: 'notEmpty', message: 'Shipping address is required' }
      ]
    },
    {
      field: 'phone',
      rules: [
        { validator: 'notEmpty', message: 'Phone number is required' },
        { validator: 'matches', options: /^\+?[\d\s-]+$/, message: 'Invalid phone number format' }
      ]
    }
  ]
}; 