<template>
  <div class="flow">
    <div class="flow-track">
      <template v-for="(step, i) in steps" :key="i">
        <!-- Nodo -->
        <div class="node" :style="{ '--i': i }">
          <div class="node-orb">
            <span class="node-ring"></span>
            <span class="node-ring node-ring--2"></span>
            <v-icon :icon="step.icon" :class="{ 'spin': step.spin }" size="30"></v-icon>
            <span class="node-index">{{ i + 1 }}</span>
          </div>
          <div class="node-label">{{ step.title }}</div>
          <div class="node-sub">{{ step.sub }}</div>
        </div>

        <!-- Connettore con pacchetto dati -->
        <div v-if="i < steps.length - 1" class="link" :style="{ '--i': i }">
          <span class="packet"></span>
          <span class="packet packet--2"></span>
        </div>
      </template>
    </div>

    <!-- Mini monitor: risultato in tempo reale -->
    <div class="board">
      <div class="board-top">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="board-title">
          <v-icon icon="mdi-access-point" size="small" class="live-blink"></v-icon>
          LIVE · Pronto Soccorso
        </span>
      </div>
      <div class="board-rows">
        <div v-for="(row, i) in boardRows" :key="i" class="board-row" :style="{ '--r': i }">
          <span class="board-hosp">
            <v-icon icon="mdi-hospital-marker" size="small"></v-icon>
            {{ row.nome }}
          </span>
          <span class="board-wait">{{ row.attesa }}</span>
          <span class="board-state" :class="`state-${row.state}`"></span>
        </div>
      </div>
    </div>

    <p class="flow-note">
      <v-icon icon="mdi-lightning-bolt" size="small"></v-icon>
      Grazie alla cache <strong>Redis</strong>, le richieste ripetute non ricontattano le fonti:
      la risposta è immediata e il carico sui siti dei pronto soccorso resta minimo.
    </p>
  </div>
</template>

<script setup lang="ts">
const steps = [
  { icon: 'mdi-cursor-default-click-outline', title: 'Apri una pagina', sub: 'Il polling si attiva', spin: false },
  { icon: 'mdi-cog', title: 'Job & code', sub: 'In parallelo sul server', spin: true },
  { icon: 'mdi-hospital-building', title: 'Scraping', sub: 'Fonti ufficiali PS', spin: false },
  { icon: 'mdi-database', title: 'Cache Redis', sub: 'TTL 60 secondi', spin: false },
  { icon: 'mdi-flash', title: 'WebSocket', sub: 'Aggiornamento live', spin: false },
]

const boardRows = [
  { nome: 'Ospedale Civico', attesa: '~35 min', state: 'green' },
  { nome: 'Policlinico', attesa: '~1h 20m', state: 'yellow' },
  { nome: 'Villa Sofia', attesa: '~2h 05m', state: 'red' },
]
</script>

<style scoped lang="scss">
.flow {
  --accent: var(--v-theme-primary);
  padding: 8px 4px 4px;
}

/* ---- Pipeline ---- */
.flow-track {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 0;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 92px;
  flex: 0 0 auto;
  animation: nodeIn 0.6s ease both;
  animation-delay: calc(var(--i) * 0.18s);
}

.node-orb {
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--accent));
  background: radial-gradient(circle at 50% 35%,
      rgba(var(--accent), 0.28),
      rgba(var(--accent), 0.06) 70%);
  border: 2px solid rgba(var(--accent), 0.55);
  box-shadow: 0 0 0 rgba(var(--accent), 0.5);
  animation: orbPulse 3.2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.6s);
}

.node-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 2px solid rgba(var(--accent), 0.5);
  opacity: 0;
  animation: ringExpand 3.2s ease-out infinite;
  animation-delay: calc(var(--i) * 0.6s);
}

.node-ring--2 {
  animation-delay: calc(var(--i) * 0.6s + 1.1s);
}

.node-index {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgb(var(--accent));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

.node-label {
  margin-top: 10px;
  font-weight: 700;
  font-size: 0.82rem;
  color: rgb(var(--v-theme-string));
  line-height: 1.15;
}

.node-sub {
  font-size: 0.7rem;
  color: rgba(var(--v-theme-string), 0.6);
  line-height: 1.2;
  margin-top: 2px;
}

.spin {
  animation: spin 3.5s linear infinite;
}

/* ---- Connettori ---- */
.link {
  position: relative;
  flex: 1 1 auto;
  min-width: 26px;
  height: 62px;
  align-self: flex-start;
  display: flex;
  align-items: center;
}

.link::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  transform: translateY(-50%);
  border-radius: 3px;
  background: linear-gradient(90deg,
      rgba(var(--accent), 0.15),
      rgba(var(--accent), 0.5),
      rgba(var(--accent), 0.15));
}

