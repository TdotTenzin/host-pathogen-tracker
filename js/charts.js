var CHART_COLORS = [
  "#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899",
  "#14b8a6","#f43f5e","#a855f7","#06b6d4","#84cc16","#d946ef","#0ea5e9",
  "#10b981","#f59e0b","#6366f1","#d97706","#059669","#0284c7","#dc2626",
  "#7c3aed","#db2777","#0891b2","#65a30d","#9333ea","#2563eb","#ca8a04",
  "#16a34a","#4f46e5","#c026d3","#0d9488"
];

var STRATEGY_LABELS = {
  "modified_compartment": "Modified Compartment",
  "escape": "Escape to Cytosol",
  "arrest": "Maturation Arrest",
  "reroute": "Vesicle Rerouting",
  "extracellular": "Extracellular"
};

var STRATEGY_COLORS = {
  "modified_compartment": "#8b5cf6",
  "escape":               "#ef4444",
  "arrest":               "#eab308",
  "reroute":              "#22c55e",
  "extracellular":        "#3b82f6"
};

function _colorForPathogen(name, idx) {
  if (typeof idx === "undefined") {
    idx = (TOOLKIT_DATA.pathogens || []).findIndex(function(p) { return p.name === name; });
  }
  return CHART_COLORS[idx % CHART_COLORS.length];
}

function getEffectorData() {
  var map = {};
  (TOOLKIT_DATA.effectors || []).forEach(function(e) {
    map[e.pathogen_name] = (map[e.pathogen_name] || 0) + 1;
  });
  return Object.keys(map).sort().map(function(name) {
    return { pathogen_name: name, count: map[name] };
  });
}

function getPhTimelineData() {
  return (TOOLKIT_DATA.maturation_stages || []).map(function(s) {
    return {
      name: s.name,
      ph_min: s.ph_min,
      ph_max: s.ph_max,
      ph_avg: (s.ph_min + s.ph_max) / 2
    };
  });
}

function getHubData() {
  return TOOLKIT_DATA.hubs || [];
}

function getStrategyData() {
  var map = {};
  (TOOLKIT_DATA.pathogens || []).forEach(function(p) {
    map[p.strategy] = (map[p.strategy] || 0) + 1;
  });
  return Object.keys(map).map(function(k) {
    return { strategy: k, count: map[k] };
  });
}

function getPathogenActions() {
  if (TOOLKIT_DATA.pathogen_actions) return TOOLKIT_DATA.pathogen_actions;
  // Generate actions from pathogen strategies if not pre-computed
  // Uses shared STRATEGY_TO_STAGE mapping from API (single source of truth)
  var actions = [];
  var stageLookup = {};
  (TOOLKIT_DATA.maturation_stages || []).forEach(function(s) {
    stageLookup[s.stage_order] = s;
  });
  var stageMap = typeof STRATEGY_TO_STAGE !== "undefined"
    ? STRATEGY_TO_STAGE
    : { extracellular: 0, escape: 1, arrest: 2, modified_compartment: 3, reroute: 1 };
  (TOOLKIT_DATA.pathogens || []).forEach(function(p) {
    var order = stageMap[p.strategy] !== undefined ? stageMap[p.strategy] : 0;
    var s = stageLookup[order];
    if (s) {
      actions.push({ pathogen: p.name, stage: s.name, ph: (s.ph_min + s.ph_max) / 2, action: p.strategy });
    }
  });
  TOOLKIT_DATA.pathogen_actions = actions;
  return actions;
}

function _strategyOrder(strat) {
  var order = ["extracellular", "escape", "arrest", "modified_compartment", "reroute"];
  var idx = order.indexOf(strat);
  return idx >= 0 ? idx : 999;
}

function _getGroupRanges(sortedLabels, sortMeta) {
  var ranges = [];
  var currentGroup = null;
  var startIdx = 0;
  for (var i = 0; i < sortMeta.length; i++) {
    var g = sortMeta[i].strategy;
    if (g !== currentGroup) {
      if (currentGroup !== null) {
        ranges.push({ strategy: currentGroup, start: startIdx, end: i - 1 });
      }
      currentGroup = g;
      startIdx = i;
    }
  }
  ranges.push({ strategy: currentGroup, start: startIdx, end: sortMeta.length - 1 });
  return ranges;
}

