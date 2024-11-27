'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database')
const bcrypt = require('bcrypt');
const appError = require('../../utils/appError');
const blog = require('./blog');

const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'firstName cannot be null',
      },
      notEmpty: {
        msg: 'firstName cannot by empty',
      },
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'lastName cannot be null',
      },
      notEmpty: {
        msg: 'lastName cannot by empty',
      },
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'userType cannot be null',
      },
      notEmpty: {
        msg: 'userType cannot by empty',
      },
      isEmail: {
        mgs: 'Invalid email id',
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password cannot be null',
      },
      notEmpty: {
        msg: 'password cannot by empty',
      },
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if(this.password.length < 7) {
        throw new appError('Password length must be greater than 7', 400);
      }
      if(value === this.password) {
        const hashPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashPassword);
      }
      else {
        throw new appError("Password and confirm password must be the same", 400);
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName:'user',
});


user.hasMany(blog, {foreignKey: 'createdBy'});
blog.belongsTo(user, {foreignKey: 'createdBy'});

module.exports = user;