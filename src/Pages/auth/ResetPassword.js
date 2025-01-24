import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./auth.module.scss"; // Assuming this is for custom styles
import Loader from "../../Components/loader/Loader";
import resetImg from "../../assets/register.png"; // Optional: Add an image for styling

const ResetPassword = () => {
  const { resetToken } = useParams(); // Get the resetToken from the URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(""); // For success/error messages
  const [isError, setIsError] = useState(false); // For success/error indication

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    // Password length validation
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);
      setMessage(""); // Clear previous messages
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/resetpassword/${resetToken}`,
        { password: newPassword }
      );
      setMessage(response.data.message);
      setIsError(false);
      toast.success(response.data.message);
      navigate("/login"); // Redirect to login page after successful password reset
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : "Something went wrong"
      );
      setIsError(true);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <div className={styles.img}>
        <img src={resetImg} alt="Reset Password" width="400" />
      </div>

      <div className={styles.form}>
        <h2 className={styles.heading}>Reset Your Password</h2>

        {/* Display success or error message */}
        {message && (
          <p className={isError ? styles.error : styles.success}>{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
