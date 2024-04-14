const express = require("express");
const route = express.Router();
const db = require("../models");
const { registerSchema, LoginSchema } = require("../utils/validationSchemas");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { sendingMail } = require("../utils/nodemailerVerify");




/**
 *      @method POST
 *      @access Pablic
 *      create new user
 */

route.post("/newuser", async (req, res) => {
  const { full_name, email, password, isVerified } = req.body;

  try {
    // Validate incoming data
    const validation = registerSchema.safeParse({
      email,
      full_name,
      password,
    });
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: validation.error.errors[0].message });
    }

    // Check if the user already exists
    const existingUser = await db.User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "This user already registered" });
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await db.User.create({
      full_name,
      email,
      password: hashedPassword,
      isVerified,
    });
    // console.log("New Email", newUser.email);
    // // Generate token
    // const userData = {
    //   id: newUser.id,
    //   isAdmin: newUser.isAdmin,
    // };
    // const token = generateToken(userData);

    // // Merge user data with token
    // const userInfo = {
    //   newUser, token
    // };

    // // Send response with user data and token
    // res.status(201).json(userInfo);
        if (newUser) {
          let setToken = await db.token.create({
            userId: newUser.id,
            token: crypto.randomBytes(16).toString("hex"),
          });

          //if token is created, send the user a mail
          if (setToken) {
            //send email to the user
            //with the function coming from the mailing.js file
            //message containing the user id and the token to help verify their email
            sendingMail({
              from: "no-reply@example.com",
              to: `${email}`,
              subject: "Account Verification Link",
              text: `Hello, ${full_name} Please verify your email by
                clicking this link :
                http://localhost:3000/api/users/verify-email/${newUser.id}/${setToken.token}`,
            });

            //if token is not created, send a status of 400
          } else {
            return res.status(400).send("token not created");
          }

          console.log("user", JSON.stringify(newUser, null, 2));

          //send users details
          return res.status(201).send(newUser);
        } else {
          return res.status(409).send("Details are not correct");
        }
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});



route.get("/users/verify-email/:id/:token", async (req, res) => {
  const Token = req.params.token;

  try {
    //find user by token using the where clause
    const usertoken = await db.token.findOne({
      Token,
      where: {
        userId: req.params.id,
      },
    });
    console.log(usertoken);

    //if token doesnt exist, send status of 400
    if (!usertoken) {
      return res.status(400).send({
        msg: "Your verification link may have expired. Please click on resend for verify your Email.",
      });

      //if token exist, find the user with that token
    } else {
      const user = await db.User.findOne({ where: { id: req.params.id } });
      if (!user) {
        console.log(user);

        return res.status(401).send({
          msg: "We were unable to find a user for this verification. Please SignUp!",
        });

        //if user is already verified, tell the user to login
      } else if (user.isVerified) {
        return res
          .status(200)
          .send("User has been already verified. Please Login");

        //if user is not verified, change the verified to true by updating the field
      } else {
        const updated = await db.User.update(
          { isVerified: true },
          {
            where: {
              id: usertoken.userId,
            },
          }
        );
        console.log(updated);

        //if not updated send error message
        if (!updated) {
          return res.status(500).send({ msg: err.message });
          //else send status of 200
        } else {
          return res
            .status(200)
            .send("Your account has been successfully verified");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});





/**
 *      @method POST
 *      @access Pablic
 *      login 
 */

route.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const validation = LoginSchema.safeParse({
      email,
      password,
    });
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: validation.error.errors[0].message });
    }
    // Find the user by username
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const userData = {
          id: user.id,
          isAdmin: user.isAdmin,
        };
    const verified = user.isVerified;
        if (verified) {
          const token = generateToken(userData);
              const userInfo = {
                user,
                token,
              };

              res.status(200).json(userInfo);
        } else {
          return res.status(401).send("User not verified");
        }

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = route;
