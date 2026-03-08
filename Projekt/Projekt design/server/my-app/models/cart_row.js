module.exports = (sequelize, DataTypes) => {
  const CartRow = sequelize.define('cart_row', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1.0
    }
  }, {
    underscored: true // Ger oss created_at och updated_at automatiskt
  });

  return CartRow;
};