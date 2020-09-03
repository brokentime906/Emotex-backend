const User = require("../schemas/User");

exports.createAccountWithEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const nUser = await User.create({ email });
    res
      .status(200)
      .json({ success: true, msg: "Create Account is Successful" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, msg: "[Error 1] DB" });
  }
};
