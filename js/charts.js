/* charts.js
   Renders interactive Chart.js graphs from R-exported JSON data.
   Falls back to TOOLKIT_DATA when JSON files are unavailable. */

var PATHOGEN_COLORS = {
  "Salmonella enterica":       "#ef4444",
  "Listeria monocytogenes":    "#f97316",
  "Mycobacterium tuberculosis":"#eab308",
  "Legionella pneumophila":    "#22c55e",
  "Shigella flexneri":         "#3b82f6"
};

var PATHOGEN_ORDER = [
  "Salmonella enterica",
  "Listeria monocytogenes",
  "Mycobacterium tuberculosis",
  "Legionella pneumophila",
  "Shigella flexneri"
];

var STRATEGY_LABELS = {
  "modified_compartment": "Modified Compartment",
  "escape":               "Escape to Cytosol",
  "arrest":               "Maturation Arrest",
  "reroute":              "Vesicle Rerouting"
};

var STRATEGY_COLORS = {
  "modified_compartment": "#8b5cf6",
  "escape":               "#ef4444",
  "arrest":               "#eab308",
  "reroute":              "#22c55e"
};

/* ---- Data helpers (always work — no fetch dependency) ---- */

function getEffectorData() {
  var map = {};
  TOOLKIT_DATA.effectors.forEach(function (e) {
    map[e.pathogen_name] = (map[e.pathogen_name] || 0) + 1;
  });
  return PATHOGEN_ORDER.filter(function (p) { return map[p]; })
    .map(function (p) { return { pathogen_name: p, count: map[p] }; });
}

function getPhTimelineData() {
  return TOOLKIT_DATA.maturation_stages.map(function (s) {
    return {
      name: s.name,
      ph_min: s.ph_min,
      ph_max: s.ph_max,
      ph_avg: (s.ph_min + s.ph_max) / 2
    };
  });
}

function getHubData() {
  return TOOLKIT_DATA.hubs;
}

function getStrategyData() {
  var map = {};
  TOOLKIT_DATA.pathogens.forEach(function (p) {
    map[p.strategy] = (map[p.strategy] || 0) + 1;
  });
  return Object.keys(map).map(function (k) {
    return { strategy: k, count: map[k] };
  });
}

function getPathogenActions() {
  return [
    { pathogen: "Mycobacterium tuberculosis", stage: "Early phagosome", ph: 6.25, action: "Arrests maturation" },
    { pathogen: "Salmonella enterica",        stage: "Late phagosome",  ph: 5.25, action: "Modifies compartment" },
    { pathogen: "Listeria monocytogenes",     stage: "Early phagosome", ph: 6.25, action: "Escapes vacuole" },
    { pathogen: "Shigella flexneri",          stage: "Phagosome formation", ph: 7.1, action: "Lyses vacuole" },
    { pathogen: "Legionella pneumophila",     stage: "Phagosome formation", ph: 7.1, action: "Reroutes to ER" }
  ];
}

/* ---- 1. Effector Counts (horizontal bar) ---- */

function renderEffectorChart(data) {
  var canvas = document.getElementById("chart-effectors");
  if (!canvas) return;

  var labels = data.map(function (d) { return d.pathogen_name; });
  var counts = data.map(function (d) { return d.count; });
  var colors = labels.map(function (l) { return PATHOGEN_COLORS[l] || "#6366f1"; });

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        borderRadius: 4
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
            afterLabel: function (ctx) {
              var rows = TOOLKIT_DATA.effectors.filter(function (e) {
                return e.pathogen_name === ctx.label;
              });
              if (!rows.length) return "";
              return rows.map(function (r) { return "  " + r.effector_name; });
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: "Number of Effectors", color: "#64748b" },
          ticks: { stepSize: 1 }
        },
        y: {
          ticks: { font: { weight: "bold" } }
        }
      },
      onClick: function (e, item) {
        if (item && item.length) {
          var name = this.data.labels[item[0].index];
          var sel = document.getElementById("pathogen-select");
          if (sel) {
            sel.value = name;
            if (typeof loadPathogenEffectors === "function") loadPathogenEffectors();
            var tk = document.getElementById("toolkit");
            if (tk) tk.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    },
    plugins: [{
      id: "effectorLabels",
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (ds, i) {
          var meta = chart.getDatasetMeta(i);
          meta.data.forEach(function (bar, idx) {
            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 13px system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(ds.data[idx], bar.x + 6, bar.y);
          });
        });
      }
    }]
  });
}

/* ---- 2. pH Timeline (line chart with shaded range) ---- */

