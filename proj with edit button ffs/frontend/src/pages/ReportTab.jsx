import React, { useState, useEffect } from "react";
import axios from "axios";

function ReportTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null); // ✅ קבלת מזהה משתמש מסשן

  // 📌 בדיקת התחברות וקבלת מזהה המשתמש מהשרת
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/status",
          {
            withCredentials: true, // ✅ שולח את ה-Session עם הבקשה
          }
        );
        if (response.data.loggedIn) {
          setUserId(response.data.user.id);
        }
      } catch (error) {
        console.error("❌ שגיאה בקבלת מצב ההתחברות:", error);
      }
    };
    fetchUserStatus();
  }, []);

  // 📌 קבלת מיקום אוטומטי (אם המשתמש מאשר)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        () => {
          setMessage("⚠️ לא ניתן לקבל מיקום אוטומטי.");
        }
      );
    } else {
      setMessage("⚠️ המכשיר שלך לא תומך ב-GPS.");
    }
  };

  // 📌 העלאת הדיווח
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!description && !selectedFile) {
      setMessage("⚠️ יש להזין תיאור או להעלות תמונה.");
      return;
    }
  
    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location || "Unknown");
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
  
    // 🚀 Debugging: Print form data before sending
    console.log("🚀 Sending Form Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reports/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // ✅ Send session with request
        }
      );
  
      if (response.status === 201) {
        setMessage("✅ הדיווח נשלח בהצלחה!");
        setSelectedFile(null);
        setDescription("");
        setLocation("");
      } else {
        setMessage("❌ שגיאה בשליחת הדיווח.");
      }
    } catch (error) {
      console.error("❌ שגיאה בשליחת הדיווח:", error);
      setMessage("❌ שגיאת שרת, נסה שוב.");
    }
  };
  

  return (
    <div className="tab-content">
      <h3>📍 העלאת דיווח על כלב משוטט</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <textarea
          placeholder="תיאור הדיווח (אם אין תמונה)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="מיקום (אפשר להזין ידנית)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="button" onClick={getCurrentLocation}>
          📍 השתמש במיקום שלי
        </button>
        <button type="submit">🚀 שלח דיווח</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ReportTab;
