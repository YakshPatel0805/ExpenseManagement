import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ExpenseChart = ({ data, type = 'bar', title = 'Expense Data' }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
        <p style={{ color: '#7f8c8d' }}>No data available to display</p>
      </div>
    );
  }

  // Prepare chart data
  const labels = data.map(item => {
    // Check if it's a category (has _id as string) or date-based data
    if (typeof item._id === 'string' && item._id.length < 20) {
      const categoryLabels = {
        food: 'Food & Drinks',
        shopping: 'Shopping',
        housing: 'Housing',
        transportation: 'Transportation',
        entertainment: 'Entertainment',
        healthcare: 'Healthcare',
        utilities: 'Utilities',
        other: 'Other'
      };
      return categoryLabels[item._id] || item._id;
    }
    // For date-based data
    return item.label || item._id;
  });

  const amounts = data.map(item => item.total);
  
  // Color palette for categories
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2'  // Light Blue
  ];

  const backgroundColor = type === 'line' 
    ? 'rgba(52, 152, 219, 0.1)'
    : colors.slice(0, data.length);

  const borderColor = type === 'line'
    ? '#3498db'
    : colors.slice(0, data.length);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Expense Amount ($)',
        data: amounts,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: type === 'line' ? 3 : 2,
        borderRadius: type === 'line' ? 0 : 8,
        fill: type === 'line' ? true : false,
        tension: type === 'line' ? 0.4 : 0,
        pointRadius: type === 'line' ? 5 : 0,
        pointBackgroundColor: type === 'line' ? '#3498db' : undefined,
        pointBorderColor: type === 'line' ? '#fff' : undefined,
        pointBorderWidth: type === 'line' ? 2 : 0,
        hoverBackgroundColor: type === 'line' 
          ? 'rgba(52, 152, 219, 0.2)'
          : colors.slice(0, data.length).map(color => color + 'CC'),
        hoverPointRadius: type === 'line' ? 7 : 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#2c3e50',
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#7f8c8d',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: '#7f8c8d',
          font: {
            size: 12
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  };

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
};

export default ExpenseChart;
