module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNULL: false,
    },
  });

  return users;
};
