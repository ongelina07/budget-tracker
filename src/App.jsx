import { useState } from "react";

const INCOME = 3600;

const fixedExpenses = [
  { id: 1, name: "Спорт", monthly: 180, color: "#e8845a", emoji: "🏋️" },
  { id: 2, name: "Маникюр", monthly: 90, color: "#d4845a", emoji: "💅" },
  { id: 3, name: "Педикюр", monthly: 45, color: "#c97a52", emoji: "🦶", note: "90€ раз в 2 мес" },
  { id: 4, name: "Подписки", monthly: 70, color: "#b8704a", emoji: "📱" },
  { id: 5, name: "Кредит (камера)", monthly: 86, color: "#a06040", emoji: "📷" },
  { id: 6, name: "Общий счёт (еда)", monthly: 1000, color: "#c8855a", emoji: "🛒" },
  { id: 7, name: "Волосы", monthly: 180, color: "#d47a50", emoji: "💇", note: "450€ раз в 2.5 мес" },
];

const TOTAL_FIXED = fixedExpenses.reduce((s, e) => s + e.monthly, 0);
const AVAILABLE = INCOME - TOTAL_FIXED;

// Cute Podenco SVG illustrations
const TeoSVG = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="27" cy="34" rx="16" ry="13" fill="#d4845a" />
    <ellipse cx="27" cy="22" rx="11" ry="10" fill="#e8a07a" />
    {/* ears */}
    <ellipse cx="17" cy="14" rx="5" ry="9" fill="#c47050" transform="rotate(-15 17 14)" />
    <ellipse cx="37" cy="14" rx="5" ry="9" fill="#c47050" transform="rotate(15 37 14)" />
    <ellipse cx="17" cy="14" rx="3" ry="6" fill="#f0b090" transform="rotate(-15 17 14)" />
    <ellipse cx="37" cy="14" rx="3" ry="6" fill="#f0b090" transform="rotate(15 37 14)" />
    {/* eyes */}
    <circle cx="23" cy="21" r="2.5" fill="#3a2010" />
    <circle cx="31" cy="21" r="2.5" fill="#3a2010" />
    <circle cx="23.8" cy="20.2" r="0.8" fill="white" />
    <circle cx="31.8" cy="20.2" r="0.8" fill="white" />
    {/* nose */}
    <ellipse cx="27" cy="26" rx="2.5" ry="1.8" fill="#3a2010" />
    {/* mouth */}
    <path d="M24.5 28.5 Q27 31 29.5 28.5" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* tail */}
    <path d="M42 38 Q50 30 48 24" stroke="#c47050" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* legs */}
    <rect x="16" y="44" width="5" height="8" rx="2.5" fill="#c47050" />
    <rect x="23" y="44" width="5" height="8" rx="2.5" fill="#c47050" />
    <rect x="30" y="44" width="5" height="8" rx="2.5" fill="#c47050" />
  </svg>
);

const FridaSVG = () => (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="27" cy="34" rx="16" ry="13" fill="#b8704a" />
    <ellipse cx="27" cy="22" rx="11" ry="10" fill="#d4906a" />
    {/* ears - slightly bigger for Frida */}
    <ellipse cx="16" cy="13" rx="5.5" ry="10" fill="#a06040" transform="rotate(-10 16 13)" />
    <ellipse cx="38" cy="13" rx="5.5" ry="10" fill="#a06040" transform="rotate(10 38 13)" />
    <ellipse cx="16" cy="13" rx="3.5" ry="7" fill="#f0b090" transform="rotate(-10 16 13)" />
    <ellipse cx="38" cy="13" rx="3.5" ry="7" fill="#f0b090" transform="rotate(10 38 13)" />
    {/* little flower accessory */}
    <circle cx="38" cy="6" r="4" fill="#f4a460" />
    <circle cx="38" cy="2" r="2.5" fill="#ffcc88" />
    <circle cx="42" cy="4" r="2.5" fill="#ffcc88" />
    <circle cx="42" cy="8" r="2.5" fill="#ffcc88" />
    <circle cx="38" cy="10" r="2.5" fill="#ffcc88" />
    <circle cx="34" cy="8" r="2.5" fill="#ffcc88" />
    <circle cx="34" cy="4" r="2.5" fill="#ffcc88" />
    <circle cx="38" cy="6" r="2" fill="#e8845a" />
    {/* eyes */}
    <circle cx="23" cy="21" r="2.5" fill="#3a2010" />
    <circle cx="31" cy="21" r="2.5" fill="#3a2010" />
    <circle cx="23.8" cy="20.2" r="0.8" fill="white" />
    <circle cx="31.8" cy="20.2" r="0.8" fill="white" />
    {/* nose */}
    <ellipse cx="27" cy="26" rx="2.5" ry="1.8" fill="#3a2010" />
    {/* mouth smile */}
    <path d="M24 28.5 Q27 32 30 28.5" stroke="#3a2010" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* tail */}
    <path d="M42 38 Q52 32 50 22" stroke="#a06040" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* legs */}
    <rect x="16" y="44" width="5" height="8" rx="2.5" fill="#a06040" />
    <rect x="23" y="44" width="5" height="8" rx="2.5" fill="#a06040" />
    <rect x="30" y="44" width="5" height="8" rx="2.5" fill="#a06040" />
  </svg>
);

