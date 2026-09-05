/* ---------------------------------------------------------------------------
   Effector Phylogenetic Tree — interactive dendrogram
   Parses a Newick string and renders an SVG horizontal tree with leaf labels
   colored by pathogen of origin.

   Uses the live API (/api/ml/phylogeny) when available and falls back to
   data baked into fallback.json for offline use.
   --------------------------------------------------------------------------- */

var PHYLO_CONTAINER = null;

function initPhylogeny() {
  PHYLO_CONTAINER = document.getElementById("phylogeny-tree");
  if (!PHYLO_CONTAINER) return;

  var btn = document.getElementById("phylogeny-run-btn");
  if (btn) btn.addEventListener("click", loadPhylogeny);

  // Auto-load from fallback if present
  if (TOOLKIT_DATA.phylogeny) {
    renderPhylogeny(TOOLKIT_DATA.phylogeny);
  }
}

function loadPhylogeny() {
  var btn = document.getElementById("phylogeny-run-btn");
  var status = document.getElementById("phylogeny-status");
  if (btn) { btn.disabled = true; btn.textContent = "Building…"; }
  if (status) status.textContent = "Aligning sequences and constructing tree…";

  fetch("/api/ml/phylogeny")
    .then(function(r) { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
    .then(function(data) {
      if (btn) { btn.disabled = false; btn.textContent = "Rebuild Tree"; }
      if (status) status.textContent = "";
      renderPhylogeny(data);
    })
    .catch(function() {
      if (btn) { btn.disabled = false; btn.textContent = "Rebuild Tree"; }
      if (status) status.textContent = "Live tree unavailable — using built-in data.";
      if (TOOLKIT_DATA.phylogeny) renderPhylogeny(TOOLKIT_DATA.phylogeny);
      else if (PHYLO_CONTAINER) PHYLO_CONTAINER.innerHTML = "<p class='network-empty'>No phylogenetic data available.</p>";
    });
}

/* Parse a Newick string into a nested tree structure */
function parseNewick(s) {
  var tokens = s.replace(/\s+/g, "").split("");
  var stack = [];
  var currentNode = null;
  var currentLabel = "";
  var currentBranch = "";

  var root = { children: [] };

  function attachLabel() {
    if (currentNode) {
      if (currentLabel) currentNode.label = currentLabel;
      if (currentBranch) currentNode.branch_length = parseFloat(currentBranch) || 0;
    }
    currentLabel = "";
    currentBranch = "";
  }

  for (var i = 0; i < tokens.length; i++) {
    var c = tokens[i];
    if (c === "(") {
      var node = { children: [] };
      if (currentNode) {
        stack.push(currentNode);
        currentNode.children.push(node);
      } else {
        root.children.push(node);
      }
      currentNode = node;
      currentLabel = "";
      currentBranch = "";
    } else if (c === ",") {
      attachLabel();
      if (stack.length) {
        currentNode = stack[stack.length - 1];
      }
    } else if (c === ")") {
      attachLabel();
      if (stack.length) {
        var parent = stack.pop();
        if (stack.length) currentNode = stack[stack.length - 1];
        else currentNode = parent;
      }
    } else if (c === ";") {
      attachLabel();
    } else if (c === ":") {
      currentLabel = "";
    } else {
      // Accumulate label or branch length
      if (currentBranch !== "") {
        currentBranch += c;
      } else if (currentLabel !== "") {
        currentLabel += c;
      } else {
        currentLabel += c;
      }
      // Handle ":" splitting label from branch
      if (i + 1 < tokens.length && tokens[i + 1] === ":") {
        // label is complete
      }
    }
  }
  return root;
}

/* Layout a tree: assign x (depth) and y (leaf order) */
function layoutTree(root) {
  var leafCounter = 0;
  function walk(node, depth) {
    node.depth = depth;
    if (!node.children || !node.children.length) {
      node.isLeaf = true;
      node.y = leafCounter;
      leafCounter += 1;
      node.x = depth;
    } else {
      node.isLeaf = false;
      node.children.forEach(function(child) { walk(child, depth + (child.branch_length || 0)); });
      node.y = (node.children[0].y + node.children[node.children.length - 1].y) / 2;
      node.x = Math.max.apply(Math, node.children.map(function(c) { return c.depth; }));
    }
  }
  walk(root, 0);
  return { root: root, n_leaves: leafCounter };
}

/* Map a leaf id (pathogen_effector) back to pathogen + effector for coloring */
function _leafInfo(id, defaultLabel) {
  var idx = id.lastIndexOf("_");
  if (idx <= 0) return { pathogen: "", effector: id, label: defaultLabel || id };
  var pathogen = id.slice(0, idx).replace(/_/g, " ");
  var effector = id.slice(idx + 1);
  return { pathogen: pathogen, effector: effector, label: defaultLabel || effector };
}

function renderPhylogeny(data) {
  if (!PHYLO_CONTAINER) return;
  if (!data || !data.newick) {
    PHYLO_CONTAINER.innerHTML = "<p class='network-empty'>No phylogenetic data available.</p>";
    return;
  }

  var root = parseNewick(data.newick);
  var layout = layoutTree(root);
  var colourMap = data.colour_map || {};

  var maxDepth = 0;
  (function findMax(node) { if (node.depth > maxDepth) maxDepth = node.depth; (node.children || []).forEach(findMax); })(root);

  var width = PHYLO_CONTAINER.clientWidth || 900;
  var padding = { top: 24, bottom: 24, left: 30, right: 230 };
  var height = layout.n_leaves * 18 + padding.top + padding.bottom;
  var innerW = width - padding.left - padding.right;

  function scaleY(y) { return padding.top + y * 18; }
  function scaleX(x) { return padding.left + (x / (maxDepth || 1)) * innerW; }

  PHYLO_CONTAINER.innerHTML = "";
  var svg = d3.select(PHYLO_CONTAINER)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .style("display", "block");

  var link = svg.append("g").attr("class", "phylo-links").attr("fill", "none").attr("stroke", "#cbd5e1").attr("stroke-width", 1.2);

  function drawBranch(node) {
    if (!node.children || !node.children.length) return;
    var parentX = scaleX(node.x);
    var parentY = scaleY(node.y);
    node.children.forEach(function(child) {
      var childX = scaleX(child.x);
      var childY = scaleY(child.y);
      link.append("path")
        .attr("d", "M" + parentX + "," + parentY + " L" + childX + "," + parentY + " L" + childX + "," + childY);
      // branch length label
      if (child.branch_length) {
        svg.append("text")
          .attr("x", (parentX + childX) / 2)
          .attr("y", parentY - 4)
          .attr("font-size", 8)
          .attr("fill", "#94a3b8")
          .attr("text-anchor", "middle")
          .text(child.branch_length.toFixed(child.branch_length < 1 ? 2 : 1));
      }
      drawBranch(child);
    });
  }
  drawBranch(root);

  // Leaves
  var leaves = [];
  (function collect(node, trail) {
    if (!node.children || !node.children.length) {
      node.path = trail;
      leaves.push(node);
    } else {
      node.children.forEach(function(c) { collect(c, trail.concat([node])); });
    }
  })(root, []);

  var leafG = svg.append("g").attr("class", "phylo-leaves");
  var leafNodes = leafG.selectAll("g")
    .data(leaves)
    .enter()
    .append("g")
    .attr("transform", function(d) { return "translate(" + scaleX(d.x) + "," + scaleY(d.y) + ")"; });

  leafNodes.append("circle")
    .attr("r", 3.5)
    .attr("fill", function(d) {
      var info = _leafInfo(d.label || "", d.label);
      return colourMap[info.pathogen] || "#6366f1";
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .style("cursor", "pointer");

  leafNodes.append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("font-size", 10)
    .attr("fill", "#334155")
    .text(function(d) {
      var info = _leafInfo(d.label || "", d.label);
      return info.effector + " · " + info.pathogen;
    });

  leafNodes.append("title")
    .text(function(d) {
      var info = _leafInfo(d.label || "", d.label);
      return info.effector + "\n" + info.pathogen;
    });

  // Legend
  var legend = svg.append("g").attr("transform", "translate(" + (width - padding.right + 16) + ", " + padding.top + ")");
  var legendPathogens = data.pathogens || Object.keys(colourMap);
  legendPathogens.forEach(function(name, i) {
    var g = legend.append("g").attr("transform", "translate(0, " + (i * 16) + ")");
    g.append("circle").attr("r", 3.5).attr("fill", colourMap[name] || "#6366f1");
    g.append("text")
      .attr("x", 10).attr("y", 4)
      .attr("font-size", 9.5).attr("fill", "#64748b")
      .text(name.length > 22 ? name.slice(0, 21) + "…" : name);
  });

  var summary = svg.append("text")
    .attr("x", padding.left).attr("y", 10)
    .attr("font-size", 11).attr("fill", "#64748b")
    .text(data.n_sequences ? data.n_sequences + " effector sequences · Neighbour-Joining (BLOSUM62)" : "Effector tree");

  if (typeof _phyloHoveredNodes === "function") {
    // hook for future interactivity
  }
}

/* Hook into init */
var _origInitToolkit_ph = initToolkit;
initToolkit = function() {
  if (_origInitToolkit_ph) _origInitToolkit_ph();
  initPhylogeny();
};