function renderEffectorChart(rawData) {
  var canvas = document.getElementById("chart-effectors");
  if (!canvas) return;

  // Sort: group by strategy, then by count descending
  var pathogenMap = {};
  (TOOLKIT_DATA.pathogens || []).forEach(function(p) { pathogenMap[p.name] = p; });
  var sorted = rawData.slice().sort(function(a, b) {
    var sa = pathogenMap[a.pathogen_name] ? pathogenMap[a.pathogen_name].strategy : "unknown";
    var sb = pathogenMap[b.pathogen_name] ? pathogenMap[b.pathogen_name].strategy : "unknown";
    var oa = _strategyOrder(sa), ob = _strategyOrder(sb);
    if (oa !== ob) return oa - ob;
    return b.count - a.count;
  });

  var labels = sorted.map(function(d) { return d.pathogen_name; });
  var counts = sorted.map(function(d) { return d.count; });
  var sortMeta = sorted.map(function(d) {
    return { strategy: pathogenMap[d.pathogen_name] ? pathogenMap[d.pathogen_name].strategy : "unknown" };
  });
  var colors = sorted.map(function(d) {
    var s = pathogenMap[d.pathogen_name] ? pathogenMap[d.pathogen_name].strategy : "unknown";
    return STRATEGY_COLORS[s] || "#6366f1";
  });
  var groupRanges = _getGroupRanges(labels, sortMeta);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: colors.map(function(c) { return c + "CC"; }),
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var s = sortMeta[ctx.dataIndex] ? sortMeta[ctx.dataIndex].strategy : "";
              return " " + ctx.raw + " effectors  [" + s + "]";
            },
            afterLabel: function(ctx) {
              var rows = (TOOLKIT_DATA.effectors || []).filter(function(e) {
                return e.pathogen_name === ctx.label;
              });
              if (!rows.length) return "";
              return rows.map(function(r) { return "  " + r.effector_name; });
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: "Number of Effectors", color: "#64748b", font: { size: 12 } },
          ticks: { stepSize: 1, font: { size: 11 } }
        },
        y: {
          ticks: {
            font: { size: 10 },
            autoSkip: false
          }
        }
      },
      onClick: function(e, item) {
        if (item && item.length) {
          var name = this.data.labels[item[0].index];
          var sel = document.getElementById("pathogen-select");
          if (sel) {
            sel.value = name;
            if (typeof loadPathogenEffectors === "function") loadPathogenEffectors();
            var tk = document.getElementById("toolkit");
            if (tk) tk.scrollIntoView();
          }
        }
      }
    },
    plugins: [{
      id: "effectorGroupHeaders",
      beforeDraw: function(chart) {
        var ctx = chart.ctx;
        var yScale = chart.scales.y;
        var xScale = chart.scales.x;
        var meta = chart.getDatasetMeta(0);

        // Draw alternating group backgrounds
        var bgColors = ["rgba(148,163,184,0.06)", "rgba(148,163,184,0.03)"];
        groupRanges.forEach(function(grp, gi) {
          var firstIdx = grp.start;
          var lastIdx = grp.end;
          if (firstIdx >= meta.data.length) return;
          var top = meta.data[firstIdx].y - 6;
          var bottom = meta.data[lastIdx].y + 6;
          ctx.fillStyle = bgColors[gi % 2];
          ctx.fillRect(xScale.left, top, xScale.right - xScale.left, bottom - top);
        });

        // Draw group separator lines
        for (var si = 1; si < groupRanges.length; si++) {
          var sepIdx = groupRanges[si].start;
          if (sepIdx < meta.data.length) {
            ctx.strokeStyle = "rgba(148,163,184,0.25)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(xScale.left, meta.data[sepIdx].y + 6);
            ctx.lineTo(xScale.right, meta.data[sepIdx].y + 6);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      },
      afterDraw: function(chart) {
        var ctx = chart.ctx;
        var yScale = chart.scales.y;
        var xScale = chart.scales.x;
        var meta = chart.getDatasetMeta(0);

        // Draw strategy group labels on the right margin
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        groupRanges.forEach(function(grp) {
          var firstIdx = grp.start;
          var lastIdx = grp.end;
          if (firstIdx >= meta.data.length) return;
          var midY = (meta.data[firstIdx].y + meta.data[lastIdx].y) / 2;
          ctx.fillStyle = STRATEGY_COLORS[grp.strategy] || "#64748b";
          ctx.font = "700 10px system-ui, sans-serif";
          ctx.fillText(STRATEGY_LABELS[grp.strategy] || grp.strategy, chart.width - 8, midY);
        });
      },
      afterDatasetsDraw: function(chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function(ds, i) {
          var meta = chart.getDatasetMeta(i);
          meta.data.forEach(function(bar, idx) {
            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 11px system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(ds.data[idx], bar.x + 4, bar.y);
          });
        });
      }
    }]
  });
}

