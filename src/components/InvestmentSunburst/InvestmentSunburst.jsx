import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { event } from 'd3-selection';

function InvestmentSunburst() {
  // Example hierarchical data
  const [investmentData, setInvestmentData] = useState({
    name: "Portfolio",
    children: [
      {
        name: "Stocks",
        children: [
          { name: "Tech", value: 40 },
          { name: "Healthcare", value: 20 },
          { name: "Finance", value: 30 },
          { name: "Energy", value: 25 },
          { name: "Consumer", value: 35 },
        ],
      },
      {
        name: "Bonds",
        children: [
          { name: "Government", value: 25 },
          { name: "Corporate", value: 15 },
          { name: "Municipal", value: 10 },
          { name: "High Yield", value: 20 },
          { name: "International", value: 15 },
        ],
      },
      {
        name: "Real Estate",
        children: [
          { name: "Commercial", value: 30 },
          { name: "Residential", value: 20 },
          { name: "REITs", value: 25 },
        ],
      },
      {
        name: "Commodities",
        children: [
          { name: "Gold", value: 20 },
          { name: "Oil", value: 15 },
          { name: "Agriculture", value: 25 },
        ],
      },
    ],
  });
  
  const width = 510;
  const height = 510;
  const radius = Math.min(width, height) / 2;

  function handleInputChange(categoryIndex, subcategoryIndex, event) {
    const newData = { ...investmentData };
    newData.children[categoryIndex].children[subcategoryIndex].value = event.target.value;
    setInvestmentData(newData);
  }

  useEffect(() => {
    d3.select('#investment-sunburst').select('svg').remove();
    const svg = d3.select("#investment-sunburst")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const root = d3.hierarchy(investmentData)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const sunburstLayout = d3.partition()
      .size([2 * Math.PI, radius]);

    sunburstLayout(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Tooltip
    const tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    svg.selectAll("path")
      .data(root.descendants())
      .enter().append("path")
      .attr("d", d3.arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .innerRadius((d) => d.y0)
        .outerRadius((d) => d.y1))
      .style("fill", (d) => color((d.children ? d : d.parent).data.name))
      .on("mouseover", function (event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("Category: " + d.data.name + "<br/>Value: " + d.value)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function (event, d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

      svg.selectAll("text")
        .data(root.descendants().filter(d => d.depth === 2))
        .enter().append("text")
        .attr("transform", function(d) {
          const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI;

          const meanRadius = (d.y0 + d.y1) / 2; // Calculate the mean radius of the segment
          const textOffset = -10; // Adjust this value to move the text closer or farther from the center
          const textRadius = meanRadius + textOffset;
          return `rotate(${angle - 90}) translate(${textRadius},0) ${angle < 180 ? "" : "rotate(180)"}`;
        })
        .attr("dy", ".35em")
        .style("text-anchor", d => (d.x0 + d.x1)/2 < Math.PI ? "start" : "end")
        .style("fill", "#ffffff")
        .text(d => d.data.name.slice(0, 3));
      


      // Draw the boundaries
      svg.selectAll(".boundary")
      .data(root.descendants().filter(d => d.depth))
      .enter().append("path")
      .attr("class", "boundary")
      .attr("d", (d) => {
        // Draw lines at the start and end of each segment
        const startLine = d3.arc()
          .startAngle(d.x0)
          .endAngle(d.x0)
          .innerRadius(d.y0)
          .outerRadius(d.y1)();
        const endLine = d3.arc()
          .startAngle(d.x1)
          .endAngle(d.x1)
          .innerRadius(d.y0)
          .outerRadius(d.y1)();
        const innerRing = d3.arc()
          .startAngle(d.x0)
          .endAngle(d.x1)
          .innerRadius(d.y0)
          .outerRadius(d.y0)();
        const outerRing = d3.arc()
          .startAngle(d.x0)
          .endAngle(d.x1)
          .innerRadius(d.y1)
          .outerRadius(d.y1)();

        return startLine + endLine + innerRing + outerRing;
      })
      .style("stroke", "#FFF") // White stroke color
      .style("stroke-width", "1"); // Thinner stroke
  }, [investmentData, radius]);

  return (    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <div id="investment-sunburst" style={{ marginLeft: '50px', marginRight: '20px' }}></div>
      <div style={{ padding: '20px', width: '50%' }}>
        <h1>Invest distribution graph</h1>
        <p style={{ textAlign: 'left' }}>
          This graph indicates the distribution of your investment. Different colors in the
          inner circle indicates different investment categories, and the parts in the outer
          circle in the same color indicates their corresponding subcategories.
        </p>
        <p style={{ textAlign: 'left' }}>
          Please note that the locations of a specific subcategory may change because of its
          moving ranking among all subcategories.
        </p>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
          {investmentData.children.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ width: '300px', margin: 'auto'}}>
              <h3>{category.name}</h3>
              {category.children.map((subcategory, subcategoryIndex) => (
                <div key={subcategoryIndex} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px auto'}}>
                  <label>
                    {subcategory.name}({subcategory.name.slice(0, 3)}):
                  </label>
                  <input
                    type="number"
                    value={subcategory.value}
                    onChange={(e) => handleInputChange(categoryIndex, subcategoryIndex, e)}
                    style={{ width: '100px' }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InvestmentSunburst;