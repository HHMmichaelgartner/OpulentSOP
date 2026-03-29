import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
let supabase = null;
let _supabaseOk = null;

function getSupabase() {
  if (!supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

async function testSupabase() {
  if (_supabaseOk !== null) return _supabaseOk;
  try {
    const sb = getSupabase();
    if (!sb) { _supabaseOk = false; return false; }
    const { error } = await sb.from('roles').select('id').limit(1);
    if (error) { console.error('[DB] Supabase test failed:', error.message); _supabaseOk = false; return false; }
    console.log('[DB] Supabase connected');
    _supabaseOk = true;
    return true;
  } catch (e) { console.error('[DB] Supabase test error:', e); _supabaseOk = false; return false; }
}

// IndexedDB fallback
const _mem = {};
let _idbOk = null;
async function _tryIDB() {
  if (_idbOk !== null) return _idbOk;
  try {
    if (typeof indexedDB === 'undefined') { _idbOk = false; return false; }
    const db = await new Promise(function(res, rej) { const r = indexedDB.open('HHM_SOP', 1); r.onupgradeneeded = function() { try { r.result.createObjectStore('d'); } catch(e) {} }; r.onsuccess = function() { res(r.result); }; r.onerror = function() { rej(r.error); }; setTimeout(function() { rej(new Error('timeout')); }, 2000); });
    db.close(); _idbOk = true; return true;
  } catch { _idbOk = false; return false; }
}
async function idbGet(k) {
  try { if (await _tryIDB()) { const db = await new Promise(function(res, rej) { const r = indexedDB.open('HHM_SOP', 1); r.onsuccess = function() { res(r.result); }; r.onerror = function() { rej(); }; }); const val = await new Promise(function(res) { try { const t = db.transaction('d', 'readonly'); const g = t.objectStore('d').get(k); g.onsuccess = function() { res(g.result !== undefined ? g.result : null); }; g.onerror = function() { res(null); }; } catch(e) { res(null); } }); db.close(); if (val !== null) return val; } } catch(e) {}
  return _mem[k] !== undefined ? _mem[k] : null;
}
async function idbSet(k, v) {
  _mem[k] = v;
  try { if (await _tryIDB()) { const db = await new Promise(function(res, rej) { const r = indexedDB.open('HHM_SOP', 1); r.onsuccess = function() { res(r.result); }; r.onerror = function() { rej(); }; }); await new Promise(function(res) { try { const t = db.transaction('d', 'readwrite'); t.objectStore('d').put(v, k); t.oncomplete = function() { res(true); }; t.onerror = function() { res(false); }; } catch(e) { res(false); } }); db.close(); } } catch(e) {}
  return true;
}

// Conversion
function toApp(row, type) {
  if (!row) return null;
  if (type === 'user') return { id: row.id, name: row.name, password: row.password || '', email: row.email || '', roleId: row.role_id, department: row.department || '', active: row.active !== false, createdAt: row.created_at, lastLogin: row.last_login, failedAttempts: row.failed_attempts || 0, lockedUntil: row.locked_until || null };
  if (type === 'role') return { id: row.id, label: row.label, icon: row.icon || 'user', color: row.color || '#6B7280', desc: row.description || '', permissions: row.permissions || [] };
  if (type === 'sop') return { id: row.id, title: row.title, department: row.department || '', category: row.category || 'standards', content: row.content || '', priority: row.priority || 'medium', status: row.status || 'draft', tags: row.tags || [], roles: row.roles || [], property: row.property || '', region: row.region || '', version: row.version || '1.0', createdBy: row.created_by || '', updatedBy: row.updated_by || '', createdAt: row.created_at, updatedAt: row.updated_at };
  if (type === 'audit') return { id: row.id, type: row.type || 'sop', sopId: row.sop_id || '', sopTitle: row.sop_title || '', templateId: row.template_id || '', title: row.title || '', property: row.property || '', department: row.department || '', auditor: row.auditor || '', date: row.date, items: row.items || [], notes: row.notes || '', score: Number(row.score) || 0, status: row.status || 'completed', completedAt: row.completed_at };
  if (type === 'template') return { id: row.id, templateName: row.template_name || '', department: row.department || '', items: row.items || [] };
  return row;
}
function toDB(obj, type) {
  if (!obj) return null;
  if (type === 'user') return { id: obj.id, name: obj.name, password: obj.password || '', email: obj.email || '', role_id: obj.roleId, department: obj.department || '', active: obj.active !== false, created_at: obj.createdAt || new Date().toISOString(), last_login: obj.lastLogin || null, failed_attempts: obj.failedAttempts || 0, locked_until: obj.lockedUntil || null };
  if (type === 'role') return { id: obj.id, label: obj.label, icon: obj.icon || 'user', color: obj.color || '#6B7280', description: obj.desc || '', permissions: obj.permissions || [] };
  if (type === 'sop') return { id: obj.id, title: obj.title, department: obj.department || '', category: obj.category || 'standards', content: obj.content || '', priority: obj.priority || 'medium', status: obj.status || 'draft', tags: obj.tags || [], roles: obj.roles || [], property: obj.property || '', region: obj.region || '', version: obj.version || '1.0', created_by: obj.createdBy || '', updated_by: obj.updatedBy || '', created_at: obj.createdAt, updated_at: obj.updatedAt };
  if (type === 'audit') return { id: obj.id, type: obj.type || 'sop', sop_id: obj.sopId || '', sop_title: obj.sopTitle || '', template_id: obj.templateId || '', title: obj.title || '', property: obj.property || '', department: obj.department || '', auditor: obj.auditor || '', date: obj.date, items: obj.items || [], notes: obj.notes || '', score: obj.score || 0, status: obj.status || 'completed', completed_at: obj.completedAt || new Date().toISOString() };
  if (type === 'template') return { id: obj.id, template_name: obj.templateName || '', department: obj.department || '', items: obj.items || [] };
  return obj;
}

// ─── Public API ───
export async function checkConnection() {
  const sb = await testSupabase();
  if (sb) return 'supabase';
  if (await _tryIDB()) return 'indexeddb';
  return 'memory';
}

// Users
export async function loadUsers() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('users').select('*').order('name');
      if (error) { console.error('[DB] loadUsers:', error.message); }
      else if (data) return data.map(function(r) { return toApp(r, 'user'); });
    }
  } catch(e) { console.error('[DB] loadUsers catch:', e); }
  var local = await idbGet('users');
  return Array.isArray(local) ? local : [];
}

