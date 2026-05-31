import { useState, useEffect, useMemo } from "react";

const INCOME = 3600;
const C = "€";
const TOTAL_FIXED = 1651;
const AVAILABLE = INCOME - TOTAL_FIXED;
const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const MONTHS_S = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
const now = new Date();
const CY = now.getFullYear();
const CM = now.getMonth();

const DEFAULT_CATS = [
  { id:"food",          name:"Еда & кафе",     icon:"🍽️", budget:300, color:"#e8845a" },
  { id:"shopping",      name:"Шопинг",          icon:"🛍️", budget:200, color:"#c47060" },
  { id:"beauty",        name:"Красота",         icon:"💄", budget:150, color:"#b06080" },
  { id:"transport",     name:"Транспорт",       icon:"🚌", budget:80,  color:"#8a7040" },
  { id:"health",        name:"Здоровье",        icon:"💊", budget:60,  color:"#5a9050" },
  { id:"pets",          name:"Teo & Frida",     icon:"🐾", budget:150, color:"#c47050" },
  { id:"entertainment", name:"Развлечения",     icon:"🎬", budget:100, color:"#7060a0" },
  { id:"travel",        name:"Путешествия",     icon:"✈️", budget:200, color:"#4080a0" },
  { id:"home",          name:"Дом",             icon:"🏠", budget:100, color:"#907050" },
  { id:"other",         name:"Другое",          icon:"✨", budget:100, color:"#a08070" },
];

const FIXED = [
  { id:"sport",  name:"Спорт",           icon:"🏋️", monthly:180, note:"" },
  { id:"mani",   name:"Маникюр",         icon:"💅", monthly:90,  note:"" },
  { id:"pedi",   name:"Педикюр",         icon:"🦶", monthly:45,  note:"90€ / 2 мес" },
  { id:"subs",   name:"Подписки",        icon:"📱", monthly:70,  note:"" },
  { id:"camera", name:"Кредит (камера)", icon:"📷", monthly:86,  note:"" },
  { id:"shared", name:"Общий счёт",      icon:"🛒", monthly:1000,note:"еда с мужем" },
  { id:"hair",   name:"Волосы",          icon:"💇", monthly:180, note:"450€ / 2.5 мес" },
];

function useLS(key, def) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; }
    catch { return def; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

const fmt = n => Math.abs(Math.round(n)).toLocaleString("de-DE") + C;
const pct = (a, b) => b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100));

