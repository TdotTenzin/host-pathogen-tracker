/* ---------------------------------------------------------------------------
   Interactive Interactome Network — force-directed graph
   Visualizes the bipartite host-pathogen interaction network: selected
   pathogen's effectors (left) targeting host proteins (right).

   Built client-side from TOOLKIT_DATA.effectors so it works fully offline.
   Uses D3 v7 (loaded from CDN with a local fallback).
   --------------------------------------------------------------------------- */

var _networkGraphRendered = false;
var _networkSim = null;

/* Build a {nodes, edges} graph from TOOLKIT_DATA.effectors for a pathogen */
function _buildNetworkData(pathogenName) {
  var effs = (TOOLKIT_DATA.effectors || []).filter(function(e) {
    return e.pathogen_name === pathogenName;
  });

  var nodes = [];
  var edges = [];
  var nodeById = {};
  var hostSet = {};

  function addNode(id, label, type, opts) {
    if (nodeById[id]) return nodeById[id];
    var n = { id: id, label: label, type: type, degree: 0 };
    if (opts) {
      Object.keys(opts).forEach(function(k) { n[k] = opts[k]; });
    }
    nodeById[id] = n;
    nodes.push(n);
    return n;
  }

  effs.forEach(function(e) {
    var eid = "E:" + e.effector_name;
    var targetList = [e.host_target];
    if (e.host_target) {
      targetList = e.host_target.split(/ \/ | and /).map(function(t) { return t.trim(); });
    }
    targetList = targetList.filter(function(t) { return t; });

    addNode(eid, e.effector_name, "effector", { type: e.type || "", mechanism: e.mechanism || "" });

    targetList.forEach(function(t) {
      var hid = "H:" + t;
      // Don't create host nodes for vague/non-protein targets
      var vague = /membrane|surfaces?|cells?|immune|apoptosis|signal|iron|glycans|DNA|ROS|claudins|adhesion/i.test(t);
      if (vague) return;
      addNode(hid, t, "host");
      edges.push({ source: eid, target: hid });
      nodeById[eid].degree += 1;
      nodeById[hid].degree += 1;
    });
  });

  return { nodes: nodes, edges: edges, pathogens: effs.length ? [pathogenName] : [] };
}

function initNetworkSection() {
  var select = document.getElementById("interactome-select");
  if (!select) return;
  var list = TOOLKIT_DATA.pathogens || [];
  var opts = list.map(function(p) {
    return '<option value="' + _escapeHtml(p.name) + '">' + _escapeHtml(p.name) + '</option>';
  }).join("");
  select.insertAdjacentHTML("beforeend", opts);

  // Default to a famous pathogen
  if (select.value) loadNetworkGraph(select.value);
  else if (list.length) loadNetworkGraph(list[0].name);
}

function loadNetworkGraph(pathogenName) {
  var container = document.getElementById("interactome-graph");
  if (!container) return;

  var placeholder = document.getElementById("select-pathogen-hint");
  if (placeholder) placeholder.style.display = "none";

  var data = _buildNetworkData(pathogenName);
  container.innerHTML = "";

  if (!data.nodes.length) {
    container.innerHTML = "<p class='network-empty'>No effector–host interactions available for this pathogen.</p>";
    return;
  }

  if (typeof d3 === "undefined") {
    container.innerHTML = "<p class='network-empty'>Network visualization requires D3.js, which could not be loaded. Please check your connection.</p>";
    return;
  }

  drawNetwork(container, data, pathogenName);
}

