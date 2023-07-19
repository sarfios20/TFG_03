import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

onAuthStateChanged(auth, async (user) => {
    if (user) {
        numeroAvisosRecibidos()
        numeroAvisosEmitidos()
    }
})

function numeroAvisosRecibidos() {
    let avisosRecibidos = document.getElementById('avisos-recibidos');
    const dbRef = ref(database, '/Alertas/Conductor/' + auth.currentUser.uid);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const timestamps = Object.keys(data).map(Number); // Convert timestamps to numbers
      avisosRecibidos.innerHTML = `nº avisos recibidos: ${timestamps.length}`;
  
      // Call a function to create the line chart using timestamps array
      createLineChart(timestamps, "chart-recibidos");
    });
  }

function numeroAvisosEmitidos() {
    let avisosRecibidos = document.getElementById('avisos-emitidos');
    const dbRef = ref(database, '/Alertas/Ciclista/' + auth.currentUser.uid);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const timestamps = Object.keys(data).map(Number); // Convert timestamps to numbers
      avisosRecibidos.innerHTML = `nº avisos emitidos: ${timestamps.length}`;
  
      // Call a function to create the line chart using timestamps array
      createLineChart(timestamps, "chart-emitidos");
    });
}

function createLineChart(timestamps, targetElementId) {
  // Set up the dimensions and margins for the chart
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };  // Increase bottom margin to make room for rotated labels
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Parse timestamps into date objects
  const dates = timestamps.map((timestamp) => new Date(timestamp));

  // Group timestamps by week
  const weekData = d3.group(dates, d3.timeWeek);

  // Calculate the number of alerts per week
  const weekCounts = Array.from(weekData.values(), (week) => week.length);

  // Generate the weeks array
  const weeks = Array.from(weekData.keys());

  // Create the x and y scales
  const xScale = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(weeks));

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(weekCounts)]);

  // Create the line generator
  const line = d3
    .line()
    .x((d, i) => xScale(weeks[i]))
    .y((d, i) => yScale(weekCounts[i]));

  // Create the SVG container
  const svg = d3
      .select(`#${targetElementId}`)
      .append("svg")
      // Add these lines to make the SVG responsive
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add the line to the chart
  svg
    .append("path")
    .datum(weeks)
    .attr("class", "line")
    .attr("d", line);

  // Add the x-axis with week format
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)")
    .style("font-size", "12px");  // Increase or decrease as needed

  // Add the y-axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("font-size", "12px");  // Increase or decrease as needed
}
  
  