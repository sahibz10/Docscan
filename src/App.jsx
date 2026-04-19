import { useState, useRef } from "react";
import { useEffect } from "react";

const FONTS = `https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap`;

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
.dsa{font-family:'DM Sans',sans-serif;min-height:100vh;background:var(--bg-main);color:var(--text-main); transition: background 0.3s; display: flex; flex-direction: column;}
/* AUTH */
.auth-outer{min-height:100vh;flex:1;display:flex;align-items:center;justify-content:center;background:var(--bg-main);position:relative;overflow:hidden;}
.orb1{position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(109,40,217,.18) 0%,transparent 70%);top:-80px;right:-60px;pointer-events:none;}
.orb2{position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,.13) 0%,transparent 70%);bottom:-60px;left:-60px;pointer-events:none;}
.auth-card{background:#0d1022;border:1px solid rgba(255,255,255,.09);border-radius:22px;padding:40px;width:100%;max-width:420px;position:relative;z-index:1;}
.logo{display:flex;align-items:center;gap:10px;margin-bottom:30px;}
.logo-icon{width:38px;height:38px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.logo-text{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#f1f5f9;}
.auth-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:#f1f5f9;margin-bottom:5px;}
.auth-sub{font-size:14px;color:#475569;margin-bottom:26px;}
.lbl{display:block;font-size:12px;color:#64748b;margin-bottom:5px;letter-spacing:.03em;}
.inp{width:100%;background:#12172c;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:11px 14px;color:#e2e8f0;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s;margin-bottom:14px;}
.inp:focus{border-color:#7c3aed;}
.inp::placeholder{color:#334155;}
.btn-primary{width:100%;background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;border-radius:10px;padding:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:opacity .2s,transform .1s;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary:hover{opacity:.9;}
.btn-primary:active{transform:scale(.98);}
.btn-primary:disabled{opacity:.55;cursor:not-allowed;}
.auth-switch{text-align:center;margin-top:18px;font-size:13px;color:#475569;}
.auth-link{color:#8b5cf6;cursor:pointer;}
.err-box{color:#fca5a5;font-size:13px;margin-bottom:14px;padding:10px 14px;background:rgba(239,68,68,.1);border-radius:9px;border:1px solid rgba(239,68,68,.2);}
.forgotlink{text-align:right;margin-bottom:18px;font-size:13px;color:#7c3aed;cursor:pointer;}
/* SPINNER */
.spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:roto .6s linear infinite;flex-shrink:0;}
@keyframes roto{to{transform:rotate(360deg);}}
/* LAYOUT */
.layout{display:flex;min-height:600px;}
.sidebar{width:222px;background:#09091e;border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;padding:0;flex-shrink:0;}
.sb-logo{padding:20px 18px 18px;border-bottom:1px solid rgba(255,255,255,.06);}
.sb-nav{padding:10px 10px 0;flex:1;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-radius:9px;font-size:13.5px;color:#4b5563;transition:all .15s;margin-bottom:3px;}
.nav-item:hover{background:rgba(255,255,255,.04);color:#94a3b8;}
.nav-item.active{background:rgba(124,58,237,.16);color:#c4b5fd;}
.nav-dot{width:5px;height:5px;border-radius:50%;background:#7c3aed;margin-left:auto;flex-shrink:0;}
.sb-bottom{padding:14px 10px;border-top:1px solid rgba(255,255,255,.06);}
.user-row{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:9px;}
.avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#4f46e5);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#fff;flex-shrink:0;}
.user-name{font-size:13px;font-weight:500;color:#e2e8f0;line-height:1.2;}
.user-plan{font-size:11px;color:#7c3aed;}
.logout-row{display:flex;align-items:center;gap:9px;padding:8px 10px;cursor:pointer;color:#374151;font-size:13px;border-radius:9px;margin-top:2px;transition:all .15s;}
.logout-row:hover{color:#f87171;background:rgba(248,113,113,.08);}
/* CONTENT */
.content{flex:1;overflow-y:auto;background:#08091a;}
.page{padding:28px 28px 40px;}
.page-hdr{margin-bottom:24px;}
.page-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#f1f5f9;margin-bottom:4px;}
.page-sub{font-size:14px;color:#374151;}
/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat-card{background:#0d1022;border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:18px;}
.stat-lbl{font-size:11px;color:#374151;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}
.stat-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:#f1f5f9;margin-bottom:3px;}
.stat-chg{font-size:12px;color:#10b981;}
.stat-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;float:right;margin-top:-2px;}
/* CARD */
.card{background:#0d1022;border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;margin-bottom:16px;}
.card-hdr{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;}
.card-title{font-size:13.5px;font-weight:500;color:#e2e8f0;}
.btn-ghost{background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.2);border-radius:7px;padding:6px 12px;color:#a78bfa;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s;}
.btn-ghost:hover{background:rgba(124,58,237,.2);}
/* TABLE */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{padding:11px 16px;text-align:left;font-size:11px;color:#374151;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid rgba(255,255,255,.06);}
.tbl td{padding:12px 16px;font-size:13px;color:#94a3b8;border-bottom:1px solid rgba(255,255,255,.04);}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:rgba(255,255,255,.015);}
.badge{display:inline-block;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:500;}
.bg{background:rgba(16,185,129,.13);color:#34d399;}
.bb{background:rgba(99,102,241,.13);color:#818cf8;}
.ba{background:rgba(245,158,11,.13);color:#fbbf24;}
.bp{background:rgba(236,72,153,.13);color:#f472b6;}
.bc{background:rgba(14,165,233,.13);color:#38bdf8;}
/* PROGRESS */
.prog-wrap{padding:14px 18px;}
.prog-bar{background:rgba(255,255,255,.07);border-radius:99px;height:6px;overflow:hidden;margin-top:6px;}
.prog-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#6366f1);border-radius:99px;}
/* SCANNER */
.scan-layout{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.dropzone{border:2px dashed rgba(124,58,237,.3);border-radius:16px;padding:36px 20px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(124,58,237,.04);}
.dropzone:hover,.dropzone.drag{border-color:#7c3aed;background:rgba(124,58,237,.09);}
.dz-icon{width:54px;height:54px;border-radius:14px;background:rgba(124,58,237,.15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
.dz-title{font-size:14.5px;font-weight:500;color:#e2e8f0;margin-bottom:5px;}
.dz-sub{font-size:13px;color:#374151;}
.preview-img{width:100%;border-radius:11px;object-fit:contain;max-height:190px;margin:14px 0;background:#12172c;}
.extract-btn{width:100%;background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;border-radius:10px;padding:12px;color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:opacity .2s;margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;}
.extract-btn:hover{opacity:.9;}
.extract-btn:disabled{opacity:.5;cursor:not-allowed;}
.result-box{background:#0d1022;border:1px solid rgba(255,255,255,.07);border-radius:14px;display:flex;flex-direction:column;min-height:300px;}
.result-hdr{padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;}
.result-body{padding:16px;flex:1;font-size:13px;line-height:1.75;color:#94a3b8;white-space:pre-wrap;overflow-y:auto;font-family:'DM Sans',sans-serif;max-height:380px;}
.copy-btn{background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.2);border-radius:7px;padding:5px 11px;color:#a78bfa;font-size:12px;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:5px;}
.copy-btn:hover{background:rgba(124,58,237,.2);}
.scan-anim{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;gap:14px;}
.scan-track{width:80%;height:2px;background:rgba(124,58,237,.15);border-radius:99px;overflow:hidden;}
.scan-line{height:100%;background:linear-gradient(90deg,transparent,#7c3aed,transparent);animation:scanslide 1.4s ease-in-out infinite;}
@keyframes scanslide{0%{transform:translateX(-100%);}100%{transform:translateX(300%);}}
.result-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;gap:8px;}
/* PLANS */
.plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;}
.plan-card{background:#0d1022;border:1.5px solid rgba(255,255,255,.07);border-radius:16px;padding:24px;cursor:pointer;transition:all .2s;}
.plan-card:hover{border-color:rgba(124,58,237,.3);}
.plan-card.sel{border-color:#7c3aed;background:rgba(124,58,237,.06);}
.plan-pop{display:inline-block;padding:3px 11px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:20px;font-size:11px;color:#fff;margin-bottom:11px;}
.plan-name{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#f1f5f9;margin-bottom:3px;}
.plan-price{font-family:'Syne',sans-serif;font-size:30px;font-weight:700;color:#f1f5f9;margin:11px 0;}
.plan-price span{font-size:14px;color:#374151;font-weight:400;font-family:'DM Sans',sans-serif;}
.plan-divider{height:1px;background:rgba(255,255,255,.07);margin:14px 0;}
.plan-feat{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#94a3b8;margin-bottom:8px;}
.feat-check{color:#10b981;flex-shrink:0;margin-top:1px;}
.subscribe-wrap{margin-top:22px;text-align:center;}
.subscribe-note{font-size:12px;color:#374155;margin-top:8px;}
/* SETTINGS */
.settings-sec{background:#0d1022;border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:22px;margin-bottom:14px;}
.sec-title{font-size:15px;font-weight:500;color:#e2e8f0;margin-bottom:3px;}
.sec-sub{font-size:13px;color:#374151;margin-bottom:18px;}
.form-row2{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:13px;}
.inp-sm{width:100%;background:#12172c;border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:9px 12px;color:#e2e8f0;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s;}
.inp-sm:focus{border-color:#7c3aed;}
.inp-sm::placeholder{color:#334155;}
.save-btn{background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;border-radius:8px;padding:9px 18px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;}
.save-btn:hover{opacity:.9;}
.sec-divider{height:1px;background:rgba(255,255,255,.06);margin:14px 0;}
.danger-btn{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.18);border-radius:8px;padding:9px 18px;color:#f87171;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;}
/* TOAST */
.toast{position:fixed;bottom:18px;right:18px;background:#0d1022;border:1px solid rgba(16,185,129,.3);border-radius:10px;padding:11px 16px;font-size:13px;color:#34d399;z-index:999;box-shadow:0 8px 30px rgba(0,0,0,.5);}
/* SCROLLBAR */
.content::-webkit-scrollbar{width:5px;}
.content::-webkit-scrollbar-track{background:transparent;}
.content::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:99px;}
`;

const ScanIcon = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
const GridIcon = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const ClockIcon = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CardIcon = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const GearIcon = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const LogoutIcon = ({s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const UploadIcon = ({s=24}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
const DocIcon = ({s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const CopyIcon = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const CheckIcon = ({s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

const delay = ms => new Promise(r => setTimeout(r, ms));

const SCANS = [
  {id:1,name:"Invoice_Q1_2026.jpg",date:"Apr 17, 2026",words:342,type:"Invoice"},
  {id:2,name:"Contract_NDA_Acme.png",date:"Apr 15, 2026",words:1205,type:"Contract"},
  {id:3,name:"Receipt_Hotel_NYC.jpg",date:"Apr 12, 2026",words:87,type:"Receipt"},
  {id:4,name:"Medical_Report_DrLee.png",date:"Apr 10, 2026",words:876,type:"Medical"},
  {id:5,name:"Passport_ID_Scan.jpg",date:"Apr 8, 2026",words:234,type:"ID"},
];

const TYPE_CLS = {Invoice:"bb",Contract:"ba",Receipt:"bg",Medical:"bp",ID:"bc"};

const PLANS = [
  {id:"free",name:"Free",price:"$0",period:"/month",pop:false,features:["10 scans/month","Basic text extraction","JPG & PNG support","Email support"]},
  {id:"pro",name:"Pro",price:"$12",period:"/month",pop:true,features:["100 scans/month","Advanced AI OCR","All image formats","Priority support","API access","Export to Word / PDF"]},
  {id:"business",name:"Business",price:"$49",period:"/month",pop:false,features:["Unlimited scans","Batch processing","Team collaboration","Dedicated support","Custom integrations","SLA guarantee","Admin dashboard"]},
];

export default function App() {
  const [screen, setScreen]   = useState("login");
  const [page, setPage]       = useState("dashboard");
  const [user, setUser]       = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [loginD, setLoginD]   = useState({email:"",password:""});
  const [regD, setRegD]       = useState({name:"",email:"",password:"",confirm:""});
  const [authErr, setAuthErr] = useState("");
  const [authLoad, setAuthLoad] = useState(false);
  const [file, setFile]         = useState(null);
  const [imgSrc, setImgSrc]     = useState(null);
  const [extracted, setExtracted] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanErr, setScanErr]   = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied]     = useState(false);
  const fileRef = useRef(null);
  const [selPlan, setSelPlan]   = useState("pro");
  const [paying, setPaying]     = useState(false);
  const [payDone, setPayDone]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [theme, setTheme] = useState("dark");
  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };


  /* ─── AUTH ─── */
  const doLogin = async e => {
    e.preventDefault(); setAuthErr("");
    if (!loginD.email || !loginD.password) return setAuthErr("Please fill in all fields.");
    setAuthLoad(true); 
    
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(loginD)
      });
      
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      
      setUser(data.user); // Instantly reflects DB data in the UI
      setScreen("app");
    } catch(err) {
      setAuthErr("Login failed. Check your credentials.");
    } finally {
      setAuthLoad(false);
    }
  };

  const doRegister = async e => {
    e.preventDefault(); setAuthErr("");
    if (!regD.name || !regD.email || !regD.password) return setAuthErr("Please fill in all fields.");
    if (regD.password !== regD.confirm) return setAuthErr("Passwords do not match.");
    if (regD.password.length < 6) return setAuthErr("Password must be at least 6 characters.");
    setAuthLoad(true); await delay(900);
    const p = regD.name.trim().split(" ");
    const av = (p[0][0]+(p[1]?.[0]||"")).toUpperCase();
    setUser({name:regD.name,email:regD.email,plan:"Free",avatar:av,used:0,total:10});
    setScreen("app"); setAuthLoad(false);
  };

  /* ─── SCANNER ─── */
  const selectFile = f => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setScanErr("Only image files are supported (JPG, PNG, WEBP)."); return; }
    setScanErr(""); setExtracted(""); setFile(f);
    const r = new FileReader();
    r.onload = e => setImgSrc(e.target.result);
    r.readAsDataURL(f);
  };

  const doExtract = async () => {
    if (!file) return;
    setScanning(true); setScanErr(""); setExtracted("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Call your local Python backend
      const resp = await fetch("http://localhost:8000/api/extract", {
        method: "POST",
        body: formData,
      });
      
      if (!resp.ok) throw new Error("API error");
      const data = await resp.json();
      
      setExtracted(data.extracted_text);
      setUser(prev=>({...prev,used:Math.min(prev.used+1,prev.total)}));
      showToast("Text extracted successfully!");
    } catch {
      setScanErr("Extraction failed. Ensure the Python backend is running.");
    } finally { setScanning(false); }
  };



  const doCopy = () => {
    navigator.clipboard.writeText(extracted).then(()=>{setCopied(true); setTimeout(()=>setCopied(false),2000);});
  };

  /* ─── PAYMENT ─── */
  const doPay = async () => {
    setPaying(true);
    
    try {
      const planAmount = selPlan === "pro" ? 12 : 49;
      
      // 1. Create order on the backend
      const orderRes = await fetch("http://localhost:8000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: planAmount, email: user.email })
      });
      const order = await orderRes.json();

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your test key
        amount: order.amount,
        currency: order.currency,
        name: "DocScan AI",
        description: `${selPlan.toUpperCase()} Plan Subscription`,
        order_id: order.id,
        handler: function (response) {
          // 3. Handle Success - Update DB and State here
          const label = selPlan.charAt(0).toUpperCase() + selPlan.slice(1);
          setUser(prev => ({...prev, plan: label})); // Update local state immediately
          setPayDone(true);
          showToast(`🎉 Upgraded to ${label} plan!`);
          setTimeout(()=>{ setPayDone(false); setPage("dashboard"); }, 2200);
          
          // Note: In production, send response.razorpay_payment_id to your backend to verify signature
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#7c3aed" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        showToast("Payment failed or cancelled.");
      });
      rzp.open();

    } catch (err) {
      showToast("Failed to initiate payment.");
    } finally {
      setPaying(false);
    }
  };

  /* ─── RENDER CONTENT ─── */
  const pct = user ? Math.round((user.used/user.total)*100) : 0;

  const renderPage = () => {
    if (page==="dashboard") return (
      <div className="page">
        <div className="page-hdr">
          <div className="page-title">Good morning, {user?.name?.split(" ")[0]} 👋</div>
          <div className="page-sub">Here's an overview of your document activity</div>
        </div>

        <div className="stats-grid">
          {[
            {lbl:"Total Scans",val:user?.used||47,chg:"+12 this month",bg:"rgba(124,58,237,.12)",c:"#a78bfa"},
            {lbl:"Words Extracted",val:"84.2K",chg:"+8.1K this week",bg:"rgba(16,185,129,.1)",c:"#10b981"},
            {lbl:"Files Saved",val:38,chg:"+5 today",bg:"rgba(99,102,241,.12)",c:"#818cf8"},
            {lbl:"Accuracy Rate",val:"98.6%",chg:"Above average",bg:"rgba(245,158,11,.1)",c:"#f59e0b"},
          ].map((s,i)=>(
            <div className="stat-card" key={i}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div className="stat-lbl">{s.lbl}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-chg">{s.chg}</div>
                </div>
                <div className="stat-icon" style={{background:s.bg}}>
                  <span style={{color:s.c}}><DocIcon s={16}/></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-hdr">
            <span className="card-title">Monthly Usage</span>
            <span style={{fontSize:"12px",color:"#374151"}}>{user?.used}/{user?.total} scans used</span>
          </div>
          <div className="prog-wrap">
            <div className="prog-bar"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"8px"}}>
              <span style={{fontSize:"12px",color:"#374151"}}>{pct}% of monthly quota used</span>
              <span onClick={()=>setPage("payment")} style={{fontSize:"12px",color:"#8b5cf6",cursor:"pointer"}}>Upgrade plan →</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            <span className="card-title">Recent Scans</span>
            <button className="btn-ghost" onClick={()=>setPage("scanner")}>+ New Scan</button>
          </div>
          <table className="tbl">
            <thead><tr><th>File Name</th><th>Type</th><th>Words</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {SCANS.map(s=>(
                <tr key={s.id}>
                  <td style={{color:"#e2e8f0"}}>
                    <span style={{marginRight:"7px",opacity:.5}}><DocIcon/></span>{s.name}
                  </td>
                  <td><span className={`badge ${TYPE_CLS[s.type]||"bb"}`}>{s.type}</span></td>
                  <td>{s.words.toLocaleString()}</td>
                  <td>{s.date}</td>
                  <td><span className="badge bg">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    if (page==="scanner") return (
      <div className="page">
        <div className="page-hdr">
          <div className="page-title">Document Scanner</div>
          <div className="page-sub">Upload an image to extract text using Claude AI</div>
        </div>
        <div className="scan-layout">
          <div>
            <div
              className={`dropzone${dragging?" drag":""}`}
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);selectFile(e.dataTransfer.files[0]);}}
            >
              <div className="dz-icon"><span style={{color:"#a78bfa"}}><UploadIcon s={24}/></span></div>
              {!file ? (
                <>
                  <div className="dz-title">Drop your document here</div>
                  <div className="dz-sub">or click to browse files</div>
                  <div style={{marginTop:"10px",fontSize:"12px",color:"#1e293b"}}>Supports: JPG · PNG · WEBP · GIF</div>
                </>
              ) : (
                <>
                  <div className="dz-title" style={{color:"#34d399"}}>✓ {file.name}</div>
                  <div className="dz-sub">Click to change file</div>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>selectFile(e.target.files[0])} />
            </div>

            {imgSrc && <img src={imgSrc} alt="Preview" className="preview-img"/>}
            {scanErr && <div className="err-box" style={{marginTop:"12px"}}>{scanErr}</div>}

            <button className="extract-btn" onClick={doExtract} disabled={!file||scanning}>
              {scanning ? <><div className="spin"/><span>Extracting text...</span></> : <><ScanIcon s={15}/><span>Extract Text with AI</span></>}
            </button>

            {extracted && (
              <div style={{marginTop:"12px",padding:"10px 14px",background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",borderRadius:"9px",fontSize:"13px",color:"#34d399"}}>
                ✓ Extraction complete — {extracted.split(/\s+/).filter(Boolean).length} words found
              </div>
            )}
          </div>

          <div className="result-box">
            <div className="result-hdr">
              <span style={{fontSize:"13.5px",fontWeight:500,color:"#94a3b8"}}>Extracted Text</span>
              {extracted && (
                <button className="copy-btn" onClick={doCopy}>
                  <CopyIcon/> {copied ? "Copied!" : "Copy text"}
                </button>
              )}
            </div>
            {scanning ? (
              <div className="scan-anim">
                <span style={{fontSize:"13px",color:"#374151"}}>AI is analyzing your document…</span>
                <div className="scan-track"><div className="scan-line"/></div>
                <span style={{fontSize:"12px",color:"#1e293b"}}>This usually takes a few seconds</span>
              </div>
            ) : extracted ? (
              <div className="result-body">{extracted}</div>
            ) : (
              <div className="result-empty">
                <span style={{fontSize:"30px"}}>📄</span>
                <span style={{fontSize:"14px",color:"#374151"}}>No text extracted yet</span>
                <span style={{fontSize:"12px",color:"#1e293b"}}>Upload a document and click Extract</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    if (page==="history") return (
      <div className="page">
        <div className="page-hdr">
          <div className="page-title">Scan History</div>
          <div className="page-sub">All your previously scanned documents</div>
        </div>
        <div className="card">
          <div className="card-hdr">
            <span className="card-title">All Documents ({SCANS.length})</span>
            <div style={{display:"flex",gap:"8px"}}>
              {["Filter","Export"].map(l=>(
                <button key={l} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"7px",padding:"5px 12px",color:"#475569",fontSize:"12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{l}</button>
              ))}
            </div>
          </div>
          <table className="tbl">
            <thead><tr><th>File Name</th><th>Type</th><th>Words Extracted</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {SCANS.map(s=>(
                <tr key={s.id}>
                  <td style={{color:"#e2e8f0"}}><span style={{marginRight:"7px",opacity:.4}}><DocIcon/></span>{s.name}</td>
                  <td><span className={`badge ${TYPE_CLS[s.type]||"bb"}`}>{s.type}</span></td>
                  <td>{s.words.toLocaleString()} words</td>
                  <td>{s.date}</td>
                  <td>
                    <span style={{color:"#8b5cf6",cursor:"pointer",fontSize:"12px"}}>View</span>
                    <span style={{color:"#1e293b",margin:"0 6px"}}>·</span>
                    <span style={{color:"#475569",cursor:"pointer",fontSize:"12px"}}>Download</span>
                    <span style={{color:"#1e293b",margin:"0 6px"}}>·</span>
                    <span style={{color:"#4b3535",cursor:"pointer",fontSize:"12px"}}>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    if (page==="payment") return (
      <div className="page">
        <div className="page-hdr">
          <div className="page-title">Billing & Plans</div>
          <div className="page-sub">Choose the plan that works best for you</div>
        </div>
        {payDone ? (
          <div style={{textAlign:"center",padding:"70px 20px"}}>
            <div style={{fontSize:"52px",marginBottom:"16px"}}>🎉</div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:"22px",fontWeight:700,color:"#f1f5f9",marginBottom:"8px"}}>Payment Successful!</div>
            <div style={{color:"#374151",fontSize:"14px"}}>Your plan has been upgraded. Redirecting to dashboard…</div>
          </div>
        ) : (
          <>
            <div className="plans-grid">
              {PLANS.map(p=>(
                <div key={p.id} className={`plan-card${selPlan===p.id?" sel":""}`} onClick={()=>setSelPlan(p.id)}>
                  {p.pop && <div className="plan-pop">Most Popular</div>}
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-price">{p.price}<span>{p.period}</span></div>
                  <div className="plan-divider"/>
                  {p.features.map((f,i)=>(
                    <div className="plan-feat" key={i}>
                      <span className="feat-check"><CheckIcon s={12}/></span>{f}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="subscribe-wrap">
              <div style={{fontSize:"13px",color:"#374151",marginBottom:"14px"}}>
                Current plan: <strong style={{color:"#c4b5fd"}}>{user?.plan}</strong> · All plans include a 14-day free trial
              </div>
              <button
                disabled={paying}
                onClick={doPay}
                style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",border:"none",borderRadius:"11px",padding:"13px 42px",color:"#fff",fontFamily:"'DM Sans',sans-serif",fontSize:"15px",fontWeight:500,cursor:paying?"not-allowed":"pointer",opacity:paying?.65:1,display:"inline-flex",alignItems:"center",gap:"9px"}}
              >
                {paying && <div className="spin"/>}
                {paying ? "Processing…" : `Subscribe to ${PLANS.find(p=>p.id===selPlan)?.name} — ${PLANS.find(p=>p.id===selPlan)?.price}/mo`}
              </button>
              <div className="subscribe-note">🔒 Secure payment · Cancel anytime · No hidden fees</div>
            </div>
          </>
        )}
      </div>
    );

    if (page==="settings") return (
      <div className="page">
        <div className="page-hdr">
          <div className="page-title">Settings</div>
          <div className="page-sub">Manage your account and preferences</div>
        </div>

        <div className="settings-sec">
          <div className="sec-title">Profile Information</div>
          <div className="sec-sub">Update your personal details and public profile</div>
          <div className="form-row2">
            <div>
              <div className="lbl">First name</div>
              <input className="inp-sm" defaultValue={user?.name?.split(" ")[0]}/>
            </div>
            <div>
              <div className="lbl">Last name</div>
              <input className="inp-sm" defaultValue={user?.name?.split(" ")[1]||""}/>
            </div>
          </div>
          <div style={{marginBottom:"13px"}}>
            <div className="lbl">Email address</div>
            <input className="inp-sm" type="email" defaultValue={user?.email}/>
          </div>
          <div style={{marginBottom:"16px"}}>
            <div className="lbl">Organization (optional)</div>
            <input className="inp-sm" placeholder="Your company name"/>
          </div>
          <button className="save-btn" onClick={()=>showToast("Profile updated!")}>Save changes</button>
        </div>

        <div className="settings-sec">
          <div className="sec-title">Security</div>
          <div className="sec-sub">Update your password to keep your account safe</div>
          <div style={{marginBottom:"13px"}}>
            <div className="lbl">Current password</div>
            <input className="inp-sm" type="password" placeholder="••••••••"/>
          </div>
          <div className="form-row2">
            <div>
              <div className="lbl">New password</div>
              <input className="inp-sm" type="password" placeholder="Min. 6 characters"/>
            </div>
            <div>
              <div className="lbl">Confirm new password</div>
              <input className="inp-sm" type="password" placeholder="Repeat password"/>
            </div>
          </div>
          <button className="save-btn" onClick={()=>showToast("Password changed!")}>Change password</button>
        </div>

        <div className="settings-sec">
          <div className="sec-title">Account Management</div>
          <div className="sec-sub">Manage your subscription and account status</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0"}}>
            <div>
              <div style={{fontSize:"14px",color:"#e2e8f0",marginBottom:"2px"}}>Current Plan</div>
              <div style={{fontSize:"13px",color:"#374151"}}>{user?.plan} — renews monthly</div>
            </div>
            <button className="save-btn" onClick={()=>setPage("payment")}>Manage Plan</button>
          </div>
          <div className="sec-divider"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0"}}>
            <div>
              <div style={{fontSize:"14px",color:"#f87171",marginBottom:"2px"}}>Delete Account</div>
              <div style={{fontSize:"13px",color:"#374151"}}>Permanently remove your account and all associated data</div>
            </div>
            <button className="danger-btn">Delete Account</button>
          </div>
        </div>
      </div>
    );

    return null;
  };

  /* ─── AUTH SCREEN ─── */
  if (screen==="login") return (
    <div className="dsa">
      <link rel="stylesheet" href={FONTS}/>
      <style>{CSS}</style>
      <div className="auth-outer">
        <div className="orb1"/><div className="orb2"/>
        <div className="auth-card">
          <div className="logo">
            <div className="logo-icon"><ScanIcon s={18}/></div>
            <span className="logo-text">DocScan AI</span>
          </div>
          {authMode==="login" ? (
            <>
              <div className="auth-title">Welcome back</div>
              <div className="auth-sub">Sign in to your account to continue</div>
              <form onSubmit={doLogin}>
                {authErr && <div className="err-box">{authErr}</div>}
                <label className="lbl">Email address</label>
                <input className="inp" type="email" placeholder="you@example.com" value={loginD.email} onChange={e=>setLoginD(p=>({...p,email:e.target.value}))}/>
                <label className="lbl">Password</label>
                <input className="inp" type="password" placeholder="Your password" value={loginD.password} onChange={e=>setLoginD(p=>({...p,password:e.target.value}))}/>
                <div className="forgotlink">Forgot password?</div>
                <button className="btn-primary" type="submit" disabled={authLoad}>
                  {authLoad ? <><div className="spin"/>Signing in…</> : "Sign in"}
                </button>
              </form>
              <div className="auth-switch">Don't have an account? <span className="auth-link" onClick={()=>{setAuthMode("register");setAuthErr("");}}>Create one</span></div>
            </>
          ) : (
            <>
              <div className="auth-title">Create account</div>
              <div className="auth-sub">Start scanning documents for free today</div>
              <form onSubmit={doRegister}>
                {authErr && <div className="err-box">{authErr}</div>}
                <label className="lbl">Full name</label>
                <input className="inp" placeholder="Alex Johnson" value={regD.name} onChange={e=>setRegD(p=>({...p,name:e.target.value}))}/>
                <label className="lbl">Email address</label>
                <input className="inp" type="email" placeholder="you@example.com" value={regD.email} onChange={e=>setRegD(p=>({...p,email:e.target.value}))}/>
                <label className="lbl">Password</label>
                <input className="inp" type="password" placeholder="Min. 6 characters" value={regD.password} onChange={e=>setRegD(p=>({...p,password:e.target.value}))}/>
                <label className="lbl">Confirm password</label>
                <input className="inp" type="password" placeholder="Repeat your password" value={regD.confirm} onChange={e=>setRegD(p=>({...p,confirm:e.target.value}))}/>
                <button className="btn-primary" type="submit" disabled={authLoad}>
                  {authLoad ? <><div className="spin"/>Creating account…</> : "Create account"}
                </button>
              </form>
              <div className="auth-switch">Already have an account? <span className="auth-link" onClick={()=>{setAuthMode("login");setAuthErr("");}}>Sign in</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* ─── MAIN APP ─── */
  const NAV = [
    {id:"dashboard",label:"Dashboard",Icon:GridIcon},
    {id:"scanner",label:"Document Scanner",Icon:ScanIcon},
    {id:"history",label:"Scan History",Icon:ClockIcon},
    {id:"payment",label:"Billing & Plans",Icon:CardIcon},
    {id:"settings",label:"Settings",Icon:GearIcon},
  ];

  return (
    <div className="dsa">
      <link rel="stylesheet" href={FONTS}/>
      <style>{CSS}</style>
      {toast && <div className="toast">{toast}</div>}
      <div className="layout">
        <div className="sidebar">
          <div className="sb-logo">
            <div className="logo">
              <div className="logo-icon"><ScanIcon s={16}/></div>
              <span className="logo-text">DocScan AI</span>
            </div>
          </div>
          <div className="sb-nav">
            {NAV.map(n=>(
              <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <n.Icon s={15}/>
                <span style={{flex:1}}>{n.label}</span>
                {page===n.id && <div className="nav-dot"/>}
              </div>
            ))}
          </div>
          <div className="sb-bottom">
              <button 
                onClick={toggleTheme} 
                style={{width:"100%", padding:"10px", background:"transparent", border:"1px solid var(--border-color)", borderRadius:"8px", color:"var(--text-main)", cursor:"pointer", marginBottom: "10px"}}>
                {theme === "dark" ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
              </button>

            <div className="user-row">
              <div className="avatar">{user?.avatar}</div>
              <div>
                <div className="user-name">{user?.name}</div>
                <div className="user-plan">{user?.plan} Plan</div>
              </div>
            </div>
            <div className="logout-row" onClick={()=>{setScreen("login");setUser(null);setPage("dashboard");setFile(null);setImgSrc(null);setExtracted("");}}>
              <LogoutIcon s={14}/><span>Sign out</span>
            </div>
          </div>
        </div>
        <div className="content">{renderPage()}</div>
      </div>
    </div>
  );
}
