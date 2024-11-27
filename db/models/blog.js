const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define('blog', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'title cannot be null',
      },
      notEmpty: {
        msg: 'title cannot by empty',
      },
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Content cannot be null',
      },
      notEmpty: {
        msg: 'Content cannot by empty',
      },
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
    },
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
    type: DataTypes.DATE,
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'blog'
})