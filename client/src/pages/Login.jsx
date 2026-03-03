import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import axios from "axios";
import { login as loginApi } from "../api/auth";

export default function Login() {
  const [loginView, setLoginView] = useState(true);
  const [zoomDirection, setZoomDirection] = useState("out");

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "hacker",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* =========================
     LOGIN
  ========================= */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginApi(
        signInForm.email,
        signInForm.password
      );

      const { token, user } = res.data;

      // STORE EVERYTHING PROPERLY
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.name || user.email);

      if (user.role === "hacker") {
        navigate("/hacker", { replace: true });
      } else {
        navigate("/company", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Invalid credentials"
      );
    }
  };

  /* =========================
     REGISTER
  ========================= */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        signUpForm
      );

      const { token, user } = res.data;

      // STORE EVERYTHING PROPERLY
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.name || user.email);

      if (user.role === "company") {
        navigate("/company", { replace: true });
      } else {
        navigate("/hacker", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Registration failed"
      );
    }
  };

  const handleToggle = () => {
    setError("");

    if (loginView) {
      setZoomDirection("in");
      setLoginView(false);
    } else {
      setZoomDirection("out");
      setLoginView(true);
    }
  };

  return (
    <div className={`login zoom-${zoomDirection}`}>
      {/* SLIDING PANEL */}
      <div
        className={`login__colored-container ${
          loginView
            ? "login__colored-container--left"
            : "login__colored-container--right"
        }`}
      />

      {/* LEFT PANEL */}
      <div className="login__welcome-back">
        <div className="login__welcome-back__main-container">
          <div className="login__welcome-back__main-container__text-container">
            <span>
              {loginView
                ? "Welcome Back"
                : "Access Portal"}
            </span>
            <span>
              {loginView
                ? "Login to continue"
                : "Create your account"}
            </span>
          </div>

          <div
            className="login__welcome-back__main-container__button-container"
            onClick={handleToggle}
          >
            {loginView
              ? "Create Account"
              : "Back to Login"}
          </div>
        </div>
      </div>

      {/* CREATE ACCOUNT */}
      <div
        className={`login__create-container ${
          loginView
            ? "login__create-container--inactive"
            : "login__create-container--active"
        }`}
      >
        <h2>Create Account</h2>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <form onSubmit={handleSignUp}>
          <input
            placeholder="Full Name"
            value={signUpForm.name}
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            value={signUpForm.email}
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Password"
            type="password"
            value={signUpForm.password}
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                password: e.target.value,
              })
            }
          />

          <select
            value={signUpForm.role}
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                role: e.target.value,
              })
            }
          >
            <option value="hacker">Hacker</option>
            <option value="company">Company</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* LOGIN */}
      <div
        className={`login__login-container ${
          loginView
            ? "login__login-container--active"
            : "login__login-container--inactive"
        }`}
      >
        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <form onSubmit={handleSignIn}>
          <input
            placeholder="Email"
            value={signInForm.email}
            onChange={(e) =>
              setSignInForm({
                ...signInForm,
                email: e.target.value,
              })
            }
          />

          <input
            placeholder="Password"
            type="password"
            value={signInForm.password}
            onChange={(e) =>
              setSignInForm({
                ...signInForm,
                password: e.target.value,
              })
            }
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}