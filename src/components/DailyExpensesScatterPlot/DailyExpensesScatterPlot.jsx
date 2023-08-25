import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './DailyExpensesScatterPlot.css';

function DailyExpensesScatterPlot() {
  const dailyExpenses = [
    { day: 1, expense: 40 },
    { day: 2, expense: 55 },
    { day: 3, expense: 30 },
    { day: 4, expense: 45 },
    { day: 5, expense: 60 },
    { day: 6, expense: 35 },
    { day: 7, expense: 50 },
    { day: 8, expense: 70 },
    { day: 9, expense: 25 },
    { day: 10, expense: 40 },
    { day: 11, expense: 42 },
    { day: 12, expense: 47 },
    { day: 13, expense: 52 },
    { day: 14, expense: 38 },
    { day: 15, expense: 46 },
    { day: 16, expense: 44 },
    { day: 17, expense: 30 },
    { day: 18, expense: 39 },
    { day: 19, expense: 51 },
    { day: 20, expense: 67 },
    { day: 21, expense: 29 },
    { day: 22, expense: 31 },
    { day: 23, expense: 53 },
    { day: 24, expense: 42 },
    { day: 25, expense: 36 },
    { day: 26, expense: 40 },
    { day: 27, expense: 59 },
    { day: 28, expense: 35 },
    { day: 29, expense: 48 },
    { day: 30, expense: 41 },
    { day: 31, expense: 50 }
  ];
  
  useEffect(() => {
    // Define dimensions
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Append svg object
    d3.select('#daily-expenses').select('svg').remove();
    const svg = d3
      .select('#daily-expenses')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3.scaleLinear().domain([0, 31]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(dailyExpenses, d => d.expense)]).range([height, 0]);

    // Add X axis
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
      .selectAll('dot')
      .data(dailyExpenses)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.day))
      .attr('cy', d => y(d.expense))
      .attr('r', 5)
      .attr('fill', 'steelblue');
  }, []);

  return <div id="daily-expenses"></div>;
}

export default DailyExpensesScatterPlot;
