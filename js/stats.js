/* ---------------------------------------------------------------------------
   Stats — pure-JavaScript math engine for the "My Data" tools.
   No external dependencies: descriptive stats, correlation, PCA (Jacobi
   eigendecomposition), k-means, OLS regression, a two-sample t-test, and
   hypergeometric over-representation (pathway enrichment).
   --------------------------------------------------------------------------- */

(function (global) {
  "use strict";

  function toNum(v) {
    if (v === null || v === undefined || v === "") return NaN;
    if (typeof v === "number") return v;
    var n = parseFloat(String(v).replace(/[,\s]/g, ""));
    return isNaN(n) ? NaN : n;
  }

  function sum(arr) {
    var s = 0;
    for (var i = 0; i < arr.length; i++) s += arr[i];
    return s;
  }

  function mean(arr) {
    return arr.length ? sum(arr) / arr.length : NaN;
  }

  function median(arr) {
    if (!arr.length) return NaN;
    var a = arr.slice().sort(function (x, y) { return x - y; });
    var mid = Math.floor(a.length / 2);
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
  }

  function percentile(arr, p) {
    if (!arr.length) return NaN;
    var a = arr.slice().sort(function (x, y) { return x - y; });
    var rank = p * (a.length - 1);
    var lo = Math.floor(rank);
    var hi = Math.ceil(rank);
    return a[lo] + (rank - lo) * (a[hi] - a[lo]);
  }

  function std(arr, ddof) {
    if (arr.length < 2) return 0;
    var m = mean(arr);
    var sse = 0;
    for (var i = 0; i < arr.length; i++) sse += (arr[i] - m) * (arr[i] - m);
    return Math.sqrt(sse / (arr.length - (ddof === 0 ? 0 : 1)));
  }

  function describe(values) {
    var nums = values.filter(function (v) { return !isNaN(toNum(v)); }).map(toNum);
    return {
      count: nums.length,
      missing: values.length - nums.length,
      mean: nums.length ? mean(nums) : null,
      median: nums.length ? median(nums) : null,
      std: nums.length ? std(nums, 1) : null,
      min: nums.length ? Math.min.apply(Math, nums) : null,
      max: nums.length ? Math.max.apply(Math, nums) : null,
      q1: nums.length ? percentile(nums, 0.25) : null,
      q3: nums.length ? percentile(nums, 0.75) : null
    };
  }

  function corr(a, b) {
    var n = Math.min(a.length, b.length);
    var ax = [], bx = [];
    for (var i = 0; i < n; i++) {
      var av = toNum(a[i]), bv = toNum(b[i]);
      if (!isNaN(av) && !isNaN(bv)) { ax.push(av); bx.push(bv); }
    }
    if (ax.length < 2) return null;
    var am = mean(ax), bm = mean(bx);
    var num = 0, denA = 0, denB = 0;
    for (var j = 0; j < ax.length; j++) {
      var da = ax[j] - am, db = bx[j] - bm;
      num += da * db; denA += da * da; denB += db * db;
    }
    var den = Math.sqrt(denA * denB);
    return den === 0 ? null : num / den;
  }

  function correlationMatrix(columns, rows) {
    // rows: array of arrays of numeric values (one per column)
    var n = columns.length;
    var matrix = [];
    for (var i = 0; i < n; i++) {
      matrix.push([]);
      for (var j = 0; j < n; j++) matrix[i].push(null);
    }
    for (i = 0; i < n; i++) matrix[i][i] = 1;
    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        var cA = rows.map(function (r) { return r[i]; });
        var cB = rows.map(function (r) { return r[j]; });
        var r = corr(cA, cB);
        matrix[i][j] = r;
        matrix[j][i] = r;
      }
    }
    return { columns: columns, matrix: matrix };
  }

  /* -----------------------------------------------------------------------
     PCA — covariance eigendecomposition via the Jacobi rotation algorithm.
     data: rows x cols numeric matrix. Returns scores (rows x nComp), the
     explained-variance ratios, loadings, and mean/std used to scale.
     ----------------------------------------------------------------------- */
  function jacobiEigen(sym) {
    var n = sym.length;
    var A = sym.map(function (row) { return row.slice(); });
    var V = [];
    for (var i2 = 0; i2 < n; i2++) {
      V.push([]);
      for (var j2 = 0; j2 < n; j2++) V[i2].push(i2 === j2 ? 1 : 0);
    }
    var maxIter = 100 * n * n;
    for (var iter = 0; iter < maxIter; iter++) {
      var p = 0, q = 1, max = 0;
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          var v = Math.abs(A[i][j]);
          if (v > max) { max = v; p = i; q = j; }
        }
      }
      if (max < 1e-15) break;

      var app = A[p][p], aqq = A[q][q], apq = A[p][q];
      var theta = (aqq - app) / (2 * apq);
      var t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      var c = 1 / Math.sqrt(t * t + 1);
      var s = t * c;

      for (var k = 0; k < n; k++) {
        var akp = A[k][p], akq = A[k][q];
        A[k][p] = c * akp - s * akq;
        A[p][k] = A[k][p];
        A[k][q] = s * akp + c * akq;
        A[q][k] = A[k][q];
      }
      A[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
      A[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
      A[p][q] = 0; A[q][p] = 0;

      for (k = 0; k < n; k++) {
        var vkp = V[k][p], vkq = V[k][q];
        V[k][p] = c * vkp - s * vkq;
        V[k][q] = s * vkp + c * vkq;
      }
    }

    var order = [];
    for (var idx = 0; idx < n; idx++) order.push(idx);
    order.sort(function (a, b) { return A[b][b] - A[a][a]; });

    var values = order.map(function (o) { return A[o][o]; });
    var vectors = order.map(function (o) {
      var vec = [];
      for (var r = 0; r < n; r++) vec.push(V[r][o]);
      return vec;
    });
    return { values: values, vectors: vectors };
  }

  function pca(data, nComp) {
    var n = data.length;
    if (!n || !data[0]) return null;
    var d = data[0].length;
    if (d > 64) d = 64; // client-side guard; larger matrices can use the API
    var nC = Math.max(1, Math.min(nComp || 2, Math.min(n, d)));

    var cols = [];
    for (var c = 0; c < d; c++) {
      var vals = data.map(function (r) { return toNum(r[c]); });
      cols.push({ mean: mean(vals) || 0, std: std(vals, 0) || 1, vals: vals });
    }

    // covariance matrix of standardized data
    var cov = [];
    for (var i = 0; i < d; i++) {
      cov.push([]);
      for (var j = 0; j < d; j++) {
        var s = 0;
        for (var k = 0; k < n; k++) s += ((cols[i].vals[k] - cols[i].mean) / cols[i].std) * ((cols[j].vals[k] - cols[j].mean) / cols[j].std);
        cov[i].push(s / Math.max(n - 1, 1));
      }
    }

    var eig = jacobiEigen(cov);
    var explained = eig.values.slice(0, nC);
    var totalVar = eig.values.reduce(function (a, b) { return a + Math.max(b, 0); }, 0) || 1;

    var scores = [], loadings = [];
    for (var pc = 0; pc < nC; pc++) {
      loadings.push(eig.vectors[pc]);
    }
    for (var r = 0; r < n; r++) {
      var row = [];
      for (pc = 0; pc < nC; pc++) {
        var vec = eig.vectors[pc];
        var val = 0;
        for (var f = 0; f < d; f++) val += ((cols[f].vals[r] - cols[f].mean) / cols[f].std) * vec[f];
        row.push(round4(val));
      }
      scores.push(row);
    }
    return {
      scores: scores,
      explained: explained.map(function (v) { return round4(Math.max(v, 0) / totalVar); }),
      cumulative: round4(explained.slice(0, nC).reduce(function (a, b) { return a + Math.max(b, 0); }, 0) / totalVar),
      loadings: loadings,
      n_components: nC
    };
  }

  /* -----------------------------------------------------------------------
     k-means clustering (k-means++ initialization; Lloyd iterations).
     ----------------------------------------------------------------------- */
  function kmeans(data, k, iterations) {
    var n = data.length;
    if (!n || !data[0]) return null;
    var d = data[0].length;
    k = Math.max(1, Math.min(k || 3, n));
    var iters = iterations || 100;

    // standardize columns so distance isn't dominated by scale
    var cols = [];
    for (var c = 0; c < d; c++) {
      var vals = data.map(function (r) { return toNum(r[c]); });
      cols.push({ mean: mean(vals) || 0, std: std(vals, 0) || 1 });
    }
    var X = data.map(function (r) {
      var out = [];
      for (var j = 0; j < d; j++) out.push((toNum(r[j]) - cols[j].mean) / cols[j].std);
      return out;
    });

    // k-means++ initialization
    var centers = [];
    var first = Math.floor(Math.random() * n);
    centers.push(X[first].slice());
    while (centers.length < k) {
      var dists = X.map(function (p) {
        var bd = Infinity;
        centers.forEach(function (ctr) { bd = Math.min(bd, distSq(p, ctr)); });
        return bd;
      });
      var total = sum(dists);
      var r = Math.random() * total;
      var idx = 0, acc = 0;
      for (idx = 0; idx < n; idx++) { acc += dists[idx]; if (acc >= r) break; }
      centers.push(X[Math.min(idx, n - 1)].slice());
    }

    var assign = new Array(n).fill(0);
    for (var it = 0; it < iters; it++) {
      // assign
      var changed = false;
      for (var i2 = 0; i2 < n; i2++) {
        var bd2 = Infinity, bi = 0;
        for (var ci = 0; ci < k; ci++) {
          var dd = distSq(X[i2], centers[ci]);
          if (dd < bd2) { bd2 = dd; bi = ci; }
        }
        if (assign[i2] !== bi) { assign[i2] = bi; changed = true; }
      }
      // update centers
      var sums = [], counts = new Array(k).fill(0);
      for (var c2 = 0; c2 < k; c2++) sums.push(new Array(d).fill(0));
      for (i2 = 0; i2 < n; i2++) {
        var cl = assign[i2];
        counts[cl]++;
        for (var f = 0; f < d; f++) sums[cl][f] += X[i2][f];
      }
      for (ci = 0; ci < k; ci++) {
        if (counts[ci] === 0) continue;
        for (f = 0; f < d; f++) centers[ci][f] = sums[ci][f] / counts[ci];
      }
      if (!changed) break;
    }

    var inertia = 0;
    for (i2 = 0; i2 < n; i2++) inertia += distSq(X[i2], centers[assign[i2]]);
    return { assignments: assign, centers: centers, inertia: inertia, k: k };
  }

  function distSq(a, b) {
    var s = 0;
    for (var i = 0; i < a.length; i++) { var dd = a[i] - b[i]; s += dd * dd; }
    return s;
  }

  /* -----------------------------------------------------------------------
     OLS regression — Gaussian elimination on the normal equations.
     y: dependent values, xs: [ [x1,...], ... ] rows of predictors.
     ----------------------------------------------------------------------- */
  function solveLinear(A, b) {
    var n = A.length;
    var M = [];
    for (var i = 0; i < n; i++) M.push(A[i].concat([b[i]]));
    for (var col = 0; col < n; col++) {
      var pivot = col;
      for (var r = col + 1; r < n; r++) {
        if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
      }
      if (Math.abs(M[pivot][col]) < 1e-15) return null;
      var tmp = M[col]; M[col] = M[pivot]; M[pivot] = tmp;
      var diag = M[col][col];
      for (var j = 0; j <= n; j++) M[col][j] /= diag;
      for (r = 0; r < n; r++) {
        if (r === col) continue;
        var f = M[r][col];
        for (j = 0; j <= n; j++) M[r][j] -= f * M[col][j];
      }
    }
    return M.map(function (row) { return row[n]; });
  }

  function ols(y, xs) {
    var n = y.length;
    var p = xs.length;
    if (p < 1) return null;
    var X = [];
    var res = [];
    for (var i = 0; i < n; i++) {
      var row = [1];
      for (var j = 0; j < p; j++) row.push(xs[j][i]);
      X.push(row);
    }
    var Xt = transpose(X);
    var XtX = matMul(Xt, X);
    var XtY = Xt.map(function (r) {
      return r.reduce(function (acc, v, k) { return acc + v * y[k]; }, 0);
    });
    var coefs = solveLinear(XtX, XtY);
    if (!coefs) return null;
    var pred = X.map(function (r) {
      var s = 0;
      for (var j = 0; j < r.length; j++) s += r[j] * (coefs[j] || 0);
      return s;
    });
    var ssRes = 0, ssTot = 0;
    var ym = mean(y);
    for (i = 0; i < n; i++) {
      ssRes += (y[i] - pred[i]) * (y[i] - pred[i]);
      ssTot += (y[i] - ym) * (y[i] - ym);
    }
    var r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
    var coefficients = {};
    for (j = 0; j < p; j++) coefficients["x" + (j + 1)] = round4(coefs[j + 1]);
    return { intercept: round4(coefs[0]), coefficients: coefficients, r2: round4(r2), predicted: pred, residuals: y.map(function (v, k) { return v - pred[k]; }) };
  }

  function transpose(m) {
    if (!m.length) return [];
    var out = [];
    for (var j = 0; j < m[0].length; j++) {
      out.push([]);
      for (var i = 0; i < m.length; i++) out[j].push(m[i][j]);
    }
    return out;
  }

  function matMul(a, b) {
    if (!a.length || !b.length) return [];
    var res = [];
    for (var i = 0; i < a.length; i++) {
      res.push([]);
      for (var j = 0; j < b[0].length; j++) {
        var s = 0;
        for (var k = 0; k < a[i].length; k++) s += a[i][k] * b[k][j];
        res[i].push(s);
      }
    }
    return res;
  }

  /* -----------------------------------------------------------------------
     Welch's t-test (two independent groups).
     ----------------------------------------------------------------------- */
  function ttest2(a, b) {
    var na = a.length, nb = b.length;
    if (na < 2 || nb < 2) return null;
    var ma = mean(a), mb = mean(b);
    var va = std(a, 1) * std(a, 1), vb = std(b, 1) * std(b, 1);
    var se = Math.sqrt(va / na + vb / nb);
    if (se === 0) return null;
    var t = (ma - mb) / se;
    var df = Math.pow(va / na + vb / nb, 2) /
      (Math.pow(va / na, 2) / (na - 1) + Math.pow(vb / nb, 2) / (nb - 1));
    return { t: round4(t), df: round4(df), p: round4(twoTailedT(t, df)), mean_a: round4(ma), mean_b: round4(mb) };
  }

  // Approximate two-tailed p-value for Student's t using a continued-fraction
  // expansion of the incomplete beta function (Numerical Recipes betai).
  function betacf(a, b, x) {
    var MAXIT = 100, EPS = 3e-12, FPMIN = 1e-300;
    var qab = a + b, qap = a + 1, qam = a - 1;
    var c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= MAXIT; m++) {
      var m2 = 2 * m;
      var aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      var del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }

  function betai(a, b, x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var ln = gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x);
    var bt = Math.exp(ln);
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }

  function gammaln(xx) {
    var cof = [
      76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
    ];
    var y = xx, x = xx, tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    var ser = 1.000000000190015;
    for (var j = 0; j < 6; j++) ser += cof[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function twoTailedT(t, df) {
    var x = df / (df + t * t);
    var beta = betai(df / 2, 0.5, x);
    return beta; // = P(|T| > t) for the two-sided test
  }

  /* -----------------------------------------------------------------------
     Hypergeometric over-representation (pathway enrichment).
     Mirrors src/hostpathogen/enrichment.py.
     ----------------------------------------------------------------------- */
  function comb(N, k) {
    if (k < 0 || k > N) return 0;
    k = Math.min(k, N - k);
    var result = 1;
    for (var i = 0; i < k; i++) result = result * (N - i) / (i + 1);
    return result;
  }

  function hypergeomSF(k, N, K, n) {
    if (k <= 0) return 1;
    var upper = Math.min(n, K);
    var denom = comb(N, n);
    var sum = 0;
    for (var i = Math.max(0, k); i <= upper; i++) {
      sum += comb(K, i) * comb(N - K, n - i);
    }
    return Math.min(sum / denom, 1);
  }

  function enrichment(geneList, pathwayDb) {
    var observed = {};
    geneList.forEach(function (g) { observed[String(g).trim()] = true; });
    var genes = Object.keys(observed).filter(function (g) { return Boolean(g); });
    var n = genes.length;
    if (n === 0) return [];

    var background = {};
    Object.keys(pathwayDb).forEach(function (pw) {
      pathwayDb[pw].forEach(function (m) { background[String(m).trim()] = true; });
    });
    var N = Object.keys(background).length;

    var numTests = 0;
    Object.keys(pathwayDb).forEach(function (pw) {
      var hit = false;
      pathwayDb[pw].forEach(function (m) { if (observed[String(m).trim()]) hit = true; });
      if (hit) numTests++;
    });

    var results = [];
    Object.keys(pathwayDb).forEach(function (pw) {
      var members = pathwayDb[pw];
      var K = members.length;
      var hits = members.filter(function (m) { return observed[String(m).trim()]; });
      var k = hits.length;
      if (k === 0) return;
      var pVal = hypergeomSF(k, N, K, n);
      var pAdj = Math.min(pVal * Math.max(numTests, 1), 1);
      results.push({
        pathway: pw,
        ratio: k + "/" + K,
        observed_in_list: k,
        pathway_size: K,
        p_value: round6(pVal),
        p_adjusted: round6(pAdj),
        members_hit: hits.slice().sort()
      });
    });
    results.sort(function (a, b) { return a.p_value - b.p_value; });
    return results;
  }

  function round4(v) { return Math.round(v * 10000) / 10000; }
  function round6(v) { return Math.round(v * 1000000) / 1000000; }

  function standardize(rows) {
    if (!rows.length) return [];
    var d = rows[0].length;
    var cols = [];
    for (var c = 0; c < d; c++) {
      var vals = rows.map(function (r) { return toNum(r[c]); });
      cols.push({ mean: mean(vals) || 0, std: std(vals, 0) || 1 });
    }
    return rows.map(function (r) {
      var out = [];
      for (var j = 0; j < d; j++) out.push((toNum(r[j]) - cols[j].mean) / cols[j].std);
      return out;
    });
  }

  global.Stats = {
    toNum: toNum,
    sum: sum,
    mean: mean,
    median: median,
    percentile: percentile,
    std: std,
    describe: describe,
    corr: corr,
    correlationMatrix: correlationMatrix,
    pca: pca,
    kmeans: kmeans,
    ols: ols,
    ttest2: ttest2,
    comb: comb,
    hypergeomSF: hypergeomSF,
    enrichment: enrichment,
    standardize: standardize,
    transpose: transpose
  };
})(window);