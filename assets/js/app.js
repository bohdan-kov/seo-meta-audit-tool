// SEO Meta Audit Tool
class SEOAuditApp {
  constructor(dataUrl = './data/meta-tags-part2.json') {
    this.dataUrl = dataUrl;
    this.metaTags = [];
    this.approvedItems = new Set(JSON.parse(localStorage.getItem('approvedItems') || '[]'));
    this.customTexts = JSON.parse(localStorage.getItem('customTexts') || '{}');
    this.emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[➣►✅✓✔☑❶👍🚀💰🤗🧐🔥]/gu;

    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.render();
    } catch (error) {
      console.error('Error initializing app:', error);
      document.getElementById('tableBody').innerHTML = `<tr><td colspan="10" style="color: red;">Error loading data: ${error.message}</td></tr>`;
    }
  }

  async loadData() {
    const response = await fetch(this.dataUrl);
    if (!response.ok) throw new Error(`Failed to load data: ${response.statusText}`);

    const data = await response.json();
    this.metaTags = data.tags || [];

    // Update page title and info
    document.getElementById('auditTitle').textContent = data.title;
    document.getElementById('auditDescription').textContent = data.description;
    document.getElementById('auditStatus').textContent = data.status;
    document.getElementById('totalCount').textContent = this.metaTags.length;
  }

  setupEventListeners() {
    document.getElementById('filterStatus').addEventListener('change', () => this.applyFilters());
    document.getElementById('filterType').addEventListener('change', () => this.applyFilters());
    document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
    document.getElementById('date').textContent = new Date().toLocaleString('uk-UA');
  }

  render() {
    this.renderTable();
    this.updateStats();
    this.updateApprovedCount();
  }

  renderTable() {
    const tbody = document.getElementById('tableBody');
    let html = '';

    this.metaTags.forEach((tag, index) => {
      const currentAnalysis = this.analyzeText(tag.current, tag.type);
      const proposedText = this.customTexts[tag.key] || tag.proposed;
      const isApproved = this.approvedItems.has(tag.key);

      html += `
        <tr class="${isApproved ? 'approved' : ''}" data-status="${currentAnalysis.status}" data-type="${tag.type}" data-key="${tag.key}">
          <td>${index + 1}</td>
          <td><span class="type ${tag.type}">${tag.type === 'title' ? 'Title' : 'Desc'}</span></td>
          <td><strong>${tag.key}</strong></td>
          <td><span class="length ${this.getLengthClass(tag.current.length, tag.type)}">${tag.current.length}</span></td>
          <td class="text-cell current">${this.escapeHtml(tag.current)}</td>
          <td class="arrow">→</td>
          <td><span class="length ${this.getLengthClass(proposedText.length, tag.type)}">${proposedText.length}</span></td>
          <td class="text-cell proposed">${this.escapeHtml(proposedText)}</td>
          <td class="issues">${tag.issues.map(i => `<span class="issue-tag">${i}</span>`).join('')}</td>
          <td><span class="status ${tag.status}">${tag.status.toUpperCase()}</span></td>
          <td>
            <button class="approve-btn ${isApproved ? 'done' : 'pending'}" onclick="app.toggleApprove('${tag.key}')">
              ${isApproved ? '✓ OK' : 'Approve'}
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  analyzeText(text, type) {
    const issues = [];
    let status = 'ok';
    const length = text.length;

    if (text.match(this.emojiRegex)) {
      status = 'critical';
    }

    if (type === 'title') {
      if (length > 60) status = 'critical';
      else if (length < 30) status = 'critical';
    } else {
      if (length > 160) status = 'critical';
      else if (length < 70) status = 'critical';
    }

    return { issues, status, length };
  }

  getLengthClass(length, type) {
    if (type === 'title') {
      if (length < 25 || length > 65) return 'bad';
      if (length < 30 || length > 60) return 'warning';
      return 'good';
    } else {
      if (length < 60 || length > 170) return 'bad';
      if (length < 70 || length > 160) return 'warning';
      return 'good';
    }
  }

  escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  toggleApprove(key) {
    if (this.approvedItems.has(key)) {
      this.approvedItems.delete(key);
    } else {
      this.approvedItems.add(key);
    }
    localStorage.setItem('approvedItems', JSON.stringify([...this.approvedItems]));
    this.render();
    this.applyFilters();
  }

  applyFilters() {
    const status = document.getElementById('filterStatus').value;
    const type = document.getElementById('filterType').value;
    const search = document.getElementById('searchInput').value.toLowerCase();

    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(row => {
      let show = true;
      if (status !== 'all' && row.dataset.status !== status) show = false;
      if (type !== 'all' && row.dataset.type !== type) show = false;
      if (search && !row.textContent.toLowerCase().includes(search)) show = false;
      row.style.display = show ? '' : 'none';
    });
  }

  updateStats() {
    let critical = 0, warning = 0, ok = 0;
    this.metaTags.forEach(tag => {
      if (tag.status === 'critical') critical++;
      else if (tag.status === 'warning') warning++;
      else ok++;
    });

    document.getElementById('stats').innerHTML = `
      <div class="stat-card"><div class="number">${this.metaTags.length}</div><div class="label">Total Tags</div></div>
      <div class="stat-card critical"><div class="number">${critical}</div><div class="label">Critical</div></div>
      <div class="stat-card warning"><div class="number">${warning}</div><div class="label">Warning</div></div>
      <div class="stat-card ok"><div class="number">${ok}</div><div class="label">OK</div></div>
      <div class="stat-card" style="background:#e8f5e9"><div class="number">${this.approvedItems.size}</div><div class="label">Approved</div></div>
    `;
  }

  updateApprovedCount() {
    document.getElementById('approvedCount').textContent = this.approvedItems.size;
  }

  exportCSV() {
    let csv = 'Key,Type,Current,CurrentLen,Proposed,ProposedLen,Status,Issues,Approved\n';
    this.metaTags.forEach(tag => {
      const proposed = this.customTexts[tag.key] || tag.proposed;
      const isApproved = this.approvedItems.has(tag.key) ? 'YES' : 'NO';
      csv += `"${tag.key}","${tag.type}","${tag.current.replace(/"/g, '""')}",${tag.current.length},"${proposed.replace(/"/g, '""')}",${proposed.length},"${tag.status}","${tag.issues.join('; ')}","${isApproved}"\n`;
    });
    this.downloadFile(csv, 'seo-audit-export.csv', 'text/csv');
  }

  downloadFile(content, filename, type) {
    const blob = new Blob(['\ufeff' + content], { type: type + ';charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  resetFilters() {
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterType').value = 'all';
    document.getElementById('searchInput').value = '';
    this.applyFilters();
  }

  resetAll() {
    if (confirm('Reset all approvals?')) {
      this.approvedItems = new Set();
      localStorage.removeItem('approvedItems');
      this.render();
      this.applyFilters();
    }
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new SEOAuditApp('./data/meta-tags-part2.json');
});
