var TOOLKIT_DATA = {
  "pathogens": [
    {
      "id": 48,
      "name": "Acinetobacter baumannii",
      "species": "Acinetobacter baumannii",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Multidrug-resistant nosocomial pathogen; survives on hospital surfaces and exhibits remarkable antibiotic resistance. OmpA is a major virulence factor that targets mitochondria to induce host cell death. Plc (phospholipase C) degrades host membrane phospholipids. CsuA/B pilus and Bap surface protein mediate biofilm formation on abiotic surfaces including medical devices",
      "reference": "10.1038/s41579-019-0259-0",
      "n_effectors": 5
    },
    {
      "id": 13,
      "name": "Anaplasma phagocytophilum",
      "species": "Anaplasma phagocytophilum",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Resides in non-fusogenic membrane-bound inclusion that acquires host-derived membrane via T4SS. Ats-1 binds Rab5 and PI3P to anchor the inclusion to early endosomal compartments, while AnkA modulates host signaling through interaction with MYADM and Abl-1 tyrosine kinase. p44/Msp2 undergoes antigenic variation to evade immune detection",
      "reference": "10.1111/j.1365-2958.2012.08037.x",
      "n_effectors": 3
    },
    {
      "id": 32,
      "name": "Bacillus anthracis",
      "species": "Bacillus anthracis",
      "gram_stain": "Gram-positive",
      "strategy": "escape",
      "description": "Anthrolysin O (ALO) enables phagosomal escape; lethal factor (LF) and edema factor (EF) modulate host. ALO is a cholesterol-dependent cytolysin that permeabilizes the phagosome. The tripartite toxin (PA + LF + EF) is the major virulence determinant: PA binds ANTXR1/2 to translocate LF (zinc metalloprotease cleaving MAPKKs) and EF (calmodulin-dependent adenylate cyclase) into the cytosol",
      "reference": "10.1038/s41579-019-0263-4",
      "n_effectors": 5
    },
    {
      "id": 33,
      "name": "Bacillus cereus",
      "species": "Bacillus cereus",
      "gram_stain": "Gram-positive",
      "strategy": "escape",
      "description": "Opportunistic pathogen capable of intracellular survival via pore-forming toxins including hemolysin BL (Hbl), non-hemolytic enterotoxin (Nhe), and cytotoxin K (CytK). These three-component pore-forming toxins cause membrane disruption and cell lysis. PC-PLC (phosphatidylcholine-hydrolyzing phospholipase C) contributes to membrane degradation and tissue necrosis",
      "reference": "10.3389/fcimb.2019.00087",
      "n_effectors": 4
    },
    {
      "id": 51,
      "name": "Bacteroides fragilis",
      "species": "Bacteroides fragilis",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Anaerobic commensal and opportunistic pathogen; enterotoxigenic strains produce BFT (B. fragilis toxin) — a zinc-dependent metalloprotease that cleaves E-cadherin, disrupting epithelial tight junctions and activating beta-catenin signaling. PsaA is a protective surface antigen. FimA fimbriae mediate adherence to host cells. SusC is part of the starch utilization system for nutrient acquisition",
      "reference": "10.3389/fcimb.2019.00163",
      "n_effectors": 4
    },
    {
      "id": 15,
      "name": "Bartonella henselae",
      "species": "Bartonella henselae",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Injectisome (VirB/VirD4 T4SS) translocates Bep effectors; subverts host cell functions including actin dynamics. BepA promotes F-actin fiber formation and has anti-apoptotic activity, while BepC activates PI3K/Akt signaling to promote endothelial cell proliferation. BepD and BepE modulate actin recruitment and protect against host cell death",
      "reference": "10.1038/s41579-020-0379-4",
      "n_effectors": 5
    },
    {
      "id": 24,
      "name": "Bordetella pertussis",
      "species": "Bordetella pertussis",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Extracellular respiratory pathogen; adenylate cyclase toxin and T3SS effectors modulate host immunity. Pertussis toxin (PTx) ADP-ribosylates Gi proteins to disrupt cAMP signaling, while CyaA is a bifunctional RTX toxin that enters phagocytes and generates supraphysiological cAMP levels. FHA mediates adhesion to CR3 integrins on macrophages",
      "reference": "10.1038/s41579-019-0223-z",
      "n_effectors": 5
    },
    {
      "id": 53,
      "name": "Borrelia burgdorferi",
      "species": "Borrelia burgdorferi",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Lyme disease spirochete transmitted by Ixodes ticks; disseminates through tissue and evades immune clearance. OspA and OspC are differentially expressed surface lipoproteins — OspA promotes tick midgut colonization while OspC is required for mammalian infection. VlsE undergoes segmental gene conversion to generate antigenic variation, enabling persistent infection. DbpA binds decorin for tissue adhesion",
      "reference": "10.1038/s41579-019-0306-x",
      "n_effectors": 4
    },
    {
      "id": 6,
      "name": "Brucella abortus",
      "species": "Brucella abortus",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Resides in Brucella-containing vacuole (BCV) that interacts with ER; avoids lysosomal fusion via VirB T4SS. BtpA and BtpB are TIR-domain containing effectors that inhibit TLR2 signaling and MyD88 adaptor function. VceC activates the unfolded protein response, creating a replicative niche that balances ER stress signaling with survival",
      "reference": "10.1038/s41579-019-0188-y",
      "n_effectors": 5
    },
    {
      "id": 50,
      "name": "Burkholderia cenocepacia",
      "species": "Burkholderia cenocepacia",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Survives in membrane-bound vacuole in macrophages; T6SS and T3SS effectors modulate host cell functions. Bat3 is a T6SS component that mediates effector translocation into host cells. AidA is a T4SS effector that promotes intracellular survival within the vacuole. CblA (cable pilus) and BcaA adhesin mediate binding to host epithelial cells and biofilm formation",
      "reference": "10.1111/j.1365-2958.2012.08048.x",
      "n_effectors": 4
    },
    {
      "id": 49,
      "name": "Burkholderia pseudomallei",
      "species": "Burkholderia pseudomallei",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Escapes phagosome via T3SS (T3SS-3); replicates in cytosol; induces actin polymerization for cell-to-cell spread. BopA is a T3SS translocon protein that mediates phagosomal escape, while BopE acts as a GEF for Cdc42 and Rac1 to induce membrane ruffling. BimA recruits actin to the bacterial surface for polymerization-based motility. Causes melioidosis in tropical regions",
      "reference": "10.3389/fcimb.2019.00118",
      "n_effectors": 5
    },
    {
      "id": 26,
      "name": "Campylobacter jejuni",
      "species": "Campylobacter jejuni",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Survives within Campylobacter-containing vacuole (CCV); uses T6SS and flagellar secretion. Cytolethal distending toxin (Cdt) is a DNase that causes host cell cycle arrest at G2/M phase. FlaA flagellin is glycosylated and activates TLR5, contributing to intestinal inflammation. CiaB and VirK are secreted factors that promote intracellular survival within the CCV",
      "reference": "10.3389/fcimb.2019.00360",
      "n_effectors": 5
    },
    {
      "id": 12,
      "name": "Chlamydia pneumoniae",
      "species": "Chlamydia pneumoniae",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Similar inclusion-based intracellular niche; acquires sphingolipids from Golgi via T3SS inc proteins. IncA blocks SNARE-mediated fusion with lysosomes, while CPn0585 acts as a GEF for host Rab GTPases to redirect vesicular trafficking away from the endolysosomal pathway",
      "reference": "10.1128/IAI.00731-19",
      "n_effectors": 3
    },
    {
      "id": 11,
      "name": "Chlamydia trachomatis",
      "species": "Chlamydia trachomatis",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Resides in non-acidified inclusion that intercepts exocytic vesicles from Golgi; avoids endolysosomal fusion. Inc proteins (IncA, IncB, IncC) decorate the inclusion membrane and recruit Rab4, Rab6, and Rab11 to intercept Golgi-derived vesicles. CT229 acts as a ubiquitin ligase to modify host Rab proteins, blocking fusion with lysosomes",
      "reference": "10.1038/s41579-019-0237-6",
      "n_effectors": 6
    },
    {
      "id": 35,
      "name": "Clostridium difficile",
      "species": "Clostridium difficile",
      "gram_stain": "Gram-positive",
      "strategy": "extracellular",
      "description": "Extracellular toxigenic pathogen causing antibiotic-associated diarrhea and pseudomembranous colitis. TcdA and TcdB are large clostridial glucosyltransferases that inactivate Rho GTPases (RhoA, Rac1, Cdc42) by monoglucosylation, leading to actin cytoskeleton disruption and tight junction breakdown. Cdt (binary toxin) ADP-ribosylates actin, causing microtubule-based protrusions",
      "reference": "10.1038/s41579-019-0266-1",
      "n_effectors": 4
    },
    {
      "id": 34,
      "name": "Clostridium perfringens",
      "species": "Clostridium perfringens",
      "gram_stain": "Gram-positive",
      "strategy": "extracellular",
      "description": "Extracellular pathogen causing gas gangrene and food poisoning; perfringolysin O (PFO) is a cholesterol-dependent cytolysin that forms large transmembrane pores. Alpha-toxin (PLC) is a zinc-dependent phospholipase C that hydrolyzes phosphatidylcholine and sphingomyelin, causing hemolysis and necrosis. CPE (C. perfringens enterotoxin) binds claudins to disrupt tight junctions",
      "reference": "10.1038/s41579-019-0257-2",
      "n_effectors": 4
    },
    {
      "id": 37,
      "name": "Corynebacterium diphtheriae",
      "species": "Corynebacterium diphtheriae",
      "gram_stain": "Gram-positive",
      "strategy": "extracellular",
      "description": "Extracellular respiratory pathogen; diphtheria toxin (DT) is an AB toxin that ADP-ribosylates elongation factor 2 (EF-2), inhibiting host protein synthesis and causing cell death. DT is encoded by a lysogenic beta-prophage — only toxigenic strains cause disease. FbpABC iron transporter scavenges host iron for bacterial growth. SpaABC pili mediate adhesion to respiratory epithelium",
      "reference": "10.1128/CMR.00075-19",
      "n_effectors": 4
    },
    {
      "id": 8,
      "name": "Coxiella burnetii",
      "species": "Coxiella burnetii",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Resides in acidified Coxiella-containing vacuole (CCV) that fuses with lysosomes; requires acidic pH for replication — uniquely thrives in phagolysosomes. Cig57 subverts clathrin-mediated trafficking, while CvpB binds PI3P and Rab5 for CCV biogenesis. CirA and CirB intercept HOPS and exocyst tethering complexes for CCV expansion",
      "reference": "10.1038/s41579-019-0191-3",
      "n_effectors": 5
    },
    {
      "id": 14,
      "name": "Ehrlichia chaffeensis",
      "species": "Ehrlichia chaffeensis",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Resides in early endosome-like inclusions that avoid lysosomal fusion; uses T4SS for effector translocation. TRP120 mimics Notch ligand to activate Notch signaling and promote host cell survival, while TRP32 activates the Wnt pathway. Ank200 is an ankyrin-repeat effector that modulates host gene expression from within the inclusion",
      "reference": "10.3389/fcimb.2018.00097",
      "n_effectors": 3
    },
    {
      "id": 36,
      "name": "Enterococcus faecalis",
      "species": "Enterococcus faecalis",
      "gram_stain": "Gram-positive",
      "strategy": "extracellular",
      "description": "Opportunistic extracellular pathogen causing nosocomial and device-associated infections; survives within macrophages. Cytolysin (Cyl) is a hemolytic/bactericidal toxin that lyses host cells. Gelatinase (GelE) degrades host ECM proteins for tissue invasion. Ace adhesin binds collagen for adherence to host tissues. Esp surface protein promotes biofilm formation",
      "reference": "10.3389/fcimb.2019.00126",
      "n_effectors": 5
    },
    {
      "id": 20,
      "name": "Escherichia coli K1",
      "species": "Escherichia coli K1",
      "gram_stain": "Gram-negative",
      "strategy": "arrest",
      "description": "Survives within late endosomes/lysosomes by modulating Rab GTPase activity; K1 capsule prevents clearance. IbeA binds vimentin to mediate invasion of brain microvascular endothelial cells, enabling traversal of the blood-brain barrier. CNF1 deamidates RhoA, Rac1, and Cdc42, constitutively activating them to disrupt phagosome maturation",
      "reference": "10.3389/fcimb.2020.00001",
      "n_effectors": 5
    },
    {
      "id": 7,
      "name": "Francisella tularensis",
      "species": "Francisella tularensis",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Escapes phagosome within 30-60 min via acid-dependent mechanism; replicates in cytosol. IglC and IglD are essential T6SS components that mediate phagosomal disruption. Once cytosolic, Francisella evades autophagy detection by modifying its LPS structure and subverts host interferon responses through MglA-mediated virulence gene regulation",
      "reference": "10.3389/fcimb.2018.00123",
      "n_effectors": 5
    },
    {
      "id": 23,
      "name": "Haemophilus influenzae",
      "species": "Haemophilus influenzae",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Extracellular respiratory pathogen; IgA protease and biofilm formation; survives intracellularly in some cell types. Hap autotransporter mediates adherence and microcolony formation via its serine protease activity. HMW1/HMW2 and Hia are high-molecular-weight adhesins that bind epithelial cells. P5 fimbriae bind ICAM-1 on activated respiratory epithelium",
      "reference": "10.1128/IAI.00475-19",
      "n_effectors": 5
    },
    {
      "id": 27,
      "name": "Helicobacter pylori",
      "species": "Helicobacter pylori",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Gastric extracellular pathogen that colonizes the stomach mucosa; Cag T4SS injects CagA effector into host cells where it is phosphorylated and activates SHP-2 phosphatase, disrupting cell polarity and adhesion. VacA forms pores in host membranes and targets mitochondria to induce apoptosis. UreA neutralizes gastric acid by producing ammonia from urea",
      "reference": "10.1038/s41579-019-0253-6",
      "n_effectors": 5
    },
    {
      "id": 47,
      "name": "Klebsiella pneumoniae",
      "species": "Klebsiella pneumoniae",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Encapsulated nosocomial pathogen causing pneumonia and urinary tract infections; emerging hypervirulent strains with enhanced mucoviscosity. CPS (capsular polysaccharide) is the major antiphagocytic factor — over 80 serotypes known. LPS activates TLR4 triggering inflammatory responses. FimH (type 1) and MrkD (type 3) fimbriae mediate adhesion to host tissues and biofilm formation",
      "reference": "10.1038/s41579-019-0265-2",
      "n_effectors": 5
    },
    {
      "id": 4,
      "name": "Legionella pneumophila",
      "species": "Legionella pneumophila",
      "gram_stain": "Gram-negative",
      "strategy": "reroute",
      "description": "Redirects ER-derived vesicles to build LCV; bypasses endocytic pathway entirely via Dot/Icm T4SS. DrrA/SidM is a Rab1 GEF that activates Rab1 on the LCV, redirecting COPII vesicle traffic from ER to the pathogen vacuole. AnkX phosphocholinates Rab35 and Rab1, locking them in an inactive state — a post-translational block distinct from host regulation",
      "reference": "10.1038/s41579-018-0126-4",
      "n_effectors": 7
    },
    {
      "id": 54,
      "name": "Leptospira interrogans",
      "species": "Leptospira interrogans",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Leptospirosis spirochete; invades through mucous membranes or skin abrasions; colonizes the renal tubules of reservoir hosts and is shed in urine. LipL32 is the major outer membrane lipoprotein involved in adhesion to host ECM. LenA binds complement Factor H to evade immune killing. Loa22 contains a collagen-binding domain for host tissue adherence. Causes Weil's disease in severe cases",
      "reference": "10.3389/fcimb.2019.00107",
      "n_effectors": 4
    },
    {
      "id": 2,
      "name": "Listeria monocytogenes",
      "species": "Listeria monocytogenes",
      "gram_stain": "Gram-positive",
      "strategy": "escape",
      "description": "Phagosomal escape via LLO within ~30 min; replicates in cytosol; uses ActA for actin-based motility. LLO is pH-dependent: forms pores at acidic pH of early phagosomes but is inactivated at neutral cytosolic pH. ActA nucleates Arp2/3-dependent branched actin networks for cytoplasmic motility and cell-to-cell spread via double-membrane protrusions",
      "reference": "10.1038/s41579-018-0106-8",
      "n_effectors": 6
    },
    {
      "id": 43,
      "name": "Mycobacterium avium",
      "species": "Mycobacterium avium",
      "gram_stain": "Acid-fast",
      "strategy": "arrest",
      "description": "Opportunistic environmental mycobacterium causing disseminated disease in immunocompromised patients (especially advanced HIV/AIDS). Survives and replicates within macrophages by blocking phagosome acidification and lysosomal fusion via LAM-mediated inhibition of Vps34 and PI3P production. MAV_2941 is a secreted factor that promotes intracellular survival",
      "reference": "10.3389/fcimb.2019.00108",
      "n_effectors": 2
    },
    {
      "id": 42,
      "name": "Mycobacterium bovis",
      "species": "Mycobacterium bovis",
      "gram_stain": "Acid-fast",
      "strategy": "arrest",
      "description": "Intracellular pathogen causing tuberculosis in cattle; BCG (Bacille Calmette-Guerin) is an attenuated strain used as a vaccine against human TB. Arrests phagosome maturation by inhibiting V-ATPase recruitment and Rab7 acquisition. ESAT-6 and CFP-10 are T7SS (ESX-1) secreted effectors that mediate phagosomal permeabilization and intercellular spread",
      "reference": "10.1128/IAI.00687-19",
      "n_effectors": 4
    },
    {
      "id": 41,
      "name": "Mycobacterium leprae",
      "species": "Mycobacterium leprae",
      "gram_stain": "Acid-fast",
      "strategy": "arrest",
      "description": "Similar to M. tuberculosis; arrests phagosome maturation at the early stage; uniquely inhabits Schwann cells and macrophages. LAM (lipoarabinomannan) inhibits Vps34 and Ca2+ signaling to block phagosome maturation. ML0098 modulates TLR signaling to prevent pro-inflammatory responses. Causes leprosy with tropism for peripheral nerves leading to demyelination",
      "reference": "10.1038/s41579-020-0382-9",
      "n_effectors": 4
    },
    {
      "id": 44,
      "name": "Mycobacterium marinum",
      "species": "Mycobacterium marinum",
      "gram_stain": "Acid-fast",
      "strategy": "arrest",
      "description": "Model organism for studying mycobacterial pathogenesis in zebrafish infection model. Arrests phagosome maturation and prevents acidification similar to M. tuberculosis. ESAT-6 (ESX-1 T7SS effector) forms pores in phagosomal membranes to promote permeabilization. MMPL7 is an efflux pump involved in drug resistance. Causes fish tuberculosis and granulomatous skin infections in humans",
      "reference": "10.1111/j.1365-2958.2012.08055.x",
      "n_effectors": 3
    },
    {
      "id": 3,
      "name": "Mycobacterium tuberculosis",
      "species": "Mycobacterium tuberculosis",
      "gram_stain": "Acid-fast",
      "strategy": "arrest",
      "description": "Arrests phagosome at early stage; blocks Rab5-to-Rab7 conversion; maintains near-neutral pH (~6.4) by excluding V-ATPase. Secretes SapM phosphatase to deplete PI3P from phagosomal membranes, and lipoarabinomannan (LAM) inhibits Ca2+ signaling and Vps34 recruitment. PknG and PtpA further modulate host Rab trafficking to prevent lysosomal fusion",
      "reference": "10.1038/s41579-019-0216-y",
      "n_effectors": 7
    },
    {
      "id": 21,
      "name": "Neisseria gonorrhoeae",
      "species": "Neisseria gonorrhoeae",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Extracellular mucosal pathogen; type IV pili and Opa proteins mediate adhesion; resists intracellular killing. PorB is a voltage-gated porin that targets mitochondria and inhibits host cell apoptosis. Opa proteins bind CEACAM receptors to trigger bacterial uptake into non-phagocytic cells, where Neisseria can survive intracellularly",
      "reference": "10.1038/s41579-018-0131-5",
      "n_effectors": 5
    },
    {
      "id": 22,
      "name": "Neisseria meningitidis",
      "species": "Neisseria meningitidis",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Encapsulated extracellular pathogen; survives in bloodstream and cerebrospinal fluid; type IV pili for adhesion. PorB and PorA are major outer membrane porins with anti-apoptotic activity. Opca binds CEACAM and fibronectin, while NadA mediates adhesion to epithelial cells. Capsular polysaccharide (serogroups A, B, C, W, Y) is essential for serum resistance",
      "reference": "10.1038/s41579-019-0240-y",
      "n_effectors": 5
    },
    {
      "id": 38,
      "name": "Nocardia asteroides",
      "species": "Nocardia asteroides",
      "gram_stain": "Gram-positive",
      "strategy": "arrest",
      "description": "Arrests phagosome maturation at early stage; blocks acidification; survives in macrophages. Mce (mammalian cell entry) proteins mediate invasion and intracellular survival. Phospholipase A (PLA) contributes to phagosomal membrane disruption, while superoxide dismutase (Sod) and catalase (Cat) neutralize host oxidative burst. Causes nocardiosis in immunocompromised patients",
      "reference": "10.1086/515160",
      "n_effectors": 4
    },
    {
      "id": 28,
      "name": "Orientia tsutsugamushi",
      "species": "Orientia tsutsugamushi",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Escapes phagosome via phospholipase D activity; replicates in cytosol; subverts autophagy. Pld is a phospholipase D homolog that disrupts phagosomal membranes shortly after entry. ScaA and ScaC are autotransporter proteins mediating adhesion to host cells. Tsa56 is the major outer membrane protein involved in immune evasion. Causes scrub typhus transmitted by chiggers",
      "reference": "10.3389/fcimb.2018.00012",
      "n_effectors": 5
    },
    {
      "id": 46,
      "name": "Porphyromonas gingivalis",
      "species": "Porphyromonas gingivalis",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Oral keystone pathogen causing periodontitis; hijacks host endocytic pathway and survives within gingival epithelial cells. Gingipains (RgpA, RgpB, Kgp) are cysteine proteases that degrade host ECM proteins, activate PAR signaling, and subvert complement. FimA fimbriae bind CD14/TLR2 to trigger inflammatory signaling and promote intracellular invasion",
      "reference": "10.3389/fcimb.2019.00098",
      "n_effectors": 5
    },
    {
      "id": 19,
      "name": "Pseudomonas aeruginosa",
      "species": "Pseudomonas aeruginosa",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Extracellular opportunistic pathogen; injects ExoU/ExoS/ExoT via T3SS; cytotoxic to host cells. ExoU is a potent phospholipase A2 that causes rapid plasma membrane lysis, while ExoS and ExoT act as both RhoGAPs and ADP-ribosyltransferases. ExoY is an adenylate cyclase that disrupts actin dynamics by raising cAMP/cGMP levels in infected cells",
      "reference": "10.1038/s41579-020-0353-1",
      "n_effectors": 6
    },
    {
      "id": 39,
      "name": "Rhodococcus equi",
      "species": "Rhodococcus equi",
      "gram_stain": "Gram-positive",
      "strategy": "modified_compartment",
      "description": "Resides in non-acidified Rhodococcus-containing vacuole (RCV); prevents lysosomal fusion via Vap proteins (VapA, VapB, VapC, VapD). VapA is the major virulence factor, a surface-expressed protein that modulates host vesicular trafficking and prevents lysosomal hydrolase delivery. Causes pneumonia in foals and opportunistic infections in immunocompromised humans",
      "reference": "10.1111/j.1365-2958.2012.08093.x",
      "n_effectors": 4
    },
    {
      "id": 17,
      "name": "Rickettsia conorii",
      "species": "Rickettsia conorii",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Phagosomal escape within 15 min; intracytosolic replication; actin tail formation via RickA and Sca2-mediated actin nucleation. Uses Pat1 phospholipase to disrupt phagosomal membranes. Causes Mediterranean spotted fever; transmitted by Rhipicephalus ticks with endothelial cells as primary target",
      "reference": "10.3389/fcimb.2017.00322",
      "n_effectors": 3
    },
    {
      "id": 16,
      "name": "Rickettsia rickettsii",
      "species": "Rickettsia rickettsii",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Rapid phagosomal escape via hemolysin and phospholipase; replicates in cytosol; actin-based motility. RickA activates Arp2/3 to nucleate actin tails, while Sca2 acts as a formin-like actin nucleator for enhanced motility. TlyA and Pat1 are hemolysin and patatin-like phospholipase that mediate rapid phagosomal membrane disruption within minutes of entry",
      "reference": "10.1128/CMR.00032-19",
      "n_effectors": 4
    },
    {
      "id": 1,
      "name": "Salmonella enterica",
      "species": "Salmonella enterica serovar Typhimurium",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Resides in SCV; acquires LAMP1 but blocks hydrolase delivery; maintains non-degradative niche via SPI-2 T3SS effectors. SifA binds SKIP to displace Rab9, while SseJ deacylates cholesterol to prevent SCV-lysosome fusion. SCV matures into a LAMP1+ compartment that is non-degradative — Rab7 effectors (RILP, ORP1L) are decoupled from hydrolase delivery",
      "reference": "10.1016/j.tim.2019.01.007",
      "n_effectors": 7
    },
    {
      "id": 18,
      "name": "Salmonella typhi",
      "species": "Salmonella typhi",
      "gram_stain": "Gram-negative",
      "strategy": "modified_compartment",
      "description": "Similar SCV-based strategy as S. enterica; SPI-2 effectors maintain vacuolar niche. Uses SopE to activate Cdc42 for entry, while SifA binds SKIP to maintain SCV integrity. SseF and SseG are SPI-2 effectors that position the SCV near the Golgi apparatus by recruiting microtubule motors, ensuring access to nutrient-rich vesicles",
      "reference": "10.1128/CMR.00112-20",
      "n_effectors": 5
    },
    {
      "id": 5,
      "name": "Shigella flexneri",
      "species": "Shigella flexneri",
      "gram_stain": "Gram-negative",
      "strategy": "escape",
      "description": "Rapid phagosome lysis (<15 min) via IpaB pore; escapes to cytosol before early markers fully acquired. IpaB inserts into the phagosomal membrane and oligomerizes to form a translocation pore. In the cytosol, IcsB masks IcsA from the autophagy receptor LC3 to evade xenophagy. Uses IcsA/VirG to recruit N-WASP and Arp2/3 for actin-based motility",
      "reference": "10.1038/s41579-019-0190-4",
      "n_effectors": 6
    },
    {
      "id": 29,
      "name": "Staphylococcus aureus",
      "species": "Staphylococcus aureus",
      "gram_stain": "Gram-positive",
      "strategy": "escape",
      "description": "Pore-forming toxins (Hla, PVL) enable phagosomal escape; some strains survive intracellularly. Hla (alpha-hemolysin) binds ADAM10 to form heptameric pores in host membranes, while PVL targets C5aR on neutrophils. Protein A (SpA) binds IgG Fc region and cross-links VH3-type B cell receptors, acting as a B-cell superantigen. Efb binds fibrinogen to form immune-evasive clots",
      "reference": "10.1038/s41579-018-0103-y",
      "n_effectors": 5
    },
    {
      "id": 31,
      "name": "Streptococcus pneumoniae",
      "species": "Streptococcus pneumoniae",
      "gram_stain": "Gram-positive",
      "strategy": "extracellular",
      "description": "Extracellular pathogen; pneumolysin (PLY) and polysaccharide capsule; can survive intracellularly. PLY is a cholesterol-dependent cytolysin that forms pores and activates the NLRP3 inflammasome. PspA binds lactoferrin to reduce iron availability for host defenses, while PspC binds Factor H for complement evasion. LytA autolysin releases pneumolysin during antibiotic-induced lysis",
      "reference": "10.1038/s41579-018-0125-5",
      "n_effectors": 5
    },
    {
      "id": 30,
      "name": "Streptococcus pyogenes",
      "species": "Streptococcus pyogenes",
      "gram_stain": "Gram-positive",
      "strategy": "escape",
      "description": "Streptolysin O (SLO) enables phagosomal escape; replicates in cytosol; M protein for adhesion. SLO is a cholesterol-dependent cytolysin that forms large pores in phagosomal membranes. M protein binds Factor H and C4BP to evade complement opsonization. SpeA is a superantigen that bridges MHC class II and TCR V-beta regions, triggering massive cytokine release",
      "reference": "10.3389/fcimb.2019.00071",
      "n_effectors": 5
    },
    {
      "id": 45,
      "name": "Streptomyces scabies",
      "species": "Streptomyces scabies",
      "gram_stain": "Gram-positive",
      "strategy": "extracellular",
      "description": "Plant pathogen causing common scab disease in potato and other root crops. Produces thaxtomin A, a phytotoxin that inhibits cellulose biosynthesis in plant cell walls, leading to cell swelling and tissue necrosis. TxtA, TxtB, and TxtC are key synthetases in the thaxtomin biosynthesis pathway. Nec1 is a necrosis-inducing virulence factor that promotes plant tissue maceration",
      "reference": "10.1111/j.1365-2958.2012.08066.x",
      "n_effectors": 4
    },
    {
      "id": 52,
      "name": "Treponema pallidum",
      "species": "Treponema pallidum",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Highly invasive spirochete causing syphilis; capable of penetrating intact mucous membranes and disseminating throughout the body. TprK undergoes antigenic variation to evade host immune responses. Tp0751 (pallilysin) is a metalloprotease that degrades laminin and fibrinogen for tissue penetration. Has a minimal genome (~1.14 Mbp) with limited metabolic capacity, relying on host nutrients",
      "reference": "10.1038/s41579-019-0285-y",
      "n_effectors": 4
    },
    {
      "id": 40,
      "name": "Tropheryma whipplei",
      "species": "Tropheryma whipplei",
      "gram_stain": "Gram-positive",
      "strategy": "arrest",
      "description": "Arrests phagosome maturation; survives in macrophages; causes Whipple disease — a rare systemic infection affecting the gastrointestinal tract and joints. TW surface proteins mediate adhesion and intracellular survival. The bacterium has a reduced genome and relies on host-derived amino acids and metabolites. Survives within macrophages by blocking acidification and lysosomal fusion",
      "reference": "10.3389/fcimb.2019.00149",
      "n_effectors": 3
    },
    {
      "id": 25,
      "name": "Vibrio cholerae",
      "species": "Vibrio cholerae",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Non-invasive extracellular pathogen; cholera toxin (CTX) is an AB toxin that ADP-ribosylates Gs-alpha, causing constitutive adenylate cyclase activation and massive fluid secretion into the intestinal lumen. The toxin-coregulated pilus (TCP) is essential for intestinal colonization. T6SS (VSP locus) mediates interbacterial competition in the gut microbiome",
      "reference": "10.1038/s41579-018-0129-1",
      "n_effectors": 5
    },
    {
      "id": 9,
      "name": "Yersinia pestis",
      "species": "Yersinia pestis",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Extracellular pathogen that resists phagocytosis via Yop T3SS effectors; blocks phagocytic uptake. YopH dephosphorylates FAK and p130Cas to disrupt focal adhesions, while YopJ acetylates MAPKK and IKK to block NF-kB and MAPK signaling. YopE acts as a GAP for RhoA, Rac1, and Cdc42 to paralyze actin dynamics",
      "reference": "10.1038/s41579-017-0020-8",
      "n_effectors": 6
    },
    {
      "id": 10,
      "name": "Yersinia pseudotuberculosis",
      "species": "Yersinia pseudotuberculosis",
      "gram_stain": "Gram-negative",
      "strategy": "extracellular",
      "description": "Extracellular pathogen; injects Yop effectors via T3SS to disrupt actin and block phagocytosis. Shares core Yop arsenal with Y. pestis including YopE (RhoGAP), YopH (PTPase), and YopJ (MAPKK acetyltransferase). YpkA/YopO binds actin and RhoA to further disrupt the cytoskeleton in infected cells",
      "reference": "10.1111/j.1365-2958.2012.08077.x",
      "n_effectors": 4
    }
  ],
  "effectors": [
    {
      "pathogen_name": "Acinetobacter baumannii",
      "effector_name": "OmpA",
      "type": "Outer membrane",
      "host_target": "Mitochondria",
      "mechanism": "Porin; targeting host cell death"
    },
    {
      "pathogen_name": "Acinetobacter baumannii",
      "effector_name": "AbOmpA",
      "type": "Outer membrane",
      "host_target": "Host membranes",
      "mechanism": "Biofilm-associated protein"
    },
    {
      "pathogen_name": "Acinetobacter baumannii",
      "effector_name": "CsuA/B",
      "type": "Pilus",
      "host_target": "Abiotic surfaces",
      "mechanism": "Biofilm formation"
    },
    {
      "pathogen_name": "Acinetobacter baumannii",
      "effector_name": "Bap",
      "type": "Surface protein",
      "host_target": "Host cells",
      "mechanism": "Biofilm-associated protein"
    },
    {
      "pathogen_name": "Acinetobacter baumannii",
      "effector_name": "Plc",
      "type": "Phospholipase",
      "host_target": "Host membranes",
      "mechanism": "Phospholipase C activity"
    },
    {
      "pathogen_name": "Anaplasma phagocytophilum",
      "effector_name": "Ats-1",
      "type": "T4SS",
      "host_target": "Rab5 / PI3P",
      "mechanism": "Binds Rab5; anchors to inclusion membrane"
    },
    {
      "pathogen_name": "Anaplasma phagocytophilum",
      "effector_name": "AnkA",
      "type": "T4SS",
      "host_target": "MYADM / Abl-1",
      "mechanism": "Ankyrin repeat; modulates host signaling"
    },
    {
      "pathogen_name": "Anaplasma phagocytophilum",
      "effector_name": "p44/Msp2",
      "type": "Surface protein",
      "host_target": "P-selectin glycoprotein",
      "mechanism": "Antigenic variation; immune evasion"
    },
    {
      "pathogen_name": "Bacillus anthracis",
      "effector_name": "ALO",
      "type": "Cholesterol-dependent",
      "host_target": "Cholesterol",
      "mechanism": "Anthrolysin O; phagosomal escape"
    },
    {
      "pathogen_name": "Bacillus anthracis",
      "effector_name": "LF",
      "type": "AB toxin",
      "host_target": "MAPKKs",
      "mechanism": "Lethal factor; zinc metalloprotease"
    },
    {
      "pathogen_name": "Bacillus anthracis",
      "effector_name": "EF",
      "type": "AB toxin",
      "host_target": "CaM/adenylate cyclase",
      "mechanism": "Edema factor; adenylyl cyclase"
    },
    {
      "pathogen_name": "Bacillus anthracis",
      "effector_name": "PA",
      "type": "AB toxin",
      "host_target": "ANTXR1/2",
      "mechanism": "Protective antigen; mediates uptake of LF/EF"
    },
    {
      "pathogen_name": "Bacillus anthracis",
      "effector_name": "CatB",
      "type": "Catalase",
      "host_target": "ROS",
      "mechanism": "Resistance to oxidative burst"
    },
    {
      "pathogen_name": "Bacillus cereus",
      "effector_name": "Hbl",
      "type": "Pore-forming",
      "host_target": "Membrane",
      "mechanism": "Hemolysin BL; three-component toxin"
    },
    {
      "pathogen_name": "Bacillus cereus",
      "effector_name": "Nhe",
      "type": "Pore-forming",
      "host_target": "Membrane",
      "mechanism": "Non-hemolytic enterotoxin"
    },
    {
      "pathogen_name": "Bacillus cereus",
      "effector_name": "CytK",
      "type": "Pore-forming",
      "host_target": "Membrane",
      "mechanism": "Cytotoxin K; beta-barrel pore"
    },
    {
      "pathogen_name": "Bacillus cereus",
      "effector_name": "PC-PLC",
      "type": "Phospholipase",
      "host_target": "Membrane",
      "mechanism": "Phosphatidylcholine-hydrolyzing"
    },
    {
      "pathogen_name": "Bacteroides fragilis",
      "effector_name": "BFT",
      "type": "Metalloprotease",
      "host_target": "E-cadherin",
      "mechanism": "B. fragilis toxin; epithelial signaling"
    },
    {
      "pathogen_name": "Bacteroides fragilis",
      "effector_name": "PsaA",
      "type": "Surface protein",
      "host_target": "Host cells",
      "mechanism": "Protection surface antigen"
    },
    {
      "pathogen_name": "Bacteroides fragilis",
      "effector_name": "FimA",
      "type": "Fimbriae",
      "host_target": "Host cells",
      "mechanism": "Type A fimbriae"
    },
    {
      "pathogen_name": "Bacteroides fragilis",
      "effector_name": "SusC",
      "type": "Nutrient transporter",
      "host_target": "Host glycans",
      "mechanism": "Starch utilization"
    },
    {
      "pathogen_name": "Bartonella henselae",
      "effector_name": "BepA",
      "type": "T4SS (VirB)",
      "host_target": "Host cell actin",
      "mechanism": "F-actin fiber formation; anti-apoptotic"
    },
    {
      "pathogen_name": "Bartonella henselae",
      "effector_name": "BepB",
      "type": "T4SS (VirB)",
      "host_target": "Host membranes",
      "mechanism": "Actin remodeling"
    },
    {
      "pathogen_name": "Bartonella henselae",
      "effector_name": "BepC",
      "type": "T4SS (VirB)",
      "host_target": "PI3K / Akt",
      "mechanism": "Promotes endothelial cell proliferation"
    },
    {
      "pathogen_name": "Bartonella henselae",
      "effector_name": "BepD",
      "type": "T4SS (VirB)",
      "host_target": "Host membranes",
      "mechanism": "F-actin recruitment"
    },
    {
      "pathogen_name": "Bartonella henselae",
      "effector_name": "BepE",
      "type": "T4SS (VirB)",
      "host_target": "Host apoptosis",
      "mechanism": "Anti-apoptotic"
    },
    {
      "pathogen_name": "Bordetella pertussis",
      "effector_name": "PTx",
      "type": "AB toxin",
      "host_target": "Gi/adenylate cyclase",
      "mechanism": "Pertussis toxin; ADP-ribosyltransferase"
    },
    {
      "pathogen_name": "Bordetella pertussis",
      "effector_name": "CyaA",
      "type": "RTX toxin",
      "host_target": "CaM/adenylate cyclase",
      "mechanism": "Adenylate cyclase toxin; phagocyte entry"
    },
    {
      "pathogen_name": "Bordetella pertussis",
      "effector_name": "FHA",
      "type": "Adhesin",
      "host_target": "CR3 / integrins",
      "mechanism": "Filamentous hemagglutinin"
    },
    {
      "pathogen_name": "Bordetella pertussis",
      "effector_name": "TCF",
      "type": "Tracheal cytotoxin",
      "host_target": "Ciliated cells",
      "mechanism": "Disrupts ciliated epithelium"
    },
    {
      "pathogen_name": "Bordetella pertussis",
      "effector_name": "DNT",
      "type": "Toxin",
      "host_target": "Rho GTPases",
      "mechanism": "Dermonecrotic toxin; constrictive activity"
    },
    {
      "pathogen_name": "Borrelia burgdorferi",
      "effector_name": "OspA",
      "type": "Surface lipoprotein",
      "host_target": "TLR2",
      "mechanism": "Outer surface protein A"
    },
    {
      "pathogen_name": "Borrelia burgdorferi",
      "effector_name": "OspC",
      "type": "Surface lipoprotein",
      "host_target": "Host immune",
      "mechanism": "Outer surface protein C"
    },
    {
      "pathogen_name": "Borrelia burgdorferi",
      "effector_name": "VlsE",
      "type": "Surface protein",
      "host_target": "Immune evasion",
      "mechanism": "Antigenic variation locus"
    },
    {
      "pathogen_name": "Borrelia burgdorferi",
      "effector_name": "DbpA",
      "type": "Adhesin",
      "host_target": "Decorin",
      "mechanism": "PAS domain; decorin-binding"
    },
    {
      "pathogen_name": "Brucella abortus",
      "effector_name": "VirB",
      "type": "T4SS (VirB)",
      "host_target": "ER membranes",
      "mechanism": "Type IV secretion system structural component"
    },
    {
      "pathogen_name": "Brucella abortus",
      "effector_name": "BtpA",
      "type": "T4SS effector",
      "host_target": "TLR2",
      "mechanism": "TIR-domain containing; inhibits TLR2 signaling"
    },
    {
      "pathogen_name": "Brucella abortus",
      "effector_name": "BtpB",
      "type": "T4SS effector",
      "host_target": "TIRAP/Mal",
      "mechanism": "TIR-domain containing adaptor mimic"
    },
    {
      "pathogen_name": "Brucella abortus",
      "effector_name": "VceA",
      "type": "T4SS effector",
      "host_target": "Secretory pathway",
      "mechanism": "Modulates host vesicular trafficking"
    },
    {
      "pathogen_name": "Brucella abortus",
      "effector_name": "VceC",
      "type": "T4SS effector",
      "host_target": "ER stress response",
      "mechanism": "Activates unfolded protein response"
    },
    {
      "pathogen_name": "Burkholderia cenocepacia",
      "effector_name": "Bat3",
      "type": "T6SS",
      "host_target": "Host cells",
      "mechanism": "T6SS component"
    },
    {
      "pathogen_name": "Burkholderia cenocepacia",
      "effector_name": "AidA",
      "type": "T4SS effector",
      "host_target": "Host membranes",
      "mechanism": "Intracellular survival"
    },
    {
      "pathogen_name": "Burkholderia cenocepacia",
      "effector_name": "CblA",
      "type": "Cable pilus",
      "host_target": "Host cells",
      "mechanism": "Adhesion factor"
    },
    {
      "pathogen_name": "Burkholderia cenocepacia",
      "effector_name": "BcaA",
      "type": "Adhesin",
      "host_target": "Host cells",
      "mechanism": "Burkholderia adhesin"
    },
    {
      "pathogen_name": "Burkholderia pseudomallei",
      "effector_name": "BopA",
      "type": "T3SS (T3SS-3)",
      "host_target": "Host membranes",
      "mechanism": "Translocon; phagosomal escape"
    },
    {
      "pathogen_name": "Burkholderia pseudomallei",
      "effector_name": "BopE",
      "type": "T3SS (T3SS-3)",
      "host_target": "Cdc42 / Rac1",
      "mechanism": "GEF for Rho GTPases"
    },
    {
      "pathogen_name": "Burkholderia pseudomallei",
      "effector_name": "BprP",
      "type": "Protease",
      "host_target": "Host proteins",
      "mechanism": "Serine protease"
    },
    {
      "pathogen_name": "Burkholderia pseudomallei",
      "effector_name": "BimA",
      "type": "Surface protein",
      "host_target": "Actin",
      "mechanism": "Actin-based motility"
    },
    {
      "pathogen_name": "Burkholderia pseudomallei",
      "effector_name": "MprA",
      "type": "Protease",
      "host_target": "Host proteins",
      "mechanism": "Metalloprotease"
    },
    {
      "pathogen_name": "Campylobacter jejuni",
      "effector_name": "Cdt",
      "type": "Cytolethal distending",
      "host_target": "Host DNA",
      "mechanism": "DNase; cell cycle arrest"
    },
    {
      "pathogen_name": "Campylobacter jejuni",
      "effector_name": "FlaA",
      "type": "Flagellin",
      "host_target": "TLR5",
      "mechanism": "Major flagellin; glycosylated"
    },
    {
      "pathogen_name": "Campylobacter jejuni",
      "effector_name": "CiaB",
      "type": "Flagellar secretion",
      "host_target": "Host cells",
      "mechanism": "Campylobacter invasion antigen"
    },
    {
      "pathogen_name": "Campylobacter jejuni",
      "effector_name": "VirK",
      "type": "Virulence factor",
      "host_target": "Host membranes",
      "mechanism": "Intracellular survival"
    },
    {
      "pathogen_name": "Campylobacter jejuni",
      "effector_name": "CfrA",
      "type": "Iron transporter",
      "host_target": "Host iron",
      "mechanism": "Ferric enterobactin receptor"
    },
    {
      "pathogen_name": "Chlamydia pneumoniae",
      "effector_name": "IncA",
      "type": "T3SS",
      "host_target": "SNAREs",
      "mechanism": "Similar inclusion membrane function"
    },
    {
      "pathogen_name": "Chlamydia pneumoniae",
      "effector_name": "CPn0585",
      "type": "T3SS",
      "host_target": "Rab GTPases",
      "mechanism": "Guanine nucleotide exchange factor"
    },
    {
      "pathogen_name": "Chlamydia pneumoniae",
      "effector_name": "CPn0809",
      "type": "T3SS",
      "host_target": "Host membranes",
      "mechanism": "Sphingolipid acquisition"
    },
    {
      "pathogen_name": "Chlamydia trachomatis",
      "effector_name": "IncA",
      "type": "T3SS",
      "host_target": "SNARE proteins",
      "mechanism": "Inclusion membrane protein; blocks fusion"
    },
    {
      "pathogen_name": "Chlamydia trachomatis",
      "effector_name": "IncB",
      "type": "T3SS",
      "host_target": "Rab4",
      "mechanism": "Recruits Rab4 to inclusion membrane"
    },
    {
      "pathogen_name": "Chlamydia trachomatis",
      "effector_name": "IncC",
      "type": "T3SS",
      "host_target": "Rab6 / Rab11",
      "mechanism": "Recruits Golgi-derived vesicles"
    },
    {
      "pathogen_name": "Chlamydia trachomatis",
      "effector_name": "CT229",
      "type": "T3SS",
      "host_target": "Rab GTPases",
      "mechanism": "Ubiquitin ligase; Rab protein modification"
    },
    {
      "pathogen_name": "Chlamydia trachomatis",
      "effector_name": "CT813",
      "type": "T3SS",
      "host_target": "Host membranes",
      "mechanism": "Inclusion protein; lipid acquisition"
    },
    {
      "pathogen_name": "Chlamydia trachomatis",
      "effector_name": "CADD",
      "type": "T3SS",
      "host_target": "Host apoptosis",
      "mechanism": "Anti-apoptotic; blocks host cell death"
    },
    {
      "pathogen_name": "Clostridium difficile",
      "effector_name": "TcdA",
      "type": "Large clostridial toxin",
      "host_target": "Rho GTPases",
      "mechanism": "Enterotoxin; glucosyltransferase"
    },
    {
      "pathogen_name": "Clostridium difficile",
      "effector_name": "TcdB",
      "type": "Large clostridial toxin",
      "host_target": "Rho GTPases",
      "mechanism": "Cytotoxin; glucosyltransferase"
    },
    {
      "pathogen_name": "Clostridium difficile",
      "effector_name": "Cdt",
      "type": "ADP-ribosyltransferase",
      "host_target": "Actin",
      "mechanism": "Binary toxin; actin depolymerization"
    },
    {
      "pathogen_name": "Clostridium difficile",
      "effector_name": "FliC",
      "type": "Flagellin",
      "host_target": "TLR5",
      "mechanism": "Flagellar protein; inflammatory"
    },
    {
      "pathogen_name": "Clostridium perfringens",
      "effector_name": "CTA",
      "type": "AB toxin (CPE)",
      "host_target": "Claudins",
      "mechanism": "C. perfringens enterotoxin; tight junction"
    },
    {
      "pathogen_name": "Clostridium perfringens",
      "effector_name": "PFO",
      "type": "Cholesterol-dependent",
      "host_target": "Cholesterol",
      "mechanism": "Perfringolysin O; pore-forming"
    },
    {
      "pathogen_name": "Clostridium perfringens",
      "effector_name": "PLC",
      "type": "Phospholipase",
      "host_target": "Membrane",
      "mechanism": "Alpha-toxin; hemolysis and necrosis"
    },
    {
      "pathogen_name": "Clostridium perfringens",
      "effector_name": "NetB",
      "type": "Pore-forming",
      "host_target": "Host cells",
      "mechanism": "Necrotic enteritis toxin B"
    },
    {
      "pathogen_name": "Corynebacterium diphtheriae",
      "effector_name": "DT",
      "type": "AB toxin",
      "host_target": "EF-2",
      "mechanism": "Diphtheria toxin; ADP-ribosyltransferase"
    },
    {
      "pathogen_name": "Corynebacterium diphtheriae",
      "effector_name": "Fbp",
      "type": "Iron transporter",
      "host_target": "Host iron",
      "mechanism": "Iron acquisition"
    },
    {
      "pathogen_name": "Corynebacterium diphtheriae",
      "effector_name": "SpaA",
      "type": "Pilin",
      "host_target": "Host cells",
      "mechanism": "Shaft pilin; adherence"
    },
    {
      "pathogen_name": "Corynebacterium diphtheriae",
      "effector_name": "SpaB",
      "type": "Pilin",
      "host_target": "Host cells",
      "mechanism": "Minor pilin; adherence"
    },
    {
      "pathogen_name": "Coxiella burnetii",
      "effector_name": "Cig57",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Clathrin",
      "mechanism": "Subverts clathrin-mediated trafficking"
    },
    {
      "pathogen_name": "Coxiella burnetii",
      "effector_name": "Cig2",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab proteins",
      "mechanism": "Interacts with host Rab GTPases"
    },
    {
      "pathogen_name": "Coxiella burnetii",
      "effector_name": "CvpB",
      "type": "T4SS (Dot/Icm)",
      "host_target": "PI3P / Rab5",
      "mechanism": "Binds PI3P and Rab5 for CCV biogenesis"
    },
    {
      "pathogen_name": "Coxiella burnetii",
      "effector_name": "CirA",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Exocyst complex",
      "mechanism": "Modulates host vesicle tethering"
    },
    {
      "pathogen_name": "Coxiella burnetii",
      "effector_name": "CirB",
      "type": "T4SS (Dot/Icm)",
      "host_target": "HOPS complex",
      "mechanism": "Intercepts tethering for CCV expansion"
    },
    {
      "pathogen_name": "Ehrlichia chaffeensis",
      "effector_name": "TRP120",
      "type": "T4SS",
      "host_target": "Notch pathway",
      "mechanism": "Mimics Notch ligand; activates Notch signaling"
    },
    {
      "pathogen_name": "Ehrlichia chaffeensis",
      "effector_name": "TRP32",
      "type": "T4SS",
      "host_target": "Wnt pathway",
      "mechanism": "Activates Wnt signaling for host survival"
    },
    {
      "pathogen_name": "Ehrlichia chaffeensis",
      "effector_name": "Ank200",
      "type": "T4SS",
      "host_target": "Host transcription",
      "mechanism": "Ankyrin repeat; modulates gene expression"
    },
    {
      "pathogen_name": "Enterococcus faecalis",
      "effector_name": "Cyl",
      "type": "Pore-forming toxin",
      "host_target": "Membrane",
      "mechanism": "Cytolysin; hemolytic/bactericidal"
    },
    {
      "pathogen_name": "Enterococcus faecalis",
      "effector_name": "Esp",
      "type": "Surface protein",
      "host_target": "Host cells",
      "mechanism": "Enterococcal surface protein; biofilm"
    },
    {
      "pathogen_name": "Enterococcus faecalis",
      "effector_name": "GelE",
      "type": "Gelatinase",
      "host_target": "ECM proteins",
      "mechanism": "Extracellular protease"
    },
    {
      "pathogen_name": "Enterococcus faecalis",
      "effector_name": "SprE",
      "type": "Serine protease",
      "host_target": "Host proteins",
      "mechanism": "Immune evasion factor"
    },
    {
      "pathogen_name": "Enterococcus faecalis",
      "effector_name": "Ace",
      "type": "Adhesin",
      "host_target": "Collagen",
      "mechanism": "Adherence to collagen"
    },
    {
      "pathogen_name": "Escherichia coli K1",
      "effector_name": "IbeA",
      "type": "Invasin",
      "host_target": "Vimentin",
      "mechanism": "Invasion of brain microvascular endothelial cells"
    },
    {
      "pathogen_name": "Escherichia coli K1",
      "effector_name": "IbeB",
      "type": "Invasin",
      "host_target": "Host membranes",
      "mechanism": "Invasion factor"
    },
    {
      "pathogen_name": "Escherichia coli K1",
      "effector_name": "OmpA",
      "type": "Outer membrane",
      "host_target": "GPI-anchored proteins",
      "mechanism": "Invasion and intracellular survival"
    },
    {
      "pathogen_name": "Escherichia coli K1",
      "effector_name": "K1 capsule",
      "type": "Polysaccharide",
      "host_target": "Immune evasion",
      "mechanism": "Antiphagocytic capsular polysaccharide"
    },
    {
      "pathogen_name": "Escherichia coli K1",
      "effector_name": "CNF1",
      "type": "Toxin",
      "host_target": "Rho GTPases",
      "mechanism": "Deamidase; constitutive Rho activation"
    },
    {
      "pathogen_name": "Francisella tularensis",
      "effector_name": "IglC",
      "type": "T6SS",
      "host_target": "Phagosomal membrane",
      "mechanism": "Essential for phagosomal escape"
    },
    {
      "pathogen_name": "Francisella tularensis",
      "effector_name": "IglD",
      "type": "T6SS",
      "host_target": "Phagosomal membrane",
      "mechanism": "Component of T6SS apparatus"
    },
    {
      "pathogen_name": "Francisella tularensis",
      "effector_name": "IglE",
      "type": "T6SS",
      "host_target": "Vacuole",
      "mechanism": "Contributes to phagosomal disruption"
    },
    {
      "pathogen_name": "Francisella tularensis",
      "effector_name": "MglA",
      "type": "Regulator",
      "host_target": "Transcription",
      "mechanism": "Global virulence regulator"
    },
    {
      "pathogen_name": "Francisella tularensis",
      "effector_name": "FevR",
      "type": "Regulator",
      "host_target": "PP2C",
      "mechanism": "Interacts with phosphatase; regulates gene expression"
    },
    {
      "pathogen_name": "Haemophilus influenzae",
      "effector_name": "Hap",
      "type": "Autotransporter",
      "host_target": "Extracellular matrix",
      "mechanism": "Serine protease; adherence"
    },
    {
      "pathogen_name": "Haemophilus influenzae",
      "effector_name": "HMW1",
      "type": "Adhesin",
      "host_target": "Epithelial cells",
      "mechanism": "High molecular weight adhesin"
    },
    {
      "pathogen_name": "Haemophilus influenzae",
      "effector_name": "HMW2",
      "type": "Adhesin",
      "host_target": "Epithelial cells",
      "mechanism": "High molecular weight adhesin"
    },
    {
      "pathogen_name": "Haemophilus influenzae",
      "effector_name": "Hia",
      "type": "Adhesin",
      "host_target": "Host cells",
      "mechanism": "Haemophilus IgA protease"
    },
    {
      "pathogen_name": "Haemophilus influenzae",
      "effector_name": "P5",
      "type": "OMP",
      "host_target": "ICAM-1",
      "mechanism": "Adherence to activated epithelial cells"
    },
    {
      "pathogen_name": "Helicobacter pylori",
      "effector_name": "CagA",
      "type": "T4SS effector",
      "host_target": "SHP-2 / PAR1",
      "mechanism": "Injected by T4SS; cell signaling disruption"
    },
    {
      "pathogen_name": "Helicobacter pylori",
      "effector_name": "VacA",
      "type": "Pore-forming toxin",
      "host_target": "Mitochondria / lysosomes",
      "mechanism": "Vacuolating cytotoxin"
    },
    {
      "pathogen_name": "Helicobacter pylori",
      "effector_name": "UreA",
      "type": "Urease",
      "host_target": "Stomach acid",
      "mechanism": "Neutralizes gastric pH"
    },
    {
      "pathogen_name": "Helicobacter pylori",
      "effector_name": "HtrA",
      "type": "Serine protease",
      "host_target": "E-cadherin",
      "mechanism": "Cleaves E-cadherin; disrupts junctions"
    },
    {
      "pathogen_name": "Helicobacter pylori",
      "effector_name": "OipA",
      "type": "Outer membrane",
      "host_target": "IL-8 induction",
      "mechanism": "Inflammatory activation"
    },
    {
      "pathogen_name": "Klebsiella pneumoniae",
      "effector_name": "CPS",
      "type": "Polysaccharide",
      "host_target": "Immune evasion",
      "mechanism": "Capsular polysaccharide; antiphagocytic"
    },
    {
      "pathogen_name": "Klebsiella pneumoniae",
      "effector_name": "LPS",
      "type": "Lipopolysaccharide",
      "host_target": "TLR4",
      "mechanism": "Endotoxin; inflammatory"
    },
    {
      "pathogen_name": "Klebsiella pneumoniae",
      "effector_name": "FimH",
      "type": "Fimbrial adhesin",
      "host_target": "Mannose receptors",
      "mechanism": "Type 1 fimbriae; adhesion"
    },
    {
      "pathogen_name": "Klebsiella pneumoniae",
      "effector_name": "MrkD",
      "type": "Fimbrial adhesin",
      "host_target": "Extracellular matrix",
      "mechanism": "Type 3 fimbriae; biofilm"
    },
    {
      "pathogen_name": "Klebsiella pneumoniae",
      "effector_name": "KPC",
      "type": "Beta-lactamase",
      "host_target": "Antibiotics",
      "mechanism": "Carbapenem resistance"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "DrrA/SidM",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "GEF and GDF for Rab1; AMPylates"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "AnkX",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1 / Rab35",
      "mechanism": "FIC domain phosphocholinase"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "Lem3",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "Dephosphocholinase"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "SidD",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "DeAMPylase"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "LidA",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Rab1",
      "mechanism": "Binds/stabilizes active Rab1"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "SidC",
      "type": "T4SS (Dot/Icm)",
      "host_target": "ER membranes",
      "mechanism": "Recruits ER vesicles to LCV"
    },
    {
      "pathogen_name": "Legionella pneumophila",
      "effector_name": "VipD",
      "type": "T4SS (Dot/Icm)",
      "host_target": "Endosomal Rab5/Rab22",
      "mechanism": "Phospholipase A1; displaces from endosomes"
    },
    {
      "pathogen_name": "Leptospira interrogans",
      "effector_name": "LipL32",
      "type": "Surface lipoprotein",
      "host_target": "Host cells",
      "mechanism": "Major outer membrane protein"
    },
    {
      "pathogen_name": "Leptospira interrogans",
      "effector_name": "LipL41",
      "type": "Surface lipoprotein",
      "host_target": "Host cells",
      "mechanism": "Minor outer membrane protein"
    },
    {
      "pathogen_name": "Leptospira interrogans",
      "effector_name": "Loa22",
      "type": "Surface protein",
      "host_target": "Collagen",
      "mechanism": "Adhesion to host ECM"
    },
    {
      "pathogen_name": "Leptospira interrogans",
      "effector_name": "LenA",
      "type": "Surface protein",
      "host_target": "Complement",
      "mechanism": "Factor H binding"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "LLO",
      "type": "Toxin",
      "host_target": "Cholesterol",
      "mechanism": "Pore-forming cytolysin"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "ActA",
      "type": "Surface protein",
      "host_target": "Arp2/3",
      "mechanism": "Mimics host WASP"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "InlA",
      "type": "Invasin",
      "host_target": "E-cadherin",
      "mechanism": "Triggers zipper-mediated entry"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "InlB",
      "type": "Invasin",
      "host_target": "Met receptor",
      "mechanism": "Triggers PI3K and Rac1 signaling"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "PlcA",
      "type": "Phospholipase",
      "host_target": "PI(4,5)P2",
      "mechanism": "PI-PLC vacuolar escape"
    },
    {
      "pathogen_name": "Listeria monocytogenes",
      "effector_name": "PlcB",
      "type": "Phospholipase",
      "host_target": "Phosphatidylcholine",
      "mechanism": "Broad-range phospholipase"
    },
    {
      "pathogen_name": "Mycobacterium avium",
      "effector_name": "LAM",
      "type": "Glycolipid",
      "host_target": "Vps34",
      "mechanism": "Lipoarabinomannan; blocks signaling"
    },
    {
      "pathogen_name": "Mycobacterium avium",
      "effector_name": "MAV_2941",
      "type": "Secreted protein",
      "host_target": "Host cells",
      "mechanism": "Intracellular survival factor"
    },
    {
      "pathogen_name": "Mycobacterium bovis",
      "effector_name": "LAM",
      "type": "Glycolipid",
      "host_target": "Vps34",
      "mechanism": "Lipoarabinomannan"
    },
    {
      "pathogen_name": "Mycobacterium bovis",
      "effector_name": "ESAT-6",
      "type": "T7SS (ESX-1)",
      "host_target": "Membrane",
      "mechanism": "Early secretory antigenic target"
    },
    {
      "pathogen_name": "Mycobacterium bovis",
      "effector_name": "CFP-10",
      "type": "T7SS (ESX-1)",
      "host_target": "Host cells",
      "mechanism": "Culture filtrate protein 10"
    },
    {
      "pathogen_name": "Mycobacterium bovis",
      "effector_name": "MPB70",
      "type": "Secreted protein",
      "host_target": "Host immune",
      "mechanism": "Major secreted antigen"
    },
    {
      "pathogen_name": "Mycobacterium leprae",
      "effector_name": "LAM",
      "type": "Glycolipid",
      "host_target": "Vps34",
      "mechanism": "Similar to M. tuberculosis"
    },
    {
      "pathogen_name": "Mycobacterium leprae",
      "effector_name": "ML0098",
      "type": "Secreted protein",
      "host_target": "Host signaling",
      "mechanism": "Modulates TLR signaling"
    },
    {
      "pathogen_name": "Mycobacterium leprae",
      "effector_name": "ML0840",
      "type": "Secreted protein",
      "host_target": "Host cells",
      "mechanism": "Putative virulence factor"
    },
    {
      "pathogen_name": "Mycobacterium leprae",
      "effector_name": "ML2499",
      "type": "Surface protein",
      "host_target": "Schwann cells",
      "mechanism": "Adhesion to Schwann cells"
    },
    {
      "pathogen_name": "Mycobacterium marinum",
      "effector_name": "LAM",
      "type": "Glycolipid",
      "host_target": "Vps34",
      "mechanism": "Lipoarabinomannan"
    },
    {
      "pathogen_name": "Mycobacterium marinum",
      "effector_name": "ESAT-6",
      "type": "T7SS (ESX-1)",
      "host_target": "Membrane",
      "mechanism": "Pore-forming; phagosomal permeabilization"
    },
    {
      "pathogen_name": "Mycobacterium marinum",
      "effector_name": "MMPL7",
      "type": "Transport protein",
      "host_target": "Drug resistance",
      "mechanism": "Efflux pump"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "LAM",
      "type": "Glycolipid",
      "host_target": "Vps34",
      "mechanism": "Inhibits Ca2+ signaling"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "SapM",
      "type": "Secreted phosphatase",
      "host_target": "PI3P",
      "mechanism": "Dephosphorylates PI3P"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "MptpA",
      "type": "Secreted phosphatase",
      "host_target": "V-ATPase",
      "mechanism": "Blocks V-ATPase trafficking"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "MptpB",
      "type": "Secreted phosphatase",
      "host_target": "PI(3,5)P2",
      "mechanism": "Hydrolyzes PI(3,5)P2"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "Eis",
      "type": "Secreted protein",
      "host_target": "JNK/AMPK",
      "mechanism": "Acetyltransferase; inhibits autophagy"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "PknG",
      "type": "Ser/Thr kinase",
      "host_target": "Rab proteins",
      "mechanism": "Phosphorylates host Rab GTPases"
    },
    {
      "pathogen_name": "Mycobacterium tuberculosis",
      "effector_name": "ESAT-6",
      "type": "T7SS (ESX-1)",
      "host_target": "Membrane",
      "mechanism": "Pore-forming; promotes phagosomal escape"
    },
    {
      "pathogen_name": "Neisseria gonorrhoeae",
      "effector_name": "PorB",
      "type": "Porin",
      "host_target": "Mitochondria",
      "mechanism": "Voltage-gated porin; inhibits apoptosis"
    },
    {
      "pathogen_name": "Neisseria gonorrhoeae",
      "effector_name": "Opa",
      "type": "Adhesin",
      "host_target": "CEACAM family",
      "mechanism": "Carcinoembryonic antigen receptor binding"
    },
    {
      "pathogen_name": "Neisseria gonorrhoeae",
      "effector_name": "PilE",
      "type": "Type IV pilin",
      "host_target": "CD46",
      "mechanism": "Twitching motility; adherence"
    },
    {
      "pathogen_name": "Neisseria gonorrhoeae",
      "effector_name": "Ng-MIP",
      "type": "Macrophage infectivity",
      "host_target": "Host membranes",
      "mechanism": "Porin activity"
    },
    {
      "pathogen_name": "Neisseria gonorrhoeae",
      "effector_name": "TspB",
      "type": "Toxin",
      "host_target": "Host cells",
      "mechanism": "Neisserial toxin"
    },
    {
      "pathogen_name": "Neisseria meningitidis",
      "effector_name": "PorA",
      "type": "Porin",
      "host_target": "Host membranes",
      "mechanism": "Major outer membrane porin"
    },
    {
      "pathogen_name": "Neisseria meningitidis",
      "effector_name": "PorB",
      "type": "Porin",
      "host_target": "Mitochondria",
      "mechanism": "Voltage-gated; anti-apoptotic"
    },
    {
      "pathogen_name": "Neisseria meningitidis",
      "effector_name": "Opca",
      "type": "Adhesin",
      "host_target": "CEACAM/fibronectin",
      "mechanism": "Adhesion and invasion"
    },
    {
      "pathogen_name": "Neisseria meningitidis",
      "effector_name": "NadA",
      "type": "Adhesin",
      "host_target": "Host cells",
      "mechanism": "Neisserial adhesin A"
    },
    {
      "pathogen_name": "Neisseria meningitidis",
      "effector_name": "FetA",
      "type": "Iron transporter",
      "host_target": "Host iron",
      "mechanism": "Lactoferrin receptor"
    },
    {
      "pathogen_name": "Nocardia asteroides",
      "effector_name": "Mce",
      "type": "Mammalian cell entry",
      "host_target": "Host membranes",
      "mechanism": "Invasion and survival"
    },
    {
      "pathogen_name": "Nocardia asteroides",
      "effector_name": "PLA",
      "type": "Phospholipase",
      "host_target": "Host membranes",
      "mechanism": "Phagosomal escape factor"
    },
    {
      "pathogen_name": "Nocardia asteroides",
      "effector_name": "Sod",
      "type": "Superoxide dismutase",
      "host_target": "ROS",
      "mechanism": "Oxidative stress resistance"
    },
    {
      "pathogen_name": "Nocardia asteroides",
      "effector_name": "Cat",
      "type": "Catalase",
      "host_target": "H2O2",
      "mechanism": "Hydrogen peroxide resistance"
    },
    {
      "pathogen_name": "Orientia tsutsugamushi",
      "effector_name": "ScaA",
      "type": "Autotransporter",
      "host_target": "Host cell adhesion",
      "mechanism": "Surface cell antigen A"
    },
    {
      "pathogen_name": "Orientia tsutsugamushi",
      "effector_name": "ScaC",
      "type": "Autotransporter",
      "host_target": "Host cell adhesion",
      "mechanism": "Surface cell antigen C"
    },
    {
      "pathogen_name": "Orientia tsutsugamushi",
      "effector_name": "HlyA",
      "type": "Hemolysin",
      "host_target": "Membrane",
      "mechanism": "Putative hemolysin for escape"
    },
    {
      "pathogen_name": "Orientia tsutsugamushi",
      "effector_name": "Pld",
      "type": "Phospholipase D",
      "host_target": "Host membranes",
      "mechanism": "Phagosomal escape"
    },
    {
      "pathogen_name": "Orientia tsutsugamushi",
      "effector_name": "Tsa56",
      "type": "Surface protein",
      "host_target": "Host immune evasion",
      "mechanism": "Major outer membrane protein"
    },
    {
      "pathogen_name": "Porphyromonas gingivalis",
      "effector_name": "RgpA",
      "type": "Cysteine protease",
      "host_target": "Host proteins",
      "mechanism": "Arginine-gingipain A"
    },
    {
      "pathogen_name": "Porphyromonas gingivalis",
      "effector_name": "RgpB",
      "type": "Cysteine protease",
      "host_target": "Host proteins",
      "mechanism": "Arginine-gingipain B"
    },
    {
      "pathogen_name": "Porphyromonas gingivalis",
      "effector_name": "Kgp",
      "type": "Cysteine protease",
      "host_target": "Host proteins",
      "mechanism": "Lysine-gingipain"
    },
    {
      "pathogen_name": "Porphyromonas gingivalis",
      "effector_name": "FimA",
      "type": "Fimbriae",
      "host_target": "CD14/TLR2",
      "mechanism": "Major fimbrial subunit; adhesion"
    },
    {
      "pathogen_name": "Porphyromonas gingivalis",
      "effector_name": "HagA",
      "type": "Hemagglutinin",
      "host_target": "Host cells",
      "mechanism": "Hemagglutinin A"
    },
    {
      "pathogen_name": "Pseudomonas aeruginosa",
      "effector_name": "ExoU",
      "type": "T3SS",
      "host_target": "Phospholipids",
      "mechanism": "Phospholipase A2; rapid cell lysis"
    },
    {
      "pathogen_name": "Pseudomonas aeruginosa",
      "effector_name": "ExoS",
      "type": "T3SS",
      "host_target": "Rho / Ras",
      "mechanism": "GAP and ADP-ribosyltransferase"
    },
    {
      "pathogen_name": "Pseudomonas aeruginosa",
      "effector_name": "ExoT",
      "type": "T3SS",
      "host_target": "Cdc42 / Rac1",
      "mechanism": "GAP and ADP-ribosyltransferase"
    },
    {
      "pathogen_name": "Pseudomonas aeruginosa",
      "effector_name": "ExoY",
      "type": "T3SS",
      "host_target": "cAMP/cGMP",
      "mechanism": "Adenylate cyclase; disrupts actin"
    },
    {
      "pathogen_name": "Pseudomonas aeruginosa",
      "effector_name": "ToxA",
      "type": "Exotoxin",
      "host_target": "EF-2",
      "mechanism": "ADP-ribosyltransferase; protein synthesis inhibition"
    },
    {
      "pathogen_name": "Pseudomonas aeruginosa",
      "effector_name": "Alginate",
      "type": "Exopolysaccharide",
      "host_target": "Biofilm",
      "mechanism": "Mucoid biofilm formation"
    },
    {
      "pathogen_name": "Rhodococcus equi",
      "effector_name": "VapA",
      "type": "Surface protein",
      "host_target": "Host membranes",
      "mechanism": "Virulence-associated protein; phagosome survival"
    },
    {
      "pathogen_name": "Rhodococcus equi",
      "effector_name": "VapB",
      "type": "Surface protein",
      "host_target": "Host membranes",
      "mechanism": "Alternative Vap variant"
    },
    {
      "pathogen_name": "Rhodococcus equi",
      "effector_name": "VapC",
      "type": "Surface protein",
      "host_target": "Host membranes",
      "mechanism": "Vap family member"
    },
    {
      "pathogen_name": "Rhodococcus equi",
      "effector_name": "VapD",
      "type": "Surface protein",
      "host_target": "Host membranes",
      "mechanism": "Vap family member"
    },
    {
      "pathogen_name": "Rickettsia conorii",
      "effector_name": "RickA",
      "type": "Surface protein",
      "host_target": "Arp2/3",
      "mechanism": "Actin tail formation"
    },
    {
      "pathogen_name": "Rickettsia conorii",
      "effector_name": "Sca2",
      "type": "Surface protein",
      "host_target": "Actin",
      "mechanism": "Actin-based motility"
    },
    {
      "pathogen_name": "Rickettsia conorii",
      "effector_name": "Pat1",
      "type": "Patatin-like",
      "host_target": "Phospholipids",
      "mechanism": "Membrane disruption"
    },
    {
      "pathogen_name": "Rickettsia rickettsii",
      "effector_name": "RickA",
      "type": "Surface protein",
      "host_target": "Arp2/3",
      "mechanism": "Actin polymerization; actin tails"
    },
    {
      "pathogen_name": "Rickettsia rickettsii",
      "effector_name": "Sca2",
      "type": "Surface protein",
      "host_target": "Actin",
      "mechanism": "Formin-like actin nucleator"
    },
    {
      "pathogen_name": "Rickettsia rickettsii",
      "effector_name": "Pat1",
      "type": "Patatin-like",
      "host_target": "Phospholipids",
      "mechanism": "Phospholipase; phagosomal escape"
    },
    {
      "pathogen_name": "Rickettsia rickettsii",
      "effector_name": "TlyA",
      "type": "Hemolysin",
      "host_target": "Membrane",
      "mechanism": "Pore-forming hemolysin"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SopE",
      "type": "T3SS (SPI-1)",
      "host_target": "Cdc42 / Rac1",
      "mechanism": "GEF for host Rho-family GTPases"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SipA",
      "type": "T3SS (SPI-1)",
      "host_target": "Actin",
      "mechanism": "Binds/stabilizes actin filaments"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SopB/SigD",
      "type": "T3SS (SPI-1)",
      "host_target": "PI(4,5)P2",
      "mechanism": "Phosphatidylinositol phosphatase"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SifA",
      "type": "T3SS (SPI-2)",
      "host_target": "SKIP",
      "mechanism": "Binds SKIP displacing Rab9"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "PipB2",
      "type": "T3SS (SPI-2)",
      "host_target": "Kinesin-1",
      "mechanism": "Recruits kinesin-1 to SCV"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SseJ",
      "type": "T3SS (SPI-2)",
      "host_target": "Cholesterol",
      "mechanism": "Acyltransferase"
    },
    {
      "pathogen_name": "Salmonella enterica",
      "effector_name": "SopD2",
      "type": "T3SS (SPI-2)",
      "host_target": "Rab7",
      "mechanism": "Suppresses Rab7-dependent recruitment"
    },
    {
      "pathogen_name": "Salmonella typhi",
      "effector_name": "SopE",
      "type": "T3SS (SPI-1)",
      "host_target": "Cdc42",
      "mechanism": "GEF for Cdc42"
    },
    {
      "pathogen_name": "Salmonella typhi",
      "effector_name": "SifA",
      "type": "T3SS (SPI-2)",
      "host_target": "SKIP",
      "mechanism": "SCV maintenance"
    },
    {
      "pathogen_name": "Salmonella typhi",
      "effector_name": "PipB2",
      "type": "T3SS (SPI-2)",
      "host_target": "Kinesin-1",
      "mechanism": "Recruits kinesin to SCV"
    },
    {
      "pathogen_name": "Salmonella typhi",
      "effector_name": "SseF",
      "type": "T3SS (SPI-2)",
      "host_target": "Microtubules",
      "mechanism": "SCV positioning near Golgi"
    },
    {
      "pathogen_name": "Salmonella typhi",
      "effector_name": "SseG",
      "type": "T3SS (SPI-2)",
      "host_target": "Microtubules",
      "mechanism": "SCV-Golgi association"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IpaB",
      "type": "T3SS (translocon)",
      "host_target": "Vacuolar membrane",
      "mechanism": "Pore-forming translocator"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IpaC",
      "type": "T3SS (translocon)",
      "host_target": "Actin",
      "mechanism": "Induces actin polymerization"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IcsA/VirG",
      "type": "Autotransporter",
      "host_target": "N-WASP / Arp2/3",
      "mechanism": "Recruits N-WASP and Arp2/3"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "IcsB",
      "type": "T3SS",
      "host_target": "LC3",
      "mechanism": "Masks IcsA from autophagy receptor"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "VirA",
      "type": "T3SS",
      "host_target": "Rab1",
      "mechanism": "Rab1 GAP activity"
    },
    {
      "pathogen_name": "Shigella flexneri",
      "effector_name": "OspG",
      "type": "T3SS",
      "host_target": "Ubiquitin pathway",
      "mechanism": "Kinase that inhibits NF-kB"
    },
    {
      "pathogen_name": "Staphylococcus aureus",
      "effector_name": "Hla",
      "type": "Pore-forming toxin",
      "host_target": "ADAM10",
      "mechanism": "Alpha-hemolysin; heptameric pore"
    },
    {
      "pathogen_name": "Staphylococcus aureus",
      "effector_name": "Hlb",
      "type": "Sphingomyelinase",
      "host_target": "Sphingomyelin",
      "mechanism": "Beta-hemolysin; SM hydrolysis"
    },
    {
      "pathogen_name": "Staphylococcus aureus",
      "effector_name": "PVL",
      "type": "Pore-forming toxin",
      "host_target": "C5aR / CD88",
      "mechanism": "Panton-Valentine leukocidin"
    },
    {
      "pathogen_name": "Staphylococcus aureus",
      "effector_name": "SpA",
      "type": "Surface protein",
      "host_target": "IgG / VH3",
      "mechanism": "Protein A; antibody binding"
    },
    {
      "pathogen_name": "Staphylococcus aureus",
      "effector_name": "Efb",
      "type": "Secreted protein",
      "host_target": "Fibrinogen",
      "mechanism": "Immune evasion; clot formation"
    },
    {
      "pathogen_name": "Streptococcus pneumoniae",
      "effector_name": "PLY",
      "type": "Cholesterol-dependent",
      "host_target": "Cholesterol",
      "mechanism": "Pneumolysin; pore-forming toxin"
    },
    {
      "pathogen_name": "Streptococcus pneumoniae",
      "effector_name": "PspA",
      "type": "Surface protein",
      "host_target": "Lactoferrin",
      "mechanism": "Pneumococcal surface protein A"
    },
    {
      "pathogen_name": "Streptococcus pneumoniae",
      "effector_name": "PspC",
      "type": "Surface protein",
      "host_target": "Factor H",
      "mechanism": "Complement evasion"
    },
    {
      "pathogen_name": "Streptococcus pneumoniae",
      "effector_name": "LytA",
      "type": "Amidase",
      "host_target": "Peptidoglycan",
      "mechanism": "Autolysin; biofilm release"
    },
    {
      "pathogen_name": "Streptococcus pneumoniae",
      "effector_name": "NanA",
      "type": "Neuraminidase",
      "host_target": "Sialic acid",
      "mechanism": "Cleaves host sialic acid"
    },
    {
      "pathogen_name": "Streptococcus pyogenes",
      "effector_name": "SLO",
      "type": "Cholesterol-dependent",
      "host_target": "Cholesterol",
      "mechanism": "Streptolysin O; phagosomal escape"
    },
    {
      "pathogen_name": "Streptococcus pyogenes",
      "effector_name": "SLS",
      "type": "Pore-forming",
      "host_target": "Membrane",
      "mechanism": "Streptolysin S; hemolytic"
    },
    {
      "pathogen_name": "Streptococcus pyogenes",
      "effector_name": "SpeB",
      "type": "Cysteine protease",
      "host_target": "Host proteins",
      "mechanism": "Degrades extracellular matrix"
    },
    {
      "pathogen_name": "Streptococcus pyogenes",
      "effector_name": "M protein",
      "type": "Surface protein",
      "host_target": "Factor H / C4BP",
      "mechanism": "Antiphagocytic; binds complement"
    },
    {
      "pathogen_name": "Streptococcus pyogenes",
      "effector_name": "SpeA",
      "type": "Superantigen",
      "host_target": "MHC II / TCR",
      "mechanism": "Streptococcal pyrogenic exotoxin A"
    },
    {
      "pathogen_name": "Streptomyces scabies",
      "effector_name": "TxtA",
      "type": "Synthetase",
      "host_target": "Plant cells",
      "mechanism": "Thaxtomin A biosynthesis; cellulose inhibition"
    },
    {
      "pathogen_name": "Streptomyces scabies",
      "effector_name": "TxtB",
      "type": "Synthetase",
      "host_target": "Plant cells",
      "mechanism": "Thaxtomin A biosynthesis"
    },
    {
      "pathogen_name": "Streptomyces scabies",
      "effector_name": "TxtC",
      "type": "Synthetase",
      "host_target": "Plant cells",
      "mechanism": "Thaxtomin A biosynthesis"
    },
    {
      "pathogen_name": "Streptomyces scabies",
      "effector_name": "Nec1",
      "type": "Virulence factor",
      "host_target": "Plant tissues",
      "mechanism": "Necrosis-inducing protein"
    },
    {
      "pathogen_name": "Treponema pallidum",
      "effector_name": "TprK",
      "type": "Surface protein",
      "host_target": "Immune evasion",
      "mechanism": "Antigenic variation; VMP-like"
    },
    {
      "pathogen_name": "Treponema pallidum",
      "effector_name": "Tp0751",
      "type": "Pallilysin",
      "host_target": "Laminin / fibrinogen",
      "mechanism": "Metalloprotease; tissue penetration"
    },
    {
      "pathogen_name": "Treponema pallidum",
      "effector_name": "Tp0483",
      "type": "Membrane protein",
      "host_target": "Host cells",
      "mechanism": "Cytoplasmic membrane protein"
    },
    {
      "pathogen_name": "Treponema pallidum",
      "effector_name": "FlaA",
      "type": "Flagellin",
      "host_target": "Host tissue",
      "mechanism": "Periplasmic flagellar sheath"
    },
    {
      "pathogen_name": "Tropheryma whipplei",
      "effector_name": "TW1",
      "type": "Surface protein",
      "host_target": "Host cells",
      "mechanism": "Adhesion factor"
    },
    {
      "pathogen_name": "Tropheryma whipplei",
      "effector_name": "TW2",
      "type": "Surface protein",
      "host_target": "Macrophages",
      "mechanism": "Intracellular survival"
    },
    {
      "pathogen_name": "Tropheryma whipplei",
      "effector_name": "TW3",
      "type": "Surface protein",
      "host_target": "Immune modulation",
      "mechanism": "Modulates host immune response"
    },
    {
      "pathogen_name": "Vibrio cholerae",
      "effector_name": "CTX",
      "type": "AB toxin",
      "host_target": "Gs/adenylate cyclase",
      "mechanism": "Cholera toxin; ADP-ribosyltransferase"
    },
    {
      "pathogen_name": "Vibrio cholerae",
      "effector_name": "TCP",
      "type": "Pilus",
      "host_target": "Host intestinal cells",
      "mechanism": "Toxin-coregulated pilus; colonization"
    },
    {
      "pathogen_name": "Vibrio cholerae",
      "effector_name": "VSP",
      "type": "T6SS",
      "host_target": "Host cells",
      "mechanism": "Type VI secretion; effector translocation"
    },
    {
      "pathogen_name": "Vibrio cholerae",
      "effector_name": "HlyA",
      "type": "Hemolysin",
      "host_target": "Membrane",
      "mechanism": "Pore-forming cytolysin"
    },
    {
      "pathogen_name": "Vibrio cholerae",
      "effector_name": "VvpE",
      "type": "Protease",
      "host_target": "Mucin",
      "mechanism": "Mucinase; biofilm dispersal"
    },
    {
      "pathogen_name": "Yersinia pestis",
      "effector_name": "YopE",
      "type": "T3SS (Ysc)",
      "host_target": "Rho GTPases",
      "mechanism": "GAP for RhoA, Rac1, Cdc42"
    },
    {
      "pathogen_name": "Yersinia pestis",
      "effector_name": "YopH",
      "type": "T3SS (Ysc)",
      "host_target": "FAK / p130Cas",
      "mechanism": "Potent PTPase; disrupts focal adhesions"
    },
    {
      "pathogen_name": "Yersinia pestis",
      "effector_name": "YopJ",
      "type": "T3SS (Ysc)",
      "host_target": "MAPKK / IKK",
      "mechanism": "Acetyltransferase; blocks NF-kB and MAPK"
    },
    {
      "pathogen_name": "Yersinia pestis",
      "effector_name": "YopM",
      "type": "T3SS (Ysc)",
      "host_target": "PRP kinases",
      "mechanism": "Leucine-rich repeat; binds thrombin"
    },
    {
      "pathogen_name": "Yersinia pestis",
      "effector_name": "YopT",
      "type": "T3SS (Ysc)",
      "host_target": "Rho GTPases",
      "mechanism": "Cysteine protease; cleaves prenylated Rho"
    },
    {
      "pathogen_name": "Yersinia pestis",
      "effector_name": "LcrV",
      "type": "T3SS needle tip",
      "host_target": "TLR2 / CD14",
      "mechanism": "Modulates immune response"
    },
    {
      "pathogen_name": "Yersinia pseudotuberculosis",
      "effector_name": "YopE",
      "type": "T3SS (Ysa/Ysc)",
      "host_target": "Rho GTPases",
      "mechanism": "GAP activity"
    },
    {
      "pathogen_name": "Yersinia pseudotuberculosis",
      "effector_name": "YopH",
      "type": "T3SS (Ysa/Ysc)",
      "host_target": "FAK / p130Cas",
      "mechanism": "PTPase; host cell detachment"
    },
    {
      "pathogen_name": "Yersinia pseudotuberculosis",
      "effector_name": "YopJ",
      "type": "T3SS (Ysa/Ysc)",
      "host_target": "MAPKK",
      "mechanism": "Blocks inflammatory signaling"
    },
    {
      "pathogen_name": "Yersinia pseudotuberculosis",
      "effector_name": "YpkA/YopO",
      "type": "T3SS (Ysa/Ysc)",
      "host_target": "Actin / RhoA",
      "mechanism": "Ser/Thr kinase; actin binding"
    }
  ],
  "host_proteins": [
    {
      "name": "ADAM10",
      "full_name": "A disintegrin and metalloprotease domain 10",
      "function": "Metalloprotease; Hla receptor",
      "localization": "Plasma membrane",
      "pathway": "Receptor signaling"
    },
    {
      "name": "Actin",
      "full_name": "Actin",
      "function": "Cytoskeletal protein forming microfilaments",
      "localization": "Cytoskeleton",
      "pathway": "Actin polymerization"
    },
    {
      "name": "Arp2/3",
      "full_name": "Actin-related protein 2/3 complex",
      "function": "Actin nucleation complex",
      "localization": "Cytoskeleton",
      "pathway": "Actin polymerization"
    },
    {
      "name": "C4BP",
      "full_name": "C4b-binding protein",
      "function": "Complement pathway inhibitor",
      "localization": "Serum",
      "pathway": "Immune signaling"
    },
    {
      "name": "C5aR",
      "full_name": "C5 anaphylatoxin receptor (CD88)",
      "function": "Complement receptor",
      "localization": "Plasma membrane",
      "pathway": "Immune signaling"
    },
    {
      "name": "CD46",
      "full_name": "Membrane cofactor protein (CD46)",
      "function": "Complement regulatory protein",
      "localization": "Plasma membrane",
      "pathway": "Immune signaling"
    },
    {
      "name": "CEACAM",
      "full_name": "Carcinoembryonic antigen-related cell adhesion molecule",
      "function": "Cell adhesion molecule",
      "localization": "Plasma membrane",
      "pathway": "Cell adhesion"
    },
    {
      "name": "CaM",
      "full_name": "Calmodulin",
      "function": "Calcium-binding messenger protein",
      "localization": "Cytosol",
      "pathway": "Calcium signaling"
    },
    {
      "name": "Cathepsin D",
      "full_name": "Cathepsin D",
      "function": "Lysosomal aspartyl protease",
      "localization": "Lysosomes",
      "pathway": "Proteolysis"
    },
    {
      "name": "Cdc42",
      "full_name": "Cell division control protein 42",
      "function": "Rho GTPase regulating actin dynamics",
      "localization": "Cytosol/membrane",
      "pathway": "Actin polymerization"
    },
    {
      "name": "Cholesterol",
      "full_name": "Cholesterol",
      "function": "Membrane lipid; enriched in lipid rafts",
      "localization": "Membrane",
      "pathway": "Lipid metabolism"
    },
    {
      "name": "Claudins",
      "full_name": "Claudin family",
      "function": "Tight junction transmembrane proteins",
      "localization": "Tight junctions",
      "pathway": "Cell adhesion"
    },
    {
      "name": "Collagen",
      "full_name": "Collagen",
      "function": "Extracellular matrix structural protein",
      "localization": "ECM",
      "pathway": "Cell adhesion"
    },
    {
      "name": "E-cadherin",
      "full_name": "Epithelial cadherin",
      "function": "Cell-cell adhesion glycoprotein",
      "localization": "Adherens junctions",
      "pathway": "Cell adhesion"
    },
    {
      "name": "EEA1",
      "full_name": "Early endosome antigen 1",
      "function": "Early endosome tethering factor",
      "localization": "Early endosomes",
      "pathway": "Vesicular transport"
    },
    {
      "name": "EF-2",
      "full_name": "Elongation factor 2",
      "function": "Ribosomal translocation during protein synthesis",
      "localization": "Cytosol",
      "pathway": "Protein synthesis"
    },
    {
      "name": "ER membrane",
      "full_name": "Endoplasmic reticulum membrane",
      "function": "ER-derived membrane compartment",
      "localization": "ER",
      "pathway": "Secretory pathway"
    },
    {
      "name": "Extracellular matrix",
      "full_name": "Extracellular matrix proteins",
      "function": "ECM structural components",
      "localization": "ECM",
      "pathway": "Cell adhesion"
    },
    {
      "name": "FAK",
      "full_name": "Focal adhesion kinase",
      "function": "Tyrosine kinase; integrin signaling",
      "localization": "Focal adhesions",
      "pathway": "Cell adhesion"
    },
    {
      "name": "Factor H",
      "full_name": "Complement factor H",
      "function": "Complement pathway regulator",
      "localization": "Serum",
      "pathway": "Immune signaling"
    },
    {
      "name": "Fibrinogen",
      "full_name": "Fibrinogen",
      "function": "Blood coagulation factor",
      "localization": "Serum",
      "pathway": "Immune evasion"
    },
    {
      "name": "GPI anchor",
      "full_name": "Glycosylphosphatidylinositol anchor",
      "function": "Membrane anchoring mechanism",
      "localization": "Plasma membrane",
      "pathway": "Membrane anchoring"
    },
    {
      "name": "Golgi",
      "full_name": "Golgi apparatus",
      "function": "Secretory pathway organelle",
      "localization": "Golgi",
      "pathway": "Secretory pathway"
    },
    {
      "name": "Host DNA",
      "full_name": "Host genomic DNA",
      "function": "DNA damage target",
      "localization": "Nucleus",
      "pathway": "Cell cycle"
    },
    {
      "name": "Host cells",
      "full_name": "Host cell surface receptors",
      "function": "General host cell targets",
      "localization": "Plasma membrane",
      "pathway": "Cell adhesion"
    },
    {
      "name": "Host immune",
      "full_name": "Host immune system",
      "function": "Immune evasion targets",
      "localization": "Various",
      "pathway": "Immune signaling"
    },
    {
      "name": "Host iron",
      "full_name": "Host iron/heme compounds",
      "function": "Iron acquisition targets",
      "localization": "Serum/tissues",
      "pathway": "Iron homeostasis"
    },
    {
      "name": "Host membranes",
      "full_name": "Host cell membranes",
      "function": "General membrane disruption targets",
      "localization": "Membrane",
      "pathway": "Membrane disruption"
    },
    {
      "name": "Host signaling",
      "full_name": "Host cell signaling pathways",
      "function": "Signaling pathway modulation",
      "localization": "Cytosol/nucleus",
      "pathway": "Receptor signaling"
    },
    {
      "name": "ICAM-1",
      "full_name": "Intercellular adhesion molecule 1",
      "function": "Leukocyte adhesion receptor",
      "localization": "Plasma membrane",
      "pathway": "Cell adhesion"
    },
    {
      "name": "IKK",
      "full_name": "I-kappa-B kinase",
      "function": "NF-kB pathway kinase",
      "localization": "Cytosol",
      "pathway": "Immune signaling"
    },
    {
      "name": "IL-1beta",
      "full_name": "Interleukin-1 beta",
      "function": "Pro-inflammatory cytokine",
      "localization": "Secreted",
      "pathway": "Immune signaling"
    },
    {
      "name": "Kinesin-1",
      "full_name": "Kinesin heavy chain",
      "function": "Microtubule motor protein",
      "localization": "Microtubules",
      "pathway": "Vesicular transport"
    },
    {
      "name": "LAMP1",
      "full_name": "Lysosomal-associated membrane protein 1",
      "function": "Lysosomal membrane glycoprotein",
      "localization": "Lysosomes",
      "pathway": "Lysosome biogenesis"
    },
    {
      "name": "LC3",
      "full_name": "Microtubule-associated protein 1A/1B-light chain 3",
      "function": "Autophagosomal marker protein",
      "localization": "Autophagosome",
      "pathway": "Autophagy"
    },
    {
      "name": "Lactoferrin",
      "full_name": "Lactoferrin",
      "function": "Iron-binding glycoprotein",
      "localization": "Secreted",
      "pathway": "Iron homeostasis"
    },
    {
      "name": "M6PR",
      "full_name": "Mannose-6-phosphate receptor",
      "function": "Lysosomal enzyme trafficking",
      "localization": "Trans-Golgi/endosomes",
      "pathway": "Endocytic recycling"
    },
    {
      "name": "MAPKK",
      "full_name": "MAPK kinase",
      "function": "ERK/JNK/p38 pathway kinase",
      "localization": "Cytosol",
      "pathway": "Receptor signaling"
    },
    {
      "name": "MHC II",
      "full_name": "Major histocompatibility complex class II",
      "function": "Antigen presentation",
      "localization": "Plasma membrane/endosomes",
      "pathway": "Immune signaling"
    },
    {
      "name": "Met receptor",
      "full_name": "Hepatocyte growth factor receptor",
      "function": "Receptor tyrosine kinase",
      "localization": "Plasma membrane",
      "pathway": "Receptor signaling"
    },
    {
      "name": "Microtubules",
      "full_name": "Microtubules",
      "function": "Cytoskeletal filaments for vesicular transport",
      "localization": "Cytoskeleton",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Mitochondria",
      "full_name": "Mitochondrion",
      "function": "Mitochondrial membrane and matrix",
      "localization": "Mitochondria",
      "pathway": "Apoptosis"
    },
    {
      "name": "N-WASP",
      "full_name": "Neural Wiskott-Aldrich syndrome protein",
      "function": "Actin nucleation promoter",
      "localization": "Cytosol",
      "pathway": "Actin polymerization"
    },
    {
      "name": "NADPH oxidase",
      "full_name": "NADPH oxidase 2 (gp91phox)",
      "function": "Superoxide-generating enzyme",
      "localization": "Phagosome membrane",
      "pathway": "Oxidative burst"
    },
    {
      "name": "Notch",
      "full_name": "Notch receptor",
      "function": "Cell-fate determination receptor",
      "localization": "Plasma membrane",
      "pathway": "Receptor signaling"
    },
    {
      "name": "PI(3,5)P2",
      "full_name": "Phosphatidylinositol 3,5-bisphosphate",
      "function": "Late endosome signaling lipid",
      "localization": "Late endosomes",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "PI(4,5)P2",
      "full_name": "Phosphatidylinositol 4,5-bisphosphate",
      "function": "Membrane signaling phospholipid",
      "localization": "Plasma membrane",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "PI3P",
      "full_name": "Phosphatidylinositol 3-phosphate",
      "function": "Early endosome signaling lipid",
      "localization": "Early endosomes",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "PIKfyve",
      "full_name": "FYVE finger-containing phosphoinositide kinase",
      "function": "Generates PI(3,5)P2 from PI3P",
      "localization": "Endosomes",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "RILP",
      "full_name": "Rab-interacting lysosomal protein",
      "function": "Regulates lysosomal positioning",
      "localization": "Late endosomes/lysosomes",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Rab1",
      "full_name": "Ras-related protein Rab-1",
      "function": "ER-to-Golgi vesicular transport GTPase",
      "localization": "ER/Golgi",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Rab35",
      "full_name": "Ras-related protein Rab-35",
      "function": "Endocytic recycling GTPase",
      "localization": "Plasma membrane/endosomes",
      "pathway": "Endocytic recycling"
    },
    {
      "name": "Rab5",
      "full_name": "Ras-related protein Rab-5",
      "function": "Early endosome GTPase",
      "localization": "Early endosomes",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Rab7",
      "full_name": "Ras-related protein Rab-7",
      "function": "Late endosome GTPase regulating lysosomal fusion",
      "localization": "Late endosomes",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Rab9",
      "full_name": "Ras-related protein Rab-9",
      "function": "Late endosome-to-Golgi transport GTPase",
      "localization": "Late endosomes",
      "pathway": "Retrograde transport"
    },
    {
      "name": "Rac1",
      "full_name": "Ras-related C3 botulinum toxin substrate 1",
      "function": "Regulates membrane ruffling and cell motility",
      "localization": "Membrane",
      "pathway": "Actin polymerization"
    },
    {
      "name": "RhoA",
      "full_name": "Ras homolog family member A",
      "function": "Rho GTPase; stress fiber formation",
      "localization": "Cytosol/membrane",
      "pathway": "Actin polymerization"
    },
    {
      "name": "SHP-2",
      "full_name": "SH2 domain-containing tyrosine phosphatase 2",
      "function": "Tyrosine phosphatase",
      "localization": "Cytosol",
      "pathway": "Receptor signaling"
    },
    {
      "name": "SKIP",
      "full_name": "SifA and kinesin-interacting protein",
      "function": "Plekhm1; regulates Rab9 localization",
      "localization": "Cytosol",
      "pathway": "Vesicular transport"
    },
    {
      "name": "SNAP-29",
      "full_name": "Synaptosomal-associated protein 29",
      "function": "Autophagosome-lysosome SNARE",
      "localization": "Cytosol",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Sphingomyelin",
      "full_name": "Sphingomyelin",
      "function": "Membrane lipid",
      "localization": "Membrane",
      "pathway": "Lipid metabolism"
    },
    {
      "name": "TLR2",
      "full_name": "Toll-like receptor 2",
      "function": "Pattern recognition receptor",
      "localization": "Plasma membrane",
      "pathway": "Immune signaling"
    },
    {
      "name": "TLR4",
      "full_name": "Toll-like receptor 4",
      "function": "Pattern recognition receptor for LPS",
      "localization": "Plasma membrane",
      "pathway": "Immune signaling"
    },
    {
      "name": "TLR5",
      "full_name": "Toll-like receptor 5",
      "function": "Flagellin receptor",
      "localization": "Plasma membrane",
      "pathway": "Immune signaling"
    },
    {
      "name": "TNF-alpha",
      "full_name": "Tumor necrosis factor alpha",
      "function": "Pro-inflammatory cytokine",
      "localization": "Secreted",
      "pathway": "Immune signaling"
    },
    {
      "name": "Ubiquitin",
      "full_name": "Ubiquitin",
      "function": "Protein degradation tag; autophagy signaling",
      "localization": "Cytosol/nucleus",
      "pathway": "Autophagy"
    },
    {
      "name": "V-ATPase",
      "full_name": "Vacuolar-type H+-ATPase",
      "function": "Proton pump for phagosomal acidification",
      "localization": "Phagosome/lysosome",
      "pathway": "Acidification"
    },
    {
      "name": "VAMP8",
      "full_name": "Vesicle-associated membrane protein 8",
      "function": "Endosomal/vacuolar SNARE",
      "localization": "Lysosomes",
      "pathway": "Vesicular transport"
    },
    {
      "name": "Vimentin",
      "full_name": "Vimentin",
      "function": "Intermediate filament protein",
      "localization": "Cytoskeleton",
      "pathway": "Cytoskeletal organization"
    },
    {
      "name": "Vps34",
      "full_name": "Phosphatidylinositol 3-kinase class III",
      "function": "Generates PI3P for phagosome maturation",
      "localization": "Endosomes",
      "pathway": "Phosphoinositide signaling"
    },
    {
      "name": "Wnt",
      "full_name": "Wnt signaling components",
      "function": "Developmental signaling pathway",
      "localization": "Cytosol/nucleus",
      "pathway": "Receptor signaling"
    },
    {
      "name": "p130Cas",
      "full_name": "Crk-associated substrate",
      "function": "Focal adhesion adaptor protein",
      "localization": "Focal adhesions",
      "pathway": "Cell adhesion"
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
  "stage_marker_names": [
    "Actin",
    "EEA1",
    "LAMP1",
    "M6PR",
    "PI(4,5)P2",
    "PI3P",
    "RILP",
    "Rab5",
    "Rab7",
    "V-ATPase",
    "Vps34"
  ],
  "hubs": [
    {
      "host": "Host membranes",
      "degree": 20,
      "centrality": 1.0
    },
    {
      "host": "Actin",
      "degree": 8,
      "centrality": 0.4
    },
    {
      "host": "Host signaling",
      "degree": 7,
      "centrality": 0.35
    },
    {
      "host": "Rab1",
      "degree": 7,
      "centrality": 0.35
    },
    {
      "host": "RhoA",
      "degree": 6,
      "centrality": 0.3
    },
    {
      "host": "Cholesterol",
      "degree": 6,
      "centrality": 0.3
    },
    {
      "host": "Vps34",
      "degree": 5,
      "centrality": 0.25
    },
    {
      "host": "Rac1",
      "degree": 5,
      "centrality": 0.25
    },
    {
      "host": "Cdc42",
      "degree": 5,
      "centrality": 0.25
    },
    {
      "host": "Mitochondria",
      "degree": 4,
      "centrality": 0.2
    },
    {
      "host": "Host cells",
      "degree": 3,
      "centrality": 0.15
    },
    {
      "host": "Extracellular matrix",
      "degree": 3,
      "centrality": 0.15
    },
    {
      "host": "ER membrane",
      "degree": 3,
      "centrality": 0.15
    },
    {
      "host": "Golgi",
      "degree": 3,
      "centrality": 0.15
    },
    {
      "host": "Factor H",
      "degree": 3,
      "centrality": 0.15
    }
  ],
  "pathogen_actions": [
    {
      "pathogen": "Acinetobacter baumannii",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Anaplasma phagocytophilum",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "reroute"
    },
    {
      "pathogen": "Bacillus anthracis",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Bacillus cereus",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Bacteroides fragilis",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Bartonella henselae",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "reroute"
    },
    {
      "pathogen": "Bordetella pertussis",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Borrelia burgdorferi",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Brucella abortus",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Burkholderia cenocepacia",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Burkholderia pseudomallei",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Campylobacter jejuni",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Chlamydia pneumoniae",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "reroute"
    },
    {
      "pathogen": "Chlamydia trachomatis",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "reroute"
    },
    {
      "pathogen": "Clostridium difficile",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Clostridium perfringens",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Corynebacterium diphtheriae",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Coxiella burnetii",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Ehrlichia chaffeensis",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "reroute"
    },
    {
      "pathogen": "Enterococcus faecalis",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Escherichia coli K1",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Francisella tularensis",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Haemophilus influenzae",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Helicobacter pylori",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Klebsiella pneumoniae",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Legionella pneumophila",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "reroute"
    },
    {
      "pathogen": "Leptospira interrogans",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Listeria monocytogenes",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Mycobacterium avium",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Mycobacterium bovis",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Mycobacterium leprae",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Mycobacterium marinum",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Mycobacterium tuberculosis",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Neisseria gonorrhoeae",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Neisseria meningitidis",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Nocardia asteroides",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Orientia tsutsugamushi",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Porphyromonas gingivalis",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Pseudomonas aeruginosa",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Rhodococcus equi",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Rickettsia conorii",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Rickettsia rickettsii",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Salmonella enterica",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Salmonella typhi",
      "stage": "Late phagosome",
      "ph": 5.25,
      "action": "modified_compartment"
    },
    {
      "pathogen": "Shigella flexneri",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Staphylococcus aureus",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Streptococcus pneumoniae",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Streptococcus pyogenes",
      "stage": "Phagosome formation",
      "ph": 7.1,
      "action": "escape"
    },
    {
      "pathogen": "Streptomyces scabies",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Treponema pallidum",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Tropheryma whipplei",
      "stage": "Early phagosome",
      "ph": 6.25,
      "action": "arrest"
    },
    {
      "pathogen": "Vibrio cholerae",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Yersinia pestis",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    },
    {
      "pathogen": "Yersinia pseudotuberculosis",
      "stage": "Pre-phagocytosis",
      "ph": 7.300000000000001,
      "action": "extracellular"
    }
  ],
  "ml_predictions": [
    {
      "pathogen": "Acinetobacter baumannii",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.59
    },
    {
      "pathogen": "Anaplasma phagocytophilum",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.62
    },
    {
      "pathogen": "Bacillus anthracis",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.73
    },
    {
      "pathogen": "Bacillus cereus",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.55
    },
    {
      "pathogen": "Bacteroides fragilis",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.55
    },
    {
      "pathogen": "Bartonella henselae",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.69
    },
    {
      "pathogen": "Bordetella pertussis",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.75
    },
    {
      "pathogen": "Borrelia burgdorferi",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.75
    },
    {
      "pathogen": "Brucella abortus",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.79
    },
    {
      "pathogen": "Burkholderia cenocepacia",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.61
    },
    {
      "pathogen": "Burkholderia pseudomallei",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.65
    },
    {
      "pathogen": "Campylobacter jejuni",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.54
    },
    {
      "pathogen": "Chlamydia pneumoniae",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.79
    },
    {
      "pathogen": "Chlamydia trachomatis",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.66
    },
    {
      "pathogen": "Clostridium difficile",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.65
    },
    {
      "pathogen": "Clostridium perfringens",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.79
    },
    {
      "pathogen": "Corynebacterium diphtheriae",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.62
    },
    {
      "pathogen": "Coxiella burnetii",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.68
    },
    {
      "pathogen": "Ehrlichia chaffeensis",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.52
    },
    {
      "pathogen": "Enterococcus faecalis",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.54
    },
    {
      "pathogen": "Escherichia coli K1",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.7
    },
    {
      "pathogen": "Francisella tularensis",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.73
    },
    {
      "pathogen": "Haemophilus influenzae",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.67
    },
    {
      "pathogen": "Helicobacter pylori",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.5
    },
    {
      "pathogen": "Klebsiella pneumoniae",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.73
    },
    {
      "pathogen": "Legionella pneumophila",
      "predicted": "reroute",
      "actual": "reroute",
      "confidence": 0.67
    },
    {
      "pathogen": "Leptospira interrogans",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.71
    },
    {
      "pathogen": "Listeria monocytogenes",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.63
    },
    {
      "pathogen": "Mycobacterium avium",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.6
    },
    {
      "pathogen": "Mycobacterium bovis",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.61
    },
    {
      "pathogen": "Mycobacterium leprae",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.52
    },
    {
      "pathogen": "Mycobacterium marinum",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.78
    },
    {
      "pathogen": "Mycobacterium tuberculosis",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.74
    },
    {
      "pathogen": "Neisseria gonorrhoeae",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.74
    },
    {
      "pathogen": "Neisseria meningitidis",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.69
    },
    {
      "pathogen": "Nocardia asteroides",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.53
    },
    {
      "pathogen": "Orientia tsutsugamushi",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.65
    },
    {
      "pathogen": "Porphyromonas gingivalis",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.6
    },
    {
      "pathogen": "Pseudomonas aeruginosa",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.54
    },
    {
      "pathogen": "Rhodococcus equi",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.78
    },
    {
      "pathogen": "Rickettsia conorii",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.5
    },
    {
      "pathogen": "Rickettsia rickettsii",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.72
    },
    {
      "pathogen": "Salmonella enterica",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.68
    },
    {
      "pathogen": "Salmonella typhi",
      "predicted": "modified_compartment",
      "actual": "modified_compartment",
      "confidence": 0.56
    },
    {
      "pathogen": "Shigella flexneri",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.69
    },
    {
      "pathogen": "Staphylococcus aureus",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.57
    },
    {
      "pathogen": "Streptococcus pneumoniae",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.65
    },
    {
      "pathogen": "Streptococcus pyogenes",
      "predicted": "escape",
      "actual": "escape",
      "confidence": 0.58
    },
    {
      "pathogen": "Streptomyces scabies",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.52
    },
    {
      "pathogen": "Treponema pallidum",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.63
    },
    {
      "pathogen": "Tropheryma whipplei",
      "predicted": "arrest",
      "actual": "arrest",
      "confidence": 0.55
    },
    {
      "pathogen": "Vibrio cholerae",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.62
    },
    {
      "pathogen": "Yersinia pestis",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.77
    },
    {
      "pathogen": "Yersinia pseudotuberculosis",
      "predicted": "extracellular",
      "actual": "extracellular",
      "confidence": 0.76
    }
  ],
  "ml_pca": {
    "explained_variance_ratio": [
      0.4175,
      0.1157
    ],
    "samples": [
      {
        "pathogen": "Acinetobacter baumannii",
        "strategy": "extracellular",
        "PC1": -0.6709,
        "PC2": -1.0881
      },
      {
        "pathogen": "Anaplasma phagocytophilum",
        "strategy": "reroute",
        "PC1": -1.5526,
        "PC2": 0.971
      },
      {
        "pathogen": "Bacillus anthracis",
        "strategy": "escape",
        "PC1": 1.5749,
        "PC2": -1.0888
      },
      {
        "pathogen": "Bacillus cereus",
        "strategy": "escape",
        "PC1": -1.6497,
        "PC2": -0.3843
      },
      {
        "pathogen": "Bacteroides fragilis",
        "strategy": "extracellular",
        "PC1": -2.0303,
        "PC2": 0.0174
      },
      {
        "pathogen": "Bartonella henselae",
        "strategy": "reroute",
        "PC1": -1.3124,
        "PC2": 2.3814
      },
      {
        "pathogen": "Bordetella pertussis",
        "strategy": "extracellular",
        "PC1": -0.3372,
        "PC2": -1.2846
      },
      {
        "pathogen": "Borrelia burgdorferi",
        "strategy": "extracellular",
        "PC1": -0.7509,
        "PC2": -0.5785
      },
      {
        "pathogen": "Brucella abortus",
        "strategy": "modified_compartment",
        "PC1": 1.8232,
        "PC2": 2.0257
      },
      {
        "pathogen": "Burkholderia cenocepacia",
        "strategy": "modified_compartment",
        "PC1": -2.065,
        "PC2": 1.3636
      },
      {
        "pathogen": "Burkholderia pseudomallei",
        "strategy": "escape",
        "PC1": 1.1433,
        "PC2": -0.193
      },
      {
        "pathogen": "Campylobacter jejuni",
        "strategy": "modified_compartment",
        "PC1": -0.3065,
        "PC2": 0.4021
      },
      {
        "pathogen": "Chlamydia pneumoniae",
        "strategy": "reroute",
        "PC1": -0.5499,
        "PC2": 0.3776
      },
      {
        "pathogen": "Chlamydia trachomatis",
        "strategy": "reroute",
        "PC1": 2.1378,
        "PC2": 0.3347
      },
      {
        "pathogen": "Clostridium difficile",
        "strategy": "extracellular",
        "PC1": -1.0443,
        "PC2": -0.1625
      },
      {
        "pathogen": "Clostridium perfringens",
        "strategy": "extracellular",
        "PC1": -1.9388,
        "PC2": -0.4056
      },
      {
        "pathogen": "Corynebacterium diphtheriae",
        "strategy": "extracellular",
        "PC1": -1.9188,
        "PC2": 0.2075
      },
      {
        "pathogen": "Coxiella burnetii",
        "strategy": "modified_compartment",
        "PC1": 0.9387,
        "PC2": 2.0891
      },
      {
        "pathogen": "Ehrlichia chaffeensis",
        "strategy": "reroute",
        "PC1": -0.2169,
        "PC2": 1.3767
      },
      {
        "pathogen": "Enterococcus faecalis",
        "strategy": "extracellular",
        "PC1": -0.4287,
        "PC2": -0.8617
      },
      {
        "pathogen": "Escherichia coli K1",
        "strategy": "arrest",
        "PC1": 0.5616,
        "PC2": -1.4789
      },
      {
        "pathogen": "Francisella tularensis",
        "strategy": "escape",
        "PC1": -2.2316,
        "PC2": 3.361
      },
      {
        "pathogen": "Haemophilus influenzae",
        "strategy": "extracellular",
        "PC1": -0.6549,
        "PC2": -1.3678
      },
      {
        "pathogen": "Helicobacter pylori",
        "strategy": "extracellular",
        "PC1": 0.885,
        "PC2": -0.1679
      },
      {
        "pathogen": "Klebsiella pneumoniae",
        "strategy": "extracellular",
        "PC1": -0.6735,
        "PC2": -0.4469
      },
      {
        "pathogen": "Legionella pneumophila",
        "strategy": "reroute",
        "PC1": 4.188,
        "PC2": 3.1922
      },
      {
        "pathogen": "Leptospira interrogans",
        "strategy": "extracellular",
        "PC1": -1.1707,
        "PC2": -0.6361
      },
      {
        "pathogen": "Listeria monocytogenes",
        "strategy": "escape",
        "PC1": 3.37,
        "PC2": -1.7561
      },
      {
        "pathogen": "Mycobacterium avium",
        "strategy": "arrest",
        "PC1": -2.5732,
        "PC2": 0.4673
      },
      {
        "pathogen": "Mycobacterium bovis",
        "strategy": "arrest",
        "PC1": -0.6387,
        "PC2": 0.3786
      },
      {
        "pathogen": "Mycobacterium leprae",
        "strategy": "arrest",
        "PC1": -2.0303,
        "PC2": 0.0174
      },
      {
        "pathogen": "Mycobacterium marinum",
        "strategy": "arrest",
        "PC1": -0.9709,
        "PC2": 0.3552
      },
      {
        "pathogen": "Mycobacterium tuberculosis",
        "strategy": "arrest",
        "PC1": 3.6861,
        "PC2": 0.2078
      },
      {
        "pathogen": "Neisseria gonorrhoeae",
        "strategy": "extracellular",
        "PC1": -0.4287,
        "PC2": -0.8617
      },
      {
        "pathogen": "Neisseria meningitidis",
        "strategy": "extracellular",
        "PC1": -0.5308,
        "PC2": -1.5123
      },
      {
        "pathogen": "Nocardia asteroides",
        "strategy": "arrest",
        "PC1": -1.9088,
        "PC2": 0.5141
      },
      {
        "pathogen": "Orientia tsutsugamushi",
        "strategy": "escape",
        "PC1": -1.3904,
        "PC2": -0.8588
      },
      {
        "pathogen": "Porphyromonas gingivalis",
        "strategy": "modified_compartment",
        "PC1": -1.5766,
        "PC2": 0.5375
      },
      {
        "pathogen": "Pseudomonas aeruginosa",
        "strategy": "extracellular",
        "PC1": 2.5189,
        "PC2": -0.0938
      },
      {
        "pathogen": "Rhodococcus equi",
        "strategy": "modified_compartment",
        "PC1": -2.3946,
        "PC2": -1.4728
      },
      {
        "pathogen": "Rickettsia conorii",
        "strategy": "escape",
        "PC1": -0.659,
        "PC2": -0.6741
      },
      {
        "pathogen": "Rickettsia rickettsii",
        "strategy": "escape",
        "PC1": -0.3268,
        "PC2": -0.6507
      },
      {
        "pathogen": "Salmonella enterica",
        "strategy": "modified_compartment",
        "PC1": 6.9401,
        "PC2": -0.0101
      },
      {
        "pathogen": "Salmonella typhi",
        "strategy": "modified_compartment",
        "PC1": 1.2797,
        "PC2": 0.3758
      },
      {
        "pathogen": "Shigella flexneri",
        "strategy": "escape",
        "PC1": 5.4315,
        "PC2": -0.4676
      },
      {
        "pathogen": "Staphylococcus aureus",
        "strategy": "escape",
        "PC1": 0.5097,
        "PC2": -0.9431
      },
      {
        "pathogen": "Streptococcus pneumoniae",
        "strategy": "extracellular",
        "PC1": 0.4216,
        "PC2": -1.0547
      },
      {
        "pathogen": "Streptococcus pyogenes",
        "strategy": "escape",
        "PC1": 0.5808,
        "PC2": -1.3252
      },
      {
        "pathogen": "Streptomyces scabies",
        "strategy": "extracellular",
        "PC1": -1.9088,
        "PC2": 0.5141
      },
      {
        "pathogen": "Treponema pallidum",
        "strategy": "extracellular",
        "PC1": -2.0303,
        "PC2": 0.0174
      },
      {
        "pathogen": "Tropheryma whipplei",
        "strategy": "arrest",
        "PC1": -2.6053,
        "PC2": -0.9995
      },
      {
        "pathogen": "Vibrio cholerae",
        "strategy": "extracellular",
        "PC1": -1.8049,
        "PC2": 1.1721
      },
      {
        "pathogen": "Yersinia pestis",
        "strategy": "extracellular",
        "PC1": 4.4774,
        "PC2": 0.036
      },
      {
        "pathogen": "Yersinia pseudotuberculosis",
        "strategy": "extracellular",
        "PC1": 2.8131,
        "PC2": 0.1321
      }
    ],
    "feature_names": [
      "n_effectors",
      "n_targets",
      "n_interaction_types",
      "n_t3ss",
      "n_t4ss",
      "n_t6ss",
      "n_toxins",
      "n_surface_proteins",
      "n_invasins",
      "n_pathways",
      "n_localizations"
    ]
  },
  "classifier_comparison": [
    {
      "model": "Logistic Regression",
      "mean_accuracy": 0.3873,
      "std_accuracy": 0.1008,
      "per_fold": [
        0.3636,
        0.2727,
        0.5455,
        0.4545,
        0.3
      ]
    },
    {
      "model": "Random Forest",
      "mean_accuracy": 0.3709,
      "std_accuracy": 0.0593,
      "per_fold": [
        0.3636,
        0.2727,
        0.4545,
        0.3636,
        0.4
      ]
    },
    {
      "model": "SVM (RBF)",
      "mean_accuracy": 0.3527,
      "std_accuracy": 0.1082,
      "per_fold": [
        0.1818,
        0.2727,
        0.4545,
        0.4545,
        0.4
      ]
    },
    {
      "model": "k-NN (k=5)",
      "mean_accuracy": 0.3509,
      "std_accuracy": 0.0852,
      "per_fold": [
        0.2727,
        0.2727,
        0.4545,
        0.4545,
        0.3
      ]
    }
  ],
  "phylogeny": {
    "n_sequences": 250,
    "n_pathogens": 41,
    "pathogens": [
      "Acinetobacter",
      "Anaplasma",
      "Bacillus",
      "Bacteroides",
      "Bartonella",
      "Bordetella",
      "Borrelia",
      "Brucella",
      "Burkholderia",
      "Campylobacter",
      "Chlamydia",
      "Clostridium",
      "Corynebacterium",
      "Coxiella",
      "Ehrlichia",
      "Enterococcus",
      "Escherichia",
      "Francisella",
      "Haemophilus",
      "Helicobacter",
      "Klebsiella",
      "Legionella",
      "Leptospira",
      "Listeria",
      "Mycobacterium",
      "Neisseria",
      "Nocardia",
      "Orientia",
      "Porphyromonas",
      "Pseudomonas",
      "Rhodococcus",
      "Rickettsia",
      "Salmonella",
      "Shigella",
      "Staphylococcus",
      "Streptococcus",
      "Streptomyces",
      "Treponema",
      "Tropheryma",
      "Vibrio",
      "Yersinia"
    ],
    "newick": "((((((Nocardia_asteroides_Sod:0.52603793,Burkholderia_pseudomallei_BprP:0.52172787)Inner180:0.019953172,Neisseria_meningitidis_FetA:0.54460457)Inner183:0.022584541,(((Anaplasma_phagocytophilum_Ats-1:0.39237486,Brucella_abortus_BtpA:0.39193886)Inner69:0.020425464,Porphyromonas_gingivalis_RgpB:0.42865927)Inner106:0.011035326,((Ehrlichia_chaffeensis_Ank200:0.38819935,Porphyromonas_gingivalis_Kgp:0.39447319)Inner63:0.026941071,Klebsiella_pneumoniae_FimH:0.42306904)Inner107:0.011210312)Inner114:0.12373808)Inner200:0.023059954,((Listeria_monocytogenes_InlA:0.53624102,Listeria_monocytogenes_InlB:0.53153006)Inner187:0.019797947,Mycobacterium_bovis_MPB70:0.55557925)Inner205:0.020115749)Inner234:0.0059816497,(((((Acinetobacter_baumannii_OmpA:0,Escherichia_coli_K1_OmpA:0)Inner10:0.42584184,Haemophilus_influenzae_HMW2:0.43192942)Inner138:0.12036229,(((Burkholderia_pseudomallei_BopA:0.34849854,Pseudomonas_aeruginosa_ExoY:0.36117888)Inner27:0.028631169,((Neisseria_gonorrhoeae_Opa:0.35245814,Streptococcus_pyogenes_SLO:0.34009336)Inner25:0.0332769,Orientia_tsutsugamushi_ScaA:0.37483458)Inner39:0.0073398614)Inner44:0.16599184,Haemophilus_influenzae_HMW1:0.53722827)Inner195:0.012255195)Inner210:0.017413233,((((Acinetobacter_baumannii_CsuA_B:0.38112372,(Chlamydia_trachomatis_CT229:0.38096209,(Francisella_tularensis_MglA:0.35280346,Pseudomonas_aeruginosa_ExoU:0.36315554)Inner28:0.023127289)Inner42:0.008735433)Inner47:0.15364367,(Haemophilus_influenzae_Hap:0.4081909,(Shigella_flexneri_IcsA_VirG:0.39723107,Streptococcus_pyogenes_M_protein:0.38622758)Inner61:0.018004905)Inner85:0.12758517)Inner189:0.022919114,((((Bacillus_cereus_Nhe:0.42766445,((Burkholderia_cenocepacia_Bat3:0.38908412,(Salmonella_enterica_SifA:0,Salmonella_typhi_SifA:0)Inner9:0.39300543)Inner75:0.013839465,(Campylobacter_jejuni_Cdt:0,Clostridium_difficile_Cdt:0)Inner7:0.41093439)Inner103:0.017668231)Inner126:0.0065144349,Shigella_flexneri_VirA:0.43199382)Inner136:0.0079534438,(Haemophilus_influenzae_Hia:0.39588031,Neisseria_meningitidis_Opca:0.39988369)Inner104:0.02811793)Inner147:0.1008394,(Chlamydia_pneumoniae_CPn0585:0.36194678,Tropheryma_whipplei_TW3:0.36463932)Inner33:0.17833929)Inner192:0.019376779)Inner213:0.010863889,(((((Bartonella_henselae_BepD:0.4058892,Legionella_pneumophila_Lem3:0.4019186)Inner84:0.015331323,(Corynebacterium_diphtheriae_Fbp:0.4149614,(Yersinia_pestis_YopH:0,Yersinia_pseudotuberculosis_YopH:0)Inner5:0.40875155)Inner89:0.010826681)Inner111:0.01278582,((Orientia_tsutsugamushi_HlyA:0,Vibrio_cholerae_HlyA:0)Inner8:0.39777859,Pseudomonas_aeruginosa_ExoT:0.39208728)Inner78:0.034460113)Inner131:0.10965456,(Ehrlichia_chaffeensis_TRP120:0.41410295,Helicobacter_pylori_UreA:0.41516535)Inner113:0.12070383)Inner193:0.021622924,((Mycobacterium_leprae_ML0840:0.41324013,(((Salmonella_enterica_SopE:0,Salmonella_typhi_SopE:0)Inner14:0.35114663,Salmonella_typhi_SseG:0.36904414)Inner36:0.024001245,Salmonella_enterica_SseJ:0.38283197)Inner51:0.019515806)Inner79:0.1453884,(((Mycobacterium_tuberculosis_Eis:0.34661494,(Salmonella_enterica_PipB2:0,Salmonella_typhi_PipB2:0)Inner4:0.35793052)Inner32:0.038735305,(Yersinia_pestis_YopE:0,Yersinia_pseudotuberculosis_YopE:0)Inner2:0.40747682)Inner67:0.039097962,Rickettsia_rickettsii_TlyA:0.43552325)Inner146:0.11497024)Inner202:0.01318101)Inner220:0.0054605235)Inner228:0.0050484737)Inner235:0.0050853098,(((((((Bartonella_henselae_BepB:0.4000539,(Campylobacter_jejuni_FlaA:0,Treponema_pallidum_FlaA:0)Inner1:0.39424039)Inner52:0.022403432,(Corynebacterium_diphtheriae_SpaB:0.37835154,Ehrlichia_chaffeensis_TRP32:0.38171038)Inner54:0.021524504)Inner83:0.021779628,Bartonella_henselae_BepC:0.42010288)Inner127:0.11466308,((Chlamydia_pneumoniae_IncA:0,Chlamydia_trachomatis_IncA:0)Inner3:0.34777044,Shigella_flexneri_IpaB:0.33652194)Inner26:0.19997281)Inner196:0.015001717,(Corynebacterium_diphtheriae_DT:0.42604944,(Francisella_tularensis_IglD:0.41070528,Francisella_tularensis_FevR:0.40663219)Inner90:0.018397554)Inner124:0.13175952)Inner215:0.010571335,(Chlamydia_trachomatis_IncB:0.41963032,((Chlamydia_trachomatis_CADD:0.38071745,Streptococcus_pneumoniae_PspA:0.37785185)Inner66:0.031088278,Shigella_flexneri_OspG:0.40293698)Inner120:0.0079790383)Inner134:0.13770823)Inner230:0.0040508253,((((Burkholderia_pseudomallei_MprA:0.52218731,Shigella_flexneri_IpaC:0.52796467)Inner182:0.0094712512,Clostridium_perfringens_PLC:0.53127137)Inner186:0.019755367,(((Campylobacter_jejuni_CiaB:0.382809,(Rickettsia_conorii_RickA:0,Rickettsia_rickettsii_RickA:0)Inner15:0.3846682)Inner58:0.025978863,Yersinia_pestis_LcrV:0.40927649)Inner98:0.0058391306,((((((((Mycobacterium_avium_LAM:0,Mycobacterium_bovis_LAM:0)Inner17:0,Mycobacterium_leprae_LAM:0)Inner18:0,Mycobacterium_marinum_LAM:0)Inner19:0,Mycobacterium_tuberculosis_LAM:0)Inner20:0.37720065,Mycobacterium_marinum_MMPL7:0.37130235)Inner50:0.0067863701,(Yersinia_pestis_YopJ:0,Yersinia_pseudotuberculosis_YopJ:0)Inner13:0.3846807)Inner56:0.022060003,Neisseria_gonorrhoeae_Ng-MIP:0.39711409)Inner87:0.0097001062,(Porphyromonas_gingivalis_RgpA:0.41616307,Staphylococcus_aureus_Efb:0.40242763)Inner86:0.010270552)Inner101:0.002315674)Inner102:0.1360187)Inner207:0.0045678459,((Chlamydia_trachomatis_IncC:0.37289661,Francisella_tularensis_IglE:0.38900815)Inner55:0.031498942,((Pseudomonas_aeruginosa_ExoS:0.38165388,Streptococcus_pneumoniae_PspC:0.39079194)Inner65:0.017799983,(((Salmonella_enterica_SipA:0.36391771,Treponema_pallidum_Tp0751:0.35548528)Inner40:0.034126426,Treponema_pallidum_Tp0483:0.39074361)Inner72:0.0039145001,(Salmonella_typhi_SseF:0.38336071,Vibrio_cholerae_TCP:0.38646822)Inner53:0.021053002)Inner76:0.0057471793)Inner80:0.0078069348)Inner92:0.14121347)Inner211:0.017378561)Inner236:0.0041081039)Inner241:0.0020516907)Inner242:0.0023349513,((((((((Anaplasma_phagocytophilum_AnkA:0.34994508,Burkholderia_pseudomallei_BimA:0.35628637)Inner30:0.06864229,Pseudomonas_aeruginosa_ToxA:0.41471551)Inner128:0.01746143,Brucella_abortus_VceA:0.43885759)Inner154:0.11120572,(((Bacillus_cereus_CytK:0.35012307,Escherichia_coli_K1_CNF1:0.35777558)Inner34:0.070736051,(Bartonella_henselae_BepA:0.42385647,(Klebsiella_pneumoniae_KPC:0.40297014,(Legionella_pneumophila_SidD:0.34691595,Pseudomonas_aeruginosa_Alginate:0.34932465)Inner29:0.052686392)Inner88:0.015593389)Inner115:0.0075035265)Inner129:0.10841812,((Burkholderia_cenocepacia_AidA:0.40046229,Helicobacter_pylori_CagA:0.39299982)Inner73:0.029912491,Coxiella_burnetii_CirB:0.4326536)Inner139:0.10440529)Inner190:0.017250542)Inner208:0.012095975,(Burkholderia_cenocepacia_CblA:0.46275654,Orientia_tsutsugamushi_Pld:0.45825688)Inner170:0.11300066)Inner226:0.011309533,((Bacteroides_fragilis_BFT:0.54814759,((Campylobacter_jejuni_VirK:0.41741464,(Tropheryma_whipplei_TW2:0.40406193,Vibrio_cholerae_VvpE:0.40263518)Inner82:0.017897383)Inner116:0.0097629261,Mycobacterium_tuberculosis_MptpA:0.42632847)Inner137:0.12569253)Inner209:0.013935181,((Burkholderia_cenocepacia_BcaA:0.52262209,Mycobacterium_avium_MAV_2941:0.52283246)Inner184:0.021647154,(Porphyromonas_gingivalis_HagA:0.43013029,(Staphylococcus_aureus_Hlb:0.42076303,(Streptomyces_scabies_TxtB:0.3864364,Streptomyces_scabies_TxtC:0.37706725)Inner49:0.021983713)Inner77:0.024068899)Inner133:0.11975149)Inner201:0.021851369)Inner233:0.005066374)Inner243:0.0022057319,(((((((((Acinetobacter_baumannii_Plc:0.39636486,(Borrelia_burgdorferi_DbpA:0.3759132,Leptospira_interrogans_LenA:0.38367382)Inner62:0.02616492)Inner97:0.013678891,((Klebsiella_pneumoniae_CPS:0.32654829,Rhodococcus_equi_VapD:0.33047052)Inner24:0.063360685,Mycobacterium_tuberculosis_SapM:0.3847138)Inner70:0.02783077)Inner117:0.0012868271,(Helicobacter_pylori_OipA:0.40181543,(Mycobacterium_tuberculosis_MptpB:0.38215371,(Rickettsia_conorii_Pat1:0,Rickettsia_rickettsii_Pat1:0)Inner16:0.3757888)Inner64:0.022425586)Inner96:0.016418899)Inner118:0.1352018,(Leptospira_interrogans_LipL41:0.33066603,Tropheryma_whipplei_TW1:0.32323902)Inner23:0.2430825)Inner217:0.0024675522,((((Helicobacter_pylori_HtrA:0.37228705,Mycobacterium_leprae_ML2499:0.37734905)Inner48:0.049553315,Yersinia_pestis_YopM:0.43480562)Inner144:0.005297923,Legionella_pneumophila_LidA:0.44080566)Inner148:0.01409266,(Klebsiella_pneumoniae_MrkD:0.37929409,(Rickettsia_conorii_Sca2:0,Rickettsia_rickettsii_Sca2:0)Inner12:0.39371205)Inner74:0.050547189)Inner160:0.11138355)Inner219:0.011733194,(((((((Bacteroides_fragilis_FimA:0,Porphyromonas_gingivalis_FimA:0)Inner11:0.3736053,Treponema_pallidum_TprK:0.37228409)Inner46:0.011798318,(Coxiella_burnetii_Cig57:0.37557151,Listeria_monocytogenes_PlcB:0.37210651)Inner43:0.019012219)Inner60:0.034610425,(Legionella_pneumophila_SidC:0.41274716,Nocardia_asteroides_Mce:0.41149527)Inner81:0.01956872)Inner122:0.0060752199,(((Brucella_abortus_VirB:0.36259271,Staphylococcus_aureus_PVL:0.36604297)Inner41:0.020292583,Brucella_abortus_BtpB:0.38327279)Inner59:0.037123706,Legionella_pneumophila_AnkX:0.41468301)Inner121:0.0077303737)Inner130:0.01354235,Streptococcus_pyogenes_SpeB:0.43050338)Inner151:0.10749057,Enterococcus_faecalis_SprE:0.55414642)Inner203:0.024131599)Inner237:0.0024002171,(((((Bacillus_anthracis_ALO:0.42361434,Francisella_tularensis_IglC:0.42867517)Inner152:0.0097202909,Listeria_monocytogenes_ActA:0.42612183)Inner164:0.017525221,(Haemophilus_influenzae_P5:0.43192009,Streptococcus_pneumoniae_PLY:0.4367822)Inner165:0.016847475)Inner176:0.093886567,Borrelia_burgdorferi_OspC:0.55503752)Inner212:0.007156581,((Burkholderia_pseudomallei_BopE:0.41982261,Streptococcus_pneumoniae_LytA:0.42212268)Inner149:0.026801922,((Clostridium_difficile_TcdA:0.42562934,Yersinia_pseudotuberculosis_YpkA_YopO:0.43939243)Inner153:0.01022438,Salmonella_enterica_SopB_SigD:0.42913639)Inner163:0.00878978)Inner171:0.10688582)Inner223:0.012485101)Inner240:0.0043393314,((((((Bacillus_anthracis_LF:0.37467469,Bacillus_anthracis_EF:0.37229501)Inner57:0.039356996,Bordetella_pertussis_PTx:0.41298588)Inner135:0.021362971,(Enterococcus_faecalis_Cyl:0.39771921,Vibrio_cholerae_CTX:0.38508622)Inner71:0.051661838)Inner161:0.11146059,((Borrelia_burgdorferi_OspA:0.44714966,Neisseria_gonorrhoeae_TspB:0.45110153)Inner175:0.0058681306,((Mycobacterium_bovis_CFP-10:0.4345803,Mycobacterium_leprae_ML0098:0.42388123)Inner155:0.0040851422,Vibrio_cholerae_VSP:0.42830488)Inner158:0.019326112)Inner177:0.098591032)Inner218:0.012890344,(((Clostridium_difficile_TcdB:0.47462272,Streptococcus_pyogenes_SLS:0.47938322)Inner178:0.059680694,(Nocardia_asteroides_Cat:0.40921301,Staphylococcus_aureus_SpA:0.41719649)Inner112:0.11626716)Inner191:0.029134033,((Leptospira_interrogans_Loa22:0.3984211,Neisseria_meningitidis_PorA:0.39724454)Inner68:0.16748175,(Listeria_monocytogenes_PlcA:0.52170154,Orientia_tsutsugamushi_Tsa56:0.52660764)Inner185:0.032561061)Inner224:0.0012624836)Inner225:0.0043972835)Inner232:0.006363528,(((Clostridium_perfringens_CTA:0.43876152,((Clostridium_perfringens_NetB:0.42237311,Legionella_pneumophila_DrrA_SidM:0.41147782)Inner119:0.0077259812,Rhodococcus_equi_VapB:0.41568726)Inner132:0.018490892)Inner157:0.10601455,Enterococcus_faecalis_GelE:0.5474066)Inner199:0.023401017,((Coxiella_burnetii_Cig2:0.4572451,(Legionella_pneumophila_VipD:0.43393722,Streptomyces_scabies_Nec1:0.41824981)Inner123:0.029994723)Inner169:0.094614659,(Coxiella_burnetii_CirA:0.42782359,Orientia_tsutsugamushi_ScaC:0.40328752)Inner99:0.1348597)Inner198:0.026843641)Inner239:0.0040045273)Inner244:0.0012456722)Inner245:0.0015288709,(((((((((Bacillus_anthracis_PA:0.34075103,Bordetella_pertussis_DNT:0.34213983)Inner38:0.043792061,Brucella_abortus_VceC:0.40223507)Inner100:0.01575938,Coxiella_burnetii_CvpB:0.42323265)Inner125:0.0069153176,(Bacillus_anthracis_CatB:0.40375097,Escherichia_coli_K1_IbeB:0.4176776)Inner109:0.017272147)Inner140:0.0055415585,Mycobacterium_tuberculosis_PknG:0.43426168)Inner145:0.11637097,(Neisseria_meningitidis_NadA:0.37065985,Rhodococcus_equi_VapC:0.36063786)Inner37:0.18764011)Inner206:0.0092186666,((Bacillus_cereus_PC-PLC:0.40945029,(Bartonella_henselae_BepE:0.36109968,Escherichia_coli_K1_K1_capsule:0.3560257)Inner35:0.053945476)Inner105:0.0050475957,Listeria_monocytogenes_LLO:0.42215135)Inner110:0.14207151)Inner221:0.0076676991,((((Borrelia_burgdorferi_VlsE:0.41637947,Shigella_flexneri_IcsB:0.40108084)Inner108:0.017528633,Helicobacter_pylori_VacA:0.42718948)Inner141:0.01647596,Yersinia_pestis_YopT:0.44502643)Inner159:0.011685483,(Chlamydia_trachomatis_CT813:0.43874898,Streptococcus_pyogenes_SpeA:0.42791769)Inner167:0.0038556584)Inner168:0.11589194)Inner229:0.0060525184,(((Bacillus_cereus_Hbl:0.50082221,Bordetella_pertussis_FHA:0.50516581)Inner179:0.044413339,(Bordetella_pertussis_CyaA:0.44175018,Staphylococcus_aureus_Hla:0.43492144)Inner162:0.10391218)Inner204:0.018246343,(((Clostridium_difficile_FliC:0.53759762,Klebsiella_pneumoniae_LPS:0.52416708)Inner188:0.010898095,(Clostridium_perfringens_PFO:0.54243903,Enterococcus_faecalis_Ace:0.54614956)Inner194:0.0037032737)Inner197:0.011571723,(Nocardia_asteroides_PLA:0.42288268,Streptomyces_scabies_TxtA:0.41412173)Inner142:0.12621141)Inner214:0.013701862)Inner231:0.0043602983)Inner238:0.0060940532)Inner246:0.0026810106)Inner248:0.00038127242,((((Acinetobacter_baumannii_AbOmpA:0.37066644,Escherichia_coli_K1_IbeA:0.35918431)Inner31:0.15810288,Rhodococcus_equi_VapA:0.51863747)Inner181:0.040110242,(Corynebacterium_diphtheriae_SpaA:0.39761341,(Leptospira_interrogans_LipL32:0.37517354,Streptococcus_pneumoniae_NanA:0.36368975)Inner45:0.034458707)Inner91:0.15380035)Inner222:0.0060117424,(((((Acinetobacter_baumannii_Bap:0.39553954,Chlamydia_pneumoniae_CPn0809:0.40328572)Inner94:0.034283015,Bordetella_pertussis_TCF:0.41883807)Inner156:0.016201077,((Bacteroides_fragilis_PsaA:0.39261826,Bacteroides_fragilis_SusC:0.39604943)Inner93:0.040336558,((((Mycobacterium_bovis_ESAT-6:0,Mycobacterium_marinum_ESAT-6:0)Inner21:0,Mycobacterium_tuberculosis_ESAT-6:0)Inner22:0.39438591,Neisseria_gonorrhoeae_PilE:0.40044692)Inner95:0.019443488,Salmonella_enterica_SopD2:0.41640807)Inner143:0.019436907)Inner166:0.0093451992)Inner173:0.0048436085,Campylobacter_jejuni_CfrA:0.45292514)Inner174:0.10025802,(Anaplasma_phagocytophilum_p44_Msp2:0.4520238,(Enterococcus_faecalis_Esp:0.43278098,(Neisseria_gonorrhoeae_PorB:0,Neisseria_meningitidis_PorB:0)Inner6:0.4341915)Inner150:0.018423396)Inner172:0.10399032)Inner216:0.0099487468)Inner227:0.012143592)Inner247:0.00058391849):0;",
    "colour_map": {
      "Acinetobacter": "#8314e9",
      "Anaplasma": "#77f5f1",
      "Bacillus": "#2d9f0b",
      "Bacteroides": "#7ac441",
      "Bartonella": "#c89e5c",
      "Bordetella": "#c2b822",
      "Borrelia": "#2dee95",
      "Brucella": "#5525a1",
      "Burkholderia": "#ca6541",
      "Campylobacter": "#c04292",
      "Chlamydia": "#148690",
      "Clostridium": "#ee8705",
      "Corynebacterium": "#b0aab4",
      "Coxiella": "#fc7e56",
      "Ehrlichia": "#1e21df",
      "Enterococcus": "#303285",
      "Escherichia": "#8a83e2",
      "Francisella": "#7ca64c",
      "Haemophilus": "#cf205e",
      "Helicobacter": "#ca4cb9",
      "Klebsiella": "#945a06",
      "Legionella": "#bdded7",
      "Leptospira": "#d40118",
      "Listeria": "#56e51a",
      "Mycobacterium": "#38ae09",
      "Neisseria": "#aa3bf1",
      "Nocardia": "#80c815",
      "Orientia": "#b3e9b6",
      "Porphyromonas": "#e384d0",
      "Pseudomonas": "#ba96be",
      "Rhodococcus": "#986e4f",
      "Rickettsia": "#9ec8a8",
      "Salmonella": "#0a3341",
      "Shigella": "#0230d2",
      "Staphylococcus": "#e270cf",
      "Streptococcus": "#54dc5d",
      "Streptomyces": "#cccb64",
      "Treponema": "#3d707e",
      "Tropheryma": "#5f2f3b",
      "Vibrio": "#deab97",
      "Yersinia": "#326101"
    }
  }
};
