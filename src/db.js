import { createClient } from '@supabase/supabase-js';

// ─── Supabase Config ───
// Replace with your project credentials from supabase.com > Settings > API
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
    _supabaseOk = !error;
    return _supabaseOk;
  } catch {
    _supabaseOk = false;
    return false;
  }
}

// ─── IndexedDB Fallback ───
const _mem = {};
let _idbOk = null;

async function _tryIDB() {
  if (_idbOk !== null) return _idbOk;
  try {
    if (typeof indexedDB === 'undefined') { _idbOk = false; return false; }
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open('HHM_SOP', 1);
      r.onupgradeneeded = () => { try { r.result.createObjectStore('d'); } catch (e) {} };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
      setTimeout(() => rej(new Error('timeout')), 2000);
    });
    db.close();
    _idbOk = true;
    return true;
  } catch { _idbOk = false; return false; }
}

async function idbGet(k) {
  try {
    if (await _tryIDB()) {
      const db = await new Promise((res, rej) => { const r = indexedDB.open('HHM_SOP', 1); r.onsuccess = () => res(r.result); r.onerror = () => rej(); });
      const val = await new Promise(res => {
        try { const t = db.transaction('d', 'readonly'); const g = t.objectStore('d').get(k); g.onsuccess = () => res(g.result !== undefined ? g.result : null); g.onerror = () => res(null); } catch { res(null); }
      });
      db.close();
      if (val !== null) return val;
    }
  } catch {}
  return _mem[k] !== undefined ? _mem[k] : null;
}

async function idbSet(k, v) {
  _mem[k] = v;
  try {
    if (await _tryIDB()) {
      const db = await new Promise((res, rej) => { const r = indexedDB.open('HHM_SOP', 1); r.onsuccess = () => res(r.result); r.onerror = () => rej(); });
      await new Promise(res => {
        try { const t = db.transaction('d', 'readwrite'); t.objectStore('d').put(v, k); t.oncomplete = () => res(true); t.onerror = () => res(false); } catch { res(false); }
      });
      db.close();
    }
  } catch {}
  return true;
}

// ─── Helper: convert between Supabase snake_case and app camelCase ───
function toApp(row, type) {
  if (!row) return null;
  if (type === 'user') return { id: row.id, name: row.name, password: row.password || '', email: row.email || '', roleId: row.role_id, department: row.department || '', active: row.active !== false, createdAt: row.created_at, lastLogin: row.last_login };
  if (type === 'role') return { id: row.id, label: row.label, icon: row.icon || 'user', color: row.color || '#6B7280', desc: row.description || '', permissions: row.permissions || [] };
  if (type === 'sop') return { id: row.id, title: row.title, department: row.department || '', category: row.category || 'standards', content: row.content || '', priority: row.priority || 'medium', status: row.status || 'draft', tags: row.tags || [], roles: row.roles || [], property: row.property || '', region: row.region || '', version: row.version || '1.0', createdBy: row.created_by || '', updatedBy: row.updated_by || '', createdAt: row.created_at, updatedAt: row.updated_at };
  if (type === 'audit') return { id: row.id, type: row.type || 'sop', sopId: row.sop_id || '', sopTitle: row.sop_title || '', templateId: row.template_id || '', title: row.title || '', property: row.property || '', department: row.department || '', auditor: row.auditor || '', date: row.date, items: row.items || [], notes: row.notes || '', score: Number(row.score) || 0, status: row.status || 'completed', completedAt: row.completed_at };
  if (type === 'template') return { id: row.id, templateName: row.template_name || '', department: row.department || '', items: row.items || [] };
  return row;
}

function toDB(obj, type) {
  if (!obj) return null;
  if (type === 'user') return { id: obj.id, name: obj.name, password: obj.password || '', email: obj.email || '', role_id: obj.roleId, department: obj.department || '', active: obj.active !== false, created_at: obj.createdAt || new Date().toISOString(), last_login: obj.lastLogin || null };
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

// --- Users ---
export async function loadUsers() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('users').select('*').order('name');
      if (!error && data) return data.map(r => toApp(r, 'user'));
    }
  } catch {}
  const local = await idbGet('users');
  return Array.isArray(local) ? local : [];
}

