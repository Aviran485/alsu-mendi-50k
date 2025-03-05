const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ שגיאה בחיבור ל-DB:", err);
  } else {
    console.log("✅ התחברנו למסד הנתונים בהצלחה!");
    connection.release(); // שחרור החיבור מיד אחרי הבדיקה
  }
});

module.exports = pool.promise();
