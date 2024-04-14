const fs = require("fs");

function errorLogger(err, req, res, next) {
  // Log the error to console
  console.error("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",err.stack);

  // Append the error message to errors.txt
  fs.writeFile("errors.txt", err.stack + "\n", (error) => {
    if (error) {
      console.error("حدث خطأ أثناء كتابة الخطأ في الملف:", error);
    }
  });

  // Pass the error to the next middleware
  next(err);
}

module.exports = errorLogger;
