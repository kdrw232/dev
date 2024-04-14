module.exports = (sequelize, DataTypes) => {
  const CpaNetwork = sequelize.define("cpanetwork", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    network_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });







  return CpaNetwork;
};
