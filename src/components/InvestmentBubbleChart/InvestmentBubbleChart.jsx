import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './InvestmentBubbleChart.css'

function InvestmentBubbleChart() {
  const data = [
    { asset: "Stock A", return: 10, risk: 5, amount: 20000 },
    { asset: "Stock B", return: 12, risk: 6, amount: 18000 },
    { asset: "Bond A", return: 4, risk: 2, amount: 15000 },
    { asset: "Bond B", return: 3, risk: 1, amount: 12000 },
    { asset: "Real Estate A", return: 8, risk: 4, amount: 25000 },
    { asset: "Real Estate B", return: 7, risk: 3, amount: 23000 },
    { asset: "Commodity A", return: 9, risk: 7, amount: 17000 },
    { asset: "Commodity B", return: 5, risk: 4, amount: 16000 },
    { asset: "Tech Fund", return: 15, risk: 8, amount: 21000 },
    { asset: "Healthcare Fund", return: 14, risk: 7, amount: 22000 },
    { asset: "Government Bond A", return: 2, risk: 1, amount: 13000 },
    { asset: "Corporate Bond B", return: 3, risk: 2, amount: 14000 },
  ];
  

  useEffect(() => {
    const width = 500;
    const height = 400;
  
    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.return)]).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.risk)]).range([height, 0]);
    const size = d3.scaleLinear().domain([0, d3.max(data, d => d.amount)]).range([5, 50]);
  
    d3.select('#investment-bubble-chart').select('svg').remove();
    const svg = d3.select("#investment-bubble-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    svg.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => x(d.return))
      .attr("cy", d => y(d.risk))
      .attr("r", d => size(d.amount))
      .attr("fill", "blue");
  }, []);
  

  return <div id="investment-bubble-chart"></div>;
}

export default InvestmentBubbleChart;
