import React, { useState, useEffect } from "react";
import axios from "axios";

function ReportTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [hasCollar, setHasCollar] = useState(null); // ✅ New state for Has Collar
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/status",
          { withCredentials: true }
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!description && !selectedFile) {
      setMessage("⚠️ יש להזין תיאור או להעלות תמונה.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location || "Unknown");
    formData.append("has_collar", hasCollar); // ✅ Fix: Ensure correct field name
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

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
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setMessage("✅ הדיווח נשלח בהצלחה!");
        setSelectedFile(null);
        setDescription("");
        setLocation("");
        setHasCollar(null);
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

        {/* ✅ NEW: Has Collar radio buttons */}
        <div>
          <label>🦴 יש קולר?</label>
          <div>
            <label>
              <input
                type="radio"
                name="hasCollar"
                value="yes"
                checked={hasCollar === "yes"}
                onChange={() => setHasCollar("yes")}
              />{" "}
              כן
            </label>
            <label>
              <input
                type="radio"
                name="hasCollar"
                value="no"
                checked={hasCollar === "no"}
                onChange={() => setHasCollar("no")}
              />{" "}
              לא
            </label>
          </div>
        </div>

        <button type="submit">🚀 שלח דיווח</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ReportTab;
