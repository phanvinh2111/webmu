import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaNewspaper, 
  FaUserCircle, 
  FaCalendarAlt, 
  FaArrowRight, 
  FaLock, 
  FaKey,
  FaExclamationCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  
  // States
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeForm, setActiveForm] = useState(null);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [loginForm, setLoginForm] = useState({
    memb___id: '',
    memb__pwd: ''
  });
  const [registerForm, setRegisterForm] = useState({
    memb___id: '',
    memb__pwd: '',
    sno__numb: ''
  });
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch news on mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Fetch news function
  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNews(response.data);
    } catch (err) {
      setNewsError('Không tải được tin tức: ' + (err.response?.data?.error || err.message));
      console.error('Lỗi tải tin tức:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Form handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setLoginMessage('');

      if (!loginForm.memb___id || !loginForm.memb__pwd) {
        throw new Error('Vui lòng điền đầy đủ thông tin đăng nhập');
      }

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        memb___id: loginForm.memb___id.trim(),
        memb__pwd: loginForm.memb__pwd.trim()
      });

      setLoginMessage('Đăng nhập thành công! Đang chuyển hướng...');
      localStorage.setItem('authToken', response.data.token);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setLoginMessage('Lỗi: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setRegisterMessage('');

      if (!registerForm.memb___id || !registerForm.memb__pwd || !registerForm.sno__numb) {
        throw new Error('Vui lòng điền đầy đủ thông tin đăng ký');
      }

      const response = await axios.post('http://localhost:5000/api/auth/register', {
        memb___id: registerForm.memb___id.trim(),
        memb__pwd: registerForm.memb__pwd.trim(),
        sno__numb: registerForm.sno__numb.trim()
      });

      setRegisterMessage('Đăng ký thành công! Vui lòng đăng nhập...');
      
      setTimeout(() => {
        setRegisterForm({ memb___id: '', memb__pwd: '', sno__numb: '' });
        setActiveForm('login');
      }, 1500);

    } catch (err) {
      setRegisterMessage('Lỗi: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle news content
  const toggleNewsContent = (newsId) => {
    if (selectedNewsId === newsId) {
      setSelectedNewsId(null);
    } else {
      setSelectedNewsId(newsId);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="text-white display-4 fw-bold mb-4" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Chào mừng đến với MU Online VN
          </h1>
          <p className="text-light lead mb-4">
            Khám phá thế giới game huyền thoại với cộng đồng MU Online Việt Nam
          </p>
        </div>

        {/* Auth Section */}
        <div className="auth-section mb-5">
          <div className="auth-buttons text-center mb-4">
            <button 
              className={`btn btn-lg mx-2 ${activeForm === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveForm('login')}
            >
              Đăng nhập
            </button>
            <button 
              className={`btn btn-lg mx-2 ${activeForm === 'register' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setActiveForm('register')}
            >
              Đăng ký
            </button>
          </div>

          {activeForm === 'login' && (
            <div className="auth-form-container">
              <div className="auth-form">
                {loginMessage && (
                  <div className={`alert ${loginMessage.includes('Lỗi') ? 'alert-danger' : 'alert-success'}`}>
                    {loginMessage.includes('Lỗi') && <FaExclamationCircle className="me-2" />}
                    {loginMessage}
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="form-group mb-3">
                    <div className="input-wrapper">
                      <FaUserCircle className="input-icon" />
                      <input
                        type="text"
                        name="memb___id"
                        className="form-control"
                        placeholder="Tên tài khoản"
                        value={loginForm.memb___id}
                        onChange={handleLoginChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <div className="input-wrapper">
                      <FaLock className="input-icon" />
                      <input
                        type="password"
                        name="memb__pwd"
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={loginForm.memb__pwd}
                        onChange={handleLoginChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    Đăng nhập
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeForm === 'register' && (
            <div className="auth-form-container">
              <div className="auth-form">
                {registerMessage && (
                  <div className={`alert ${registerMessage.includes('Lỗi') ? 'alert-danger' : 'alert-success'}`}>
                    {registerMessage.includes('Lỗi') && <FaExclamationCircle className="me-2" />}
                    {registerMessage}
                  </div>
                )}
                <form onSubmit={handleRegister}>
                  <div className="form-group mb-3">
                    <div className="input-wrapper">
                      <FaUserCircle className="input-icon" />
                      <input
                        type="text"
                        name="memb___id"
                        className="form-control"
                        placeholder="Tên tài khoản"
                        value={registerForm.memb___id}
                        onChange={handleRegisterChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <div className="input-wrapper">
                      <FaLock className="input-icon" />
                      <input
                        type="password"
                        name="memb__pwd"
                        className="form-control"
                        placeholder="Mật khẩu"
                        value={registerForm.memb__pwd}
                        onChange={handleRegisterChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <div className="input-wrapper">
                      <FaKey className="input-icon" />
                      <input
                        type="text"
                        name="sno__numb"
                        className="form-control"
                        placeholder="Mã số bí mật"
                        value={registerForm.sno__numb}
                        onChange={handleRegisterChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-success w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    Đăng ký
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* News Section */}
        <div className="mb-4">
          <h2 className="text-white text-center mb-4 d-flex align-items-center justify-content-center">
            <FaNewspaper className="me-2" /> Tin tức MU Online
          </h2>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : newsError ? (
            <div className="alert alert-danger text-center">{newsError}</div>
          ) : news.length > 0 ? (
            <div className="news-list">
              {news.map((item) => (
                <div key={item.Id} className="news-item">
                  <div 
                    className="news-header"
                    onClick={() => toggleNewsContent(item.Id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="news-title">
                        {item.Title}
                      </h5>
                      <div className="d-flex align-items-center">
                        <small className="news-date me-3">
                          {new Date(item.CreatedAt).toLocaleDateString('vi-VN')}
                        </small>
                        {selectedNewsId === item.Id ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>
                  {selectedNewsId === item.Id && (
                    <div className="news-content">
                      <p>{item.Content}</p>
                      <div className="news-meta">
                        <small>
                          <FaUserCircle className="me-1" />
                          {item.Author}
                        </small>
                        <small>
                          <FaCalendarAlt className="me-1" />
                          {new Date(item.CreatedAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-light text-center py-4">Không có tin tức</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-section {
          max-width: 500px;
          margin: 0 auto;
        }

        .auth-form-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        .auth-form {
          max-width: 400px;
          margin: 0 auto;
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
        }

        .form-control {
          padding-left: 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          box-shadow: none;
        }

        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .btn-outline-primary,
        .btn-outline-success {
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }

        .btn-outline-primary:hover,
        .btn-outline-success:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .news-list {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 1rem;
        }

        .news-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .news-item:last-child {
          border-bottom: none;
        }

        .news-header {
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .news-header:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .news-title {
          color: #4a90e2; /* Màu xanh cho tiêu đề */
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .news-date {
          color: rgba(255, 255, 255, 0.6);
        }

        .news-content {
          padding: 1rem;
          padding-top: 0;
          background: rgba(255, 255, 255, 0.05);
          animation: fadeIn 0.3s ease;
        }

        .news-content p {
          color: rgba(255, 255, 255, 0.9); /* Màu trắng nhạt cho nội dung */
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .news-meta {
          display: flex;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .alert {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
        }

        .alert-danger {
          background: rgba(220, 53, 69, 0.2);
        }

        .alert-success {
          background: rgba(40, 167, 69, 0.2);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
