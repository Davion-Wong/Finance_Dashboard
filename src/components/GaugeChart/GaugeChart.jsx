// GaugeChart.js
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './GaugeChart.css';
import themes from '../../utils/theme';

function GaugeChart() {
  const [goal, setGoal] = useState(100);
  const [current, setCurrent] = useState(50);
  const percentOfGoal = Math.min(1, current / goal);

  useEffect(() => {
    // Define dimensions
    const width = 800;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Select the SVG element and remove any previous content
    d3.select('#gauge-chart').select('svg').remove();

    const svg = d3.select('#gauge-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Define the scale
    const scale = d3.scaleLinear().domain([0, 1]).range([135, -135]);
    // Calculate the angle for the pointer
    const angle = scale(percentOfGoal) * (Math.PI / 180) + Math.PI;

    // Calculate the x and y coordinates for the end of the pointer
    const pointerLength = radius - 10; // You can adjust the length
    const x = pointerLength * Math.sin(-angle);
    const y = pointerLength * Math.cos(angle);

    // Create the arc
    const arc = d3.arc()
      .innerRadius(radius / 2)
      .outerRadius(radius)
      .startAngle(d => scale(0) * (Math.PI / 180))
      .endAngle(d => scale(d) * (Math.PI / 180));

    // Append the background arc
    svg.append('path')
      .datum(1)
      .attr('d', arc)
      .attr('class', 'gauge-bg');

    // Append the foreground arc
    svg.append('path')
      .datum(percentOfGoal)
      .attr('d', arc)
      .attr('class', 'gauge-fg');

    // Append the line element for the pointer
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', y)
      .attr('stroke', 'red') // Set the color to red
      .attr('stroke-width', '4') // Set the width of the line
      .attr('class', 'gauge-pointer');
      // Append a red circle in the middle
      svg.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 20) // Radius of the circle
      .attr('fill', 'red'); // Fill color of the circle

      // Append text to display the current value
      svg.append('text')
        .attr('class', 'gauge-text')
        .attr('y', -height / 8)
        .attr('fill', 'grey')
        .text(`${Math.round(percentOfGoal * 100)}%`);
  }, [goal, current, percentOfGoal]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <div id="gauge-chart" style={{ marginLeft: '50px', marginRight: '20px' }}></div>
      <div style={{ padding: '20px', width: '40%', marginLeft: '20px', marginRight: '10%' }}>
        <h1>Saving goal gauge chart</h1>
        <p style={{ textAlign: 'left', marginBottom: '100px' }}>
          This graph indicates the progress percentage of your saving goals. Try editing your goal and
          your current saving below to see how it works.
        </p>
        <label style={{ width: '300px', display: 'flex', margin: 'auto', justifyContent: 'space-between'}} >
          Goal: 
          <input type="number" value={goal} onChange={e => setGoal(Math.max(0, e.target.value))} />
        </label>
        <br />
        <label style={{ width: '300px', display: 'flex', margin: 'auto', justifyContent: 'space-between'}} >
          Current: 
          <input type="number" value={current} onChange={e => setCurrent(Math.max(0, Math.min(e.target.value, goal)))} />
        </label>
      </div>
    </div>
  );
}

export default GaugeChart;
