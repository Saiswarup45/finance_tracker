import { groupByMonth, groupByCat, getDayOfWeek, fmt, fmtCompact } from "../utils/helpers";

export default function Charts({ transactions }) {
  const monthly = groupByMonth(transactions);
  const byCatExp = groupByCat(transactions,"expense");
  const byCatInc = groupByCat(transactions,"income");
  const weekly   = getDayOfWeek(transactions);

  const maxM = Math.max(...monthly.map(m=>Math.max(m.income,m.expense)),1);
  const maxW = Math.max(...weekly.map(w=>Math.max(w.income,w.expense)),1);
  const totalExp = byCatExp.reduce((s,c)=>s+c.amount,0);

  return (
    <div style={s.grid}>

      {/* Monthly Bar Chart */}
      <div style={{...s.card, gridColumn:"1/-1"}} className="au d1">
        <SectionHdr title="Monthly Cashflow" sub="Last 7 months" />
        {monthly.length===0 ? <Empty/> : (
          <div style={s.barChart}>
            {monthly.map((m,i)=>(
              <div key={i} style={s.barGroup}>
                <div style={s.barPair}>
                  <Bar pct={(m.income/maxM)*100} color="var(--teal)" tip={fmt(m.income)} />
                  <Bar pct={(m.expense/maxM)*100} color="var(--amber)" tip={fmt(m.expense)} />
                </div>
                <div style={s.barLbl}>{m.label}</div>
              </div>
            ))}
            {/* Y-axis guides */}
            <div style={s.yGuides}>
              {[100,66,33,0].map(p=>(
                <div key={p} style={s.yLine}>
                  <span style={s.yLabel}>{fmtCompact((maxM*p)/100)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={s.legend}>
          <LegendItem color="var(--teal)"  label="Income"  />
          <LegendItem color="var(--amber)" label="Expense" />
        </div>
      </div>

      {/* Expense Categories */}
      <div style={s.card} className="au d2">
        <SectionHdr title="Expense Breakdown" sub={`Total: ${fmt(totalExp)}`} />
        {byCatExp.length===0 ? <Empty/> : (
          <div style={s.catList}>
            {byCatExp.slice(0,7).map(c=>{
              const pct = totalExp>0 ? (c.amount/totalExp)*100 : 0;
              return (
                <div key={c.name} style={s.catRow}>
                  <span style={{fontSize:16,width:22,textAlign:"center"}}>{c.cat.icon}</span>
                  <span style={s.catName}>{c.name}</span>
                  <div style={s.barBg}>
                    <div style={{...s.barFill, width:`${pct}%`, background:c.cat.color}} />
                  </div>
                  <span style={{...s.catPct, color:c.cat.color}}>{pct.toFixed(0)}%</span>
                  <span style={s.catAmt}>{fmtCompact(c.amount)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income Sources */}
      <div style={s.card} className="au d3">
        <SectionHdr title="Income Sources" />
        {byCatInc.length===0 ? <Empty/> : (
          <div style={s.catList}>
            {byCatInc.map(c=>{
              const total=byCatInc.reduce((s,x)=>s+x.amount,0);
              const pct=total>0?(c.amount/total)*100:0;
              return (
                <div key={c.name} style={s.catRow}>
                  <span style={{fontSize:16,width:22,textAlign:"center"}}>{c.cat.icon}</span>
                  <span style={s.catName}>{c.name}</span>
                  <div style={s.barBg}>
                    <div style={{...s.barFill, width:`${pct}%`, background:c.cat.color}} />
                  </div>
                  <span style={{...s.catPct, color:c.cat.color}}>{pct.toFixed(0)}%</span>
                  <span style={s.catAmt}>{fmtCompact(c.amount)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly heatmap */}
      <div style={{...s.card, gridColumn:"1/-1"}} className="au d4">
        <SectionHdr title="Spending by Day of Week" sub="All time average" />
        {transactions.length===0 ? <Empty/> : (
          <div style={s.weekRow}>
            {weekly.map((w,i)=>(
              <div key={w.day} style={s.weekCol}>
                <div style={s.weekBars}>
                  <WeekBar val={w.income}  max={maxW} color="var(--teal)"  />
                  <WeekBar val={w.expense} max={maxW} color="var(--amber)" />
                </div>
                <div style={s.weekLbl}>{w.day}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function Bar({ pct, color, tip }) {
  return (
    <div style={{flex:1,height:"100%",display:"flex",alignItems:"flex-end"}}>
      <div
        title={tip}
        style={{
          width:"100%", minHeight:2,
          height:`${Math.max(pct,1)}%`,
          background:color, borderRadius:"3px 3px 0 0",
          opacity:0.85, transition:"height 0.6s cubic-bezier(.4,0,.2,1)",
          cursor:"pointer",
        }}
      />
    </div>
  );
}
function WeekBar({ val, max, color }) {
  const pct = max>0 ? (val/max)*100 : 0;
  return (
    <div style={{width:18,background:"var(--bg3)",borderRadius:4,height:80,display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
      <div style={{width:"100%",height:`${Math.max(pct,1)}%`,background:color,opacity:0.8,borderRadius:4,transition:"height 0.5s ease"}} />
    </div>
  );
}
function SectionHdr({ title, sub }) {
  return (
    <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:18}}>
      <div style={{fontFamily:"var(--font-d)",fontSize:14,fontWeight:700,color:"var(--text)"}}>{title}</div>
      {sub && <div style={{fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)"}}>{sub}</div>}
    </div>
  );
}
function LegendItem({ color, label }) {
  return (
    <span style={{display:"flex",alignItems:"center",gap:6,fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)"}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:color,display:"inline-block"}} />
      {label}
    </span>
  );
}
function Empty() {
  return <div style={{textAlign:"center",padding:"24px 0",fontFamily:"var(--font-m)",fontSize:11,color:"var(--text4)"}}>No data yet</div>;
}

const s = {
  grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,padding:"16px 20px"},
  card:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"18px 20px",position:"relative",overflow:"hidden"},
  barChart:{position:"relative",height:180,display:"flex",alignItems:"flex-end",gap:6,paddingLeft:50,paddingBottom:20,paddingTop:10},
  barGroup:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%"},
  barPair:{flex:1,display:"flex",gap:2,width:"100%",alignItems:"flex-end"},
  barLbl:{fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)",marginTop:5},
  yGuides:{position:"absolute",left:0,top:10,bottom:20,width:48,display:"flex",flexDirection:"column",justifyContent:"space-between",pointerEvents:"none"},
  yLine:{borderBottom:"1px dashed var(--border)",width:"100%"},
  yLabel:{fontFamily:"var(--font-m)",fontSize:8,color:"var(--text4)"},
  legend:{display:"flex",gap:16,marginTop:12,justifyContent:"flex-end"},
  catList:{display:"flex",flexDirection:"column",gap:11},
  catRow:{display:"flex",alignItems:"center",gap:8},
  catName:{fontFamily:"var(--font-b)",fontSize:12,color:"var(--text2)",minWidth:80,flexShrink:0},
  barBg:{flex:1,height:5,background:"var(--bg3)",borderRadius:99,overflow:"hidden"},
  barFill:{height:"100%",borderRadius:99,transition:"width 0.6s ease",opacity:0.85},
  catPct:{fontFamily:"var(--font-m)",fontSize:10,minWidth:28,textAlign:"right"},
  catAmt:{fontFamily:"var(--font-m)",fontSize:10,color:"var(--text3)",minWidth:60,textAlign:"right"},
  weekRow:{display:"flex",gap:8,alignItems:"flex-end",justifyContent:"space-around"},
  weekCol:{display:"flex",flexDirection:"column",alignItems:"center",gap:6},
  weekBars:{display:"flex",gap:3,alignItems:"flex-end"},
  weekLbl:{fontFamily:"var(--font-m)",fontSize:9,color:"var(--text3)"},
};