import React, { useState } from "react";
import "../styles.css";

function IdentifyTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("⚠️ יש לבחור תמונה לפני השליחה.");
      return;
    }

    // כרגע אין AI, פשוט נציג הודעה שהתמונה נשלחה
    setMessage("✅ התמונה נשלחה בהצלחה! בעתיד תהיה כאן מערכת AI לזיהוי.");
  };

  return (
    <div className="tab-content">
      <h3 className="identify-title">🖼️ העלאת תמונה לזיהוי גזע הכלב</h3>
      <form onSubmit={handleSubmit} className="identify-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        {selectedFile && (
          <div className="image-preview">
            <p>📷 תצוגה מקדימה:</p>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}
        <button type="submit" className="submit-button">
          🚀 שלח תמונה
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default IdentifyTab;
