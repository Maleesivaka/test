(function () {
  var st = document.createElement('style');
  st.textContent = '#toastBox{position:fixed;top:16px;right:16px;z-index:6000;width:340px;max-width:calc(100vw - 32px);display:flex;flex-direction:column;gap:8px;pointer-events:none}' +
    '.toast{pointer-events:auto;background:#191b22;color:#f8fafc;border-radius:10px;border:1px solid rgba(253,184,39,0.35);border-left:4px solid #F97316;padding:11px 32px 11px 14px;position:relative;box-shadow:0 12px 30px rgba(0,0,0,0.6);cursor:pointer;font-size:12.5px}' +
    '.toast b{display:block;color:#FDB827;margin-bottom:2px}.toast i.x{position:absolute;top:6px;right:10px;font-style:normal;color:#94a3b8;font-size:16px}' +
    '.notif-badge{background:#F97316;color:#fff;border-radius:999px;font-size:10px;font-weight:800;padding:1px 6px;margin-left:4px}' +
    '.notice-item{display:flex;gap:12px;padding:13px 16px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:10px;background:#121318}' +
    '.notice-item.unread{border-color:#FDB827;background:rgba(253,184,39,0.06)}';
  document.head.appendChild(st);
})();
function showToast(title, msg) {
  var box = document.getElementById('toastBox');
  if (!box) { box = document.createElement('div'); box.id = 'toastBox'; document.body.appendChild(box); }
  var t = document.createElement('div'); t.className = 'toast';
  t.innerHTML = '<i class="x">×</i>' + (title ? '<b>' + esc(title) + '</b>' : '') + '<span>' + esc(msg) + '</span>';
  t.onclick = function () { if (t.parentNode) t.parentNode.removeChild(t); };
  box.appendChild(t);
  setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 6000);
}
window.alert = function (m) { showToast('MMO Arts Fest', String(m)); };
function addNotice(type, title, text) {
  festNotices.push({ id: Date.now() + Math.floor(Math.random() * 999), time: new Date().toISOString(), type: type, title: title, text: text });
  if (festNotices.length > 100) festNotices = festNotices.slice(-100);
  localStorage.setItem('MEELAD_NOTICES', JSON.stringify(festNotices));
}
function markResultsKnown() {}
function updateBadges() {
  var n = festNotices.length;
  ['bellCount', 'notifBadge'].forEach(function (id) { var el = document.getElementById(id); if (el) { el.textContent = n; el.style.display = n ? 'inline-block' : 'none'; } });
}
function renderNoticeList() {
  var box = document.getElementById('noticeList'); if (!box) return;
  var list = festNotices.slice().sort(function (a, b) { return b.time.localeCompare(a.time); });
  box.innerHTML = !list.length ? '<p class="muted-text">No notifications yet.</p>' :
    list.map(function (n) { return '<div class="notice-item"><div><b style="color:#FDB827;">' + esc(n.title) + '</b><p style="font-size:13px;margin:2px 0;">' + esc(n.text) + '</p><small class="muted-text">' + new Date(n.time).toLocaleString() + '</small></div></div>'; }).join('');
}
var _showViewN = showView;
showView = function (id) { _showViewN.apply(this, arguments); if (id === 'notificationsView') renderNoticeList(); if (id === 'toppersView' && typeof renderToppers === 'function') renderToppers(); };
var _refreshAllN = refreshAll;
refreshAll = function () { _refreshAllN.apply(this, arguments); updateBadges(); renderNoticeList(); if (typeof renderToppers === 'function') renderToppers(); if (typeof renderAnnounceTab === 'function') renderAnnounceTab(); if (typeof renderAnalytics === 'function') renderAnalytics(); };
updateBadges();