export async function saveUsers(users) {
  await idbSet('users', users); // always cache locally
  try {
    if (await testSupabase()) {
      const sb = getSupabase();
      // Upsert all users
      const rows = users.map(u => toDB(u, 'user'));
      await sb.from('users').upsert(rows, { onConflict: 'id' });
      // Delete users not in the list
      const ids = users.map(u => u.id);
      if (ids.length > 0) {
        await sb.from('users').delete().not('id', 'in', '(' + ids.join(',') + ')');
      }
    }
  } catch (e) { console.error('saveUsers error:', e); }
}

// --- Roles ---
export async function loadRoles() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('roles').select('*').order('sort_order');
      if (!error && data && data.length > 0) return data.map(r => toApp(r, 'role'));
    }
  } catch {}
  const local = await idbGet('roles');
  return Array.isArray(local) && local.length > 0 ? local : null; // null = use defaults
}

export async function saveRoles(roles) {
  await idbSet('roles', roles);
  try {
    if (await testSupabase()) {
      const rows = roles.map((r, i) => ({ ...toDB(r, 'role'), sort_order: i }));
      await getSupabase().from('roles').upsert(rows, { onConflict: 'id' });
    }
  } catch (e) { console.error('saveRoles error:', e); }
}

// --- SOPs ---
export async function loadSOPs() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('sops').select('*').order('updated_at', { ascending: false });
      if (!error && data) return data.map(r => toApp(r, 'sop'));
    }
  } catch {}
  const local = await idbGet('sops');
  return Array.isArray(local) ? local : [];
}

export async function saveSOPs(sops) {
  await idbSet('sops', sops);
  try {
    if (await testSupabase()) {
      const sb = getSupabase();
      const rows = sops.map(s => toDB(s, 'sop'));
      await sb.from('sops').upsert(rows, { onConflict: 'id' });
      const ids = sops.map(s => s.id);
      if (ids.length > 0) {
        await sb.from('sops').delete().not('id', 'in', '(' + ids.join(',') + ')');
      }
    }
  } catch (e) { console.error('saveSOPs error:', e); }
}

// --- Audits ---
export async function loadAudits() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('audits').select('*').order('date', { ascending: false });
      if (!error && data) return data.map(r => toApp(r, 'audit'));
    }
  } catch {}
  const local = await idbGet('audits');
  return Array.isArray(local) ? local : [];
}

export async function saveAudits(audits) {
  await idbSet('audits', audits);
  try {
    if (await testSupabase()) {
      const sb = getSupabase();
      const rows = audits.map(a => toDB(a, 'audit'));
      await sb.from('audits').upsert(rows, { onConflict: 'id' });
      const ids = audits.map(a => a.id);
      if (ids.length > 0) {
        await sb.from('audits').delete().not('id', 'in', '(' + ids.join(',') + ')');
      }
    }
  } catch (e) { console.error('saveAudits error:', e); }
}

// --- Audit Templates ---
export async function loadTemplates() {
  try {
    if (await testSupabase()) {
      const { data, error } = await getSupabase().from('audit_templates').select('*');
      if (!error && data) return data.map(r => toApp(r, 'template'));
    }
  } catch {}
  const local = await idbGet('atemplates');
  return Array.isArray(local) ? local : [];
}

export async function saveTemplates(templates) {
  await idbSet('atemplates', templates);
  try {
    if (await testSupabase()) {
      const sb = getSupabase();
      const rows = templates.map(t => toDB(t, 'template'));
      await sb.from('audit_templates').upsert(rows, { onConflict: 'id' });
      const ids = templates.map(t => t.id);
      if (ids.length > 0) {
        await sb.from('audit_templates').delete().not('id', 'in', '(' + ids.join(',') + ')');
      }
    }
  } catch (e) { console.error('saveTemplates error:', e); }
}

// --- Session ---
export async function loadSession() {
  return idbGet('session');
}

export async function saveSession(session) {
  return idbSet('session', session);
}
