import React from 'react';
import './InvestmentTracking.css';
import InvestmentSunburst from '../InvestmentSunburst/InvestmentSunburst';
import InvestmentBubbleChart from '../InvestmentBubbleChart/InvestmentBubbleChart';

function InvestmentTracking() {
  return (
    <div className="section investment-tracking">
      <InvestmentSunburst />
      {/* <InvestmentBubbleChart /> */}
    </div>
  );
}

export default InvestmentTracking;