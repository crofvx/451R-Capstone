'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart() {
  const data = {
    labels: ['Food', 'Transportation', 'Housing'],
    datasets: [
      {
        label: 'Percentage %',
        data: [60, 25, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(234, 88, 12, 0.6)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(234, 88, 12, 1)',
        ],
        borderWidth: 1,
        spacing: 5,
        borderRadius: 60,
        hoverOffset: 10,
        cutout: '75%', // 
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      animateRotate: true,
      easing: 'easeOutQuart',
      duration: 1400,
    },
    plugins: {
      tooltip: {
        position: 'nearest',
        intersect: true,
        cornerRadius: 8,
        padding: 10,
        displayColors: false,
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 7,
          boxHeight: 7,
        },
      },
    },
    elements: {
      arc: {
        borderRadius: 60,
        spacing: 5,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}