import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../auth/auth.module.scss";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../../assets/register.png";
import Card from "../../Components/card/Card";
import Loader from "../../Components/loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  name: "",
  email: "",
  password: "",
  cPassword: "",
  role: "",
};

const UserRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const { name, email, password, cPassword, role } = formData;
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]); // State to store roles

  const navigate = useNavigate();

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/role`,
          { withCredentials: true }
        );
        setRoles(response.data.data || []); // Ensure roles is always an array
      } catch (error) {
        toast.error("Failed to fetch roles. Please try again.");
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !cPassword || !role) {
      return toast.error("All fields are required");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== cPassword) {
      return toast.error("Passwords do not match");
    }

    const userData = { name, email, password, role };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        userData,
        { withCredentials: true }
      );
      toast.success("Registration successful! Redirecting to login...");
      navigate("/login");
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
            <h2>Register</h2>

            <form onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                name="cPassword"
                value={cPassword}
                onChange={handleInputChange}
              />
              {/* Role Dropdown */}
              <select
                name="role"
                value={role}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Select Role</option>
                {roles.length === 0 ? (
                  <option>Loading roles...</option>
                ) : (
                  roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
              <button type="submit" className="--btn --btn-primary --btn-block">
                Register
              </button>
            </form>

            <span className={styles.register}>
              <p>Already have an account?</p>
              <Link to="/login">Login</Link>
            </span>
          </div>
        </Card>
        <div className={styles.img}>
          <img src={registerImg} alt="Register" width="400" />
        </div>
      </section>
    </>
  );
};

export default UserRegister;
