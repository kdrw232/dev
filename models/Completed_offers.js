module.exports = (sequelize, DataTypes) => {
  const Completed_offers = sequelize.define("Completed_offers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    offer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    network: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Completed_offers.associate = (models) => {
    Completed_offers.belongsTo(models.User, {
      onDelete: "cascade",
    });
  };

  return Completed_offers;
};