const Bar = ({ val, max, color="#e8845a", h=6 }) => {
  const p = pct(val, max);
  const bg = p >= 100 ? "#e05050" : p >= 80 ? "#e09030" : color;
  return (
    <div style={{ height:h, background:"#f0e8e0", borderRadius:h/2, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${p}%`, background:bg, borderRadius:h/2, transition:"width 0.4s" }}/>
    </div>
  );
};

const Card = ({ children, style={} }) => (
  <div style={{ background:"white", borderRadius:20, padding:"16px 18px", marginBottom:12,
    boxShadow:"0 1px 8px rgba(180,100,60,0.07)", border:"1px solid rgba(200,130,80,0.08)", ...style }}>
    {children}
  </div>
);

const ST = ({ children, right }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
    <div style={{ fontSize:11, fontWeight:700, color:"#b09080", letterSpacing:1.2, textTransform:"uppercase" }}>{children}</div>
    {right}
  </div>
);

const TeoSVG = ({size=40}) => (
  <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
    <ellipse cx="27" cy="34" rx="16" ry="13" fill="#d4845a"/>
    <ellipse cx="27" cy="22" rx="11" ry="10" fill="#e8a07a"/>
    <ellipse cx="17" cy="14" rx="5" ry="9" fill="#c47050" transform="rotate(-15 17 14)"/>
    <ellipse cx="37" cy="14" rx="5" ry="9" fill="#c47050" transform="rotate(15 37 14)"/>
    <ellipse cx="17" cy="14" rx="3" ry="6" fill="#f0b090" transform="rotate(-15 17 14)"/>
    <ellipse cx="37" cy="14" rx="3" ry="6" fill="#f0b090" transform="rotate(15 37 14)"/>
    <circle cx="23" cy="21" r="2.5" fill="#3a2010"/><circle cx="31" cy="21" r="2.5" fill="#3a2010"/>
    <circle cx="23.8" cy="20.2" r="0.8" fill="white"/><circle cx="31.8" cy="20.2" r="0.8" fill="white"/>
    <ellipse cx="27" cy="26" rx="2.5" ry="1.8" fill="#3a2010"/>
    <path d="M24.5 28.5 Q27 31 29.5 28.5" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M42 38 Q50 30 48 24" stroke="#c47050" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <rect x="16" y="44" width="5" height="8" rx="2.5" fill="#c47050"/>
    <rect x="23" y="44" width="5" height="8" rx="2.5" fill="#c47050"/>
    <rect x="30" y="44" width="5" height="8" rx="2.5" fill="#c47050"/>
  </svg>
);

const FridaSVG = ({size=40}) => (
  <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
    <ellipse cx="27" cy="34" rx="16" ry="13" fill="#b8704a"/>
    <ellipse cx="27" cy="22" rx="11" ry="10" fill="#d4906a"/>
    <ellipse cx="16" cy="13" rx="5.5" ry="10" fill="#a06040" transform="rotate(-10 16 13)"/>
    <ellipse cx="38" cy="13" rx="5.5" ry="10" fill="#a06040" transform="rotate(10 38 13)"/>
    <ellipse cx="16" cy="13" rx="3.5" ry="7" fill="#f0b090" transform="rotate(-10 16 13)"/>
    <ellipse cx="38" cy="13" rx="3.5" ry="7" fill="#f0b090" transform="rotate(10 38 13)"/>
    <circle cx="38" cy="6" r="4" fill="#f4a460"/>
    {[0,60,120,180,240,300].map(a=><circle key={a} cx={38+4*Math.cos(a*Math.PI/180)} cy={6+4*Math.sin(a*Math.PI/180)} r="2.5" fill="#ffcc88"/>)}
    <circle cx="38" cy="6" r="2" fill="#e8845a"/>
    <circle cx="23" cy="21" r="2.5" fill="#3a2010"/><circle cx="31" cy="21" r="2.5" fill="#3a2010"/>
    <circle cx="23.8" cy="20.2" r="0.8" fill="white"/><circle cx="31.8" cy="20.2" r="0.8" fill="white"/>
    <ellipse cx="27" cy="26" rx="2.5" ry="1.8" fill="#3a2010"/>
    <path d="M24 28.5 Q27 32 30 28.5" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M42 38 Q52 32 50 22" stroke="#a06040" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <rect x="16" y="44" width="5" height="8" rx="2.5" fill="#a06040"/>
    <rect x="23" y="44" width="5" height="8" rx="2.5" fill="#a06040"/>
    <rect x="30" y="44" width="5" height="8" rx="2.5" fill="#a06040"/>
  </svg>
);

const BarChart = ({ data, height=90 }) => {
  const max = Math.max(...data.map(d=>d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ fontSize:10, fontWeight:700, color: d.active?"#e8845a":"transparent" }}>{fmt(d.value)}</div>
          <div style={{ width:"100%", height:Math.max(4,Math.round((d.value/max)*(height-30))),
            background: d.active?"#e8845a":"#f0d8c8", borderRadius:"4px 4px 0 0", transition:"height 0.4s" }}/>
          <div style={{ fontSize:10, color:d.active?"#c47050":"#c0a890", fontWeight:d.active?700:400 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const FF = { fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" };
  const [tab, setTab] = useState("home");
  const [savingsGoal, setSavingsGoal] = useLS("sg_v3", 600);
  const [cats, setCats] = useLS("cats_v3", DEFAULT_CATS);
  const [allTxns, setAllTxns] = useLS("txns_v3", {});
  const [goals, setGoals] = useLS("goals_v3", [
    { id:1, name:"Отпуск ✈️",         target:2000, saved:0, color:"#4080a0" },
    { id:2, name:"Резервный фонд 🛡️", target:5000, saved:0, color:"#5a9050" },
  ]);
  const [viewM, setViewM] = useLS("vm_v3", CM);
  const [viewY, setViewY] = useLS("vy_v3", CY);

  const [txName, setTxName] = useState("");
  const [txAmt, setTxAmt] = useState("");
  const [txCat, setTxCat] = useState("food");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [txNote, setTxNote] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [fundingGoal, setFundingGoal] = useState(null);
  const [fundAmt, setFundAmt] = useState("");
  const [editBudgets, setEditBudgets] = useState(false);

  const mk = `${viewY}-${viewM}`;
  const ck = `${CY}-${CM}`;
  const txns = allTxns[mk] || [];
  const totalSpent = useMemo(()=>txns.reduce((s,t)=>s+t.amount,0),[txns]);
  const spendBudget = AVAILABLE - savingsGoal;
  const safeToSpend = spendBudget - totalSpent;
  const isOver = safeToSpend < 0;
  const isWarn = !isOver && safeToSpend < spendBudget * 0.15;
  const catTotals = useMemo(()=>cats.map(c=>({...c, spent:txns.filter(t=>t.cat===c.id).reduce((s,t)=>s+t.amount,0)})),[cats,txns]);

  const last6 = useMemo(()=>Array.from({length:6},(_,i)=>{
    let m=CM-5+i, y=CY; if(m<0){m+=12;y-=1;}
    const spent=(allTxns[`${y}-${m}`]||[]).reduce((s,t)=>s+t.amount,0);
    return {label:MONTHS_S[m], value:spent, active:m===viewM&&y===viewY};
  }),[allTxns,viewM,viewY]);

  const addTxn = () => {
    const a = parseFloat(txAmt.replace(",","."));
    if(!txName.trim()||isNaN(a)||a<=0) return;
    const t={id:Date.now(),name:txName.trim(),amount:a,cat:txCat,date:txDate,note:txNote.trim()};
    setAllTxns(prev=>({...prev,[ck]:[...(prev[ck]||[]),t]}));
    setTxName(""); setTxAmt(""); setTxNote("");
  };
  const delTxn = id => setAllTxns(prev=>({...prev,[mk]:(prev[mk]||[]).filter(t=>t.id!==id)}));
  const addGoal = () => {
    const t=parseFloat(goalTarget.replace(",","."));
    if(!goalName.trim()||isNaN(t)||t<=0) return;
    setGoals(prev=>[...prev,{id:Date.now(),name:goalName.trim(),target:t,saved:0,color:"#c47050"}]);
    setGoalName(""); setGoalTarget(""); setShowAddGoal(false);
  };
  const fundGoal = id => {
    const a=parseFloat(fundAmt.replace(",","."));
    if(isNaN(a)||a<=0) return;
    setGoals(prev=>prev.map(g=>g.id===id?{...g,saved:Math.min(g.target,g.saved+a)}:g));
    setFundingGoal(null); setFundAmt("");
  };

  const inp = { width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid #f0d8c8",
    fontSize:15, boxSizing:"border-box", outline:"none", color:"#5a3020", background:"#fffaf7", ...FF };
  const btnP = { width:"100%", padding:"14px", borderRadius:14, border:"none",
    background:"linear-gradient(135deg,#e8845a,#c46040)", color:"white", fontSize:16, fontWeight:600, cursor:"pointer", ...FF };
  const nav = t => ({
    flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"7px 0 4px",
    border:"none", background:"none", cursor:"pointer", color:tab===t?"#e8845a":"#c0a090",
    fontSize:9, fontWeight:tab===t?700:400, ...FF, transition:"color 0.2s",
  });

  // ── MONTH PICKER (clean grid, no scroll) ──────────────────────────────────
  const MonthPicker = () => {
    const months = Array.from({length:12},(_,i)=>{
      let m=CM-i, y=CY; if(m<0){m+=12;y-=1;}
      const hasTxns = (allTxns[`${y}-${m}`]||[]).length > 0;
      return {m, y, key:`${y}-${m}`, hasTxns};
    });
    return (
      <Card>
        <ST>Выбери месяц</ST>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {months.map(({m,y,key,hasTxns})=>{
            const active = m===viewM && y===viewY;
            return (
              <button key={key} onClick={()=>{setViewM(m);setViewY(y);}} style={{
                padding:"10px 4px", borderRadius:12, border:"none", cursor:"pointer",
                background: active?"#e8845a": hasTxns?"rgba(232,132,90,0.12)":"rgba(0,0,0,0.03)",
                color: active?"white": hasTxns?"#c47050":"#c0b0a0",
                fontWeight: active?700: hasTxns?600:400,
                fontSize:12, display:"flex", flexDirection:"column", alignItems:"center", gap:2, ...FF,
              }}>
                <span>{MONTHS_S[m]}</span>
                <span style={{ fontSize:9, opacity:0.7 }}>{y!==CY?y:""}</span>
                {hasTxns && !active && <div style={{ width:4, height:4, borderRadius:2, background:"#e8845a", marginTop:1 }}/>}
              </button>
            );
          })}
        </div>
      </Card>
    );
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  const HomeTab = () => (
    <>
      {/* Hero card */}
      <Card style={{
        background: isOver?"linear-gradient(135deg,#b03030,#8a2020)": isWarn?"linear-gradient(135deg,#b07020,#8a5010)":"linear-gradient(135deg,#e8845a,#c46040)",
        border:"none", color:"white"
      }}>
        <div style={{ fontSize:11, opacity:0.85, letterSpacing:1.5, marginBottom:4 }}>БЕЗОПАСНО ПОТРАТИТЬ</div>
        <div style={{ fontSize:46, fontWeight:800, lineHeight:1, color:"white" }}>
          {isOver?"-":""}{fmt(Math.abs(safeToSpend))}
        </div>
        <div style={{ fontSize:13, marginTop:6, opacity:0.9, color:"white" }}>
          {isOver?"⚠️ Frida: перерасход бюджета!": isWarn?"⚡ Teo: осталось меньше 15%!":"✓ Бюджет в порядке"}
        </div>
        <div style={{ display:"flex", gap:20, marginTop:16 }}>
          {[["Потрачено",totalSpent],["Бюджет",spendBudget],["Копилка",savingsGoal]].map(([l,v])=>(
            <div key={l}>
              <div style={{ fontSize:17, fontWeight:800, color:"white" }}>{fmt(v)}</div>
              <div style={{ fontSize:10, opacity:0.8, color:"white" }}>{l}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Spending bar */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <ST>Расходы {MONTHS_S[CM]}</ST>
          <span style={{ fontSize:12, fontWeight:700, color:isOver?"#c05050":"#e8845a",
            background:isOver?"#fff0f0":"rgba(232,132,90,0.1)", padding:"2px 8px", borderRadius:10 }}>
            {pct(totalSpent,spendBudget)}%
          </span>
        </div>
        <Bar val={totalSpent} max={spendBudget} h={8}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#b09080", marginTop:6 }}>
          <span>{fmt(totalSpent)} потрачено</span><span>{fmt(spendBudget)} бюджет</span>
        </div>
      </Card>

      {/* Savings goal — single slider only */}
      <Card style={{ background:"linear-gradient(135deg,#f4fbee,#eaf5e0)", border:"1px solid rgba(100,160,60,0.15)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#4a7830" }}>Цель накопления</div>
            <div style={{ fontSize:11, color:"#7a9860", marginTop:2 }}>{fmt(savingsGoal * 12)} в год</div>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color:"#5a9040" }}>{fmt(savingsGoal)}</div>
        </div>
        <input type="range" min={0} max={AVAILABLE} step={25} value={savingsGoal}
          onChange={e=>setSavingsGoal(Number(e.target.value))}
          style={{ width:"100%", accentColor:"#7aaa40", cursor:"pointer", marginBottom:4 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#9ab880" }}>
          <span>0{C}</span><span>{fmt(AVAILABLE)}</span>
        </div>
      </Card>

      {/* Top categories */}
      {catTotals.filter(c=>c.spent>0).length>0 && (
        <Card>
          <ST>Топ категорий</ST>
          {catTotals.filter(c=>c.spent>0).sort((a,b)=>b.spent-a.spent).slice(0,5).map(c=>(
            <div key={c.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <div style={{ display:"flex", gap:6, fontSize:13, color:"#6a4030", alignItems:"center" }}>
                  <span>{c.icon}</span><span>{c.name}</span>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"#c0a090" }}>лимит {fmt(c.budget)}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:c.spent>c.budget?"#c05050":c.color }}>{fmt(c.spent)}</span>
                  {c.spent>c.budget && <span style={{ fontSize:10, color:"#c05050", background:"#fff0f0", padding:"1px 6px", borderRadius:8 }}>+{fmt(c.spent-c.budget)}</span>}
                </div>
              </div>
              <Bar val={c.spent} max={c.budget} color={c.color} h={5}/>
            </div>
          ))}
        </Card>
      )}

      {/* Goals preview */}
      {goals.length>0 && (
        <Card>
          <ST>Цели накоплений</ST>
          {goals.map(g=>(
            <div key={g.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#5a3020" }}>{g.name}</span>
                <span style={{ fontSize:13, fontWeight:700, color:g.color }}>{fmt(g.saved)} / {fmt(g.target)}</span>
              </div>
              <Bar val={g.saved} max={g.target} color={g.color} h={6}/>
            </div>
          ))}
        </Card>
      )}

      {/* Fixed summary */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#5a3020" }}>Фиксированные расходы</div>
            <div style={{ fontSize:11, color:"#b09080" }}>Списываются каждый месяц</div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:"#e8845a" }}>{fmt(TOTAL_FIXED)}</div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {FIXED.map(e=>(
            <div key={e.id} style={{ background:"#f8ede4", borderRadius:8, padding:"4px 10px", fontSize:11, color:"#a06848", display:"flex", gap:4 }}>
              <span>{e.icon}</span><span>{e.name}</span><span style={{ fontWeight:700 }}>{e.monthly}{C}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  // ── ADD ───────────────────────────────────────────────────────────────────
  const AddTab = () => (
    <>
      <Card>
        <ST>Новая трата</ST>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <input value={txName} onChange={e=>setTxName(e.target.value)} placeholder="Название..."
            style={inp} onKeyDown={e=>e.key==="Enter"&&addTxn()}/>
          <div style={{ display:"flex", gap:8 }}>
            <input value={txAmt} onChange={e=>setTxAmt(e.target.value)} placeholder="Сумма €"
              inputMode="decimal" style={{...inp, flex:1}}/>
            <input value={txDate} onChange={e=>setTxDate(e.target.value)} type="date"
              style={{...inp, flex:1}}/>
          </div>
          <input value={txNote} onChange={e=>setTxNote(e.target.value)} placeholder="Заметка (необязательно)"
            style={inp}/>
        </div>
        <div style={{ marginTop:14, marginBottom:14 }}>
          <ST>Категория</ST>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {cats.map(c=>(
              <button key={c.id} onClick={()=>setTxCat(c.id)} style={{
                padding:"10px 12px", borderRadius:12,
                border:`1.5px solid ${txCat===c.id?c.color:"#f0d8c8"}`,
                background:txCat===c.id?c.color+"18":"white",
                cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                fontSize:13, color:txCat===c.id?c.color:"#9a7060",
                fontWeight:txCat===c.id?700:400, ...FF,
              }}>
                <span style={{ fontSize:16 }}>{c.icon}</span><span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={addTxn} style={btnP}>+ Добавить трату</button>
      </Card>

      {(allTxns[ck]||[]).length>0 && (
        <Card>
          <ST>{MONTHS_S[CM]} · {(allTxns[ck]||[]).length} трат · {fmt(totalSpent)}</ST>
          {(allTxns[ck]||[]).slice().reverse().map(t=>{
            const cat=cats.find(c=>c.id===t.cat)||cats[cats.length-1];
            return (
              <div key={t.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f5ede5" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:cat.color+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:"#5a3020" }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#c0a890" }}>{t.date} · {cat.name}{t.note?" · "+t.note:""}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  <span style={{ fontSize:15, fontWeight:800, color:"#e8845a" }}>{fmt(t.amount)}</span>
                  <button onClick={()=>delTxn(t.id)} style={{ background:"none", border:"none", color:"#d0b0a0", cursor:"pointer", fontSize:22, padding:0, lineHeight:1 }}>×</button>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </>
  );

  // ── REPORTS ───────────────────────────────────────────────────────────────
  const ReportsTab = () => {
    const spent = catTotals.filter(c=>c.spent>0).sort((a,b)=>b.spent-a.spent);
    return (
      <>
        <MonthPicker/>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          {[
            {l:"Потрачено", v:totalSpent, c:"#e8845a", over:false},
            {l:"Остаток",   v:safeToSpend, c:isOver?"#c05050":"#5a9040", over:isOver},
            {l:"Доход",     v:INCOME,  c:"#7060a0", over:false},
            {l:"Фикс.",     v:TOTAL_FIXED, c:"#a08070", over:false},
          ].map(s=>(
            <Card key={s.l} style={{ marginBottom:0, textAlign:"center", background:s.over?"#fff5f5":"white" }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v<0?"-":""}{fmt(Math.abs(s.v))}</div>
              <div style={{ fontSize:12, color:"#b09080", marginTop:2 }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Bar chart */}
        <Card>
          <ST>Расходы за 6 месяцев</ST>
          <BarChart data={last6} height={110}/>
        </Card>

        {/* Category breakdown */}
        {spent.length>0 ? (
          <Card>
            <ST>По категориям</ST>
            {spent.map(c=>(
              <div key={c.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ fontSize:13, color:"#6a4030", display:"flex", gap:6 }}>
                    <span>{c.icon}</span><span>{c.name}</span>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"#c0a090" }}>лимит {fmt(c.budget)}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:c.spent>c.budget?"#c05050":c.color }}>{fmt(c.spent)}</span>
                  </div>
                </div>
                <Bar val={c.spent} max={c.budget} color={c.color} h={5}/>
              </div>
            ))}
          </Card>
        ) : (
          <div style={{ textAlign:"center", padding:"60px 0", color:"#c0a890" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
            <div style={{ fontSize:15 }}>Нет данных за этот период</div>
          </div>
        )}
      </>
    );
  };

  // ── GOALS ─────────────────────────────────────────────────────────────────
  const GoalsTab = () => (
    <>
      <Card>
        <ST>Цели накоплений</ST>
        {goals.map(g=>(
          <div key={g.id} style={{ marginBottom:16, padding:14, background:"#fffaf7", borderRadius:14, border:"1px solid #f0e0d0" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#5a3020" }}>{g.name}</div>
              <button onClick={()=>setGoals(prev=>prev.filter(x=>x.id!==g.id))} style={{ background:"none", border:"none", color:"#d0b0a0", cursor:"pointer", fontSize:20, padding:0 }}>×</button>
            </div>
            <div style={{ display:"flex", gap:16, marginBottom:10 }}>
              {[["накоплено",g.saved,g.color],["осталось",g.target-g.saved,"#b09080"],["цель",g.target,"#7a5030"]].map(([l,v,c])=>(
                <div key={l}><div style={{ fontSize:18, fontWeight:800, color:c }}>{fmt(v)}</div><div style={{ fontSize:10, color:"#c0a090" }}>{l}</div></div>
              ))}
            </div>
            <Bar val={g.saved} max={g.target} color={g.color} h={8}/>
            <div style={{ fontSize:11, color:"#c0a090", marginTop:4, marginBottom:12 }}>{pct(g.saved,g.target)}% достигнуто</div>
            {fundingGoal===g.id ? (
              <div style={{ display:"flex", gap:8 }}>
                <input value={fundAmt} onChange={e=>setFundAmt(e.target.value)} inputMode="decimal"
                  placeholder="Сумма €" style={{...inp, flex:1, padding:"8px 12px", fontSize:14}}/>
                <button onClick={()=>fundGoal(g.id)} style={{...btnP, flex:0, padding:"8px 16px", width:"auto", fontSize:14}}>+</button>
                <button onClick={()=>setFundingGoal(null)} style={{ padding:"8px 12px", borderRadius:10, border:"1px solid #f0d0c0", background:"white", color:"#c47050", cursor:"pointer", fontSize:14, ...FF }}>✕</button>
              </div>
            ) : (
              <button onClick={()=>setFundingGoal(g.id)} style={{...btnP, background:g.color, padding:10, fontSize:14}}>+ Пополнить</button>
            )}
          </div>
        ))}
        {showAddGoal ? (
          <div style={{ marginTop:8 }}>
            <input value={goalName} onChange={e=>setGoalName(e.target.value)} placeholder="Название цели..." style={{...inp, marginBottom:8}}/>
            <input value={goalTarget} onChange={e=>setGoalTarget(e.target.value)} inputMode="decimal" placeholder="Целевая сумма €" style={{...inp, marginBottom:8}}/>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={addGoal} style={{...btnP, flex:1}}>Создать</button>
              <button onClick={()=>setShowAddGoal(false)} style={{ flex:1, padding:14, borderRadius:14, border:"1px solid #f0d0c0", background:"white", color:"#c47050", cursor:"pointer", fontSize:16, ...FF }}>Отмена</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setShowAddGoal(true)} style={{ width:"100%", padding:12, borderRadius:12, border:"1.5px dashed #e0c0a8", background:"transparent", color:"#c47050", cursor:"pointer", fontSize:14, marginTop:4, ...FF }}>
            + Новая цель
          </button>
        )}
      </Card>

      {/* Category budget editor */}
      <Card>
        <ST right={
          <button onClick={()=>setEditBudgets(!editBudgets)} style={{ background:"none", border:"none", color:"#c47050", cursor:"pointer", fontSize:13, ...FF }}>
            {editBudgets?"Готово":"Изменить лимиты"}
          </button>
        }>Лимиты по категориям</ST>
        {editBudgets ? cats.map(c=>(
          <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <span style={{ fontSize:20, width:28 }}>{c.icon}</span>
            <span style={{ fontSize:13, color:"#6a4030", flex:1 }}>{c.name}</span>
            <input inputMode="decimal" value={c.budget}
              onChange={e=>setCats(prev=>prev.map(x=>x.id===c.id?{...x,budget:Number(e.target.value)||0}:x))}
              style={{ width:80, padding:"6px 10px", borderRadius:8, border:"1.5px solid #f0d0c0", fontSize:13, textAlign:"right", color:"#5a3020", background:"#fffaf7", outline:"none" }}/>
            <span style={{ fontSize:12, color:"#c0a090" }}>{C}</span>
          </div>
        )) : (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {cats.map(c=>(
              <div key={c.id} style={{ background:c.color+"14", borderRadius:8, padding:"5px 10px", display:"flex", gap:5, alignItems:"center" }}>
                <span style={{ fontSize:14 }}>{c.icon}</span>
                <span style={{ fontSize:12, color:c.color, fontWeight:600 }}>{fmt(c.budget)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Fixed reference */}
      <Card>
        <ST>Фиксированные расходы</ST>
        {FIXED.map(e=>(
          <div key={e.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f5ede5" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(232,132,90,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{e.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:"#5a3020" }}>{e.name}</div>
                {e.note && <div style={{ fontSize:11, color:"#c0a890" }}>{e.note}</div>}
              </div>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:"#e8845a" }}>{fmt(e.monthly)}</div>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12, borderTop:"2px solid #f0d8c8", marginTop:4 }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#7a4830" }}>Итого</span>
          <span style={{ fontSize:18, fontWeight:800, color:"#e8845a" }}>{fmt(TOTAL_FIXED)}</span>
        </div>
      </Card>
    </>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#fdf6f0", ...FF, paddingBottom:84 }}>
      {/* Header */}
      <div style={{ background:"#e8845a", padding:"52px 20px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)", letterSpacing:2 }}>ТРЕКЕР БЮДЖЕТА</div>
            <div style={{ fontSize:26, fontWeight:800, color:"white", marginTop:2 }}>Teo & Frida 🐾</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)", marginTop:2 }}>{MONTHS_RU[CM]} {CY} · {fmt(INCOME)}/мес</div>
          </div>
          <div style={{ display:"flex" }}>
            <div style={{ marginRight:-8 }}><TeoSVG size={44}/></div>
            <FridaSVG size={44}/>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 14px 0" }}>
        {tab==="home"    && <HomeTab/>}
        {tab==="add"     && <AddTab/>}
        {tab==="reports" && <ReportsTab/>}
        {tab==="goals"   && <GoalsTab/>}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(255,252,248,0.97)",
        backdropFilter:"blur(20px)", borderTop:"1px solid rgba(200,130,80,0.12)",
        display:"flex", padding:"6px 0 22px", zIndex:100 }}>
        {[
          {t:"home",    icon:"🏠", label:"Главная"},
          {t:"add",     icon:"➕", label:"Добавить"},
          {t:"reports", icon:"📊", label:"Отчёты"},
          {t:"goals",   icon:"🎯", label:"Цели"},
        ].map(n=>(
          <button key={n.t} onClick={()=>setTab(n.t)} style={nav(n.t)}>
            <div style={{ fontSize:24, lineHeight:1 }}>{n.icon}</div>
            <div>{n.label}</div>
            {tab===n.t && <div style={{ width:4, height:4, borderRadius:2, background:"#e8845a", marginTop:1 }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
