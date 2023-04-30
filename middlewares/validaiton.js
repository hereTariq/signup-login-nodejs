const { body } = require('express-validator');

exports.signupValidation = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('name is required')
        .isString()
        .withMessage('name should be combination of character')
        .isLength({ min: 4 })
        .withMessage('name should be at least 4 characters'),
    body('email')
        .not()
        .isEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('Please input a valid email')
        .trim()
        .toLowerCase()
        .normalizeEmail(),
    body('password')
        .not()
        .isEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters')
        .isStrongPassword()
        .withMessage('password shoule be strong password'),
];

exports.loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please input a valid email')
        .trim()
        .toLowerCase()
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters'),
];
