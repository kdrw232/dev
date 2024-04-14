const db = require('../models');
const generateToken = require("../utils/generateToken");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { resetPasswordSchema } = require("../utils/validationSchemas");


module.exports.getForgotPasswordView = (req, res) => {
    try {
        res.render("forgot-password");

    } catch (error) {
        
    }
}

module.exports.sendForgotPasswordLink = async (req, res) => {
    
  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    console.log(user.password)
    if(!user){
        return res.status(404).json({message: 'user not found'})
    }

    const secret = process.env.JWT_SECRET + user.password
    const token = jwt.sign({email:user.email, id:user.id}, secret,{
        expiresIn: '5m'
    });

    const link = `http://localhost:3000/password/reset-password/${user.id}/${token}`;

    res.json({message:'Clike on the link',resetPasswordLink: link})

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
      },
    });
    const mailOptions = {
        from:"",
        to:user.email,
        subject:"Reset Password",
        html:`  <div>
                    <h4>
                        Click on the link below to reset password 
                    </h4>
                    <p>
                        ${link}
                    </p>
                </div>`
    }

    transporter.sendMail(mailOptions, function(error, success){
        if(error){
            console.log(error)
            res.status(500).json({message : 'something went wrong'})
        } else {
            console.log("Email sent" + success.response);
            res.render("link-send")
        }
    })
  } catch (error) {
    console.log(error)
  }
};




module.exports.getResetPasswordView = async (req, res) => {
  const { id, token } = req.params;
  try {
    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
      res.render("reset-password", { email: user.email });
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ message: "The link is invalid or expired" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



module.exports.resetThePassword = async (req, res) => {
  try {

    const validation = resetPasswordSchema.safeParse({
      email,
      full_name,
      password,
    });
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: validation.error.errors[0].message });
    }
    const { id, token } = req.params;

    // Find user by id
    const user = await db.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the token
    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      // Update user's password
      await user.update({ password: req.body.password });

      // Send success response
      res.json({ message: "User updated successfully" });
      // Assuming you want to render a view after successful password update
      // res.render('success-password');
    } catch (error) {
      console.log(error);
      // If token verification fails, send an error response
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.log(error);
    // If an error occurs during user retrieval or password update, send an error response
    return res.status(500).json({ message: "Internal server error" });
  }
};