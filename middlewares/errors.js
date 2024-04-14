const fs = require("fs");
const path = require("path");
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};



const errorHanlder = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });

  // تسجيل الخطأ في ملف errors.txt
  const filePath = path.join(__dirname, "errors.txt");
  fs.appendFile(
    filePath,
    `${new Date().toISOString()} - ${err.message}\n`,
    (error) => {
      if (error) {
        console.error("حدث خطأ أثناء تسجيل الخطأ في الملف.");
        return next(error); // توجيه الخطأ إلى middleware الخطأ التالي
      }
    }
  );

  return err;
};


module.exports = {
  notFound,
  errorHanlder,
};
