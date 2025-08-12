import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { saveToken } from "../utils/auth";
import "../css/Login.css";
import Header from "./Header";
import Footer from "./Footer";
function Login() {
  const [username, setUsername, isActive] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) {
      setError("Vui lòng kiểm tra tên đăng nhập của bạn.");
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
      const token = await loginUser(username, password);
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
              <label htmlFor="username">Mã số sinh viên</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
