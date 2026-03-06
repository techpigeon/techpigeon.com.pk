import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ─── BRAND COLORS (from TechPigeon.org — navy + cyan blue) ────
const B = {
  navy:    "#0B1D3A",
  blue:    "#00A8E8",
  blueDk:  "#0077B6",
  blueLt:  "#EAF6FD",
  teal:    "#00C8B4",
  slate:   "#1E3A5F",
  gold:    "#F59E0B",
  white:   "#FFFFFF",
  g50:     "#F8FAFC",
  g100:    "#F1F5F9",
  g200:    "#E2E8F0",
  g400:    "#94A3B8",
  g600:    "#475569",
  g800:    "#1E293B",
  green:   "#10B981",
  red:     "#EF4444",
  orange:  "#F97316",
};

// ─── MOCK DATA ────────────────────────────────────────────────
const PLANS = [
  { id:"p1", name:"Starter",  slug:"starter",  price_m:1399, price_a:1049, disk:"10 GB NVMe", bw:"100 GB", sites:"1 Website",    features:["cPanel Access","Free SSL","Daily Backups","5 Email Accounts","2 Databases","99.9% Uptime"] },
  { id:"p2", name:"Pro",      slug:"pro",       price_m:3599, price_a:2699, disk:"50 GB NVMe", bw:"Unlimited", sites:"5 Websites", featured:true, features:["cPanel Access","Free SSL + CDN","Daily Backups + Restore","25 Email Accounts","10 Databases","Priority Support","Free .pk Domain","99.9% Uptime"] },
  { id:"p3", name:"Business", slug:"business",  price_m:8399, price_a:6299, disk:"200 GB NVMe",bw:"Unlimited", sites:"Unlimited",  features:["cPanel Access","Free SSL + CDN + DDoS","Hourly Backups","Unlimited Emails","Unlimited DBs","Dedicated IP","24/7 Premium Support","99.99% Uptime"] },
];
const COURSES = [
  { id:"c1", slug:"aws",      title:"AWS Cloud Practitioner Essentials", level:"Beginner",     cat:"Cloud",     emoji:"☁️",  bg:"#EAF6FD", hrs:18, mods:12, price:8999,  instructor:"Usman Tariq",   desc:"Master AWS fundamentals and pass the CLF-C02 certification." },
  { id:"c2", slug:"sec",      title:"CompTIA Security+ Full Prep",       level:"Intermediate", cat:"Security",  emoji:"🛡️", bg:"#ECFDF5", hrs:32, mods:20, price:12999, instructor:"Ayesha Raza",   desc:"Cybersecurity training covering threats and risk management." },
  { id:"c3", slug:"ccna",     title:"CCNA: Cisco Networking Bootcamp",   level:"Intermediate", cat:"Networking",emoji:"🌐",  bg:"#F5F3FF", hrs:40, mods:24, price:14999, instructor:"Bilal Ahmad",   desc:"Routing, switching and protocols for the CCNA 200-301 exam." },
  { id:"c4", slug:"linux",    title:"Linux System Administration",       level:"Beginner",     cat:"Linux",     emoji:"🐧",  bg:"#FFF7ED", hrs:22, mods:15, price:8999,  instructor:"Tariq Mehmood", desc:"Command line, file systems and server configuration." },
  { id:"c5", slug:"docker",   title:"Docker & Kubernetes Mastery",       level:"Advanced",     cat:"DevOps",    emoji:"🐳",  bg:"#F0FDFA", hrs:28, mods:18, price:11999, instructor:"Sana Sheikh",   desc:"Container orchestration and production Kubernetes clusters." },
  { id:"c6", slug:"hacking",  title:"Ethical Hacking & Pen Testing",     level:"Intermediate", cat:"Security",  emoji:"🔐",  bg:"#FFF1F2", hrs:36, mods:22, price:15999, instructor:"Hassan Ali",    desc:"Offensive security techniques used by professional pentesters." },
];
const TLDS = [
  {ext:".com",pkr:3499},{ext:".net",pkr:3199},{ext:".org",pkr:2999},{ext:".pk",pkr:1099},
  {ext:".com.pk",pkr:999},{ext:".io",pkr:10999},{ext:".co",pkr:6899},{ext:".info",pkr:2499},
];

// ─── SHARED COMPONENTS ────────────────────────────────────────
const PigeonLogo = ({ size=38, textSize="1.4rem" }) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={B.blue}/>
      <path d="M20 8C14 8 10 13 10 18C10 21 11.5 23.5 14 25L12 30L17 27C18 27.5 19 28 20 28C26 28 30 23 30 18C30 13 26 8 20 8Z" fill="white" opacity="0.9"/>
      <circle cx="16" cy="17" r="1.5" fill={B.navy}/>
      <path d="M28 14L32 11L29 16" fill={B.gold} stroke={B.gold} strokeWidth="0.5"/>
    </svg>
    <span style={{fontFamily:"'DM Serif Display',serif",fontSize:textSize,color:B.navy,fontWeight:400}}>TechPigeon</span>
  </div>
);

const Btn = ({ children, variant="primary", size="md", full=false, onClick, disabled=false, style={} }) => {
  const [h,setH] = useState(false);
  const s = {
    fontFamily:"'DM Sans',sans-serif", fontWeight:600, border:"none",
    borderRadius:12, cursor:disabled?"not-allowed":"pointer",
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8,
    transition:"all 0.2s", width:full?"100%":"auto", opacity:disabled?0.6:1,
    padding: size==="lg"?"14px 32px":size==="sm"?"8px 18px":"11px 24px",
    fontSize: size==="lg"?"1rem":size==="sm"?"0.82rem":"0.9rem",
  };
  const v = {
    primary: {background:h&&!disabled?B.blueDk:B.blue,color:"white",boxShadow:h?"0 6px 22px rgba(0,168,232,0.4)":"0 4px 16px rgba(0,168,232,0.25)",transform:h&&!disabled?"translateY(-1px)":"none"},
    outline:  {background:h&&!disabled?B.blueLt:"transparent",color:B.blue,border:`2px solid ${B.blue}`},
    navy:     {background:h&&!disabled?B.slate:B.navy,color:"white",boxShadow:"0 4px 14px rgba(11,29,58,0.3)"},
    white:    {background:h&&!disabled?B.blueLt:"white",color:B.blue,boxShadow:"0 4px 14px rgba(0,0,0,0.1)"},
    ghost:    {background:h&&!disabled?B.g100:"transparent",color:B.g600},
    danger:   {background:h&&!disabled?"#DC2626":B.red,color:"white"},
    success:  {background:h&&!disabled?"#059669":B.green,color:"white"},
    teal:     {background:h&&!disabled?"#00B0A0":B.teal,color:"white"},
  };
  return <button style={{...s,...(v[variant]||v.primary),...style}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={disabled?undefined:onClick}>{children}</button>;
};

const Input = ({label,type="text",placeholder,value,onChange,error,icon,hint}) => (
  <div style={{marginBottom:18}}>
    {label&&<label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:B.g800,marginBottom:7}}>{label}</label>}
    <div style={{position:"relative"}}>
      {icon&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:"1rem"}}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value||""} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",padding:`12px ${icon?"12px 12px 12px 40px":"16px"}`,border:`1.5px solid ${error?B.red:B.g200}`,borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",color:B.navy,outline:"none",boxSizing:"border-box",background:"white",transition:"border-color 0.2s"}}
        onFocus={e=>{e.target.style.borderColor=B.blue;e.target.style.boxShadow=`0 0 0 3px rgba(0,168,232,0.1)`}}
        onBlur={e=>{e.target.style.borderColor=error?B.red:B.g200;e.target.style.boxShadow="none"}}
      />
    </div>
    {hint&&!error&&<p style={{fontSize:"0.78rem",color:B.g400,marginTop:4}}>{hint}</p>}
    {error&&<p style={{fontSize:"0.78rem",color:B.red,marginTop:4}}>⚠ {error}</p>}
  </div>
);

