import { useState, useEffect, useRef, useCallback } from "react";

function useIsMobile(bp) {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < (bp || 768) : false);
  useEffect(() => {
    const h = () => setM(window.innerWidth < (bp || 768));
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

const MOBILE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@media (max-width: 767px) {
  .hhm-app { flex-direction: column !important; }
  .hhm-sidebar { width: 100% !important; min-width: 100% !important; max-height: none !important; flex-direction: row !important; overflow-x: auto !important; overflow-y: hidden !important; border-right: none !important; border-bottom: 1px solid #E8E4DC !important; }
  .hhm-sidebar nav { flex-direction: row !important; padding: 8px !important; gap: 4px !important; }
  .hhm-sidebar nav button { padding: 8px 12px !important; font-size: 12px !important; }
  .hhm-main { min-height: 0 !important; }
  .hhm-content { padding: 16px !important; }
  .hhm-topbar { padding: 10px 16px !important; }
  .hhm-form-grid { grid-template-columns: 1fr !important; }
  .hhm-stats-row { grid-template-columns: repeat(2, 1fr) !important; }
  .hhm-cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .hhm-dash-hero { padding: 16px !important; }
  .hhm-ai-box { padding: 16px !important; }
  .hhm-ai-btns { flex-direction: column !important; }
  .hhm-create-form { padding: 16px !important; }
  .hhm-content-block { padding: 16px !important; }
  .hhm-table-wrap { overflow-x: auto; }
  .hhm-table-wrap table { min-width: 600px; }
}
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}
`;

const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');";

const HHM = {
  navy: "#1B2A4A", navyDark: "#111C30", navyDeep: "#0D1420",
  gold: "#C9A84C", goldLight: "#C9A84C22", goldBorder: "#C9A84C40",
  cream: "#F5F0E8", warmWhite: "#FAFAF7",
  charcoal: "#2D2D2D", lightGray: "#E8E4DC",
  white: "#FFFFFF",
  gray50: "#FAFAF7", gray100: "#E8E4DC", gray200: "#D5D0C8",
  gray300: "#B0A898", gray400: "#8A8278", gray500: "#6B6560",
  gray700: "#3D3833", gray900: "#2D2D2D",
  success: "#4A7C59", warning: "#D4A017", danger: "#8B2635", review: "#5B4A8A",
};

const ALL_PERMISSIONS = [
  { id: "create", label: "Create SOPs", desc: "Create new SOPs" },
  { id: "edit", label: "Edit SOPs", desc: "Modify existing SOPs" },
  { id: "delete", label: "Delete SOPs", desc: "Remove SOPs" },
  { id: "approve", label: "Approve SOPs", desc: "Approve/reject SOPs" },
  { id: "audit", label: "Conduct Audits", desc: "Run audits" },
  { id: "report", label: "View Reports", desc: "Access analytics" },
  { id: "assign", label: "Assign SOPs", desc: "Assign to teams" },
  { id: "version", label: "Manage Versions", desc: "Version control" },
  { id: "admin", label: "Administration", desc: "Manage users and roles" },
];

const DEFAULT_ROLES = [
  { id: "security", label: "Security Admin", icon: "key", color: "#B45309", desc: "Full platform administration and security", permissions: ["create","edit","delete","audit","approve","assign","admin","report","version"] },
  { id: "gm", label: "General Manager", icon: "crown", color: HHM.navy, desc: "Living playbook and control center", permissions: ["create","edit","delete","audit","approve","assign"] },
  { id: "dept", label: "Department Leader", icon: "hotel", color: "#0E7C47", desc: "Visual standards and team checklists", permissions: ["create","edit","audit"] },
  { id: "corporate", label: "Corporate Audit", icon: "clipboard", color: HHM.navy, desc: "Unified auditing framework", permissions: ["audit","report"] },
  { id: "doo", label: "Director of Operations", icon: "globe", color: "#6D28D9", desc: "Portfolio-wide operating model", permissions: ["create","edit","delete","approve","audit","report"] },
  { id: "quality", label: "Quality Standards Mgr", icon: "check", color: "#0E7490", desc: "Version control and localization", permissions: ["create","edit","approve","version"] },
  { id: "brand", label: "Brand & Regional Leader", icon: "building", color: "#B91C1C", desc: "Global standards and compliance", permissions: ["create","edit","approve","report","audit"] },
];

const RI = { key:"\u{1F511}", crown:"\u{1F451}", hotel:"\u{1F3E8}", clipboard:"\u{1F4CB}", globe:"\u{1F310}", check:"\u2705", building:"\u{1F3DB}\uFE0F", user:"\u{1F464}" };
const DEPARTMENTS = ["Banquets & Catering","Concierge","Culinary","Engineering","Front Office","Guest Services (Door & Luggage)","Housekeeping","In Room Dining","Restaurants & Bars","Security","Spa & Pools","Valet Parking"];
const CATEGORIES = [
  { id:"standards", label:"Operating Standards", icon:"\u{1F4D0}" },
  { id:"checklists", label:"Checklists & Workflows", icon:"\u2611\uFE0F" },
  { id:"onboarding", label:"Onboarding & Training", icon:"\u{1F393}" },
  { id:"audit", label:"Audit & Compliance", icon:"\u{1F50D}" },
  { id:"guest", label:"Guest Experience", icon:"\u2B50" },
  { id:"safety", label:"Safety & Emergency", icon:"\u{1F6E1}\uFE0F" },
  { id:"brand", label:"Brand Standards", icon:"\u{1F3F7}\uFE0F" },
  { id:"maintenance", label:"Maintenance & PM", icon:"\u{1F527}" },
];

const BRANDS = {
  "HHM": { label: "HHM Hotels (Company Standard)", subs: [], tone: "HHM corporate standard", program: "HHM Quality Standards", audit: "HHM internal audit", service: "HHM service model" },
  "Marriott": {
    label: "Marriott International",
    subs: [
      { id: "marriott-courtyard", label: "Courtyard by Marriott", tier: "Select", tone: "Smart, productive, warm. Designed for the modern business traveler who values efficiency and comfort.", program: "Marriott BSA (Brand Standard Audit)", audit: "Marriott BSAQ", service: "Courtyard service promise: everything you need, nothing you dont", focus: "lobby experience, Bistro operations, mobile check-in, flexible meeting spaces" },
      { id: "marriott-residence", label: "Residence Inn by Marriott", tier: "Select", tone: "Home-like, welcoming, extended-stay focused. Built for guests who need more than a room.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Feel at home while on the road", focus: "grocery delivery, kitchen suites, evening social, pet-friendly, laundry facilities" },
      { id: "marriott-fairfield", label: "Fairfield by Marriott", tier: "Select", tone: "Reliable, straightforward, warm. Consistent quality at a fair price.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Warm, reliable hospitality at a fair price", focus: "complimentary breakfast, simple clean rooms, consistent experience, value-oriented service" },
      { id: "marriott-springhill", label: "SpringHill Suites by Marriott", tier: "Select", tone: "Bright, fresh, spacious. Suite-style for guests who want a little more space.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Stylish all-suite hotel experience", focus: "suite layout, complimentary breakfast, lobby spaces, fitness, pool areas" },
      { id: "marriott-full", label: "Marriott Hotels & Resorts", tier: "Premium", tone: "Polished, confident, globally consistent. The flagship brand delivering premium full-service hospitality.", program: "Marriott BSA / LQA", audit: "Marriott BSAQ + LQA", service: "Brilliantly designed for the modern traveler", focus: "M Club lounge, full F&B outlets, concierge, event/meeting spaces, fitness center, spa" },
      { id: "marriott-sheraton", label: "Sheraton Hotels & Resorts", tier: "Premium", tone: "Community-gathering, inclusive, globally welcoming. A place where the world comes together.", program: "Marriott BSA / Sheraton standards", audit: "Marriott BSAQ", service: "Community gathering place", focus: "Sheraton Club, community table, paired dining, lobby lounge, global community feel" },
      { id: "marriott-westin", label: "Westin Hotels & Resorts", tier: "Premium", tone: "Wellness-forward, rejuvenating, purposeful. Every touchpoint designed to help guests feel their best.", program: "Marriott BSA / Westin Well-Being", audit: "Marriott BSAQ", service: "Feel well when you leave than when you arrived", focus: "Heavenly Bed, WestinWORKOUT, RunWestin, SuperFoodsRx, Westin Sleep Well, wellness programs" },
      { id: "marriott-autograph", label: "Autograph Collection Hotels", tier: "Premium", tone: "Independent, story-driven, exactingly curated. Each property is one-of-a-kind.", program: "Marriott BSA / Autograph guidelines", audit: "Marriott BSAQ", service: "Exactly like nothing else", focus: "unique property identity, local story, curated experiences, independent character within Marriott system" },
      { id: "marriott-tribute", label: "Tribute Portfolio", tier: "Premium", tone: "Characterful, locally rooted, independent-spirited. Independent hotels with Marriott backbone.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Stay independent with Marriott benefits", focus: "independent character, local partnerships, unique F&B, boutique feel" },
      { id: "marriott-aloft", label: "Aloft Hotels", tier: "Select", tone: "Tech-forward, vibrant, youthful. Music, social, energy.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Different by design", focus: "W XYZ bar, live music, WXYZ lounge, tech-forward check-in, loft-inspired rooms, social spaces" },
      { id: "marriott-element", label: "Element by Westin", tier: "Select", tone: "Eco-conscious, wellness, extended-stay. Nature-inspired and sustainably designed.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Stay in your element", focus: "eco-friendly operations, bikes to borrow, saline pool, Heavenly Bed, healthy breakfast, LEED design" },
      { id: "marriott-moxy", label: "Moxy Hotels", tier: "Select", tone: "Playful, bold, social-first. Budget-friendly boutique with attitude.", program: "Marriott BSA", audit: "Marriott BSAQ", service: "Play on", focus: "Bar Moxy, social lobby, grab-and-go, compact rooms, self-service, experiential programming" },
    ]
  },
  "Hilton": {
    label: "Hilton Hotels & Resorts",
    subs: [
      { id: "hilton-garden", label: "Hilton Garden Inn", tier: "Focus", tone: "Bright, reliable, upscale-casual. Everything you need for a productive and comfortable stay.", program: "Hilton Brand QA", audit: "Hilton QA audit", service: "Everything. Right where you need it.", focus: "Garden Grille & Bar, 24/7 pavilion pantry, complimentary WiFi, business center, fitness" },
      { id: "hilton-hampton", label: "Hampton by Hilton", tier: "Focus", tone: "Friendly, dependable, value-oriented. The Hamptonality service culture.", program: "Hilton Brand QA", audit: "Hilton QA", service: "100% Hampton Guarantee", focus: "free hot breakfast, clean rooms guarantee, friendly service, Hamptonality culture, value proposition" },
      { id: "hilton-homewood", label: "Homewood Suites by Hilton", tier: "Focus", tone: "Home-away-from-home, extended-stay, all-suite. Make yourself at home.", program: "Hilton Brand QA", audit: "Hilton QA", service: "Make yourself at home", focus: "full kitchen suites, complimentary breakfast, evening social, grocery shopping service, pet-friendly" },
      { id: "hilton-embassy", label: "Embassy Suites by Hilton", tier: "Premium", tone: "Spacious, upscale all-suite. More space, more value.", program: "Hilton Brand QA", audit: "Hilton QA", service: "Two-room all-suite hotel", focus: "cooked-to-order breakfast, evening reception, two-room suites, atrium lobby, meeting space" },
      { id: "hilton-doubletree", label: "DoubleTree by Hilton", tier: "Premium", tone: "Warm, welcoming, the cookie moment. Small things make a big difference.", program: "Hilton Brand QA", audit: "Hilton QA", service: "Warm DoubleTree cookie welcome", focus: "warm cookie at check-in, CARE culture, Sweet Dreams bed, full-service restaurant, meeting spaces" },
      { id: "hilton-conrad", label: "Conrad Hotels & Resorts", tier: "Luxury", tone: "Sophisticated, intuitive luxury. The luxury of being yourself.", program: "Hilton Brand QA / LQA", audit: "Hilton QA + LQA", service: "Luxury that is smart, not complicated", focus: "luxury F&B, spa, Conrad concierge, personalized service, art collections, bespoke experiences" },
      { id: "hilton-full", label: "Hilton Hotels & Resorts", tier: "Premium", tone: "Iconic, globally trusted, full-service. The flagship.", program: "Hilton Brand QA", audit: "Hilton QA", service: "Travel should take you places", focus: "executive floor, full F&B, Hilton Honors experiences, fitness, pool, concierge, meetings" },
      { id: "hilton-tru", label: "Tru by Hilton", tier: "Focus", tone: "Vibrant, affordable, socially designed. Simplified hospitality.", program: "Hilton Brand QA", audit: "Hilton QA", service: "Refreshingly simple", focus: "lobby lounge zones (eat, play, work, lounge), top it breakfast bar, compact rooms, value-first" },
    ]
  },
  "IHG": {
    label: "IHG Hotels & Resorts",
    subs: [
      { id: "ihg-holiday", label: "Holiday Inn", tier: "Mainstream", tone: "Welcoming, enjoyable, dependable. Warm welcomes and thoughtful touches.", program: "IHG Brand Standards", audit: "IHG QA", service: "Everyone deserves a warm welcome", focus: "Open Lobby, restaurant/bar, meetings, Kids Stay Free, Holiday Inn service promise" },
      { id: "ihg-express", label: "Holiday Inn Express", tier: "Mainstream", tone: "Smart, uncomplicated, great breakfast. Stay smart.", program: "IHG Brand Standards", audit: "IHG QA", service: "Stay Smart", focus: "Express Start breakfast, clean comfortable rooms, smart design, power showers, great night sleep" },
      { id: "ihg-indigo", label: "Hotel Indigo", tier: "Premium", tone: "Boutique, neighborhood-inspired, story-rich. A hotel that reflects its neighborhood.", program: "IHG Brand Standards", audit: "IHG QA", service: "Boutique to the core", focus: "neighborhood story, locally inspired design, chef-driven restaurant, unique per-property identity" },
      { id: "ihg-crowne", label: "Crowne Plaza", tier: "Premium", tone: "Business-ready, modern, well-rested. Designed for the modern business traveler.", program: "IHG Brand Standards", audit: "IHG QA", service: "Travel made workable", focus: "WorkLife rooms, Sleep Advantage, meeting spaces, business services, fitness, F&B" },
      { id: "ihg-intercontinental", label: "InterContinental Hotels", tier: "Luxury", tone: "Worldly, refined, culturally immersive. Live the InterContinental life.", program: "IHG Brand Standards / LQA", audit: "IHG QA + LQA", service: "In the know experiences", focus: "Concierge, Club lounge, luxury F&B, spa, cultural programming, bespoke guest experiences" },
      { id: "ihg-staybridge", label: "Staybridge Suites", tier: "Mainstream", tone: "Neighborly, extended-stay, home-like. Feel at home even when you are away.", program: "IHG Brand Standards", audit: "IHG QA", service: "Home-like extended stay", focus: "full kitchen, social evening reception, grocery delivery, Den/social space, laundry, pet friendly" },
      { id: "ihg-candlewood", label: "Candlewood Suites", tier: "Mainstream", tone: "Practical, value extended-stay. Everything you need for a longer stay.", program: "IHG Brand Standards", audit: "IHG QA", service: "Like having your own place", focus: "full kitchen, Lending Locker, Candlewood Cupboard, laundry, fitness, value extended stay" },
    ]
  },
  "Hyatt": {
    label: "Hyatt Hotels Corporation",
    subs: [
      { id: "hyatt-place", label: "Hyatt Place", tier: "Select", tone: "Casual, intuitive, modern. Everything you need, nothing you dont.", program: "Hyatt Brand Standards", audit: "Hyatt QA", service: "Feel the Hyatt Place", focus: "Gallery Kitchen & Bar, free breakfast, 24/7 Gallery Market, Cozy Corner sleeper sofa, swim/fitness" },
      { id: "hyatt-house", label: "Hyatt House", tier: "Select", tone: "Residential, homey, extended-stay. Your home base for longer stays.", program: "Hyatt Brand Standards", audit: "Hyatt QA", service: "More than a room, a residence", focus: "H Bar, full kitchen, H Market, breakfast, communal spaces, residential feel" },
      { id: "hyatt-regency", label: "Hyatt Regency", tier: "Premium", tone: "Connected, seamless, stress-free. Designed to connect.", program: "Hyatt Brand Standards", audit: "Hyatt QA", service: "Designed to connect guests seamlessly", focus: "Regency Club, full F&B, grand ballroom, meeting spaces, fitness, pool, concierge" },
      { id: "hyatt-full", label: "Grand Hyatt", tier: "Premium", tone: "Grand, bold, immersive. Large-scale luxury in gateway cities.", program: "Hyatt Brand Standards / LQA", audit: "Hyatt QA", service: "Grand in scale, personal in service", focus: "multiple restaurants, grand lobby, spa, fitness, large meeting/event space, premium service" },
    ]
  },
  "Wyndham": {
    label: "Wyndham Hotels & Resorts",
    subs: [
      { id: "wyndham-wyngate", label: "Wingate by Wyndham", tier: "Midscale", tone: "Reliable, business-friendly, consistent. Built for productive travel.", program: "Wyndham Brand Standards", audit: "Wyndham QA", service: "What you need, where you need it", focus: "free WiFi, hot breakfast, business center, fitness, meeting room, consistent experience" },
      { id: "wyndham-lq", label: "La Quinta by Wyndham", tier: "Midscale", tone: "Bright, welcoming, value-smart. Tomorrow is looking bright.", program: "Wyndham Brand Standards", audit: "Wyndham QA", service: "Here for you", focus: "Bright Side Breakfast, pet-friendly, pool, bright rooms, value proposition" },
      { id: "wyndham-full", label: "Wyndham Hotels & Resorts", tier: "Upscale", tone: "Distinguished, full-service, refined. Premium hospitality with a human touch.", program: "Wyndham Brand Standards", audit: "Wyndham QA", service: "The upscale Wyndham experience", focus: "full-service restaurant, bar, meeting spaces, concierge, fitness, pool" },
    ]
  },
  "Independent": { label: "Independent / Unbranded", subs: [], tone: "Unique property identity, owner-defined standards", program: "Property-specific quality standards", audit: "HHM internal audit", service: "Property-defined service model" },
};
const STATUS_MAP = { draft:{label:"Draft",color:HHM.gray400}, review:{label:"In Review",color:HHM.review}, approved:{label:"Approved",color:HHM.success}, archived:{label:"Archived",color:HHM.gray300} };
const PRIORITY_MAP = { critical:{label:"Critical",color:HHM.danger}, high:{label:"High",color:"#EA580C"}, medium:{label:"Medium",color:HHM.warning}, low:{label:"Low",color:HHM.gray400} };

// Storage: Supabase + IndexedDB fallback (see db.js)
import { checkConnection, loadUsers, saveUsers as dbSaveUsers, deleteUser as dbDeleteUser, loadRoles, saveRoles as dbSaveRoles, loadSOPs, saveSOPs as dbSaveSOPs, deleteSOP as dbDeleteSOP, loadAudits, saveAudits as dbSaveAudits, deleteAudit as dbDeleteAudit, loadTemplates, saveTemplates as dbSaveTemplates, deleteTemplate as dbDeleteTemplate, loadSession, saveSession, signInWithGoogle, getGoogleSession, signOutGoogle, onAuthChange } from './db.js';

// ─── Export / Import Helpers ───
function mdToHtml(md, title, dept, status, version, createdBy, date) {
  let html = md || "";
  html = html.replace(/^## (.+)$/gm, "<h2 style='color:#002855;border-bottom:2px solid #0072CE;padding-bottom:6px;margin-top:24px;'>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 style='color:#002855;'>$1</h1>");
  html = html.replace(/^\d+\.\s\*\*(.+?)\*\*\s*[-:]\s*(.+)$/gm, "<p style='margin:4px 0 4px 16px;'><strong style='color:#002855;'>$1</strong> - $2</p>");
  html = html.replace(/^\d+\.\s(.+)$/gm, "<p style='margin:4px 0 4px 16px;'>$1</p>");
  html = html.replace(/^- \*\*(.+?)\*\*:\s*(.+)$/gm, "<p style='margin:3px 0 3px 20px;'><strong>$1</strong>: $2</p>");
  html = html.replace(/^- (.+)$/gm, "<p style='margin:3px 0 3px 20px;'>&bull; $1</p>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n\n/g, "<br/>");
  return "<!DOCTYPE html><html><head><meta charset='utf-8'><style>body{font-family:Calibri,Arial,sans-serif;color:#333;max-width:800px;margin:0 auto;padding:40px;line-height:1.6;}h1{font-size:24px;}h2{font-size:18px;}</style></head><body>" +
    "<div style='text-align:center;margin-bottom:30px;'><div style='background:#002855;color:white;padding:20px;border-radius:8px;'><h1 style='margin:0;color:white;border:none;'>" + (title||"SOP Document") + "</h1><p style='margin:6px 0 0;color:#8FAFC8;font-size:14px;'>HHM Hotels - Standard Operating Procedure</p></div></div>" +
    "<table style='width:100%;font-size:13px;color:#555;margin-bottom:20px;border-collapse:collapse;'><tr><td><strong>Department:</strong> " + (dept||"-") + "</td><td><strong>Status:</strong> " + (status||"Draft") + "</td><td><strong>Version:</strong> " + (version||"1.0") + "</td></tr><tr><td><strong>Author:</strong> " + (createdBy||"-") + "</td><td><strong>Date:</strong> " + (date||"-") + "</td><td></td></tr></table><hr style='border:1px solid #E0E0E0;margin:16px 0;'/>" +
    html + "<hr style='border:1px solid #E0E0E0;margin:30px 0 10px;'/><p style='text-align:center;font-size:11px;color:#999;'>HHM Hotels - Hersha Hospitality Management | Confidential</p></body></html>";
}

function exportAsPDF(sop) {
  const html = mdToHtml(sop.content, sop.title, sop.department, sop.status, sop.version, sop.createdBy, new Date(sop.createdAt).toLocaleDateString());
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  }
}

function exportAsWord(sop) {
  const html = mdToHtml(sop.content, sop.title, sop.department, sop.status, sop.version, sop.createdBy, new Date(sop.createdAt).toLocaleDateString());
  const blob = new Blob([
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + (sop.title||"SOP") + "</title></head><body>" + html + "</body></html>"
  ], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = (sop.title || "SOP").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_") + ".doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function importFromWord(file) {
  // Use mammoth for proper .docx parsing
  var mammoth = await import('mammoth');
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = async function(e) {
      try {
        // mammoth converts docx to clean markdown-like text
        var result = await mammoth.convertToHtml({ arrayBuffer: e.target.result });
        var html = result.value || "";
        // Convert HTML to markdown-style text
        var text = html
          // Headers
          .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
          .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
          .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
          .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
          // Bold and italic
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
          .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
          .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
          .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
          // Lists
          .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
          .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
          // Paragraphs and breaks
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
          // Tables - convert to readable format
          .replace(/<tr[^>]*>(.*?)<\/tr>/gi, function(match, content) {
            var cells = [];
            content.replace(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi, function(m, c) { cells.push(c.trim()); });
            return cells.join(" | ") + "\n";
          })
          .replace(/<\/?(table|thead|tbody)[^>]*>/gi, "\n")
          // Strip remaining tags
          .replace(/<[^>]+>/g, "")
          // Clean up entities
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          // Clean whitespace
          .replace(/\n{3,}/g, "\n\n")
          .replace(/[ \t]+\n/g, "\n")
          .trim();
        if (text) {
          resolve(text);
        } else {
          reject(new Error("Document appears to be empty"));
        }
      } catch(err) {
        console.error("mammoth import error:", err);
        reject(new Error("Could not parse document: " + (err.message || "unknown error")));
      }
    };
    reader.onerror = function() { reject(new Error("File read error")); };
    reader.readAsArrayBuffer(file);
  });
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function HHMLogo({ size }) {
  return <svg width={size||32} height={(size||32)*0.6} viewBox="0 0 120 72" fill="none"><rect width="120" height="72" rx="6" fill={HHM.white}/><text x="60" y="42" textAnchor="middle" fontFamily="Arial Black,Helvetica,sans-serif" fontWeight="900" fontSize="32" letterSpacing="4" fill={HHM.navy}>HHM</text><rect x="16" y="52" width="88" height="2.5" rx="1.25" fill={HHM.gold}/></svg>;
}

export default function App() {
  const isMobile = useIsMobile(768);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [sops, setSOPs] = useState([]);
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dbStatus, setDbStatus] = useState("checking");
  const [settingsTab, setSettingsTab] = useState("users");
  const [showLogin, setShowLogin] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  
  const [newSOP, setNewSOP] = useState({ title:"", department:"Housekeeping", category:"standards", content:"", priority:"medium", status:"draft", tags:"", roles:[], property:"", region:"", version:"1.0", brand:"HHM", subBrand:"" });

  // Audit state
  const [audits, setAudits] = useState([]);
  const [auditTemplates, setAuditTemplates] = useState([]);
  const [activeAudit, setActiveAudit] = useState(null); // audit being conducted
  const [auditView, setAuditView] = useState("list"); // list | conduct | templates | newtemplate
  const [reportTab, setReportTab] = useState("property");

  const DEFAULT_ADMIN = { id: "admin001", name: "mjg-admin", roleId: "security", active: true, password: "admin123", createdAt: new Date().toISOString(), lastLogin: null };

  const showToast = (msg, type) => { setToast({msg,type:type||"success"}); setTimeout(()=>setToast(null),3500); };

  useEffect(() => {
    let authSub = null;
    (async () => {
      try {
        const conn = await checkConnection();
        setDbStatus(conn === "supabase" ? "connected" : conn === "indexeddb" ? "connected" : "memory");
      } catch { setDbStatus("memory"); }
      try {
        let su = await loadUsers();
        const sr = await loadRoles();
        const ss = await loadSOPs();
        const se = await loadSession();
        const sa = await loadAudits();
        const st = await loadTemplates();
        if (!Array.isArray(su) || su.length === 0) {
          su = [DEFAULT_ADMIN];
          await dbSaveUsers(su);
        }
        setUsers(su);
        if (Array.isArray(sr) && sr.length) setRoles(sr);
        if (Array.isArray(ss) && ss.length) setSOPs(ss);
        if (Array.isArray(sa)) setAudits(sa);
        if (Array.isArray(st)) setAuditTemplates(st);

        // Check for returning Google SSO session
        const gSession = await getGoogleSession();
        if (gSession && gSession.email) {
          const gUser = su.find(function(x) { return x.email && x.email.toLowerCase() === gSession.email.toLowerCase(); });
          if (gUser && gUser.active !== false) {
            const updated = su.map(function(x) { return x.id === gUser.id ? Object.assign({}, x, { lastLogin: new Date().toISOString() }) : x; });
            await dbSaveUsers(updated);
            setUsers(updated);
            setCurrentUser(Object.assign({}, gUser, { lastLogin: new Date().toISOString() }));
            setShowLogin(false);
            await saveSession({ userId: gUser.id });
          }
        } else if (se && se.userId) {
          const u = su.find(function(x) { return x.id === se.userId; });
          if (u && u.active !== false) { setCurrentUser(u); setShowLogin(false); }
        }
      } catch {}

      // Listen for auth state changes (Google SSO redirects)
      authSub = await onAuthChange(async function(event, session) {
        if (event === "SIGNED_IN" && session?.user?.email) {
          const allU = await loadUsers();
          const gUser = allU.find(function(x) { return x.email && x.email.toLowerCase() === session.user.email.toLowerCase(); });
          if (gUser && gUser.active !== false) {
            const updated = allU.map(function(x) { return x.id === gUser.id ? Object.assign({}, x, { lastLogin: new Date().toISOString() }) : x; });
            await dbSaveUsers(updated);
            setUsers(updated);
            setCurrentUser(Object.assign({}, gUser, { lastLogin: new Date().toISOString() }));
            setShowLogin(false);
            await saveSession({ userId: gUser.id });
            showToast("Welcome, " + gUser.name);
          } else {
            setLoginError("No account found for " + session.user.email + ". Contact Security Admin.");
            await signOutGoogle();
          }
        }
      });
    })();
    return function() { if (authSub && authSub.unsubscribe) authSub.unsubscribe(); };
  }, []);

  const persistSops = async d => { setSOPs(d); await dbSaveSOPs(d); };
  const persistUsers = async d => { setUsers(d); await dbSaveUsers(d); };
  const persistRoles = async d => { setRoles(d); await dbSaveRoles(d); };
  const persistAudits = async d => { setAudits(d); await dbSaveAudits(d); };
  const persistTemplates = async d => { setAuditTemplates(d); await dbSaveTemplates(d); };

  const handleGoogleSSO = async function() {
    setSsoLoading(true);
    setLoginError("");
    try {
      await signInWithGoogle();
      // Redirect happens — user comes back and onAuthChange fires
    } catch (err) {
      setLoginError("Google sign-in failed: " + (err.message || "Unknown error"));
      setSsoLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const name = loginName.trim();
      const pass = loginPass;
      if (!name) { setLoginError("Please enter your username."); setLoginLoading(false); return; }
      if (!pass) { setLoginError("Please enter your password."); setLoginLoading(false); return; }
      // If users haven't loaded yet, try fetching again
      let allUsers = users;
      if (allUsers.length === 0) {
        try {
          allUsers = await loadUsers();
          if (Array.isArray(allUsers) && allUsers.length > 0) setUsers(allUsers);
        } catch {}
      }
      if (allUsers.length === 0) { setLoginError("Database is still loading. Please wait a moment and try again."); setLoginLoading(false); return; }
      const u = allUsers.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (!u) { setLoginError("User not found. Contact your Security Admin for access."); setLoginLoading(false); return; }
      if (u.active === false) { setLoginError("Account disabled. Contact your Security Admin."); setLoginLoading(false); return; }
      // Check lockout
      if (u.lockedUntil) {
        const lockTime = new Date(u.lockedUntil).getTime();
        if (Date.now() < lockTime) {
          const minsLeft = Math.ceil((lockTime - Date.now()) / 60000);
          setLoginError("Account locked due to too many failed attempts. Try again in " + minsLeft + " minute" + (minsLeft !== 1 ? "s" : "") + ". Contact Security Admin to unlock.");
          setLoginLoading(false);
          return;
        }
      }
      // Check password
      const correctPass = u.password || "changeme";
      if (pass !== correctPass) {
        const attempts = (u.failedAttempts || 0) + 1;
        const remaining = 4 - attempts;
        let lockData = { failedAttempts: attempts };
        if (attempts >= 4) {
          lockData.lockedUntil = new Date(Date.now() + 15 * 60000).toISOString();
          lockData.failedAttempts = attempts;
        }
        const updated = allUsers.map(x => x.id === u.id ? { ...x, ...lockData } : x);
        await persistUsers(updated);
        if (attempts >= 4) {
          setLoginError("Account locked for 15 minutes after 4 failed attempts. Contact Security Admin to unlock.");
        } else {
          setLoginError("Incorrect password. " + remaining + " attempt" + (remaining !== 1 ? "s" : "") + " remaining before lockout.");
        }
        setLoginLoading(false);
        return;
      }
      // Success - clear failed attempts
      const updated = allUsers.map(x => x.id === u.id ? { ...x, lastLogin: new Date().toISOString(), failedAttempts: 0, lockedUntil: null } : x);
      await persistUsers(updated);
      setCurrentUser({ ...u, lastLogin: new Date().toISOString(), failedAttempts: 0, lockedUntil: null });
      setShowLogin(false);
      setLoginError("");
      setLoginPass("");
      await saveSession({ userId: u.id });
      showToast("Welcome, " + u.name);
    } catch (err) {
      setLoginError("Login failed: " + (err.message || "Unknown error"));
    }
    setLoginLoading(false);
  };
  const logout = async () => { setCurrentUser(null); setShowLogin(true); setShowAdminLogin(false); setView("dashboard"); await signOutGoogle(); await saveSession(null); };

  const userRole = currentUser ? roles.find(r=>r.id===currentUser.roleId) : null;
  const hasPerm = p => userRole?.permissions?.includes(p);
  const canCreate=hasPerm("create"); const canEdit=hasPerm("edit"); const canDelete=hasPerm("delete"); const canApprove=hasPerm("approve"); const canAdmin=hasPerm("admin");

  const filteredSOPs = sops.filter(s => {
    const q=search.toLowerCase();
    const ms=!q||s.title.toLowerCase().includes(q)||s.content?.toLowerCase().includes(q)||s.tags?.some(t=>t.toLowerCase().includes(q));
    return ms&&(filterDept==="all"||s.department===filterDept)&&(filterCat==="all"||s.category===filterCat)&&(filterStatus==="all"||s.status===filterStatus);
  });

  const saveSOP = async sop => {
    const exists=sops.find(s=>s.id===sop.id); let upd;
    if(exists){upd=sops.map(s=>s.id===sop.id?{...sop,updatedAt:new Date().toISOString(),updatedBy:currentUser?.name}:s);}
    else{upd=[...sops,{...sop,id:genId(),createdAt:new Date().toISOString(),createdBy:currentUser?.name,updatedAt:new Date().toISOString(),updatedBy:currentUser?.name}];}
    await persistSops(upd); showToast(exists?"SOP updated and saved":"SOP created and saved");
  };
  const deleteSOP = async function(id) { await dbDeleteSOP(id); await persistSops(sops.filter(function(s) { return s.id !== id; })); setSelectedSOP(null); showToast("SOP deleted","info"); };

  const generateTemplate = () => {
    if(!aiPrompt.trim()){showToast("Enter a description","error");return;}
    var dept = newSOP.department;
    var cat = newSOP.category;
    var topic = aiPrompt.trim();
    var title = topic.charAt(0).toUpperCase() + topic.slice(1);
    var deptContext = {
      "Banquets & Catering": { leader: "Banquets Director", team: "banquets and catering", kpi: "event setup accuracy, timing adherence, guest satisfaction scores", tools: "BEO (Banquet Event Order), event management system, POS", examples: "event setup, breakdown, F&B service timing, AV coordination" },
      "Concierge": { leader: "Chief Concierge", team: "concierge", kpi: "guest request fulfillment rate, response time, upsell revenue", tools: "concierge software, PMS, local vendor database", examples: "restaurant reservations, transportation, local recommendations, VIP arrangements" },
      "Culinary": { leader: "Executive Chef", team: "culinary/kitchen", kpi: "food cost percentage, prep time adherence, health inspection scores, plate consistency", tools: "kitchen display system, recipe management, inventory system, HACCP logs", examples: "mise en place, station setup, plating standards, allergen protocols" },
      "Engineering": { leader: "Chief Engineer", team: "engineering and maintenance", kpi: "work order completion rate, PM compliance, energy consumption, response time", tools: "CMMS (work order system), BMS, energy management system", examples: "preventive maintenance, HVAC operations, life safety checks, room repair" },
      "Front Office": { leader: "Front Office Manager", team: "front desk and reservations", kpi: "check-in time, upsell conversion, guest satisfaction, queue wait time", tools: "PMS (Opera/Fosse), key system, CRM, payment terminal", examples: "guest check-in/out, room assignment, VIP arrivals, night audit" },
      "Guest Services (Door & Luggage)": { leader: "Bell Captain", team: "bell, door, and valet", kpi: "luggage delivery time, first impression scores, car retrieval time", tools: "luggage tracking system, valet ticket system, radio communication", examples: "guest arrival greeting, luggage handling, room escort, taxi/car service" },
      "Housekeeping": { leader: "Executive Housekeeper", team: "housekeeping and laundry", kpi: "rooms cleaned per shift, inspection pass rate, turnover time, guest complaint rate", tools: "housekeeping management system, PMS, lost & found log", examples: "room cleaning, turndown service, deep cleaning, laundry operations" },
      "In Room Dining": { leader: "IRD Manager", team: "in-room dining", kpi: "order delivery time, tray retrieval rate, average check, guest satisfaction", tools: "POS system, order management, PMS integration", examples: "order taking, tray setup, delivery protocol, tray retrieval" },
      "Restaurants & Bars": { leader: "Outlet Manager", team: "restaurant and bar service", kpi: "covers per shift, average check, table turn time, pour cost", tools: "POS system, reservation system, inventory management", examples: "table service, bar operations, opening/closing, wine service" },
      "Security": { leader: "Director of Security", team: "security", kpi: "incident response time, patrol completion rate, false alarm rate", tools: "CCTV system, access control, incident reporting system", examples: "patrol routes, incident response, key control, emergency evacuation" },
      "Spa & Pools": { leader: "Spa Director", team: "spa and recreation", kpi: "treatment utilization, retail per treatment, rebooking rate", tools: "spa management software, booking system, POS", examples: "treatment room setup, guest consultation, pool safety, chemical testing" },
      "Valet Parking": { leader: "Valet Manager", team: "valet parking", kpi: "car retrieval time, damage incident rate, ticket accuracy", tools: "valet management system, key storage, damage documentation", examples: "vehicle receiving, parking procedures, key management, retrieval process" },
    };
    var ctx = deptContext[dept] || { leader: dept + " Manager", team: dept.toLowerCase(), kpi: "compliance rate, guest satisfaction, response time", tools: "PMS, department system", examples: "daily operations, quality checks" };
    var catExtra = "";
    if (cat === "checklists") { catExtra = "\n\n## Checklist\n\n- [ ] [Specific action for " + topic.toLowerCase() + "]\n- [ ] [Next action]\n- [ ] [Verification step]\n- [ ] [Documentation step]\n- [ ] [Handoff/communication step]\n- [ ] Supervisor sign-off obtained"; }
    else if (cat === "safety") { catExtra = "\n\n## Emergency Procedures\n\n1. **Immediate Response** - Secure the area, assess for injuries, call for help\n2. **Notification Chain** - Notify " + ctx.leader + ", MOD, Security, GM\n3. **Documentation** - Complete incident report within 1 hour\n4. **Follow-Up** - Debrief within 24 hours, implement corrective actions"; }
    else if (cat === "onboarding") { catExtra = "\n\n## Training Timeline\n\n- **Day 1**: Department orientation, safety briefing, system access\n- **Day 2-3**: Shadow experienced team member, review SOPs\n- **Day 4-5**: Supervised hands-on execution\n- **Week 2**: Independent execution with spot-checks\n- **Day 30**: Competency assessment\n- **Day 90**: Full performance review"; }
    else if (cat === "audit") { catExtra = "\n\n## Audit Criteria\n\n| Item | Standard | Score (1-5) |\n| --- | --- | --- |\n| [Criterion 1] | [Expected standard] | |\n| [Criterion 2] | [Expected standard] | |\n\n## Audit Frequency\n\n- Self-audit: Daily by team leads\n- Department audit: Weekly by " + ctx.leader + "\n- Corporate audit: Quarterly\n- Brand audit: Per brand schedule"; }
    // Resolve brand context
    var brandKey = newSOP.brand || "HHM";
    var brandData = BRANDS[brandKey] || BRANDS["HHM"];
    var subBrandData = null;
    if (newSOP.subBrand && brandData.subs) {
      subBrandData = brandData.subs.find(function(s) { return s.id === newSOP.subBrand; });
    }
    var brandName = subBrandData ? subBrandData.label : brandData.label;
    var brandTone = subBrandData ? subBrandData.tone : brandData.tone;
    var brandProgram = subBrandData ? subBrandData.program : brandData.program;
    var brandAudit = subBrandData ? subBrandData.audit : brandData.audit;
    var brandService = subBrandData ? subBrandData.service : brandData.service;
    var brandFocus = subBrandData ? subBrandData.focus : "";
    var brandTier = subBrandData ? subBrandData.tier : "";
    var isHHM = brandKey === "HHM";

    var brandSection = "";
    if (!isHHM) {
      brandSection = "\n\n## Brand Context: " + brandName + "\n\n" +
        "**Brand Positioning**: " + brandTone + "\n" +
        "**Service Promise**: " + brandService + "\n" +
        (brandTier ? "**Tier**: " + brandTier + "\n" : "") +
        "**Quality Program**: " + brandProgram + "\n" +
        "**Audit Framework**: " + brandAudit + "\n" +
        (brandFocus ? "\n**Brand Focus Areas**: " + brandFocus + "\n" : "") +
        "\nAll procedures in this SOP must align with " + brandName + " brand standards. Where HHM operational standards and " + brandName + " brand standards overlap, the **stricter standard applies**.";
    }

    var orgName = isHHM ? "HHM Hotels" : brandName + " (managed by HHM Hotels)";
    var standardsRef = isHHM ? "HHM quality standards" : brandName + " brand standards";
    var serviceModel = isHHM ? "HHM service model: anticipate, acknowledge, deliver, follow up" : brandName + " service standards: " + brandService;
    var auditRef = isHHM ? "HHM internal audit" : brandAudit;

    var t = "## Purpose\n\nThis SOP establishes requirements for **" + title + "** within " + dept + " at " + orgName + ". It ensures consistent, brand-standard execution delivering exceptional guest experiences while maintaining operational efficiency." + brandSection + "\n\n## Scope\n\nApplies to all " + ctx.team + " team members, supervisors, and managers at " + orgName + " properties. Governs the complete process for " + topic.toLowerCase() + " including preparation, execution, quality verification, and documentation.\n\n**Related Systems**: " + ctx.tools + "\n\n## Responsibilities\n\n- **General Manager**: Resource allocation, compliance oversight, escalation point\n- **" + ctx.leader + "**: Implementation, scheduling, training, performance coaching, quality audits\n- **" + dept + " Supervisors/Leads**: Shift execution monitoring, real-time coaching, pre-shift briefings\n- **" + dept + " Team Members**: Execute all procedures per this SOP to " + standardsRef + "\n- **Quality Standards Manager**: SOP version control, " + auditRef + " compliance\n\n## Procedure\n\n### Pre-Shift Preparation\n\n1. **Review Daily Priorities** - Check PMS/system for arrivals, departures, VIPs, special requests relevant to " + topic.toLowerCase() + "\n2. **Inspect Equipment & Supplies** - Verify all tools, supplies, and equipment are available and in working condition\n3. **Conduct Pre-Shift Briefing** - Review assignments, highlight VIP/special requirements, communicate property alerts\n4. **Confirm Standards** - Ensure team understands the expected " + standardsRef + " for today's execution\n\n### Core Execution\n\n5. **Begin " + title + "** - Execute following the sequence below:\n   - Step A: [Define first specific action - e.g., " + ctx.examples.split(", ")[0] + "]\n   - Step B: [Define second action - e.g., " + ctx.examples.split(", ")[1] + "]\n   - Step C: [Define third action - e.g., " + (ctx.examples.split(", ")[2] || "quality verification") + "]\n   - Step D: [Define quality checkpoint]\n6. **Maintain Communication** - Coordinate with related departments via radio/system as needed\n7. **Handle Exceptions** - Document any deviation and escalate to supervisor within 15 minutes\n\n### Quality Verification\n\n8. **Self-Inspect** - Team member self-checks against " + standardsRef + " before marking complete\n9. **Supervisor Spot-Check** - Supervisor inspects minimum 20% of completed work each shift\n10. **Document Results** - Log completion status, deficiencies, and corrective actions\n\n### Post-Shift\n\n11. **Shift Handoff** - Brief incoming team on completed work, pending items, and special requirements\n12. **Restock & Reset** - Ensure supplies restocked, work areas organized for next shift\n13. **Update Records** - Complete all documentation and system updates before end of shift\n\n## Key Performance Indicators\n\n- " + ctx.kpi.split(", ").join("\n- ") + "\n- Minimum **95% compliance** on weekly quality audits\n- All exceptions documented and resolved within **4 hours**\n- Zero repeat deficiencies on consecutive " + auditRef + " cycles\n\n## Quality Standards\n\n- All guest-facing areas meet " + standardsRef + " at all times\n- Work completed within property SLA timeframes\n- Guest interactions follow " + serviceModel + "\n- Photo documentation required for any deficiency or maintenance issue\n- Equipment maintained per manufacturer specs and preventive maintenance schedules" + (brandFocus ? "\n\n**" + brandName + " Specific Standards**:\n- " + brandFocus.split(", ").join("\n- ") : "") + "\n\n## Training Requirements\n\n- New hires: SOP review and supervised practicum within first **5 business days**\n- All staff: Annual refresher with competency verification\n- Updated training within **48 hours** of any SOP revision\n- " + (isHHM ? "Department certifications as required" : brandName + " brand certification and department certifications as required") + "\n\n## Compliance & Documentation\n\n- Effective upon approval by " + ctx.leader + " and General Manager\n- Must pass " + auditRef + " assessment\n- Team acknowledgment within **7 calendar days**\n- Deviations require written approval from " + ctx.leader + " or GM\n- Record retention: Minimum **12 months**\n- Review cycle: **Quarterly** by " + ctx.leader + ", annual by Corporate Standards\n\n## Revision History\n\n| Version | Date | Author | Changes |\n| --- | --- | --- | --- |\n| 1.0 | " + new Date().toLocaleDateString() + " | [Author] | Initial version |" + catExtra + "\n\n---\n*Generated for " + dept + " at " + orgName + ". Customize all [bracketed sections] with property-specific details.*";
    setNewSOP(function(p) { return Object.assign({}, p, { content: t, title: p.title || title + " - SOP" }); });
    showToast("SOP template generated for " + dept);
  };
  const resetNew = () => setNewSOP({title:"",department:"Housekeeping",category:"standards",content:"",priority:"medium",status:"draft",tags:"",roles:[],property:"",region:"",version:"1.0",brand:"HHM",subBrand:""});

  if(showLogin) return <div style={{...S.rolePage,padding:isMobile?16:24,overflow:"auto",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <style>{"" + FONTS + ""+MOBILE_CSS+"input,select,textarea{font-size:16px !important;-webkit-appearance:none;}"}</style>
    {toast&&<div style={{...S.toast,background:toast.type==="error"?HHM.danger:toast.type==="info"?HHM.navy:HHM.success,left:isMobile?16:"auto",right:isMobile?16:20}}>{toast.msg}</div>}
    <div style={{...S.roleInner,paddingBottom:40}}>
      <div style={S.roleLogoArea}><HHMLogo size={isMobile?60:80}/><div style={S.roleHr}/><p style={{...S.rolePlatformName,fontSize:isMobile?11:14}}>SOP Management Platform</p></div>
      <div style={{background:"#001E42",borderRadius:12,padding:isMobile?20:32,maxWidth:420,margin:"0 auto",border:"1px solid #1E3A5F"}}>
        <h3 style={{color:HHM.white,margin:"0 0 6px",fontSize:18,fontWeight:700}}>Sign In</h3>
        <p style={{color:"#7BA3C4",fontSize:13,margin:"0 0 24px"}}>Sign in with your organization Google account.</p>

        {loginError && <div style={{background:"#DC262618",border:"1px solid #DC262644",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#DC2626"}}>{loginError}</div>}

        {/* Google SSO Button */}
        <button type="button" style={{width:"100%",minHeight:52,padding:"14px 22px",borderRadius:8,border:"1px solid #2A4A6F",background:"#FFFFFF",color:"#333",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:12,WebkitAppearance:"none",WebkitTapHighlightColor:"transparent",touchAction:"manipulation",opacity:ssoLoading?0.6:1}} onClick={handleGoogleSSO} disabled={ssoLoading}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {ssoLoading ? "Redirecting..." : "Sign in with Google"}
        </button>

        <p style={{color:"#3A5A7A",fontSize:11,margin:"20px 0 0",textAlign:"center"}}>Your Google email must be registered by a Security Admin before you can access the platform.</p>

        {/* Admin Backdoor Toggle */}
        <div style={{borderTop:"1px solid #1E3A5F",marginTop:20,paddingTop:16}}>
          <button type="button" style={{background:"none",border:"none",color:"#3A5A7A",fontSize:11,cursor:"pointer",fontFamily:"inherit",padding:0,textDecoration:"underline"}} onClick={function(){setShowAdminLogin(!showAdminLogin);setLoginError("");}}>
            {showAdminLogin ? "Hide admin login" : "Administrator access"}
          </button>

          {showAdminLogin && <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <label style={{display:"block",fontSize:11,color:"#5A8AAE",marginBottom:4,fontWeight:600}}>ADMIN USERNAME</label>
              <input type="text" style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid #1E3A5F",background:"#001228",color:"#C8DAE8",fontSize:16,fontFamily:"inherit",outline:"none",boxSizing:"border-box",WebkitAppearance:"none"}} placeholder="Admin username" value={loginName} onChange={function(e){setLoginName(e.target.value);setLoginError("");}} autoComplete="username" autoCorrect="off" autoCapitalize="off" />
            </div>
            <div>
              <label style={{display:"block",fontSize:11,color:"#5A8AAE",marginBottom:4,fontWeight:600}}>ADMIN PASSWORD</label>
              <input type="password" style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid #1E3A5F",background:"#001228",color:"#C8DAE8",fontSize:16,fontFamily:"inherit",outline:"none",boxSizing:"border-box",WebkitAppearance:"none"}} placeholder="Password" value={loginPass} onChange={function(e){setLoginPass(e.target.value);setLoginError("");}} autoComplete="current-password" onKeyDown={function(e){if(e.key==="Enter"){e.preventDefault();handleLogin();}}} />
            </div>
            <button type="button" style={{width:"100%",minHeight:44,padding:"10px 22px",borderRadius:8,border:"1px solid #1E3A5F",background:"transparent",color:"#7BA3C4",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",WebkitAppearance:"none",touchAction:"manipulation",opacity:loginLoading?0.6:1}} onClick={function(){handleLogin();}} disabled={loginLoading}>{loginLoading?"Signing in...":"Admin Sign In"}</button>
          </div>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:20}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:dbStatus==="connected"?HHM.success:dbStatus==="error"?HHM.danger:HHM.warning}}/>
        <span style={{fontSize:11,color:"#5A8AAE"}}>{dbStatus==="connected"?"Supabase Connected":dbStatus==="memory"?"In-Memory (session only)":"Connecting..."}</span>
      </div>
      <div style={{marginTop:8,fontSize:10,color:"#3A5A7A",textAlign:"center",lineHeight:1.6}}>
        <div>ENV: {import.meta.env.VITE_SUPABASE_URL ? "URL set" : "URL MISSING"} | {import.meta.env.VITE_SUPABASE_ANON_KEY ? "KEY set" : "KEY MISSING"}</div>
        <div>Users loaded: {users.length} | DB: {dbStatus}</div>
      </div>
      <p style={S.roleFooter}>HHM Hotels - Hersha Hospitality Management</p>
    </div>
  </div>;

  const stats={total:sops.length,approved:sops.filter(s=>s.status==="approved").length,draft:sops.filter(s=>s.status==="draft").length,review:sops.filter(s=>s.status==="review").length};
  const deptCounts=DEPARTMENTS.reduce((a,d)=>{a[d]=sops.filter(s=>s.department===d).length;return a;},{});

  return <div className="hhm-app" style={{...S.app,flexDirection:isMobile?"column":"row"}}>
    <style>{"" + FONTS + ""+MOBILE_CSS}</style>
    {toast&&<div style={{...S.toast,background:toast.type==="error"?HHM.danger:toast.type==="info"?HHM.navy:HHM.success,left:isMobile?16:"auto",right:isMobile?16:20,fontSize:isMobile?13:14}}>{toast.msg}</div>}

    {/* Sidebar / Mobile Nav */}
    {isMobile ? (
      <div style={{background:HHM.navyDark,display:"flex",alignItems:"center",padding:"10px 12px",gap:8,borderBottom:"1px solid #0D2E4D",overflow:"auto"}}>
        <HHMLogo size={32}/>
        <div style={{display:"flex",gap:4,flex:1}}>
          {[{id:"dashboard",icon:"\u{1F4CA}",label:"Home"},{id:"library",icon:"\u{1F4DA}",label:"Library"},...(canCreate?[{id:"create",icon:"\u2728",label:"New"}]:[]),...(hasPerm("audit")?[{id:"audits",icon:"\u{1F50D}",label:"Audits"}]:[]),...(hasPerm("report")?[{id:"reports",icon:"\u{1F4C8}",label:"Reports"}]:[]),...(canAdmin?[{id:"settings",icon:"\u2699\uFE0F",label:"Admin"}]:[])].map(item=>
            <button key={item.id} style={{...S.sideNavItem,padding:"8px 12px",fontSize:12,borderRadius:20,...(view===item.id?{background:HHM.gold+"30",color:"#7BB8F0",fontWeight:700}:{})}} onClick={()=>{setView(item.id);setSelectedSOP(null);setEditMode(false);if(item.id==="create")resetNew();}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          )}
        </div>
        <button style={{...S.sideSwitch,fontSize:10,padding:"4px 10px"}} onClick={logout}>Logout</button>
      </div>
    ) : (
      <div style={{...S.sidebar,width:sidebarOpen?264:64,minWidth:sidebarOpen?264:64}}>
        <div style={S.sideHead}><HHMLogo size={sidebarOpen?52:36}/>{sidebarOpen&&<span style={S.sideBrandSub}>SOP Platform</span>}<button style={S.sideToggle} onClick={()=>setSidebarOpen(!sidebarOpen)}>{sidebarOpen?"\u25C2":"\u25B8"}</button></div>
        {sidebarOpen&&<div style={S.sideRoleBadge}><div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}><span style={{fontSize:18}}>{RI[userRole?.icon]||"\u{1F464}"}</span><div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:HHM.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser?.name}</div><div style={{fontSize:11,color:"#7B9CC0"}}>{userRole?.label}</div></div></div><button style={S.sideSwitch} onClick={logout}>Logout</button></div>}
        <nav style={S.sideNav}>
          {[{id:"dashboard",icon:"\u{1F4CA}",label:"Dashboard"},{id:"library",icon:"\u{1F4DA}",label:"SOP Library"},...(canCreate?[{id:"create",icon:"\u2728",label:"Create SOP"}]:[]),...(hasPerm("audit")?[{id:"audits",icon:"\u{1F50D}",label:"Audits"}]:[]),...(hasPerm("report")?[{id:"reports",icon:"\u{1F4C8}",label:"Reports"}]:[]),...(canAdmin?[{id:"settings",icon:"\u2699\uFE0F",label:"Settings"}]:[])].map(item=>
            <button key={item.id} style={{...S.sideNavItem,...(view===item.id?S.sideNavActive:{})}} onClick={()=>{setView(item.id);setSelectedSOP(null);setEditMode(false);if(item.id==="create")resetNew();}}>
              <span style={S.sideNavIcon}>{item.icon}</span>{sidebarOpen&&<span>{item.label}</span>}
            </button>
          )}
        </nav>
        {sidebarOpen&&<div style={S.sideDepts}><div style={S.sideDeptTitle}>DEPARTMENTS</div>{DEPARTMENTS.map(d=> <button key={d} style={{...S.sideDeptItem,...(filterDept===d?{background:HHM.gold+"20",color:"#7BB8F0"}:{})}} onClick={()=>{setFilterDept(filterDept===d?"all":d);setView("library");}}><span>{d}</span><span style={S.sideDeptCount}>{deptCounts[d]||0}</span></button>)}</div>}
        {sidebarOpen&&<div style={S.sideFooter}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:6}}><div style={{width:8,height:8,borderRadius:"50%",background:dbStatus==="connected"?HHM.success:dbStatus==="memory"?HHM.warning:HHM.danger}}/><span style={{fontSize:11,color:"#5A8AAE"}}>{dbStatus==="connected"?"DB Connected":dbStatus==="memory"?"In-Memory":"DB Offline"}</span></div><div style={{fontSize:10,color:"#4A6A8A",letterSpacing:1.5,textTransform:"uppercase"}}>HHM Hotels</div></div>}
      </div>
    )}

    <div style={S.main}>
      <div className="hhm-topbar" style={{...S.topBar,padding:isMobile?"10px 12px":"12px 28px",gap:isMobile?8:12}}>
        <div style={{...S.searchWrap,minWidth:isMobile?120:200}}><svg style={S.searchSvg} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg><input style={{...S.searchInput,fontSize:isMobile?13:14}} placeholder="Search SOPs..." value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setView("library");}}/></div>
        <div style={{...S.topFilters,gap:isMobile?4:8}}>
          {!isMobile&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,background:dbStatus==="connected"?HHM.goldLight:"#FEF2F2",border:"1px solid "+(dbStatus==="connected"?"#A7F3D0":"#FECACA"),fontSize:11,fontWeight:600,color:dbStatus==="connected"?"#065F46":"#991B1B"}}><div style={{width:7,height:7,borderRadius:"50%",background:dbStatus==="connected"?HHM.success:dbStatus==="memory"?HHM.warning:HHM.danger}}/>{dbStatus==="connected"?"DB Synced":dbStatus==="memory"?"In-Memory":"DB Offline"}</div>}
          <select style={{...S.filterSel,padding:isMobile?"6px 8px":"8px 14px",fontSize:isMobile?12:13}} value={filterCat} onChange={e=>setFilterCat(e.target.value)}><option value="all">All Categories</option>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon+" "+c.label}</option>)}</select>
          <select style={{...S.filterSel,padding:isMobile?"6px 8px":"8px 14px",fontSize:isMobile?12:13}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="all">All Status</option>{Object.entries(STATUS_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
        </div>
      </div>

      {view==="dashboard"&&!selectedSOP&&<div className="hhm-content" style={{...S.content,padding:isMobile?"16px":"28px 32px"}}>
        <div className="hhm-dash-hero" style={{...S.dashHero,padding:isMobile?"16px":"24px 28px",flexDirection:isMobile?"column":"row",alignItems:isMobile?"flex-start":"center"}}><div><h2 style={{...S.dashTitle,fontSize:isMobile?18:22}}>Welcome, {currentUser?.name}</h2><p style={S.dashSub}>HHM Hotels - {userRole?.label}</p></div>{canCreate&&<button style={{...S.btnPrimary,background:HHM.warmWhite,color:HHM.navy,fontWeight:700,width:isMobile?"100%":"auto",marginTop:isMobile?8:0}} onClick={()=>{setView("create");resetNew();}}>+ Create SOP</button>}</div>
        <div className="hhm-stats-row" style={{...S.statsRow,gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(160px,1fr))"}}>
          {[{label:"Total SOPs",val:stats.total,color:HHM.navy,bg:HHM.goldLight},{label:"Approved",val:stats.approved,color:HHM.success,bg:HHM.goldLight},{label:"In Review",val:stats.review,color:HHM.review,bg:"#E8E0F0"},{label:"Drafts",val:stats.draft,color:HHM.gray400,bg:HHM.gray50}].map((s,i)=><div key={i} style={{...S.statCard,background:s.bg,padding:isMobile?"14px 12px":"20px 18px"}}><div style={{...S.statVal,color:s.color,fontSize:isMobile?24:30}}>{s.val}</div><div style={S.statLabel}>{s.label}</div></div>)}
        </div>
        <h3 style={S.sectionTitle}>Categories</h3>
        <div className="hhm-cat-grid" style={{...S.catGrid,gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(150px,1fr))"}}>{CATEGORIES.map(c=>{const n=sops.filter(s=>s.category===c.id).length;return <button key={c.id} style={{...S.catCard,padding:isMobile?"12px 8px":"18px 14px"}} onClick={()=>{setFilterCat(c.id);setView("library");}}><span style={{fontSize:isMobile?22:26}}>{c.icon}</span><span style={{...S.catLabel,fontSize:isMobile?11:13}}>{c.label}</span><span style={S.catCount}>{n}</span></button>;})}</div>
        <h3 style={S.sectionTitle}>Recent</h3>
        {sops.length===0?<div style={S.emptyState}><p style={{color:HHM.gray400}}>No SOPs yet.</p>{canCreate&&<button style={S.btnPrimary} onClick={()=>{setView("create");resetNew();}}>+ Create First SOP</button>}</div>
        :<div style={S.sopList}>{[...sops].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,5).map(s=><SOPRow key={s.id} sop={s} onClick={()=>{setSelectedSOP(s);setView("library");setEditMode(false);}}/>)}</div>}
      </div>}

      {view==="library"&&!selectedSOP&&<div className="hhm-content" style={{...S.content,padding:isMobile?"16px":"28px 32px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}><div><h2 style={{...S.pageTitle,fontSize:isMobile?18:22}}>SOP Library</h2><p style={S.pageSub}>{filteredSOPs.length} result{filteredSOPs.length!==1?"s":""}{filterDept!=="all"?" in "+filterDept:""}</p></div>{canCreate&&<button style={{...S.btnPrimary,width:isMobile?"100%":"auto"}} onClick={()=>{setView("create");resetNew();}}>+ Create SOP</button>}</div>
        {filteredSOPs.length===0?<div style={S.emptyState}><p style={{color:HHM.gray400}}>No SOPs match filters.</p><button style={S.btnSecondary} onClick={()=>{setSearch("");setFilterDept("all");setFilterCat("all");setFilterStatus("all");}}>Clear Filters</button></div>
        :<div style={S.sopList}>{filteredSOPs.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).map(s=><SOPRow key={s.id} sop={s} onClick={()=>{setSelectedSOP(s);setEditMode(false);}}/>)}</div>}
      </div>}

      {selectedSOP&&<div className="hhm-content" style={{...S.content,padding:isMobile?"16px":"28px 32px"}}><button style={S.backBtn} onClick={()=>{setSelectedSOP(null);setEditMode(false);}}>Back to Library</button><SOPDetail sop={selectedSOP} editMode={editMode} setEditMode={setEditMode} canEdit={canEdit} canDelete={canDelete} canApprove={canApprove} onSave={async u=>{await saveSOP(u);setSelectedSOP(u);setEditMode(false);}} onDelete={()=>deleteSOP(selectedSOP.id)} onStatusChange={async st=>{const u={...selectedSOP,status:st};await saveSOP(u);setSelectedSOP(u);}} userName={currentUser?.name} isMobile={isMobile}/></div>}

      {view==="create"&&!selectedSOP&&<div className="hhm-content" style={{...S.content,padding:isMobile?"16px":"28px 32px"}}>
        <h2 style={{...S.pageTitle,fontSize:isMobile?18:22}}>Create New SOP</h2>
        <div className="hhm-create-form" style={{...S.createForm,padding:isMobile?16:28}}>
          <div className="hhm-ai-box" style={{...S.aiBox,padding:isMobile?16:24}}>
            <div style={S.aiHeader}><div style={S.aiIconCircle}>{"\u2728"}</div><div><div style={S.aiTitle}>SOP Generator</div><div style={S.aiDesc}>Describe what you need to generate a template, or copy a prompt for the chat.</div></div></div>
            <div className="hhm-ai-btns" style={{display:"flex",gap:10,marginTop:14,flexDirection:isMobile?"column":"row"}}>
              <input style={S.aiInput} placeholder='e.g. "VIP check-in with butler service"' value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")generateTemplate();}}/>
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.btnPrimary,minWidth:isMobile?0:130,flex:isMobile?1:undefined}} onClick={generateTemplate}>Generate</button>
                <button style={{background:"#1E3A5F",color:"#7BB8F0",border:"1px solid #2E4A6F",borderRadius:8,padding:"10px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}} onClick={()=>{if(!aiPrompt.trim()){showToast("Enter a description","error");return;}navigator.clipboard.writeText("Generate a detailed hospitality SOP for HHM Hotels: "+aiPrompt+" | Dept: "+newSOP.department+" | Use ## headers, numbered steps, bold key terms.").then(()=>showToast("Prompt copied")).catch(()=>showToast("Copy failed","error"));}}>Copy</button>
              </div>
            </div>
          </div>

          {/* Import from Word */}
          <div style={{background:HHM.gray50,borderRadius:10,border:"1px dashed "+HHM.gray200,padding:16,marginBottom:20,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:14,fontWeight:600,color:HHM.navy}}>Import from Word</div>
              <div style={{fontSize:12,color:HHM.gray400,marginTop:2}}>Upload a .docx file to import its content into the SOP editor.</div>
            </div>
            <label style={{...S.btnSecondary,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
              <span>Choose .docx File</span>
              <input type="file" accept=".docx,.doc" style={{display:"none"}} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                showToast("Importing...", "info");
                try {
                  const text = await importFromWord(file);
                  if (text.trim()) {
                    setNewSOP(p => ({...p, content: text, title: p.title || file.name.replace(/\.(docx?|doc)$/i, "").replace(/[_-]/g, " ")}));
                    showToast("Document imported - review and edit the content below");
                  } else {
                    showToast("Document was empty or could not be parsed", "error");
                  }
                } catch (err) {
                  showToast("Import failed: " + (err.message || "unknown error"), "error");
                }
                e.target.value = "";
              }} />
            </label>
          </div>

          <div className="hhm-form-grid" style={{...S.formGrid,gridTemplateColumns:isMobile?"1fr":"1fr 1fr"}}>
            <FG label="Title *"><input style={S.formInput} value={newSOP.title} onChange={e=>setNewSOP({...newSOP,title:e.target.value})} placeholder="SOP Title"/></FG>
            <FG label="Department *"><select style={S.formInput} value={newSOP.department} onChange={e=>setNewSOP({...newSOP,department:e.target.value})}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></FG>
            <FG label="Brand *"><select style={S.formInput} value={newSOP.brand} onChange={e=>setNewSOP({...newSOP,brand:e.target.value,subBrand:""})}>{Object.keys(BRANDS).map(b=><option key={b} value={b}>{BRANDS[b].label}</option>)}</select></FG>
            <FG label="Sub-Brand"><select style={S.formInput} value={newSOP.subBrand} onChange={e=>setNewSOP({...newSOP,subBrand:e.target.value})}><option value="">-- Select Sub-Brand --</option>{(BRANDS[newSOP.brand]?.subs||[]).map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></FG>
            <FG label="Category *"><select style={S.formInput} value={newSOP.category} onChange={e=>setNewSOP({...newSOP,category:e.target.value})}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon+" "+c.label}</option>)}</select></FG>
            <FG label="Priority"><select style={S.formInput} value={newSOP.priority} onChange={e=>setNewSOP({...newSOP,priority:e.target.value})}>{Object.entries(PRIORITY_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></FG>
            <FG label="Property"><input style={S.formInput} value={newSOP.property} onChange={e=>setNewSOP({...newSOP,property:e.target.value})} placeholder="e.g. The Rittenhouse"/></FG>
            <FG label="Region"><input style={S.formInput} value={newSOP.region} onChange={e=>setNewSOP({...newSOP,region:e.target.value})} placeholder="e.g. Northeast"/></FG>
            <FG label="Version"><input style={S.formInput} value={newSOP.version} onChange={e=>setNewSOP({...newSOP,version:e.target.value})}/></FG>
            <FG label="Tags"><input style={S.formInput} value={newSOP.tags} onChange={e=>setNewSOP({...newSOP,tags:e.target.value})} placeholder="comma-separated"/></FG>
          </div>
          <FG label="Content *"><textarea style={S.formTextarea} rows={16} value={newSOP.content} onChange={e=>setNewSOP({...newSOP,content:e.target.value})} placeholder="Write or generate SOP content..."/></FG>
          <div style={{display:"flex",gap:12,justifyContent:"flex-end",paddingTop:8}}>
            <button style={S.btnSecondary} onClick={()=>setView("dashboard")}>Cancel</button>
            <button style={S.btnPrimary} onClick={async()=>{if(!newSOP.title.trim()||!newSOP.content.trim()){showToast("Title and content required","error");return;}await saveSOP({...newSOP,tags:typeof newSOP.tags==="string"?newSOP.tags.split(",").map(t=>t.trim()).filter(Boolean):newSOP.tags,roles:newSOP.roles?.length?newSOP.roles:roles.map(r=>r.id)});setView("library");resetNew();}}>Save SOP</button>
          </div>
        </div>
      </div>}

      {/* ─── Audits ─── */}
      {view==="audits"&&<div className="hhm-content" style={{...S.content,padding:isMobile?"16px":"28px 32px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <div><h2 style={S.pageTitle}>Audits</h2><p style={S.pageSub}>{auditView==="list"?"Completed audits and new inspections":auditView==="conduct"?"Conducting audit":auditView==="templates"?"Manage audit templates":"Create new template"}</p></div>
          <div style={{display:"flex",gap:8}}>
            {auditView!=="list"&&<button style={S.btnSecondary} onClick={()=>{setAuditView("list");setActiveAudit(null);}}>Back to Audits</button>}
            {auditView==="list"&&<button style={S.btnSecondary} onClick={()=>setAuditView("templates")}>Templates</button>}
            {auditView==="list"&&<button style={S.btnPrimary} onClick={()=>{
              setActiveAudit({id:genId(),type:"sop",sopId:"",templateId:"",property:"",department:"",auditor:currentUser?.name||"",date:new Date().toISOString().slice(0,10),items:[],notes:"",score:0,status:"in-progress"});
              setAuditView("conduct");
            }}>+ New Audit</button>}
            {auditView==="templates"&&<button style={S.btnPrimary} onClick={()=>{
              setActiveAudit({id:genId(),templateName:"",department:"Housekeeping",items:[{id:genId(),label:"",weight:1}]});
              setAuditView("newtemplate");
            }}>+ New Template</button>}
          </div>
        </div>

        {/* Audit List */}
        {auditView==="list"&&<div>
          {audits.length===0?<div style={S.emptyState}><p style={{color:HHM.gray400}}>No audits completed yet. Start a new audit to begin.</p></div>
          :<div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[...audits].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(a=> <div key={a.id} style={{background:HHM.warmWhite,borderRadius:10,border:"1px solid "+HHM.gray100,padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:700,color:HHM.navy,fontSize:15}}>{a.title||a.sopTitle||"Audit"}</div>
                  <div style={{fontSize:12,color:HHM.gray400,marginTop:2}}>{a.property||"-"} . {a.department||"-"} . {a.auditor} . {new Date(a.date).toLocaleDateString()}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:a.score>=4?HHM.success:a.score>=3?HHM.warning:HHM.danger}}>{a.score.toFixed(1)}</div><div style={{fontSize:10,color:HHM.gray400}}>/ 5.0</div></div>
                  <button style={{...S.btnDanger,padding:"4px 10px",fontSize:11}} onClick={async function(){if(!confirm("Delete this audit?"))return;await dbDeleteAudit(a.id);await persistAudits(audits.filter(function(x){return x.id!==a.id;}));showToast("Audit deleted","info");}}>Delete</button>
                </div>
              </div>
              {a.items&&a.items.length>0&&<div style={{marginTop:10,display:"flex",gap:4,flexWrap:"wrap"}}>{a.items.map((item,i)=> <div key={i} style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:item.score>=4?HHM.success+"18":item.score>=3?HHM.warning+"18":HHM.danger+"18",color:item.score>=4?HHM.success:item.score>=3?HHM.warning:HHM.danger}}>{item.label}: {item.score}/5</div>)}</div>}
              {a.notes&&<div style={{marginTop:8,fontSize:12,color:HHM.gray500,fontStyle:"italic"}}>{a.notes}</div>}
            </div>)}
          </div>}
        </div>}

        {/* Conduct Audit */}
        {auditView==="conduct"&&activeAudit&&<div style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:isMobile?16:24}}>
          <div className="hhm-form-grid" style={{...S.formGrid,gridTemplateColumns:isMobile?"1fr":"1fr 1fr",marginBottom:20}}>
            <FG label="Audit Type"><select style={S.formInput} value={activeAudit.type} onChange={e=>{
              const t=e.target.value;
              if(t==="sop"){setActiveAudit({...activeAudit,type:t,templateId:"",items:[]});}
              else{setActiveAudit({...activeAudit,type:t,sopId:"",items:[]});}
            }}><option value="sop">Audit against SOP</option><option value="template">Standalone Template</option></select></FG>
            {activeAudit.type==="sop"&&<FG label="Select SOP *"><select style={S.formInput} value={activeAudit.sopId} onChange={e=>{
              const s=sops.find(x=>x.id===e.target.value);
              if(!s){setActiveAudit({...activeAudit,sopId:"",items:[]});return;}
              const lines=s.content?.split("\n").filter(l=>/^\d+\.\s/.test(l))||[];
              const items=lines.map((l,i)=>({id:genId(),label:l.replace(/^\d+\.\s\*\*(.+?)\*\*.*/,"$1").replace(/^\d+\.\s/,""),score:3,notes:""}));
              setActiveAudit({...activeAudit,sopId:s.id,sopTitle:s.title,department:s.department,items:items.length?items:[{id:genId(),label:"General Compliance",score:3,notes:""}]});
            }}><option value="">-- Select SOP --</option>{sops.filter(s=>s.status==="approved").map(s=> <option key={s.id} value={s.id}>{s.title}</option>)}</select></FG>}
            {activeAudit.type==="template"&&<FG label="Select Template *"><select style={S.formInput} value={activeAudit.templateId} onChange={e=>{
              const t=auditTemplates.find(x=>x.id===e.target.value);
              if(!t){setActiveAudit({...activeAudit,templateId:"",items:[]});return;}
              setActiveAudit({...activeAudit,templateId:t.id,title:t.templateName,department:t.department,items:t.items.map(x=>({...x,id:genId(),score:3,notes:""}))});
            }}><option value="">-- Select Template --</option>{auditTemplates.map(t=> <option key={t.id} value={t.id}>{t.templateName}</option>)}</select></FG>}
            <FG label="Property *"><input style={S.formInput} value={activeAudit.property||""} onChange={e=>setActiveAudit({...activeAudit,property:e.target.value})} placeholder="e.g. The Rittenhouse"/></FG>
            <FG label="Department"><input style={S.formInput} value={activeAudit.department||""} onChange={e=>setActiveAudit({...activeAudit,department:e.target.value})}/></FG>
            <FG label="Auditor"><input style={S.formInput} value={activeAudit.auditor||""} onChange={e=>setActiveAudit({...activeAudit,auditor:e.target.value})}/></FG>
            <FG label="Date"><input type="date" style={S.formInput} value={activeAudit.date||""} onChange={e=>setActiveAudit({...activeAudit,date:e.target.value})}/></FG>
          </div>

          {activeAudit.items.length>0&&<div>
            <h4 style={{margin:"0 0 12px",fontSize:14,color:HHM.navy}}>Score Each Item (1-5)</h4>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {activeAudit.items.map((item,idx)=> <div key={item.id} style={{background:HHM.gray50,borderRadius:8,padding:12,border:"1px solid "+HHM.gray100}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontWeight:600,color:HHM.navy,fontSize:13,flex:1}}>{item.label}</span>
                  <div style={{display:"flex",gap:4}}>
                    {[1,2,3,4,5].map(n=> <button key={n} style={{width:32,height:32,borderRadius:8,border:"1px solid "+(item.score===n?HHM.gold:HHM.gray200),background:item.score===n?HHM.gold:HHM.warmWhite,color:item.score===n?HHM.navy:HHM.gray500,fontWeight:700,fontSize:13,cursor:"pointer"}} onClick={()=>{
                      const upd=[...activeAudit.items];upd[idx]={...upd[idx],score:n};setActiveAudit({...activeAudit,items:upd});
                    }}>{n}</button>)}
                  </div>
                </div>
                <input style={{...S.formInput,marginTop:6,width:"100%",boxSizing:"border-box",fontSize:12}} placeholder="Notes for this item..." value={item.notes||""} onChange={e=>{const upd=[...activeAudit.items];upd[idx]={...upd[idx],notes:e.target.value};setActiveAudit({...activeAudit,items:upd});}}/>
              </div>)}
            </div>
          </div>}

          <FG label="Overall Notes"><textarea style={{...S.formTextarea,marginTop:12}} rows={3} value={activeAudit.notes||""} onChange={e=>setActiveAudit({...activeAudit,notes:e.target.value})} placeholder="General observations, recommendations..."/></FG>

          <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:16}}>
            <button style={S.btnSecondary} onClick={()=>{setAuditView("list");setActiveAudit(null);}}>Cancel</button>
            <button style={S.btnPrimary} onClick={async()=>{
              if(!activeAudit.property?.trim()){showToast("Property is required","error");return;}
              if(activeAudit.items.length===0){showToast("Select an SOP or template first","error");return;}
              const avg=activeAudit.items.reduce((s,i)=>s+i.score,0)/activeAudit.items.length;
              const completed={...activeAudit,score:avg,status:"completed",completedAt:new Date().toISOString()};
              await persistAudits([...audits,completed]);
              setActiveAudit(null);setAuditView("list");showToast("Audit saved! Score: "+avg.toFixed(1)+"/5.0");
            }}>Submit Audit</button>
          </div>
        </div>}

        {/* Templates List */}
        {auditView==="templates"&&<div>
          {auditTemplates.length===0?<div style={S.emptyState}><p style={{color:HHM.gray400}}>No audit templates yet. Create one to use for standalone audits.</p></div>
          :<div style={{display:"flex",flexDirection:"column",gap:10}}>
            {auditTemplates.map(t=> <div key={t.id} style={{background:HHM.warmWhite,borderRadius:10,border:"1px solid "+HHM.gray100,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div><div style={{fontWeight:700,color:HHM.navy}}>{t.templateName}</div><div style={{fontSize:12,color:HHM.gray400}}>{t.department} . {t.items.length} items</div></div>
              <button style={{...S.btnDanger,padding:"4px 10px",fontSize:11}} onClick={async function(){if(!confirm("Delete template?"))return;await dbDeleteTemplate(t.id);await persistTemplates(auditTemplates.filter(function(x){return x.id!==t.id;}));showToast("Template deleted","info");}}>Delete</button>
            </div>)}
          </div>}
        </div>}

        {/* New Template */}
        {auditView==="newtemplate"&&activeAudit&&<div style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:isMobile?16:24}}>
          <div className="hhm-form-grid" style={{...S.formGrid,gridTemplateColumns:isMobile?"1fr":"1fr 1fr",marginBottom:16}}>
            <FG label="Template Name *"><input style={S.formInput} value={activeAudit.templateName||""} onChange={e=>setActiveAudit({...activeAudit,templateName:e.target.value})} placeholder="e.g. Room Inspection Checklist"/></FG>
            <FG label="Department"><select style={S.formInput} value={activeAudit.department||"Housekeeping"} onChange={e=>setActiveAudit({...activeAudit,department:e.target.value})}>{DEPARTMENTS.map(d=> <option key={d}>{d}</option>)}</select></FG>
          </div>
          <h4 style={{margin:"0 0 12px",fontSize:14,color:HHM.navy}}>Checklist Items</h4>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {activeAudit.items.map((item,idx)=> <div key={item.id} style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:12,color:HHM.gray400,minWidth:20}}>{idx+1}.</span>
              <input style={{...S.formInput,flex:1}} value={item.label} onChange={e=>{const upd=[...activeAudit.items];upd[idx]={...upd[idx],label:e.target.value};setActiveAudit({...activeAudit,items:upd});}} placeholder="Checklist item description"/>
              <button style={{background:"none",border:"none",color:HHM.danger,cursor:"pointer",fontSize:16}} onClick={()=>{const upd=activeAudit.items.filter((_,i)=>i!==idx);setActiveAudit({...activeAudit,items:upd});}}>x</button>
            </div>)}
          </div>
          <button style={{...S.btnSecondary,marginTop:10,fontSize:12}} onClick={()=>setActiveAudit({...activeAudit,items:[...activeAudit.items,{id:genId(),label:"",weight:1}]})}>+ Add Item</button>
          <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:16}}>
            <button style={S.btnSecondary} onClick={()=>{setAuditView("templates");setActiveAudit(null);}}>Cancel</button>
            <button style={S.btnPrimary} onClick={async()=>{
              if(!activeAudit.templateName?.trim()){showToast("Template name required","error");return;}
              const items=activeAudit.items.filter(i=>i.label.trim());
              if(items.length===0){showToast("Add at least one item","error");return;}
              await persistTemplates([...auditTemplates,{...activeAudit,items}]);
              setActiveAudit(null);setAuditView("templates");showToast("Template saved");
            }}>Save Template</button>
          </div>
        </div>}
      </div>}

      {/* ─── Reports ─── */}
      {view==="reports"&&<div className="hhm-content" style={{...S.content,padding:isMobile?"16px":"28px 32px"}}>
        <h2 style={S.pageTitle}>Reports & Analytics</h2><p style={S.pageSub}>{audits.length} audit{audits.length!==1?"s":""} across {[...new Set(audits.map(a=>a.property).filter(Boolean))].length} properties</p>
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>{["property","department","trend","activity"].map(tab=> <button key={tab} style={{padding:"8px 20px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:reportTab===tab?HHM.navy:HHM.gray100,color:reportTab===tab?HHM.cream:HHM.gray700}} onClick={()=>setReportTab(tab)}>{tab==="property"?"By Property":tab==="department"?"By Department":tab==="trend"?"Trend Over Time":"Auditor Activity"}</button>)}</div>

        {audits.length===0?<div style={S.emptyState}><p style={{color:HHM.gray400}}>No audit data yet. Complete audits to see reports.</p></div>:<div>

          {/* By Property */}
          {reportTab==="property"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(() => {
              const props = {};
              audits.forEach(a => { const p = a.property || "Unknown"; if (!props[p]) props[p] = []; props[p].push(a.score); });
              const sorted = Object.entries(props).sort((a, b) => (b[1].reduce((s, v) => s + v, 0) / b[1].length) - (a[1].reduce((s, v) => s + v, 0) / a[1].length));
              return sorted.map(([prop, scores]) => {
                const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
                const pct = (avg / 5) * 100;
                return <div key={prop} style={{background:HHM.warmWhite,borderRadius:10,border:"1px solid "+HHM.gray100,padding:"16px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div><span style={{fontWeight:700,color:HHM.navy}}>{prop}</span><span style={{fontSize:12,color:HHM.gray400,marginLeft:8}}>{scores.length} audit{scores.length!==1?"s":""}</span></div>
                    <span style={{fontWeight:800,fontSize:18,color:avg>=4?HHM.success:avg>=3?HHM.warning:HHM.danger}}>{avg.toFixed(1)}</span>
                  </div>
                  <div style={{height:12,background:HHM.gray100,borderRadius:6,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:avg>=4?HHM.success:avg>=3?HHM.warning:HHM.danger,borderRadius:6,transition:"width 0.3s"}}/></div>
                </div>;
              });
            })()}
          </div>}

          {/* By Department */}
          {reportTab==="department"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(() => {
              const depts = {};
              audits.forEach(a => { const d = a.department || "Unknown"; if (!depts[d]) depts[d] = []; depts[d].push(a.score); });
              const sorted = Object.entries(depts).sort((a, b) => (b[1].reduce((s, v) => s + v, 0) / b[1].length) - (a[1].reduce((s, v) => s + v, 0) / a[1].length));
              return sorted.map(([dept, scores]) => {
                const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
                const pct = (avg / 5) * 100;
                return <div key={dept} style={{background:HHM.warmWhite,borderRadius:10,border:"1px solid "+HHM.gray100,padding:"16px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div><span style={{fontWeight:700,color:HHM.navy}}>{dept}</span><span style={{fontSize:12,color:HHM.gray400,marginLeft:8}}>{scores.length} audit{scores.length!==1?"s":""}</span></div>
                    <span style={{fontWeight:800,fontSize:18,color:avg>=4?HHM.success:avg>=3?HHM.warning:HHM.danger}}>{avg.toFixed(1)}</span>
                  </div>
                  <div style={{height:12,background:HHM.gray100,borderRadius:6,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:avg>=4?HHM.success:avg>=3?HHM.warning:HHM.danger,borderRadius:6,transition:"width 0.3s"}}/></div>
                </div>;
              });
            })()}
          </div>}

          {/* Trend Over Time */}
          {reportTab==="trend"&&<div style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:20}}>
            <h4 style={{margin:"0 0 16px",fontSize:14,color:HHM.navy}}>Average Scores Over Time</h4>
            {(() => {
              const byMonth = {};
              audits.forEach(a => { const m = a.date?.slice(0, 7) || "Unknown"; if (!byMonth[m]) byMonth[m] = []; byMonth[m].push(a.score); });
              const months = Object.keys(byMonth).sort();
              const maxH = 200;
              if (months.length === 0) return <p style={{color:HHM.gray400}}>No data</p>;
              return <div>
                <div style={{display:"flex",alignItems:"flex-end",gap:isMobile?4:8,height:maxH+40,paddingTop:20}}>
                  {months.map(m => {
                    const avg = byMonth[m].reduce((s, v) => s + v, 0) / byMonth[m].length;
                    const h = (avg / 5) * maxH;
                    return <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <span style={{fontSize:11,fontWeight:700,color:avg>=4?HHM.success:avg>=3?HHM.warning:HHM.danger}}>{avg.toFixed(1)}</span>
                      <div style={{width:"100%",maxWidth:60,height:h,background:"linear-gradient(180deg,"+HHM.gold+","+HHM.navy+")",borderRadius:"6px 6px 0 0",minHeight:4}}/>
                      <span style={{fontSize:10,color:HHM.gray400,transform:"rotate(-45deg)",whiteSpace:"nowrap"}}>{m}</span>
                    </div>;
                  })}
                </div>
              </div>;
            })()}
          </div>}

          {/* Auditor Activity */}
          {reportTab==="activity"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(() => {
              const byAuditor = {};
              audits.forEach(a => { const name = a.auditor || "Unknown"; if (!byAuditor[name]) byAuditor[name] = { count: 0, scores: [], last: null }; byAuditor[name].count++; byAuditor[name].scores.push(a.score); const d = new Date(a.date); if (!byAuditor[name].last || d > byAuditor[name].last) byAuditor[name].last = d; });
              return Object.entries(byAuditor).sort((a, b) => b[1].count - a[1].count).map(([name, data]) => {
                const avg = data.scores.reduce((s, v) => s + v, 0) / data.scores.length;
                return <div key={name} style={{background:HHM.warmWhite,borderRadius:10,border:"1px solid "+HHM.gray100,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div><div style={{fontWeight:700,color:HHM.navy}}>{name}</div><div style={{fontSize:12,color:HHM.gray400}}>{data.count} audit{data.count!==1?"s":""} . Last: {data.last?.toLocaleDateString()}</div></div>
                  <div style={{display:"flex",gap:16,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:12,color:HHM.gray400}}>Avg Score</div><div style={{fontSize:20,fontWeight:800,color:avg>=4?HHM.success:avg>=3?HHM.warning:HHM.danger}}>{avg.toFixed(1)}</div></div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:12,color:HHM.gray400}}>Total</div><div style={{fontSize:20,fontWeight:800,color:HHM.navy}}>{data.count}</div></div>
                  </div>
                </div>;
              });
            })()}
          </div>}

        </div>}
      </div>}

      {view==="settings"&&<div style={S.content}>
        <h2 style={S.pageTitle}>Administration</h2><p style={S.pageSub}>Manage users, roles, permissions, and platform settings.</p>
        <div style={{display:"flex",gap:8,marginBottom:24}}>{["users","roles","platform"].map(tab=><button key={tab} style={{padding:"8px 20px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:settingsTab===tab?HHM.navy:HHM.gray100,color:settingsTab===tab?HHM.cream:HHM.gray700}} onClick={()=>setSettingsTab(tab)}>{tab==="users"?"Users":tab==="roles"?"Roles & RBAC":"Platform"}</button>)}</div>

        {settingsTab==="users"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:700,color:HHM.navy}}>User Management ({users.length})</h3>
          </div>

          {/* Add User Form */}
          <div style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:20,marginBottom:20}}>
            <h4 style={{margin:"0 0 12px",fontSize:14,color:HHM.navy}}>Add New User</h4>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"1 1 180px"}}><label style={S.formLabel}>Username *</label><input id="newUserName" style={{...S.formInput,width:"100%",boxSizing:"border-box"}} placeholder="e.g. jsmith" /></div>
              <div style={{flex:"1 1 180px"}}><label style={S.formLabel}>Password *</label><input id="newUserPass" type="password" style={{...S.formInput,width:"100%",boxSizing:"border-box"}} placeholder="Set password" /></div>
              <div style={{flex:"1 1 180px"}}><label style={S.formLabel}>Email</label><input id="newUserEmail" style={{...S.formInput,width:"100%",boxSizing:"border-box"}} placeholder="e.g. john@hhm.com" /></div>
              <div style={{flex:"1 1 160px"}}><label style={S.formLabel}>Role *</label><select id="newUserRole" style={{...S.formInput,width:"100%",boxSizing:"border-box",cursor:"pointer"}} defaultValue="dept">
                {roles.map(r => <option key={r.id} value={r.id}>{(RI[r.icon]||"") + " " + r.label}</option>)}
              </select></div>
              <div style={{flex:"1 1 160px"}}><label style={S.formLabel}>Department</label><select id="newUserDept" style={{...S.formInput,width:"100%",boxSizing:"border-box",cursor:"pointer"}} defaultValue="">
                <option value="">-- None --</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select></div>
              <button style={{...S.btnPrimary,height:42}} onClick={async () => {
                const nameEl = document.getElementById("newUserName");
                const passEl = document.getElementById("newUserPass");
                const emailEl = document.getElementById("newUserEmail");
                const roleEl = document.getElementById("newUserRole");
                const deptEl = document.getElementById("newUserDept");
                const name = nameEl?.value?.trim();
                const pass = passEl?.value;
                if (!name) { showToast("Username is required", "error"); return; }
                if (!pass) { showToast("Password is required", "error"); return; }
                if (users.find(u => u.name.toLowerCase() === name.toLowerCase())) { showToast("User '" + name + "' already exists", "error"); return; }
                const newUser = { id: genId(), name: name, password: pass, email: emailEl?.value?.trim() || "", roleId: roleEl?.value || "dept", department: deptEl?.value || "", active: true, createdAt: new Date().toISOString(), lastLogin: null };
                const updated = [...users, newUser];
                await persistUsers(updated);
                showToast("User '" + name + "' added successfully");
                if (nameEl) nameEl.value = "";
                if (passEl) passEl.value = "";
                if (emailEl) emailEl.value = "";
              }}>Add User</button>
            </div>
          </div>

          {/* User List */}
          {users.length === 0 ? <div style={S.emptyState}><p style={{color:HHM.gray400}}>No users added yet.</p></div>
          : <div className="hhm-table-wrap" style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:700}}>
              <thead><tr style={{background:HHM.gray50,borderBottom:"1px solid "+HHM.gray100}}>
                <th style={S.th}>Name</th><th style={S.th}>Email</th><th style={S.th}>Role</th><th style={S.th}>Dept</th><th style={S.th}>Status</th><th style={S.th}>Last Login</th><th style={S.th}>Actions</th>
              </tr></thead>
              <tbody>{users.map(u => { const r = roles.find(x => x.id === u.roleId); return <tr key={u.id} style={{borderBottom:"1px solid "+HHM.gray100}}>
                <td style={S.td}><div style={{fontWeight:600,color:HHM.navy}}>{u.name}</div></td>
                <td style={S.td}><span style={{color:HHM.gray500,fontSize:12}}>{u.email || "-"}</span></td>
                <td style={S.td}>
                  <select style={{...S.filterSel,fontSize:12,padding:"4px 8px"}} value={u.roleId} onChange={async e => { const upd = users.map(x => x.id === u.id ? {...x, roleId: e.target.value} : x); await persistUsers(upd); showToast("Role updated for " + u.name); }}>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </td>
                <td style={S.td}>
                  <select style={{...S.filterSel,fontSize:12,padding:"4px 8px"}} value={u.department || ""} onChange={async e => { const upd = users.map(x => x.id === u.id ? {...x, department: e.target.value} : x); await persistUsers(upd); showToast("Department updated"); }}>
                    <option value="">-- None --</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </td>
                <td style={S.td}>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    <span style={{...S.badge,background:u.active !== false ? HHM.success+"14" : HHM.danger+"14", color: u.active !== false ? HHM.success : HHM.danger}}>{u.active !== false ? "Active" : "Disabled"}</span>
                    {u.lockedUntil && new Date(u.lockedUntil).getTime() > Date.now() && <span style={{...S.badge,background:HHM.danger+"14",color:HHM.danger}}>Locked</span>}
                    {u.failedAttempts > 0 && (!u.lockedUntil || new Date(u.lockedUntil).getTime() <= Date.now()) && <span style={{fontSize:10,color:HHM.warning}}>{u.failedAttempts} failed</span>}
                  </div>
                </td>
                <td style={S.td}><span style={{fontSize:12,color:HHM.gray400}}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}</span></td>
                <td style={S.td}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <button style={{background:"none",border:"1px solid "+HHM.gold+"44",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:HHM.gold,fontFamily:"inherit"}}
                      onClick={async () => {
                        const newPass = prompt("Enter new password for " + u.name + ":");
                        if (!newPass) return;
                        if (newPass.length < 4) { showToast("Password must be at least 4 characters", "error"); return; }
                        const upd = users.map(x => x.id === u.id ? {...x, password: newPass, failedAttempts: 0, lockedUntil: null} : x);
                        await persistUsers(upd);
                        showToast("Password reset for " + u.name);
                      }}>Reset Password</button>
                    {u.lockedUntil && new Date(u.lockedUntil).getTime() > Date.now() && <button style={{background:"none",border:"1px solid "+HHM.warning+"44",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:HHM.warning,fontFamily:"inherit"}}
                      onClick={async () => {
                        const upd = users.map(x => x.id === u.id ? {...x, failedAttempts: 0, lockedUntil: null} : x);
                        await persistUsers(upd);
                        showToast(u.name + " unlocked");
                      }}>Unlock</button>}
                    <button style={{background:"none",border:"1px solid "+(u.active !== false ? HHM.danger+"44" : HHM.success+"44"),borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:u.active !== false ? HHM.danger : HHM.success,fontFamily:"inherit"}}
                      onClick={async () => { const upd = users.map(x => x.id === u.id ? {...x, active: u.active === false} : x); await persistUsers(upd); showToast(u.name + (u.active !== false ? " disabled" : " activated")); }}>
                      {u.active !== false ? "Disable" : "Enable"}
                    </button>
                    <button style={{background:"none",border:"1px solid "+HHM.danger+"44",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",color:HHM.danger,fontFamily:"inherit"}}
                      onClick={async () => {
                        if (u.id === currentUser?.id) { showToast("Cannot delete yourself", "error"); return; }
                        if (!confirm("Delete user '" + u.name + "' permanently?")) return;
                        await dbDeleteUser(u.id);
                        const upd = users.filter(function(x) { return x.id !== u.id; });
                        await persistUsers(upd);
                        showToast("User '" + u.name + "' deleted", "info");
                      }}>Delete</button>
                  </div>
                </td>
              </tr>; })}</tbody>
            </table>
          </div>}
        </div>}

        {settingsTab==="roles"&&<div>
          <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700,color:HHM.navy}}>Roles & Permissions (RBAC)</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {roles.map(role=><div key={role.id} style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>{RI[role.icon]||"\u{1F464}"}</span><div><div style={{fontSize:15,fontWeight:700,color:role.color}}>{role.label}</div><div style={{fontSize:12,color:HHM.gray400}}>{role.desc}</div></div></div>
                <span style={{fontSize:12,color:HHM.gray400}}>{users.filter(u=>u.roleId===role.id).length} users</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {ALL_PERMISSIONS.map(p=>{const has=role.permissions.includes(p.id);return <button key={p.id} title={p.desc} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:has?HHM.gold+"14":HHM.gray50,color:has?HHM.navy:HHM.gray400,border:"1px solid "+(has?HHM.gold+"40":HHM.gray200)}} onClick={async()=>{const np=has?role.permissions.filter(x=>x!==p.id):[...role.permissions,p.id];const upd=roles.map(r=>r.id===role.id?{...r,permissions:np}:r);await persistRoles(upd);showToast((has?"Removed":"Added")+" "+p.label);}}>{(has?"\u2713 ":"")+p.label}</button>;})}
              </div>
            </div>)}
          </div>
        </div>}

        {settingsTab==="platform"&&<div>
          <h3 style={{margin:"0 0 16px",fontSize:16,fontWeight:700,color:HHM.navy}}>Platform Settings</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:20}}>
              <h4 style={{margin:"0 0 8px",fontSize:14,color:HHM.navy}}>Database</h4>
              <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:"50%",background:dbStatus==="connected"?HHM.success:dbStatus==="memory"?HHM.warning:HHM.danger}}/><span style={{fontSize:14,color:HHM.gray700}}>{dbStatus==="connected"?"IndexedDB Connected - Data persists across refreshes":"In-Memory Mode - Data available this session only"}</span></div>
              <div style={{marginTop:12,fontSize:13,color:HHM.gray500}}><div>SOPs: <strong>{sops.length}</strong></div><div>Users: <strong>{users.length}</strong></div><div>Roles: <strong>{roles.length}</strong></div></div>
            </div>
            <div style={{background:HHM.warmWhite,borderRadius:12,border:"1px solid "+HHM.gray100,padding:20}}>
              <h4 style={{margin:"0 0 8px",fontSize:14,color:HHM.navy}}>Data Management</h4>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button style={S.btnSecondary} onClick={async()=>{navigator.clipboard.writeText(JSON.stringify({sops,users,roles},null,2)).then(()=>showToast("Data exported to clipboard")).catch(()=>showToast("Export failed","error"));}}>Export All Data</button>
                <button style={S.btnDanger} onClick={async()=>{if(!confirm("Delete ALL data?"))return;await persistSops([]);await persistUsers([]);await persistRoles(DEFAULT_ROLES);showToast("All data reset","info");}}>Reset All Data</button>
              </div>
            </div>
          </div>
        </div>}
      </div>}
    </div>
  </div>;
}

function FG({label,children}){return <div style={S.formGroup}><label style={S.formLabel}>{label}</label>{children}</div>;}

function SOPRow({sop,onClick}){
  const cat=CATEGORIES.find(c=>c.id===sop.category);const st=STATUS_MAP[sop.status]||STATUS_MAP.draft;const pr=PRIORITY_MAP[sop.priority]||PRIORITY_MAP.medium;
  return <button style={S.sopRow} onClick={onClick} onMouseEnter={e=>e.currentTarget.style.borderColor=HHM.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=HHM.gray100}>
    <div style={S.sopRowTop}><span style={S.sopRowCat}>{(cat?.icon||"")+" "+(cat?.label||"")}</span><div style={{display:"flex",gap:6}}><span style={{...S.badge,background:pr.color+"14",color:pr.color}}>{pr.label}</span><span style={{...S.badge,background:st.color+"14",color:st.color}}>{st.label}</span></div></div>
    <div style={S.sopRowTitle}>{sop.title}</div>
    <div style={S.sopRowMeta}><span style={{color:HHM.gold,fontWeight:500}}>{sop.department}</span>{sop.property&&<><span style={S.dot}> . </span><span>{sop.property}</span></>}<span style={S.dot}> . </span><span>{new Date(sop.updatedAt).toLocaleDateString()}</span></div>
    {sop.tags?.length>0&&<div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>{sop.tags.slice(0,4).map((t,i)=><span key={i} style={S.tag}>{t}</span>)}</div>}
  </button>;
}

function SOPDetail({sop,editMode,setEditMode,canEdit,canDelete,canApprove,onSave,onDelete,onStatusChange,userName}){
  const[form,setForm]=useState({...sop});useEffect(()=>{setForm({...sop});},[sop]);
  const cat=CATEGORIES.find(c=>c.id===sop.category);const st=STATUS_MAP[sop.status];const pr=PRIORITY_MAP[sop.priority];
  if(editMode)return <div><h2 style={S.pageTitle}>Edit SOP</h2><div style={{...S.createForm,marginTop:16}}><div style={S.formGrid}>
    <FG label="Title"><input style={S.formInput} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></FG>
    <FG label="Department"><select style={S.formInput} value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></FG>
    <FG label="Category"><select style={S.formInput} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon+" "+c.label}</option>)}</select></FG>
    <FG label="Priority"><select style={S.formInput} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{Object.entries(PRIORITY_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></FG>
    <FG label="Property"><input style={S.formInput} value={form.property||""} onChange={e=>setForm({...form,property:e.target.value})}/></FG>
    <FG label="Region"><input style={S.formInput} value={form.region||""} onChange={e=>setForm({...form,region:e.target.value})}/></FG>
    <FG label="Version"><input style={S.formInput} value={form.version||""} onChange={e=>setForm({...form,version:e.target.value})}/></FG>
    <FG label="Tags"><input style={S.formInput} value={Array.isArray(form.tags)?form.tags.join(", "):form.tags||""} onChange={e=>setForm({...form,tags:e.target.value.split(",").map(t=>t.trim()).filter(Boolean)})}/></FG>
  </div><FG label="Content"><textarea style={S.formTextarea} rows={18} value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></FG>
  <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}><button style={S.btnSecondary} onClick={()=>setEditMode(false)}>Cancel</button><button style={S.btnPrimary} onClick={()=>onSave(form)}>Save Changes</button></div></div></div>;

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
      <div style={{flex:1}}><div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>{st&&<span style={{...S.badge,background:st.color+"14",color:st.color,fontSize:12,padding:"4px 12px"}}>{st.label}</span>}{pr&&<span style={{...S.badge,background:pr.color+"14",color:pr.color,fontSize:12,padding:"4px 12px"}}>{pr.label}</span>}{cat&&<span style={{...S.badge,background:HHM.gold+"15",color:HHM.gold,fontSize:12,padding:"4px 12px"}}>{cat.icon+" "+cat.label}</span>}</div>
      <h2 style={{...S.pageTitle,marginBottom:6}}>{sop.title}</h2>
      <div style={S.sopRowMeta}><span style={{color:HHM.gold,fontWeight:500}}>{sop.department}</span>{sop.property&&<><span style={S.dot}> . </span><span>{sop.property}</span></>}{sop.region&&<><span style={S.dot}> . </span><span>{sop.region}</span></>}<span style={S.dot}> . </span><span>v{sop.version||"1.0"}</span><span style={S.dot}> . </span><span>{new Date(sop.updatedAt).toLocaleDateString()}</span>{sop.updatedBy&&<><span style={S.dot}> . </span><span>by {sop.updatedBy}</span></>}</div></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{canApprove&&sop.status!=="approved"&&<button style={S.btnSuccess} onClick={()=>onStatusChange("approved")}>Approve</button>}{canApprove&&sop.status==="draft"&&<button style={S.btnWarning} onClick={()=>onStatusChange("review")}>Submit for Review</button>}{canEdit&&<button style={S.btnSecondary} onClick={()=>setEditMode(true)}>Edit</button>}<button style={S.btnSecondary} onClick={()=>exportAsPDF(sop)}>Export PDF</button><button style={S.btnSecondary} onClick={()=>exportAsWord(sop)}>Export Word</button>{canDelete&&<button style={S.btnDanger} onClick={()=>{if(confirm("Delete this SOP?"))onDelete();}}>Delete</button>}</div>
    </div>
    {sop.tags?.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>{sop.tags.map((t,i)=><span key={i} style={S.tag}>{t}</span>)}</div>}
    <div style={S.contentBlock}><MdRender content={sop.content}/></div>
    <div style={S.metaFooter}>Created by {sop.createdBy||"-"} on {new Date(sop.createdAt).toLocaleDateString()}</div>
  </div>;
}

function MdRender({content}){if(!content)return null;return <>{content.split("\n").map((line,i)=>{
  if(line.startsWith("## ")) return <h3 key={i} style={{fontSize:18,fontWeight:400,color:HHM.navy,margin:"24px 0 8px",fontFamily:"'Cormorant Garamond',Georgia,serif",letterSpacing:0.3}}>{line.slice(3)}</h3>;
  if(line.startsWith("# ")) return <h2 key={i} style={{fontSize:22,fontWeight:400,color:HHM.navy,margin:"24px 0 10px",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{line.slice(2)}</h2>;
  if(/^\d+\.\s/.test(line)) return <div key={i} style={{display:"flex",gap:8,margin:"4px 0",paddingLeft:4}}><span style={{color:HHM.gold,fontWeight:600,minWidth:20,fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>{line.match(/^\d+/)[0]}.</span><span style={{color:HHM.charcoal}}>{inl(line.replace(/^\d+\.\s*/,""))}</span></div>;
  if(line.startsWith("- ")||line.startsWith("* ")) return <div key={i} style={{display:"flex",gap:8,margin:"3px 0",paddingLeft:12}}><span style={{color:HHM.gold}}>{"\u2022"}</span><span style={{color:HHM.charcoal}}>{inl(line.slice(2))}</span></div>;
  if(!line.trim()) return <div key={i} style={{height:8}}/>;
  return <p key={i} style={{margin:"4px 0",color:HHM.charcoal,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>{inl(line)}</p>;
})}</>;}
function inl(t){return t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>p.startsWith("**")&&p.endsWith("**")?<strong key={i} style={{fontWeight:600,color:HHM.navy}}>{p.slice(2,-2)}</strong>:p);}

const S={
  rolePage:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,"+HHM.navyDeep+" 0%,"+HHM.navy+" 50%,#1F3350 100%)",padding:24,fontFamily:"'DM Sans','Segoe UI',sans-serif"},
  roleInner:{maxWidth:480,width:"100%",textAlign:"center"},
  roleLogoArea:{marginBottom:36,display:"flex",flexDirection:"column",alignItems:"center",gap:14},
  roleHr:{width:60,height:2,background:HHM.gold,borderRadius:1},
  rolePlatformName:{fontSize:13,color:HHM.gold,letterSpacing:4,textTransform:"uppercase",margin:0,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:400},
  roleFooter:{color:"#5A6B80",fontSize:12,marginTop:36,letterSpacing:1,fontFamily:"'DM Sans',sans-serif"},
  app:{display:"flex",minHeight:"100vh",background:HHM.cream,fontFamily:"'DM Sans','Segoe UI',sans-serif",color:HHM.charcoal,position:"relative"},
  toast:{position:"fixed",top:20,right:20,padding:"12px 24px",borderRadius:4,color:HHM.cream,fontSize:14,fontWeight:500,zIndex:9999,boxShadow:"0 4px 24px rgba(27,42,74,0.15)",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)"},
  sidebar:{background:HHM.navy,display:"flex",flexDirection:"column",transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)",overflow:"hidden",flexShrink:0},
  sideHead:{display:"flex",alignItems:"center",gap:10,padding:"18px 16px",borderBottom:"1px solid rgba(201,168,76,0.15)"},
  sideBrandSub:{fontSize:10,color:HHM.gold,fontWeight:500,letterSpacing:2.5,textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"'Cormorant Garamond',Georgia,serif"},
  sideToggle:{marginLeft:"auto",background:"none",border:"none",color:HHM.gold,cursor:"pointer",fontSize:13,padding:"4px 8px",opacity:0.6,transition:"opacity 0.15s ease"},
  sideRoleBadge:{padding:"14px 16px",background:"rgba(0,0,0,0.15)",borderBottom:"1px solid rgba(201,168,76,0.1)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8},
  sideSwitch:{background:"none",border:"1px solid rgba(201,168,76,0.3)",color:HHM.gold,borderRadius:4,padding:"3px 12px",fontSize:11,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s ease",fontFamily:"'DM Sans',sans-serif"},
  sideNav:{padding:"14px 10px",display:"flex",flexDirection:"column",gap:2},
  sideNavItem:{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:4,background:"none",border:"none",borderLeft:"3px solid transparent",color:"rgba(245,240,232,0.6)",fontSize:14,cursor:"pointer",transition:"all 0.15s cubic-bezier(0.16,1,0.3,1)",textAlign:"left",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"},
  sideNavActive:{borderLeftColor:HHM.gold,background:"rgba(201,168,76,0.1)",color:HHM.cream,fontWeight:600},
  sideNavIcon:{fontSize:16,width:24,textAlign:"center",flexShrink:0},
  sideDepts:{padding:"14px 12px",borderTop:"1px solid rgba(201,168,76,0.1)",flex:1,overflowY:"auto"},
  sideDeptTitle:{fontSize:10,color:"rgba(201,168,76,0.5)",letterSpacing:2.5,marginBottom:10,padding:"0 4px",fontWeight:600,fontFamily:"'DM Sans',sans-serif"},
  sideDeptItem:{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"7px 10px",borderRadius:4,background:"none",border:"none",color:"rgba(245,240,232,0.55)",fontSize:12,cursor:"pointer",transition:"all 0.15s ease",fontFamily:"'DM Sans',sans-serif"},
  sideDeptCount:{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"2px 8px",fontSize:11,color:"rgba(201,168,76,0.6)",fontFamily:"'JetBrains Mono',monospace"},
  sideFooter:{padding:"14px 16px",borderTop:"1px solid rgba(201,168,76,0.1)",textAlign:"center"},
  main:{flex:1,display:"flex",flexDirection:"column",minWidth:0},
  topBar:{display:"flex",alignItems:"center",gap:12,padding:"12px 28px",borderBottom:"1px solid "+HHM.lightGray,background:HHM.warmWhite,flexWrap:"wrap"},
  searchWrap:{flex:1,minWidth:200,position:"relative"},
  searchSvg:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:18,height:18,color:HHM.gray300},
  searchInput:{width:"100%",padding:"10px 12px 10px 40px",border:"1px solid "+HHM.lightGray,borderRadius:4,fontSize:16,background:HHM.warmWhite,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",color:HHM.charcoal,transition:"border-color 0.15s ease"},
  topFilters:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"},
  filterSel:{padding:"8px 14px",border:"1px solid "+HHM.lightGray,borderRadius:4,fontSize:13,background:HHM.warmWhite,color:HHM.gray500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"},
  content:{flex:1,padding:"28px 32px",overflowY:"auto",maxWidth:1120},
  pageTitle:{fontSize:24,fontWeight:400,color:HHM.navy,margin:"0 0 4px",letterSpacing:0.5,fontFamily:"'Cormorant Garamond',Georgia,serif"},
  pageSub:{fontSize:14,color:HHM.gray400,margin:"0 0 24px",fontFamily:"'DM Sans',sans-serif"},
  sectionTitle:{fontSize:13,fontWeight:600,color:HHM.navy,margin:"32px 0 14px",letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"},
  dashHero:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,marginBottom:28,padding:"28px 32px",background:HHM.navy,borderRadius:8,color:HHM.cream,boxShadow:"0 2px 12px rgba(27,42,74,0.08)"},
  dashTitle:{fontSize:26,fontWeight:300,margin:0,color:HHM.cream,fontFamily:"'Cormorant Garamond',Georgia,serif",letterSpacing:0.5},
  dashSub:{fontSize:14,color:"rgba(245,240,232,0.6)",margin:"4px 0 0",fontFamily:"'DM Sans',sans-serif"},
  statsRow:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:14,marginBottom:8},
  statCard:{borderRadius:8,padding:"20px 18px",textAlign:"center",border:"1px solid "+HHM.lightGray,boxShadow:"0 2px 12px rgba(27,42,74,0.04)"},
  statVal:{fontSize:28,fontWeight:400,fontFamily:"'Cormorant Garamond',Georgia,serif"},
  statLabel:{fontSize:11,color:HHM.gray400,marginTop:4,textTransform:"uppercase",letterSpacing:1.5,fontWeight:500,fontFamily:"'DM Sans',sans-serif"},
  catGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12},
  catCard:{background:HHM.warmWhite,border:"1px solid "+HHM.lightGray,borderRadius:8,padding:"20px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)",boxShadow:"0 2px 12px rgba(27,42,74,0.04)"},
  catLabel:{fontSize:13,fontWeight:500,color:HHM.navy,textAlign:"center",fontFamily:"'DM Sans',sans-serif"},
  catCount:{fontSize:11,color:HHM.gray400,fontFamily:"'JetBrains Mono',monospace"},
  sopList:{display:"flex",flexDirection:"column",gap:10},
  sopRow:{background:HHM.warmWhite,border:"1px solid "+HHM.lightGray,borderRadius:8,padding:"18px 22px",cursor:"pointer",textAlign:"left",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)",width:"100%",boxShadow:"0 2px 12px rgba(27,42,74,0.04)"},
  sopRowTop:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},
  sopRowCat:{fontSize:12,color:HHM.gray400,fontFamily:"'DM Sans',sans-serif"},
  sopRowTitle:{fontSize:16,fontWeight:500,color:HHM.navy,fontFamily:"'DM Sans',sans-serif"},
  sopRowMeta:{fontSize:12,color:HHM.gray400,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginTop:4,fontFamily:"'DM Sans',sans-serif"},
  dot:{color:HHM.lightGray},
  badge:{fontSize:11,padding:"3px 10px",borderRadius:4,fontWeight:600,fontFamily:"'DM Sans',sans-serif"},
  tag:{fontSize:11,padding:"3px 10px",borderRadius:4,background:HHM.goldLight,color:HHM.navy,border:"1px solid "+HHM.goldBorder,fontWeight:500,fontFamily:"'DM Sans',sans-serif"},
  btnPrimary:{background:HHM.navy,color:HHM.cream,border:"none",borderRadius:4,padding:"12px 22px",fontSize:16,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",touchAction:"manipulation",WebkitTapHighlightColor:"transparent",transition:"all 0.15s cubic-bezier(0.16,1,0.3,1)"},
  btnSecondary:{background:"transparent",color:HHM.navy,border:"1px solid "+HHM.gold,borderRadius:4,padding:"10px 22px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s ease"},
  btnSuccess:{background:HHM.success,color:HHM.cream,border:"none",borderRadius:4,padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  btnWarning:{background:HHM.warning,color:HHM.navy,border:"none",borderRadius:4,padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  btnDanger:{background:"transparent",color:HHM.danger,border:"1px solid "+HHM.danger+"44",borderRadius:4,padding:"10px 18px",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  backBtn:{background:"none",border:"none",color:HHM.gold,fontSize:14,cursor:"pointer",padding:"0 0 16px",fontFamily:"'DM Sans',sans-serif",fontWeight:500},
  emptyState:{textAlign:"center",padding:"60px 24px",background:HHM.warmWhite,borderRadius:8,border:"1px dashed "+HHM.lightGray,display:"flex",flexDirection:"column",alignItems:"center",gap:12},
  createForm:{background:HHM.warmWhite,borderRadius:8,border:"1px solid "+HHM.lightGray,padding:28,boxShadow:"0 2px 12px rgba(27,42,74,0.04)"},
  formGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px 20px",marginBottom:20},
  formGroup:{display:"flex",flexDirection:"column",gap:5,marginBottom:8},
  formLabel:{fontSize:11,fontWeight:600,color:HHM.gray500,textTransform:"uppercase",letterSpacing:1.5,fontFamily:"'DM Sans',sans-serif"},
  formInput:{padding:"10px 14px",border:"1px solid "+HHM.lightGray,borderRadius:4,fontSize:16,fontFamily:"'DM Sans',sans-serif",background:HHM.warmWhite,outline:"none",color:HHM.charcoal,WebkitAppearance:"none",appearance:"none",transition:"border-color 0.15s ease"},
  formTextarea:{padding:"14px",border:"1px solid "+HHM.lightGray,borderRadius:4,fontSize:14,fontFamily:"'JetBrains Mono',monospace",background:HHM.warmWhite,outline:"none",resize:"vertical",lineHeight:1.7,color:HHM.charcoal,transition:"border-color 0.15s ease"},
  aiBox:{background:HHM.navy,borderRadius:8,padding:24,marginBottom:24,boxShadow:"0 2px 12px rgba(27,42,74,0.08)"},
  aiHeader:{display:"flex",alignItems:"center",gap:12},
  aiIconCircle:{width:40,height:40,borderRadius:8,background:"rgba(201,168,76,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20},
  aiTitle:{fontSize:16,fontWeight:500,color:HHM.cream,fontFamily:"'Cormorant Garamond',Georgia,serif",letterSpacing:0.5},
  aiDesc:{fontSize:13,color:"rgba(245,240,232,0.5)",marginTop:2,fontFamily:"'DM Sans',sans-serif"},
  aiInput:{flex:1,padding:"12px 16px",borderRadius:4,border:"1px solid rgba(201,168,76,0.25)",background:"rgba(0,0,0,0.2)",color:HHM.cream,fontSize:16,fontFamily:"'DM Sans',sans-serif",outline:"none",WebkitAppearance:"none",appearance:"none",transition:"border-color 0.15s ease"},
  contentBlock:{background:HHM.warmWhite,border:"1px solid "+HHM.lightGray,borderRadius:8,padding:"28px 32px",marginTop:20,lineHeight:1.7,fontSize:15,fontFamily:"'DM Sans',sans-serif",boxShadow:"0 2px 12px rgba(27,42,74,0.04)"},
  metaFooter:{marginTop:16,fontSize:12,color:HHM.gray400,padding:"12px 0",borderTop:"1px solid "+HHM.lightGray,fontFamily:"'DM Sans',sans-serif"},
  th:{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:HHM.cream,textTransform:"uppercase",letterSpacing:1.5,background:HHM.navy,fontFamily:"'DM Sans',sans-serif"},
  td:{padding:"12px 16px",verticalAlign:"middle",fontFamily:"'DM Sans',sans-serif"},
};
