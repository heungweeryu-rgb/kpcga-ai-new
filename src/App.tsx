import React, { useEffect, useRef } from 'react';
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
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const App: React.FC = () => {
  // 인포그래픽 데이터 및 옵션 설정
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#F8FAFC', font: { weight: 'bold' } as const },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#5EEAD4',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8' }
      }
    }
  };

  const satisfactionData = {
    labels: ['상담 만족도', '재이용 의사', '정서적 지지', '해결 중심성'],
    datasets: [
      {
        label: '사용자 평가 (100점 만점)',
        data: [94, 91, 88, 85],
        backgroundColor: '#0D9488',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div style={{ backgroundColor: '#0a0c10', minHeight: '100vh', padding: '2rem', color: 'white' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: '#5EEAD4', fontSize: '2.5rem', marginBottom: '0.5rem' }}>KPCGA AI 상담 솔루션 성과</h1>
        <p style={{ color: '#94A3B8' }}>데이터로 증명하는 심리상담 혁신</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <section style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '1rem', height: '400px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>주요 만족도 지표</h2>
          <div style={{ height: '300px' }}>
            <Bar data={satisfactionData} options={commonOptions} />
          </div>
        </section>
        
        {/* 추가 차트 섹션들을 여기에 배치 */}
      </div>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#475569', fontSize: '0.875rem' }}>
        <p>© 2026 KPCGA 한국심리상담지도협회. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;