# enrichment.R
# Pathway enrichment analysis for host proteins.
#
# Takes a gene list (e.g. significant DE genes from deseq2-analysis.R
# or host proteins targeted by a specific pathogen) and tests each
# pathway for over-representation using a hypergeometric test.
#
# This mirrors the Python enrichment.py module, but in R.

# ---- Setup ----
library(dplyr)
library(tidyr)
library(ggplot2)

data_dir <- file.path("r", "data")

# ---- Helper: hypergeometric enrichment ----
# Tests whether the overlap between 'gene_list' and a pathway's
# member set is larger than expected by chance.
overrepresentation_test <- function(gene_list, pathway_members, background_size) {
  k <- length(intersect(gene_list, pathway_members))  # hits in gene list
  n <- length(gene_list)                               # total genes tested
  K <- length(pathway_members)                         # pathway size
  N <- background_size                                 # universe size

  if (k == 0) return(1.0)

  # phyper(q-1, K, N-K, n, lower.tail=FALSE) gives P(X >= q)
  p_val <- phyper(k - 1, K, N - K, n, lower.tail = FALSE)
  return(p_val)
}

# ---- Load data ----
# Pathway database: protein -> pathway mapping from our curated data
pathway_db <- read.csv(file.path(data_dir, "pathway_db.csv"))

# Build pathway member lists
pathway_members <- split(pathway_db$name, pathway_db$pathway)

# Background: total distinct proteins in our database
all_proteins <- unique(pathway_db$name)
background_size <- length(all_proteins)

cat("Pathway database loaded:", length(pathway_members), "pathways\n")
cat("Background proteins:", background_size, "\n\n")

# ---- Load DE results ----
# Use the DE results or fall back to a default gene list
de_file <- file.path(data_dir, "deseq2_significant.csv")
if (file.exists(de_file)) {
  de_results <- read.csv(de_file)
  # Get gene names from the row names
  de_genes <- rownames(de_results)
  cat("Using DE genes from deseq2_significant.csv:", length(de_genes), "genes\n")
} else {
  # Fall back: use host proteins targeted by Salmonella
  de_genes <- c("SKIP", "Actin", "Kinesin-1", "Cholesterol", "Rab7", "Cdc42", "Rac1")
  cat("Using default test list:", length(de_genes), "genes\n")
}

# ---- Run enrichment ----
results <- data.frame(
  pathway = character(),
  ratio = character(),
  p_value = numeric(),
  p_adjusted = numeric(),
  members_hit = character(),
  stringsAsFactors = FALSE
)

for (pwy in names(pathway_members)) {
  members <- pathway_members[[pwy]]
  p_val <- overrepresentation_test(de_genes, members, background_size)

  k <- length(intersect(de_genes, members))
  if (k > 0) {
    results <- rbind(results, data.frame(
      pathway = pwy,
      ratio = paste0(k, "/", length(members)),
      p_value = p_val,
      p_adjusted = pmin(p_val * length(pathway_members), 1.0),  # Bonferroni
      members_hit = paste(intersect(de_genes, members), collapse = ", "),
      stringsAsFactors = FALSE
    ))
  }
}

# Sort by p-value
results <- results[order(results$p_value), ]

cat("\n=== Enrichment Results ===\n")
print(results, row.names = FALSE)

# ---- Export ----
write.csv(results, file.path(data_dir, "enrichment_results.csv"), row.names = FALSE)
cat("\nResults written to r/data/enrichment_results.csv\n")

# ---- Plot ----
if (nrow(results) > 0) {
  p <- ggplot(head(results, 10), aes(x = reorder(pathway, -log10(p_value)), y = -log10(p_value))) +
    geom_col(fill = "#6366f1") +
    coord_flip() +
    labs(
      title = "Pathway Enrichment",
      x = "Pathway",
      y = "-log10(p-value)"
    ) +
    theme_minimal()

  ggsave(file.path(data_dir, "enrichment_plot.png"), p, width = 8, height = 5)
  cat("Plot saved to r/data/enrichment_plot.png\n")
}

invisible(results)
