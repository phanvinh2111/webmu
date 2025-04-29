import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrophy, 
  FaArrowLeft, 
  FaMedal, 
  FaUserCircle,
  FaRedoAlt
} from 'react-icons/fa';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/character/ranking');
        // Giới hạn 50 người đứng đầu
        setRanking(response.data.slice(0, 50));
      } catch (err) {
        setError('Error: ' + (err.response?.data?.error || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#718096'; // Default color
    }
  };

  const getRankDisplay = (index) => {
    if (index < 3) {
      return (
        <FaMedal 
          size={24} 
          color={getMedalColor(index + 1)} 
          className="rank-medal"
        />
      );
    }
    return <span className="rank-number">{index + 1}</span>;
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
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-white display-4 fw-bold mb-4" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            <FaTrophy className="me-3" />
            Bảng Xếp Hạng
          </h1>
          <p className="text-light lead">
            Top 50 nhân vật mạnh nhất
          </p>
        </div>

        {error ? (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        ) : (
          <div className="card bg-dark text-white shadow-lg" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px'
          }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr className="text-center" style={{ 
                      background: 'rgba(255, 255, 255, 0.1)'
                    }}>
                      <th style={{ padding: '1rem' }}>Hạng</th>
                      <th style={{ padding: '1rem' }}>Nhân vật</th>
                      <th style={{ padding: '1rem' }}>
                        <FaRedoAlt className="me-2" />
                        Số lần reset
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((char, index) => (
                      <tr 
                        key={char.Name}
                        className="text-center"
                        style={{
                          background: index < 3 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <td className="align-middle" style={{ padding: '1rem' }}>
                          {getRankDisplay(index)}
                        </td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center justify-content-center">
                            <FaUserCircle className="me-2" color={getMedalColor(index + 1)} />
                            {char.Name}
                          </div>
                        </td>
                        <td className="align-middle">
                          {char.Resets}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary px-4 py-2"
          >
            <FaArrowLeft className="me-2" />
            Quay lại Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .rank-medal {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .rank-number {
          font-size: 1.1rem;
          font-weight: bold;
          color: #718096;
        }

        .table {
          margin-bottom: 0;
        }

        .table th,
        .table td {
          border: none;
          vertical-align: middle;
        }

        .table tbody tr {
          cursor: pointer;
        }

        .table tbody tr:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .alert {
          background: rgba(220, 53, 69, 0.2);
          border: none;
          color: #ff8b8b;
        }

        @media (max-width: 768px) {
          .table {
            font-size: 0.9rem;
          }
          
          .rank-medal {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Ranking;