export default function BudgetTracker() {
  const [savingsGoal, setSavingsGoal] = useState(500);
  const [entries, setEntries] = useState([]);
  const [entryName, setEntryName] = useState("");
  const [entryAmt, setEntryAmt] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const totalMisc = entries.reduce((s, e) => s + e.amount, 0);
  const spendBudget = AVAILABLE - savingsGoal;
  const remaining = spendBudget - totalMisc;
  const pct = (val, total) => Math.min(100, Math.max(0, Math.round((val / total) * 100)));

  const addEntry = () => {
    const amt = parseFloat(entryAmt);
    if (!entryName.trim() || isNaN(amt) || amt <= 0) return;
    setEntries([...entries, { id: Date.now(), name: entryName.trim(), amount: amt }]);
    setEntryName("");
    setEntryAmt("");
  };

  const removeEntry = (id) => setEntries(entries.filter((e) => e.id !== id));

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fff8f2 0%, #ffe8d6 50%, #ffd4b8 100%)",
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      color: "#5a3020",
    },
    header: {
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(200,130,80,0.15)",
      padding: "24px 28px 18px",
    },
    tag: {
      fontSize: 10,
      letterSpacing: 3,
      color: "#c47050",
      textTransform: "uppercase",
      marginBottom: 6,
    },
    h1: {
      margin: 0,
      fontSize: 26,
      fontWeight: 400,
      color: "#7a3820",
      fontStyle: "italic",
    },
    sub: { marginTop: 6, color: "#a06848", fontSize: 13 },
    dogs: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 12,
      padding: "10px 16px",
      background: "rgba(255,200,150,0.25)",
      borderRadius: 20,
      border: "1px solid rgba(200,130,80,0.2)",
      width: "fit-content",
    },
    dogName: { fontSize: 12, color: "#b06040", fontStyle: "italic" },
    content: { maxWidth: 680, margin: "0 auto", padding: "0 24px" },
    tabs: { display: "flex", gap: 4, paddingTop: 20, marginBottom: 22 },
    tab: (active) => ({
      padding: "8px 18px",
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "inherit",
      transition: "all 0.2s",
      background: active ? "rgba(196,112,80,0.15)" : "transparent",
      color: active ? "#c47050" : "#b09080",
      borderBottom: active ? "2px solid #c47050" : "2px solid transparent",
    }),
    card: {
      background: "rgba(255,255,255,0.65)",
      border: "1px solid rgba(200,130,80,0.15)",
      borderRadius: 18,
      padding: "18px 22px",
      marginBottom: 14,
      backdropFilter: "blur(10px)",
    },
    cardLabel: { fontSize: 12, color: "#b09080", marginBottom: 10, letterSpacing: 0.5 },
    statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 },
    statCard: (color) => ({
      background: "rgba(255,255,255,0.7)",
      border: `1px solid ${color}30`,
      borderRadius: 14,
      padding: "14px 12px",
      textAlign: "center",
    }),
    statVal: (color) => ({ fontSize: 20, fontWeight: 700, color }),
    statLabel: { fontSize: 10, color: "#b09080", marginTop: 4, letterSpacing: 0.5 },
    input: {
      flex: 2,
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid rgba(200,130,80,0.3)",
      background: "rgba(255,255,255,0.8)",
      color: "#5a3020",
      fontSize: 14,
      fontFamily: "inherit",
      outline: "none",
    },
    btn: {
      padding: "10px 18px",
      borderRadius: 10,
      border: "none",
      background: "linear-gradient(135deg, #e8845a, #c46040)",
      color: "white",
      cursor: "pointer",
      fontSize: 18,
      fontFamily: "inherit",
      boxShadow: "0 2px 8px rgba(196,96,64,0.3)",
    },
    entryRow: {
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(200,130,80,0.12)",
      borderRadius: 12,
      padding: "11px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={styles.tag}>Мой бюджет</div>
          <h1 style={styles.h1}>Teo & Frida's Finance Tracker 🐾</h1>
          <div style={styles.sub}>Зарплата: <strong style={{ color: "#c47050" }}>{INCOME} €</strong> / месяц</div>
          <div style={styles.dogs}>
            <TeoSVG />
            <div>
              <div style={styles.dogName}>Teo</div>
              <div style={{ fontSize: 10, color: "#c8a090" }}>chief napper</div>
            </div>
            <div style={{ width: 1, height: 36, background: "rgba(200,130,80,0.2)", margin: "0 6px" }} />
            <FridaSVG />
            <div>
              <div style={styles.dogName}>Frida</div>
              <div style={{ fontSize: 10, color: "#c8a090" }}>budget supervisor</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {/* Tabs */}
        <div style={styles.tabs}>
          {["overview", "tracker", "fixed"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={styles.tab(activeTab === tab)}>
              {{ overview: "🌿 Обзор", tracker: "🐾 Траты", fixed: "📋 Фикс" }[tab]}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={styles.statGrid}>
              {[
                { label: "Фикс. расходы", val: TOTAL_FIXED, color: "#c47050" },
                { label: "Накопления", val: savingsGoal, color: "#8aab60" },
                { label: "Остаток", val: Math.max(0, remaining), color: remaining < 0 ? "#c05050" : "#c47050" },
              ].map(c => (
                <div key={c.label} style={styles.statCard(c.color)}>
                  <div style={styles.statVal(c.color)}>{c.val} €</div>
                  <div style={styles.statLabel}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Savings slider */}
            <div style={{ ...styles.card, background: "rgba(200,230,160,0.25)", border: "1px solid rgba(140,180,80,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: "#6a9040" }}>🎯 Цель накопления</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#6a9040" }}>{savingsGoal} €</span>
              </div>
              <input type="range" min={0} max={AVAILABLE} step={50} value={savingsGoal}
                onChange={e => setSavingsGoal(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#8aab60", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#a0b888", marginTop: 4 }}>
                <span>0 €</span><span>{AVAILABLE} €</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#8a9870" }}>
                💡 За год это <strong style={{ color: "#6a9040" }}>{savingsGoal * 12} €</strong> накоплений
              </div>
            </div>

            {/* Budget bar */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>Распределение бюджета</div>
              <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 14, gap: 2 }}>
                <div style={{ width: `${pct(TOTAL_FIXED, INCOME)}%`, background: "linear-gradient(90deg, #e8845a, #c46040)", borderRadius: "7px 0 0 7px" }} />
                <div style={{ width: `${pct(savingsGoal, INCOME)}%`, background: "linear-gradient(90deg, #a0c870, #7aaa40)" }} />
                <div style={{ width: `${pct(totalMisc, INCOME)}%`, background: "linear-gradient(90deg, #f0c090, #d4a070)" }} />
                <div style={{ flex: 1, background: "rgba(200,130,80,0.1)", borderRadius: "0 7px 7px 0" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", fontSize: 12 }}>
                {[
                  ["#e8845a", `Фикс. ${TOTAL_FIXED}€`, `${pct(TOTAL_FIXED, INCOME)}%`],
                  ["#a0c870", `Копилка ${savingsGoal}€`, `${pct(savingsGoal, INCOME)}%`],
                  ["#f0c090", `Траты ${totalMisc}€`, `${pct(totalMisc, INCOME)}%`],
                  ["rgba(200,130,80,0.25)", `Свободно ${Math.max(0, remaining)}€`, ""],
                ].map(([c, l, p]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
                    <span style={{ color: "#9a7060" }}>{l}</span>
                    {p && <span style={{ color: "#c0a090" }}>{p}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining */}
            <div style={{
              ...styles.card,
              background: remaining < 0 ? "rgba(200,80,80,0.06)" : "rgba(255,220,180,0.4)",
              border: `1px solid ${remaining < 0 ? "rgba(200,80,80,0.2)" : "rgba(200,130,80,0.2)"}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, color: "#a07858" }}>Бюджет на «всякую фигню»</div>
                <div style={{ fontSize: 11, color: "#c0a090", marginTop: 3 }}>
                  {spendBudget}€ на месяц · потрачено {totalMisc}€
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: remaining < 0 ? "#c05050" : "#c47050" }}>
                {remaining < 0 ? "−" : ""}{Math.abs(remaining)} €
              </div>
            </div>

            {remaining < 0 && (
              <div style={{ ...styles.card, background: "rgba(200,80,80,0.07)", border: "1px solid rgba(200,80,80,0.15)", fontSize: 13, color: "#a05050" }}>
                🐾 Frida says: превышение бюджета! Снизь цель или урежь траты.
              </div>
            )}
          </div>
        )}

        {/* TRACKER */}
        {activeTab === "tracker" && (
          <div>
            <div style={styles.card}>
              <div style={styles.cardLabel}>Добавить трату</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={entryName} onChange={e => setEntryName(e.target.value)}
                  placeholder="На что потратила?" onKeyDown={e => e.key === "Enter" && addEntry()}
                  style={styles.input} />
                <input value={entryAmt} onChange={e => setEntryAmt(e.target.value)}
                  placeholder="€" type="number" onKeyDown={e => e.key === "Enter" && addEntry()}
                  style={{ ...styles.input, flex: 0.6 }} />
                <button onClick={addEntry} style={styles.btn}>+</button>
              </div>
            </div>

            <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "#a07858" }}>Бюджет: <strong style={{ color: "#c47050" }}>{spendBudget} €</strong></span>
              <span style={{ color: "#a07858" }}>Остаток: <strong style={{ color: remaining < 0 ? "#c05050" : "#8aab60" }}>{remaining} €</strong></span>
            </div>

            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#c0a090", fontSize: 14 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
                Пока трат нет — Teo одобряет!
              </div>
            ) : (
              <div>
                {entries.map(e => (
                  <div key={e.id} style={styles.entryRow}>
                    <span style={{ color: "#7a4830", fontSize: 14 }}>{e.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "#c47050", fontWeight: 600 }}>−{e.amount} €</span>
                      <button onClick={() => removeEntry(e.id)} style={{
                        background: "none", border: "none", color: "#c0a090", cursor: "pointer", fontSize: 16, padding: 0,
                      }}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "8px 16px", display: "flex", justifyContent: "space-between", fontSize: 13, color: "#b09080" }}>
                  <span>Итого</span>
                  <span style={{ color: "#c47050", fontWeight: 700 }}>{totalMisc} €</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FIXED */}
        {activeTab === "fixed" && (
          <div>
            {fixedExpenses.map(e => (
              <div key={e.id} style={{ ...styles.entryRow, marginBottom: 10, padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{e.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, color: "#7a4830" }}>{e.name}</div>
                    {e.note && <div style={{ fontSize: 11, color: "#c0a090" }}>{e.note}</div>}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: e.color }}>{e.monthly} €</div>
                  <div style={{ fontSize: 10, color: "#c0a090" }}>/ мес</div>
                </div>
              </div>
            ))}
            <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(200,100,60,0.08)", border: "1px solid rgba(200,100,60,0.2)" }}>
              <span style={{ fontSize: 14, color: "#a06040" }}>Итого фиксированные</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#c47050" }}>{TOTAL_FIXED} €</span>
            </div>
            <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(140,180,80,0.1)", border: "1px solid rgba(140,180,80,0.2)", marginTop: 10 }}>
              <span style={{ fontSize: 14, color: "#7a9850" }}>Свободные деньги</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#8aab60" }}>{AVAILABLE} €</span>
            </div>
          </div>
        )}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
