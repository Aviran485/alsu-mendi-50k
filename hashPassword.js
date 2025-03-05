const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "123456"; // שים כאן את הסיסמה שתרצה להצפין
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("סיסמה מוצפנת:", hashedPassword);
}

hashPassword();
