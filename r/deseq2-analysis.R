# deseq2-analysis.R
# Differential expression analysis with DESeq2.
#
# Reads the simulated RNA-seq count matrix exported by Python,
# runs the standard DESeq2 workflow, and writes results back
# to r/data/ for downstream use.

# ---- Setup ----
library(DESeq2)
library(dplyr)
library(tidyr)

data_dir <- file.path("r", "data")

# ---- Load data ----
counts <- read.csv(file.path(data_dir, "deseq2_counts.csv"), row.names = 1)
colData <- read.csv(file.path(data_dir, "deseq2_colData.csv"), row.names = 1)

# Ensure condition is a factor with "control" as reference level
colData$condition <- factor(colData$condition, levels = c("control", "infected"))

cat("Count matrix dimensions:", dim(counts), "\n")
cat("Samples:", ncol(counts), "\n")
cat("Conditions:\n")
print(table(colData$condition))

# ---- DESeq2 workflow ----
# 1. Create the DESeqDataSet
dds <- DESeqDataSetFromMatrix(
  countData = counts,
  colData = colData,
  design = ~ condition
)

# 2. Pre-filter: keep genes with at least 10 total counts
keep <- rowSums(counts(dds)) >= 10
dds <- dds[keep, ]
cat("Genes passing filter:", nrow(dds), "\n")

# 3. Run the differential expression pipeline
dds <- DESeq(dds)

# 4. Extract results
res <- results(dds, alpha = 0.05)
res <- res[order(res$padj), ]

cat("\nSignificant DE genes (padj < 0.05):\n")
sig <- res[which(res$padj < 0.05 & !is.na(res$padj)), ]
print(sig)

# ---- Export results ----
write.csv(as.data.frame(res), file.path(data_dir, "deseq2_results.csv"))
write.csv(as.data.frame(sig), file.path(data_dir, "deseq2_significant.csv"))

cat("\nDifferential expression complete.\n")
cat("Results written to r/data/deseq2_results.csv\n")
cat("Significant genes written to r/data/deseq2_significant.csv\n")

# Return the results for interactive use
invisible(res)
