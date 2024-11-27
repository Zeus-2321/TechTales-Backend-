const user = require("../db/models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const signUp = catchAsync (async (req, res, next) => {
    const body = req.body;

    const newUser = await user.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    })

    if(!newUser) {
        return next(new appError('Failed to create the user', 400));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id
    })

    
    return res.status(201).json({
        status: 'success',
        data: result,
    })
})

const login = catchAsync (async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new appError('Please provide email and password', 400));
    }

    const result = await user.findOne({where: { email }});
    if(!result || !(await bcrypt.compare(password, result.password))) {
        return next(new appError('Incorrect email or password', 401));
    }

    const token = generateToken({
        id: result.id
    });

    return res.status(201).json({
        status: 'success',
        data: token,
    })
})

const authentication = catchAsync( async(req, res, next) => {
    let idToken = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        idToken = req.headers.authorization.split(' ')[1];
    }
    if(!idToken) {
        return next(new appError('Please login to get access', 401));
    }

    // token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

    const freshUser = await user.findByPk(tokenDetail.id);

    if(!freshUser) {
        return next(new appError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
})

const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if(!userType.includes(req.user.userType)) {
            return next(new appError(`You don't have permission to perform this action`, 403));
        }
        return next();
    }
    return checkPermission;
}

module.exports = { signUp, login, authentication, restrictTo };