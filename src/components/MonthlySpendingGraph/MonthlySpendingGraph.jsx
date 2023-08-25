import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import './MonthlySpendingGraph.css';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { jsPDF } from 'jspdf';

function MonthlySpendingGraph() {

  const [data, setData] = useState([
    { month: 'Jan', spending: 200 },
    { month: 'Feb', spending: 250 },
    { month: 'Mar', spending: 300 },
    { month: 'Apr', spending: 280 },
    { month: 'May', spending: 310 },
    { month: 'Jun', spending: 220 },
    { month: 'Jul', spending: 230 },
    { month: 'Aug', spending: 320 },
    { month: 'Sep', spending: 290 },
    { month: 'Oct', spending: 315 },
    { month: 'Nov', spending: 330 },
    { month: 'Dec', spending: 340 },
  ]);
  const originalData = useRef([...data]);
  const [displayData, setDisplayData] = useState(data);

  
  // Define the dimensions
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        
  const canvas = document.createElement('canvas');

  const zoomInRef = useRef();
  const zoomOutRef = useRef();

  const [color, setColor] = useState('blue');
  const [filterValue, setFilterValue] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // State to handle form input values
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [spendingInput, setSpendingInput] = useState(0);

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Clone the data array
    const updatedData = [...data];
    const updateOriginaldData = originalData.current;
  
    // Find the object corresponding to the selected month
    const monthData = updatedData.find((item) => item.month === selectedMonth);
    const monthOrigianlData = updateOriginaldData.find((item) => item.month === selectedMonth);
  
    // Update the spending value
    if (monthData) {
      monthData.spending = parseFloat(spendingInput);
      monthOrigianlData.spending = parseFloat(spendingInput);
    }
  
    // Update the data state
    setData(updatedData);
    setDisplayData(updatedData);
  };

  
  const exportToPNG = useRef();

  const exportToPDF = () => {
    const svgElement = document.querySelector('#monthly-spending svg');
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const doc = new jsPDF();
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 0, 0, img.width * 0.264583, img.height * 0.264583); // Convert to mm
      doc.save('MonthlySpending.pdf');
    };
  
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  };

  useEffect(() => {
    let newData = [...data];

    // Apply the filter if one is set
    if (filterValue !== null) {
      newData = newData.filter((d) => d.spending >= filterValue);
    }
    
    // Apply sorting if specified
    if (sortOrder !== null) {
      if(sortOrder === 'asc') {
        newData.sort((a, b) => a.spending - b.spending);
      } else if(sortOrder === 'desc') {
        newData.sort((a, b) => b.spending - a.spending);
      } else if (sortOrder === 'def') {
        newData = [...originalData.current];
      }
      setDisplayData(newData);
    }

  }, [data, color, filterValue, sortOrder]);

  useEffect(() => {
    // Append the svg object
    d3.select('#monthly-spending').select('svg').remove();
    let svgContainer = d3
                      .select('#monthly-spending')
                      .append('svg')
                      .attr('width', width + margin.left + margin.right)
                      .attr('height', height + margin.top + margin.bottom);
  
    const svg = svgContainer
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

                
    
    const svgElement = document.querySelector('#monthly-spending svg');
    const svgSize = svgElement.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    exportToPNG.current = () => {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const imgURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imgURL;
        downloadLink.download = 'MonthlySpending.png';
        downloadLink.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    };
  
    function zoomed(event) {
      svg.attr('transform', event.transform);
    }
  
    const zoom = d3.zoom()
      .scaleExtent([1, 3])
      .on('zoom', zoomed);

    // Define scales
    const x = d3.scaleBand().domain(displayData.map((d) => d.month)).range([0, width]);
    const y = d3.scaleLinear().domain([0, d3.max(displayData, (d) => d.spending)]).range([height, 0]);

    // Add X axis
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // Inside useEffect()
    svg.append('path')
       .datum(displayData)
       .attr('class', 'line')
       .attr('fill', 'none')
       .attr('stroke', color)
       .attr('d', d3.line().x((d) => x(d.month) + x.bandwidth() / 2).y((d) => y(d.spending)));

    const tooltip = d3.select('body')
                      .append('div')
                      .attr('class', 'tooltip')
                      .style('opacity', 0);

    svg.selectAll('circle')
       .data(displayData)
       .enter()
       .append('circle')
       .attr('cx', (d) => x(d.month) + x.bandwidth() / 2)
       .attr('cy', (d) => y(d.spending))
       .attr('r', 5)
       .attr('fill', 'grey')
       .on('click', (event, d) => { // click event added here
         tooltip.transition().duration(200).style('opacity', 0.9);
         tooltip
           .html(`Month: ${d.month} <br/> Spending: $${d.spending}`) // Detailed information about the clicked data point
           .style('left', event.pageX + 'px')
           .style('top', event.pageY - 28 + 'px');
       })
       .on('mouseout', (event) => {
         tooltip.transition().duration(500).style('opacity', 0);
       });
  

    function zoomIn() {
      svgContainer.transition().duration(750).call(zoom.scaleBy, 1.5); // 1.2 is the scale multiplier for zooming in
    }
    
    function zoomOut() {
      svgContainer.transition().duration(750).call(zoom.scaleBy, 1 / 1.5); // 1/1.2 is the scale multiplier for zooming out
    }
  
    zoomInRef.current = zoomIn;
    zoomOutRef.current = zoomOut;

    svgContainer.call(zoom);
  }, [displayData, color]);

  const startTutorial = () => {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          intro: 'Welcome! Let\'s take a tour.'
        },
        {
          element: '#monthly-spending',
          intro: 'Try scrolling and dragging to see better.'
        },
        {
          element: '.share-controls',
          intro: 'Use these buttons to share or save this graph.'
        },
        {
          element: '.sorting-control',
          intro: 'You can reorder the data points in different ways here'
        },
        {
          element: '.data-editing',
          intro: 'All the data entries can be edited here.'
        }
      ]
    });
    intro.start();
  };
  
  const shareOnFacebook = () => {
    const url = window.location.href; // Assuming I want to share the current page
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const url = window.location.href; // Assuming I want to share the current page
    const text = 'Check out this cool visualization!';
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <div style={{display: 'flex'}}>
      <div id="monthly-spending"></div>
      <div style={{width: '40%'}}>      
        <div style={{ padding: '20px', marginLeft: '20px', marginRight: '10%' }}>
          <h1>Monthly spending chart</h1>
          <p style={{ textAlign: 'left' }}>
            This is the monthly spending graph. You can see how your monthly spending changes over the year. 
          </p>
        </div>
        <div className="display-controls">
          <button className="action-btn" onClick={startTutorial}>Take a Tour</button>
          {/* <button className="action-btn" onClick={() => zoomInRef.current()}>Zoom In</button> */}
          {/* <button className="action-btn" onClick={() => zoomOutRef.current()}>Zoom Out</button> */}
          <button 
            className="action-btn" 
            onClick={() => color==='red' ? setColor('blue'): setColor('red')}
          >
            Change line color
          </button>
        </div>
        <div className="share-controls">
          <button className="action-btn" onClick={shareOnFacebook}>Share on Facebook</button>
          <button className="action-btn" onClick={shareOnTwitter}>Share on Twitter</button>
          <button className="action-btn" onClick={exportToPNG.current}>Export as PNG</button>
          <button className="action-btn" onClick={exportToPDF}>Export as PDF</button>
        </div>   
        {/* <label>Minimum Spending:</label>
        <input type="number" onChange={(e) => setFilterValue(e.target.value)} /> */}
        <div className='sorting-control' style={{marginBottom: '10px'}}>
          <label style={{marginRight: '10px'}}>Sort Order:</label>
          <select className='action-select' onChange={(e) => setSortOrder(e.target.value)}>
            <option value="def">Default</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        {/* Interactive form to input or update financial information */}
        <div className='data-editing'>
          <form onSubmit={handleFormSubmit}>
            <label style={{marginRight: '10px'}}>Month:</label>
            <select
              className='action-select'
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{marginRight: '30px'}}
            >
              {data.map((item, index) => (
                <option key={index} value={item.month}>
                  {item.month}
                </option>
              ))}
            </select>

            <label>Spending:</label>
            <input
              type="number"
              value={spendingInput}
              onChange={(e) => setSpendingInput(e.target.value)}
              style={{marginRight: '30px', width: '50px'}}
            />
            <button className="action-btn" type="submit">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MonthlySpendingGraph;
