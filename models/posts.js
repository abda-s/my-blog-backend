module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define("posts", {
    title: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNULL: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNULL: false,
    },
  });

  return posts;
};
