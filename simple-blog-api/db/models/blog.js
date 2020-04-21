'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Blog extends Sequelize.Model {}
  Blog.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    genre: Sequelize.STRING,
    image: Sequelize.STRING,
    post: Sequelize.TEXT,
    
  }, { sequelize });

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: 'userId' })
  }
  return Blog;
};