function _pathogenStrategy(name) {
  var p = (TOOLKIT_DATA.pathogens || []).find(function(x) { return x.name === name; });
  return p ? p.strategy : "unknown";
}

function renderPhTimeline(stages, actions) {
  var canvas = document.getElementById("chart-ph-timeline");
  if (!canvas) return;

  var stageNames = stages.map(function(s) { return s.name; });
  var strategyKeys = ["extracellular", "escape", "arrest", "modified_compartment", "reroute"];

  // Per-stage x per-strategy count
  var countMap = {};
  stages.forEach(function(s) {
    countMap[s.name] = {};
    strategyKeys.forEach(function(k) { countMap[s.name][k] = 0; });
  });
  actions.forEach(function(a) {
    var strat = _pathogenStrategy(a.pathogen);
    if (countMap[a.stage] && countMap[a.stage][strat] !== undefined) {
      countMap[a.stage][strat]++;
    }
  });

  // One dataset per strategy (order matches legend)
  var datasets = strategyKeys.filter(function(k) {
    return stages.some(function(s) { return countMap[s.name][k] > 0; });
  });
  if (datasets.length === 0) datasets = strategyKeys.slice(0, 1);
  var chartDatasets = datasets.map(function(key) {
    return {
      label: STRATEGY_LABELS[key] || key,
      data: stages.map(function(s) { return countMap[s.name][key] || 0; }),
      backgroundColor: STRATEGY_COLORS[key] || "#6366f1",
      borderColor: "#ffffff",
      borderWidth: 1,
      borderRadius: 0
    };
  });

  // Total per stage
  var stageTotals = stages.map(function(s) {
    return strategyKeys.reduce(function(sum, k) { return sum + (countMap[s.name][k] || 0); }, 0);
  });
  var maxStageTotal = stageTotals.reduce(function(max, total) {
    return total > max ? total : max;
  }, 0);
  var suggestedYMax = maxStageTotal > 0 ? maxStageTotal + Math.max(2, Math.ceil(maxStageTotal * 0.15)) : 5;

  new Chart(canvas, {
    type: "bar",
    data: { labels: stageNames, datasets: chartDatasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      layout: {
        padding: {
          top: 18,
          bottom: 26
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { size: 11 }, padding: 14, usePointStyle: true, pointStyle: "rectRounded" }
        },
        tooltip: {
          callbacks: {
            title: function(items) { return items[0].label; },
            label: function(ctx) {
              var total = stageTotals[ctx.dataIndex];
              var pct = total > 0 ? " (" + Math.round(ctx.raw / total * 100) + "%)" : "";
              return ctx.dataset.label + ": " + ctx.raw + pct;
            },
            afterFooter: function(items) {
              var idx = items[0].dataIndex;
              var total = stageTotals[idx];
              return "Total: " + total + " pathogens";
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            font: { size: 10, weight: "600" },
            color: "#64748b",
            maxRotation: 15,
            minRotation: 15
          },
          grid: { display: false }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          suggestedMax: suggestedYMax,
          title: { display: true, text: "Number of pathogens", color: "#64748b", font: { size: 12 } },
          ticks: { stepSize: 1, font: { size: 11 } },
          grid: { color: "rgba(148,163,184,0.12)", drawBorder: false }
        }
      }
    },
    plugins: [{
      id: "phTotalLabels",
      afterDraw: function(chart) {
        var ctx = chart.ctx;
        var xScale = chart.scales.x;
        var yScale = chart.scales.y;
        ctx.font = "700 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        stages.forEach(function(s, i) {
          var total = stageTotals[i];
          var xPos = xScale.getPixelForValue(i);
          if (total > 0) {
            var topY = null;
            chartDatasets.forEach(function(ds, di) {
              var meta = chart.getDatasetMeta(di);
              if (meta && meta.data[i]) {
                var bt = meta.data[i].y;
                if (topY === null || bt < topY) topY = bt;
              }
            });
            if (topY !== null) {
              ctx.fillStyle = "#1e293b";
              ctx.fillText(total + " pathogens", xPos, topY - 6);
            }
          } else {
            // Empty stage — dim "0" at baseline
            ctx.fillStyle = "#94a3b8";
            ctx.font = "700 11px system-ui, sans-serif";
            ctx.textBaseline = "bottom";
            ctx.fillText("No intervention", xPos, yScale.bottom - 4);
            ctx.font = "700 12px system-ui, sans-serif";
          }
        });

        // Draw pH range below each x-axis tick label
        ctx.font = "9px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#64748b";
        stages.forEach(function(s, i) {
          var xPos = xScale.getPixelForValue(i);
          var tickBottom = chart.chartArea.bottom + 28;
          ctx.fillText("pH " + s.ph_min.toFixed(1) + "\u2013" + s.ph_max.toFixed(1), xPos, tickBottom);
        });
      }
    }]
  });
}

