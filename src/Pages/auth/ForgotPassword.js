import React, { useState } from "react";
import axios from "axios";
import styles from "./auth.module.scss";
import { Link } from "react-router-dom";
import forgotImg from "../../assets/register.png"; // Optional: Add an image for styling
import Card from "../../Components/card/Card";
import Loader from "../../Components/loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const initialState = {
  email: "",
};

const ForgotPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const { email } = formData;
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!email) {
      return toast.error("Please enter your email address");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = { email };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/forgotpassword`,
        userData,
        { withCredentials: true }
      );
      toast.success("Password reset link sent to your email!");
      navigate("/login"); // Redirect to login page after the email is sent
    } catch (error) {
      toast.error(
        error.response && error.response.data
          ? error.response.data.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <Card>
          <div className={styles.form}>
            <h2>Forgot Password</h2>

            <form onSubmit={forgotPasswordHandler}>
              <input
                type="text"
                placeholder="Enter your email"
                required
                name="email"
                value={email}
                onChange={handleInputChange}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Send Reset Link
              </button>
            </form>

            <span className={styles.register}>
              <p>Remembered your password?</p>
              <Link to="/login">Login</Link>
            </span>
          </div>
        </Card>
        <div className={styles.img}>
          <img src={forgotImg} alt="Forgot Password" width="400" />
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
