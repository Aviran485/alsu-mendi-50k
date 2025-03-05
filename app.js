const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const fileUpload = require("express-fileupload");

const reportsRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// IMPORTANT: Modify these routes to match exactly
app.use("/api/reports", reportsRoutes);
app.use("/api/auth", authRoutes);
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 שרת פועל על פורט ${PORT}`));