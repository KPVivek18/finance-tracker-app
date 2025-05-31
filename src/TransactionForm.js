import React, { useState } from 'react';

const TransactionForm = () => {
  const [form, setForm] = useState({
    userId: '',
    transactionId: '',
    amount: '',
    category: '',
    type: '',
    date: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting form data:', form);
      
      const response = await fetch('https://9r48gzg0o6.execute-api.us-east-2.amazonaws.com/DEV/add-transaction', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
  
      if (response.ok) {
        alert('Transaction added successfully!');
        // Reset form
        setForm({
          userId: '',
          transactionId: '',
          amount: '',
          category: '',
          type: '',
          date: '',
          description: '',
        });
      } else {
        alert('Error: ' + (data.error || 'Failed to add transaction'));
      }
    } catch (error) {
      console.error('Full error:', error);
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Transaction</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          name="userId" 
          placeholder="User ID" 
          value={form.userId} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <input 
          name="transactionId" 
          placeholder="Transaction ID" 
          value={form.transactionId} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <input 
          name="amount" 
          type="number" 
          step="0.01"
          placeholder="Amount" 
          value={form.amount} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <input 
          name="category" 
          placeholder="Category (e.g., Food, Transport)" 
          value={form.category} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <select 
          name="type" 
          value={form.type} 
          onChange={handleChange} 
          required
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        >
          <option value="">Select Type</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input 
          name="date" 
          type="date" 
          value={form.date} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <input 
          name="description" 
          placeholder="Description" 
          value={form.description} 
          onChange={handleChange} 
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Adding Transaction...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;