function renderPhTimeline(stages, actions) {
  var canvas = document.getElementById("chart-ph-timeline");
  if (!canvas) return;

  var labels = stages.map(function (s) { return s.name; });
  var avg = stages.map(function (s) { return s.ph_avg; });
  var minV = stages.map(function (s) { return s.ph_min; });
  var maxV = stages.map(function (s) { return s.ph_max; });
  var lysRef = new Array(stages.length).fill(4.5);
  var earlyRef = new Array(stages.length).fill(6.5);
  var annColors = ["#eab308", "#ef4444", "#f97316", "#3b82f6", "#22c55e"];
  var stageShort = {
    "Pre-phagocytosis": "Pre-phago.",
    "Phagosome formation": "Formation",
    "Early phagosome": "Early ph.",
    "Late phagosome": "Late ph.",
    "Phagolysosome": "Phagolysosome"
  };
  var annStage = actions.map(function (a) { return stageShort[a.stage] || a.stage; });

  function makePH(tooltip) {
    var el = document.getElementById("chart-tooltip-ph");
    if (!el) {
      el = document.createElement("div");
      el.id = "chart-tooltip-ph";
      el.style.cssText = "position:fixed;z-index:10000;background:#1e293b;color:#fff;padding:10px 16px;border-radius:10px;font-size:13px;line-height:1.6;pointer-events:none;opacity:0;transition:opacity 0.12s;box-shadow:0 6px 24px rgba(0,0,0,0.35);font-family:system-ui,sans-serif;max-width:320px;border:1px solid rgba(255,255,255,0.08);text-align:left;";
      document.body.appendChild(el);
    }
    return el;
  }

  function showPH(el, html, ctx, t) {
    el.innerHTML = html;
    el.style.opacity = "1";
    var rect = ctx.chart.canvas.getBoundingClientRect();
    var cx = rect.left + t.caretX;
    var cy = rect.top + t.caretY;
    var tw = el.offsetWidth;
    var th = el.offsetHeight;
    var lx = Math.max(6, Math.min(cx - tw / 2, window.innerWidth - tw - 6));
    var ly = cy - th - 14;
    if (ly < 6) ly = cy + 14;
    el.style.left = lx + "px";
    el.style.top = ly + "px";
  }

  var D = {
    RANGE_TOP: 0,
    RANGE_BOT: 1,
    AVG: 2,
    LYS: 3,
    ERLY: 4,
    PATH: 5
  };

  new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "pH range top",
          data: maxV,
          borderWidth: 0,
          pointRadius: 0,
          fill: false
        },
        {
          label: "pH range fill",
          data: minV,
          backgroundColor: "rgba(99,102,241,0.08)",
          borderWidth: 0,
          pointRadius: 0,
          fill: "-1"
        },
        {
          label: "pH (average)",
          data: avg,
          borderColor: "#6366f1",
          borderWidth: 3,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointHoverBorderWidth: 3,
          tension: 0.35,
          fill: false
        },
        {
          label: "pH 4.5 — Phagolysosome",
          data: lysRef,
          borderColor: "#dc2626",
          borderDash: [7, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        },
        {
          label: "pH 6.5 — Early phagosome",
          data: earlyRef,
          borderColor: "#2563eb",
          borderDash: [7, 5],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        },
        {
          label: "Pathogen intervention",
          data: actions.map(function (a) {
            return { x: a.stage, y: a.ph };
          }),
          backgroundColor: annColors.slice(0, actions.length),
          borderColor: annColors.slice(0, actions.length),
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointHoverBorderWidth: 3,
          pointHoverBorderColor: "#ffffff",
          pointStyle: "rectRot",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: "easeOutQuart" },
      hover: {
        mode: "nearest",
        intersect: true
      },
      plugins: {
        legend: {
          labels: {
            filter: function (item) {
              return item.text.indexOf("pH range") === -1;
            },
            font: { size: 11 },
            padding: 14,
            usePointStyle: true,
            pointStyle: "line"
          }
        },
        tooltip: {
          enabled: false,
          external: function (ctx) {
            var el = makePH(ctx);
            var t = ctx.tooltip;
            if (t.opacity === 0) { el.style.opacity = "0"; return; }
            var dp = t.dataPoints && t.dataPoints[0];
            if (!dp) return;
            var di = dp.datasetIndex;
            var idx = dp.dataIndex;
            var html = "";
            if (di === D.PATH) {
              var a = actions[idx];
              if (a) {
                var effs = TOOLKIT_DATA.effectors.filter(function (e) {
                  return e.pathogen_name === a.pathogen;
                }).map(function (e) { return e.effector_name; }).join(", ");
                html = "<b>" + a.pathogen + "</b><br>"
                  + "<span style=\"color:#94a3b8\">" + a.stage + " &middot; pH " + a.ph + "</span><br>"
                  + a.action
                  + (effs ? "<br><span style=\"font-size:11px;color:#94a3b8\">Effectors: " + effs + "</span>" : "");
              }
            } else if (di === D.LYS) {
              html = "Phagolysosome pH 4.5";
            } else if (di === D.ERLY) {
              html = "Early phagosome pH 6.5";
            } else if (di === D.AVG) {
              var s = stages[idx];
              if (s) html = "<b>" + s.name + "</b><br>pH " + s.ph_min + " \u2013 " + s.ph_max;
            }
            if (html) showPH(el, html, ctx, t);
          }
        }
      },
      scales: {
        y: {
          min: 3.5,
          max: 8.0,
          title: {
            display: true,
            text: "pH",
            color: "#64748b",
            font: { size: 13, weight: "600" }
          },
          ticks: {
            callback: function (v) { return v.toFixed(1); },
            color: "#94a3b8",
            font: { size: 11 }
          },
          grid: {
            color: "rgba(148,163,184,0.12)",
            drawBorder: false
          }
        },
        x: {
          ticks: {
            font: { size: 10, weight: "600" },
            color: "#64748b",
            maxRotation: 25,
            minRotation: 20
          },
          grid: { display: false }
        }
      }
    },
    plugins: [{
      id: "phLabels",
      afterDraw: function (chart) {
        var ctx = chart.ctx;
        var meta = chart.getDatasetMeta(D.PATH);
        if (!meta || !meta.data) return;

        var groups = {};
        meta.data.forEach(function (pt, i) {
          var xKey = Math.round(pt.x);
          if (!groups[xKey]) groups[xKey] = [];
          groups[xKey].push({ pt: pt, i: i });
        });

        ctx.textAlign = "center";

        Object.keys(groups).forEach(function (xKey) {
          var items = groups[xKey];
          var stageText = annStage[items[0].i];
          var topY = Infinity;
          items.forEach(function (item) {
            if (item.pt.y < topY) topY = item.pt.y;
          });
          ctx.font = "700 11px system-ui, sans-serif";
          ctx.fillStyle = "#334155";
          ctx.textBaseline = "bottom";
          ctx.fillText(stageText, items[0].pt.x, topY - 10);
        });
      }
    }]
  });
}

