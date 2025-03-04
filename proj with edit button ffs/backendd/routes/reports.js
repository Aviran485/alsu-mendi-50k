const express = require("express");
const router = express.Router();
const db = require("../dbSingleton");
const multer = require("multer");
const path = require("path");

// 📌 Middleware לבדיקה אם המשתמש מחובר (Session-Based)
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "גישה נדחתה - יש להתחבר" });
  }
  next();
};

// 📌 אחסון תמונות
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// 📌 שליפת כל הדיווחים (לעובדים מחוברים בלבד)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [reports] = await db.query("SELECT * FROM reports");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאת שרת", error });
  }
});

// 📌 הוספת דיווח חדש (משתמשים אנונימיים יכולים לדווח)
router.post("/add", async (req, res) => {
  console.log("🚀 Received Data:", req.body);
  console.log("🚀 Received Files:", req.files);

  const { description, location } = req.body;
  let image = req.files ? req.files.image : null;

  if (!description && !image) {
    return res.status(400).json({ message: "❌ יש להזין תיאור או להעלות תמונה." });
  }

  const finalLocation = location ? location : "Unknown";

  let imageName = "no-image.jpg";
  if (image) {
    imageName = Date.now() + "-" + image.name;
    image.mv(`./uploads/${imageName}`, (err) => {
      if (err) {
        return res.status(500).json({ message: "❌ שגיאה בהעלאת התמונה.", error: err });
      }
    });
  }

  try {
    await db.query(
      "INSERT INTO reports (description, location, image) VALUES (?, ?, ?)",
      [description, finalLocation, imageName]
    );
    res.status(201).json({ message: "✅ Report added successfully" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ Server Error", error });
  }
});

// 📌 הוספת נתיב לעריכת דיווח (לעובדים בלבד)
router.put("/edit/:id", authMiddleware, async (req, res) => {
  const { description, location } = req.body;
  const { id } = req.params;

  console.log(`📌 PUT /edit/${id} received`);
  console.log("Request Body:", req.body);

  try {
    const [result] = await db.query(
      "UPDATE reports SET description = ?, location = ? WHERE id = ?",
      [description, location, id]
    );

    if (result.affectedRows === 0) {
      console.log("❌ No report found with this ID");
      return res.status(404).json({ message: "❌ דיווח לא נמצא" });
    }

    res.json({ message: "✅ דיווח עודכן בהצלחה" });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "❌ Server Error", error });
  }
});




// // 📌 עדכון סטטוס דיווח (לעובדים בלבד)
// router.put("/update/:id", authMiddleware, async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;

//   try {
//     const [result] = await db.query(
//       "UPDATE reports SET status = ? WHERE id = ?",
//       [status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "❌ דיווח לא נמצא" });
//     }

//     res.json({ message: "✅ סטטוס עודכן בהצלחה" });
//   } catch (error) {
//     res.status(500).json({ message: "❌ שגיאת שרת", error });
//   }
// });

// 📌 מחיקת דיווח (לעובדים בלבד)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM reports WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "❌ דיווח לא נמצא" });
    }

    res.json({ message: "✅ הדיווח נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({ message: "❌ שגיאת שרת", error });
  }
});

module.exports = router;
