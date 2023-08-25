import React from 'react';
import './AccountOverview.css';
import FinancialForecastChart from '../FinancialForecastChart/FinancialForecastChart';

function AccountOverview() {
  return (
    <div className="section account-overview">
      <FinancialForecastChart />
    </div>
  );
}

export default AccountOverview;