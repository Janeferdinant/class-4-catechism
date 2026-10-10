/**
 * Master Multi-Agent Orchestrator
 * Implements Galileo.ai Multi-Agent Architectural Patterns:
 * 1. Centralized Routing: Single coordinator dispatching tasks to specialist agents.
 * 2. Context Engineering: Explicit working memory per agent preventing context poisoning.
 * 3. Observability & Tracing: Comprehensive trace logs with latencies and reasoning chains.
 */

import {
  StorytellerAgent,
  ExamSolverAgent,
  QuizmasterAgent,
  KnowledgeGraphAgent,
  VoiceoverAgent
} from './specialists.js';

export class MultiAgentOrchestrator {
  constructor() {
    this.name = 'Orchestrator Alpha';
    this.role = 'Master Multi-Agent Router & Context Coordinator';
    this.storyteller = new StorytellerAgent();
    this.solver = new ExamSolverAgent();
    this.quizmaster = new QuizmasterAgent();
    this.cartographer = new KnowledgeGraphAgent();
    this.voice = new VoiceoverAgent();
    this.traceLogs = [];
    this.listeners = [];
  }

  onEvent(callback) {
    this.listeners.push(callback);
  }

  notify(event) {
    this.listeners.forEach(cb => {
      try { cb(event); } catch (e) { console.error('Listener error', e); }
    });
  }

  logTrace(agentName, action, details, durationMs = 0) {
    const trace = {
      id: `trace_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      agent: agentName,
      action,
      details,
      durationMs
    };
    this.traceLogs.unshift(trace);
    if (this.traceLogs.length > 50) this.traceLogs.pop();
    this.notify({ type: 'TRACE', trace });
    return trace;
  }

  getTraceLogs() {
    return this.traceLogs;
  }

  async processPrompt(request) {
    const startTime = performance.now();
    const { intent, chapterNumber, paperId, query, character } = request;

    this.logTrace(this.name, 'Receive Request', `User query: "${query || intent}" with target parameters.`);

    let result = null;

    if (intent === 'story') {
      this.logTrace(this.name, 'Dispatch to Storyteller', `Routing to Leo the Storyteller for Chapter ${chapterNumber || 1}.`);
      result = this.storyteller.tellChapterStory(chapterNumber || 1);
    } else if (intent === 'solve') {
      this.logTrace(this.name, 'Dispatch to Exam Solver', `Routing to Inspector Sophia for Exam ${paperId || '2025_s1'}.`);
      result = this.solver.solvePaper(paperId || '2025_s1', query);
    } else if (intent === 'quiz') {
      this.logTrace(this.name, 'Dispatch to Quizmaster', `Routing to Barnaby the Quizmaster.`);
      result = this.quizmaster.generateQuiz(chapterNumber);
    } else if (intent === 'graph') {
      this.logTrace(this.name, 'Dispatch to Cartographer', `Routing to Atlas the Cartographer.`);
      result = this.cartographer.getGraphView(query || 'all');
    } else if (intent === 'voice') {
      this.logTrace(this.name, 'Dispatch to Voiceover', `Routing to Aria the Narrator for character ${character || 'leo'}.`);
      result = this.voice.createVoiceProfile(character || 'leo');
    } else {
      // Default fallback: story chapter 1
      result = this.storyteller.tellChapterStory(1);
    }

    const duration = Math.round(performance.now() - startTime);
    this.logTrace(this.name, 'Aggregate Response', `Successfully synthesized response from ${result.agentName}.`, duration);

    return result;
  }
}
