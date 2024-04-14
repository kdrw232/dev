const fs = require("fs");

// دالة لتسجيل الأخطاء في ملف نصي
const logErrorsToFile = (err) => {
  const logMessage = `${new Date().toISOString()} - ${err.stack}\n`;

  fs.appendFile("text.txt", logMessage, (error) => {
    if (error) {
      console.error("حدث خطأ أثناء تسجيل الخطأ في الملف.");
    }
  });
};

// Middleware للتعامل مع الأخطاء
const rorHandler = (err, req, res, next) => {
  // تسجيل الخطأ في ملف
  logErrorsToFile(err);

  // إرسال رسالة الخطأ إلى العميل
  res.status(500).send("حدث خطأ في الخادم!");
};

module.exports = rorHandler;