export async function saveUsers(users) {
  await idbSet('users', users);
  try {
    if (await testSupabase()) {
      var sb = getSupabase();
      for (var i = 0; i < users.length; i++) {
        var r = await sb.from('users').upsert(toDB(users[i], 'user'), { onConflict: 'id' });
        if (r.error) console.error('[DB] saveUser ' + users[i].name + ':', r.error.message);
      }
    }
  } catch(e) { console.error('[DB] saveUsers:', e); }
}

export async function deleteUser(id) {
  try {
    if (await testSupabase()) {
      var r = await getSupabase().from('users').delete().eq('id', id);
      if (r.error) console.error('[DB] deleteUser:', r.error.message);
    }
  } catch(e) { console.error('[DB] deleteUser:', e); }
}

// Roles
export async function loadRoles() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('roles').select('*').order('sort_order');
      if (error) { console.error('[DB] loadRoles:', error.message); }
      else if (data && data.length > 0) return data.map(function(r) { return toApp(r, 'role'); });
    }
  } catch(e) { console.error('[DB] loadRoles catch:', e); }
  var local = await idbGet('roles');
  return Array.isArray(local) && local.length > 0 ? local : null;
}

export async function saveRoles(roles) {
  await idbSet('roles', roles);
  try {
    if (await testSupabase()) {
      var sb = getSupabase();
      for (var i = 0; i < roles.length; i++) {
        var row = Object.assign({}, toDB(roles[i], 'role'), { sort_order: i });
        var r = await sb.from('roles').upsert(row, { onConflict: 'id' });
        if (r.error) console.error('[DB] saveRole ' + roles[i].label + ':', r.error.message);
      }
    }
  } catch(e) { console.error('[DB] saveRoles:', e); }
}

// SOPs
export async function loadSOPs() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('sops').select('*').order('updated_at', { ascending: false });
      if (error) { console.error('[DB] loadSOPs:', error.message); }
      else if (data) return data.map(function(r) { return toApp(r, 'sop'); });
    }
  } catch(e) { console.error('[DB] loadSOPs catch:', e); }
  var local = await idbGet('sops');
  return Array.isArray(local) ? local : [];
}

