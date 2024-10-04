import React, { useState } from 'react';
import { Chart } from 'react-google-charts';
import Sidebar from './components/Sidebar';

const AnalyticsPage = () => {
  const [records, setRecords] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [view, setView] = useState('monthly'); // Toggle state for period view
  const [newRecord, setNewRecord] = useState({ type: 'income', amount: '' });

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(newRecord.amount);
    if (!isNaN(amount) && amount > 0) {
      const record = { type: newRecord.type, amount, date: new Date() };
      setRecords((prevRecords) => [...prevRecords, record]);

      if (newRecord.type === 'income') {
        setIncome((prevIncome) => prevIncome + amount);
      } else {
        setExpenses((prevExpenses) => prevExpenses + amount);
      }

      setNewRecord({ type: 'income', amount: '' });
    }
  };

  const calculateWeeklyData = () => {
    const weeklyData = Array(4).fill(0).map(() => [0, 0]);
    records.forEach((record) => {
      const weekIndex = Math.floor((new Date() - new Date(record.date)) / (7 * 24 * 60 * 60 * 1000));
      if (weekIndex < 4) {
        if (record.type === 'income') {
          weeklyData[weekIndex][0] += record.amount;
        } else {
          weeklyData[weekIndex][1] += record.amount;
        }
      }
    });
    return [['Week', 'Income', 'Expenses'], ...weeklyData.map((data, index) => [`Week ₹{index + 1}`, ...data])];
  };

  const calculateMonthlyData = () => {
    const monthlyData = Array(4).fill(0).map(() => [0, 0]);
    const currentMonth = new Date().getMonth();
    records.forEach((record) => {
      const recordMonth = new Date(record.date).getMonth();
      if (currentMonth - recordMonth < 4 && currentMonth - recordMonth >= 0) {
        const monthIndex = currentMonth - recordMonth;
        if (record.type === 'income') {
          monthlyData[monthIndex][0] += record.amount;
        } else {
          monthlyData[monthIndex][1] += record.amount;
        }
      }
    });
    return [['Month', 'Income', 'Expenses'], ...monthlyData.map((data, index) => [`Month ₹{currentMonth - index + 1}`, ...data])];
  };

  const calculateYearlyData = () => {
    const yearlyData = Array(3).fill(0).map(() => [0, 0]);
    const currentYear = new Date().getFullYear();
    records.forEach((record) => {
      const recordYear = new Date(record.date).getFullYear();
      if (currentYear - recordYear < 3 && currentYear - recordYear >= 0) {
        const yearIndex = currentYear - recordYear;
        if (record.type === 'income') {
          yearlyData[yearIndex][0] += record.amount;
        } else {
          yearlyData[yearIndex][1] += record.amount;
        }
      }
    });
    return [['Year', 'Income', 'Expenses'], ...yearlyData.map((data, index) => [`₹{currentYear - index}`, ...data])];
  };

  const data = [
    ['Category', 'Amount'],
    ['Income', income],
    ['Expenses', expenses],
  ];

  const pieOptions = {
    title: 'Income vs Expenses',
    pieHole: 0.4,
    slices: {
      0: { color: '#2e7d32' }, // Dark green
      1: { color: '#c62828' }, // Dark red
    },
    legend: { position: 'bottom' },
    chartArea: { width: '90%', height: '80%' },
  };

  const barOptions = {
    title: 'Income and Expenses',
    chartArea: { width: '60%' },
    hAxis: {
      title: view === 'weekly' ? 'Week' : view === 'monthly' ? 'Month' : 'Year',
      minValue: 0,
    },
    vAxis: {
      title: 'Amount',
    },
    legend: { position: 'bottom' },
  };

  const toggleView = (period) => {
    setView(period);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-4">Analytics Dashboard</h1>

        {/* Google Pie Chart for real-time income/expense */}
        <div className="w-full md:w-2/3 mb-6 flex justify-center">
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={data}
            options={pieOptions}
          />
        </div>

        {/* Toggle Buttons for Bar chart views */}
        <div className="flex mb-4 space-x-4">
          <button
            className={`px-4 py-2 rounded-md ₹{view === 'weekly' ? 'bg-green-700' : 'bg-gray-400'} hover:bg-green-800`}
            onClick={() => toggleView('weekly')}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-md ₹{view === 'monthly' ? 'bg-green-700' : 'bg-gray-400'} hover:bg-green-800`}
            onClick={() => toggleView('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md ₹{view === 'yearly' ? 'bg-green-700' : 'bg-gray-400'} hover:bg-green-800`}
            onClick={() => toggleView('yearly')}
          >
            Yearly
          </button>
        </div>

        {/* Google Bar Chart for Income/Expenses */}
        <div className="w-full md:w-2/3 mb-6">
          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={view === 'weekly' ? calculateWeeklyData() : view === 'monthly' ? calculateMonthlyData() : calculateYearlyData()}
            options={barOptions}
          />
        </div>

        {/* Form to add records */}
        <form onSubmit={handleRecordSubmit} className="flex flex-col items-center mb-6">
          <select
            value={newRecord.type}
            onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
            className="border rounded-md p-2 mb-2 bg-gray-50"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newRecord.amount}
            onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })}
            required
            className="border rounded-md p-2 mb-2 bg-gray-50"
          />
          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnalyticsPage;
