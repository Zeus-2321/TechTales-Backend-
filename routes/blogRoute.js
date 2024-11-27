const { authentication, restrictTo } = require('../controller/authController');
const { createBlog, getAllblog, getBlogById, updateBlog, deleteBlog } = require('../controller/blogController');

const router = require('express').Router();

router.route('/').post(authentication, createBlog);
router.route('/').get(authentication, getAllblog);
router.route('/:id').get(authentication, getBlogById);
router.route('/:id').patch(authentication, updateBlog);
router.route('/:id').delete(authentication, deleteBlog);

module.exports = router;