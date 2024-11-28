const catchAsync = require("../utils/catchAsync");
const user = require("../db/models/user");
const appError = require("../utils/appError");
const blog = require("../db/models/blog");

const createBlog = catchAsync(async (req, res, next) => {
    const body = req.body;
    console.log(req.user);
    const userId = req.user.id;

    const newBlog = await blog.create({
        title: body.title,
        content: body.content,
        createdBy: userId,
    });

    return res.status(201).json({
        status: 'success',
        data: newBlog,
    });
})

const getAllblog = catchAsync(async (req, res, next) => {
    const result = await blog.findAll();

    return res.json({
        status: 'success',
        data: result,
    })
})

const getAllblogOfUser = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const result = await blog.findAll({ include:user, where: {createdBy: userId} });

    return res.json({
        status : 'success',
        data: result,
    })
})

const getBlogById = catchAsync(async (req, res, next) => {
    const blogId = req.params.id;
    const result = await project.findByPk(blogId, { include: user});

    if(!result) {
        return next(new appError('Invalid blog id', 400));
    }

    return res.json({
        status: 'success',
        data: result,
    })
});

const updateBlog = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const blogId = req.params.id;
    const body = req.body;

    const result = await blog.findOne({where: {id: blogId, createdBy: userId}});

    if(!result) {
        return next(new appError('Invalid blog id', 400));
    }

    result.title = body.title;
    result.content = body.content;

    const updatedResult = await result.save();

    return res.json({
        status: 'success',
        data: updatedResult,
    })
});

const deleteBlog = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const blogId = req.params.id;

    const result = await blog.findOne({where: {id: blogId, createdBy: userId}});

    if(!result) {
        return next(new appError('Invalid blog id', 400));
    }


    await result.destroy();

    return res.json({
        status: 'success',
        message: 'Record Deleted Successfully',
    })
});

module.exports = { createBlog, getAllblog, getAllblogOfUser, getBlogById, updateBlog, deleteBlog }