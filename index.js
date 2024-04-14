const express = require("express");
const db = require("./models");
const helmet = require('helmet');
require("dotenv").config();
const path = require("path");
const { notFound, errorHanlder } = require("./middlewares/errors");
const cors = require('cors');




const app = express();
// static folder
app.use("/api/img/profile",express.static(path.join(__dirname, "images/profile")));





// Apply Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// helmet
app.use(helmet())

// cors
app.use(cors());

app.set("view engine", "ejs");



// welecome
app.get("/", (req, res) => {
  res.send("Hello");
});

//  routes
app.use(cors());
app.use("/api", require("./routes/auth-routes"));
app.use("/api", require("./routes/user-routes"));
app.use("/api", require("./routes/offers-routes"));
app.use("/password", require('./routes/forgot-pass-routes'));


// Error Hanldar Middewares
app.use(notFound)
app.use(errorHanlder)












// // دالة لتوجيه الإخراج إلى ملف
// function redirectTerminalOutputToFile(fileName) {
//   const originalStdoutWrite = process.stdout.write;

//   // استبدال دالة process.stdout.write
//   process.stdout.write = function (data) {
//     // كتابة البيانات إلى ملف
//     fs.appendFile(fileName, data, (err) => {
//       if (err) {
//         console.error("حدث خطأ أثناء كتابة المخرجات إلى الملف:", err);
//       }
//     });

//     // إعادة تنفيذ الدالة الأصلية
//     originalStdoutWrite.apply(process.stdout, arguments);
//   };
// }

// // استخدام الدالة لتوجيه الإخراج إلى ملف output.txt تلقائيًا
// redirectTerminalOutputToFile("output.txt");

// // مثال على استخدام Express
// app.get("/", (req, res) => {
//   console.log("هذا النص سيتم كتابته في ملف output.txt تلقائيًا.");
//   res.send("تمت العملية بنجاح.");
// });

// // بدء تشغيل الخادم على منفذ محدد
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`التطبيق يعمل على المنفذ ${PORT}`);
// });





// // =================================================================


db.sequelize.sync().then(() => {
  const port = 3000 || process.env.PORT  ;
  app.listen(port, () => {
    console.log("Server Is Running On Port", port);
  });
});
