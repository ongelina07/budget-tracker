import { useState, useEffect } from "react";

const INCOME = 3600;
const TOTAL_FIXED = 1651;
const AVAILABLE = INCOME - TOTAL_FIXED;

const CATEGORIES = [
  { id: "food", label: "Еда & кафе", icon: "🍽️", color: "#e8845a" },
  { id: "shopping", label: "Шопинг", icon: "🛍️", color: "#d4705a" },
  { id: "beauty", label: "Красота", icon: "💄", color: "#c96070" },
  { id: "transport", label: "Транспорт", icon: "🚌", color: "#a06848" },
  { id: "health", label: "Здоровье", icon: "💊", color: "#7a9850" },
  { id: "pets", label: "Teo & Frida", icon: "🐾", color: "#c47050" },
  { id: "entertainment", label: "Развлечения", icon: "🎬", color: "#8060a0" },
  { id: "other", label: "Другое", icon: "✨", color: "#b09070" },
];

const FIXED_EXPENSES = [
  { name: "Спорт", monthly: 180, icon: "🏋️" },
  { name: "Маникюр", monthly: 90, icon: "💅" },
  { name: "Педикюр", monthly: 45, icon: "🦶", note: "90€ / 2 мес" },
  { name: "Подписки", monthly: 70, icon: "📱" },
  { name: "Кредит (камера)", monthly: 86, icon: "📷" },
  { name: "Общий счёт", monthly: 1000, icon: "🛒" },
  { name: "Волосы", monthly: 180, icon: "💇", note: "450€ / 2.5 мес" },
];

const MONTHS = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const TeoSVG = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
    <ellipse cx="27" cy="34" rx="16" ry="13" fill="#d4845a"/>
    <ellipse cx="27" cy="22" rx="11" ry="10" fill="#e8a07a"/>
    <ellipse cx="17" cy="14" rx="5" ry="9" fill="#c47050" transform="rotate(-15 17 14)"/>
    <ellipse cx="37" cy="14" rx="5" ry="9" fill="#c47050" transform="rotate(15 37 14)"/>
    <ellipse cx="17" cy="14" rx="3" ry="6" fill="#f0b090" transform="rotate(-15 17 14)"/>
    <ellipse cx="37" cy="14" rx="3" ry="6" fill="#f0b090" transform="rotate(15 37 14)"/>
    <circle cx="23" cy="21" r="2.5" fill="#3a2010"/>
    <circle cx="31" cy="21" r="2.5" fill="#3a2010"/>
    <circle cx="23.8" cy="20.2" r="0.8" fill="white"/>
    <circle cx="31.8" cy="20.2" r="0.8" fill="white"/>
    <ellipse cx="27" cy="26" rx="2.5" ry="1.8" fill="#3a2010"/>
    <path d="M24.5 28.5 Q27 31 29.5 28.5" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M42 38 Q50 30 48 24" stroke="#c47050" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <rect x="16" y="44" width="5" height="8" rx="2.5" fill="#c47050"/>
    <rect x="23" y="44" width="5" height="8" rx="2.5" fill="#c47050"/>
    <rect x="30" y="44" width="5" height="8" rx="2.5" fill="#c47050"/>
  </svg>
);

const FridaSVG = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
    <ellipse cx="27" cy="34" rx="16" ry="13" fill="#b8704a"/>
    <ellipse cx="27" cy="22" rx="11" ry="10" fill="#d4906a"/>
    <ellipse cx="16" cy="13" rx="5.5" ry="10" fill="#a06040" transform="rotate(-10 16 13)"/>
    <ellipse cx="38" cy="13" rx="5.5" ry="10" fill="#a06040" transform="rotate(10 38 13)"/>
    <ellipse cx="16" cy="13" rx="3.5" ry="7" fill="#f0b090" transform="rotate(-10 16 13)"/>
    <ellipse cx="38" cy="13" rx="3.5" ry="7" fill="#f0b090" transform="rotate(10 38 13)"/>
    <circle cx="38" cy="6" r="4" fill="#f4a460"/>
    <circle cx="38" cy="2" r="2.5" fill="#ffcc88"/>
    <circle cx="42" cy="4" r="2.5" fill="#ffcc88"/>
    <circle cx="42" cy="8" r="2.5" fill="#ffcc88"/>
    <circle cx="38" cy="10" r="2.5" fill="#ffcc88"/>
    <circle cx="34" cy="8" r="2.5" fill="#ffcc88"/>
    <circle cx="34" cy="4" r="2.5" fill="#ffcc88"/>
    <circle cx="38" cy="6" r="2" fill="#e8845a"/>
    <circle cx="23" cy="21" r="2.5" fill="#3a2010"/>
    <circle cx="31" cy="21" r="2.5" fill="#3a2010"/>
    <circle cx="23.8" cy="20.2" r="0.8" fill="white"/>
    <circle cx="31.8" cy="20.2" r="0.8" fill="white"/>
    <ellipse cx="27" cy="26" rx="2.5" ry="1.8" fill="#3a2010"/>
    <path d="M24 28.5 Q27 32 30 28.5" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M42 38 Q52 32 50 22" stroke="#a06040" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <rect x="16" y="44" width="5" height="8" rx="2.5" fill="#a06040"/>
    <rect x="23" y="44" width="5" height="8" rx="2.5" fill="#a06040"/>
    <rect x="30" y="44" width="5" height="8" rx="2.5" fill="#a06040"/>
  </svg>
);