const Select = ({label,value,onChange,options}) => (
  <div style={{marginBottom:18}}>
    {label&&<label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:B.g800,marginBottom:7}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"12px 16px",border:`1.5px solid ${B.g200}`,borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",color:B.navy,outline:"none",background:"white"}}>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);

const Badge = ({children,color=B.blue,bg=B.blueLt,style={}}) => (
  <span style={{background:bg,color,padding:"3px 10px",borderRadius:100,fontSize:"0.75rem",fontWeight:600,...style}}>{children}</span>
);

const Alert = ({type="info",children}) => {
  const t={success:{bg:"#D1FAE5",border:"#A7F3D0",text:"#065F46"},error:{bg:"#FEE2E2",border:"#FECACA",text:"#991B1B"},info:{bg:B.blueLt,border:"#BAE6FD",text:B.blueDk},warning:{bg:"#FEF3C7",border:"#FDE68A",text:"#92400E"}};
  return <div style={{background:t[type].bg,border:`1px solid ${t[type].border}`,color:t[type].text,padding:"12px 16px",borderRadius:12,fontSize:"0.88rem",marginBottom:16}}>{children}</div>;
};

const Modal = ({open,onClose,title,children,width=500}) => {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:"white",borderRadius:20,padding:32,width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.4rem",color:B.navy}}>{title}</h3>
          <button onClick={onClose} style={{background:B.g100,border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:"1.1rem",color:B.g600}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Table = ({cols,rows,onRowClick}) => (
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.88rem"}}>
      <thead>
        <tr style={{borderBottom:`2px solid ${B.g200}`}}>
          {cols.map(c=><th key={c.key||c.label} style={{padding:"12px 16px",textAlign:"left",color:B.g400,fontWeight:600,fontSize:"0.78rem",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,i)=>(
          <tr key={i} onClick={()=>onRowClick&&onRowClick(row)} style={{borderBottom:`1px solid ${B.g100}`,cursor:onRowClick?"pointer":"default",transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=B.g50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {cols.map(c=><td key={c.key||c.label} style={{padding:"14px 16px",color:B.g800,verticalAlign:"middle"}}>{c.render?c.render(row[c.key],row):row[c.key]}</td>)}
          </tr>
        ))}
        {!rows.length&&<tr><td colSpan={cols.length} style={{padding:"32px",textAlign:"center",color:B.g400}}>No records found.</td></tr>}
      </tbody>
    </table>
  </div>
);

const StatCard = ({label,value,sub,icon,color=B.blue}) => (
  <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:16,right:16,width:44,height:44,background:`${color}15`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>{icon}</div>
    <div style={{fontSize:"0.8rem",color:B.g400,marginBottom:8,fontWeight:500}}>{label}</div>
    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.9rem",color:B.navy,marginBottom:4}}>{value}</div>
    {sub&&<div style={{fontSize:"0.78rem",color:color}}>{sub}</div>}
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────
const Navbar = ({page,setPage,user,logout}) => (
  <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${B.g200}`,padding:"0 5%",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
    <div onClick={()=>setPage("home")} style={{cursor:"pointer"}}><PigeonLogo/></div>
    <div style={{display:"flex",gap:4}}>
      {["home","domains","hosting","training"].map(p=>(
        <a key={p} onClick={()=>setPage(p)} style={{padding:"8px 14px",borderRadius:8,fontSize:"0.9rem",fontWeight:500,color:page===p?B.blue:B.g600,background:page===p?B.blueLt:"transparent",cursor:"pointer",textDecoration:"none",textTransform:"capitalize"}}>{p}</a>
      ))}
    </div>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      {user ? <>
        {user.role==="admin"&&<Btn size="sm" variant="teal" onClick={()=>setPage("admin")}>⚡ Admin</Btn>}
        <Btn size="sm" variant="outline" onClick={()=>setPage("dashboard")}>📊 Dashboard</Btn>
        <div style={{width:34,height:34,background:B.navy,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"0.85rem",fontWeight:700,cursor:"pointer"}} onClick={()=>setPage("dashboard")}>
          {(user.first_name||"U")[0].toUpperCase()}
        </div>
        <Btn size="sm" variant="ghost" onClick={logout}>Sign Out</Btn>
      </> : <>
        <Btn size="sm" variant="outline" onClick={()=>setPage("login")}>Sign In</Btn>
        <Btn size="sm" onClick={()=>setPage("register")}>Get Started</Btn>
      </>}
    </div>
  </nav>
);

const Footer = ({setPage}) => (
  <footer style={{background:B.navy,color:"rgba(255,255,255,0.65)",padding:"60px 5% 32px"}}>
    <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:48,marginBottom:40}}>
      <div>
        <div style={{marginBottom:16}}><PigeonLogo textSize="1.5rem"/></div>
        <p style={{fontSize:"0.88rem",lineHeight:1.7,maxWidth:240,color:"rgba(255,255,255,0.55)"}}>Reliable domains, cloud hosting, and expert IT training for businesses across Pakistan and beyond.</p>
        <div style={{marginTop:20,display:"flex",gap:10}}>
          {["📧 info@techpigeon.org","📞 +92 300 0000000"].map(c=><div key={c} style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.45)"}}>{c}</div>)}
        </div>
        <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.35)",marginTop:8}}>📍 Rawalpindi, Punjab, Pakistan</p>
      </div>
      {[["Services",[["Domains","domains"],["Hosting","hosting"],["Training","training"],["SSL Certificates",""],["Business Email",""]]],
        ["Company",[["About Us",""],["Blog",""],["Careers",""],["Partners",""],["Press Kit",""]]],
        ["Support",[["Help Center",""],["Contact Us",""],["Status Page",""],["API Docs",""],["Community",""]]],
      ].map(([t,links])=>(
        <div key={t}>
          <h4 style={{color:"white",fontSize:"0.88rem",fontWeight:600,marginBottom:16}}>{t}</h4>
          {links.map(([l,p])=><a key={l} onClick={()=>p&&setPage(p)} style={{display:"block",fontSize:"0.85rem",color:"rgba(255,255,255,0.45)",textDecoration:"none",marginBottom:10,cursor:"pointer",transition:"color 0.2s"}}>{l}</a>)}
        </div>
      ))}
    </div>
    <div style={{maxWidth:1200,margin:"0 auto",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:24,display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:"rgba(255,255,255,0.3)"}}>
      <span>© 2024 TechPigeon (TSN Pakistan). All rights reserved.</span>
      <span>Privacy Policy · Terms of Service · Sitemap</span>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════
const HomePage = ({setPage}) => (
  <div>
    {/* HERO */}
    <section style={{padding:"90px 5% 70px",background:"linear-gradient(155deg,#EAF6FD 0%,#FAFBFF 40%,#E8F7FD 100%)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-100,right:-50,width:600,height:600,background:"radial-gradient(circle,rgba(0,168,232,0.08),transparent 70%)",borderRadius:"50%"}}/>
      <div style={{position:"absolute",bottom:-100,left:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(0,200,180,0.05),transparent 70%)",borderRadius:"50%"}}/>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",position:"relative"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",border:`1px solid ${B.g200}`,padding:"6px 16px 6px 8px",borderRadius:100,fontSize:"0.82rem",fontWeight:500,color:B.blue,marginBottom:24,boxShadow:"0 4px 20px rgba(0,168,232,0.1)"}}>
            <span style={{background:B.blue,color:"white",padding:"2px 10px",borderRadius:100,fontSize:"0.73rem",fontWeight:700}}>NEW</span>
            Cloud VPS from Rs. 1,399/mo · Free .pk Domain included
          </div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(2.2rem,4vw,3.2rem)",lineHeight:1.15,color:B.navy,marginBottom:20}}>
            Pakistan's Most Trusted<br/><em style={{color:B.blue,fontStyle:"italic"}}>Digital Partner</em>
          </h1>
          <p style={{fontSize:"1.05rem",color:B.g600,lineHeight:1.75,marginBottom:36,maxWidth:480}}>
            Domains, cloud hosting, and expert IT training — everything your business needs to build, launch, and grow online with confidence.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <Btn size="lg" onClick={()=>setPage("domains")}>🔍 Find Your Domain</Btn>
            <Btn size="lg" variant="outline" onClick={()=>setPage("hosting")}>View Hosting Plans</Btn>
          </div>
          <div style={{display:"flex",gap:32,marginTop:44,paddingTop:32,borderTop:`1px solid ${B.g200}`}}>
            {[["50K+","Domains Registered"],["12K+","Happy Clients"],["99.9%","Uptime SLA"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.9rem",color:B.navy}}>{n}</div>
                <div style={{fontSize:"0.82rem",color:B.g400,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Floating Cards */}
        <div style={{display:"grid",gap:14}}>
          {[
            {title:"Domain Status",content:<><div style={{fontWeight:700,color:B.navy}}>techpigeon.org</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}><span style={{fontSize:"0.82rem",color:B.g600}}>Renewed · Expires Dec 2026</span><Badge bg="#D1FAE5" color="#065F46">✓ Active</Badge></div></>},
            {title:"Cloud Pro Hosting",content:<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:"0.88rem",color:B.g600}}>CPU <b style={{color:B.navy}}>34%</b> · RAM <b style={{color:B.navy}}>1.2 GB</b></div><div style={{fontSize:"0.8rem",color:B.green,marginTop:5}}>▲ All systems operational</div></div><div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.5rem",color:B.navy}}>Rs.3,599<span style={{fontSize:"0.8rem",color:B.g400,fontFamily:"sans-serif"}}>/mo</span></div></div>},
            {title:"AWS Course Progress",content:<><div style={{fontWeight:600,color:B.navy,marginBottom:10}}>AWS Cloud Practitioner</div><div style={{background:B.g200,borderRadius:100,height:8}}><div style={{background:B.blue,width:"72%",height:"100%",borderRadius:100}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",color:B.g400,marginTop:5}}><span>72% complete</span><span>Module 9/12</span></div></>},
          ].map((c,i)=>(
            <div key={i} style={{background:"white",borderRadius:18,padding:"18px 22px",boxShadow:"0 8px 36px rgba(11,29,58,0.1)",border:`1px solid ${B.g200}`,animation:`float${i} 4s ease-in-out infinite`,animationDelay:`${i*-1.3}s`}}>
              <div style={{fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.08em",color:B.g400,marginBottom:8,fontWeight:600}}>{c.title}</div>
              {c.content}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* SERVICES */}
    <section style={{padding:"80px 5%"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{fontSize:"0.78rem",fontWeight:700,color:B.blue,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10}}>What We Offer</div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.8rem,3vw,2.5rem)",color:B.navy,marginBottom:14}}>Everything Your Business<br/>Needs Online</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22,marginTop:44}}>
          {[{icon:"🌐",title:"Domain Registration",desc:"500+ TLD extensions. Free WHOIS privacy, DNS manager, and auto-renewal included.",page:"domains"},
            {icon:"☁️",title:"Cloud Hosting",desc:"NVMe SSD-powered servers with free SSL, CDN, daily backups, and 24/7 monitoring.",page:"hosting"},
            {icon:"🎓",title:"IT Training & Certs",desc:"Expert-led courses in cloud, networking, security. Get certified and advance your career.",page:"training"},
            {icon:"🔒",title:"SSL Certificates",desc:"DV, OV, and EV certificates with auto-renewal and one-click cPanel installation.",page:""},
            {icon:"📧",title:"Business Email",desc:"Professional email with your own domain. Microsoft 365 and Google Workspace ready.",page:""},
            {icon:"🛡️",title:"DDoS Protection",desc:"Enterprise-grade protection. Keep services online against any volumetric attack.",page:""},
          ].map(s=><SvcCard key={s.title} {...s} onClick={()=>s.page&&setPage(s.page)}/>)}
        </div>
      </div>
    </section>

    {/* PAYMENT BADGES */}
    <section style={{padding:"40px 5%",background:B.g50,borderTop:`1px solid ${B.g200}`,borderBottom:`1px solid ${B.g200}`}}>
      <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",gap:32,flexWrap:"wrap"}}>
        <span style={{fontSize:"0.85rem",color:B.g400,fontWeight:500}}>We accept:</span>
        {[["💳","JazzCash"],["📱","EasyPaisa"],["🏦","Bank Transfer"],["💳","Stripe (Cards)"],["💚","SadaPay"]].map(([i,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:7,background:"white",border:`1px solid ${B.g200}`,padding:"8px 16px",borderRadius:100,fontSize:"0.84rem",fontWeight:500,color:B.g800,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
            {i} {l}
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section style={{background:`linear-gradient(135deg, ${B.navy}, ${B.slate})`,padding:"70px 5%",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(0,168,232,0.08) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      <div style={{maxWidth:600,margin:"0 auto",position:"relative"}}>
        <div style={{fontSize:"0.8rem",color:B.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>Limited Time</div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.2rem",color:"white",marginBottom:16}}>Free .pk Domain with<br/>Any Hosting Plan</h2>
        <p style={{color:"rgba(255,255,255,0.65)",marginBottom:32,lineHeight:1.7}}>Sign up today and receive a free .pk domain for 1 year with any cloud hosting plan. Over 12,000 businesses trust TechPigeon.</p>
        <Btn size="lg" variant="white" onClick={()=>setPage("register")}>Claim Your Free Domain →</Btn>
      </div>
    </section>
    <Footer setPage={setPage}/>
  </div>
);

const SvcCard = ({icon,title,desc,onClick}) => {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick}
      style={{background:"white",border:`1.5px solid ${h?B.blue:B.g200}`,borderRadius:20,padding:28,transition:"all 0.28s",cursor:"pointer",transform:h?"translateY(-4px)":"none",boxShadow:h?"0 12px 40px rgba(0,168,232,0.12)":"none",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${B.blue},${B.teal})`,transform:h?"scaleX(1)":"scaleX(0)",transition:"transform 0.28s",transformOrigin:"left"}}/>
      <div style={{width:50,height:50,borderRadius:14,background:B.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:18}}>{icon}</div>
      <h3 style={{fontSize:"1rem",fontWeight:600,color:B.navy,marginBottom:10}}>{title}</h3>
      <p style={{fontSize:"0.88rem",color:B.g600,lineHeight:1.65,marginBottom:16}}>{desc}</p>
      <span style={{fontSize:"0.85rem",color:B.blue,fontWeight:600}}>Learn more →</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DOMAINS PAGE
// ═══════════════════════════════════════════════════════════
const DomainsPage = ({setPage}) => {
  const [q,setQ]=useState("");const [tld,setTld]=useState(".com");const [results,setResults]=useState([]);const [loading,setLoading]=useState(false);const [searched,setSearched]=useState(false);
  const search = () => {
    if (!q.trim()) return; setLoading(true);
    setTimeout(()=>{
      const n=q.toLowerCase().replace(/[^a-z0-9-]/g,"");
      setResults(TLDS.map(t=>({full:n+t.ext,ext:t.ext,available:Math.random()>0.3,price:t.pkr})).sort((a,b)=>b.available-a.available));
      setSearched(true);setLoading(false);
    },800);
  };
  return (
    <div>
      <div style={{background:`linear-gradient(135deg,${B.navy},${B.slate})`,padding:"64px 5%",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(0,168,232,0.06) 1px,transparent 1px)",backgroundSize:"36px 36px"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:"0.78rem",color:B.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10}}>Domain Registration</div>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.5rem",color:"white",marginBottom:12}}>Find Your Perfect Domain</h1>
          <p style={{color:"rgba(255,255,255,0.65)",marginBottom:32,fontSize:"1rem"}}>500+ extensions from Rs. 999/year · Free WHOIS privacy on all domains</p>
          <div style={{display:"flex",maxWidth:600,margin:"0 auto",background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="yourbusiness" style={{flex:1,border:"none",padding:"18px 20px",fontFamily:"'DM Sans',sans-serif",fontSize:"1rem",outline:"none",color:B.navy}}/>
            <select value={tld} onChange={e=>setTld(e.target.value)} style={{border:"none",borderLeft:`1px solid ${B.g200}`,padding:"0 12px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",color:B.g600,outline:"none",background:"white"}}>
              {TLDS.map(t=><option key={t.ext} value={t.ext}>{t.ext}</option>)}
            </select>
            <button onClick={search} style={{background:B.blue,color:"white",border:"none",padding:"0 28px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer",fontSize:"0.95rem",transition:"background 0.2s"}} onMouseEnter={e=>e.target.style.background=B.blueDk} onMouseLeave={e=>e.target.style.background=B.blue}>
              {loading?"⏳":"Search →"}
            </button>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:18,flexWrap:"wrap"}}>
            {TLDS.slice(0,6).map(t=>(
              <div key={t.ext} style={{background:"rgba(255,255,255,0.1)",color:"white",padding:"5px 14px",borderRadius:100,fontSize:"0.78rem",border:"1px solid rgba(255,255,255,0.2)"}}>
                {t.ext} <strong style={{color:B.teal}}>Rs.{t.pkr.toLocaleString()}/yr</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"48px 5%"}}>
        {searched&&(
          <>
            <p style={{fontWeight:600,color:B.navy,marginBottom:20,fontSize:"1rem"}}>Results for <span style={{color:B.blue}}>{q}</span></p>
            <div style={{display:"grid",gap:12,marginBottom:48}}>
              {results.map(r=>(
                <div key={r.ext} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:r.available?"#F0FDF9":"white",border:`1.5px solid ${r.available?"#A7F3D0":B.g200}`,borderRadius:14,padding:"16px 24px",transition:"border-color 0.2s"}}>
                  <div>
                    <div style={{fontWeight:600,color:B.navy,fontSize:"1.05rem"}}>{r.full}</div>
                    <div style={{fontSize:"0.82rem",color:r.available?"#059669":B.g400,marginTop:3}}>{r.available?"✓ Available":"✗ Not available"}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.3rem",color:B.navy}}>Rs.{r.price.toLocaleString()}</div>
                      <div style={{fontSize:"0.75rem",color:B.g400}}>/year</div>
                    </div>
                    {r.available?<Btn size="sm" onClick={()=>setPage("register")}>Add to Cart</Btn>:<Btn size="sm" variant="ghost" disabled>Taken</Btn>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <div style={{fontSize:"0.78rem",fontWeight:700,color:B.blue,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:20}}>Why Register with TechPigeon?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
          {[{i:"🔐",t:"Free WHOIS Privacy",d:"Keep personal info hidden from public WHOIS records at no extra cost."},
            {i:"🔄",t:"Auto-Renewal",d:"Never lose a domain. Smart auto-renewal with email reminders."},
            {i:"🖥️",t:"Advanced DNS",d:"Full DNS editor: A, AAAA, CNAME, MX, TXT, SRV records supported."},
          ].map(f=><div key={f.t} style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:22}}><div style={{fontSize:"1.6rem",marginBottom:10}}>{f.i}</div><h3 style={{fontWeight:600,color:B.navy,marginBottom:8,fontSize:"0.95rem"}}>{f.t}</h3><p style={{fontSize:"0.86rem",color:B.g600,lineHeight:1.6}}>{f.d}</p></div>)}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// HOSTING PAGE
// ═══════════════════════════════════════════════════════════
const HostingPage = ({setPage}) => {
  const [billing,setBilling]=useState("monthly");
  return (
    <div>
      <section style={{padding:"72px 5% 80px",background:"linear-gradient(155deg,#EAF6FD,#FAFBFF)",textAlign:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:B.blue,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10}}>Cloud Hosting Pakistan</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.8rem,3vw,2.5rem)",color:B.navy,marginBottom:12}}>Hosting That Scales With You</h2>
          <p style={{color:B.g600,marginBottom:32,lineHeight:1.7}}>NVMe SSD-powered · 99.9% uptime guaranteed · Free SSL on all plans</p>
          <div style={{display:"inline-flex",background:"white",border:`1px solid ${B.g200}`,borderRadius:100,padding:4,gap:4,marginBottom:52}}>
            {["monthly","annual"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{borderRadius:100,padding:"8px 22px",border:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"0.88rem",cursor:"pointer",background:billing===b?B.blue:"transparent",color:billing===b?"white":B.g600,transition:"all 0.2s"}}>
                {b==="monthly"?"Monthly":<>Annual <span style={{background:"#D1FAE5",color:"#065F46",padding:"2px 8px",borderRadius:100,fontSize:"0.7rem"}}>Save 25%</span></>}
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22,alignItems:"start",maxWidth:1000,margin:"0 auto"}}>
            {PLANS.map(p=>{
              const price=billing==="monthly"?p.price_m:p.price_a;
              return (
                <div key={p.id} style={{border:`1.5px solid ${p.featured?B.blue:B.g200}`,borderRadius:20,padding:32,background:p.featured?B.navy:"white",position:"relative",transform:p.featured?"scale(1.04)":"none",boxShadow:p.featured?"0 16px 48px rgba(0,168,232,0.2)":"none",transition:"all 0.28s"}}>
                  {p.featured&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:B.gold,color:B.navy,padding:"5px 18px",borderRadius:100,fontSize:"0.78rem",fontWeight:700,whiteSpace:"nowrap"}}>⭐ Most Popular</div>}
                  <div style={{fontSize:"0.8rem",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,color:p.featured?"rgba(255,255,255,0.5)":B.g400,marginBottom:10}}>{p.name}</div>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.5rem",color:p.featured?"white":B.navy,marginBottom:4}}>
                    Rs.{price.toLocaleString()}<sub style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",fontWeight:400,color:p.featured?"rgba(255,255,255,0.45)":B.g400}}>/mo</sub>
                  </div>
                  <div style={{fontSize:"0.84rem",color:p.featured?"rgba(255,255,255,0.55)":B.g600,marginBottom:24}}>{p.disk} · {p.bw} · {p.sites}</div>
                  <ul style={{listStyle:"none",marginBottom:28,display:"flex",flexDirection:"column",gap:10}}>
                    {p.features.map(f=><li key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:"0.88rem",color:p.featured?"rgba(255,255,255,0.82)":B.g700}}>
                      <span style={{color:p.featured?B.teal:B.green,fontWeight:700,flexShrink:0}}>✓</span>{f}
                    </li>)}
                  </ul>
                  {p.featured?<Btn full variant="white" onClick={()=>setPage("register")}>Get Started</Btn>:<Btn full onClick={()=>setPage("register")}>Get Started</Btn>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// TRAINING PAGE
// ═══════════════════════════════════════════════════════════
const TrainingPage = ({setPage}) => {
  const [filter,setFilter]=useState("All");
  const cats=["All","Cloud","Security","Networking","DevOps","Linux"];
  const visible=filter==="All"?COURSES:COURSES.filter(c=>c.cat===filter);
  return (
    <div>
      <section style={{padding:"72px 5% 60px",background:"linear-gradient(155deg,#EAF6FD,#FAFBFF)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:B.blue,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:10}}>IT Training & Certification</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16,marginBottom:36}}>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(1.8rem,3vw,2.4rem)",color:B.navy}}>Learn From Industry Experts</h2>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 18px",borderRadius:100,border:`1.5px solid ${filter===c?B.blue:B.g200}`,background:filter===c?B.blueLt:"white",color:filter===c?B.blue:B.g600,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"0.82rem",cursor:"pointer",transition:"all 0.2s"}}>{c}</button>)}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
            {visible.map(c=><CourseCard key={c.id} course={c} onEnroll={()=>setPage("register")}/>)}
          </div>
        </div>
      </section>
      <Footer setPage={setPage}/>
    </div>
  );
};

const CourseCard = ({course:c,onEnroll}) => {
  const [h,setH]=useState(false);
  const lc={Beginner:"#059669",Intermediate:"#D97706",Advanced:"#DC2626"};
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onEnroll}
      style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:20,overflow:"hidden",transition:"all 0.28s",cursor:"pointer",transform:h?"translateY(-4px)":"none",boxShadow:h?"0 12px 40px rgba(11,29,58,0.1)":"none"}}>
      <div style={{height:150,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem"}}>{c.emoji}</div>
      <div style={{padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:"0.73rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",color:lc[c.level]}}>{c.level}</span>
          <Badge>{c.cat}</Badge>
        </div>
        <h3 style={{fontSize:"0.97rem",fontWeight:600,color:B.navy,marginBottom:8,lineHeight:1.4}}>{c.title}</h3>
        <p style={{fontSize:"0.83rem",color:B.g600,lineHeight:1.6,marginBottom:14}}>{c.desc}</p>
        <p style={{fontSize:"0.8rem",color:B.g400,marginBottom:14}}>👤 {c.instructor}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:`1px solid ${B.g100}`}}>
          <span style={{fontSize:"0.8rem",color:B.g400}}>⏱ {c.hrs}h · {c.mods} modules</span>
          <span style={{fontWeight:700,color:B.navy,fontSize:"1rem"}}>Rs.{c.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════════
const AuthLayout = ({left,right}) => (
  <div style={{minHeight:"calc(100vh - 68px)",display:"flex",background:B.g50}}>
    <div style={{flex:1,background:`linear-gradient(155deg,${B.navy},${B.slate})`,padding:60,display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:360,height:360,background:"radial-gradient(circle,rgba(0,168,232,0.15),transparent 70%)",borderRadius:"50%"}}/>
      <div style={{position:"absolute",bottom:-60,left:-60,width:300,height:300,background:"radial-gradient(circle,rgba(0,200,180,0.1),transparent 70%)",borderRadius:"50%"}}/>
      <div style={{position:"relative"}}>{left}</div>
    </div>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 40px"}}>{right}</div>
  </div>
);

const LoginPage = ({setPage,onLogin}) => {
  const [email,setEmail]=useState("");const [pass,setPass]=useState("");const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const submit = () => {
    if (!email||!pass) { setErr("Please fill in all fields."); return; }
    setLoading(true); setErr("");
    setTimeout(()=>{
      setLoading(false);
      if (pass==="demo1234"||pass.length>=8) {
        const isAdmin = email.includes("admin");
        onLogin({ first_name: isAdmin?"Admin":email.split("@")[0], last_name:"User", email, role: isAdmin?"admin":"client" });
      } else { setErr("Invalid credentials. Use password: demo1234"); }
    },800);
  };
  return (
    <AuthLayout
      left={<>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.1rem",color:"white",marginBottom:14}}>Welcome Back!</h2>
        <p style={{color:"rgba(255,255,255,0.65)",lineHeight:1.7,maxWidth:340,marginBottom:36}}>Sign in to manage your domains, hosting plans, and training courses.</p>
        {[["📊","Real-time hosting metrics"],["🔔","Instant renewal alerts"],["🎯","Track certifications"],["🤝","24/7 support access"]].map(([i,t])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:14,color:"rgba(255,255,255,0.82)",fontSize:"0.9rem",marginBottom:14}}>
            <div style={{width:36,height:36,background:"rgba(255,255,255,0.1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i}</div>{t}
          </div>
        ))}
      </>}
      right={<div style={{width:"100%",maxWidth:400}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.9rem",color:B.navy,marginBottom:6}}>Sign In</h2>
        <p style={{color:B.g600,fontSize:"0.9rem",marginBottom:24}}>No account? <a onClick={()=>setPage("register")} style={{color:B.blue,fontWeight:600,cursor:"pointer"}}>Sign up free →</a></p>
        <Alert type="info">💡 <b>Demo:</b> Any email + password <b>demo1234</b> · Admin: any email with "admin"</Alert>
        {err&&<Alert type="error">{err}</Alert>}
        <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="📧"/>
        <div style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><label style={{fontSize:"0.85rem",fontWeight:600,color:B.g800}}>Password</label><a href="#" style={{fontSize:"0.82rem",color:B.blue,fontWeight:500}}>Forgot?</a></div>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••"
            style={{width:"100%",padding:"12px 16px",border:`1.5px solid ${B.g200}`,borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",color:B.navy,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <Btn full size="lg" onClick={submit}>{loading?"Signing in…":"Sign In to Dashboard"}</Btn>
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}><div style={{flex:1,height:1,background:B.g200}}/><span style={{fontSize:"0.8rem",color:B.g400}}>or</span><div style={{flex:1,height:1,background:B.g200}}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Btn variant="outline" full>🔵 Google</Btn><Btn variant="outline" full>⚫ GitHub</Btn>
        </div>
      </div>}
    />
  );
};

const RegisterPage = ({setPage,onRegister}) => {
  const [f,setF]=useState({fn:"",ln:"",email:"",phone:"",pass:"",pass2:"",terms:false});
  const [errs,setErrs]=useState({});const [loading,setLoading]=useState(false);
  const set = k => v => setF(p=>({...p,[k]:v}));
  const validate = () => {
    const e={};
    if (!f.fn.trim()) e.fn="Required";
    if (!f.ln.trim()) e.ln="Required";
    if (!f.email.includes("@")) e.email="Valid email required";
    if (f.pass.length<8) e.pass="Minimum 8 characters";
    if (f.pass!==f.pass2) e.pass2="Passwords don't match";
    if (!f.terms) e.terms="Must accept terms";
    setErrs(e); return !Object.keys(e).length;
  };
  const submit = () => {
    if (!validate()) return; setLoading(true);
    setTimeout(()=>{ setLoading(false); onRegister({first_name:f.fn,last_name:f.ln,email:f.email,role:"client"}); },900);
  };
  return (
    <AuthLayout
      left={<>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"2.1rem",color:"white",marginBottom:14}}>Start Your Digital Journey</h2>
        <p style={{color:"rgba(255,255,255,0.65)",lineHeight:1.7,maxWidth:340,marginBottom:36}}>Join 12,000+ businesses growing with TechPigeon's all-in-one platform.</p>
        {[["🌐","Domains from Rs. 999/year"],["☁️","Hosting with 99.9% uptime"],["🎓","50+ IT certification courses"],["🛡️","Free SSL on all plans"]].map(([i,t])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:14,color:"rgba(255,255,255,0.82)",fontSize:"0.9rem",marginBottom:14}}>
            <div style={{width:36,height:36,background:"rgba(255,255,255,0.1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i}</div>{t}
          </div>
        ))}
      </>}
      right={<div style={{width:"100%",maxWidth:440}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.9rem",color:B.navy,marginBottom:6}}>Create Account</h2>
        <p style={{color:B.g600,fontSize:"0.9rem",marginBottom:24}}>Already registered? <a onClick={()=>setPage("login")} style={{color:B.blue,fontWeight:600,cursor:"pointer"}}>Sign in →</a></p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="First Name" value={f.fn} onChange={set("fn")} placeholder="Ali" error={errs.fn}/>
          <Input label="Last Name"  value={f.ln} onChange={set("ln")} placeholder="Khan" error={errs.ln}/>
        </div>
        <Input label="Email" type="email" value={f.email} onChange={set("email")} placeholder="ali@example.com" error={errs.email}/>
        <Input label="Phone (optional)" type="tel" value={f.phone} onChange={set("phone")} placeholder="+92 300 0000000"/>
        <Input label="Password" type="password" value={f.pass} onChange={set("pass")} placeholder="Min. 8 characters" error={errs.pass}/>
        <Input label="Confirm Password" type="password" value={f.pass2} onChange={set("pass2")} placeholder="Repeat password" error={errs.pass2}/>
        <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"flex-start"}}>
          <input type="checkbox" checked={f.terms} onChange={e=>setF(p=>({...p,terms:e.target.checked}))} style={{marginTop:3,accentColor:B.blue,width:16,height:16}}/>
          <label style={{fontSize:"0.85rem",color:B.g600}}>I agree to the <a href="#" style={{color:B.blue}}>Terms of Service</a> and <a href="#" style={{color:B.blue}}>Privacy Policy</a></label>
        </div>
        {errs.terms&&<Alert type="error">{errs.terms}</Alert>}
        <Btn full size="lg" onClick={submit}>{loading?"Creating account…":"Create My Account"}</Btn>
      </div>}
    />
  );
};

// ═══════════════════════════════════════════════════════════
// PAYMENT MODAL
// ═══════════════════════════════════════════════════════════
const PaymentModal = ({open,onClose,order,onSuccess}) => {
  const [method,setMethod]=useState("jazzcash");const [mobile,setMobile]=useState("");const [txnRef,setTxnRef]=useState("");const [processing,setProcessing]=useState(false);const [done,setDone]=useState(false);
  const pay = () => {
    setProcessing(true);
    setTimeout(()=>{ setProcessing(false); setDone(true); setTimeout(()=>{ setDone(false); onSuccess&&onSuccess(); onClose(); },2000); },2000);
  };
  const methods=[{id:"jazzcash",name:"JazzCash",icon:"💳",desc:"Pay via JazzCash mobile wallet"},
    {id:"easypaisa",name:"EasyPaisa",icon:"📱",desc:"Pay via EasyPaisa wallet"},
    {id:"stripe",name:"Credit/Debit Card",icon:"💳",desc:"Visa, Mastercard, international cards"},
    {id:"bank",name:"Bank Transfer",icon:"🏦",desc:"Direct bank transfer (1-2 business days)"},
    {id:"sadapay",name:"SadaPay",icon:"💚",desc:"Pay with SadaPay digital account"},
  ];
  return (
    <Modal open={open} onClose={onClose} title="Complete Payment" width={520}>
      {done?<div style={{textAlign:"center",padding:"32px 0"}}><div style={{fontSize:"4rem",marginBottom:16}}>✅</div><h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy,marginBottom:8}}>Payment Successful!</h3><p style={{color:B.g600}}>Your order has been confirmed. Services activating...</p></div>:
      <>
        <div style={{background:B.blueLt,border:`1px solid ${B.blue}30`,borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",justifyContent:"space-between"}}>
          <span style={{color:B.g600,fontSize:"0.9rem"}}>Order Total</span>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.3rem",color:B.navy}}>Rs.{(order?.total||3599).toLocaleString()}</span>
        </div>
        <p style={{fontSize:"0.85rem",fontWeight:600,color:B.g800,marginBottom:12}}>Select Payment Method</p>
        <div style={{display:"grid",gap:10,marginBottom:20}}>
          {methods.map(m=>(
            <div key={m.id} onClick={()=>setMethod(m.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:14,border:`2px solid ${method===m.id?B.blue:B.g200}`,background:method===m.id?B.blueLt:"white",cursor:"pointer",transition:"all 0.2s"}}>
              <span style={{fontSize:"1.4rem"}}>{m.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,color:B.navy,fontSize:"0.9rem"}}>{m.name}</div>
                <div style={{fontSize:"0.78rem",color:B.g400}}>{m.desc}</div>
              </div>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${method===m.id?B.blue:B.g300}`,background:method===m.id?B.blue:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>{method===m.id&&<div style={{width:7,height:7,borderRadius:"50%",background:"white"}}/>}</div>
            </div>
          ))}
        </div>
        {(method==="jazzcash"||method==="easypaisa")&&<Input label="Mobile Number" value={mobile} onChange={setMobile} placeholder="+92 300 0000000" icon="📱"/>}
        {method==="bank"&&<>
          <div style={{background:B.g50,border:`1px solid ${B.g200}`,borderRadius:12,padding:16,marginBottom:16,fontSize:"0.85rem"}}>
            <div style={{fontWeight:600,color:B.navy,marginBottom:8}}>Bank Details:</div>
            <div style={{color:B.g600,lineHeight:1.8}}>Account: <b>TechPigeon (TSN Pakistan)</b><br/>Bank: <b>HBL</b><br/>Account No: <b>0123456789</b><br/>IBAN: <b>PK00HABB0000000123456789</b></div>
          </div>
          <Input label="Transaction Reference" value={txnRef} onChange={setTxnRef} placeholder="Enter bank transaction ID"/>
        </>}
        {method==="stripe"&&<Alert type="info">🌐 You'll be redirected to Stripe's secure payment page.</Alert>}
        <Btn full size="lg" onClick={pay} disabled={processing}>{processing?"Processing payment…":"Pay Now →"}</Btn>
      </>}
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════
// CLIENT DASHBOARD
// ═══════════════════════════════════════════════════════════
const DashSidebarLinks = [
  {id:"overview",icon:"📊",label:"Dashboard"},
  {id:"domains",icon:"🌐",label:"My Domains"},
  {id:"hosting",icon:"☁️",label:"Hosting"},
  {id:"training",icon:"🎓",label:"Training"},
  {id:"orders",icon:"📦",label:"Orders"},
  {id:"billing",icon:"💳",label:"Billing & Payments"},
  {id:"tickets",icon:"🎫",label:"Support Tickets"},
  {id:"notifications",icon:"🔔",label:"Notifications"},
  {id:"settings",icon:"⚙️",label:"Settings"},
];

const DashboardPage = ({user,logout,setPage}) => {
  const [tab,setTab]=useState("overview");const [payModal,setPayModal]=useState(false);const [selOrder,setSelOrder]=useState(null);
  const tabContent = {
    overview:<DashOverview user={user} setTab={setTab} setPage={setPage} openPay={(o)=>{setSelOrder(o);setPayModal(true);}}/>,
    domains:<DashDomains setPage={setPage}/>,
    hosting:<DashHosting/>,
    training:<DashTraining setPage={setPage}/>,
    orders:<DashOrders openPay={(o)=>{setSelOrder(o);setPayModal(true);}}/>,
    billing:<DashBilling openPay={(o)=>{setSelOrder(o);setPayModal(true);}}/>,
    tickets:<DashTickets/>,
    notifications:<DashNotifications/>,
    settings:<DashSettings user={user}/>,
  };
  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 68px)"}}>
      <aside style={{width:240,background:"white",borderRight:`1px solid ${B.g200}`,padding:"20px 12px",flexShrink:0,position:"sticky",top:68,height:"calc(100vh - 68px)",overflowY:"auto"}}>
        <div style={{padding:"12px 12px 20px",borderBottom:`1px solid ${B.g100}`,marginBottom:16}}>
          <div style={{fontWeight:600,color:B.navy,fontSize:"0.95rem"}}>{user?.first_name} {user?.last_name}</div>
          <div style={{fontSize:"0.78rem",color:B.g400,marginTop:2}}>{user?.email}</div>
          <Badge style={{marginTop:8}} bg="#D1FAE5" color="#065F46">✓ Active Account</Badge>
        </div>
        {DashSidebarLinks.map(l=>(
          <div key={l.id} onClick={()=>setTab(l.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,fontSize:"0.88rem",color:tab===l.id?B.blue:B.g600,fontWeight:tab===l.id?600:500,background:tab===l.id?B.blueLt:"transparent",cursor:"pointer",marginBottom:2,transition:"all 0.18s"}}>
            <span style={{fontSize:"1rem"}}>{l.icon}</span>{l.label}
          </div>
        ))}
        <div style={{borderTop:`1px solid ${B.g100}`,marginTop:16,paddingTop:16}}>
          <div onClick={logout} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,fontSize:"0.88rem",color:B.red,fontWeight:500,cursor:"pointer",transition:"all 0.18s"}}>
            <span>🚪</span>Sign Out
          </div>
        </div>
      </aside>
      <main style={{flex:1,padding:"32px 36px",background:B.g50,overflowY:"auto"}}>
        {tabContent[tab]||tabContent.overview}
      </main>
      <PaymentModal open={payModal} onClose={()=>setPayModal(false)} order={selOrder}/>
    </div>
  );
};

const DashOverview = ({user,setTab,setPage,openPay}) => (
  <div>
    <div style={{marginBottom:28}}>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.8rem",color:B.navy}}>Good morning, {user?.first_name} 👋</h2>
      <p style={{color:B.g600,fontSize:"0.9rem",marginTop:4}}>Here's an overview of your TechPigeon services.</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
      <StatCard label="Active Domains" value="3" sub="↑ 1 added this month" icon="🌐" color={B.blue}/>
      <StatCard label="Hosting Plans" value="2" sub="Pro + Starter" icon="☁️" color={B.teal}/>
      <StatCard label="Courses Enrolled" value="4" sub="72% avg progress" icon="🎓" color={B.gold}/>
      <StatCard label="Next Invoice" value="Rs.7,198" sub="Due Apr 1, 2025" icon="💳" color={B.orange}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:18,padding:24}}>
        <div style={{fontWeight:600,color:B.navy,marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          Active Services <Btn size="sm" onClick={()=>setPage("hosting")}>+ Add Service</Btn>
        </div>
        {[{icon:"🌐",name:"techpigeon.org",sub:"Expires Dec 2025",st:"active",action:"Manage"},
          {icon:"🌐",name:"mybusiness.pk",sub:"Expires Mar 2026",st:"active",action:"Manage"},
          {icon:"☁️",name:"Cloud Pro — Server 1",sub:"99.98% uptime",st:"active",action:"Console"},
          {icon:"☁️",name:"Cloud Starter",sub:"Renewal pending",st:"pending",action:"Renew"},
        ].map(s=>(
          <div key={s.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${B.g100}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:B.blueLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>{s.icon}</div>
              <div>
                <div style={{fontSize:"0.9rem",fontWeight:500,color:B.navy}}>{s.name}</div>
                <div style={{fontSize:"0.78rem",color:B.g400,marginTop:2}}><span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:s.st==="active"?B.green:B.gold,marginRight:6}}/>{s.sub}</div>
              </div>
            </div>
            <Btn size="sm" variant="outline">{s.action}</Btn>
          </div>
        ))}
      </div>
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:18,padding:24}}>
        <div style={{fontWeight:600,color:B.navy,marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>Notifications <Btn size="sm" variant="ghost" onClick={()=>setTab("notifications")}>View All</Btn></div>
        {[{icon:"⚠️",bg:"#FEF3C7",t:"Domain Expiry: mybusiness.com expires in 45 days.",time:"2h ago"},
          {icon:"✅",bg:"#D1FAE5",t:"SSL auto-renewed for techpigeon.org",time:"Yesterday"},
          {icon:"🎓",bg:B.blueLt,t:"New module available: Kubernetes Security",time:"2 days ago"},
          {icon:"💳",bg:B.blueLt,t:"Invoice #TP-1042 — Rs.7,198 due April 1",time:"3 days ago"},
        ].map(n=>(
          <div key={n.t} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:`1px solid ${B.g100}`}}>
            <div style={{width:34,height:34,background:n.bg,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>{n.icon}</div>
            <div><div style={{fontSize:"0.84rem",color:B.navy,lineHeight:1.45}}>{n.t}</div><div style={{fontSize:"0.73rem",color:B.g400,marginTop:2}}>{n.time}</div></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DashDomains = ({setPage}) => {
  const domains=[{d:"techpigeon.org",exp:"Dec 15, 2025",p:3499},{d:"mybusiness.pk",exp:"Mar 2, 2026",p:1099},{d:"portfolio.com.pk",exp:"Jan 20, 2026",p:999}];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy}}>My Domains</h2>
        <Btn onClick={()=>setPage("domains")}>+ Register Domain</Btn>
      </div>
      {domains.map(d=>(
        <div key={d.d} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"white",border:`1px solid ${B.g200}`,borderRadius:14,padding:"18px 24px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,background:B.blueLt,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>🌐</div>
            <div><div style={{fontWeight:600,color:B.navy}}>{d.d}</div><div style={{fontSize:"0.82rem",color:B.g400}}>Expires {d.exp}</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Badge bg="#D1FAE5" color="#065F46">✓ Active</Badge>
            <span style={{fontSize:"0.85rem",color:B.g600}}>Rs.{d.p.toLocaleString()}/yr</span>
            <Btn size="sm" variant="outline">Manage DNS</Btn>
            <Btn size="sm">Renew</Btn>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashHosting = () => (
  <div>
    <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy,marginBottom:24}}>Hosting Subscriptions</h2>
    {[["Cloud Pro","techpigeon.org","99.98%","42%","14.5 GB / 50 GB","Active",B.green],["Cloud Starter","portfolio.com.pk","100%","8%","0.8 GB / 10 GB","Renewal Pending",B.gold]].map(([plan,domain,uptime,cpu,disk,st,sc])=>(
      <div key={plan+domain} style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:"22px 26px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontWeight:600,color:B.navy,fontSize:"1.05rem"}}>{plan} <span style={{fontSize:"0.82rem",color:B.g400,fontWeight:400}}>— {domain}</span></div>
            <div style={{display:"flex",gap:20,marginTop:12}}>
              {[["Uptime",uptime],["CPU",cpu],["Disk",disk]].map(([l,v])=>(
                <div key={l} style={{fontSize:"0.82rem"}}><span style={{color:B.g400}}>{l}: </span><span style={{color:B.navy,fontWeight:500}}>{v}</span></div>
              ))}
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontSize:"0.78rem",color:B.g400,marginBottom:4}}>Disk Usage</div>
              <div style={{background:B.g200,borderRadius:100,height:6,width:200}}>
                <div style={{background:B.blue,width:cpu,height:"100%",borderRadius:100,transition:"width 0.4s"}}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <Badge bg={st==="Active"?"#D1FAE5":"#FEF3C7"} color={st==="Active"?"#065F46":"#92400E"}>{st}</Badge>
            <Btn size="sm" variant="outline">cPanel</Btn>
            <Btn size="sm">Manage</Btn>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const DashTraining = ({setPage}) => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy}}>My Courses</h2>
      <Btn onClick={()=>setPage("training")}>Browse Courses</Btn>
    </div>
    {[["AWS Cloud Practitioner","☁️","#EAF6FD",72,"Module 9/12"],["CompTIA Security+","🛡️","#ECFDF5",35,"Module 7/20"],["CCNA Networking","🌐","#F5F3FF",18,"Module 4/24"]].map(([t,e,bg,pct,mod])=>(
      <div key={t} style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:"20px 24px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:52,height:52,background:bg,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>{e}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,color:B.navy,marginBottom:8}}>{t}</div>
            <div style={{background:B.g200,borderRadius:100,height:8}}><div style={{background:B.blue,width:`${pct}%`,height:"100%",borderRadius:100,transition:"width 0.5s"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",color:B.g400,marginTop:5}}><span>{pct}% complete</span><span>{mod}</span></div>
          </div>
          <Btn size="sm">Continue →</Btn>
        </div>
      </div>
    ))}
  </div>
);

const DashOrders = ({openPay}) => {
  const orders=[{no:"TP-1043",date:"Mar 1, 2025",items:"Cloud Pro Hosting (Monthly)",total:3599,status:"pending"},{no:"TP-1042",date:"Feb 1, 2025",items:"techpigeon.org + SSL",total:4998,status:"paid"},{no:"TP-1041",date:"Jan 1, 2025",items:"AWS Course + Linux Admin",total:17998,status:"paid"}];
  return (
    <div>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy,marginBottom:24}}>Orders</h2>
      <Table cols={[{key:"no",label:"Order #"},{key:"date",label:"Date"},{key:"items",label:"Items"},{key:"total",label:"Amount",render:v=>`Rs.${v.toLocaleString()}`},{key:"status",label:"Status",render:v=><Badge bg={v==="paid"?"#D1FAE5":"#FEF3C7"} color={v==="paid"?"#065F46":"#92400E"}>{v==="paid"?"✓ Paid":"⏳ Pending"}</Badge>},{key:"action",label:"",render:(_,row)=>row.status==="pending"?<Btn size="sm" onClick={()=>openPay({total:row.total,no:row.no})}>Pay Now</Btn>:<Btn size="sm" variant="outline">Invoice</Btn>}]}
        rows={orders.map(o=>({...o,action:null}))}/>
    </div>
  );
};

const DashBilling = ({openPay}) => (
  <div>
    <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy,marginBottom:24}}>Billing & Payments</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
      <StatCard label="Total Spent" value="Rs.45,892" icon="💰" color={B.blue}/>
      <StatCard label="Pending Invoice" value="Rs.7,198" sub="Due Apr 1, 2025" icon="⏳" color={B.gold}/>
      <StatCard label="Payment Methods" value="3" sub="JazzCash, Stripe, Bank" icon="💳" color={B.green}/>
    </div>
    <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:18,padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h3 style={{fontWeight:600,color:B.navy}}>Recent Transactions</h3>
        <Btn size="sm" onClick={()=>openPay({total:7198})}>Pay Outstanding →</Btn>
      </div>
      <Table cols={[{key:"no",label:"Ref"},{key:"date",label:"Date"},{key:"method",label:"Method",render:v=><Badge>{v}</Badge>},{key:"amount",label:"Amount",render:v=>`Rs.${v.toLocaleString()}`},{key:"status",label:"Status",render:v=><Badge bg={v==="completed"?"#D1FAE5":"#FEF3C7"} color={v==="completed"?"#065F46":"#92400E"}>{v}</Badge>}]}
        rows={[{no:"PAY-001",date:"Feb 1",method:"JazzCash",amount:3599,status:"completed"},{no:"PAY-002",date:"Jan 1",method:"Stripe",amount:17998,status:"completed"},{no:"PAY-003",date:"Apr 1",method:"Pending",amount:7198,status:"pending"}]}/>
    </div>
  </div>
);

const DashTickets = () => {
  const [newTicket,setNewTicket]=useState(false);const [subj,setSubj]=useState("");const [msg,setMsg]=useState("");
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy}}>Support Tickets</h2>
        <Btn onClick={()=>setNewTicket(true)}>+ New Ticket</Btn>
      </div>
      <Table cols={[{key:"no",label:"Ticket #"},{key:"subject",label:"Subject"},{key:"dept",label:"Department"},{key:"priority",label:"Priority",render:v=><Badge bg={v==="urgent"?"#FEE2E2":v==="high"?"#FEF3C7":"#F1F5F9"} color={v==="urgent"?B.red:v==="high"?"#92400E":B.g600}>{v}</Badge>},{key:"status",label:"Status",render:v=><Badge bg={v==="open"?"#FEF3C7":v==="resolved"?"#D1FAE5":"#EDE9FE"} color={v==="open"?"#92400E":v==="resolved"?"#065F46":"#4C1D95"}>{v}</Badge>},{key:"date",label:"Date"}]}
        rows={[{no:"TCK-001",subject:"Domain not pointing to server",dept:"Domains",priority:"high",status:"in_progress",date:"Mar 1"},{no:"TCK-002",subject:"SSL installation help",dept:"Hosting",priority:"medium",status:"resolved",date:"Feb 28"},{no:"TCK-003",subject:"Course access issue",dept:"Training",priority:"low",status:"open",date:"Feb 25"}]}/>
      <Modal open={newTicket} onClose={()=>setNewTicket(false)} title="Submit Support Ticket">
        <Input label="Subject" value={subj} onChange={setSubj} placeholder="Briefly describe your issue"/>
        <Select label="Department" value="general" onChange={()=>{}} options={["general","domains","hosting","billing","training","technical"].map(v=>({value:v,label:v.charAt(0).toUpperCase()+v.slice(1)}))}/>
        <div style={{marginBottom:18}}>
          <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:B.g800,marginBottom:7}}>Message</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your issue in detail..." rows={5} style={{width:"100%",padding:"12px 16px",border:`1.5px solid ${B.g200}`,borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",color:B.navy,outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <Btn full onClick={()=>{alert("Ticket submitted!");setNewTicket(false);}}>Submit Ticket</Btn>
      </Modal>
    </div>
  );
};

const DashNotifications = () => (
  <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy}}>Notifications</h2>
      <Btn size="sm" variant="outline">Mark All Read</Btn>
    </div>
    {[{icon:"⚠️",bg:"#FEF3C7",title:"Domain Expiry Alert",t:"mybusiness.com expires in 45 days.",time:"2h ago",unread:true},
      {icon:"✅",bg:"#D1FAE5",title:"SSL Auto-Renewed",t:"SSL certificate renewed for techpigeon.org",time:"Yesterday",unread:true},
      {icon:"🎓",bg:B.blueLt,title:"New Course Module",t:"Module: 'Kubernetes Security Hardening' is now live.",time:"2 days ago",unread:false},
      {icon:"💳",bg:B.blueLt,title:"Invoice Generated",t:"Invoice #TP-1042 — Rs.7,198 due April 1st.",time:"3 days ago",unread:false},
    ].map(n=>(
      <div key={n.title} style={{display:"flex",gap:14,background:"white",border:`1px solid ${n.unread?B.blue:B.g200}`,borderRadius:14,padding:"16px 20px",marginBottom:12}}>
        <div style={{width:40,height:40,background:n.bg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{n.icon}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,color:B.navy,fontSize:"0.95rem"}}>{n.title}{n.unread&&<span style={{background:B.blue,color:"white",padding:"2px 8px",borderRadius:100,fontSize:"0.68rem",marginLeft:8,fontWeight:700}}>NEW</span>}</div>
          <div style={{fontSize:"0.85rem",color:B.g600,marginTop:3}}>{n.t}</div>
          <div style={{fontSize:"0.75rem",color:B.g400,marginTop:4}}>{n.time}</div>
        </div>
      </div>
    ))}
  </div>
);

const DashSettings = ({user}) => {
  const [fn,setFn]=useState(user?.first_name||"");const [ln,setLn]=useState(user?.last_name||"");const [saved,setSaved]=useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };
  return (
    <div>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:B.navy,marginBottom:24}}>Account Settings</h2>
      {saved&&<Alert type="success">✅ Changes saved successfully!</Alert>}
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:28,marginBottom:20}}>
        <h3 style={{fontWeight:600,color:B.navy,marginBottom:20}}>Personal Information</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Input label="First Name" value={fn} onChange={setFn}/>
          <Input label="Last Name"  value={ln} onChange={setLn}/>
        </div>
        <Input label="Email" value={user?.email||""} onChange={()=>{}} hint="Contact support to change your email address."/>
        <Input label="Phone" value="+92 300 0000000" onChange={()=>{}}/>
        <Btn onClick={save}>Save Changes</Btn>
      </div>
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:28,marginBottom:20}}>
        <h3 style={{fontWeight:600,color:B.navy,marginBottom:20}}>Change Password</h3>
        <Input label="Current Password" type="password" value="" onChange={()=>{}} placeholder="••••••••"/>
        <Input label="New Password" type="password" value="" onChange={()=>{}} placeholder="Min. 8 characters"/>
        <Input label="Confirm Password" type="password" value="" onChange={()=>{}} placeholder="Repeat new password"/>
        <Btn onClick={save}>Update Password</Btn>
      </div>
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:28}}>
        <h3 style={{fontWeight:600,color:B.navy,marginBottom:20}}>Two-Factor Authentication</h3>
        <p style={{color:B.g600,fontSize:"0.9rem",marginBottom:16}}>Protect your account with 2FA using an authenticator app.</p>
        <Btn variant="outline">Enable 2FA</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════
const AdminSidebar = [
  {id:"stats",icon:"📊",label:"Overview"},
  {id:"users",icon:"👥",label:"Users"},
  {id:"orders",icon:"📦",label:"Orders"},
  {id:"payments",icon:"💳",label:"Payments"},
  {id:"domains",icon:"🌐",label:"Domains"},
  {id:"hosting",icon:"☁️",label:"Hosting"},
  {id:"courses",icon:"🎓",label:"Courses"},
  {id:"tickets",icon:"🎫",label:"Tickets"},
  {id:"plans",icon:"📋",label:"Hosting Plans"},
  {id:"notify",icon:"📣",label:"Broadcast"},
];

const AdminPage = ({user,setPage,logout}) => {
  const [tab,setTab]=useState("stats");
  const content = {
    stats:<AdminStats/>, users:<AdminUsers/>, orders:<AdminOrders/>,
    payments:<AdminPayments/>, domains:<AdminDomains/>, hosting:<AdminHosting/>,
    courses:<AdminCourses/>, tickets:<AdminTickets/>, plans:<AdminPlans/>, notify:<AdminNotify/>,
  };
  return (
    <div style={{display:"flex",minHeight:"calc(100vh - 68px)"}}>
      <aside style={{width:240,background:B.navy,padding:"20px 12px",flexShrink:0,position:"sticky",top:68,height:"calc(100vh - 68px)",overflowY:"auto"}}>
        <div style={{padding:"12px 12px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <div style={{width:32,height:32,background:B.blue,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",fontWeight:700,color:"white"}}>A</div>
            <div>
              <div style={{fontWeight:600,color:"white",fontSize:"0.88rem"}}>{user?.first_name}</div>
              <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)"}}>Administrator</div>
            </div>
          </div>
        </div>
        <div style={{fontSize:"0.7rem",fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",padding:"0 12px",marginBottom:8}}>Admin Panel</div>
        {AdminSidebar.map(l=>(
          <div key={l.id} onClick={()=>setTab(l.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,fontSize:"0.88rem",color:tab===l.id?"white":"rgba(255,255,255,0.55)",fontWeight:tab===l.id?600:400,background:tab===l.id?`${B.blue}30`:"transparent",cursor:"pointer",marginBottom:2,transition:"all 0.18s"}}>
            <span style={{fontSize:"1rem"}}>{l.icon}</span>{l.label}
          </div>
        ))}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:16,paddingTop:16}}>
          <div onClick={()=>setPage("dashboard")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,fontSize:"0.88rem",color:"rgba(255,255,255,0.55)",cursor:"pointer"}}>
            <span>👤</span>Client View
          </div>
          <div onClick={logout} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,fontSize:"0.88rem",color:"rgba(255,100,100,0.7)",cursor:"pointer"}}>
            <span>🚪</span>Sign Out
          </div>
        </div>
      </aside>
      <main style={{flex:1,padding:"32px 36px",background:B.g50,overflowY:"auto"}}>
        <div style={{marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:B.blue,color:"white",padding:"3px 12px",borderRadius:100,fontSize:"0.78rem",fontWeight:700}}>ADMIN</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.5rem",color:B.navy}}>{AdminSidebar.find(l=>l.id===tab)?.label}</h2>
        </div>
        {content[tab]||<AdminStats/>}
      </main>
    </div>
  );
};

const AdminStats = () => (
  <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
      <StatCard label="Total Users" value="12,483" sub="↑ 234 this month" icon="👥" color={B.blue}/>
      <StatCard label="Revenue (MTD)" value="Rs.4.2M" sub="↑ 18% vs last month" icon="💰" color={B.green}/>
      <StatCard label="Active Domains" value="48,291" sub="↑ 1,204 new" icon="🌐" color={B.teal}/>
      <StatCard label="Open Tickets" value="17" sub="3 urgent" icon="🎫" color={B.orange}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20,marginBottom:20}}>
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:18,padding:24}}>
        <div style={{fontWeight:600,color:B.navy,marginBottom:16}}>Recent Orders</div>
        <Table cols={[{key:"no",label:"Order"},{key:"user",label:"User"},{key:"total",label:"Amount",render:v=>`Rs.${v.toLocaleString()}`},{key:"status",label:"Status",render:v=><Badge bg={v==="paid"?"#D1FAE5":"#FEF3C7"} color={v==="paid"?"#065F46":"#92400E"}>{v}</Badge>}]}
          rows={[{no:"TP-1050",user:"ali@example.com",total:8399,status:"paid"},{no:"TP-1049",user:"sara@mail.com",total:3599,status:"pending"},{no:"TP-1048",user:"john@pk.com",total:14999,status:"paid"},{no:"TP-1047",user:"m.khan@co.pk",total:1099,status:"paid"}]}/>
      </div>
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:18,padding:24}}>
        <div style={{fontWeight:600,color:B.navy,marginBottom:16}}>Revenue by Method</div>
        {[["JazzCash","Rs.1.8M",45],["Stripe","Rs.1.2M",30],["EasyPaisa","Rs.0.7M",18],["Bank Transfer","Rs.0.3M",7]].map(([m,r,pct])=>(
          <div key={m} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:6}}>
              <span style={{color:B.navy,fontWeight:500}}>{m}</span><span style={{color:B.g400}}>{r} ({pct}%)</span>
            </div>
            <div style={{background:B.g200,borderRadius:100,height:7}}><div style={{background:B.blue,width:`${pct}%`,height:"100%",borderRadius:100}}/></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminUsers = () => {
  const [search,setSearch]=useState("");const [editUser,setEditUser]=useState(null);
  const users=[{id:1,name:"Ali Khan",email:"ali@example.com",role:"client",status:"active",joined:"Jan 2024",domains:3,hosting:2},
    {id:2,name:"Sara Ahmed",email:"sara@mail.com",role:"client",status:"active",joined:"Feb 2024",domains:1,hosting:1},
    {id:3,name:"Admin User",email:"admin@techpigeon.org",role:"admin",status:"active",joined:"Dec 2023",domains:0,hosting:0},
    {id:4,name:"Reseller Pak",email:"reseller@pak.com",role:"reseller",status:"active",joined:"Mar 2024",domains:12,hosting:5},
  ].filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{display:"flex",gap:14,marginBottom:20,alignItems:"center"}}>
        <div style={{flex:1}}><Input value={search} onChange={setSearch} placeholder="Search users by name or email…" icon="🔍"/></div>
        <Select value="all" onChange={()=>{}} options={[{value:"all",label:"All Roles"},{value:"client",label:"Clients"},{value:"admin",label:"Admins"},{value:"reseller",label:"Resellers"}]}/>
      </div>
      <Table cols={[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",render:v=><Badge bg={v==="admin"?"#FEE2E2":v==="reseller"?"#FEF3C7":B.blueLt} color={v==="admin"?B.red:v==="reseller"?"#92400E":B.blue}>{v}</Badge>},{key:"domains",label:"Domains"},{key:"hosting",label:"Hosting"},{key:"joined",label:"Joined"},{key:"status",label:"Status",render:v=><Badge bg="#D1FAE5" color="#065F46">✓ {v}</Badge>},{key:"action",label:"",render:(_,row)=><Btn size="sm" variant="outline" onClick={()=>setEditUser(row)}>Edit</Btn>}]}
        rows={users.map(u=>({...u,action:null}))}/>
      <Modal open={!!editUser} onClose={()=>setEditUser(null)} title={`Edit User: ${editUser?.name}`}>
        {editUser&&<>
          <Alert type="info">Editing: <strong>{editUser.email}</strong></Alert>
          <Select label="Role" value={editUser.role} onChange={v=>setEditUser(u=>({...u,role:v}))} options={["client","admin","reseller","support"].map(r=>({value:r,label:r.charAt(0).toUpperCase()+r.slice(1)}))}/>
          <Select label="Account Status" value={editUser.status} onChange={v=>setEditUser(u=>({...u,status:v}))} options={[{value:"active",label:"Active"},{value:"suspended",label:"Suspended"}]}/>
          <Input label="Reset Password (leave blank to keep)" type="password" value="" onChange={()=>{}} placeholder="New password"/>
          <div style={{display:"flex",gap:10}}>
            <Btn full onClick={()=>{alert("User updated!");setEditUser(null);}}>Save Changes</Btn>
            <Btn full variant="danger" onClick={()=>{alert("User suspended!");setEditUser(null);}}>Suspend</Btn>
          </div>
        </>}
      </Modal>
    </div>
  );
};

const AdminOrders = () => {
  const [statusFilter,setStatusFilter]=useState("all");
  const orders=[{no:"TP-1050",user:"ali@example.com",items:"Cloud Pro Hosting",total:3599,status:"paid",date:"Mar 1"},{no:"TP-1049",user:"sara@mail.com",items:"Domain .pk",total:1099,status:"pending",date:"Mar 1"},{no:"TP-1048",user:"john@pk.com",items:"CCNA Course",total:14999,status:"paid",date:"Feb 28"},{no:"TP-1047",user:"m.khan@co.pk",items:"SSL Certificate",total:2499,status:"refunded",date:"Feb 27"}]
    .filter(o=>statusFilter==="all"||o.status===statusFilter);
  return (
    <div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {["all","paid","pending","refunded"].map(s=><button key={s} onClick={()=>setStatusFilter(s)} style={{padding:"7px 18px",borderRadius:100,border:`1.5px solid ${statusFilter===s?B.blue:B.g200}`,background:statusFilter===s?B.blueLt:"white",color:statusFilter===s?B.blue:B.g600,fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:"0.82rem",cursor:"pointer",textTransform:"capitalize"}}>{s}</button>)}
      </div>
      <Table cols={[{key:"no",label:"Order #"},{key:"user",label:"User"},{key:"items",label:"Items"},{key:"total",label:"Amount",render:v=>`Rs.${v.toLocaleString()}`},{key:"status",label:"Status",render:v=><Badge bg={v==="paid"?"#D1FAE5":v==="pending"?"#FEF3C7":"#FEE2E2"} color={v==="paid"?"#065F46":v==="pending"?"#92400E":B.red}>{v}</Badge>},{key:"date",label:"Date"},{key:"action",label:"",render:(_,row)=><div style={{display:"flex",gap:6}}><Btn size="sm" variant="outline">View</Btn>{row.status==="pending"&&<Btn size="sm" variant="success" onClick={()=>alert("Order marked paid!")}>Mark Paid</Btn>}</div>}]}
        rows={orders.map(o=>({...o,action:null}))}/>
    </div>
  );
};

const AdminPayments = () => (
  <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
      <StatCard label="Total Revenue" value="Rs.4.2M" icon="💰" color={B.green}/>
      <StatCard label="Pending" value="Rs.142K" icon="⏳" color={B.gold}/>
      <StatCard label="This Month" value="Rs.680K" sub="↑ 18%" icon="📈" color={B.blue}/>
      <StatCard label="Failed" value="12" sub="Need follow-up" icon="❌" color={B.red}/>
    </div>
    <Table cols={[{key:"ref",label:"Ref"},{key:"user",label:"User"},{key:"method",label:"Method",render:v=><Badge>{v}</Badge>},{key:"amount",label:"Amount",render:v=>`Rs.${v.toLocaleString()}`},{key:"status",label:"Status",render:v=><Badge bg={v==="completed"?"#D1FAE5":v==="pending"?"#FEF3C7":"#FEE2E2"} color={v==="completed"?"#065F46":v==="pending"?"#92400E":B.red}>{v}</Badge>},{key:"date",label:"Date"},{key:"action",label:"",render:(_,row)=>row.status==="pending"?<Btn size="sm" variant="success" onClick={()=>alert("Payment confirmed!")}>Confirm</Btn>:null}]}
      rows={[{ref:"PAY-001",user:"ali@x.com",method:"JazzCash",amount:3599,status:"completed",date:"Mar 1",action:null},{ref:"PAY-002",user:"sara@x.com",method:"Bank Transfer",amount:1099,status:"pending",date:"Mar 1",action:null},{ref:"PAY-003",user:"john@x.com",method:"Stripe",amount:14999,status:"completed",date:"Feb 28",action:null}]}/>
  </div>
);

const AdminDomains = () => (
  <div>
    <Table cols={[{key:"domain",label:"Domain"},{key:"owner",label:"Owner"},{key:"status",label:"Status",render:v=><Badge bg={v==="active"?"#D1FAE5":"#FEF3C7"} color={v==="active"?"#065F46":"#92400E"}>{v}</Badge>},{key:"expires",label:"Expires"},{key:"price",label:"Price PKR",render:v=>`Rs.${v.toLocaleString()}`},{key:"action",label:"",render:()=><Btn size="sm" variant="outline">Edit</Btn>}]}
      rows={[{domain:"techpigeon.org",owner:"Admin TechPigeon",status:"active",expires:"Dec 2025",price:2999,action:null},{domain:"mybusiness.pk",owner:"Ali Khan",status:"active",expires:"Mar 2026",price:1099,action:null},{domain:"portfolio.com.pk",owner:"Sara Ahmed",status:"active",expires:"Jan 2026",price:999,action:null},{domain:"expired-domain.com",owner:"Old Client",status:"expired",expires:"Jan 2024",price:3499,action:null}]}/>
  </div>
);

const AdminHosting = () => (
  <div>
    <Table cols={[{key:"plan",label:"Plan"},{key:"domain",label:"Domain"},{key:"owner",label:"Owner"},{key:"status",label:"Status",render:v=><Badge bg={v==="active"?"#D1FAE5":v==="pending"?"#FEF3C7":"#FEE2E2"} color={v==="active"?"#065F46":v==="pending"?"#92400E":B.red}>{v}</Badge>},{key:"expires",label:"Expires"},{key:"cpu",label:"CPU"},{key:"action",label:"",render:()=><Btn size="sm" variant="outline">Manage</Btn>}]}
      rows={[{plan:"Cloud Pro",domain:"techpigeon.org",owner:"Admin TechPigeon",status:"active",expires:"Apr 2025",cpu:"42%",action:null},{plan:"Cloud Starter",domain:"portfolio.com.pk",owner:"Sara Ahmed",status:"pending",expires:"Mar 2025",cpu:"8%",action:null},{plan:"Business",domain:"bigcorp.pk",owner:"Big Corp Ltd",status:"active",expires:"Dec 2025",cpu:"67%",action:null}]}/>
  </div>
);

const AdminCourses = () => {
  const [newCourse,setNewCourse]=useState(false);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span/>
        <Btn onClick={()=>setNewCourse(true)}>+ Add Course</Btn>
      </div>
      <Table cols={[{key:"title",label:"Course"},{key:"level",label:"Level",render:v=><Badge>{v}</Badge>},{key:"cat",label:"Category"},{key:"price",label:"Price",render:v=>`Rs.${v.toLocaleString()}`},{key:"enrollments",label:"Enrolled"},{key:"published",label:"Status",render:v=><Badge bg={v?"#D1FAE5":"#F1F5F9"} color={v?"#065F46":B.g600}>{v?"Published":"Draft"}</Badge>},{key:"action",label:"",render:()=><div style={{display:"flex",gap:6}}><Btn size="sm" variant="outline">Edit</Btn><Btn size="sm" variant="danger" onClick={()=>alert("Course deleted!")}>Delete</Btn></div>}]}
        rows={COURSES.map(c=>({...c,enrollments:Math.floor(Math.random()*500)+50,published:true,action:null}))}/>
      <Modal open={newCourse} onClose={()=>setNewCourse(false)} title="Add New Course">
        <Input label="Course Title" value="" onChange={()=>{}} placeholder="e.g. AWS Solutions Architect"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Select label="Level" value="beginner" onChange={()=>{}} options={["beginner","intermediate","advanced"].map(v=>({value:v,label:v.charAt(0).toUpperCase()+v.slice(1)}))}/>
          <Select label="Category" value="Cloud" onChange={()=>{}} options={["Cloud","Security","Networking","DevOps","Linux","Web"].map(v=>({value:v,label:v}))}/>
        </div>
        <Input label="Price (PKR)" type="number" value="" onChange={()=>{}} placeholder="8999"/>
        <Input label="Duration (hours)" type="number" value="" onChange={()=>{}} placeholder="20"/>
        <Input label="Instructor Name" value="" onChange={()=>{}} placeholder="Full name"/>
        <Btn full onClick={()=>{alert("Course created!");setNewCourse(false);}}>Create Course</Btn>
      </Modal>
    </div>
  );
};

const AdminTickets = () => {
  const [reply,setReply]=useState(null);const [msg,setMsg]=useState("");
  return (
    <div>
      <Table cols={[{key:"no",label:"Ticket #"},{key:"user",label:"User"},{key:"subject",label:"Subject"},{key:"dept",label:"Dept"},{key:"priority",label:"Priority",render:v=><Badge bg={v==="urgent"?"#FEE2E2":v==="high"?"#FEF3C7":"#F1F5F9"} color={v==="urgent"?B.red:v==="high"?"#92400E":B.g600}>{v}</Badge>},{key:"status",label:"Status",render:v=><Badge bg={v==="open"?"#FEF3C7":v==="resolved"?"#D1FAE5":"#EDE9FE"} color={v==="open"?"#92400E":v==="resolved"?"#065F46":"#4C1D95"}>{v}</Badge>},{key:"action",label:"",render:(_,row)=><Btn size="sm" onClick={()=>setReply(row)}>Reply</Btn>}]}
        rows={[{no:"TCK-001",user:"ali@x.com",subject:"Domain not pointing",dept:"Domains",priority:"high",status:"open",action:null},{no:"TCK-002",user:"sara@x.com",subject:"SSL issue",dept:"Hosting",priority:"medium",status:"in_progress",action:null},{no:"TCK-003",user:"john@x.com",subject:"Can't access course",dept:"Training",priority:"low",status:"resolved",action:null},{no:"TCK-004",user:"vip@corp.pk",subject:"Server down URGENT",dept:"Hosting",priority:"urgent",status:"open",action:null}]}/>
      <Modal open={!!reply} onClose={()=>setReply(null)} title={`Reply to ${reply?.no}: ${reply?.subject}`}>
        {reply&&<>
          <Alert type="info">User: <strong>{reply.user}</strong> · Priority: <strong>{reply.priority}</strong></Alert>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:B.g800,marginBottom:7}}>Your Reply</label>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5} placeholder="Type your response here..." style={{width:"100%",padding:"12px 16px",border:`1.5px solid ${B.g200}`,borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",color:B.navy,outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
          </div>
          <Select label="Update Status" value="in_progress" onChange={()=>{}} options={["open","in_progress","resolved","closed"].map(v=>({value:v,label:v.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}))}/>
          <div style={{display:"flex",gap:10}}>
            <Btn full onClick={()=>{alert("Reply sent!");setReply(null);setMsg("");}}>Send Reply</Btn>
            <Btn full variant="outline" onClick={()=>{alert("Ticket closed!");setReply(null);}}>Close Ticket</Btn>
          </div>
        </>}
      </Modal>
    </div>
  );
};

const AdminPlans = () => (
  <div>
    <Table cols={[{key:"name",label:"Plan"},{key:"monthly",label:"Monthly",render:v=>`Rs.${v.toLocaleString()}`},{key:"annual",label:"Annual",render:v=>`Rs.${v.toLocaleString()}`},{key:"disk",label:"Disk"},{key:"sites",label:"Sites"},{key:"active",label:"Status",render:v=><Badge bg={v?"#D1FAE5":"#FEE2E2"} color={v?"#065F46":B.red}>{v?"Active":"Inactive"}</Badge>},{key:"action",label:"",render:()=><Btn size="sm" variant="outline">Edit</Btn>}]}
      rows={PLANS.map(p=>({name:p.name,monthly:p.price_m,annual:p.price_a,disk:p.disk,sites:p.sites,active:true,action:null}))}/>
  </div>
);

const AdminNotify = () => {
  const [title,setTitle]=useState("");const [msg,setMsg]=useState("");const [sent,setSent]=useState(false);
  return (
    <div style={{maxWidth:600}}>
      <Alert type="info">Send a notification to all active client accounts.</Alert>
      {sent&&<Alert type="success">✅ Notification sent to all users!</Alert>}
      <div style={{background:"white",border:`1px solid ${B.g200}`,borderRadius:16,padding:28}}>
        <Input label="Notification Title" value={title} onChange={setTitle} placeholder="e.g. Scheduled Maintenance Tonight"/>
        <div style={{marginBottom:18}}>
          <label style={{display:"block",fontSize:"0.85rem",fontWeight:600,color:B.g800,marginBottom:7}}>Message</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Describe the notification content..." style={{width:"100%",padding:"12px 16px",border:`1.5px solid ${B.g200}`,borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",color:B.navy,outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <Select label="Notification Type" value="announcement" onChange={()=>{}} options={["announcement","maintenance","promotion","alert"].map(v=>({value:v,label:v.charAt(0).toUpperCase()+v.slice(1)}))}/>
        <Btn full onClick={()=>{setSent(true);setTitle("");setMsg("");setTimeout(()=>setSent(false),3000);}}>📣 Send to All Users</Btn>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════
export default function TechPigeonApp() {
  const [page,setPage]=useState("home");
  const [user,setUser]=useState(null);

  useEffect(()=>{
    const link=document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    link.rel="stylesheet";
    document.head.appendChild(link);
  },[]);

  const onAuth = (u) => { setUser(u); setPage(u.role==="admin"?"admin":"dashboard"); };
  const logout = () => { setUser(null); setPage("home"); };
  const noNav = ["login","register"].includes(page);

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",color:B.g800,minHeight:"100vh"}}>
      {!noNav&&<Navbar page={page} setPage={setPage} user={user} logout={logout}/>}
      {page==="home"      && <HomePage setPage={setPage}/>}
      {page==="domains"   && <DomainsPage setPage={setPage}/>}
      {page==="hosting"   && <HostingPage setPage={setPage}/>}
      {page==="training"  && <TrainingPage setPage={setPage}/>}
      {page==="login"     && <LoginPage setPage={setPage} onLogin={onAuth}/>}
      {page==="register"  && <RegisterPage setPage={setPage} onRegister={onAuth}/>}
      {page==="dashboard" && <DashboardPage user={user} logout={logout} setPage={setPage}/>}
      {page==="admin"     && user?.role==="admin" && <AdminPage user={user} setPage={setPage} logout={logout}/>}
    </div>
  );
}
