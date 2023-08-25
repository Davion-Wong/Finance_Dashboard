import './App.css';
import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import { useTheme } from './utils/ThemeProvider';
import { ThemeProvider } from './utils/ThemeProvider';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


function App() {

  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { theme } = useTheme();

  return (
    <div 
      className='App' 
      style={{
        '--background-color': theme.backgroundColor,
        '--text-color': theme.textColor,
    }}>
      <Header />
      <Dashboard />
      <Footer />
    </div>
  )
}

export default App;
