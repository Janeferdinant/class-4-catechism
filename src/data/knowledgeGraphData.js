/**
 * Knowledge Graph Dataset connecting:
 * - Galileo Multi-Agent System Nodes (Orchestrator, Storyteller, Solver, Quizmaster, Cartographer, Voice)
 * - Chapters 1 to 15
 * - The 7 Sacraments (Initiation, Healing, Service)
 * - Core Doctrinal Concepts & Biblical Passages
 * - Exam Papers (2023–2025)
 */

export const GRAPH_DATA = {
  nodes: [
    // Multi-Agent System Core
    { id: "agent_orchestrator", label: "Master Orchestrator", category: "agent", size: 24, color: "#6366f1" },
    { id: "agent_storyteller", label: "Storyteller Agent (5yo)", category: "agent", size: 18, color: "#ec4899" },
    { id: "agent_solver", label: "Exam Solver Agent", category: "agent", size: 18, color: "#10b981" },
    { id: "agent_quiz", label: "Quizmaster Agent", category: "agent", size: 18, color: "#f59e0b" },
    { id: "agent_kg", label: "Knowledge Graph Agent", category: "agent", size: 18, color: "#8b5cf6" },
    { id: "agent_voice", label: "Voiceover Agent", category: "agent", size: 18, color: "#06b6d4" },

    // Core Concept: Jesus the Source
    { id: "concept_jesus_life", label: "Jesus: The Divine Vine (John 15:5)", category: "concept", size: 22, color: "#e11d48" },

    // Sacraments Clusters
    { id: "cluster_initiation", label: "Sacraments of Initiation", category: "cluster", size: 16, color: "#3b82f6" },
    { id: "cluster_healing", label: "Sacraments of Healing", category: "cluster", size: 16, color: "#10b981" },
    { id: "cluster_service", label: "Sacraments of Service", category: "cluster", size: 16, color: "#f59e0b" },

    // The 7 Sacraments
    { id: "sac_baptism", label: "Baptism (മാമ്മോദീസ)", category: "sacrament", size: 15, color: "#60a5fa" },
    { id: "sac_confirmation", label: "Confirmation (തൈലാഭിഷേകം)", category: "sacrament", size: 15, color: "#60a5fa" },
    { id: "sac_eucharist", label: "Holy Qurbana (വി. കുർബാന)", category: "sacrament", size: 16, color: "#ef4444" },
    { id: "sac_reconciliation", label: "Reconciliation (അനുരഞ്ജനം)", category: "sacrament", size: 15, color: "#34d399" },
    { id: "sac_anointing", label: "Anointing of Sick (രോഗീലേപനം)", category: "sacrament", size: 15, color: "#34d399" },
    { id: "sac_orders", label: "Holy Orders (തിരുപ്പട്ടം)", category: "sacrament", size: 15, color: "#fbbf24" },
    { id: "sac_matrimony", label: "Matrimony (വിവാഹം)", category: "sacrament", size: 15, color: "#fbbf24" },

    // 15 Chapters
    { id: "ch_1", label: "Ch 1: ഈശോ ജീവന്റെ ഉറവിടം", category: "chapter", size: 14, semester: 1 },
    { id: "ch_2", label: "Ch 2: സഭയിലൂടെ ജീവൻ", category: "chapter", size: 14, semester: 1 },
    { id: "ch_3", label: "Ch 3: കൂദാശകൾ ജീവൻ", category: "chapter", size: 14, semester: 1 },
    { id: "ch_4", label: "Ch 4: മാമ്മോദീസ ജനനം", category: "chapter", size: 14, semester: 1 },
    { id: "ch_5", label: "Ch 5: തൈലാഭിഷേകം", category: "chapter", size: 14, semester: 1 },
    { id: "ch_6", label: "Ch 6: വി. കുർബാന ബലി", category: "chapter", size: 14, semester: 1 },
    { id: "ch_7", label: "Ch 7: ജീവന്റെ അപ്പം", category: "chapter", size: 14, semester: 1 },
    { id: "ch_8", label: "Ch 8: ഈശോയെ സ്വീകരിക്കാൻ", category: "chapter", size: 14, semester: 1 },
    { id: "ch_9", label: "Ch 9: അനുരഞ്ജിതരായിത്തീരാം", category: "chapter", size: 14, semester: 2 },
    { id: "ch_10", label: "Ch 10: അനുരഞ്ജനകൂദാശ", category: "chapter", size: 14, semester: 2 },
    { id: "ch_11", label: "Ch 11: രോഗീലേപനം", category: "chapter", size: 14, semester: 2 },
    { id: "ch_12", label: "Ch 12: തിരുപ്പട്ടം", category: "chapter", size: 14, semester: 2 },
    { id: "ch_13", label: "Ch 13: വിവാഹം", category: "chapter", size: 14, semester: 2 },
    { id: "ch_14", label: "Ch 14: കൂദാശാനുകരണങ്ങൾ", category: "chapter", size: 14, semester: 2 },
    { id: "ch_15", label: "Ch 15: കർത്തൃപ്രാർത്ഥന", category: "chapter", size: 14, semester: 2 },

    // Exam Papers
    { id: "paper_2023_s1", label: "Exam 2023 Sem 1", category: "exam", size: 13 },
    { id: "paper_2023_s2", label: "Exam 2023 Sem 2", category: "exam", size: 13 },
    { id: "paper_2024_s1", label: "Exam 2024 Sem 1", category: "exam", size: 13 },
    { id: "paper_2025_s1", label: "Exam 2025 Sem 1", category: "exam", size: 13 },
    { id: "paper_2025_s2", label: "Exam 2025 Sem 2", category: "exam", size: 13 }
  ],
  edges: [
    // Orchestrator coordination to agents (Galileo Architecture)
    { source: "agent_orchestrator", target: "agent_storyteller", label: "routes_prompt" },
    { source: "agent_orchestrator", target: "agent_solver", label: "dispatches_query" },
    { source: "agent_orchestrator", target: "agent_quiz", label: "evaluates_answers" },
    { source: "agent_orchestrator", target: "agent_kg", label: "maps_relations" },
    { source: "agent_orchestrator", target: "agent_voice", label: "streams_audio" },

    // Jesus at the center
    { source: "agent_orchestrator", target: "concept_jesus_life", label: "anchors_theology" },
    { source: "concept_jesus_life", target: "ch_1", label: "origin" },
    { source: "ch_1", target: "ch_2", label: "flows_into_church" },
    { source: "ch_2", target: "ch_3", label: "dispenses_sacraments" },

    // Sacraments cluster groupings
    { source: "ch_3", target: "cluster_initiation", label: "defines" },
    { source: "ch_3", target: "cluster_healing", label: "defines" },
    { source: "ch_3", target: "cluster_service", label: "defines" },

    { source: "cluster_initiation", target: "sac_baptism", label: "contains" },
    { source: "cluster_initiation", target: "sac_confirmation", label: "contains" },
    { source: "cluster_initiation", target: "sac_eucharist", label: "contains" },

    { source: "cluster_healing", target: "sac_reconciliation", label: "contains" },
    { source: "cluster_healing", target: "sac_anointing", label: "contains" },

    { source: "cluster_service", target: "sac_orders", label: "contains" },
    { source: "cluster_service", target: "sac_matrimony", label: "contains" },

    // Chapters mapped to Sacraments
    { source: "ch_4", target: "sac_baptism", label: "expounds" },
    { source: "ch_5", target: "sac_confirmation", label: "expounds" },
    { source: "ch_6", target: "sac_eucharist", label: "sacrificial_aspect" },
    { source: "ch_7", target: "sac_eucharist", label: "nourishment_aspect" },
    { source: "ch_8", target: "sac_eucharist", label: "communion_preparation" },

    { source: "ch_9", target: "sac_reconciliation", label: "repentance_parables" },
    { source: "ch_10", target: "sac_reconciliation", label: "confession_rite" },
    { source: "ch_11", target: "sac_anointing", label: "healing_ministry" },
    { source: "ch_12", target: "sac_orders", label: "priesthood_consecration" },
    { source: "ch_13", target: "sac_matrimony", label: "holy_covenant" },
    { source: "ch_14", target: "sac_baptism", label: "extends_through_sacramentals" },
    { source: "ch_15", target: "concept_jesus_life", label: "prayer_closes_cycle" },

    // Exam Papers mapped to Chapters
    { source: "paper_2023_s1", target: "ch_1", label: "tests" },
    { source: "paper_2023_s1", target: "ch_3", label: "tests" },
    { source: "paper_2023_s1", target: "ch_5", label: "tests" },
    { source: "paper_2023_s1", target: "ch_6", label: "tests" },

    { source: "paper_2023_s2", target: "ch_10", label: "tests" },
    { source: "paper_2023_s2", target: "ch_11", label: "tests" },
    { source: "paper_2023_s2", target: "ch_12", label: "tests" },
    { source: "paper_2023_s2", target: "ch_15", label: "tests" },

    { source: "paper_2024_s1", target: "ch_2", label: "tests" },
    { source: "paper_2024_s1", target: "ch_4", label: "tests" },
    { source: "paper_2024_s1", target: "ch_6", label: "tests" },

    { source: "paper_2025_s1", target: "ch_1", label: "tests" },
    { source: "paper_2025_s1", target: "ch_3", label: "tests" },
    { source: "paper_2025_s1", target: "ch_4", label: "tests" },
    { source: "paper_2025_s1", target: "ch_5", label: "tests" },

    { source: "paper_2025_s2", target: "ch_9", label: "tests" },
    { source: "paper_2025_s2", target: "ch_10", label: "tests" },
    { source: "paper_2025_s2", target: "ch_11", label: "tests" },
    { source: "paper_2025_s2", target: "ch_12", label: "tests" },
    { source: "paper_2025_s2", target: "ch_13", label: "tests" },
    { source: "paper_2025_s2", target: "ch_14", label: "tests" },
    { source: "paper_2025_s2", target: "ch_15", label: "tests" }
  ]
};
