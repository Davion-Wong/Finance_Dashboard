import React from 'react';
import './DebtManagement.css';
import DebtReductionChart from '../DebtReductionChart/DebtReductionChart';

function DebtManagement() {
  return (
    <div className="section debt-management">
      <DebtReductionChart />
    </div>
  );
}

export default DebtManagement;