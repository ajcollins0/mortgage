
function clearOldGraph() {
  var delMe = document.querySelector('#graph')
  if (delMe) {
    delMe.parentNode.removeChild(delMe);
    var e2 = document.getElementsByClassName('graphcontent');
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', 'graph');
    e2[0].appendChild(svg);
  }
}


function getData() {
  var r = {}
  return {
    amount: document.getElementById("loanAmt").value,
    interest: document.getElementById("intr").value,
    term: document.getElementById("term").value * 12
  }
  return r;
}

function validateData(d) {
  if (d.amount > 0 && d.interest > 0 && d.term > 0) {
    return true
  }
  return false
}

function showGraph() {
  clearOldGraph();
  inputData = getData();

  if (!validateData(inputData)) {
    alert("Amount, Interest, and Term need to be greater than or equal to 0")
    return;
  }

  var mortgage = AmortizeJS.calculate({
    method: 'mortgage',
    apr: inputData.interest,
    balance: inputData.amount,
    loanTerm: inputData.term,
  });

  // 2. Use the margin convention practice 
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    , width = (window.innerWidth - margin.left - margin.right) / 2 // Use the window's width 
    , height = (window.innerHeight - margin.top - margin.bottom) / 2; // Use the window's height

  // The number of datapoints
  var n = mortgage.schedule.length;

  // 5. X scale will use the index of our data
  var xScale = d3.scaleLinear()
    .domain([0, n - 1]) // input
    .range([0, width]); // output

  // 6. Y scale will use the randomly generate number 
  var yScale = d3.scaleLinear()
    // .domain([0, 1]) // input 
    .domain([0, inputData.amount]) // input 
    .range([height, 0]); // output 

  // 7. d3's line generator
  var line = d3.line()
    .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function (d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

  // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
  var amtData = d3.range(n).map(function (d) { return { "y": mortgage.schedule[d].remainingBalance } })

  // running total of interest paid 
  var ind = mortgage.schedule.reduce(function (r, a) {
    r.push((r.length && r[r.length - 1] || 0) + a.interest);
    return r;
  }, []);
  var intData = d3.range(n).map(function (d) { return { "y": ind[d] } })

  // running total of princData paid 
  var prData = mortgage.schedule.reduce(function (r, a) {
    r.push((r.length && r[r.length - 1] || 0) + a.principal);
    return r;
  }, []);
  var princData = d3.range(n).map(function (d) { return { "y": prData[d] } })

  // 1. Add the SVG to the page and employ #2
  var svg = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 3. Call the x axis in a group tag
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  // 4. Call the y axis in a group tag
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

  // create line for balence data
  svg.append("path")
    .datum(amtData)
    .attr("class", "lineAmt")
    .attr("d", line);

  // create line for interest data
  svg.append("path")
    .datum(intData)
    .attr("class", "lineInt")
    .attr("d", line);

  // create line for princ data
  svg.append("path")
    .datum(princData)
    .attr("class", "linePrinc")
    .attr("d", line);

  // put circles on line when mouse over  
  generateCircles(svg, princData, ".princDot", xScale, yScale, amtData, intData, princData);
  generateCircles(svg, amtData, ".amtDot", xScale, yScale, amtData, intData, princData);
  generateCircles(svg, intData, ".intDot", xScale, yScale, amtData, intData, princData);
}

function generateCircles(svg, dataset, dot, xScale, yScale, amtData, intData, princData) {
  // show circles on points on mouse over for amount
  svg.selectAll(dot)
    .data(dataset)
    .enter().append("circle")
    .attr("class", dot.substring(1))
    .attr("cx", function (d, i) { return xScale(i) })
    .attr("cy", function (d) { return yScale(d.y) })
    .attr("r", 5)
    .attr('opacity', '0')
    .on('mouseover', function (d, i) {
      // show tooltip 
      var tt = document.getElementById("tooltip");
      tt.innerHTML = "Amount: " + amtData[i].y.toFixed(2) + "<br> Int: " + intData[i].y.toFixed(2) + "<br> Principal: " + princData[i].y.toFixed(2);
      tt.style.opacity = '1';
      d3.select(tt).transition()
        .duration('50')
        .attr('opacity', '1');
      // make circle appear 
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '1');
    })
    .on('mouseout', function (d, i) {
      // hide tooltip 
      var tt = document.getElementById("tooltip");
      tt.style.opacity = '0';

      // circle dissapear 
      d3.select(this).transition()
        .duration('50')
        .attr('opacity', '0');
    });
}

function createDivByClass(c) {
  var d = document.createElement("div");
  d.className = c;
  return d;
}

function createInputRow(l, i) {
  var d = createDivByClass("inputRow");
  d.appendChild(l);
  d.appendChild(i);
  return d;
}

function createLabel(t) {
  var l = document.createElement("label");
  l.innerHTML = t;
  return l;
}

function createInputText(id, v) {
  var i = document.createElement("input");
  i.type = "number";
  i.className = "form-control-inline";
  i.id = id;
  i.value = v;
  return i;
}

function createInputArea() {
  var homeVlu = createInputText("HomeVlu", 10000);
  var row1 = createInputRow(createLabel("Home Value"), homeVlu);
  var downPmt = createInputText("downPmnt", 0);
  var row2 = createInputRow(createLabel("Down Payment"), downPmt);
  var loanAmt = createInputText("loanAmt", homeVlu.value - downPmt.value);
  var row3 = createInputRow(createLabel("Loan Amount"), loanAmt);
  downPmt.addEventListener('change', function (e) {
    loanAmt.value = homeVlu.value - downPmt.value 
  });
  homeVlu.addEventListener('change', function (e) {
    loanAmt.value = homeVlu.value - downPmt.value 
  });
  var area = createDivByClass("inputArea");
  area.appendChild(row1);
  area.appendChild(row2);
  area.appendChild(row3);
  return area;
}

function createInputArea2() {
  var row1 = createInputRow(createLabel("Term (In Years)"),
    createInputText("term", 30));
  var row2 = createInputRow(createLabel("Interest"),
    createInputText("intr", 3.5));
  var area = createDivByClass("inputArea");
  area.appendChild(row1);
  area.appendChild(row2);
  return area;
}

function createButton() {
  var b = document.createElement("button");
  b.id = "graphButton";
  b.className = "btn btn-primary";
  b.type = "button";
  b.innerHTML = "Go";
  return b;
}

function createSVG() {
  var d = createDivByClass("graphcontent");
  var s = document.createElement("svg");
  s.id = "graph";
  d.appendChild(s);
  return d;
}

function createToolTip() {
  var s = document.createElement("div");
  s.id = "tooltip";
  s.style.opacity = '0'
  document.getElementById("root").append(s)
  document.addEventListener('mousemove', function (e) {
    s.style.left = e.pageX + 25 + "px";
    s.style.top = e.pageY - 50 - 25 + "px";
  });
}

function render() {
  var root = document.getElementById("root");
  root.className = "content";
  root.appendChild(createInputArea());
  root.appendChild(createInputArea2());
  var c = createDivByClass("inputArea");
  c.appendChild(createButton())
  root.appendChild(c);
  root.appendChild(createSVG());
  createToolTip();
}

render();
document.getElementById("graphButton").addEventListener("click", showGraph);

