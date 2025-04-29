import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaCoins, 
  FaEdit, 
  FaSearch, 
  FaSave,
  FaRedo,
  FaStar,
  FaExclamationCircle,
  FaCheckCircle
} from 'react-icons/fa';

const AdminPanel = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    wcoin: 0,
    resets: 0,
    points: 0
  });

  // Fetch accounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Không có quyền truy cập');
      }

      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setEditData({
      wcoin: account.WCoin,
      resets: account.Resets,
      points: account.Points
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/accounts/${selectedAccount.memb___id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Cập nhật thất bại');
      }

      const updatedAccount = await response.json();
      setAccounts(accounts.map(acc => 
        acc.memb___id === selectedAccount.memb___id ? updatedAccount : acc
      ));
      setMessage('Cập nhật thành công!');
      setEditMode(false);
      setSelectedAccount(null);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.memb___id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2><FaUsers className="me-2" />Quản lý tài khoản</h2>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger">
          <FaExclamationCircle className="me-2" />
          {error}
        </div>
      ) : loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {message && (
            <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
              {message.includes('thành công') ? (
                <FaCheckCircle className="me-2" />
              ) : (
                <FaExclamationCircle className="me-2" />
              )}
              {message}
            </div>
          )}

          <div className="accounts-table">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Tài khoản</th>
                  <th>WCoin</th>
                  <th>Resets</th>
                  <th>Points</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account.memb___id}>
                    <td>{account.memb___id}</td>
                    <td>
                      {selectedAccount?.memb___id === account.memb___id && editMode ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editData.wcoin}
                          onChange={(e) => setEditData({...editData, wcoin: parseInt(e.target.value)})}
                        />
                      ) : (
                        <span className="text-warning">
                          <FaCoins className="me-1" />
                          {account.WCoin.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td>
                      {selectedAccount?.memb___id === account.memb___id && editMode ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editData.resets}
                          onChange={(e) => setEditData({...editData, resets: parseInt(e.target.value)})}
                        />
                      ) : (
                        <span className="text-info">
                          <FaRedo className="me-1" />
                          {account.Resets}
                        </span>
                      )}
                    </td>
                    <td>
                      {selectedAccount?.memb___id === account.memb___id && editMode ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editData.points}
                          onChange={(e) => setEditData({...editData, points: parseInt(e.target.value)})}
                        />
                      ) : (
                        <span className="text-success">
                          <FaStar className="me-1" />
                          {account.Points}
                        </span>
                      )}
                    </td>
                    <td>
                      {selectedAccount?.memb___id === account.memb___id && editMode ? (
                        <button 
                          className="btn btn-success btn-sm me-2"
                          onClick={handleSave}
                        >
                          <FaSave className="me-1" />
                          Lưu
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(account)}
                        >
                          <FaEdit className="me-1" />
                          Sửa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style jsx>{`
        .admin-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .search-box {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.5);
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: white;
        }

        .search-box input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.15);
        }

        .accounts-table {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
        }

        .table {
          margin-bottom: 0;
        }

        .table th {
          background: rgba(255, 255, 255, 0.1);
          border: none;
        }

        .table td {
          border: none;
          vertical-align: middle;
        }

        .form-control {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
        }

        .form-control:focus {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          box-shadow: none;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
