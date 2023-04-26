const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signup(req, res) {
  const hashed_pwd = bcrypt.hashSync(req.body.password, 10);
  UserModel.create({
    userName: req.body.userName,
    lastName: req.body.lastName,
    cifDni: req.body.cifDni,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    password: hashed_pwd,
  })
    .then((user) => {
      const user_data = {
        userName: user.userName,
        lastName: user.lastName,
        cifDni: user.cifDni,
        phone: user.phone,
        address: user.address,
        email: user.email,
        password: user.password
      };
      const token = jwt.sign(user_data, process.env.SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ msg: "Gracias por registrarte" });
    })
    // res.status(200).send("Está toh correcto")
    .catch((err) => res.status(403).json({ error: err.message }));
}

function login(req, res) {
  UserModel.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) return res.json({ error: "email incorrecto" });
      if (user.access === false)
        return res.json({ error: "No estás autorizado" });

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (!result) {
          return res.json({ error: `wrong password for ${req.body.email}` });
        }
        const user_data = {
          userName: user.userName,
          lastName: user.lastName,
          cifDni: user.cifDni,
          phone: user.phone,
          address: user.address,
          email: user.email,
        };

        const token = jwt.sign(user_data, process.env.SECRET, {
          expiresIn: "1h",
        });

        return res.json({ token: token, ...user_data });
      });
    })
    .catch((err) => handleError(err, res));
}

module.exports = { signup, login };
