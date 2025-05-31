import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to export array of objects as CSV file
function exportToCsv(transactions) {
  if (!transactions.length) return;
  const keys = Object.keys(transactions[0]);
  const csvRows = [
    keys.join(','),
    ...transactions.map(row => keys.map(k => `"${String(row[k]).replace(/"/g, '""')}"`).join(','))
  ];
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#FFBB28', '#ff6666', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb'];

export default function Dashboard({ transactions }) {
  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Pie chart: expense by category
  const expenseData = Object.values(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((catMap, t) => {
        catMap[t.category] = catMap[t.category] || { name: t.category, value: 0 };
        catMap[t.category].value += Number(t.amount);
        return catMap;
      }, {})
  );

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', margin: '24px 0', padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Analytics & Export</h2>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 18, marginBottom: 6 }}><b>Total Income:</b> <span style={{ color: '#18b88e' }}>${totalIncome}</span></div>
          <div style={{ fontSize: 18, marginBottom: 6 }}><b>Total Expense:</b> <span style={{ color: '#ff8859' }}>${totalExpense}</span></div>
          <div style={{ fontSize: 18 }}><b>Balance:</b> <span style={{ color: '#2fbd4f' }}>${balance}</span></div>
          <button
            style={{
              marginTop: 20, background: '#007bff', color: 'white', border: 'none',
              borderRadius: 4, padding: '10px 22px', fontWeight: 'bold', cursor: 'pointer'
            }}
            onClick={() => exportToCsv(transactions)}
          >
            Export as CSV
          </button>
        </div>
        <div style={{ minWidth: 320, width: 340, height: 280 }}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                label={({ name, value }) => `${name} ($${value})`}
              >
                {expenseData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `$${v}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 4 }}>
            Expense breakdown by category
          </div>
        </div>
      </div>
    </div>
  );
}
