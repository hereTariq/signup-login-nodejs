const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name && email == '@' && !password) {
        return res.status(422).json({
            status: false,
            message: 'Please Enter name, email and password',
        });
    }
    if (email == '@' && !password) {
        return res.status(422).json({
            status: false,
            message: 'email and password are also required',
        });
    }
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = errors.array()[0].msg;
        return res.status(422).json({ status: false, message: error });
    }

    let user = await User.findOne({ email });
    if (user) {
        return res
            .status(400)
            .json({ status: false, message: 'User already Exist' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();

    res.status(201).json({
        status: true,
        message: 'User created successfully',
        user: {
            _id: savedUser._id,
            name,
            email,
        },
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (email == '@' || !password) {
        return res.status(422).json({
            status: false,
            message: 'email and password are required',
        });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = errors.array()[0].msg;
        return res.status(422).json({ status: false, message: error });
    }
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            status: false,
            message: 'User is not registered, first signup then try to login.',
        });
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
        return res
            .status(401)
            .json({ status: false, message: 'Email or password is incorrect' });
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.TOKEN,
        { expiresIn: '1d' }
    );
    res.status(200).json({
        status: true,
        message: 'user logged in successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        },
    });
};

exports.getUserById = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json({ status: false, message: 'user not found' });
    }
    res.status(200).json({ status: true, user });
};

exports.getUsers = async (req, res) => {
    const users = await User.find();
    if (users.length == 0) {
        return res
            .status(404)
            .json({ status: false, message: 'No user found' });
    }
    res.status(200).json({ status: true, users });
};
