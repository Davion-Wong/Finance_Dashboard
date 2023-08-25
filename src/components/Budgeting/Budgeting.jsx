import React from 'react';
import './Budgeting.css';
import MonthlySpendingGraph from '../MonthlySpendingGraph/MonthlySpendingGraph';
import DailyExpensesScatterPlot from '../DailyExpensesScatterPlot/DailyExpensesScatterPlot';

function Budgeting() {
  return (
    <div className="section budgeting">
      <MonthlySpendingGraph />
      {/* <DailyExpensesScatterPlot /> */}
    </div>
  );
}

export default Budgeting;