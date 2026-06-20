var TOOLKIT_DATA = {
  "pathogens": [
    {
      "name": "Legionella pneumophila",
      "species": "Legionella pneumophila",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Redirects ER-derived vesicles to build LCV; bypasses endocytic pathway entirely via Dot/Icm T4SS"
    },
    {
      "name": "Listeria monocytogenes",
      "species": "Listeria monocytogenes",
      "gram_stain": "Gram-positive",
      "strategy": "escape",
      "description": "Phagosomal escape via LLO within ~30 min; replicates in cytosol; uses ActA for actin-based motility"
    },
    {
      "name": "Mycobacterium tuberculosis",
      "species": "Mycobacterium tuberculosis",
      "gram_stain": "Acid-fast",
      "strategy": "arrest",
      "description": "Arrests phagosome at early stage; blocks Rab5-to-Rab7 conversion; maintains near-neutral pH"
    },
    {
      "name": "Salmonella enterica",
      "species": "Salmonella enterica serovar Typhimurium",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Resides in SCV; acquires LAMP1 but blocks hydrolase delivery; maintains non-degradative niche"
    },
    {
      "name": "Shigella flexneri",
      "species": "Shigella flexneri",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Rapid phagosome lysis (<15 min) via IpaB pore; escapes to cytosol before early markers fully acquired"
    }
  ],
  "effectors": [
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "AnkX",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1 / Rab35",
      "mechanism": "FIC domain phosphocholinase; locks Rabs in inactive membrane-bound state"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "DrrA / SidM",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "GEF and GDF for Rab1; also AMPylates Rab1; recruits COPII vesicles to LCV"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "Lem3",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "Dephosphocholinase that reverses AnkX modification; temporal control"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "LidA",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "Binds active Rab1; protects it from host GAPs; stabilizes LCV Rab1 pool"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "SidD",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "DeAMPylase that reverses DrrA AMPylation of Rab1"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "ActA",
      "type": "Surface protein",
      "host_target": "Arp2/3",
      "mechanism": "Mimics host WASP; nucleates branched actin for motility"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "InlA",
      "type": "Invasin",
      "host_target": "E-cadherin",
      "mechanism": "Binds E-cadherin to trigger zipper-mediated entry"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "InlB",
      "type": "Invasin",
      "host_target": "Met receptor",
      "mechanism": "Binds Met receptor; triggers PI3K and Rac1 signaling for entry"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "LLO",
      "type": "Toxin",
      "host_target": "Cholesterol",
      "mechanism": "Pore-forming cytolysin; pH-dependent (active at acidic pH); mediates phagosome escape"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "LAM",
      "type": "Glycolipid",
      "host_target": "Vps34",
      "mechanism": "Inhibits Ca2+ signaling; blocks Vps34 recruitment preventing PI3P production"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "MptpA",
      "type": "Secreted phosphatase",
      "host_target": "V-ATPase",
      "mechanism": "Blocks V-ATPase trafficking to phagosome; prevents acidification"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "MptpB",
      "type": "Secreted phosphatase",
      "host_target": "PI(3,5)P2",
      "mechanism": "Hydrolyzes PI(3"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "SapM",
      "type": "Secreted phosphatase",
      "host_target": "PI3P",
      "mechanism": "Dephosphorylates PI3P on phagosomal membrane; blocks Rab5-to-Rab7 conversion"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "PipB2",
      "type": "T3SS (SPI-2)",
      "host_target": "Kinesin-1",
      "mechanism": "Recruits kinesin-1 to SCV; extends Salmonella-induced filaments"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SifA",
      "type": "T3SS (SPI-2)",
      "host_target": "SKIP",
      "mechanism": "Binds SKIP displacing Rab9; blocks M6PR delivery; maintains SCV integrity"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SipA",
      "type": "T3SS (SPI-1)",
      "host_target": "Actin",
      "mechanism": "Binds and stabilizes actin filaments; enhances entry ruffling"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SopB / SigD",
      "type": "T3SS (SPI-1)",
      "host_target": "PI(4,5)P2",
      "mechanism": "Phosphatidylinositol phosphatase; depletes PI(4"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SopD2",
      "type": "T3SS (SPI-2)",
      "host_target": "Rab7",
      "mechanism": "Suppresses Rab7-dependent recruitment of lysosomal hydrolases"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SopE",
      "type": "T3SS (SPI-1)",
      "host_target": "Cdc42 / Rac1",
      "mechanism": "GEF for host Rho-family GTPases; triggers actin ruffling"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SseJ",
      "type": "T3SS (SPI-2)",
      "host_target": "Cholesterol",
      "mechanism": "Acyltransferase that esterifies cholesterol; modulates SCV membrane"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IcsA / VirG",
      "type": "Autotransporter",
      "host_target": "N-WASP / Arp2/3",
      "mechanism": "Recruits N-WASP and Arp2/3; drives actin-based motility"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IcsB",
      "type": "T3SS",
      "host_target": "LC3",
      "mechanism": "Masks IcsA from autophagy receptor LC3; prevents septin cage entrapment"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IpaB",
      "type": "T3SS (translocon)",
      "host_target": "Vacuolar membrane",
      "mechanism": "Pore-forming translocator; mediates phagosome lysis; also activates caspase-1"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IpaC",
      "type": "T3SS (translocon)",
      "host_target": "Actin",
      "mechanism": "Induces actin polymerization for entry; co-forms translocon pore with IpaB"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "VirA",
      "type": "T3SS",
      "host_target": "Rab1",
      "mechanism": "Rab1 GAP activity; facilitates escape from LC3-positive vacuoles during spread"
    }
  ],
  "host_proteins": [
    {
      "name": "Actin",
      "full_name": "Beta-actin",
      "function": "Globular protein polymerizing into filaments; major cytoskeleton component",
      "localization": "Cytoskeleton",
      "pathway": "Actin polymerization"
    },
    {
      "name": "Arp2/3",
      "full_name": "Actin-related protein 2/3 complex",
      "function": "Nucleates branched actin filaments; hijacked by Listeria ActA and Shigella IcsA",
      "localization": "Cytoskeleton",
      "pathway": "Actin polymerization"
    },
    {
      "name": "CR3",
      "full_name": "Complement receptor 3 (integrin alpha-M beta-2)",
      "function": "Phagocytic receptor used by M. tuberculosis for entry",
      "localization": "Plasma membrane",
      "pathway": "Phagocytosis"
    },
    {
      "name": "Cdc42",
      "full_name": "Cell division control protein 42",
      "function": "Rho-family GTPase regulating actin dynamics and cell polarity",
      "localization": "Plasma membrane / Cytosol",
      "pathway": "Rho signaling"
    },
    {
      "name": "Cholesterol",
      "full_name": "Cholesterol",
      "function": "Membrane lipid; target of LLO pore formation and SseJ esterification",
      "localization": "Membrane",
      "pathway": "Lipid metabolism"
    },
    {
      "name": "E-cadherin",
      "full_name": "Cadherin-1",
      "function": "Cell-cell adhesion molecule; used by Listeria InlA for entry",
      "localization": "Plasma membrane",
      "pathway": "Cell adhesion"
    },
    {
      "name": "EEA1",
      "full_name": "Early endosome antigen 1",
      "function": "PI3P-binding tethering factor for early endosome fusion",
      "localization": "Early endosome",
      "pathway": "Endocytosis"
    },
    {
      "name": "Galectin-3",
      "full_name": "LGALS3",
      "function": "Binds exposed beta-galactosides on damaged vacuolar membranes",
      "localization": "Cytosol / Nucleus",
      "pathway": "Membrane damage response"
    },
    {
      "name": "Kinesin-1",
      "full_name": "Kinesin heavy chain",
      "function": "Plus-end-directed microtubule motor; recruited by PipB2 for SIF extension",
      "localization": "Microtubule",
      "pathway": "Vesicular transport"
    },
    {
      "name": "LAMP1",
      "full_name": "Lysosomal-associated membrane protein 1",
      "function": "Lysosomal membrane integrity and stability",
      "localization": "Lysosome",
      "pathway": "Lysosome biogenesis"
    },
    {
      "name": "LC3",
      "full_name": "MAP1LC3B",
      "function": "Autophagy receptor recruited to ubiquitin-coated pathogens; marker for xenophagy",
      "localization": "Cytosol",
      "pathway": "Autophagy"
    },
    {
      "name": "M6PR",
      "full_name": "Mannose-6-phosphate receptor",
      "function": "Transports hydrolases from Golgi to lysosomes",
      "localization": "Golgi / Late endosome",
      "pathway": "Lysosome biogenesis"
    },
    {
      "name": "Mannose receptor",
      "full_name": "C-type lectin receptor",
      "function": "Recognizes mannosylated ligands; alternative M. tuberculosis entry route",
      "localization": "Plasma membrane",
      "pathway": "Phagocytosis"
    },
    {
      "name": "Met receptor",
      "full_name": "Hepatocyte growth factor receptor",
      "function": "Receptor tyrosine kinase; used by Listeria InlB for entry",
      "localization": "Plasma membrane",
      "pathway": "Receptor signaling"
    },
    {
      "name": "N-WASP",
      "full_name": "Neural Wiskott-Aldrich syndrome protein",
      "function": "Activates Arp2/3; recruited by Shigella IcsA for actin motility",
      "localization": "Cytoskeleton",
      "pathway": "Actin polymerization"
    },
    {
      "name": "Nucleolin",
      "full_name": "Nucleolin",
      "function": "Multifunctional protein; binds IcsA?",
      "localization": "Nucleus / Cytosol",
      "pathway": "\u2014"
    },
    {
      "name": "ORP1L",
      "full_name": "Oxysterol-binding protein-related protein 1",
      "function": "Rab7 effector; cholesterol sensing at ER contacts",
      "localization": "Late endosome",
      "pathway": "Cholesterol metabolism"
    },
    {
      "name": "PI(3,5)P2",
      "full_name": "Phosphatidylinositol 3,5-bisphosphate",
      "function": "Late endosome signaling lipid; hydrolyzed by MptpB",
      "localization": "Late endosome membrane",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "PI(4,5)P2",
      "full_name": "Phosphatidylinositol 4,5-bisphosphate",
      "function": "Plasma membrane signaling lipid; hydrolyzed during phagocytosis",
      "localization": "Plasma membrane",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "PI3P",
      "full_name": "Phosphatidylinositol 3-phosphate",
      "function": "Signaling lipid marking early endosome identity",
      "localization": "Endosome membrane",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "RILP",
      "full_name": "Rab7-interacting lysosomal protein",
      "function": "Rab7 effector recruiting dynein-dynactin motors",
      "localization": "Late endosome",
      "pathway": "Endocytosis"
    },
    {
      "name": "Rab1",
      "full_name": "Ras-related protein Rab-1A",
      "function": "ER-to-Golgi vesicular transport",
      "localization": "ER / Golgi",
      "pathway": "Secretory pathway"
    },
    {
      "name": "Rab35",
      "full_name": "Ras-related protein Rab-35",
      "function": "Endocytic recycling and actin dynamics",
      "localization": "Plasma membrane / Endosome",
      "pathway": "Endocytic recycling"
    },
    {
      "name": "Rab5",
      "full_name": "Ras-related protein Rab-5A",
      "function": "Early endosome identity; recruits effectors for fusion and PI3P production",
      "localization": "Early endosome",
      "pathway": "Endocytosis"
    },
    {
      "name": "Rab7",
      "full_name": "Ras-related protein Rab-7A",
      "function": "Late endosome identity; recruits RILP for dynein-mediated lysosome transport",
      "localization": "Late endosome / Lysosome",
      "pathway": "Endocytosis"
    },
    {
      "name": "Rab9",
      "full_name": "Ras-related protein Rab-9A",
      "function": "M6PR recycling from late endosomes to TGN",
      "localization": "Late endosome",
      "pathway": "Retrograde transport"
    },
    {
      "name": "Rac1",
      "full_name": "Ras-related C3 botulinum toxin substrate 1",
      "function": "Rho-family GTPase regulating actin polymerization and membrane ruffling",
      "localization": "Plasma membrane / Cytosol",
      "pathway": "Rho signaling"
    },
    {
      "name": "SKIP",
      "full_name": "PLEKHM2 (SifA and kinesin-interacting protein)",
      "function": "Adaptor linking kinesin-1 and Rab9; target of Salmonella SifA",
      "localization": "Late endosome",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Septin",
      "full_name": "Septin family",
      "function": "GTP-binding cytoskeletal proteins forming cage-like structures; entrap cytosolic Shigella",
      "localization": "Cytoskeleton",
      "pathway": "Autophagy / cytoskeleton"
    },
    {
      "name": "V-ATPase",
      "full_name": "Vacuolar-type H+-ATPase",
      "function": "Proton pump that acidifies phagosomes and lysosomes",
      "localization": "Phagosome / Lysosome",
      "pathway": "Acidification"
    },
    {
      "name": "Vacuolar membrane",
      "full_name": "Vacuolar membrane",
      "function": "Generic term for the phagosomal membrane targeted by IpaB pore formation",
      "localization": "Phagosome",
      "pathway": "\u2014"
    },
    {
      "name": "Vps34",
      "full_name": "Class III PI3-kinase",
      "function": "Produces PI3P on early endosomes; recruited by Rab5",
      "localization": "Early endosome",
      "pathway": "Phosphoinositide signaling"
    }
  ],
  "maturation_stages": [
    {
      "stage_order": 0,
      "name": "Pre-phagocytosis",
      "time_range": "T=0",
      "ph_min": 7.2,
      "ph_max": 7.4,
      "description": "Extracellular pathogen free in tissue or bloodstream before host cell encounter"
    },
    {
      "stage_order": 1,
      "name": "Phagosome formation",
      "time_range": "0-2 min",
      "ph_min": 7.0,
      "ph_max": 7.2,
      "description": "Receptor engagement and actin-driven membrane cup formation around particle"
    },
    {
      "stage_order": 2,
      "name": "Early phagosome",
      "time_range": "2-15 min",
      "ph_min": 6.0,
      "ph_max": 6.5,
      "description": "Rab5-positive compartment; begins acquiring endosomal markers"
    },
    {
      "stage_order": 3,
      "name": "Late phagosome",
      "time_range": "15-45 min",
      "ph_min": 5.0,
      "ph_max": 5.5,
      "description": "Rab7-positive; LAMP1 acquired; preparing for lysosomal fusion"
    },
    {
      "stage_order": 4,
      "name": "Phagolysosome",
      "time_range": ">45 min",
      "ph_min": 4.0,
      "ph_max": 5.0,
      "description": "Fully acidified degradative compartment with active hydrolases"
    }
  ],
  "stage_markers": [
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "EEA1",
      "presence": 0
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "LAMP1",
      "presence": 0
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "PI(4,5)P2",
      "presence": 1
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "PI3P",
      "presence": 0
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "RILP",
      "presence": 0
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "Rab5",
      "presence": 0
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "Rab7",
      "presence": 0
    },
    {
      "stage_name": "Pre-phagocytosis",
      "host_protein_name": "V-ATPase",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "Actin",
      "presence": 1
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "EEA1",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "LAMP1",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "PI(4,5)P2",
      "presence": 1
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "PI3P",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "RILP",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "Rab5",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "Rab7",
      "presence": 0
    },
    {
      "stage_name": "Phagosome formation",
      "host_protein_name": "V-ATPase",
      "presence": 0
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "EEA1",
      "presence": 1
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "LAMP1",
      "presence": 0
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "PI3P",
      "presence": 1
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "RILP",
      "presence": 0
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "Rab5",
      "presence": 1
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "Rab7",
      "presence": 0
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "V-ATPase",
      "presence": 0
    },
    {
      "stage_name": "Early phagosome",
      "host_protein_name": "Vps34",
      "presence": 1
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "EEA1",
      "presence": 0
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "LAMP1",
      "presence": 1
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "M6PR",
      "presence": 1
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "PI3P",
      "presence": 0
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "RILP",
      "presence": 1
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "Rab5",
      "presence": 0
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "Rab7",
      "presence": 1
    },
    {
      "stage_name": "Late phagosome",
      "host_protein_name": "V-ATPase",
      "presence": 1
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "EEA1",
      "presence": 0
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "LAMP1",
      "presence": 1
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "M6PR",
      "presence": 0
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "PI3P",
      "presence": 0
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "RILP",
      "presence": 1
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "Rab5",
      "presence": 0
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "Rab7",
      "presence": 1
    },
    {
      "stage_name": "Phagolysosome",
      "host_protein_name": "V-ATPase",
      "presence": 1
    }
  ],
  "hubs": [
    {
      "host": "Rab1",
      "degree": 6,
      "centrality": 0.1395
    },
    {
      "host": "Actin",
      "degree": 2,
      "centrality": 0.0465
    },
    {
      "host": "Cholesterol",
      "degree": 2,
      "centrality": 0.0465
    },
    {
      "host": "Arp2/3",
      "degree": 2,
      "centrality": 0.0465
    },
    {
      "host": "Cdc42",
      "degree": 1,
      "centrality": 0.0233
    },
    {
      "host": "Rac1",
      "degree": 1,
      "centrality": 0.0233
    },
    {
      "host": "PI(4,5)P2",
      "degree": 1,
      "centrality": 0.0233
    },
    {
      "host": "SKIP",
      "degree": 1,
      "centrality": 0.0233
    },
    {
      "host": "Kinesin-1",
      "degree": 1,
      "centrality": 0.0233
    },
    {
      "host": "Rab7",
      "degree": 1,
      "centrality": 0.0233
    }
  ],
  "ml_predictions": [
    {
      "pathogen": "Legionella pneumophila",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.72
    },
    {
      "pathogen": "Listeria monocytogenes",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.63
    },
    {
      "pathogen": "Mycobacterium tuberculosis",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.8
    },
    {
      "pathogen": "Salmonella enterica",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.78
    },
    {
      "pathogen": "Shigella flexneri",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.58
    }
  ],
  "stage_marker_names": [
    "Rab5",
    "EEA1",
    "PI(3)P",
    "Rab7",
    "LAMP1",
    "V-ATPase",
    "Cathepsins",
    "Actin",
    "pH ~6.5",
    "pH ~5.5",
    "pH ~4.5"
  ]
}

