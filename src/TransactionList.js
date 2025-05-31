import React, { useState } from 'react';
import Dashboard from './Dashboard';

const API_BASE = "https://9r48gzg0o6.execute-api.us-east-2.amazonaws.com/DEV";

const TransactionList = () => {
  const [userId, setUserId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter/search/sort state
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    transactionId: '',
    amount: '',
    category: '',
    type: '',
    date: '',
    description: ''
  });

  const fetchTransactions = async () => {
    if (!userId) {
      alert('Please enter a User ID.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/get-transactions?userId=${encodeURIComponent(userId)}`
      );
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      alert('Failed to fetch transactions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE handler
  const handleDelete = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const response = await fetch(`${API_BASE}/delete-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, transactionId })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Transaction deleted!');
        fetchTransactions();
      } else {
        alert('Error: ' + (data.error || 'Failed to delete'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  // Edit Modal logic
  const openEditModal = (tx) => {
    setEditForm({
      transactionId: tx.TransactionID,
      amount: tx.amount,
      category: tx.category,
      type: tx.type,
      date: tx.date,
      description: tx.description
    });
    setEditModalOpen(true);
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/update-transaction`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          transactionId: editForm.transactionId,
          amount: editForm.amount,
          category: editForm.category,
          type: editForm.type,
          date: editForm.date,
          description: editForm.description
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Transaction updated!');
        setEditModalOpen(false);
        fetchTransactions();
      } else {
        alert('Error: ' + (data.error || 'Failed to update'));
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter, search and sort transactions
  const filteredSortedTransactions = transactions
    .filter(tx => {
      // Search text in category or description
      if (searchText) {
        const search = searchText.toLowerCase();
        if (
          !(tx.category && tx.category.toLowerCase().includes(search)) &&
          !(tx.description && tx.description.toLowerCase().includes(search))
        ) {
          return false;
        }
      }
      // Filter by type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Filter by date range
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      // For amount, ensure numeric sort
      if (sortConfig.key === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>View Transactions</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          style={{ padding: 8, fontSize: 14, flex: 1 }}
        />
        <button
          onClick={fetchTransactions}
          disabled={loading || !userId}
          style={{
            padding: '8px 16px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>

      {/* Filter, search controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search category/description..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 2, padding: 6, fontSize: 14 }}
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ flex: 1, padding: 6, fontSize: 14 }}
        >
          <option value="all">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={{ flex: 1, padding: 6, fontSize: 14 }}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          style={{ flex: 1, padding: 6, fontSize: 14 }}
        />
      </div>

      {/* === DASHBOARD ADDED HERE === */}
      <Dashboard transactions={filteredSortedTransactions} />

      {/* Transactions Table */}
      {filteredSortedTransactions.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('TransactionID')} style={{ cursor: 'pointer' }}>Transaction ID</th>
              <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>Amount</th>
              <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Category</th>
              <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>Type</th>
              <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredSortedTransactions.map(tx => (
              <tr key={tx.TransactionID}>
                <td>{tx.TransactionID}</td>
                <td>{tx.amount}</td>
                <td>{tx.category}</td>
                <td>{tx.type}</td>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>
                  <button
                    style={{
                      background: '#ffa600',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => openEditModal(tx)}
                  >Edit</button>
                </td>
                <td>
                  <button
                    style={{
                      background: '#dc3545', color: 'white', border: 'none',
                      borderRadius: 4, padding: '6px 12px', cursor: 'pointer'
                    }}
                    onClick={() => handleDelete(tx.TransactionID)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ marginTop: 20, color: '#555' }}>
          {loading ? '' : 'No transactions to display.'}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div style={{
          position: 'fixed',
          left: 0, top: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <form
            onSubmit={handleEditSubmit}
            style={{
              background: 'white', padding: 30, borderRadius: 8, minWidth: 350,
              display: 'flex', flexDirection: 'column', gap: 14
            }}
          >
            <h3>Edit Transaction</h3>
            <label>
              Amount:
              <input
                name="amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={handleEditChange}
                required
                style={{ marginLeft: 5, padding: 8, fontSize: 14 }}
              />
            </label>
            <label>
              Category:
              <input
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                required
                style={{ marginLeft: 5, padding: 8, fontSize: 14 }}
              />
            </label>
            <label>
              Type:
              <select
                name="type"
                value={editForm.type}
                onChange={handleEditChange}
                required
                style={{ marginLeft: 5, padding: 8, fontSize: 14 }}
              >
                <option value="">Select Type</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <label>
              Date:
              <input
                name="date"
                type="date"
                value={editForm.date}
                onChange={handleEditChange}
                required
                style={{ marginLeft: 5, padding: 8, fontSize: 14 }}
              />
            </label>
            <label>
              Description:
              <input
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                style={{ marginLeft: 5, padding: 8, fontSize: 14 }}
              />
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                style={{
                  background: '#999', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 'bold'
                }}
              >Cancel</button>
              <button
                type="submit"
                style={{
                  background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 'bold'
                }}
              >Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
