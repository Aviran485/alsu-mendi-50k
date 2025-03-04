import React, { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");

  // שליחת הטופס
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !message) {
      setConfirmation("נא למלא את כל השדות.");
      return;
    }

    setConfirmation("ההודעה נשלחה בהצלחה! ניצור איתך קשר בקרוב.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-container">
      <h2>צור קשר</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="שם מלא"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="הודעה"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">שלח הודעה</button>
      </form>
      {confirmation && <p className="confirmation">{confirmation}</p>}
    </div>
  );
}

export default Contact;