function useLocalStorage(key, defaultVal) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : defaultVal; }
    catch { return defaultVal; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [savingsGoal, setSavingsGoal] = useLocalStorage("savingsGoal", 500);
  const [allEntries, setAllEntries] = useLocalStorage("allEntries", {});
  const [monthHistory, setMonthHistory] = useLocalStorage("monthHistory", {});

  const [name, setName] = useState("");
  const [amt, setAmt] = useState("");
  const [cat, setCat] = useState("other");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const monthKey = `${selectedYear}-${selectedMonth}`;
  const currentKey = `${currentYear}-${currentMonth}`;
  const entries = allEntries[monthKey] || [];
  const isCurrentMonth = monthKey === currentKey;

  const totalSpent = entries.reduce((s, e) => s + e.amount, 0);
  const spendBudget = AVAILABLE - savingsGoal;
  const remaining = spendBudget - totalSpent;
  const savingsPct = Math.min(100, Math.round((savingsGoal / AVAILABLE) * 100));
  const spentPct = Math.min(100, Math.round((totalSpent / spendBudget) * 100));
  const isOver = remaining < 0;
  const isWarning = remaining >= 0 && remaining < spendBudget * 0.2;

  const addEntry = () => {
    const a = parseFloat(amt);
    if (!name.trim() || isNaN(a) || a <= 0) return;
    const entry = { id: Date.now(), name: name.trim(), amount: a, category: cat, date: new Date().toLocaleDateString("ru") };
    setAllEntries(prev => ({ ...prev, [currentKey]: [...(prev[currentKey] || []), entry] }));
    setName(""); setAmt(""); setCat("other");
  };

  const removeEntry = (id) => {
    setAllEntries(prev => ({ ...prev, [monthKey]: (prev[monthKey] || []).filter(e => e.id !== id) }));
  };

  const catTotals = CATEGORIES.map(c => ({
    ...c, total: entries.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const savedMonths = Object.keys(allEntries).sort().reverse().slice(0, 6);

  const W = { fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" };

  const card = {
    background: "white",
    borderRadius: 20,
    padding: "16px 18px",
    marginBottom: 12,
    boxShadow: "0 2px 12px rgba(180,100,60,0.08)",
    border: "1px solid rgba(200,130,80,0.1)",
  };

  const pill = (active) => ({
    padding: "6px 14px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    background: active ? "#e8845a" : "rgba(232,132,90,0.1)",
    color: active ? "white" : "#c47050",
    transition: "all 0.2s",
  });

  const navBtn = (t) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "8px 0",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: tab === t ? "#e8845a" : "#c0a090",
    fontSize: 10,
    fontWeight: tab === t ? 600 : 400,
    ...W,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#fdf6f0", ...W, paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(160deg, #e8845a 0%, #c46040 100%)", padding: "52px 20px 24px", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4, letterSpacing: 1 }}>МОЙ БЮДЖЕТ</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Teo & Frida 🐾</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{MONTHS[currentMonth]} {currentYear} · {INCOME} €/мес</div>
          </div>
          <div style={{ display: "flex", gap: -8 }}>
            <div style={{ marginRight: -10 }}><TeoSVG size={44}/></div>
            <FridaSVG size={44}/>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[
            { label: "Фикс. расходы", val: TOTAL_FIXED },
            { label: "Копилка", val: savingsGoal },
            { label: remaining < 0 ? "Перерасход" : "Остаток", val: Math.abs(remaining) },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.18)", borderRadius: 14, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{s.val}€</div>
              <div style={{ fontSize: 10, opacity: 0.85, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <>
            {/* Alert */}
            {(isOver || isWarning) && (
              <div style={{ ...card, background: isOver ? "#fff0f0" : "#fffbf0", border: `1px solid ${isOver ? "#f0c0c0" : "#f0dca0"}`, marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: isOver ? "#c05050" : "#a07020", fontWeight: 500 }}>
                  {isOver ? "🚨 Frida говорит: бюджет превышен на " + Math.abs(remaining) + "€!" : "⚠️ Teo предупреждает: осталось меньше 20% бюджета!"}
                </div>
              </div>
            )}

            {/* Savings progress */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#5a3020" }}>Цель накопления</div>
                  <div style={{ fontSize: 12, color: "#b09080", marginTop: 1 }}>За год: {savingsGoal * 12}€</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#7a9850" }}>{savingsGoal}€</div>
              </div>
              <div style={{ height: 8, background: "#f0e8e0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${savingsPct}%`, background: "linear-gradient(90deg, #a0c870, #7aaa40)", borderRadius: 4, transition: "width 0.4s" }}/>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#c0a890", marginTop: 6 }}>
                <span>{savingsPct}% от свободных денег</span>
                <span>из {AVAILABLE}€</span>
              </div>
              <input type="range" min={0} max={AVAILABLE} step={50} value={savingsGoal}
                onChange={e => setSavingsGoal(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#8aab60", marginTop: 10, cursor: "pointer" }}/>
            </div>

            {/* Spending progress */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#5a3020" }}>Траты в {MONTHS[currentMonth]}</div>
                  <div style={{ fontSize: 12, color: "#b09080", marginTop: 1 }}>бюджет {spendBudget}€</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: isOver ? "#c05050" : "#e8845a" }}>{totalSpent}€</div>
              </div>
              <div style={{ height: 8, background: "#f0e8e0", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, spentPct)}%`, background: isOver ? "linear-gradient(90deg, #f09090, #c05050)" : "linear-gradient(90deg, #f0b070, #e8845a)", borderRadius: 4, transition: "width 0.4s" }}/>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#c0a890", marginTop: 6 }}>
                <span>{spentPct}% использовано</span>
                <span style={{ color: isOver ? "#c05050" : "#7aaa40", fontWeight: 500 }}>
                  {isOver ? `−${Math.abs(remaining)}€ перерасход` : `${remaining}€ осталось`}
                </span>
              </div>
            </div>

            {/* Category breakdown */}
            {catTotals.length > 0 && (
              <div style={card}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#5a3020", marginBottom: 12 }}>По категориям</div>
                {catTotals.map(c => (
                  <div key={c.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7a5040" }}>
                        <span>{c.icon}</span><span>{c.label}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: c.color }}>{c.total}€</span>
                    </div>
                    <div style={{ height: 5, background: "#f0e8e0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, Math.round((c.total / spendBudget) * 100))}%`, background: c.color, borderRadius: 3 }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ADD TAB */}
        {tab === "add" && (
          <>
            <div style={card}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#5a3020", marginBottom: 14 }}>Добавить трату</div>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Название траты..."
                onKeyDown={e => e.key === "Enter" && addEntry()}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #f0d8c8", fontSize: 15, marginBottom: 10, boxSizing: "border-box", outline: "none", color: "#5a3020", background: "#fffaf7" }}/>
              <input value={amt} onChange={e => setAmt(e.target.value)}
                placeholder="Сумма в €"
                type="number" onKeyDown={e => e.key === "Enter" && addEntry()}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #f0d8c8", fontSize: 15, marginBottom: 14, boxSizing: "border-box", outline: "none", color: "#5a3020", background: "#fffaf7" }}/>

              <div style={{ fontSize: 12, color: "#b09080", marginBottom: 10, fontWeight: 500 }}>КАТЕГОРИЯ</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${cat === c.id ? c.color : "#f0d8c8"}`,
                    background: cat === c.id ? c.color + "18" : "white", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8, fontSize: 13,
                    color: cat === c.id ? c.color : "#9a7060", fontWeight: cat === c.id ? 600 : 400,
                    ...W,
                  }}>
                    <span>{c.icon}</span><span>{c.label}</span>
                  </button>
                ))}
              </div>

              <button onClick={addEntry} style={{
                width: "100%", padding: "14px", borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, #e8845a, #c46040)", color: "white",
                fontSize: 16, fontWeight: 600, cursor: "pointer", ...W,
              }}>Добавить трату</button>
            </div>

            {/* Today's entries */}
            {(allEntries[currentKey] || []).length > 0 && (
              <div style={card}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#5a3020", marginBottom: 12 }}>Этот месяц</div>
                {(allEntries[currentKey] || []).slice().reverse().map(e => {
                  const c = CATEGORIES.find(c => c.id === e.category) || CATEGORIES[7];
                  return (
                    <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5ede5" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
                        <div>
                          <div style={{ fontSize: 14, color: "#5a3020", fontWeight: 500 }}>{e.name}</div>
                          <div style={{ fontSize: 11, color: "#c0a890" }}>{e.date} · {c.label}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#e8845a" }}>−{e.amount}€</span>
                        <button onClick={() => removeEntry(e.id)} style={{ background: "none", border: "none", color: "#d0b0a0", cursor: "pointer", fontSize: 18, padding: 0 }}>×</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              {savedMonths.length === 0 ? null : savedMonths.map(key => {
                const [y, m] = key.split("-").map(Number);
                return (
                  <button key={key} onClick={() => { setSelectedMonth(m); setSelectedYear(y); }}
                    style={pill(selectedMonth === m && selectedYear === y)}>
                    {MONTHS[m]} {y}
                  </button>
                );
              })}
            </div>

            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#c0a890" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
                <div style={{ fontSize: 15 }}>Нет данных за этот месяц</div>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  {[
                    { label: "Потрачено", val: totalSpent + "€", color: "#e8845a" },
                    { label: "Остаток", val: remaining + "€", color: remaining < 0 ? "#c05050" : "#7aaa40" },
                  ].map(s => (
                    <div key={s.label} style={{ ...card, marginBottom: 0, textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 12, color: "#b09080", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={card}>
                  {entries.slice().reverse().map(e => {
                    const c = CATEGORIES.find(c => c.id === e.category) || CATEGORIES[7];
                    return (
                      <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5ede5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
                          <div>
                            <div style={{ fontSize: 14, color: "#5a3020", fontWeight: 500 }}>{e.name}</div>
                            <div style={{ fontSize: 11, color: "#c0a890" }}>{e.date} · {c.label}</div>
                          </div>
                        </div>
                        {isCurrentMonth && (
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#e8845a" }}>−{e.amount}€</span>
                            <button onClick={() => removeEntry(e.id)} style={{ background: "none", border: "none", color: "#d0b0a0", cursor: "pointer", fontSize: 18, padding: 0 }}>×</button>
                          </div>
                        )}
                        {!isCurrentMonth && (
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#e8845a" }}>−{e.amount}€</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* FIXED TAB */}
        {tab === "fixed" && (
          <>
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#5a3020", marginBottom: 14 }}>Фиксированные расходы</div>
              {FIXED_EXPENSES.map(e => (
                <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #f5ede5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(232,132,90,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{e.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, color: "#5a3020", fontWeight: 500 }}>{e.name}</div>
                      {e.note && <div style={{ fontSize: 11, color: "#c0a890" }}>{e.note}</div>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#e8845a" }}>{e.monthly}€</div>
                    <div style={{ fontSize: 10, color: "#c0a890" }}>/мес</div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", borderTop: "2px solid #f0d8c8", marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#7a4830" }}>Итого</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#e8845a" }}>{TOTAL_FIXED}€</span>
              </div>
            </div>

            <div style={{ ...card, background: "linear-gradient(135deg, #f0fff0, #e8f8e0)", border: "1px solid rgba(120,180,80,0.2)" }}>
              <div style={{ fontSize: 12, color: "#7a9850", fontWeight: 500, marginBottom: 6 }}>СВОБОДНЫХ ДЕНЕГ</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#5a8030" }}>{AVAILABLE}€</div>
              <div style={{ fontSize: 12, color: "#a0b870", marginTop: 4 }}>из них {savingsGoal}€ в копилку → {AVAILABLE - savingsGoal}€ на жизнь</div>
            </div>
          </>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,252,248,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(200,130,80,0.15)",
        display: "flex", padding: "8px 0 20px",
      }}>
        {[
          { t: "home", icon: "🏠", label: "Обзор" },
          { t: "add", icon: "➕", label: "Добавить" },
          { t: "history", icon: "📅", label: "История" },
          { t: "fixed", icon: "📋", label: "Фикс" },
        ].map(n => (
          <button key={n.t} onClick={() => setTab(n.t)} style={navBtn(n.t)}>
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
