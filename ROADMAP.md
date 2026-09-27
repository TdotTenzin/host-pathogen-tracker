# PathoMap — Roadmap

**Nothing on this page is built.** It records the intended direction of the
project so the reasoning is not lost, and so the boundaries of v0.4 are
explicit. For what the site actually does today, read [`README.md`](README.md).

---

## Where the project is now (v0.4)

A browsable curated dataset. The site leads with a **Database** section —
Pathogens, Effectors, Host Proteins, Interactions and Maturation Stages as
sortable, filterable tables — and everything else on the page is a derived view
over those same rows.

Deliberately **not** part of v0.4:

- No data import. The curated 54 pathogens are the product.
- No Help or Glossary page.
- No genome, pangenome, sequence-tool, or organism-compare layers.
- No ecology layer — see Workstream 1 below.
- R analyses stay in the repository and are not surfaced on the site.

The v0.4 line was drawn around one question: *what does this dataset actually
contain, and can a student interrogate it?* Everything that was not answering
that question was removed rather than stubbed.

---

## Workstream 1 — Ecology *(the primary axis)*

This is the intended centre of gravity, and the largest open piece of work.

The current dataset says **who infects whom and what they target**. It says
nothing about **where an organism lives** — the environmental context that
actually explains why particular effectors and strategies are selected for in
the first place. Adding habitat would turn a curated interaction catalogue into
an explanation of lifestyle.

Proposed shape:

- `niches` table: environment metadata per organism (habitat, temperature and
  pH range, oxygenation, nutrient regime, transmission mode).
- Link organisms to niches, so a niche can be asked *which pathogens exploit it*.
- A controlled vocabulary for habitat terms, so labels are queryable rather than
  free text.
- An **Ecology** section that answers practical student questions: *which
  strategies cluster in acidic environments? what does a soil pathogen target
  that a mucosal one does not?*

**Why it is first.** It is the only planned workstream that adds a genuinely new
*kind* of data rather than more of the same. Genome and pangenome layers are
subtractive — they refine pathogen identity. Ecology is additive, and it is the
axis the project name already promises.

## Workstream 2 — Genome data acquisition *(unblocks 3, 4, 5)*

Pull genome records for the 54 curated organisms so the site can link sequence
data to the interaction data it already has. Depends on choosing a source
(RefSeq, Ensembl Bacteria) and a fetch cadence; the refresh script already has
an optional external-fetch path.

## Workstream 3 — Pangenome *(unblocks 5)*

Core-genome vs accessory-genome comparison across the 54 organisms. This is the
step that would explain *variation within* a species rather than between
species, and it needs Workstream 2 first.

## Workstream 4 — Organism vs organism compare

Side-by-side comparison of any two organisms in the dataset: shared vs
pathogen-specific effectors, divergent host targets, strategy differences. With
Workstream 2 in place this becomes a proper homology comparison rather than a
name-level diff.

## Workstream 5 — Taxonomy

Wire the existing species and lineage fields into a browsable taxonomic
hierarchy, so the dataset can be navigated by clade instead of by name.

## Workstream 6 — Sequence tools

Alignment and motif search over the effector protein sequences that already
back the phylogeny section.

---

## Known problems carried forward

Not yet addressed, in rough priority order:

1. **Host protein granularity is uneven.** Some `host_proteins` rows are
   single proteins (`Rab7`), others are compartments (`Host membranes`,
   `Cholesterol`, `Actin`). Centrality metrics partly reflect that
   inconsistency — a compartment absorbs many effectors at once. The interaction
   network's 150 records collapse to 135 graph edges for the same reason.
2. **The classifier is weak, and the site says so.** Cross-validated accuracy on
   the evasion-strategy task is ~37% across 5 classes. That is above chance but
   not useful for prediction, and the ML section presents it as a measurement
   rather than a claim. (The numbers were briefly *unrealistically* good because
   the offline payload copied the label into `predicted` and derived
   `confidence` from a hash; that is fixed — predictions are now genuine
   out-of-fold output.)
3. **Only 57 of the 72 host proteins appear in the network**, and 123 of 250
   effectors have no `effector_targets` row. Interactions are sparser than the
   effectors table implies.
4. **`n_effectors` is derived, not stored.** It is computed by a `COUNT` at
   query time and attached in three separate places (SQL in the API, Python in
   the export, and again in the browser). It should be a SQL view or a generated
   column so there is one definition.
5. **Phylogeny rests on a very small matrix.** The effector tree is built from
   a handful of sequences; branch labels are not well supported.
6. **Frontend coverage is one module deep.** `js/database.js` now has a headless
   test suite (`tests/frontend/database_checks.js`, run via pytest), but
   `charts.js`, `network.js`, `ml-plots.js` and `phylogeny.js` are still
   unprotected — they only run in a browser. A DOM testing library would let the
   same harness cover them.
7. **Host protein records mix two granularities.** See item 1; a `kind` column
   separating single proteins from compartments would make the centrality
   numbers interpretable.

## Deferred indefinitely

- The bring-your-own-data import pipeline (removed in v0.4) and its
  statistics/correlation/clustering/regression/heatmap/differential-expression
  tools.
- A help or glossary page.
- User accounts, saved datasets, or any server-side persistence.
