import React, { useState, useEffect } from "react";
import { checkUserAuth, getToken } from "../utils/auth";

const BorrowModal = ({ open, onClose, onConfirm, maxQuantity }) => {
  const [quantity, setQuantity] = useState(1);
  const [isReadOnSite, setIsReadOnSite] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  // Tự động gán ngày hôm nay nếu chọn "Đọc tại chỗ"
  useEffect(() => {
    if (isReadOnSite) {
      const today = new Date().toISOString().split("T")[0];
      setDueDate(today);
    }
  }, [isReadOnSite]);

  const handleSubmit = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const oneMonthLater = new Date();
    const token = getToken();
    const auth = checkUserAuth(token);
    if (auth.error) {
      alert(auth.error); // 🔔 Thông báo cho user
      // hoặc navigate("/login");
      return;
    }
    oneMonthLater.setMonth(now.getMonth() + 1);

    if (!dueDate) return setError("Vui lòng chọn ngày trả.");
    if (isNaN(due.getTime())) return setError("Ngày trả không hợp lệ.");

    if (!isReadOnSite) {
      if (due < new Date(now.setHours(0, 0, 0, 0)))
        return setError("Ngày trả không được trước ngày hiện tại.");
      if (due > oneMonthLater)
        return setError("Chỉ được mượn tối đa trong vòng 1 tháng.");
    } else {
      // Phải là ngày hôm nay
      const todayStr = new Date().toISOString().split("T")[0];
      if (dueDate !== todayStr)
        return setError("Ngày đọc tại chỗ phải là ngày hôm nay.");
    }

    if (quantity < 1 || quantity > maxQuantity)
      return setError(`Số lượng mượn phải từ 1 đến ${maxQuantity}`);

    setError("");
    onConfirm({
      quantity: Number(quantity),
      isReadOnSite,
      dueDate: new Date(dueDate).toISOString(),
    });
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Thông tin mượn sách</h3>

        <label>Số lượng:</label>
        <input
          type="number"
          value={quantity}
          min={1}
          max={maxQuantity}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          style={styles.input}
        />

        <label>Hình thức mượn:</label>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="radio"
              name="borrowType"
              value="take-home"
              checked={!isReadOnSite}
              onChange={() => setIsReadOnSite(false)}
            />{" "}
            Mang về
          </label>{" "}
          <label>
            <input
              type="radio"
              name="borrowType"
              value="read-onsite"
              checked={isReadOnSite}
              onChange={() => setIsReadOnSite(true)}
            />{" "}
            Đọc tại chỗ
          </label>
        </div>

        <label>Ngày trả:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
          readOnly={isReadOnSite}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginTop: "16px" }}>
          <button onClick={handleSubmit} style={styles.button}>
            Xác nhận
          </button>
          <button
            onClick={onClose}
            style={{ ...styles.button, backgroundColor: "#ccc" }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "4px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 16px",
    marginRight: "10px",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default BorrowModal;
