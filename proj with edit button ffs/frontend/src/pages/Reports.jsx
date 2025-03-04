import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);

  // 📌 שליפת הדיווחים מהשרת (Session-Based)
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports", {
        withCredentials: true,
      });

      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ שגיאה בשליפת דיווחים:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 📌 מחיקת דיווח ללא רענון הדף
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reports/delete/${id}`, {
        withCredentials: true,
      });

      console.log("✅ דיווח נמחק בהצלחה");
      fetchReports();
    } catch (error) {
      console.error("❌ שגיאה במחיקה:", error);
    }
  };

  // 📌 עדכון סטטוס ללא רענון הדף
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reports/update/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      console.log("✅ סטטוס עודכן בהצלחה");
      fetchReports();
    } catch (error) {
      console.error("❌ שגיאה בעדכון הסטטוס:", error);
    }
  };

  // 📌 התחלת עריכת דיווח
  const startEditing = (report) => {
    setEditingReport({
      ...report,
      originalDescription: report.description,
      originalLocation: report.location
    });
  };

  // 📌 ביטול עריכה
  const cancelEditing = () => {
    setEditingReport(null);
  };

  // 📌 שמירת עריכת הדיווח
  const saveEdit = async () => {
    if (!editingReport) return;
  
    console.log("🚀 Sending update request for:", editingReport.id);
    console.log("Payload:", {
      description: editingReport.description,
      location: editingReport.location,
    });
  
    try {
      const response = await axios.put(
        `http://localhost:5000/api/reports/edit/${editingReport.id}`,
        {
          description: editingReport.description,
          location: editingReport.location,
        },
        { withCredentials: true }
      );
  
      console.log("✅ דיווח עודכן בהצלחה");
      fetchReports();
      setEditingReport(null);
    } catch (error) {
      console.error("❌ שגיאה בעדכון הדיווח:", error);
    }
  };
  

  return (
    <div className="reports-container">
      <h1>📋 ניהול דיווחים</h1>
      {loading ? (
        <p>⏳ טוען נתונים...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>תמונה</th>
              <th>תיאור</th>
              <th>מיקום</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  {report.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${report.image}`}
                      alt="Report"
                      width="80"
                    />
                  ) : (
                    "אין תמונה"
                  )}
                </td>
                <td>
                  {editingReport && editingReport.id === report.id ? (
                    <textarea
                      value={editingReport.description}
                      onChange={(e) => 
                        setEditingReport({
                          ...editingReport, 
                          description: e.target.value
                        })
                      }
                    />
                  ) : (
                    report.description
                  )}
                </td>
                <td>
                  {editingReport && editingReport.id === report.id ? (
                    <input
                      type="text"
                      value={editingReport.location}
                      onChange={(e) => 
                        setEditingReport({
                          ...editingReport, 
                          location: e.target.value
                        })
                      }
                    />
                  ) : (
                    report.location
                  )}
                </td>
                <td>
                  <select
                    value={report.status}
                    onChange={(e) =>
                      handleUpdateStatus(report.id, e.target.value)
                    }
                  >
                    <option value="לא טופל">לא טופל</option>
                    <option value="בטיפול">בטיפול</option>
                    <option value="נסגר">נסגר</option>
                  </select>
                </td>
                <td>
                  {editingReport && editingReport.id === report.id ? (
                    <>
                      <button 
                        className="save-btn" 
                        onClick={saveEdit}
                      >
                        💾 שמור
                      </button>
                      <button 
                        className="cancel-btn" 
                        onClick={cancelEditing}
                      >
                        ❌ בטל
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(report)}
                      >
                        ✏️ ערוך
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(report.id)}
                      >
                        🗑️ מחק
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;