export async function saveSOPs(sops) {
  await idbSet('sops', sops);
  try {
    if (await testSupabase()) {
      var sb = getSupabase();
      for (var i = 0; i < sops.length; i++) {
        var r = await sb.from('sops').upsert(toDB(sops[i], 'sop'), { onConflict: 'id' });
        if (r.error) console.error('[DB] saveSOP ' + sops[i].title + ':', r.error.message);
      }
    }
  } catch(e) { console.error('[DB] saveSOPs:', e); }
}

export async function deleteSOP(id) {
  try {
    if (await testSupabase()) {
      var r = await getSupabase().from('sops').delete().eq('id', id);
      if (r.error) console.error('[DB] deleteSOP:', r.error.message);
    }
  } catch(e) { console.error('[DB] deleteSOP:', e); }
}

// Audits
export async function loadAudits() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('audits').select('*').order('date', { ascending: false });
      if (error) { console.error('[DB] loadAudits:', error.message); }
      else if (data) return data.map(function(r) { return toApp(r, 'audit'); });
    }
  } catch(e) { console.error('[DB] loadAudits catch:', e); }
  var local = await idbGet('audits');
  return Array.isArray(local) ? local : [];
}

export async function saveAudits(audits) {
  await idbSet('audits', audits);
  try {
    if (await testSupabase()) {
      var sb = getSupabase();
      for (var i = 0; i < audits.length; i++) {
        var r = await sb.from('audits').upsert(toDB(audits[i], 'audit'), { onConflict: 'id' });
        if (r.error) console.error('[DB] saveAudit:', r.error.message);
      }
    }
  } catch(e) { console.error('[DB] saveAudits:', e); }
}

export async function deleteAudit(id) {
  try {
    if (await testSupabase()) {
      var r = await getSupabase().from('audits').delete().eq('id', id);
      if (r.error) console.error('[DB] deleteAudit:', r.error.message);
    }
  } catch(e) { console.error('[DB] deleteAudit:', e); }
}

// Templates
export async function loadTemplates() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('audit_templates').select('*');
      if (error) { console.error('[DB] loadTemplates:', error.message); }
      else if (data) return data.map(function(r) { return toApp(r, 'template'); });
    }
  } catch(e) { console.error('[DB] loadTemplates catch:', e); }
  var local = await idbGet('atemplates');
  return Array.isArray(local) ? local : [];
}

export async function saveTemplates(templates) {
  await idbSet('atemplates', templates);
  try {
    if (await testSupabase()) {
      var sb = getSupabase();
      for (var i = 0; i < templates.length; i++) {
        var r = await sb.from('audit_templates').upsert(toDB(templates[i], 'template'), { onConflict: 'id' });
        if (r.error) console.error('[DB] saveTemplate:', r.error.message);
      }
    }
  } catch(e) { console.error('[DB] saveTemplates:', e); }
}

export async function deleteTemplate(id) {
  try {
    if (await testSupabase()) {
      var r = await getSupabase().from('audit_templates').delete().eq('id', id);
      if (r.error) console.error('[DB] deleteTemplate:', r.error.message);
    }
  } catch(e) { console.error('[DB] deleteTemplate:', e); }
}

// Session
export async function loadSession() { return idbGet('session'); }
export async function saveSession(session) { return idbSet('session', session); }

// Google SSO
export async function signInWithGoogle() {
  var sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error) throw error;
  return data;
}
export async function getGoogleSession() {
  try { var sb = getSupabase(); if (!sb) return null; const { data } = await sb.auth.getSession(); if (!data || !data.session) return null; return { email: data.session.user?.email, name: data.session.user?.user_metadata?.full_name || data.session.user?.email, avatar: data.session.user?.user_metadata?.avatar_url, googleId: data.session.user?.id }; } catch(e) { return null; }
}
export async function signOutGoogle() { try { var sb = getSupabase(); if (sb) await sb.auth.signOut(); } catch(e) {} }
export async function onAuthChange(callback) { try { var sb = getSupabase(); if (!sb) return null; var d = sb.auth.onAuthStateChange(function(event, session) { callback(event, session); }); return d?.data?.subscription; } catch(e) { return null; } }
