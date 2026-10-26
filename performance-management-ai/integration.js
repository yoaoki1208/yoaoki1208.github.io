'use strict';
const legacyShowPage=showPage,featureRoot=document.querySelector('#feature-app');
const hosts={calendar:document.querySelector('#calendar-host'),detail:document.querySelector('[data-page="case-detail"]'),projects:document.querySelector('[data-page="records"]'),import:document.querySelector('#import-host'),files:document.querySelector('#files-host')};
window.syncIntegration=()=>{const target={calendar:'cases',detail:'case-detail',projects:'records',import:'import',files:'files'}[page];if(!target)return;hosts[page].prepend(featureRoot);legacyShowPage(target);history.replaceState(null,'','#'+target);document.querySelectorAll('.nav [data-page-link]').forEach(b=>b.classList.toggle('active',b.dataset.pageLink===(target==='case-detail'?'cases':target)));};
showPage=function(n){const map={cases:'calendar','case-detail':'detail',records:'projects',import:'import',files:'files'};if(map[n]){page=map[n];if(page==='import'){step=0;importTarget=current;importKind='入札資料';}render();}else legacyShowPage(n);};
document.querySelectorAll('.case').forEach((b,i)=>b.addEventListener('click',()=>{current=i+1;returnPage='calendar';},true));
// Preserve legacy overview and detail examples, while making their limits explicit.
const detailPage=document.querySelector('[data-page="case-detail"]');const label=document.createElement('p');label.className='demo-notice';label.textContent='旧版の資料チェック・期限・根拠資料の表示例（固定サンプル）。選択案件の登録情報は上段で確認できます。';detailPage.prepend(label);
for(const b of document.querySelectorAll('.page button.primary:not([data-page-link])'))b.onclick=()=>showModal('<h2>表示例の機能です</h2><p>この旧版の操作は実処理に未接続です。外部送信・AI実行は行いません。</p><button data-close>閉じる</button>');
const globalSearch=document.querySelector('.top input');globalSearch.value='';globalSearch.placeholder='案件名・発注者を検索';globalSearch.setAttribute('aria-label','全体案件検索');globalSearch.onchange=()=>{query=globalSearch.value;page='projects';render();};
showPage(location.hash.slice(1)||'cases');
