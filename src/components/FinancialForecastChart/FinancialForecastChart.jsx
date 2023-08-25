import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './FinancialForecastChart.css'

function FinancialForecastChart() {

  const [forecastData, setForecastData] = useState([
    { month: 'Jan', scenarioA: 200, scenarioB: 180, scenarioC: 100 },
    { month: 'Feb', scenarioA: 220, scenarioB: 190, scenarioC: 130 },
    { month: 'Mar', scenarioA: 240, scenarioB: 200, scenarioC: 160 },
    { month: 'Apr', scenarioA: 260, scenarioB: 210, scenarioC: 190 },
    { month: 'May', scenarioA: 280, scenarioB: 220, scenarioC: 220 },
    { month: 'Jun', scenarioA: 300, scenarioB: 230, scenarioC: 250 },
    { month: 'Jul', scenarioA: 320, scenarioB: 240, scenarioC: 280 },
    { month: 'Aug', scenarioA: 340, scenarioB: 250, scenarioC: 310 },
    { month: 'Sep', scenarioA: 360, scenarioB: 260, scenarioC: 340 },
    { month: 'Oct', scenarioA: 380, scenarioB: 270, scenarioC: 370 },
    { month: 'Nov', scenarioA: 400, scenarioB: 280, scenarioC: 400 },
    { month: 'Dec', scenarioA: 420, scenarioB: 290, scenarioC: 430 }
  ]);
  
  
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  
  const handleInputChange = (e, month, scenario) => {
    const value = e.target.value;
    setForecastData((prevData) =>
      prevData.map((item) =>
        item.month === month
          ? { ...item, [scenario]: parseInt(value, 10) }
          : item
      )
    );
  };

  useEffect(() => {
    // Create SVG container
    d3.select('#financial-forecast-chart').select('svg').remove()
    const svg = d3.select('#financial-forecast-chart')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(forecastData.map(d => d.month))
      .range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(forecastData, d => Math.max(d.scenarioA, d.scenarioB, d.scenarioC))])
      .range([height - margin.top - margin.bottom, 0]);

    // Add X and Y axis
    svg.append('g').attr('transform', `translate(0,${height - margin.top - margin.bottom})`).call(d3.axisBottom(xScale));
    svg.append('g').call(d3.axisLeft(yScale));

    // Define line generator
    const line = d3.line()
      .x(d => xScale(d.month))
      .y(d => yScale(d.value));

    // Define scenarios
    const scenarios = [
      { name: 'scenarioA', color: 'blue' },
      { name: 'scenarioB', color: 'green' },
      { name: 'scenarioC', color: 'red' }
    ];

    // Add lines for each scenario
    scenarios.forEach(scenario => {
      svg.append('path')
        .datum(forecastData.map(d => ({ month: d.month, value: d[scenario.name] })))
        .attr('fill', 'none')
        .attr('stroke', scenario.color)
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // Add additional elements like legends, tooltips, etc. as needed
  }, [forecastData]);

  return (
    <div>
      <h1>Financial Forecast Line Graph</h1>
      <p style={{ textAlign: 'left' }}>
        This graph represents the projected trend of your financial investments 
        over time. The lines in the graph depict different investment categories, 
        and the various data points on each line indicate forecasted values for 
        their corresponding time periods.
      </p>
      <div className='financial-forecast' style={{display: 'flex'}}>
        <div className='graph'>
          <h3>Annual Financial Forecast: 2024</h3>
          <div id="financial-forecast-chart"></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Scenario A</th>
              <th>Scenario B</th>
              <th>Scenario C</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>
                  <input
                    type="number"
                    value={row.scenarioA}
                    onChange={(e) => handleInputChange(e, row.month, 'scenarioA')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.scenarioB}
                    onChange={(e) => handleInputChange(e, row.month, 'scenarioB')}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.scenarioC}
                    onChange={(e) => handleInputChange(e, row.month, 'scenarioC')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FinancialForecastChart;
