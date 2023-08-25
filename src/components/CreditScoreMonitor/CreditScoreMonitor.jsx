import React from 'react';
import './CreditScoreMonitor.css';
import CreditScoreChart from '../CreditScoreChart/CreditScoreChart';

function CreditScoreMonitor() {
  return (
    <div className="section credit-score-monitor">
      <CreditScoreChart />
    </div>
  );
}

export default CreditScoreMonitor;