import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Đảm bảo import hàm registerUser từ services/api
import { registerUser } from "../services/api"; // Đã sửa từ loginUser
import { saveToken } from "../utils/auth";
import "../css/Login.css"; // Giữ nguyên CSS nếu bạn đang tái sử dụng styles
import Header from "./Header";
import Footer from "./Footer";

function RegisterPage() {
  // Đổi tên component từ Register thành RegisterPage
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // Đã sửa: bỏ isActive vì không cần thiết ở đây
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    // Đổi tên hàm từ handleLogin thành handleRegister
    e.preventDefault();
    setError(""); // Xóa lỗi cũ trước khi gửi yêu cầu mới

    // Kiểm tra thông tin đầu vào ở phía client
    if (!username || !email || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập, email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      // Gọi hàm registerUser từ services/api
      const response = await registerUser(username, email, password);

      // Kiểm tra phản hồi từ backend
      if (response.success) {
        saveToken(response.token); // Lưu token nếu đăng ký thành công và backend trả về token
        navigate("/home"); // Điều hướng đến trang chủ sau khi đăng ký thành công
      } else {
        // Xử lý trường hợp backend trả về success: false
        setError(
          response.message || "Đăng ký không thành công. Vui lòng thử lại."
        );
      }
    } catch (err) {
      // Xử lý lỗi từ Axios (lỗi mạng, lỗi server với status codes)
      console.error("Registration failed:", err);
      // Truy cập thông báo lỗi từ response.data nếu có
      setError(
        err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page" // Có thể đổi tên class CSS thành register-page cho rõ ràng
      style={{ background: "#efefef", padding: "20px 0" }}
    >
      <Header /> {/* Đảm bảo Header được render */}
      <div className="login-content">
        <div className="login-container">
          <h2>Đăng ký tài khoản mới</h2> {/* Cập nhật tiêu đề */}
          <form onSubmit={handleRegister} className="login-form">
            {" "}
            {/* Đã sửa: onSubmit gọi handleRegister */}
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email" // Đã sửa: type="email" cho validation tốt hơn
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email"
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
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký"}{" "}
              {/* Cập nhật text button */}
            </button>
          </form>
          <p className="mt-4 text-center">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
      <Footer /> {/* Đảm bảo Footer được render */}
    </div>
  );
}

export default RegisterPage;
