'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Läser in alla .js-filer i mappen models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// --- RELATIONER ENLIGT PROJEKTBESKRIVNING ---

// 1. En användare kan ha en varukorg [cite: 188]
db.user.hasMany(db.cart, { foreignKey: 'user_id' }); // [cite: 173]
db.cart.belongsTo(db.user, { foreignKey: 'user_id' });

// 2. Många-till-många mellan cart och product via cart_row [cite: 189]
// Detta gör att vi kan spara "amount" i kopplingstabellen [cite: 166, 223]
db.cart.belongsToMany(db.product, { through: db.cart_row, foreignKey: 'cart_id' }); // [cite: 177]
db.product.belongsToMany(db.cart, { through: db.cart_row, foreignKey: 'product_id' }); // [cite: 172]

// 3. Produkter kan ha betyg (Ratings) [cite: 191]
db.product.hasMany(db.rating, { foreignKey: 'product_id' }); // [cite: 187]
db.rating.belongsTo(db.product, { foreignKey: 'product_id' });

// Tips från s. 11: Lagra vem som gav betyget (valfritt men bra) [cite: 297]
db.user.hasMany(db.rating, { foreignKey: 'user_id' });
db.rating.belongsTo(db.user, { foreignKey: 'user_id' });

// --------------------------------------------

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;