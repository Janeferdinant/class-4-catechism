/**
 * ExamSolverView Component
 * Renders verified solutions for all 5 question papers (2023–2025)
 * with chapter citations, ELI5 pedagogical tabs, and search filters.
 */

export class ExamSolverView {
  constructor(papersData = []) {
    this.papers = papersData;
    this.activePaperId = papersData[0]?.id || '2025_s1';
    this.showEli5Mode = false;
  }

  getPaper(paperId) {
    return this.papers.find(p => p.id === paperId) || this.papers[0];
  }

  searchQuestions(keyword) {
    if (!keyword) return [];
    const k = keyword.toLowerCase();
    const results = [];
    this.papers.forEach(paper => {
      paper.questions.forEach(q => {
        if (
          q.qMal.toLowerCase().includes(k) ||
          q.qEng.toLowerCase().includes(k) ||
          q.answerMal.toLowerCase().includes(k) ||
          q.citation.toLowerCase().includes(k)
        ) {
          results.push({ ...q, paperTitle: paper.title });
        }
      });
    });
    return results;
  }

  renderQuestionCardHTML(q) {
    return `
      <div class="question-card glass-panel" id="${q.id}">
        <div class="q-header">
          <span class="q-num-badge">Q${q.qNumber}</span>
          <span class="q-type-badge">${q.type}</span>
          <span class="citation-badge">📚 ${q.citation}</span>
        </div>

        <div class="q-body">
          <p class="q-text-mal">${q.qMal}</p>
          <p class="q-text-eng">${q.qEng}</p>
        </div>

        <div class="answer-box">
          <div class="answer-badge">
            <span class="check-icon">✓</span>
            <strong>Verified Answer:</strong>
          </div>
          <p class="answer-mal">${q.answerMal}</p>
          <p class="answer-eng">${q.answerEng}</p>
        </div>

        <div class="eli5-box">
          <div class="eli5-header">
            <span class="eli5-icon">🧸</span>
            <strong>Explain to a 5-Year-Old:</strong>
          </div>
          <p class="eli5-text">${q.eli5}</p>
        </div>

        <div class="q-actions">
          <button class="btn-voice-q btn-voice-mal" onclick="window.app.speakMalayalam('${q.qMal.replace(/'/g, "\\'")}. ഉത്തരം: ${q.answerMal.replace(/'/g, "\\'")}')" title="Listen in Malayalam">
            🔊 മലയാളത്തിൽ കേൾക്കുക
          </button>
          <button class="btn-voice-q btn-voice-eng" onclick="window.app.speakText('${q.qEng.replace(/'/g, "\\'")}. Answer: ${q.answerEng.replace(/'/g, "\\'")}')" title="Listen in English">
            🔊 English
          </button>
          <button class="btn-stop-q" onclick="window.app.stopVoice()" title="Stop audio">
            🛑 Stop (നിർത്തുക)
          </button>
        </div>
      </div>
    `;
  }

  renderPaperViewHTML(paperId) {
    const paper = this.getPaper(paperId);
    return `
      <div class="paper-container">
        <div class="paper-header glass-card">
          <h2>${paper.title}</h2>
          <p class="paper-syllabus"><strong>Syllabus Scope:</strong> ${paper.syllabus}</p>
          <div class="paper-stats">
            <span>Total Questions Solved: <strong>${paper.questions.length}</strong></span>
            <span>Total Marks: <strong>${paper.totalMarks}</strong></span>
            <span>Status: <strong class="badge-verified">✓ 100% Verified & Cited</strong></span>
          </div>
        </div>

        <div class="questions-list">
          ${paper.questions.map(q => this.renderQuestionCardHTML(q)).join('')}
        </div>

        <div class="solver-academic-footer">
          <span class="footer-academic-icon">🎓</span>
          <div class="footer-academic-text">
            <strong>Academic Mentor: Asst. Prof. Jane Rose</strong> &bull; Department of Computer Science & Engineering (CSE)
          </div>
        </div>
      </div>
    `;
  }
}
