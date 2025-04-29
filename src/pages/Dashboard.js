import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaCoins, 
  FaGem, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaTrophy,
  FaRedo,
  FaGamepad,
  FaExclamationCircle
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [characterInfo, setCharacterInfo] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }
    fetchData(token);
  }, [navigate]);

  useEffect(() => {
    if (!selectedCharacter) return;
    const token = localStorage.getItem('authToken');
    fetchCharacterInfo(token);
  }, [selectedCharacter]);

  const fetchData = async (token) => {
    try {
      setIsLoading(true);
      const [userResponse, charResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/user/info', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/auth/user/characters', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUser(userResponse.data);
      setCharacters(charResponse.data);
      
      if (charResponse.data.length > 0) {
        setSelectedCharacter(charResponse.data[0].Name);
      }
    } catch (err) {
      setError('Failed to load data: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCharacterInfo = async (token) => {
    try {
      setMessage('');
      setError('');
      const response = await axios.get(`http://localhost:5000/api/character/${selectedCharacter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCharacterInfo(response.data);
    } catch (err) {
      setError('Failed to load character info: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleResetMasterLevel = async () => {
    const token = localStorage.getItem('authToken');
    try {
      setMessage('');
      setError('');
      const response = await axios.post(
        `http://localhost:5000/api/character/${selectedCharacter}/reset-master`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setCharacterInfo({ ...characterInfo, SCFMasterLevel: 0 });
    } catch (err) {
      setError('Failed to reset MasterLevel: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-white display-4 fw-bold mb-4" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            <FaUser className="me-3" />
            Thông tin tài khoản
          </h1>
        </div>

        {/* User Stats Grid */}
        <div className="card bg-dark text-white shadow-lg mb-5" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px'
        }}>
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3">
                  <FaCoins className="mb-2 text-warning" style={{ fontSize: '24px' }} />
                  <h5 className="text-white-50">WCoin</h5>
                  <h3 className="text-white">{user.WCoin}</h3>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3">
                  <FaGem className="mb-2 text-info" style={{ fontSize: '24px' }} />
                  <h5 className="text-white-50">Bless</h5>
                  <h3 className="text-white">{user.BlessBank}</h3>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3">
                  <FaGem className="mb-2 text-danger" style={{ fontSize: '24px' }} />
                  <h5 className="text-white-50">Soul</h5>
                  <h3 className="text-white">{user.SoulBank}</h3>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="stat-card p-3">
                  <FaGem className="mb-2 text-success" style={{ fontSize: '24px' }} />
                  <h5 className="text-white-50">Life</h5>
                  <h3 className="text-white">{user.LifeBank}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Character Section */}
        <div className="card bg-dark text-white shadow-lg mb-5" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px'
        }}>
          <div className="card-body p-4">
            <h3 className="mb-4">
              <FaGamepad className="me-2" />
              Nhân vật
            </h3>
            
            {characters.length > 0 ? (
              <>
                <select
                  className="form-select character-select mb-4"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                >
                  {characters.map((char) => (
                    <option key={char.Name} value={char.Name}>
                      {char.Name}
                    </option>
                  ))}
                </select>

                {characterInfo && (
                  <div className="character-info p-4">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <div className="info-card p-3">
                          <h5 className="text-white-50">Cấp độ</h5>
                          <h3 className="text-white">{characterInfo.cLevel}</h3>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="info-card p-3">
                          <h5 className="text-white-50">Lớp nhân vật</h5>
                          <h3 className="character-class">{characterInfo.Class}</h3>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="info-card p-3">
                          <h5 className="text-white-50">Master Level</h5>
                          <h3 className="text-white">{characterInfo.SCFMasterLevel}</h3>
                        </div>
                      </div>
                    </div>

                    

                    {message && (
                      <div className="alert alert-success mt-3">
                        {message}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p>Không tìm thấy nhân vật</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button
            onClick={() => navigate('/ranking')}
            className="btn btn-primary me-3"
          >
            <FaTrophy className="me-2" />
            Xem xếp hạng
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            <FaSignOutAlt className="me-2" />
            Đăng xuất
          </button>
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
        }

        .character-select {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #FFD700;
          padding: 12px;
          font-weight: 600;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .character-select:focus {
          box-shadow: none;
          border-color: rgba(255, 215, 0, 0.5);
          background: rgba(255, 255, 255, 0.15);
        }

        .character-select option {
          background: #1a1a2e;
          color: #FFD700;
        }

        .character-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.08);
        }

        .character-class {
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .reset-btn {
          transition: all 0.3s ease;
          background: linear-gradient(45deg, #dc3545, #ff5c6c);
          border: none;
          padding: 10px 20px;
        }

        .reset-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }

        .btn {
          padding: 10px 20px;
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .btn-primary {
          background: linear-gradient(45deg, #4a90e2, #67b26f);
          border: none;
        }

        .alert {
          background: rgba(255, 255, 255, 0.1);
          border: none;
        }

        .alert-success {
          background: rgba(40, 167, 69, 0.2);
          color: #98ff98;
        }

        .alert-danger {
          background: rgba(220, 53, 69, 0.2);
          color: #ff8b8b;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
          }
          to {
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
