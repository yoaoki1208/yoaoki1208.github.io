(() => {
  const storageKey = 'wagokan-reactions-demo-v2';
  const legacyKey = 'wagokan-reactions-demo-v1';
  const types = ['応援しています', '関心があります', '共有しました'];
  // Stable IDs also define the migration from the original fixed card order.
  const projectIds = ['river-recovery', 'bridge-repair', 'building-management', 'night-paving'];
  const initialCounts = Object.fromEntries(projectIds.map((id, index) => [id, [[12, 5, 3], [8, 4, 2], [6, 3, 1], [9, 2, 2]][index]]));
  let saved = {};
  try {
    const current = localStorage.getItem(storageKey);
    const value = JSON.parse(current === null ? localStorage.getItem(legacyKey) : current);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      projectIds.forEach((id, index) => {
        const entry = value[current === null ? index : id];
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          saved[id] = Object.fromEntries(types.map((_, type) => [type, entry[type] === true]));
        }
      });
    }
    if (current === null && Object.keys(saved).length) localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch (_) {}
  const selected = (id, type) => saved[id]?.[type] === true;

  const style = document.createElement('style');
  style.textContent = `
    .post-reactions{border-top:1px solid var(--line,#dce4df);margin-top:18px;padding-top:14px}
    .reaction-actions{display:flex;flex-wrap:wrap;gap:8px}
    .reaction-button{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:7px 10px;border:1px solid var(--line,#dce4df);border-radius:6px;background:#fff;color:#52615a;font:inherit;font-size:12px;cursor:pointer}
    .reaction-button:hover{background:#f0f8f3;border-color:#278353}
    .reaction-button[aria-pressed=true]{background:#e5f3e9;border-color:#278353;color:#185937;font-weight:700}
    .reaction-button:focus-visible{outline:3px solid #8cbe9c;outline-offset:2px}
    .reaction-count{min-width:18px;text-align:center;font-variant-numeric:tabular-nums}
    .reaction-note{display:block;margin-top:9px;color:#6a756e;font-size:11px;line-height:1.6}
    .reaction-feedback{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:1000;background:#214e36;color:#fff;padding:12px 18px;border-radius:6px;max-width:calc(100% - 32px);font-size:14px;box-shadow:0 4px 20px #0002}
    .reaction-feedback:empty{display:none}
  `;
  document.head.append(style);

  function render(container, id) {
    container.innerHTML = `<div class="reaction-actions">${types.map((label, type) => {
      const active = selected(id, type);
      const count = initialCounts[id][type] + Number(active);
      return `<button type="button" class="reaction-button" data-reaction-post="${id}" data-reaction-type="${type}" aria-pressed="${active}" aria-label="${label} ${count}件${active ? '、取消' : ''}"><span>${label}</span><span class="reaction-count">${count}</span></button>`;
    }).join('')}</div><small class="reaction-note">応募にはなりません。種類は提案中、件数・操作はデモです。</small>`;
  }

  function attach(element, id) {
    if (!element || !projectIds.includes(id)) return;
    const container = element.querySelector(':scope > .post-reactions') || document.createElement('div');
    container.className = 'post-reactions';
    container.dataset.reactionsFor = id;
    element.append(container);
    render(container, id);
  }

  // The compact sibling mock also loads this file and still has its original static markup.
  const legacyTitles = ['大雨被害に伴う河川護岸復旧の応援要請', '県外受注に伴う橋梁補修工事の協力会社募集', '公共施設改修の建築施工管理者を短期募集', '道路維持補修の夜間舗装班を募集'];
  for (const selector of ['#featured-projects', '#project-list', '#featured', '#plist']) {
    document.querySelectorAll(`${selector} > article`).forEach(card => {
      const id = card.dataset.projectId || projectIds[legacyTitles.indexOf(card.querySelector('h3')?.textContent)];
      attach(card, id);
    });
  }
  const detailArticle = document.querySelector('#project-detail article, #detail article, #detail .panel');
  attach(detailArticle, detailArticle?.dataset.projectId || projectIds[0]);
  document.addEventListener('wagokan:project-selected', event => attach(detailArticle, event.detail.id));
  const feedback = document.createElement('div');
  feedback.className = 'reaction-feedback';
  feedback.setAttribute('role', 'status');
  document.body.append(feedback);
  let timer;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-reaction-post]');
    if (!button) return;
    const id = button.dataset.reactionPost;
    const type = Number(button.dataset.reactionType);
    if (!projectIds.includes(id) || !Number.isInteger(type) || type < 0 || type >= types.length) return;
    saved[id] = { ...saved[id], [type]: !selected(id, type) };
    let persistent = true;
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) { persistent = false; }
    document.querySelectorAll(`[data-reactions-for="${id}"]`).forEach(container => {
      render(container, id);
    });
    document.querySelector(`.view.active [data-reaction-post="${id}"][data-reaction-type="${type}"]`)?.focus({ preventScroll: true });
    feedback.textContent = selected(id, type) ? `「${types[type]}」を追加しました（デモ）` : 'リアクションを取り消しました（デモ）';
    if (!persistent) feedback.textContent += '。この画面を開いている間のみ保持します';
    clearTimeout(timer);
    timer = setTimeout(() => { feedback.textContent = ''; }, 2800);
  });
})();
