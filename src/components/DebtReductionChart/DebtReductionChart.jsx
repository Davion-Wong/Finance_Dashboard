import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import './DebtReductionChart.css';

function DebtReductionChart() {
  const [data, setData] = useState([
    { time: "Jan", debt: 1000 },
    { time: "Feb", debt: 950 },
    { time: "Mar", debt: 900 },
    { time: "Apr", debt: 850 },
    { time: "May", debt: 800 },
    { time: "Jun", debt: 750 },
    { time: "Jul", debt: 700 },
    { time: "Aug", debt: 650 },
    { time: "Sep", debt: 600 },
    { time: "Oct", debt: 550 },
    { time: "Nov", debt: 500 },
    { time: "Dec", debt: 450 }
  ]);

  const handleInputChange = (event, index) => {
    const newData = [...data];
    newData[index].debt = event.target.value;
    setData(newData);
  };
  
  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 720 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

    d3.select('#debt-reduction-chart').select('svg').remove();
    const svg = d3.select("#debt-reduction-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.map(d => d.time)).range([0, width]);
    const maxDebt = 1000;
    const y = d3.scaleLinear().domain([0, maxDebt]).range([height, 0]);

    const area = d3.area()
      .x(d => x(d.time))
      .y0(height)
      .y1(d => y(d.debt));

    svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    // Add the X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));
  }, [data]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <div id="debt-reduction-chart" style={{ marginLeft: '50px', marginRight: '20px' }}></div>
      
      <div style={{ padding: '20px', width: '40%', marginLeft: '20px', marginRight: '10%' }}>
        <h1>Debt reduction chart</h1>
        <p style={{ textAlign: 'left' }}>
          This graph indicates the reduction of debt based on the debt data. Try editing your debt
          below to see how it works.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '10px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '5px'}}>
              <label style={{width: '300px', display: 'flex', justifyContent: 'space-between'}}>
                {item.time}:
                <input type="number" value={item.debt} onChange={e => handleInputChange(e, index)} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DebtReductionChart;
