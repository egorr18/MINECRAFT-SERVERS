import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import Docker from "dockerode";
import { Rcon } from "rcon-client";
import os from "os";

const app = express();
app.use(express.json());

//CORS для фронта
app.use(cors({
  origin: "http://localhost:5173"
}));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/console" });

const docker = new Docker();
const CONTAINER_NAME = "mc-mvp-server";

//Утилиты
function bytes(x) { return typeof x === "number" ? x : 0 }

async function containerExists() {
  const list = await docker.listContainers({ all: true });
  return list.some(c => c.Names?.includes("/" + CONTAINER_NAME));
}

async function getContainer() {
  return docker.getContainer(CONTAINER_NAME);
}

async function isRunning() {
  if (!(await containerExists())) return false;
  const container = await getContainer();
  const info = await container.inspect();
  return info.State.Running;
}

function calcCpu(stats) {
  const cpuDelta = bytes(stats.cpu_stats?.cpu_usage?.total_usage)
    - bytes(stats.precpu_stats?.cpu_usage?.total_usage);

  const sysDelta = bytes(stats.cpu_stats?.system_cpu_usage)
    - bytes(stats.precpu_stats?.system_cpu_usage);

  const cpus = stats.cpu_stats?.online_cpus || os.cpus().length || 1;

  if (sysDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / sysDelta) * cpus * 100;
  }
  return 0;
}

//WebSocket 
function broadcast(line) {
  for (const c of wss.clients) {
    if (c.readyState === 1) c.send(JSON.stringify({ type: "log", line }));
  }
}

let logStream = null;

async function streamLogs() {
  if (!(await isRunning())) return;

  const container = await getContainer();

  if (logStream) {
    logStream.destroy();
    logStream = null;
  }

  logStream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 100
  });

  logStream.on('data', chunk => {
    broadcast(chunk.toString());
  });

  logStream.on('error', err => {
    console.error("Docker log stream error:", err);
  });

  logStream.on('end', () => {
    logStream = null;
  });
}

wss.on("connection", ws => {
  ws.on("message", async raw => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "cmd") {
        const rcon = await Rcon.connect({
          host: "127.0.0.1",
          port: Number(process.env.RCON_PORT),
          password: process.env.RCON_PASSWORD
        });

        const out = await rcon.send(msg.cmd);
        await rcon.end();

        broadcast("> " + msg.cmd);
        if (out) broadcast(out);
      }
    } catch (e) {
      broadcast("[RCON error] " + String(e));
    }
  });
});

//REST API
app.get("/server/status", async (_req, res) => {
  res.json({
    exists: await containerExists(),
    running: await isRunning()
  });
});

app.get("/server/metrics", async (_req, res) => {
  try {
    if (!(await isRunning())) {
      return res.json({ running: false, cpuPercent: 0, memUsed: 0, memLimit: 0 });
    }

    const container = await getContainer();
    const stats = await container.stats({ stream: false });

    res.json({
      running: true,
      cpuPercent: calcCpu(stats),
      memUsed: bytes(stats.memory_stats?.usage),
      memLimit: bytes(stats.memory_stats?.limit)
    });

  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/server/start", async (_req, res) => {
  try {
    const container = await getContainer();
    const running = await isRunning();
    if (!running) await container.start();
    await streamLogs();
    res.json({ ok: true });
  } catch (e) {
    console.error("Start error:", e);
    res.status(500).json({ error: String(e) });
  }
});

app.post("/server/stop", async (_req, res) => {
  try {
    const container = await getContainer();
    const running = await isRunning();
    if (running) await container.stop();
    if (logStream) {
      logStream.destroy();
      logStream = null;
    }
    res.json({ ok: true });
  } catch (e) {
    console.error("Stop error:", e);
    res.status(500).json({ error: String(e) });
  }
});

app.post("/server/restart", async (_req, res) => {
  try {
    const container = await getContainer();
    await container.restart();
    await streamLogs();
    res.json({ ok: true });
  } catch (e) {
    console.error("Restart error:", e);
    res.status(500).json({ error: String(e) });
  }
});

server.listen(7000, () => {
  console.log("Agent running on http://localhost:7000");
});
