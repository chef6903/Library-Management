import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { saveToken } from "../utils/auth";
import "../css/Login.css";
import Header from "./Header";
import Footer from "./Footer";
function Login() {
  const [email, setEmail, isActive] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng kiểm tra email của bạn.");
      return;
    }
    if (!password) {
      setError("Vui lòng kiểm tra mật khẩu của bạn.");
      return;
    }
    if (isActive === false) {
      setError("Tài khoản của bạn đã bị vô hiệu hóa.");
      return;
    }
    setLoading(true);
    try {
      const token = await loginUser(email, password);
      saveToken(token);
      navigate("/home");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-container">
          <h2>Vui lòng nhập thông tin tài khoản</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-4 text-center">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Đăng ký tại đây
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
