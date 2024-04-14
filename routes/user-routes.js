const express = require("express");
const route = express.Router();
const db = require("../models");
const {
  verifyJWT,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const bcrypt = require("bcrypt");
const { upload } = require('../utils/upload-images')
const { editProfileSchema } = require("../utils/validationSchemas");





/**
 *      @method GET
 *      @access praivte
 *      get user by id
 */

route.get("/users/:id",verifyTokenAndAuthorization, async (req, res) => {
  try {
    const getUser = await db.User.findOne({
      where: { id: req.params.id },
      include: [{ model: db.Completed_offers, required: false }],
    });
     if (!getUser) {
       return res.status(404).json({ message: "User not found" });
     }
    console.log(getUser)
    res.status(200).json(getUser);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

/**
 *      @method DELETE
 *      @access Praivte
 *      delete accuont
 */
route.delete("/users/:id", verifyTokenAndAuthorization, async (req, res) => {

  try {
    const user = await db.User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "The user has been deleted successfully" });
  } catch (error) {
  
    console.error(error);
    res.status(400).send(error.message);
  }
});


/**
 *      @method PUT
 *      @access Praivte
 *      edit Profile
 */

route.put(
  "/users/:id",
  verifyTokenAndAuthorization,
  upload?.single("imgProfile"),
  async (req, res) => {
    const { id } = req.params;
    const imgProfile = req?.file?.filename; // تأكد من الحصول على اسم الملف بشكل صحيح
    let { full_name, email, password } = req.body;

    try {
      const validation = editProfileSchema.safeParse({
        email,
        full_name,
        password,
      });
      if (!validation.success) {
        return res
          .status(400)
          .json({ message: validation.error.errors[0].message });
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword;
      }

      let imagePath = ""; // إعطاء القيمة الافتراضية لمسار الصورة

      if (imgProfile && imgProfile !== "default-img.png") {
        const hostAddress = req.protocol + "://" + req.get("host");
        imagePath = hostAddress + "/api/img/profile/" + imgProfile;
      }

      const user = await db.User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's information
      user.full_name = full_name || user.full_name; // استخدام القيمة الحالية إذا لم تتم تقديم قيمة جديدة
      user.email = email || user.email; // استخدام القيمة الحالية إذا لم تتم تقديم قيمة جديدة
      user.password = password || user.password; // استخدام القيمة الحالية إذا لم تتم تقديم قيمة جديدة
      user.imgProfile = imagePath || user.imgProfile; // استخدام القيمة الحالية إذا لم تتم تقديم قيمة جديدة
      await user.save();

      res.json({ message: "User updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);



module.exports = route;