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
  posts.associate = (models) => {
    posts.hasMany(models.comments, {
      // add an association between the posts table and the comments table
      onDelete: "cascade", // when a post is deleted it will delete every comment associated with it
    });
  };

  return posts;
};
