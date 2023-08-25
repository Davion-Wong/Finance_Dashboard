import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';

function CreditScoreChart() {
  const [creditScoreData, setCreditScoreData] = useState([
    { month: 'Jan', score: 630 },
    { month: 'Feb', score: 760 },
    { month: 'Mar', score: 370 },
    { month: 'Apr', score: 880 },
    { month: 'May', score: 1090 },
    { month: 'Jun', score: 710 },
    { month: 'Jul', score: 760 },
    { month: 'Aug', score: 1220 },
    { month: 'Sep', score: 930 },
    { month: 'Oct', score: 1340 },
    { month: 'Nov', score: 1150 },
    { month: 'Dec', score: 1260 }
  ]);  

  const width = 500;
  const height = 500;
  const innerRadius = 100;
  const outerRadius = Math.min(width, height) / 2;

  const handleInputChange = (event, index) => {
    const newData = [...creditScoreData];
    newData[index].score = event.target.value;
    setCreditScoreData(newData);
  };

  useEffect(() => {
    
    d3.select('#credit-score-chart').select('svg').remove();
    const svg = d3.select('#credit-score-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const xScale = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(creditScoreData.map(d => d.month));

    const yScale = d3.scaleLinear()
      .range([innerRadius, outerRadius])
      .domain([0, d3.max(creditScoreData, d => d.score)]);

    const arc = d3.arc()
      .innerRadius(d => yScale(0))
      .outerRadius(d => yScale(d.score))
      .startAngle(d => xScale(d.month))
      .endAngle(d => xScale(d.month) + xScale.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius);

    svg.selectAll('path')
      .data(creditScoreData)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', 'steelblue');

  }, [creditScoreData]);

  return (
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <div id="credit-score-chart" style={{ marginLeft: '50px', marginRight: '20px'}}></div>
      <div style={{ padding: '20px', width: '40%', marginLeft: '20px', marginRight: '10%', textAlign: 'center' }}>
        <h1>Credit score chart</h1>
        <p style={{ textAlign: 'left' }}>
          This graph indicates the credit scores at different months. Try editing your credit
          scores to see how it works.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '10px' }}>
          {creditScoreData.map((item, index) => (
            <div key={index} style={{ maxWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '5px auto' }}>
              <label style={{ marginRight: '10px', minWidth: '50px', textAlign: 'left' }}>
                {item.month}:
              </label>
              <input 
                type="number" 
                value={item.score} 
                onChange={e => handleInputChange(e, index)}
                style={{ width: '100px' }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreditScoreChart;