function renderHubChart(data) {
  var canvas = document.getElementById("chart-hubs");
  if (!canvas) return;
  var top6 = data.slice(0, 6);
  var labels = top6.map(function(d) { return d.host; });
  var vals = top6.map(function(d) { return d.degree; });
  new Chart(canvas, {
    type: "bar", data: { labels: labels, datasets: [{ data: vals, backgroundColor: "#6366f1", borderRadius: 4 }] },
    options: {
      indexAxis: "y", responsive: true, maintainAspectRatio: false,
      layout: {
        padding: {
          right: 28
        }
      },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { return "Targeted by " + ctx.raw + " effectors"; } } } },
      scales: {
        x: { beginAtZero: true, title: { display: true, text: "Effectors Targeting", color: "#64748b" }, ticks: { stepSize: 1 } },
        y: { ticks: { font: { weight: "bold" } } }
      }
    },
    plugins: [{
      id: "hubLabels",
      afterDatasetsDraw: function(chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function(ds, i) {
          var meta = chart.getDatasetMeta(i);
          meta.data.forEach(function(bar, idx) {
            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 13px system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            var label = String(ds.data[idx]);
            var labelWidth = ctx.measureText(label).width;
            var x = Math.min(bar.x + 6, chart.chartArea.right - labelWidth - 4);
            ctx.fillText(label, x, bar.y);
          });
        });
      }
    }]
  });
}

function renderStrategyChart(data) {
  var canvas = document.getElementById("chart-strategy");
  if (!canvas) return;
  var labels = data.map(function(d) { return STRATEGY_LABELS[d.strategy] || d.strategy; });
  var counts = data.map(function(d) { return d.count; });
  var colors = data.map(function(d) { return STRATEGY_COLORS[d.strategy] || "#6366f1"; });
  new Chart(canvas, {
    type: "doughnut",
    data: { labels: labels, datasets: [{ data: counts, backgroundColor: colors, borderColor: "#ffffff", borderWidth: 3 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: "55%",
      plugins: {
        legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            afterLabel: function(ctx) {
              var strategyKey = data[ctx.dataIndex].strategy;
              return (TOOLKIT_DATA.pathogens || [])
                .filter(function(p) { return p.strategy === strategyKey; })
                .map(function(p) { return "  " + p.name; })
                .join("\n");
            }
          }
        }
      }
    }
  });
}

function initCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded \u2014 skipping interactive graphs");
    return;
  }
  try {
    renderEffectorChart(getEffectorData());
    renderPhTimeline(getPhTimelineData(), getPathogenActions());
    renderHubChart(getHubData());
    renderStrategyChart(getStrategyData());
  } catch (e) {
    console.error("Chart render error:", e);
  }
}