.packet {
  position: absolute;
  top: 50%;
  left: 0;
  width: 9px;
  height: 9px;
  margin-top: -4.5px;
  border-radius: 50%;
  background: rgb(var(--accent));
  box-shadow: 0 0 10px 2px rgba(var(--accent), 0.9);
  animation: travel 1.8s cubic-bezier(0.55, 0, 0.45, 1) infinite;
  animation-delay: calc(var(--i) * 0.3s);
}

.packet--2 {
  animation-delay: calc(var(--i) * 0.3s + 0.9s);
  opacity: 0.6;
}

/* ---- Board live ---- */
.board {
  max-width: 420px;
  margin: 34px auto 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(var(--accent), 0.3);
  background: linear-gradient(160deg, #1b222b, #10151b);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  animation: boardIn 0.7s ease both;
  animation-delay: 1s;
}

.board-top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff5f57;
}
.dot:nth-child(2) { background: #febc2e; }
.dot:nth-child(3) { background: #28c840; }

.board-title {
  margin-left: 8px;
  font-size: 0.72rem;
  letter-spacing: 1px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.live-blink {
  color: #28c840;
  animation: blink 1.4s ease-in-out infinite;
}

.board-rows {
  padding: 6px 0;
}

.board-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  animation: rowIn 0.5s ease both;
  animation-delay: calc(1.2s + var(--r) * 0.15s);
}

.board-hosp {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.board-wait {
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.board-state {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex: 0 0 auto;
  animation: statePulse 2s ease-in-out infinite;
}
.state-green { background: #34d399; box-shadow: 0 0 8px #34d399; }
.state-yellow { background: #fbbf24; box-shadow: 0 0 8px #fbbf24; animation-delay: 0.4s; }
.state-red { background: #ff5252; box-shadow: 0 0 8px #ff5252; animation-delay: 0.8s; }

.flow-note {
  max-width: 560px;
  margin: 26px auto 0;
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-string), 0.7);
}

/* ---- Keyframes ---- */
@keyframes travel {
  0%   { left: 2%;  opacity: 0; transform: scale(0.6); }
  15%  { opacity: 1; transform: scale(1); }
  85%  { opacity: 1; transform: scale(1); }
  100% { left: 98%; opacity: 0; transform: scale(0.6); }
}

@keyframes orbPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--accent), 0); }
  50%      { box-shadow: 0 0 22px 3px rgba(var(--accent), 0.45); }
}

@keyframes ringExpand {
  0%   { opacity: 0.7; transform: scale(1); }
  70%  { opacity: 0; transform: scale(1.7); }
  100% { opacity: 0; transform: scale(1.7); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes nodeIn {
  from { opacity: 0; transform: translateY(14px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes boardIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes rowIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes statePulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.35); opacity: 0.7; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}

/* ---- Responsive: pipeline verticale su mobile ---- */
@media (max-width: 760px) {
  .flow-track {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .node {
    flex-direction: row;
    text-align: left;
    gap: 14px;
    min-width: 0;
    width: 100%;
    max-width: 300px;
    justify-content: flex-start;
  }

  .node-orb { flex: 0 0 auto; }

  .link {
    width: 3px;
    height: 34px;
    min-width: 0;
    flex: 0 0 auto;
    margin-left: 30px;
    align-self: flex-start;
  }

  .link::before {
    left: 50%;
    right: auto;
    top: 0;
    bottom: 0;
    width: 3px;
    height: auto;
    transform: translateX(-50%);
    background: linear-gradient(180deg,
        rgba(var(--accent), 0.15),
        rgba(var(--accent), 0.5),
        rgba(var(--accent), 0.15));
  }

  .packet {
    left: 50% !important;
    margin-left: -4.5px;
    top: 0;
    animation: travelV 1.8s cubic-bezier(0.55, 0, 0.45, 1) infinite;
    animation-delay: calc(var(--i) * 0.3s);
  }
  .packet--2 { animation-delay: calc(var(--i) * 0.3s + 0.9s); }
}

@keyframes travelV {
  0%   { top: 2%;  opacity: 0; transform: scale(0.6); }
  15%  { opacity: 1; transform: scale(1); }
  85%  { opacity: 1; transform: scale(1); }
  100% { top: 92%; opacity: 0; transform: scale(0.6); }
}

/* Rispetta chi preferisce meno animazioni */
@media (prefers-reduced-motion: reduce) {
  .packet, .packet--2, .node-ring, .spin, .live-blink, .board-state {
    animation: none !important;
  }
  .node, .board, .board-row { animation: none !important; opacity: 1 !important; transform: none !important; }
}
</style>
