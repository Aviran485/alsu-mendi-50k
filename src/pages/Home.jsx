import React from "react";
import "../styles.css"; // ✅ לוודא שהקובץ קיים
import { useNavigate } from "react-router-dom";
import dogIdentify from "../assets/dog-breed.jpg"; // ✅ לוודא שהתמונה נמצאת ב /src/assets/
import dogReport from "../assets/dog-report.jpg"; // ✅ לוודא שהתמונה נמצאת ב /src/assets/
import manageReports from "../assets/manage-reports.jpg"; // ✅ לוודא שהתמונה נמצאת ב /src/assets/

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Dog Report System</h1>
      <p>
        This platform allows users to report stray dogs and helps authorities
        manage the reports.
      </p>

      <div className="options">
        <div className="option-card" onClick={() => navigate("/identify")}>
          <img src={dogIdentify} alt="Identify Dog Breed" />
          <p>Identify Dog Breed</p>
        </div>
        <div className="option-card" onClick={() => navigate("/report")}>
          <img src={dogReport} alt="Report a Stray Dog" />
          <p>Report a Stray Dog</p>
        </div>
        {isAuthenticated && (
          <div className="option-card" onClick={() => navigate("/reports")}>
            <img src={manageReports} alt="Manage Reports" />
            <p>Manage Reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
