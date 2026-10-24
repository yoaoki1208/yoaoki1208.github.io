(() => {
  const view = document.getElementById('apply');
  const detail = document.getElementById('project-detail');
  const fields = [...view.querySelectorAll('[data-draft-field]')];
  const status = document.getElementById('application-draft-status');
  const resetPanel = document.getElementById('application-reset-confirmation');
  const drafts = new Map();
  const notices = new Map();
  let activeId;
  const key = id => `wagokan-application-draft-v1:${id}`;
  const empty = () => Object.fromEntries(fields.map(field => [field.dataset.draftField, '']));

  function load(id) {
    if (drafts.has(id)) return;
    const draft = empty();
    try {
      const raw = localStorage.getItem(key(id));
      if (raw !== null) {
        const value = JSON.parse(raw);
        if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid draft');
        for (const field of fields) {
          const name = field.dataset.draftField;
          if (typeof value[name] === 'string') draft[name] = value[name].slice(0, field.maxLength > 0 ? field.maxLength : 100);
        }
        if (draft.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(draft.startDate)) draft.startDate = '';
        notices.set(id, 'このブラウザの下書きを読み込みました。未送信です。');
      }
    } catch (_) {
      notices.set(id, '保存済みの下書きを読み込めませんでした。空欄から開始します。未送信です。');
    }
    drafts.set(id, draft);
  }

  function render() {
    activeId = detail.querySelector('article').dataset.projectId;
    if (!activeId) return;
    load(activeId);
    view.dataset.projectId = activeId;
    document.getElementById('application-project-title').textContent = detail.querySelector('h2').textContent;
    const conditions = document.getElementById('application-project-conditions');
    conditions.replaceChildren();
    for (const row of detail.querySelectorAll('.info-row')) conditions.append(row.cloneNode(true));
    for (const field of fields) field.value = drafts.get(activeId)[field.dataset.draftField];
    status.textContent = notices.get(activeId) || '入力は案件ごとにこのブラウザへ自動保存します。未送信です。';
    resetPanel.hidden = true;
  }

  view.addEventListener('input', event => {
    if (!fields.includes(event.target) || !activeId) return;
    const draft = Object.fromEntries(fields.map(field => [field.dataset.draftField, field.value]));
    drafts.set(activeId, draft);
    let message = '下書きをこのブラウザに保存しました。応募は送信されていません。';
    try { localStorage.setItem(key(activeId), JSON.stringify(draft)); }
    catch (_) { message = 'ブラウザに保存できません。この画面を閉じるまで入力を保持します。応募は未送信です。'; }
    notices.set(activeId, message);
    status.textContent = message;
  });

  document.getElementById('application-reset').addEventListener('click', () => {
    resetPanel.hidden = false;
    document.getElementById('application-reset-cancel').focus();
  });
  document.getElementById('application-reset-cancel').addEventListener('click', () => {
    resetPanel.hidden = true;
    document.getElementById('application-reset').focus();
  });
  document.getElementById('application-reset-confirm').addEventListener('click', () => {
    try {
      localStorage.removeItem(key(activeId));
      drafts.set(activeId, empty());
      notices.set(activeId, 'この案件の下書きを削除しました。応募は未送信です。');
    } catch (_) {
      notices.set(activeId, '保存済み下書きを削除できませんでした。入力は保持しています。応募は未送信です。');
    }
    render();
    document.getElementById('application-reset').focus();
  });
  document.addEventListener('wagokan:project-selected', render);
  document.addEventListener('wagokan:view-selected', event => { if (event.detail.id === 'apply') render(); });
  render();
})();
