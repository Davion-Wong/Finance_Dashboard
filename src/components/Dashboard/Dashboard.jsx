import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './Dashboard.css';
import AccountOverview from '../AccountOverview/AccountOverview';
import Budgeting from '../Budgeting/Budgeting';
import InvestmentTracking from '../InvestmentTracking/InvestmentTracking';
import SavingsGoals from '../SavingsGoals/SavingsGoals';
import DebtManagement from '../DebtManagement/DebtManagement';
import CreditScoreMonitor from '../CreditScoreMonitor/CreditScoreMonitor';
import { themes } from '../../utils/theme';
import ThemeToggleButton from '../ThemeToggleButton/ThemeToggleButton';
import { useTheme } from '../../utils/ThemeProvider';

function Dashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const { theme } = useTheme();

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const tabStyle = { backgroundColor: theme.backgroundColor, color: theme.textColor };

  return (
    <div>
      <Tabs
        value={currentTab}
        onChange={handleChange}
      >
        <Tab label="Account Overview" style={tabStyle} />
        <Tab label="Budgeting" style={tabStyle} />
        <Tab label="Investment Tracking" style={tabStyle} />
        <Tab label="Savings Goals" style={tabStyle} />
        <Tab label="Debt Management" style={tabStyle} />
        <Tab label="Credit Score Monitor" style={tabStyle} />
        {/* Other tabs */}
      </Tabs>
      {currentTab === 0 && <AccountOverview />}
      {currentTab === 1 && <Budgeting />}
      {currentTab === 2 && <InvestmentTracking />}
      {currentTab === 3 && <SavingsGoals />}
      {currentTab === 4 && <DebtManagement />}
      {currentTab === 5 && <CreditScoreMonitor />}
      {/* Other components */}
    </div>
  );
}

export default Dashboard;