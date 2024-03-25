const { verify } = require("jsonwebtoken");

const validateToken = (premission) => {
  return (req, res, next) => {
    const accessToken = req.header("accessToken");
    if (!accessToken) {
      return res.json({ error: "User not logged in!" });
    }

    try {
      const validToken = verify(accessToken, "theJWTsecret");
      req.user = validToken;
      console.log("validToken: ", validToken.role);

      if (!premission.includes(validToken.role)) {
        return res.json({ error: "you don't have premission" });
      }

      if (validToken) {
        console.log("verified");
        return next();
      }
    } catch (err) {
      return res.json({ error: err });
    }
  };
};

module.exports = { validateToken };
