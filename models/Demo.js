module.exports = function(sequelize, Sequelize) {
  return sequelize.define('demo', {
    uuid: { type: Sequelize.STRING(32), allowNull: false, unique: true },
  });
};