function drawNetwork(container, data, pathogenName) {
  // Clear existing simulation
  if (_networkSim) { _networkSim.stop(); }

  var width = container.clientWidth || 820;
  var height = 560;

  var svg = d3.select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .style("background", "transparent")
    .style("display", "block");

  var defs = svg.append("defs");
  defs.append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 22)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#94a3b8");

  var pathogenIdx = (TOOLKIT_DATA.pathogens || []).findIndex(function(p) { return p.name === pathogenName; });
  var pathogenColor = _colorForPathogen(pathogenName, pathogenIdx < 0 ? 0 : pathogenIdx);

  var links = svg.append("g")
    .attr("class", "network-links")
    .selectAll("line")
    .data(data.edges)
    .enter()
    .append("line")
    .attr("stroke", "#cbd5e1")
    .attr("stroke-opacity", 0.7)
    .attr("stroke-width", 1.2);

  var linkLabels = svg.append("g")
    .attr("class", "network-link-labels")
    .selectAll("text")
    .data(data.edges)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", 9)
    .attr("fill", "#64748b")
    .text("targets")
    .style("display", "none");

  var node = svg.append("g")
    .attr("class", "network-nodes")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("circle")
    .attr("r", function(d) { return d.type === "effector" ? 10 : 8; })
    .attr("fill", function(d) { return d.type === "effector" ? pathogenColor : "#3b82f6"; })
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .style("cursor", "pointer");

  node.append("text")
    .attr("dx", function(d) { return d.type === "effector" ? 14 : -14; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.type === "effector" ? "start" : "end"; })
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", function(d) { return d.type === "effector" ? "#1e293b" : "#2563eb"; })
    .style("paint-order", "stroke")
    .style("stroke", function() {
      return document.documentElement.getAttribute("data-theme") === "dark" ? "#0f172a" : "#ffffff";
    })
    .style("stroke-width", 3)
    .text(function(d) { return d.label; });

  node.append("title")
    .text(function(d) {
      if (d.type === "effector") {
        return d.label + "\nEffector (" + (d.type || "unknown type") + ")\n" + (d.mechanism || "");
      }
      return d.label + "\nHost protein targeted";
    });

  // Tooltip div
  var tooltip = d3.select(container.parentNode)
    .append("div")
    .attr("class", "network-tooltip")
    .style("opacity", 0);

  node.on("mouseover", function(event, d) {
    highlightConnections(d, true);
    tooltip.transition().duration(150).style("opacity", 1);
    tooltip
      .html(_tooltipHTML(d))
      .style("left", (event.pageX + 12) + "px")
      .style("top", (event.pageY - 12) + "px");
  })
  .on("mousemove", function(event) {
    tooltip
      .style("left", (event.pageX + 12) + "px")
      .style("top", (event.pageY - 12) + "px");
  })
  .on("mouseout", function() {
    highlightConnections(null, false);
    tooltip.transition().duration(200).style("opacity", 0);
  });

  function _tooltipHTML(d) {
    var html = "<div class='network-tooltip-title'>" + d.label + "</div>";
    if (d.type === "effector") {
      html += "<div>Type: " + (d.type || "—") + "</div>";
      if (d.mechanism) html += "<div>Mechanism: " + d.mechanism + "</div>";
    } else {
      html += "<div>Targeted by <strong>" + d.degree + "</strong> effector(s)</div>";
    }
    return html;
  }

  function highlightConnections(activeNode, on) {
    node.select("circle").attr("opacity", 1);
    links.attr("stroke-opacity", 0.7).attr("stroke-width", 1.2);

    if (!activeNode) return;
    var connected = {};
    connected[activeNode.id] = true;
    data.edges.forEach(function(e) {
      if (e.source.id === activeNode.id) connected[e.target.id] = true;
      if (e.target.id === activeNode.id) connected[e.source.id] = true;
    });
    node.classed("dimmed", function(d) { return on && !connected[d.id]; });

    links.attr("stroke-opacity", function(d) {
      var adjacent = on && (d.source.id === activeNode.id || d.target.id === activeNode.id);
      return adjacent ? 1 : (on ? 0.15 : 0.7);
    }).attr("stroke-width", function(d) {
      return on && (d.source.id === activeNode.id || d.target.id === activeNode.id) ? 2.5 : 1.2;
    });

    if (on) {
      linkLabels.style("display", function(d) {
        return (d.source.id === activeNode.id || d.target.id === activeNode.id) ? "block" : "none";
      });
    } else {
      linkLabels.style("display", "none");
    }
  }

  var simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.edges).id(function(d) { return d.id; }).distance(120))
    .force("charge", d3.forceManyBody().strength(-320))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(24))
    .force("x", function() {
      var force = d3.forceX(function(d) { return d.type === "effector" ? width * 0.3 : width * 0.7; }).strength(0.12);
      return force;
    }());

  _networkSim = simulation;

  simulation.on("tick", function() {
    // Keep nodes in bounds
    data.nodes.forEach(function(n) {
      n.x = Math.max(20, Math.min(width - 20, n.x));
      n.y = Math.max(20, Math.min(height - 20, n.y));
    });
    links
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
    linkLabels
      .attr("x", function(d) { return (d.source.x + d.target.x) / 2; })
      .attr("y", function(d) { return (d.source.y + d.target.y) / 2; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x; d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }

  _renderNetworkLegend(svg, pathogenName, pathogenColor, width);
}

function _renderNetworkLegend(svg, pathogenName, color, width) {
  var legend = svg.append("g")
    .attr("transform", "translate(0, 14)")
    .attr("class", "network-legend");

  var items = [
    { label: "Effectors (" + pathogenName + ")", color: color, shape: "circle" },
    { label: "Host proteins", color: "#3b82f6", shape: "circle" }
  ];
  var x = 14;
  items.forEach(function(item) {
    var g = legend.append("g").attr("transform", "translate(" + x + ", 0)");
    g.append("circle").attr("r", 5).attr("fill", item.color).attr("stroke", "#fff").attr("stroke-width", 1.5);
    g.append("text")
      .attr("x", 12).attr("y", 4)
      .attr("font-size", 11).attr("fill", "#64748b")
      .text(item.label);
    x += 26 + 10 * item.label.length;
  });

  var stats = legend.append("g").attr("transform", "translate(" + (width - 14) + ", 0)").attr("text-anchor", "end");
  stats.append("text")
    .attr("font-size", 11).attr("fill", "#94a3b8")
    .text("Drag nodes to explore · hover to highlight");
}

// Hook into init
var _origInitToolkit_net = initToolkit;
initToolkit = function() {
  if (_origInitToolkit_net) _origInitToolkit_net();
  initNetworkSection();
};
