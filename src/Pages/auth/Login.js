import React, { useState } from "react";
import axios from "axios";
import styles from "./auth.module.scss";
import loginImg from "../../assets/login.png";
import Card from "../../Components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Components/loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(""); // To store success or error messages
  const [isError, setIsError] = useState(false); // To track error or success

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setMessage("All fields are required.");
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);
      setMessage(""); // Clear previous messages
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        { email, password },
        { withCredentials: true } // Ensure cookies are sent/received
      );

      const { role } = response.data;

      setMessage("Login successful!");
      setIsError(false);

      // Redirect based on the user's role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "client") {
        navigate("/register-user-home");
      } else if (role === "ScheduledMeetings") {
        navigate("/admin/SheduleList");
      } else if (role === "KYC_Management") {
        navigate("/admin/compliance-management/kyc-management");
      } else if (role === "BRN_Tracking") {
        navigate("/admin/compliance-management/brn-tracking");
      } else if (role === "ComplianceDocumentation") {
        navigate("/admin/compliance-management/compliance-documentation");
      } else if (role === "RegulatoryMonitoring") {
        navigate("/admin/compliance-management/regulatory-monitoring");
      } else if (role === "Collecting") {
        navigate("/admin/document-management");
      } else if (role === "Screening") {
        navigate("/admin/document-management");
      } else if (role === "Processing") {
        navigate("/admin/document-management");
      } else if (role === "Done") {
        navigate("/admin/document-management");
      } else {
        setMessage("Unknown role. Please contact support.");
        setIsError(true);
      }
    } catch (error) {
      setMessage(
        error.response && error.response.data
          ? error.response.data.message
          : "Invalid email or password."
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={loginImg} alt="Login" width="400" />
        </div>

        <Card>
          <div className={styles.form}>
            <h2>Login</h2>

            {/* Display the success or error message */}
            {message && (
              <p className={isError ? styles.error : styles.success}>
                {message}
              </p>
            )}

            <form onSubmit={loginUser}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Login
              </button>
            </form>

            <span className={styles.register}>
              <p>Don't have an account?</p>
              <Link to="/register">Register</Link>
            </span>

            {/* Forgot Password link */}
            <div className={styles.forgotPassword}>
              <p>
                <Link to="/forgotpassword">Forgot your password?</Link>
              </p>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Login;