/* ---- 3. Hub Proteins (horizontal bar) ---- */

function renderHubChart(data) {
  var canvas = document.getElementById("chart-hubs");
  if (!canvas) return;

  var top6 = data.slice(0, 6);
  var labels = top6.map(function (d) { return d.host; });
  var vals = top6.map(function (d) { return d.degree; });

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        data: vals,
        backgroundColor: "#6366f1",
        borderRadius: 4
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
            label: function (ctx) { return "Targeted by " + ctx.raw + " effectors"; }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: "Effectors Targeting", color: "#64748b" },
          ticks: { stepSize: 1 }
        },
        y: {
          ticks: { font: { weight: "bold" } }
        }
      }
    },
    plugins: [{
      id: "hubLabels",
      afterDatasetsDraw: function (chart) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (ds, i) {
          var meta = chart.getDatasetMeta(i);
          meta.data.forEach(function (bar, idx) {
            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 13px system-ui, sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(ds.data[idx], bar.x + 6, bar.y);
          });
        });
      }
    }]
  });
}

/* ---- 4. Strategy Distribution (doughnut) ---- */

function renderStrategyChart(data) {
  var canvas = document.getElementById("chart-strategy");
  if (!canvas) return;

  var labels = data.map(function (d) { return STRATEGY_LABELS[d.strategy] || d.strategy; });
  var counts = data.map(function (d) { return d.count; });
  var colors = data.map(function (d) { return STRATEGY_COLORS[d.strategy] || "#6366f1"; });

  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { padding: 16, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            afterLabel: function (ctx) {
              var strategyKey = data[ctx.dataIndex].strategy;
              return TOOLKIT_DATA.pathogens
                .filter(function (p) { return p.strategy === strategyKey; })
                .map(function (p) { return "  " + p.name; })
                .join("\n");
            }
          }
        }
      }
    }
  });
}

/* ---- Init ---- */

function initCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded — skipping interactive graphs");
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCharts);
} else {
  initCharts();
}
