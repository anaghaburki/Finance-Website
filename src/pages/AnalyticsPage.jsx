import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import Sidebar from './components/Sidebar';

const AnalyticsPage = () => {
  const [records, setRecords] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [view, setView] = useState('monthly');
  const [newRecord, setNewRecord] = useState({ type: 'income', amount: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/records');
        const data = await response.json();
        setRecords(data);
        calculateIncomeAndExpenses(data);
      } catch (error) {
        console.error('Error fetching records:', error);
        setErrorMessage('Failed to fetch records. Please try again later.');
      }
    };

    fetchRecords();
  }, []);

  const calculateIncomeAndExpenses = (data) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    data.forEach((record) => {
      if (record.type === 'income') {
        totalIncome += record.amount;
      } else {
        totalExpenses += record.amount;
      }
    });
    setIncome(totalIncome);
    setExpenses(totalExpenses);
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(newRecord.amount);
    if (!isNaN(amount) && amount > 0) {
      const record = { type: newRecord.type, amount, date: new Date().toISOString().slice(0, 10) };

      try {
        const response = await fetch('http://localhost:5000/api/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(record),
        });

        if (response.ok) {
          const savedRecord = await response.json();
          setRecords((prevRecords) => [...prevRecords, savedRecord]);
          calculateIncomeAndExpenses([...records, savedRecord]);
          setNewRecord({ type: 'income', amount: '' });
        } else {
          console.error('Error adding record:', response.statusText);
          setErrorMessage('Failed to add record. Please try again.');
        }
      } catch (error) {
        console.error('Error adding record:', error);
        setErrorMessage('Failed to add record. Please try again.');
      }
    }
  };

  const calculateWeeklyData = () => {
    const weeklyData = Array(4).fill(0).map(() => [0, 0]);
    const today = new Date();
  
    records.forEach((record) => {
      const recordDate = new Date(record.date);
      const weekIndex = Math.floor((today - recordDate) / (7 * 24 * 60 * 60 * 1000)); // Difference in weeks
  
      if (weekIndex < 4 && weekIndex >= 0) {
        if (record.type === 'income') {
          weeklyData[weekIndex][0] += record.amount;
        } else {
          weeklyData[weekIndex][1] += record.amount;
        }
      }
    });
  
    return [['Week', 'Income', 'Expenses'], 
      ...weeklyData.map((data, index) => [`Week ${index + 1}`, ...data])
    ];
  };
  
  const calculateMonthlyData = () => {
    const monthlyData = Array(4).fill(0).map(() => [0, 0]);
    const currentMonth = new Date().getMonth();
  
    records.forEach((record) => {
      const recordMonth = new Date(record.date).getMonth();
      const monthIndex = currentMonth - recordMonth;
  
      if (monthIndex < 4 && monthIndex >= 0) {
        if (record.type === 'income') {
          monthlyData[monthIndex][0] += record.amount;
        } else {
          monthlyData[monthIndex][1] += record.amount;
        }
      }
    });
  
    return [['Month', 'Income', 'Expenses'], 
      ...monthlyData.map((data, index) => [`Month ${currentMonth - index + 1}`, ...data])
    ];
  };
  
  const calculateYearlyData = () => {
    const yearlyData = Array(3).fill(0).map(() => [0, 0]);
    const currentYear = new Date().getFullYear();
  
    records.forEach((record) => {
      const recordYear = new Date(record.date).getFullYear();
      const yearIndex = currentYear - recordYear;
  
      if (yearIndex < 3 && yearIndex >= 0) {
        if (record.type === 'income') {
          yearlyData[yearIndex][0] += record.amount;
        } else {
          yearlyData[yearIndex][1] += record.amount;
        }
      }
    });
  
    return [['Year', 'Income', 'Expenses'], 
      ...yearlyData.map((data, index) => [`${currentYear - index}`, ...data])
    ];
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
      0: { color: '#2e7d32' },
      1: { color: '#c62828' },
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
      <Sidebar />

      <div className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-4">Analytics Dashboard</h1>
        
        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}

        <div className="w-full md:w-2/3 mb-6 flex justify-center">
          <Chart chartType="PieChart" width="100%" height="400px" data={data} options={pieOptions} />
        </div>

        <div className="flex mb-4 space-x-4">
          <button className={`px-4 py-2 rounded-md ${view === 'weekly' ? 'bg-green-700' : 'bg-gray-400'} hover:bg-green-800`} onClick={() => toggleView('weekly')}>Weekly</button>
          <button className={`px-4 py-2 rounded-md ${view === 'monthly' ? 'bg-green-700' : 'bg-gray-400'} hover:bg-green-800`} onClick={() => toggleView('monthly')}>Monthly</button>
          <button className={`px-4 py-2 rounded-md ${view === 'yearly' ? 'bg-green-700' : 'bg-gray-400'} hover:bg-green-800`} onClick={() => toggleView('yearly')}>Yearly</button>
        </div>

        <div className="w-full md:w-2/3 mb-6">
          <Chart chartType="BarChart" width="100%" height="400px" data={view === 'weekly' ? calculateWeeklyData() : view === 'monthly' ? calculateMonthlyData() : calculateYearlyData()} options={barOptions} />
        </div>

        <form onSubmit={handleRecordSubmit} className="flex flex-col items-center mb-6">
          <select value={newRecord.type} onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })} className="border rounded-md p-2 mb-2 bg-gray-50">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" placeholder="Amount" value={newRecord.amount} onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })} required className="border rounded-md p-2 mb-2 bg-gray-50" />
          <button type="submit" className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-800">Add Record</button>
        </form>

        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-semibold mb-2">Recent Records</h2>
          <ul className="bg-white shadow-md rounded-md p-4">
            {records.length > 0 ? (
              records.map((record, index) => (
                <li key={index} className="flex justify-between py-2 border-b last:border-b-0">
                  <span>{record.type.charAt(0).toUpperCase() + record.type.slice(1)}: ${record.amount.toFixed(2)}</span>
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </li>
              ))
            ) : (
              <li>No records available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
