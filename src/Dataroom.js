import React, { useState } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showAllDataroom, setShowAllDataroom] = useState(false);

  const toggleAllDataroom = () => {
    setShowAllDataroom(!showAllDataroom);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__logo">
          <img src={process.env.PUBLIC_URL + 'assets/logo.png'} alt="Logo" />
        </div>
        <div className="navbar__user">
          <div className="navbar__dropdown">
            <button className="navbar__dropdown-btn" onClick={toggleDropdown}>
              <span className="navbar__username">Hunter C</span>
              {dropdownVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {dropdownVisible && (
              <div className="navbar__dropdown-content">
                <a href="#">Profile</a>
                <a href="#">Settings</a>
                <button>Logout</button>
              </div>
            )}
          </div>
          <div className="navbar__user-info">
            <img className="navbar__avatar" src={process.env.PUBLIC_URL + '/avatar.png'} alt="User Avatar" />
          </div>
        </div>
      </header>
      <main className='main-container'>
        <p className='welcome-text'>WELCOME HUNTER</p>
        <div className='dataroom-main'>
          <button className='dataroom-file-button' onClick={toggleAllDataroom}>
            <span>FILES</span>
            <div className="extra-div">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                <rect x="0.499969" y="18.0013" width="16.7925" height="16.7925" rx="2.5" transform="rotate(-90 0.499969 18.0013)" fill="#F8FAFC" stroke="#DCE7F1" />
                <path d="M12.8052 8.30205L8.89622 12.211L4.98727 8.30205L5.89936 7.38996L8.89622 10.3868L11.8931 7.38996L12.8052 8.30205Z" fill="#ABB6BF" />
              </svg>
            </div>
          </button>
          <button className='dataroom-files-open' onClick={toggleAllDataroom}>
            <FaPlus />
          </button>
        </div>
        {showAllDataroom && (
          <div className="dataroom-files">
            <button className='dataroom-file-button' onClick={() => navigate("/drive")}>
              <span>Google Drive</span>
              <div className="extra-div">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                  <rect x="0.499969" y="18.0013" width="16.7925" height="16.7925" rx="2.5" transform="rotate(-90 0.499969 18.0013)" fill="#F8FAFC" stroke="#DCE7F1" />
                  <path d="M12.8052 8.30205L8.89622 12.211L4.98727 8.30205L5.89936 7.38996L8.89622 10.3868L11.8931 7.38996L12.8052 8.30205Z" fill="#ABB6BF" />
                </svg>
              </div>
            </button>
            <button className='dataroom-file-button' onClick={() => navigate("/auth/callback")}>
              <span>DropBox</span>
              <div className="extra-div">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                  <rect x="0.499969" y="18.0013" width="16.7925" height="16.7925" rx="2.5" transform="rotate(-90 0.499969 18.0013)" fill="#F8FAFC" stroke="#DCE7F1" />
                  <path d="M12.8052 8.30205L8.89622 12.211L4.98727 8.30205L5.89936 7.38996L8.89622 10.3868L11.8931 7.38996L12.8052 8.30205Z" fill="#ABB6BF" />
                </svg>
              </div>
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
