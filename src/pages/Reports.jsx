import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);

  // 📌 Fetch reports from the server
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reports", {
        withCredentials: true,
      });
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 📌 Start editing a report
  const startEditing = (report) => {
    setEditingReport({
      ...report,
      description: report.description,
      location: report.location,
      hasCollar: report.has_collar === "yes" ? "yes" : "no", // ✅ Ensure "yes" or "no"
    });
  };

  // 📌 Cancel editing
  const cancelEditing = () => {
    setEditingReport(null);
  };

  // 📌 Save the edited report
  const saveEdit = async () => {
    if (!editingReport) return;

    console.log("🚀 Sending update request for:", editingReport.id);
    console.log("Payload:", {
      description: editingReport.description,
      location: editingReport.location,
      has_collar: editingReport.hasCollar, // ✅ Fix field name
    });

    try {
      await axios.put(
        `http://localhost:5000/api/reports/edit/${editingReport.id}`,
        {
          description: editingReport.description,
          location: editingReport.location,
          has_collar: editingReport.hasCollar, // ✅ Ensure correct value is sent
        },
        { withCredentials: true }
      );

      console.log("✅ Report updated successfully");
      fetchReports(); // ✅ Reload reports after updating
      setEditingReport(null);
    } catch (error) {
      console.error("❌ Error updating report:", error);
    }
  };

  // 📌 Delete a report
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ האם אתה בטוח שברצונך למחוק את הדיווח?")) return;

    console.log("🚀 Deleting report with ID:", id);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/reports/delete/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("✅ Report deleted successfully");
        fetchReports(); // ✅ Refresh the reports list
      } else {
        console.error("❌ Error deleting report: Unexpected response", response);
      }
    } catch (error) {
      console.error("❌ Error deleting report:", error);
    }
  };

  // 📌 Update the report status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reports/update/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      console.log("✅ Status updated successfully");
      fetchReports(); // Refresh reports after update
    } catch (error) {
      console.error("❌ Error updating status:", error);
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
              <th>קולר</th>
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
                          description: e.target.value,
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
                          location: e.target.value,
                        })
                      }
                    />
                  ) : (
                    report.location
                  )}
                </td>
                <td>
                  {editingReport && editingReport.id === report.id ? (
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={`hasCollar-${report.id}`}
                          value="yes"
                          checked={editingReport.hasCollar === "yes"}
                          onChange={() =>
                            setEditingReport({
                              ...editingReport,
                              hasCollar: "yes",
                            })
                          }
                        />{" "}
                        כן
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`hasCollar-${report.id}`}
                          value="no"
                          checked={editingReport.hasCollar === "no"}
                          onChange={() =>
                            setEditingReport({
                              ...editingReport,
                              hasCollar: "no",
                            })
                          }
                        />{" "}
                        לא
                      </label>
                    </div>
                  ) : (
                    report.has_collar === "yes" ? "כן" : "לא" // ✅ Fixed display issue
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
                      <button className="save-btn" onClick={saveEdit}>
                        💾 שמור
                      </button>
                      <button className="cancel-btn" onClick={cancelEditing}>
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
