import React from "react";
import '../drobox-styles.css';

const TwoFactorAuth = () => {
    return (
        <>
            <div className="main-container">
                <div className="content-container">
                    <div className="section">
                        <div class="main-screen">
                            <div class="box-data">
                                <div class="content-data">
                                    <h1 class="intro-text">Introducing: AI-Powered Data Rooms</h1>
                                    <h2 class="h2-text">
                                        Strategic Insight, Market
                                        <br />
                                        Foresight: Raising Standards
                                    </h2>
                                    <p class="p-tag">
                                        More than just a Data Room: Harnessing AI
                                        <br /> for Enhanced Information Intelligence.
                                    </p>
                                    <img
                                        src={process.env.PUBLIC_URL + 'assets/dashboard.png'}
                                        className="image-text"
                                        alt="Login Logo"
                                    />
                                    <div class="custom-container">
                                        <div class="custom-text">Register now</div>
                                        <div class="icon-container">
                                            <div class="icon">
                                                <svg
                                                    width="21"
                                                    height="18"
                                                    viewBox="0 0 21 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g clip-path="url(#clip0_1_27)">
                                                        <path
                                                            d="M20.3745 8.76528L12.5311 0.921875L11.5593 1.89366L17.7436 8.07802L0.391113 8.078V9.45232L17.7438 9.45234L11.5593 15.6369L12.5311 16.6087L20.3745 8.76528Z"
                                                            fill="white"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1_27">
                                                            <rect
                                                                width="20"
                                                                height="17"
                                                                fill="white"
                                                                transform="translate(0.382812 0.160156)"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>{" "}
                                </div>
                            </div>
                        </div>
                        <div class="login-container">
                            <div className="form-data">
                                <img src={process.env.PUBLIC_URL + 'assets/logo.png'} alt="Login Logo" />
                                <form>
                                    <div class="form-group label">
                                        Enter your one-time code from
                                        <br />
                                        authenticator app
                                    </div>
                                    <span className="label-text">
                                        This help Carta keep you account secure by verifying <br />
                                        it's you
                                    </span>
                                    <div class="form-group otp-input">
                                        <label for="password">6-digit code </label>
                                        <input type="password" className="otp" id="password" placeholder="00000" required />
                                    </div>

                                    <div class="checkbox-sign">
                                        <input
                                            type="checkbox"
                                            id="vehicle1"
                                            name="vehicle1"
                                            value="Bike"
                                        />
                                        <label for="vehicle1" className="label">
                                            {" "}
                                            Trust this device for 15 days
                                        </label>
                                    </div>
                                    <div class="text-share">
                                        Select only if device is not shared
                                    </div>
                                    <button type="submit" class="btn">
                                        Continue
                                    </button>
                                    <button type="submit" class="btn-white">
                                        Go back
                                    </button>
                                </form>
                                <div className="login-link">
                                    <span>Having problems?</span>
                                    <a href="#" className="try-option">
                                        Try other options
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TwoFactorAuth;
