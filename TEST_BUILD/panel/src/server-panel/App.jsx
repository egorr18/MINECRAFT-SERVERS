import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./App.css";

const API = "http://localhost:7000";

//utils
function formatBytes(bytes) {
  if (!bytes || bytes < 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

function formatUptime(sec) {
  if (!sec) return "Offline";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${sec}s`;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

// API helpers
async function apiGet(path) {
  const r = await fetch(API + path, {
    headers: { "x-panel-key": "123456" } // example PANEL_KEY
  });
  if (!r.ok) throw new Error("API error");
  return r.json();
}

async function apiPost(path) {
  await fetch(API + path, {
    method: "POST",
    headers: { "x-panel-key": "123456" } // example свой PANEL_KEY
  });
}

//Routing
function parseHash() {
  const hash = window.location.hash || "#/servers";
  const parts = hash.replace("#", "").split("/").filter(Boolean);
  if (parts[0] === "servers") return { page: "servers" };
  if (parts[0] === "server" && parts[1]) {
    return { page: "server", id: parts[1], tab: parts[2] === "files" ? "files" : "console" };
  }
  return { page: "servers" };
}
function go(path) { window.location.hash = path; }

//Components
function StatCard({ title, value, sub, progress }) {
  const pct = progress == null ? 0 : clamp(progress, 0, 100);
  return (
    <div className="card">
      <div className="cardHead"><div className="cardTitle">{title}</div></div>
      <div className="cardValue">{value}</div>
      <div className="cardSub">{sub}</div>
      <div className="bar"><div className="barFill" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function ServersPage() {
  const [status, setStatus] = useState("...");
  const loadStatus = useCallback(async () => {
    try {
      const j = await apiGet("/server/status");
      setStatus(j.running ? "RUNNING" : "STOPPED");
    } catch { setStatus("Offline"); }
  }, []);
  useEffect(() => { loadStatus(); const t = setInterval(loadStatus, 2000); return () => clearInterval(t); }, [loadStatus]);

  const servers = [{ id: "local-1", name: "My Minecraft Server", plan: "Level 1", ram: "2 GB", disk: "10 GB", status }];

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand"><div className="dot" /><div><div className="brandTitle">Your Servers</div><div className="brandSub">Select a server</div></div></div>
        <div className="actions"><button className="btn ghost" onClick={loadStatus}>Refresh</button></div>
      </div>

      <div className="serverGrid">
        {servers.map((s) => (
          <div key={s.id} onClick={() => go(`#/server/${s.id}/console`)} className="serverCard">
            <div><div className="serverTitle">{s.name}</div><div className="serverSub">{s.plan} • {s.ram} RAM • {s.disk} Disk</div></div>
            <div className={`pill ${s.status === "RUNNING" ? "ok" : "off"}`}>{s.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServerPage({ id, tab }) {
  const [status, setStatus] = useState("...");
  const [logs, setLogs] = useState([]);
  const [cmd, setCmd] = useState("");
  const [metrics, setMetrics] = useState({ running: false, cpuPercent: 0, memUsed: 0, memLimit: 0, diskUsed: 0, diskTotal: 0, uptimeSeconds: 0 });
  const wsRef = useRef(null);
  const logBoxRef = useRef(null);

  const loadStatus = useCallback(async () => { try { const j = await apiGet("/server/status"); setStatus(j.running ? "RUNNING" : "STOPPED"); } catch { setStatus("Offline"); } }, []);
  const loadMetrics = useCallback(async () => { try { const j = await apiGet("/server/metrics"); setMetrics(p => ({ ...p, ...j })); } catch {} }, []);

  useEffect(() => { loadStatus(); loadMetrics(); const t = setInterval(() => { loadStatus(); loadMetrics(); }, 2000); return () => clearInterval(t); }, [loadStatus, loadMetrics]);

  // WS console
  useEffect(() => {
    if(tab !== "console") return;
    let ws; let alive = true;
    const connect = () => {
      ws = new WebSocket("ws://localhost:7000/ws/console");
      wsRef.current = ws;
      ws.onmessage = (e) => { try { const msg = JSON.parse(e.data); if(msg.type==="log") setLogs(p => [...p.slice(-1200), msg.line]); } catch{} };
      ws.onclose = () => { wsRef.current = null; if(alive) setTimeout(connect, 1000); };
    };
    connect();
    return () => { alive = false; try{ ws?.close(); } catch{} };
  }, [tab]);

  useEffect(() => { if(tab!=="console") return; const el = logBoxRef.current; if(el) el.scrollTop = el.scrollHeight; }, [logs, tab]);

  const post = async (url) => { await apiPost(url); loadStatus(); loadMetrics(); };
  const send = () => { const t=cmd.trim(); if(!t) return; try{ wsRef.current?.send(JSON.stringify({ type:"cmd", cmd:t })); } catch{} setCmd(""); };

  const memPct = useMemo(()=> metrics.memLimit? (metrics.memUsed/metrics.memLimit)*100:0, [metrics.memUsed, metrics.memLimit]);
  const diskPct = useMemo(()=> metrics.diskTotal? (metrics.diskUsed/metrics.diskTotal)*100:0, [metrics.diskUsed, metrics.diskTotal]);

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand"><div className="dot" /><div><div className="brandTitle">Server</div><div className="brandSub">ID: {id}</div></div></div>
        <div className="actions">
          <div className={`pill ${status==="RUNNING"?"ok":"off"}`}>{status}</div>
          <button className="btn" onClick={()=>post("/server/start")}>Start</button>
          <button className="btn" onClick={()=>post("/server/stop")}>Stop</button>
          <button className="btn" onClick={()=>post("/server/restart")}>Restart</button>
          <button className="btn ghost" onClick={()=>go("#/servers")}>← Back</button>
        </div>
      </div>

      <div className="tabsBar">
        <div className={`tab ${tab==="console"?"active":""}`} onClick={()=>go(`#/server/${id}/console`)}>›_ Console</div>
        <div className={`tab ${tab==="files"?"active":""}`} onClick={()=>go(`#/server/${id}/files`)}>📁 Files</div>
      </div>

      {tab==="console"?(
        <>
        <div className="consoleCard">
          <div className="consoleBody" ref={logBoxRef}>{logs.map((l,i)=><div className="logLine" key={i}>{l}</div>)}</div>
          <div className="consoleInput">
            <span className="prompt">{">>"}</span>
            <input className="input" value={cmd} onChange={e=>setCmd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type command..." disabled={!metrics.running}/>
            <button className="btn" onClick={send} disabled={!metrics.running}>Send</button>
          </div>
        </div>

        <div className="sectionTitle">Dashboard</div>
        <div className="grid">
          <StatCard title="CPU" value={`${metrics.cpuPercent.toFixed(1)}%`} sub="load" progress={metrics.cpuPercent}/>
          <StatCard title="Memory" value={formatBytes(metrics.memUsed)} sub={`of ${formatBytes(metrics.memLimit)} (${memPct.toFixed(1)}%)`} progress={memPct}/>
          <StatCard title="Disk" value={formatBytes(metrics.diskUsed)} sub={`of ${formatBytes(metrics.diskTotal)} (${diskPct.toFixed(1)}%)`} progress={diskPct}/>
          <StatCard title="Uptime" value={formatUptime(metrics.uptimeSeconds)} sub={metrics.running?"Online":"Offline"} progress={metrics.running?100:0}/>
        </div>
        </>
      ):(
        <div className="filesCard">File manager placeholder</div>
      )}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(parseHash());
  useEffect(()=>{ const onHash=()=>setRoute(parseHash()); window.addEventListener("hashchange",onHash); return ()=>window.removeEventListener("hashchange",onHash); }, []);
  return route.page==="servers"?<ServersPage/>:<ServerPage id={route.id} tab={route.tab}/>;
}
