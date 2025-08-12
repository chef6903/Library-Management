import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBook, getReviewsByBookId } from '../../services/bookService';
import { requestBorrowBook } from '../../services/borrowApiService';
import { getInventoryItemById } from '../../services/InventoryServicesApi';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BorrowModal from '../../components/BorrowModal';

const ViewBookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [available, setAvailable] = useState(0);
  const [quantity] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookData = await getBook(id);
        setBook(bookData);

        const inventoryData = await getInventoryItemById(id);
        setAvailable(inventoryData.available || 0);
      } catch (err) {
        setError("Không thể tải dữ liệu sách hoặc kho.");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviewsByBookId(id);
        setReviews(res.data);
      } catch (err) {
        console.error('Lỗi khi tải đánh giá:', err);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (error || success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error, success]);

  const handleModalConfirm = async ({ quantity, isReadOnSite, dueDate }) => {
    setLoading(true);
    try {
      await requestBorrowBook({
        bookId: book._id,
        isReadOnSite,
        dueDate,
        notes: `Trả trước ngày ${dueDate}`,
        quantity,
      });

      setSuccess(`Đã gửi yêu cầu mượn ${quantity} cuốn "${book.title}"`);
      setError("");
      setModalOpen(false);
    } catch (err) {
      const message = err.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu";
      setError(message);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const getSafeImage = (url) => {
    if (!url || url.startsWith("blob:")) {
      return "https://via.placeholder.com/200x300?text=No+Image";
    }

    if (url.startsWith('/images/book/')) {
      return `http://localhost:9999${url}`;
    }

    return url;
  };

  if (!book) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#efefef", paddingTop: "20px" }}>
      <Header />

      <main style={{ flex: 1, padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '30px', gap: '30px' }}>
          <img
            src={getSafeImage(book.image)}
            alt={book.title}
            style={{ width: "300px", height: "auto", borderRadius: "8px", objectFit: "cover", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
          />

          <div style={{ flex: 1 }}>
            <h2>{book.title}</h2>
            <p><strong>Tác giả:</strong> {book.author}</p>
            <p><strong>Thể loại:</strong> {Array.isArray(book.categories) ? book.categories.map(c => c.name).join(', ') : 'Không xác định'}</p>
            <p><strong>Mô tả:</strong> {book.description || 'Chưa có mô tả'}</p>
            <p><strong>Số lượng còn lại:</strong> {available}</p>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setModalOpen(true)}
                disabled={loading}
                style={{
                  padding: "10px 18px",
                  backgroundColor: loading ? "#95a5a6" : "#2c3e50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Đang gửi..." : "📚 Mượn sách"}
              </button>
            </div>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
          </div>
        </div>

        {/* Đánh giá */}
        <div style={{
          marginTop: '60px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>📖 Đánh giá từ người dùng</h3>
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào cho cuốn sách này.</p>
          ) : (
            <div style={{ marginTop: '10px' }}>
              {reviews.map((review) => (
                <div key={review._id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#fafafa',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{review.userId?.name || 'Ẩn danh'}</strong> ({review.userId?.studentId || 'N/A'})
                    </div>
                    <small style={{ color: '#888' }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>

                  <div style={{ marginTop: '6px' }}>
                    {[...Array(5)].map((_, index) => (
                      <span key={index} style={{ color: index < review.rating ? '#f1c40f' : '#ccc', fontSize: '18px' }}>
                        ★
                      </span>
                    ))}
                  </div>

                  <p style={{ marginTop: '10px', fontSize: '15px', lineHeight: '1.5', color: '#333' }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BorrowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        maxQuantity={available}
        defaultQuantity={quantity}
      />

      <Footer />
    </div>
  );
};

export default ViewBookDetail;
