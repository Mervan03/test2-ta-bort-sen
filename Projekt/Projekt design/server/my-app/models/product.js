module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT, // TEXT är bra för långa produktbeskrivningar
        allowNull: false
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true // Bild kan vara frivilligt till en början
      }
    }, {
      underscored: true
    });
  
    return Product;
  };