/* Basquet.fun · Del Barrio al Anillo
 * Simulador de carrera de baloncesto (ACB, Euroliga, NCAA, NBA y Selección).
 * Todo es ficción: las fuerzas de los equipos y los resultados son aproximados y aleatorios.
 */
'use strict';

// ---------------------------------------------------------------- Datos
// s = fuerza del equipo (0-100) dentro de su liga, c = color principal
const TEAMS = [
  // [nombre, liga, fuerza, color principal, color secundario, siglas]
  // NBA
  ['Oklahoma City Thunder', 'NBA', 95, '#007ac1', '#ef3b24', 'OKC'], ['Denver Nuggets', 'NBA', 87, '#0e2240', '#fec524', 'DEN'],
  ['Cleveland Cavaliers', 'NBA', 88, '#860038', '#fdbb30', 'CLE'], ['New York Knicks', 'NBA', 86, '#006bb6', '#f58426', 'NYK'],
  ['Houston Rockets', 'NBA', 86, '#ce1141', '#c4ced4', 'HOU'], ['Los Angeles Lakers', 'NBA', 84, '#552583', '#fdb927', 'LAL'],
  ['Minnesota Timberwolves', 'NBA', 84, '#0c2340', '#78be20', 'MIN'], ['Orlando Magic', 'NBA', 83, '#0077c0', '#c4ced4', 'ORL'],
  ['San Antonio Spurs', 'NBA', 82, '#1d1d1d', '#c4ced4', 'SAS'], ['Boston Celtics', 'NBA', 82, '#007a33', '#ba9653', 'BOS'],
  ['Golden State Warriors', 'NBA', 80, '#1d428a', '#ffc72c', 'GSW'], ['Detroit Pistons', 'NBA', 80, '#c8102e', '#1d42ba', 'DET'],
  ['LA Clippers', 'NBA', 80, '#1d428a', '#c8102e', 'LAC'], ['Atlanta Hawks', 'NBA', 79, '#e03a3e', '#c1d32f', 'ATL'],
  ['Dallas Mavericks', 'NBA', 77, '#00538c', '#b8c4ca', 'DAL'], ['Memphis Grizzlies', 'NBA', 76, '#12173f', '#5d76a9', 'MEM'],
  ['Milwaukee Bucks', 'NBA', 76, '#00471b', '#eee1c6', 'MIL'], ['Miami Heat', 'NBA', 75, '#98002e', '#f9a01b', 'MIA'],
  ['Philadelphia 76ers', 'NBA', 74, '#006bb6', '#ed174c', 'PHI'], ['Indiana Pacers', 'NBA', 72, '#002d62', '#fdbb30', 'IND'],
  ['Phoenix Suns', 'NBA', 72, '#1d1160', '#e56020', 'PHX'], ['Toronto Raptors', 'NBA', 72, '#ce1141', '#a1a1a4', 'TOR'],
  ['Sacramento Kings', 'NBA', 70, '#5a2d81', '#63727a', 'SAC'], ['Chicago Bulls', 'NBA', 70, '#ce1141', '#1d1d1d', 'CHI'],
  ['Portland Trail Blazers', 'NBA', 70, '#e03a3e', '#1d1d1d', 'POR'], ['Charlotte Hornets', 'NBA', 64, '#1d1160', '#00788c', 'CHA'],
  ['New Orleans Pelicans', 'NBA', 64, '#0c2340', '#c8102e', 'NOP'], ['Utah Jazz', 'NBA', 60, '#002b5c', '#f9a01b', 'UTA'],
  ['Brooklyn Nets', 'NBA', 58, '#1d1d1d', '#ffffff', 'BKN'], ['Washington Wizards', 'NBA', 55, '#002b5c', '#e31837', 'WAS'],
  // Liga Endesa (ACB)
  ['Real Madrid', 'ACB', 90, '#ffffff', '#d4af37', 'RMA'], ['FC Barcelona', 'ACB', 85, '#a50044', '#004d98', 'BAR'],
  ['Valencia Basket', 'ACB', 84, '#f08a00', '#1d1d1d', 'VBC'], ['Unicaja Málaga', 'ACB', 84, '#007a3d', '#ffffff', 'UNI'],
  ['Baskonia', 'ACB', 80, '#0c2d6b', '#c8102e', 'BAS'], ['La Laguna Tenerife', 'ACB', 77, '#ffd200', '#003a70', 'TFE'],
  ['Dreamland Gran Canaria', 'ACB', 76, '#ffcc00', '#004a99', 'GCA'], ['UCAM Murcia', 'ACB', 74, '#c8102e', '#1d1d1d', 'MUR'],
  ['Joventut Badalona', 'ACB', 72, '#007a3d', '#1d1d1d', 'JOV'], ['BAXI Manresa', 'ACB', 68, '#e30613', '#ffffff', 'MAN'],
  ['Casademont Zaragoza', 'ACB', 66, '#d0021b', '#ffffff', 'ZAR'], ['Surne Bilbao Basket', 'ACB', 66, '#1d1d1d', '#e30613', 'BIL'],
  ['Río Breogán', 'ACB', 66, '#62b5e5', '#ffffff', 'BRE'], ['MoraBanc Andorra', 'ACB', 64, '#003da5', '#ffd100', 'AND'],
  ['Bàsquet Girona', 'ACB', 62, '#b3001b', '#ffffff', 'GIR'], ['San Pablo Burgos', 'ACB', 62, '#c8102e', '#ffffff', 'BUR'],
  ['Covirán Granada', 'ACB', 60, '#e2001a', '#ffffff', 'GRA'], ['Hiopos Lleida', 'ACB', 60, '#0055a4', '#ffffff', 'LLE'],
  // NCAA (EE. UU.)
  ['Duke Blue Devils', 'NCAA', 88, '#003087', '#ffffff', 'DUKE'], ['Kentucky Wildcats', 'NCAA', 84, '#0033a0', '#ffffff', 'UK'],
  ['Kansas Jayhawks', 'NCAA', 84, '#0051ba', '#e8000d', 'KU'], ['UConn Huskies', 'NCAA', 86, '#0e1a3e', '#ffffff', 'UCONN'],
  ['North Carolina Tar Heels', 'NCAA', 80, '#7bafd4', '#13294b', 'UNC'], ['Gonzaga Bulldogs', 'NCAA', 82, '#041e42', '#c8102e', 'GONZ'],
  ['Michigan State Spartans', 'NCAA', 78, '#18453b', '#ffffff', 'MSU'], ['Arizona Wildcats', 'NCAA', 79, '#cc0033', '#003366', 'ARIZ'],
  ['Houston Cougars', 'NCAA', 83, '#c8102e', '#ffffff', 'UH'], ['Villanova Wildcats', 'NCAA', 74, '#00205b', '#13b5ea', 'NOVA'],
].map(([name, league, s, color, color2, abbr]) => ({ name, league, base: s, s, color, color2, abbr }));

const LEAGUE = {
  NBA: { games: 82, title: 'Anillo NBA', level: s => 73 + s * 0.15, scoring: 1, tag: 'nba' },
  ACB: { games: 34, title: 'Liga Endesa', level: s => 57 + s * 0.2, scoring: 0.86, tag: 'acb' },
  NCAA: { games: 32, title: 'Campeonato NCAA', level: s => 50 + s * 0.2, scoring: 0.9, tag: 'ncaa' },
};

const POS = {
  'Base': { pts: 1.0, reb: 0.45, ast: 1.6 },
  'Escolta': { pts: 1.1, reb: 0.55, ast: 0.8 },
  'Alero': { pts: 1.05, reb: 0.8, ast: 0.65 },
  'Ala-pívot': { pts: 0.95, reb: 1.25, ast: 0.45 },
  'Pívot': { pts: 0.9, reb: 1.5, ast: 0.35 },
};

const START_YEAR = 2026;

// Atributos del jugador y su peso en la media según la posición
const ATTRS = [
  { k: 'tiro', label: 'Tiro', icon: '🎯' },
  { k: 'pase', label: 'Pase', icon: '🤝' },
  { k: 'defensa', label: 'Defensa', icon: '🛡️' },
  { k: 'rebote', label: 'Rebote', icon: '🙌' },
  { k: 'velocidad', label: 'Velocidad', icon: '⚡' },
  { k: 'fisico', label: 'Físico', icon: '💪' },
];
const WEIGHTS = {
  'Base': { tiro: .25, pase: .30, defensa: .15, rebote: .05, velocidad: .15, fisico: .10 },
  'Escolta': { tiro: .35, pase: .15, defensa: .15, rebote: .05, velocidad: .20, fisico: .10 },
  'Alero': { tiro: .25, pase: .12, defensa: .20, rebote: .13, velocidad: .15, fisico: .15 },
  'Ala-pívot': { tiro: .15, pase: .08, defensa: .22, rebote: .25, velocidad: .10, fisico: .20 },
  'Pívot': { tiro: .08, pase: .07, defensa: .25, rebote: .30, velocidad: .05, fisico: .25 },
};
const HEIGHT = { 'Base': [183, 196], 'Escolta': [190, 201], 'Alero': [196, 206], 'Ala-pívot': [201, 211], 'Pívot': [206, 222] };
const fmtHeight = cm => (cm / 100).toFixed(2).replace('.', ',') + ' m';

// ---------------------------------------------------------------- Utilidades
const $ = sel => document.querySelector(sel);
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const chance = p => Math.random() < p;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt1 = x => x.toFixed(1).replace('.', ',');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const teamByName = n => TEAMS.find(t => t.name === n);
const teamLevel = t => LEAGUE[t.league].level(t.s);
const starsFor = t => '★'.repeat(clamp(Math.round((t.s - 50) / 10), 1, 5)) + '☆'.repeat(5 - clamp(Math.round((t.s - 50) / 10), 1, 5));
const weightedPick = (items, weightFn) => {
  const w = items.map(weightFn); const total = w.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
};
const seasonLabel = y => `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
const fmtMoney = m => {
  const neg = m < 0, a = Math.abs(m);
  const txt = a >= 1 ? `${a.toFixed(a >= 10 ? 1 : 2).replace('.', ',')} M€` : `${Math.round(a * 1000)} mil €`;
  return (neg ? '−' : '') + txt;
};

// Escudo generado (SVG) con los colores y siglas del equipo — no son logos oficiales
function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}
function crest(t, size = 40) {
  if (!t) return '';
  const fg = isLight(t.color) ? '#111' : '#fff';
  const fs = t.abbr.length >= 5 ? 15 : t.abbr.length === 4 ? 18 : 22;
  const icon = { NBA: '★', ACB: '●', NCAA: '▲' }[t.league] || '';
  return `<svg class="crest" width="${size}" height="${Math.round(size * 1.15)}" viewBox="0 0 80 92" role="img" aria-label="${esc(t.name)}">
    <path d="M40 2 L76 12 V46 C76 70 58 84 40 90 C22 84 4 70 4 46 V12 Z" fill="${t.color}" stroke="${t.color2}" stroke-width="5"/>
    <path d="M6 58 H74 L72 66 H8 Z" fill="${t.color2}"/>
    <text x="40" y="24" text-anchor="middle" font-size="11" fill="${t.color2}" font-family="system-ui">${icon}</text>
    <text x="40" y="50" text-anchor="middle" font-size="${fs}" font-weight="900" fill="${fg}" font-family="system-ui,Arial" letter-spacing="-0.5">${esc(t.abbr)}</text>
  </svg>`;
}
const crestByName = (n, size) => crest(teamByName(n), size);

function roleFor(rel) {
  if (rel >= 8) return 'Estrella';
  if (rel >= 2) return 'Titular';
  if (rel >= -4) return 'Rotación';
  return 'Banquillo';
}

// ---------------------------------------------------------------- Estado
let S = null;

const INJURIES = [
  { name: 'Esguince de tobillo', sev: 1, games: [0.03, 0.1], attrs: {} },
  { name: 'Rotura de fibras', sev: 1, games: [0.08, 0.18], attrs: { velocidad: -1 } },
  { name: 'Fractura en la mano', sev: 2, games: [0.15, 0.3], attrs: { tiro: -2 } },
  { name: 'Hernia discal', sev: 2, games: [0.15, 0.35], attrs: { fisico: -2 } },
  { name: 'Rotura de menisco', sev: 3, games: [0.3, 0.55], attrs: { velocidad: -3, fisico: -2 } },
  { name: 'Rotura del ligamento cruzado', sev: 4, games: [0.75, 1], attrs: { velocidad: -6, fisico: -4, defensa: -2 } },
  { name: 'Rotura del tendón de Aquiles', sev: 5, games: [0.85, 1], attrs: { velocidad: -9, fisico: -6, rebote: -3, defensa: -3 } },
];
function rollInjury() {
  const r = Math.random() + S.fatigue / 140 + (S.age > 30 ? 0.08 : 0);
  const idx = r < 0.3 ? 0 : r < 0.52 ? 1 : r < 0.66 ? 2 : r < 0.78 ? 3 : r < 0.9 ? 4 : r < 1.02 ? 5 : 6;
  return INJURIES[idx];
}

function computeOvr() {
  const w = WEIGHTS[S.pos];
  return clamp(Math.round(ATTRS.reduce((a, { k }) => a + w[k] * S.attrs[k], 0)), 40, 99);
}
function changeAttrs(map) {
  for (const [k, v] of Object.entries(map)) S.attrs[k] = clamp(S.attrs[k] + v, 30, 99);
  S.ovr = computeOvr();
}
function initAttrs(target, height) {
  const w = WEIGHTS[S.pos], [hmin, hmax] = HEIGHT[S.pos];
  const h = ((height - hmin) / (hmax - hmin)) * 2 - 1;   // -1 (bajo) … +1 (alto)
  S.attrs = {};
  ATTRS.forEach(({ k }) => { S.attrs[k] = target + (w[k] - 1 / 6) * 40 + gauss() * 4; });
  S.attrs.rebote += 5 * h; S.attrs.defensa += 2 * h; S.attrs.fisico += 2 * h; S.attrs.velocidad -= 5 * h;
  const cur = ATTRS.reduce((a, { k }) => a + w[k] * S.attrs[k], 0);
  ATTRS.forEach(({ k }) => { S.attrs[k] = clamp(Math.round(S.attrs[k] + target - cur), 30, 99); });
  S.ovr = computeOvr();
}

const NO_TEAM = { name: 'Sin equipo', league: '—', s: 50, base: 50, color: '#3a3f4b', color2: '#9aa3b5', abbr: '?' };

// Ofertas para empezar según el país: de dónde suelen salir los jugadores de cada sitio
const START_PATHS = {
  'España': { ACB: 4, NCAA: 0.35, text: 'Las canteras de la Liga Endesa se pelean por ti.' },
  'EE. UU.': { NCAA: 4, text: 'Las universidades de la NCAA te ofrecen beca.' },
  'Argentina': { ACB: 2, NCAA: 2, text: 'Clubes españoles y universidades de EE. UU. siguen tu carrera.' },
  'México': { NCAA: 3, ACB: 1, text: 'Te llueven becas desde EE. UU. y algún club español pregunta por ti.' },
  'Francia': { ACB: 2, NCAA: 2, text: 'Te observan desde España y desde las universidades americanas.' },
  'Otro': { ACB: 2, NCAA: 2, text: 'Los ojeadores internacionales te han descubierto.' },
};

function startOffers() {
  const path = START_PATHS[S.nat] || START_PATHS['Otro'];
  // Cuanto más talento ven los ojeadores (potencial + nivel actual), mejores equipos llaman
  const scout = S.pot * 0.7 + S.ovr * 0.3 + rand(-4, 4);
  const talent = clamp((scout - 62) / 30, 0, 1);   // 0 = poco talento … 1 = élite
  const offers = [];
  for (const league of ['ACB', 'NCAA']) {
    let n = path[league] || 0;
    if (n > 0 && n < 1) n = chance(n) ? 1 : 0;
    let pool = TEAMS.filter(t => t.league === league);
    const lo = Math.min(...pool.map(t => t.s)), hi = Math.max(...pool.map(t => t.s));
    const target = lo + talent * (hi - lo);
    for (let i = 0; i < n && pool.length; i++) {
      const t = weightedPick(pool, x => Math.exp(-Math.abs(x.s - target) / ((hi - lo) / 6)));
      offers.push(t); pool = pool.filter(x => x !== t);
    }
  }
  return offers.sort((a, b) => b.s - a.s);
}

function newCareer({ name, pos, nat, start, block, height }) {
  TEAMS.forEach(t => { t.s = t.base; });
  S = {
    name, pos, nat, block, height,
    age: 18,
    ovr: 0,
    attrs: {},
    focus: {},                // entrenamiento específico para la próxima temporada
    celebrations: [],
    pot: 0,                   // potencial oculto
    fatigue: 10,              // cansancio acumulado 0-100 (más cansancio = más lesiones y más graves)
    injuries: [],
    forcedRetire: null,
    fame: 10,
    injuryGuard: 0,           // temporadas con menor riesgo de lesión
    growthBonus: 0,           // bonificación de progresión para la próxima temporada
    team: start ? teamByName(start) : NO_TEAM,
    year: START_YEAR,
    drafted: false,
    draftInfo: null,
    ncaaYears: 0,
    nbaSeasons: 0,
    seasons: [],
    trophies: {},
    teamsPath: [],
    totals: { g: 0, pts: 0, reb: 0, ast: 0 },
    earnings: 0,              // millones de euros ganados
    peak: 0,                  // media máxima alcanzada
    over: false,
  };
  if (start) S.teamsPath.push(S.team.name);
  const start0 = randi(54, 64);
  S.pot = Math.max(start0 + 3, Math.round(63 + 34 * Math.pow(Math.random(), 1.1)));
  initAttrs(start0, height);
  S.peak = S.ovr; S.peakAttrs = { ...S.attrs }; S.prevAttrs = { ...S.attrs };
}

const CELEBRATE = /Anillo|Euroliga|Liga Endesa|Copa del Rey|Campeonato NCAA|MVP|Rookie|Most Outstanding|Oro|Plata|Bronce/;
function addTrophy(name, n = 1) {
  S.trophies[name] = (S.trophies[name] || 0) + n;
  if (CELEBRATE.test(name)) S.celebrations.push({ key: name, team: /Oro|Plata|Bronce/.test(name) ? null : S.team, season: seasonLabel(S.year), summer: S.year + 1 });
}

// ---------------------------------------------------------------- Simulación de temporada
function driftTeams() {
  TEAMS.forEach(t => { t.s = clamp(t.s + gauss() * 2.5 + (t.base - t.s) * 0.15, t.base - 14, Math.min(99, t.base + 12)); });
}

function simulateSeason() {
  driftTeams();
  const t = S.team, L = LEAGUE[t.league], prof = POS[S.pos];
  const level = teamLevel(t);
  const rel = S.ovr - level;
  const role = roleFor(rel);
  const minutes = clamp(22 + rel * 2.0 + rand(-2, 2), t.league === 'NBA' ? 6 : 10, 37);

  // Lesiones: el riesgo y la gravedad crecen con el cansancio y la edad
  let gp = L.games - randi(0, Math.round(L.games * 0.05)), injury = null;
  const injRisk = ((S.age > 30 ? 0.13 : 0.08) + S.fatigue / 220 + (S.age > 33 ? 0.06 : 0)) * (S.injuryGuard > 0 ? 0.6 : 1);
  if (chance(injRisk)) {
    injury = rollInjury();
    const missed = Math.round(L.games * rand(...injury.games));
    gp = Math.max(0, L.games - missed);
    changeAttrs(injury.attrs);
    S.injuries.push({ name: injury.name, sev: injury.sev, season: seasonLabel(S.year) });
    if (injury.sev >= 3) S.celebrations.push({ key: 'Lesión', bad: true, injury, team: t, season: seasonLabel(S.year), missed: L.games - gp, games: L.games });
    if ((injury.sev === 5 && S.age >= 30 && chance(0.45)) || (injury.sev >= 4 && S.age >= 33 && chance(0.35))) {
      S.forcedRetire = `La ${injury.name.toLowerCase()} pone fin a tu carrera a los ${S.age} años.`;
      S.celebrations[S.celebrations.length - 1].ending = true;
    }
    S.fatigue = Math.max(0, S.fatigue - 25);   // la baja obliga a descansar
  }
  if (S.injuryGuard > 0) S.injuryGuard--;
  if (gp === 0) { /* temporada en blanco */ }

  // Estadísticas
  const a = S.attrs, f = minutes / 36;
  const heightScore = clamp(50 + (S.height - 200) * 2, 20, 95);
  const qp = Math.max(2, 0.5 * S.ovr + 0.5 * a.tiro - 45);
  const qr = Math.max(2, 0.4 * S.ovr + 0.4 * a.rebote + 0.2 * heightScore - 45);
  const qa = Math.max(2, 0.5 * S.ovr + 0.5 * a.pase - 45);
  const ppg = qp * 0.55 * prof.pts * L.scoring * f * rand(0.88, 1.12);
  const rpg = qr * 0.22 * prof.reb * f * rand(0.85, 1.15);
  const apg = qa * 0.15 * prof.ast * f * rand(0.85, 1.15);

  // Resultado del equipo
  const playedShare = gp / L.games, healthy = playedShare >= 0.45;
  const contribution = rel * f * 0.6 * playedShare;
  const league = TEAMS.filter(x => x.league === t.league)
    .map(x => ({ team: x, score: x.s + gauss() * 5 + (x === t ? contribution : 0) }))
    .sort((a, b) => b.score - a.score);
  const rank = league.findIndex(x => x.team === t) + 1;
  const top = league[0].score;
  const contenders = t.league === 'NCAA' ? league : league.slice(0, t.league === 'NBA' ? 10 : 8);
  const champ = weightedPick(contenders, x => Math.exp((x.score - top) / (t.league === 'NCAA' ? 3 : 3.5))).team;
  const won = champ === t;
  const awards = [];
  let result = `${rank}º de ${league.length}`;

  if (won) { addTrophy(L.title); awards.push('🏆 ' + L.title); }
  else if (contenders.some(x => x.team === t)) result += ' · Playoffs';

  if (t.league === 'ACB') {
    const copaField = league.slice(0, 8);
    if (copaField.some(x => x.team === t)) {
      const copa = weightedPick(copaField, x => Math.exp((x.score - top) / 6)).team;
      if (copa === t) { addTrophy('Copa del Rey'); awards.push('🏆 Copa del Rey'); }
    }
    // Euroliga: los 4 equipos ACB más fuertes de la temporada
    const euro = [...TEAMS.filter(x => x.league === 'ACB')].sort((a, b) => b.s - a.s).slice(0, 4);
    if (euro.includes(t)) {
      const myScore = league.find(x => x.team === t).score;
      const p = clamp((myScore - 76) / 90, 0.02, 0.22);
      if (chance(p)) {
        addTrophy('Euroliga'); awards.push('🏆 Euroliga');
        if (healthy && rel >= 6 && chance(0.6)) { addTrophy('MVP Final Four'); awards.push('⭐ MVP Final Four'); }
      } else if (chance(p * 1.6)) awards.push('Final Four');
      if (healthy && S.ovr >= 85 && rel >= 7 && chance(0.25)) { addTrophy('MVP Euroliga'); awards.push('⭐ MVP Euroliga'); }
    }
    if (healthy && rel >= 7 && ppg >= 13 && chance(clamp(0.15 + (rel - 7) * 0.06, 0, 0.6))) { addTrophy('MVP Liga Endesa'); awards.push('⭐ MVP ACB'); }
    if (healthy && S.age <= 22 && rel >= 0 && chance(0.35)) { addTrophy('Mejor Joven ACB'); awards.push('Mejor Joven ACB'); }
  }

  if (t.league === 'NBA') {
    S.nbaSeasons++;
    if (healthy && S.nbaSeasons === 1 && ppg >= 12 && chance(clamp((ppg - 10) / 12, 0, 0.9))) { addTrophy('Rookie del Año'); awards.push('⭐ Rookie del Año'); }
    if (healthy && (ppg >= 21 || (S.ovr >= 87 && chance(0.7)))) { addTrophy('All-Star'); awards.push('All-Star'); }
    if (S.ovr >= 91 && gp > 60) { addTrophy('All-NBA'); awards.push('All-NBA'); }
    if (S.ovr >= 93 && rank <= 5 && gp > 65 && chance((S.ovr - 92) * 0.16)) { addTrophy('MVP NBA'); awards.push('⭐ MVP NBA'); }
    if (healthy && won && rel >= 6 && chance(0.7)) { addTrophy('MVP de las Finales'); awards.push('⭐ MVP Finales'); }
  }

  if (t.league === 'NCAA') {
    S.ncaaYears++;
    if (healthy && ppg >= 18) { addTrophy('All-American'); awards.push('All-American'); }
    if (healthy && won && rel >= 4) { addTrophy('Most Outstanding Player'); awards.push('⭐ MOP Final Four'); }
  }

  // Selección española (verano tras la temporada)
  const summer = S.year + 1;
  const tourney = { 3: 'Mundial', 0: 'Juegos Olímpicos', 1: 'EuroBasket' }[summer % 4];
  if (S.nat === 'España' && tourney && S.ovr >= 81 && !(injury && injury.sev >= 3)) {
    S.fatigue += 12;
    const pGold = clamp(0.08 + (S.ovr - 82) * 0.015, 0.05, 0.35);
    const r = Math.random();
    let medal = null;
    if (r < pGold) medal = 'Oro';
    else if (r < pGold + 0.12) medal = 'Plata';
    else if (r < pGold + 0.24) medal = 'Bronce';
    const icon = { Oro: '🥇', Plata: '🥈', Bronce: '🥉' };
    if (medal) {
      const label = tourney === 'Juegos Olímpicos' ? `${medal} olímpico` : `${medal} ${tourney}`;
      addTrophy(label); awards.push(`${icon[medal]} ${label} ${summer}`);
    } else awards.push(`🇪🇸 ${tourney} ${summer}`);
    S.fame += 3;
  }

  // Progresión
  const prevOvr = S.ovr;
  const gap = S.pot - S.ovr;
  let delta;
  if (S.age <= 21) delta = gap * rand(0.08, 0.24) + rand(-1, 1.5);
  else if (S.age <= 25) delta = gap * rand(0.04, 0.16) + rand(-1.5, 1);
  else if (S.age <= 29) delta = rand(-1.5, 1.5);
  else if (S.age <= 32) delta = rand(-3.5, 0);
  else delta = rand(-6, -2);
  if (gap <= 0 && delta > 0) delta = rand(-1, 0.5);        // techo de potencial
  if (S.age <= 25) delta += role === 'Banquillo' ? -1.2 : minutes > 28 ? 0.8 : 0;   // sin minutos te estancas
  if (S.fatigue > 70) delta -= 1;                         // jugar reventado pasa factura
  delta += S.growthBonus; S.growthBonus = 0;
  // Reparto por atributos: el cuerpo crece de joven y se apaga con la edad; la cabeza mejora
  const aging = S.age <= 22 ? { velocidad: 0.5, fisico: 0.8 }
    : S.age >= 29 ? { velocidad: -1.6, fisico: -1.0, rebote: -0.3, tiro: 0.7, pase: 0.8 } : {};
  const changes = {};
  ATTRS.forEach(({ k }) => { changes[k] = Math.round(delta + gauss() * 1.2 + (aging[k] || 0) + (S.focus[k] || 0)); });
  S.focus = {};
  changeAttrs(changes);
  if (S.ovr >= S.peak) { S.peak = S.ovr; S.peakAttrs = { ...S.attrs }; }

  // Cansancio: sube con los minutos jugados, se recupera algo de forma natural
  S.fatigue = clamp(S.fatigue + (gp / L.games) * minutes * 0.9 + (t.league === 'NBA' ? 8 : 0) - (S.age < 28 ? 22 : 15), 0, 100);

  // Fama
  S.fame = clamp(S.fame + (role === 'Estrella' ? 6 : role === 'Titular' ? 3 : 0) + (won ? 5 : 0) + (t.league === 'NBA' ? 2 : 0), 0, 100);

  // Totales
  S.totals.g += gp; S.totals.pts += ppg * gp; S.totals.reb += rpg * gp; S.totals.ast += apg * gp;

  // Dinero: sueldo + patrocinios según la fama
  const salary = salaryM(t, prevOvr);
  const sponsors = (S.fame / 100) * (t.league === 'NBA' ? 6 : 0.8);
  const earned = salary + sponsors;
  S.earnings += earned;

  const season = {
    label: seasonLabel(S.year), team: t.name, color: t.color, league: t.league,
    age: S.age, ovr: prevOvr, newOvr: S.ovr, gp, ppg, rpg, apg, role, result, won, awards, injury: injury ? injury.name : null, injurySev: injury ? injury.sev : 0, earned,
  };
  S.seasons.push(season);
  S.year++; S.age++;
  return season;
}

// ---------------------------------------------------------------- Efectos (lo que suma o resta cada decisión)
// fx = { attrs: { tiro: 2, ... }, fatigue, money (M€), fame, pot, guard }
const nba = () => S.team.league === 'NBA';
const cash = (acb, nbaVal) => (nba() ? nbaVal : acb);
const one = (fx, msg) => [{ p: 1, fx, msg }];

function applyFx(fx = {}) {
  if (fx.attrs) changeAttrs(fx.attrs);
  if (fx.fatigue) S.fatigue = clamp(S.fatigue + fx.fatigue, 0, 100);
  if (fx.money) S.earnings += fx.money;
  if (fx.fame) S.fame = clamp(S.fame + fx.fame, 0, 100);
  if (fx.pot) S.pot += fx.pot;
  if (fx.guard) S.injuryGuard = Math.max(S.injuryGuard, fx.guard);
}

const ATTR_COLOR = { tiro: '#ff7a1a', pase: '#3b82f6', defensa: '#a855f7', rebote: '#14b8a6', velocidad: '#eab308', fisico: '#ef4444' };
const fmtShort = m => { const a = Math.abs(m); return a >= 1 ? `${a.toFixed(1).replace('.', ',')}M€` : `${Math.max(1, Math.round(a * 1000))}k€`; };

function fxHTML(fx = {}) {
  const chips = [];
  const sign = v => (v > 0 ? '+' : '−') + Math.abs(v);
  const chip = (cls, txt, title) => `<span class="fx ${cls}" title="${title}">${txt}</span>`;
  for (const [k, v] of Object.entries(fx.attrs || {})) {
    if (!v) continue;
    const a = ATTRS.find(x => x.k === k);
    chips.push(chip(v > 0 ? 'pos' : 'neg', `${a.icon} ${sign(v)}`, a.label));
  }
  if (fx.pot) chips.push(chip('pos', `🌱 ${sign(fx.pot)}`, 'Potencial'));
  if (fx.fatigue) chips.push(chip(fx.fatigue > 0 ? 'neg' : 'pos', `🥵 ${sign(fx.fatigue)}`, 'Cansancio'));
  if (fx.money) chips.push(chip(fx.money > 0 ? 'pos' : 'neg', `💰 ${fx.money > 0 ? '+' : '−'}${fmtShort(fx.money)}`, 'Dinero'));
  if (fx.fame) chips.push(chip(fx.fame > 0 ? 'pos' : 'neg', `⭐ ${sign(fx.fame)}`, 'Fama'));
  if (fx.guard) chips.push(chip('pos', '🩹', 'Menos riesgo de lesión'));
  return chips.length ? chips.join('') : '<span class="fx">Sin efectos</span>';
}

function fxScore(fx = {}) {
  return Object.values(fx.attrs || {}).reduce((a, v) => a + v, 0) + (fx.pot || 0) + (fx.fame || 0) / 2 + (fx.money || 0) * 4 - (fx.fatigue || 0) / 10;
}

function outcomesHTML(outcomes) {
  if (outcomes.length === 1) return `<span class="fxs">${fxHTML(outcomes[0].fx)}</span>`;
  return outcomes.map(o => `<span class="fxs"><span class="prob ${fxScore(o.fx) >= 0 ? 'good' : 'bad'}">${Math.round(o.p * 100)}%</span>${fxHTML(o.fx)}</span>`).join('');
}

const FX_LEGEND = '<p class="legend">🥵 cansancio · 💰 dinero · ⭐ fama · 🌱 potencial · 🩹 menos lesiones</p>';

function runOption(opt) {
  let r = Math.random(), chosen = opt.outcomes[opt.outcomes.length - 1];
  for (const o of opt.outcomes) { if (r < o.p) { chosen = o; break; } r -= o.p; }
  applyFx(chosen.fx);
  return { msg: chosen.msg, fx: chosen.fx };
}

// ---------------------------------------------------------------- Entrenamientos de verano (cambian cada vez)
const TRAININGS = {
  tiro: { name: 'Tiro', icon: '🎯', pair: 'pase', msg: 'Mil tiros diarios. Tu mecánica está más fina que nunca.' },
  pase: { name: 'Pase y dirección', icon: '🤝', pair: 'tiro', msg: 'Lees el juego un segundo antes que los demás.' },
  defensa: { name: 'Defensa', icon: '🛡️', pair: 'velocidad', msg: 'Piernas flexionadas y manos activas: ahora eres un candado.' },
  rebote: { name: 'Rebote y poste', icon: '🙌', pair: 'fisico', msg: 'Cajear, saltar, asegurar. El rebote es tuyo.' },
  velocidad: { name: 'Velocidad', icon: '⚡', pair: 'fisico', msg: 'Tu primer paso es más explosivo que nunca.' },
  fisico: { name: 'Gimnasio', icon: '💪', pair: 'rebote', msg: 'Llegas a pretemporada como un toro.' },
};
const LEVELS = [
  { tag: 'Suave', badge: '🔥', gain: 2, pair: 0, fatigue: 8, cost: () => cash(0.01, 0.03) },
  { tag: 'Intensivo', badge: '🔥🔥', gain: 4, pair: 0, fatigue: 20, cost: () => cash(0.03, 0.1) },
  { tag: 'Entrenador privado', badge: '👨‍🏫', gain: 4, pair: 2, fatigue: 14, cost: () => cash(0.12, 0.6) },
];

function trainingOption(k, lv) {
  const t = TRAININGS[k];
  let gain = lv.gain, pairGain = lv.pair;
  const physical = k === 'velocidad' || k === 'fisico';
  if (S.age >= 30 && physical) gain = Math.max(1, gain - 2);          // de veterano cuesta más ganar físico
  if (S.age >= 30 && !physical) gain += 1;                            // pero la técnica sigue mejorando
  const attrs = { [k]: gain };
  if (pairGain) attrs[t.pair] = pairGain;
  const fx = { attrs, fatigue: lv.fatigue, money: -lv.cost() };
  if (k === 'fisico') fx.guard = 1;
  return { icon: t.icon, color: ATTR_COLOR[k], label: t.name, badge: `${lv.badge} ${lv.tag}`, outcomes: one(fx, t.msg) };
}

function summerOptions() {
  const keys = shuffle(Object.keys(TRAININGS)).slice(0, 3);
  const levels = shuffle(LEVELS);
  const opts = keys.map((k, i) => trainingOption(k, levels[i]));
  // Liga de verano: mejora tu peor atributo
  const worst = ATTRS.reduce((m, a) => (S.attrs[a.k] < S.attrs[m.k] ? a : m));
  if (chance(0.5)) opts.push({ icon: '🏀', color: '#f97316', label: 'Liga de verano', badge: 'Punto débil', outcomes: one({ attrs: { [worst.k]: 3 }, fatigue: 25, money: cash(0.01, 0.05) }, 'Partidos y más partidos en verano.') });
  opts.push({ icon: '🏝️', color: '#22c55e', label: 'Vacaciones', badge: 'Recuperas mucho', outcomes: one({ fatigue: -45, money: -cash(0.03, 0.25), fame: 1 }, 'Playa, familia y cero balones. Vuelves con las pilas cargadas. 🔋') });
  opts.push({ icon: '🏠', color: '#10b981', label: 'Descanso en casa', badge: 'Gratis', outcomes: one({ fatigue: -28 }, 'Sofá, series y paseos. Recuperas bastante.') });
  return opts;
}

// ---------------------------------------------------------------- Eventos aleatorios
const EVENTS = [
  () => {
    const at = pick(ATTRS.slice(0, 4));
    return { title: '🎓 Campus con una leyenda', text: 'Un exjugador histórico te invita a entrenar con él en su campus de verano (el viaje lo pagas tú).', options: [
      { label: 'Aceptar', sub: 'Aprender de los mejores', outcomes: [
        { p: 0.75, fx: { attrs: { [at.k]: 4 }, fatigue: 10, money: -cash(0.02, 0.06) }, msg: 'La leyenda te enseña sus secretos.' },
        { p: 0.25, fx: { fatigue: 10, money: -cash(0.02, 0.06) }, msg: 'Mucho aprender, pero poco que aplicar. Al menos la foto quedó bien.' }] },
      { label: 'Rechazar', sub: 'Prefieres descansar', outcomes: one({ fatigue: -10 }, 'Descansas en casa con la familia.') },
    ] };
  },
  () => ({ title: '📱 Polémica en redes', text: 'Un periodista critica tu actitud en el último partido y el tema se hace viral.', options: [
    { label: 'Responder en la pista', sub: 'Que hable tu juego', outcomes: one({ attrs: { tiro: 1, defensa: 1 }, fatigue: 5 }, 'Te encierras en el gimnasio. La mejor respuesta es un triple.') },
    { label: 'Contestar en Twitter', sub: 'Arriesgado…', outcomes: [
      { p: 0.5, fx: { fame: 8, money: cash(0.03, 0.2) }, msg: 'Tu respuesta se hace legendaria. Ganas seguidores y una marca te paga por un post.' },
      { p: 0.5, fx: { fame: -5, attrs: { tiro: -1, pase: -1 } }, msg: 'Te llueven críticas y te cuesta centrarte.' }] },
  ] }),
  () => {
    const pay = Math.round((cash(0.15, 1.2) + S.fame * cash(0.004, 0.04)) * 100) / 100;
    return { title: '👟 Oferta de patrocinio', text: 'Una marca de zapatillas quiere sacar tu modelo propio.', options: [
      { label: 'Firmar', sub: 'Dinero y fama, pero más compromisos', outcomes: [
        { p: 0.7, fx: { money: pay, fame: 6 }, msg: '¡Tus zapatillas se agotan en dos días!' },
        { p: 0.3, fx: { money: pay, fame: 6, fatigue: 12, attrs: { fisico: -1 } }, msg: 'Se venden genial, aunque los eventos te quitan horas de entreno.' }] },
      { label: 'Rechazar', sub: 'Solo baloncesto', outcomes: one({ attrs: { tiro: 1 } }, 'Sigues centrado al 100% en la pista.') },
    ] };
  },
  () => ({ title: '🏥 Molestias en la rodilla', text: 'Los médicos detectan una pequeña lesión. Puedes operarte ahora o aguantar.', options: [
    { label: 'Operarse', sub: 'Pierdes algo de forma, pero seguro', outcomes: one({ attrs: { velocidad: -2 }, fatigue: -15, guard: 3 }, 'Operación exitosa. Rodilla como nueva.') },
    { label: 'Aguantar', sub: 'Puede salir bien… o no', outcomes: [
      { p: 0.65, fx: {}, msg: 'La rodilla responde. Ni te acuerdas.' },
      { p: 0.35, fx: { attrs: { velocidad: -5, fisico: -3 }, fatigue: 10 }, msg: 'Mala decisión: la lesión empeora y pierdes explosividad.' }] },
  ] }),
  () => {
    const [a1, a2] = shuffle(ATTRS).slice(0, 2);
    return { title: '🧠 Nuevo entrenador personal', text: 'Un preparador conocido por trabajar con estrellas NBA quiere entrenarte.', options: [
      { label: 'Contratarlo', sub: 'Caro, pero efectivo', outcomes: one({ attrs: { [a1.k]: 2, [a2.k]: 2 }, fatigue: 8, money: -cash(0.15, 0.9) }, 'Nuevos hábitos, nueva dieta, nuevo jugador.') },
      { label: 'Seguir con el de siempre', sub: 'La confianza vale mucho', outcomes: one({ attrs: { pase: 1 }, fame: 1 }, 'Tu entrenador de siempre te conoce mejor que nadie.') },
    ] };
  },
  () => ({ title: '🍾 Noche de fiesta', text: 'Tus compañeros te invitan a celebrar a lo grande… a dos días del inicio de la pretemporada.', options: [
    { label: 'Ir a la fiesta', sub: 'Una noche no hace daño… ¿o sí?', outcomes: [
      { p: 0.55, fx: { fame: 3, fatigue: 5, money: -cash(0.005, 0.03) }, msg: 'Gran noche y nadie se entera. Te has librado.' },
      { p: 0.45, fx: { fame: 3, fatigue: 15, attrs: { fisico: -2, velocidad: -1 }, money: -cash(0.03, 0.15) }, msg: 'Llegas fuera de forma, el club se entera y te multa.' }] },
    { label: 'Quedarte en casa', sub: 'Profesional', outcomes: one({ fatigue: -5 }, 'A dormir pronto. El cuerpo te lo agradece.') },
  ] }),
  () => {
    const fine = Math.round(salaryM(S.team) * 0.05 * 100) / 100 || 0.01;
    return { title: '😤 Bronca con el entrenador', text: 'El entrenador te critica delante del vestuario por tu defensa.', options: [
      { label: 'Agachar la cabeza y trabajar', sub: 'Humildad', outcomes: one({ attrs: { defensa: 2 }, fatigue: 5 }, 'Te pones las pilas atrás.') },
      { label: 'Encararte con él', sub: 'Que sepa quién manda', outcomes: [
        { p: 0.6, fx: { fame: -4, money: -fine, attrs: { tiro: -1, pase: -1 } }, msg: 'Multa y al fondo del banquillo durante semanas. Mal asunto.' },
        { p: 0.4, fx: { fame: 4 }, msg: 'El vestuario se pone de tu lado. Ganas galones.' }] },
    ] };
  },
  () => ({ title: '📉 Bajón de confianza', text: 'Llevas semanas sin meter un tiro y la prensa empieza a hablar de "jugador quemado".', options: [
    { label: 'Psicólogo deportivo', sub: 'Trabajar la cabeza', outcomes: [
      { p: 0.7, fx: { money: -cash(0.02, 0.05), attrs: { tiro: 1 } }, msg: 'Recuperas la confianza poco a poco.' },
      { p: 0.3, fx: { money: -cash(0.02, 0.05), attrs: { tiro: -1 } }, msg: 'Te cuesta salir del pozo.' }] },
    { label: 'Ignorarlo y tirar más', sub: 'Ya entrarán', outcomes: [
      { p: 0.5, fx: { attrs: { tiro: 2 } }, msg: '¡Vuelves a enchufarlas!' },
      { p: 0.5, fx: { attrs: { tiro: -3 } }, msg: 'Cada vez peor. Tu mecánica se resiente.' }] },
  ] }),
  () => {
    const young = S.age <= 23;
    return { title: '🌱 ¿Estirón tardío?', text: 'Los preparadores ven algo distinto en ti este verano.', options: [
      { label: 'Doble sesión diaria', sub: young ? 'A por todas' : 'A tu edad ya no creces, pero algo ganas', outcomes: young ? [
        { p: 0.6, fx: { pot: 4, fatigue: 15 }, msg: '¡Explotas! Tu techo como jugador es más alto de lo que nadie pensaba.' },
        { p: 0.4, fx: { attrs: { fisico: 1 }, fatigue: 15 }, msg: 'Mucho sudor para una mejora pequeña.' }]
        : one({ attrs: { fisico: 1 }, fatigue: 15 }, 'Mucho sudor para una mejora pequeña.') },
      { label: 'Ir con calma', sub: 'Sin forzar', outcomes: one({ fatigue: -10 }, 'Ritmo tranquilo. Llegas descansado.') },
    ] };
  },
  () => {
    const inv = cash(0.2, 2);
    return { title: '🍔 Propuesta de negocio', text: 'Un amigo de la infancia te propone invertir en su cadena de hamburgueserías.', options: [
      { label: `Invertir ${fmtMoney(inv)}`, sub: 'Puede salir muy bien… o muy mal', outcomes: [
        { p: 0.45, fx: { money: inv * 1.5 }, msg: '¡Las hamburguesas triunfan! Recuperas la inversión y ganas un 150% más.' },
        { p: 0.55, fx: { money: -inv }, msg: 'El negocio cierra a los seis meses. Adiós al dinero.' }] },
      { label: 'No invertir', sub: 'Mejor no mezclar amistad y dinero', outcomes: one({}, 'Tu amigo se enfada un poco, pero tu cartera lo agradece.') },
    ] };
  },
  () => {
    const don = cash(0.05, 0.5);
    return { title: '❤️ Fundación benéfica', text: 'Te proponen apadrinar canchas de baloncesto en tu barrio.', options: [
      { label: `Donar ${fmtMoney(don)}`, sub: 'Devolver al barrio lo que te dio', outcomes: one({ money: -don, fame: 7 }, 'Inauguras tres canchas con tu nombre. Los chavales te adoran.') },
      { label: 'Ahora no', sub: 'Quizá más adelante', outcomes: one({}, 'Lo dejas para otro momento.') },
    ] };
  },
  () => ({ title: '🎙️ Podcast y streaming', text: 'Una plataforma te ofrece un podcast semanal durante la temporada.', options: [
    { label: 'Aceptar', sub: 'Dinero y fama, más horas fuera de la pista', outcomes: one({ money: cash(0.04, 0.35), fame: 4, fatigue: 8 }, 'Tu podcast es un éxito entre los aficionados.') },
    { label: 'Rechazar', sub: 'Concentrado en el baloncesto', outcomes: one({ fatigue: -3 }, 'Más tiempo para descansar.') },
  ] }),
];

// ---------------------------------------------------------------- Ofertas
// Sueldo anual en millones de euros
function salaryM(team, ovr = S.ovr) {
  if (team.league === 'NBA') return Math.max(1.1, (ovr - 70) * 2.3 * (0.75 + (team.s - 55) / 80)) * 0.92;
  if (team.league === 'NCAA') return 0.05;
  const acb = Math.max(0.06, (ovr - 58) * 0.12) * (0.75 + (team.s - 55) / 80);
  return S && S.age <= 19 ? Math.min(acb, 0.03 + team.s / 2000) : acb;   // contrato de formación
}
function salaryText(team) {
  if (team.league === 'NCAA') return 'Beca + NIL';
  return fmtMoney(salaryM(team)) + '/año';
}

// Tarjeta de oferta: color del equipo, escudo y datos clave en etiquetas cortas
const ROLE_STYLE = { Estrella: ['🌟', 'star'], Titular: ['✅', 'start'], 'Rotación': ['🔄', 'rot'], Banquillo: ['🪑', 'bench'] };
function teamCard(team, { attr, badges = [], youth = false } = {}) {
  const rel = S.ovr - teamLevel(team), role = roleFor(rel);
  const [ri, rc] = ROLE_STYLE[role];
  const ncaa = team.league === 'NCAA';
  const per = ncaa ? 0.05 : salaryM(team);
  const sponsors = ncaa ? 0 : (S.fame / 100) * (team.league === 'NBA' ? 6 : 0.8);
  const minutes = Math.round(clamp(22 + rel * 2.0, team.league === 'NBA' ? 6 : 10, 37));
  const kpis = [
    `<span class="kpi role ${rc}">${ri} ${role}</span>`,
    `<span class="kpi money" title="Sueldo ${fmtMoney(per)} + patrocinios ${fmtMoney(sponsors)}">💰 ${fmtShort(per + sponsors)}/año</span>`,
    `<span class="kpi ${minutes > 30 ? 'hot' : ''}" title="Minutos por partido">⏱️ ${minutes}'</span>`,
  ];
  if (S.age <= 25 && role === 'Banquillo') kpis.push('<span class="kpi bad" title="Sin minutos te estancas: progresión −1 por temporada">📉 Te estancas</span>');
  else if (S.age <= 25 && minutes > 28) kpis.push('<span class="kpi good" title="Muchos minutos: progresión +1 por temporada">📈 Progresas</span>');
  return `<button class="opt team" ${attr} style="--tc:${team.color}">
    <span class="opt-crest">${crest(team, 46)}</span>
    <span class="opt-body">
      <span class="opt-head"><b>${esc(team.name)}</b><span class="tag ${LEAGUE[team.league].tag}">${team.league}</span></span>
      <span class="opt-sub"><span class="stars">${starsFor(team)}</span>${badges.map(b => `<span class="pill">${b}</span>`).join('')}</span>
      <span class="kpis">${kpis.join('')}</span>
    </span>
  </button>`;
}

function offerBadges(o) {
  const b = [];
  if (o.draft) b.push(`🎯 Draft nº ${o.draft}`);
  if (o.note && o.note.includes('ambiciosa')) b.push('🔥 La mejor');
  if (o.note && o.note.includes('Última')) b.push('⚠️ Última opción');
  if (o.note && o.note.includes('rodilla')) b.push('🩼 Dudan de ti');
  return b;
}

function offerFor(team, extra = {}) {
  const rel = S.ovr - teamLevel(team);
  return { team, role: roleFor(rel), salary: salaryText(team), ...extra };
}

function buildOffers() {
  const cur = S.team;
  const offers = [];
  const youngNotNBA = cur.league !== 'NBA' && !S.drafted;

  // Draft NBA
  if (youngNotNBA && S.age >= 19 && S.age <= 23 && S.ovr >= 71) {
    const pickN = clamp(Math.round((88 - S.ovr) * 2.2 + rand(-4, 4)), 1, 60);
    const nba = TEAMS.filter(t => t.league === 'NBA').sort((a, b) => a.s - b.s);
    const idx = clamp(Math.round((pickN - 1) / 2), 0, nba.length - 1);
    const team = nba[pickN <= 30 ? pickN - 1 : idx];
    offers.push(offerFor(team, { draft: pickN, note: `Draft ${S.year}: elección nº ${pickN} (${pickN <= 30 ? '1ª' : '2ª'} ronda)` }));
  }

  // Equipos interesados: te buscan los equipos de tu nivel. Cuanta más media, mejores equipos.
  // Los equipos muy por debajo de tu nivel no se atreven a llamarte; los muy por encima no te quieren.
  const injuredRecently = S.injuries.some(i => i.sev >= 4 && i.season === seasonLabel(S.year - 1));
  const target = S.ovr - 3 - (injuredRecently ? 3 : 0);
  const pool = TEAMS.filter(t => t !== cur && t.league !== 'NCAA')
    .filter(t => t.league !== 'NBA' || S.drafted || S.ovr >= 78)
    .map(t => ({ t, lvl: teamLevel(t), rel: S.ovr - teamLevel(t) }))
    .filter(x => x.rel >= -5 && x.rel <= 12);
  const picked = new Set(offers.map(o => o.team));
  const best = [...pool].filter(x => x.rel >= -4).sort((a, b) => b.lvl - a.lvl)[0];
  if (best && !picked.has(best.t)) { offers.push(offerFor(best.t, { note: 'Oferta más ambiciosa' })); picked.add(best.t); }
  let rest = pool.filter(x => !picked.has(x.t));
  while (offers.length < 4 && rest.length) {
    const x = weightedPick(rest, y => Math.exp(-Math.abs(y.lvl - target) / 2.5) * (0.6 + y.t.s / 100));
    offers.push(offerFor(x.t)); picked.add(x.t);
    rest = rest.filter(y => y !== x);
  }
  if (injuredRecently && offers.length) offers.forEach(o => { o.note = (o.note ? o.note + ' · ' : '') + 'Dudan de tu rodilla'; });
  // Plan B: si nadie te quiere, equipos modestos de la ACB
  if (offers.length === 0) {
    const weak = TEAMS.filter(t => t.league === 'ACB' && t !== cur).sort((a, b) => a.s - b.s).slice(0, 3);
    weak.forEach(t => offers.push(offerFor(t, { note: 'Última oportunidad' })));
  }
  return offers;
}

// ---------------------------------------------------------------- Render
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initials(name) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join(''); }

function renderStatus() {
  const t = S.team;
  const top = Object.entries(S.trophies).filter(([k]) => /Anillo|Liga Endesa|Euroliga|Copa del Rey|NCAA|Oro|MVP/.test(k));
  $('#status').innerHTML = `
    <div class="avatar-wrap">${crest(t, 58)}<span class="avatar-ini" style="background:${t.color2};color:${isLight(t.color2) ? '#111' : '#fff'}">${esc(initials(S.name))}</span></div>
    <div>
      <h2>${esc(S.name)}</h2>
      <div class="meta">${S.pos} · ${S.age} años · ${esc(S.nat)} · <b>${esc(t.name)}</b> (${t.league})</div>
      <div class="chips">
        <span class="chip">Fama ${Math.round(S.fame)}/100</span>
        <span class="chip">${S.seasons.length} temporadas</span>
        <span class="chip money">💰 ${fmtMoney(S.earnings)}</span>
        ${top.map(([k, v]) => `<span class="chip gold">${v}× ${esc(k)}</span>`).join('')}
      </div>
    </div>
    <div class="ovr"><b>${S.ovr}</b><small>Media</small></div>
    <div class="attrs">${attrsHTML(S.attrs, S.prevAttrs)}</div>`;
}

function attrsHTML(attrs, prev) {
  const bar = (label, val, pct, diff) => `
    <div class="attr">
      <span class="attr-label">${label}</span>
      <span class="attr-bar"><i style="width:${pct}%;background:${val >= 85 ? 'var(--green)' : val >= 70 ? 'var(--orange2)' : val >= 55 ? 'var(--orange)' : 'var(--red)'}"></i></span>
      <b>${val}${diff ? ` <small class="${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '+' : ''}${diff}</small>` : ''}</b>
    </div>`;
  return ATTRS.map(({ k, label, icon }) => bar(`${icon} ${label}`, attrs[k], attrs[k], prev ? attrs[k] - prev[k] : 0)).join('')
    + (prev ? `<div class="attr"><span class="attr-label">🥵 Cansancio</span><span class="attr-bar"><i style="width:${Math.max(3, S.fatigue)}%;background:${S.fatigue >= 70 ? 'var(--red)' : S.fatigue >= 45 ? 'var(--orange2)' : 'var(--green)'}"></i></span><b>${Math.round(S.fatigue)}%</b></div>` : '')
    + `<div class="attr"><span class="attr-label">📏 Altura</span><span class="attr-bar"><i style="width:${clamp((S.height - 175) / 50 * 100, 5, 100)}%;background:#7db7ff"></i></span><b>${fmtHeight(S.height)}</b></div>`;
}

function renderLog() {
  $('#log').innerHTML = S.seasons.map(s => {
    const d = s.newOvr - s.ovr;
    return `<tr class="${s.won ? 'champ' : ''}">
      <td>${s.label}</td>
      <td><span class="team-cell">${crestByName(s.team, 20)}${esc(s.team)}</span></td>
      <td>${s.age}</td>
      <td>${s.ovr} <small class="${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'}${Math.abs(d)}</small></td>
      <td>${s.gp}</td><td>${fmt1(s.ppg)}</td><td>${fmt1(s.rpg)}</td><td>${fmt1(s.apg)}</td>
      <td>${s.role}</td>
      <td>${s.result}${s.injury ? ` · <span class="${s.injurySev >= 3 ? 'down' : 'warn'}">🩼 ${esc(s.injury)}</span>` : ''}${s.awards.length ? `<div class="awards">${s.awards.map(esc).join(' · ')}</div>` : ''}</td>
    </tr>`;
  }).reverse().join('');
}

function renderAll() { renderStatus(); renderLog(); }

function panel(html) { $('#panel').innerHTML = html; }

function seasonNews(list) {
  return list.map(s => {
    const highlight = s.awards.length ? ` — ${s.awards.map(esc).join(', ')}` : '';
    return `<div class="news"><span class="team-cell">${crestByName(s.team, 22)}<span><b>${s.label}</b> · ${esc(s.team)}: ${fmt1(s.ppg)} pts, ${fmt1(s.rpg)} reb, ${fmt1(s.apg)} ast · ${s.result}${highlight}${s.injury ? ` · <span class="${s.injurySev >= 3 ? 'down' : 'warn'}">🩼 ${esc(s.injury)} (${s.gp} PJ)</span>` : ''}</span></span></div>`;
  }).join('');
}

// ---------------------------------------------------------------- Flujo
function playBlock() {
  S.prevAttrs = { ...S.attrs };
  const played = [];
  for (let i = 0; i < S.block; i++) {
    played.push(simulateSeason());
    if (S.team.league === 'NCAA' && S.ncaaYears >= 4) break;   // máximo 4 años universitarios
    if (mustRetire()) break;
  }
  renderAll();
  const next = () => (mustRetire() ? endCareer(mustRetire()) : showEvent(played));
  const queue = S.celebrations.splice(0);
  if (queue.length) celebrate(queue, next); else next();
}

function mustRetire() {
  if (S.forcedRetire) return S.forcedRetire;
  if (S.age >= 41) return 'El cuerpo dice basta a los 41 años.';
  if (S.age >= 36 && S.ovr < 68) return 'Ya no encuentras equipo a tu nivel. Toca colgar las botas.';
  if (S.age >= 30 && S.ovr < 56) return 'Las lesiones y la falta de minutos te obligan a retirarte.';
  return null;
}

function fatigueText() {
  const f = Math.round(S.fatigue);
  return f >= 70 ? `🥵 Cansancio ${f}%: estás reventado. Riesgo de lesión grave muy alto.`
    : f >= 45 ? `😓 Cansancio ${f}%: el cuerpo empieza a avisar.`
    : `🔋 Cansancio ${f}%: estás fresco.`;
}

const EVENT_COLORS = ['#3b82f6', '#a855f7'];
function choiceButtons(options) {
  return `<div class="options">${options.map((o, i) => {
    const risky = o.outcomes.length > 1;
    const color = o.color || (risky ? '#f59e0b' : EVENT_COLORS[i % 2]);
    const icon = o.icon || (risky ? '🎲' : i === 0 ? '👍' : '✋');
    const badge = o.badge || (risky ? 'Arriesgado' : '');
    return `<button class="opt" data-ev="${i}" style="--tc:${color}">
      <span class="opt-icon">${icon}</span>
      <span class="opt-body">
        <span class="opt-head"><b>${o.label}</b>${badge ? `<span class="pill">${badge}</span>` : ''}</span>
        ${outcomesHTML(o.outcomes)}
      </span>
    </button>`;
  }).join('')}</div>`;
}

function resultHTML(res) {
  return `<div class="news">${esc(res.msg)}<div class="fxs">${fxHTML(res.fx)}</div></div>`;
}

function showEvent(played) {
  const opts = summerOptions();
  panel(`
    <h3>Resumen de ${played.length > 1 ? 'las últimas temporadas' : 'la temporada'}</h3>
    ${seasonNews(played)}
    <h3 style="margin-top:16px">☀️ ¿Qué haces este verano?</h3>
    <p class="fatigue-msg ${S.fatigue >= 70 ? 'down' : S.fatigue >= 45 ? 'warn' : 'up'}">${fatigueText()}</p>
    ${FX_LEGEND}
    ${choiceButtons(opts)}`);
  document.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => {
    const res = runOption(opts[+b.dataset.ev]);
    renderStatus();
    if (chance(0.6)) showRandomEvent(res); else showOffers(res);
  });
}

function showRandomEvent(prev) {
  const ev = pick(EVENTS)();
  panel(`
    ${resultHTML(prev)}
    <h3 style="margin-top:16px">${ev.title}</h3>
    <p>${ev.text}</p>
    ${choiceButtons(ev.options)}`);
  document.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => {
    const res = runOption(ev.options[+b.dataset.ev]);
    renderStatus();
    showOffers(res);
  });
}

function showOffers(msg) {
  const cur = S.team;
  const forcedOut = cur.league === 'NCAA' && S.ncaaYears >= 4;
  const offers = buildOffers();
  const stayRel = S.ovr - teamLevel(cur);
  const canStay = !forcedOut && (stayRel >= -7 || cur.league === 'NCAA');

  const opt = (o, i) => teamCard(o.team, { attr: `data-offer="${i}"`, badges: offerBadges(o) });

  panel(`
    ${msg ? resultHTML(msg) : ''}
    <h3 style="margin-top:14px">📝 Mercado de fichajes · verano ${S.year}</h3>
    <p>${forcedOut ? '🎓 Se acabaron tus 4 años universitarios.' : `${S.age} años · media <b>${S.ovr}</b>`}</p>
    <div class="options">
      ${canStay ? teamCard(cur, { attr: 'data-stay="1"', badges: ['🔁 Renovar'] }) : ''}
      ${offers.map(opt).join('')}
      ${S.age >= 31 ? `<button class="opt" data-retire="1" style="--tc:#ef4444"><span class="opt-icon">👋</span><span class="opt-body"><span class="opt-head"><b>Retirarte</b><span class="pill">Fin de carrera</span></span></span></button>` : ''}
    </div>`);

  document.querySelectorAll('[data-offer]').forEach(b => b.onclick = () => {
    const o = offers[+b.dataset.offer];
    if (o.draft) { S.drafted = true; S.draftInfo = { pick: o.draft, team: o.team.name, year: S.year }; }
    if (o.team.league === 'NBA') S.drafted = true;
    S.team = o.team;
    if (S.teamsPath[S.teamsPath.length - 1] !== o.team.name) S.teamsPath.push(o.team.name);
    renderStatus();
    if (o.draft) celebrate([{ key: 'Draft', team: o.team, pick: o.draft, summer: S.year }], playBlock);
    else playBlock();
  });
  const stay = document.querySelector('[data-stay]');
  if (stay) stay.onclick = playBlock;
  const ret = document.querySelector('[data-retire]');
  if (ret) ret.onclick = () => endCareer('Decides retirarte por la puerta grande.');
}

// ---------------------------------------------------------------- Final
const TROPHY_ORDER = ['Anillo NBA', 'MVP NBA', 'MVP de las Finales', 'Euroliga', 'MVP Euroliga', 'MVP Final Four', 'Liga Endesa', 'MVP Liga Endesa', 'Copa del Rey',
  'Oro olímpico', 'Plata olímpico', 'Bronce olímpico', 'Oro Mundial', 'Plata Mundial', 'Bronce Mundial', 'Oro EuroBasket', 'Plata EuroBasket', 'Bronce EuroBasket',
  'All-NBA', 'All-Star', 'Rookie del Año', 'Campeonato NCAA', 'Most Outstanding Player', 'All-American', 'Mejor Joven ACB'];
const TROPHY_POINTS = { 'Anillo NBA': 30, 'MVP NBA': 40, 'MVP de las Finales': 25, 'Euroliga': 22, 'MVP Euroliga': 18, 'MVP Final Four': 10, 'Liga Endesa': 12, 'MVP Liga Endesa': 10,
  'Copa del Rey': 6, 'Oro olímpico': 30, 'Plata olímpico': 15, 'Bronce olímpico': 10, 'Oro Mundial': 25, 'Plata Mundial': 12, 'Bronce Mundial': 8, 'Oro EuroBasket': 15,
  'Plata EuroBasket': 8, 'Bronce EuroBasket': 5, 'All-NBA': 8, 'All-Star': 6, 'Rookie del Año': 8, 'Campeonato NCAA': 8, 'Most Outstanding Player': 5, 'All-American': 3, 'Mejor Joven ACB': 2 };

function legacy() {
  let pts = Object.entries(S.trophies).reduce((a, [k, v]) => a + (TROPHY_POINTS[k] || 2) * v, 0);
  pts += S.totals.pts / 400 + S.fame / 4;
  const serious = S.injuries.filter(i => i.sev >= 4).length;
  let label = pts >= 400 ? 'GOAT' : pts >= 250 ? 'Leyenda' : pts >= 150 ? 'Hall of Fame' : pts >= 80 ? 'Gran carrera' : pts >= 40 ? 'Jugador sólido' : S.peak >= 66 ? 'Currante de la pista' : 'Promesa frustrada';
  if (serious >= 2 && pts < 150) label = 'Carrera rota por las lesiones';
  else if (S.forcedRetire && pts < 80) label = 'Retirado por lesión';
  return { pts: Math.round(pts), label };
}

function endCareer(reason) {
  S.over = true;
  const g = Math.max(1, S.totals.g);
  const lg = legacy();
  const first = S.seasons[0]?.label.slice(0, 4) || START_YEAR;
  const last = S.seasons[S.seasons.length - 1]?.label.slice(0, 4) || START_YEAR;
  const trophies = Object.entries(S.trophies).sort((a, b) => {
    const ia = TROPHY_ORDER.indexOf(a[0]), ib = TROPHY_ORDER.indexOf(b[0]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  const peak = S.peak || S.ovr;

  $('#final-card').innerHTML = `
    <span class="legacy">${lg.label} · ${lg.pts} pts de legado</span>
    <h2>${esc(S.name)}</h2>
    <div class="meta">${S.pos} · ${esc(S.nat)} · ${first}–${+last + 1} · Retirado a los ${S.age} años · Media máxima ${peak}</div>
    ${S.draftInfo ? `<div class="meta">Draft ${S.draftInfo.year}: nº ${S.draftInfo.pick} por ${esc(S.draftInfo.team)}</div>` : ''}
    <div class="totals">
      <div><b>${S.totals.g}</b><small>Partidos</small></div>
      <div><b>${fmt1(S.totals.pts / g)}</b><small>Puntos/p</small></div>
      <div><b>${fmt1(S.totals.reb / g)}</b><small>Rebotes/p</small></div>
      <div><b>${fmt1(S.totals.ast / g)}</b><small>Asist./p</small></div>
      <div><b>${peak}</b><small>Media máx.</small></div>
      <div><b>${(S.trophies['Anillo NBA'] || 0)}</b><small>Anillos</small></div>
      <div class="wide"><b>💰 ${fmtMoney(S.earnings)}</b><small>Dinero ganado</small></div>
    </div>
    <h3>📊 Tu mejor versión (media ${peak})</h3>
    <div class="attrs final-attrs">${attrsHTML(S.peakAttrs || S.attrs)}</div>
    <h3>🏆 Palmarés</h3>
    ${trophies.length ? `<ul class="trophies">${trophies.map(([k, v]) => `<li><b>${v}×</b>${esc(k)}</li>`).join('')}</ul>` : '<p class="muted">Sin títulos, pero con mucho corazón.</p>'}
    <h3>🧳 Trayectoria</h3>
    <div class="teams-path">${S.teamsPath.map(n => `<span class="path-team">${crestByName(n, 26)}${esc(n)}</span>`).join('<span class="arrow">→</span>')}</div>
    <p class="muted" style="margin-top:14px">${esc(reason)}</p>
    <p class="muted" style="font-size:.75rem">basquet.fun</p>`;

  saveCareer(lg, trophies, peak);
  show('end');
}

function shareText() {
  const g = Math.max(1, S.totals.g), lg = legacy();
  const lines = [
    `🏀 ${S.name} (${S.pos}) — ${lg.label}`,
    `Media máxima ${S.peak} · 💰 ${fmtMoney(S.earnings)} ganados`,
    `${S.seasons.length} temporadas · ${S.totals.g} partidos · ${fmt1(S.totals.pts / g)} pts · ${fmt1(S.totals.reb / g)} reb · ${fmt1(S.totals.ast / g)} ast`,
    ...Object.entries(S.trophies).map(([k, v]) => `🏆 ${v}× ${k}`),
    `🧳 ${S.teamsPath.join(' → ')}`,
    'Juega tu carrera en basquet.fun',
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------- Récords
const REC_KEY = 'basquetfun_careers';
const TEAM_TITLES = ['Anillo NBA', 'Euroliga', 'Liga Endesa', 'Copa del Rey', 'Campeonato NCAA'];
const METRICS = {
  legacy: { label: '👑 Legado', short: 'Mejor legado', get: c => c.legacy, show: c => `${c.legacy} pts` },
  peak: { label: '📈 Media', short: 'Mayor media', get: c => c.peak, show: c => `${c.peak} de media` },
  rings: { label: '💍 Anillos', short: 'Más anillos NBA', get: c => c.rings, show: c => `${c.rings} anillo${c.rings === 1 ? '' : 's'}` },
  money: { label: '💰 Dinero', short: 'Más dinero ganado', get: c => c.money, show: c => fmtMoney(c.money) },
  titles: { label: '🏆 Títulos', short: 'Más títulos de equipo', get: c => c.titles, show: c => `${c.titles} título${c.titles === 1 ? '' : 's'}` },
  points: { label: '🏀 Puntos', short: 'Más puntos totales', get: c => c.points, show: c => `${c.points.toLocaleString('es-ES')} pts` },
};
let recMetric = 'legacy';

function loadCareers() { try { return JSON.parse(localStorage.getItem(REC_KEY)) || []; } catch { return []; } }
function saveCareer(lg, trophies, peak) {
  const bySeasons = {};
  S.seasons.forEach(x => { bySeasons[x.team] = (bySeasons[x.team] || 0) + 1; });
  const mainTeam = Object.entries(bySeasons).sort((a, b) => b[1] - a[1])[0]?.[0] || S.team.name;
  const list = loadCareers();
  list.push({
    name: S.name, pos: S.pos, nat: S.nat, label: lg.label, legacy: lg.pts, peak,
    rings: S.trophies['Anillo NBA'] || 0,
    money: Math.round(S.earnings * 100) / 100,
    titles: TEAM_TITLES.reduce((a, k) => a + (S.trophies[k] || 0), 0),
    points: Math.round(S.totals.pts),
    seasons: S.seasons.length, mainTeam,
    top: trophies.slice(0, 3).map(([k, v]) => `${v}× ${k}`).join(', '),
    date: Date.now(),
  });
  try { localStorage.setItem(REC_KEY, JSON.stringify(list.slice(-200))); } catch { /* sin almacenamiento */ }
}

function renderRecords() {
  const list = loadCareers();
  const best = key => list.reduce((b, c) => (!b || METRICS[key].get(c) > METRICS[key].get(b) ? c : b), null);
  $('#rec-count').textContent = list.length ? `${list.length} carrera${list.length === 1 ? '' : 's'} jugada${list.length === 1 ? '' : 's'} en este dispositivo.` : '';

  $('#rec-cards').innerHTML = list.length ? Object.entries(METRICS).map(([k, m]) => {
    const c = best(k);
    return `<div class="rec-card">
      <small>${m.short}</small>
      <b>${esc(m.show(c))}</b>
      <span class="team-cell">${crestByName(c.mainTeam, 22)}${esc(c.name)}</span>
    </div>`;
  }).join('') : '<p class="muted">Todavía no hay récords. ¡Termina tu primera carrera!</p>';

  $('#rec-tabs').innerHTML = Object.entries(METRICS).map(([k, m]) =>
    `<button class="tab ${k === recMetric ? 'active' : ''}" data-metric="${k}">${m.label}</button>`).join('');
  document.querySelectorAll('[data-metric]').forEach(b => b.onclick = () => { recMetric = b.dataset.metric; renderRecords(); });

  const m = METRICS[recMetric];
  const ranked = [...list].sort((a, b) => m.get(b) - m.get(a)).slice(0, 10);
  $('#rec-table').innerHTML = ranked.length ? ranked.map((c, i) => `
    <tr>
      <td class="pos">${['🥇', '🥈', '🥉'][i] || i + 1}</td>
      <td><span class="team-cell">${crestByName(c.mainTeam, 26)}<span><b>${esc(c.name)}</b><small>${esc(c.pos)} · ${esc(c.label)} · ${c.seasons} temp.${c.top ? ' · ' + esc(c.top) : ''}</small></span></span></td>
      <td class="val">${esc(m.show(c))}</td>
    </tr>`).join('') : '';
}

// ---------------------------------------------------------------- Celebraciones
let svgId = 0;
function artTrophy(accent, topper = '') {
  const id = 'g' + (++svgId);
  return `<svg viewBox="0 0 120 140" class="art">
    <defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#b8860b"/><stop offset=".45" stop-color="#ffe680"/><stop offset="1" stop-color="#c9971c"/></linearGradient></defs>
    <path d="M30 28 H14 C12 52 24 62 36 64" fill="none" stroke="url(#${id})" stroke-width="7" stroke-linecap="round"/>
    <path d="M90 28 H106 C108 52 96 62 84 64" fill="none" stroke="url(#${id})" stroke-width="7" stroke-linecap="round"/>
    <path d="M28 14 H92 V46 C92 72 76 86 60 89 C44 86 28 72 28 46 Z" fill="url(#${id})"/>
    <circle cx="60" cy="46" r="15" fill="${accent}" opacity=".9"/>
    <path d="M45 46 H75 M60 31 V61 M49 35 C56 42 56 50 49 57 M71 35 C64 42 64 50 71 57" stroke="#1a1000" stroke-width="2" fill="none" opacity=".6"/>
    <rect x="53" y="88" width="14" height="18" fill="url(#${id})"/>
    <rect x="38" y="104" width="44" height="10" rx="3" fill="url(#${id})"/>
    <rect x="30" y="113" width="60" height="20" rx="4" fill="#2a2a2a"/>
    <rect x="30" y="120" width="60" height="5" fill="${accent}"/>
    ${topper === 'crown' ? `<path d="M40 14 L44 0 L52 9 L60 -2 L68 9 L76 0 L80 14 Z" fill="url(#${id})" stroke="#8a6500" stroke-width="1.5" transform="translate(0 2)"/><circle cx="60" cy="4" r="2.5" fill="#c60b1e"/>` : ''}
    ${topper === 'star' ? `<polygon points="60,0 63.5,8 72,8.5 65.5,13.5 68,22 60,17 52,22 54.5,13.5 48,8.5 56.5,8" fill="#fff" stroke="${accent}" stroke-width="1.5"/>` : ''}
  </svg>`;
}
function artRing(team) {
  const id = 'g' + (++svgId);
  const t = team || { color: '#552583', abbr: 'NBA' };
  return `<svg viewBox="0 0 120 140" class="art">
    <defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset=".5" stop-color="#d4a017"/><stop offset="1" stop-color="#fff2b0"/></linearGradient></defs>
    <ellipse cx="60" cy="92" rx="38" ry="36" fill="none" stroke="url(#${id})" stroke-width="13"/>
    <rect x="28" y="16" width="64" height="58" rx="14" fill="url(#${id})"/>
    <rect x="36" y="24" width="48" height="42" rx="9" fill="${t.color}"/>
    <text x="60" y="52" text-anchor="middle" font-size="${t.abbr.length > 3 ? 13 : 17}" font-weight="900" fill="#fff" font-family="system-ui">${esc(t.abbr)}</text>
    ${[34, 46, 60, 74, 86].map(x => `<circle cx="${x}" cy="20" r="3.2" fill="#fff"/>`).join('')}
    ${[30, 90].map(x => `<circle cx="${x}" cy="45" r="3" fill="#fff"/>`).join('')}
  </svg>`;
}
function artStar(text) {
  const id = 'g' + (++svgId);
  return `<svg viewBox="0 0 120 140" class="art">
    <defs><radialGradient id="${id}"><stop offset="0" stop-color="#fff6c2"/><stop offset="1" stop-color="#e0a800"/></radialGradient></defs>
    <polygon points="60,8 75,48 118,50 84,76 96,118 60,94 24,118 36,76 2,50 45,48" fill="url(#${id})" stroke="#8a6500" stroke-width="2"/>
    <text x="60" y="76" text-anchor="middle" font-size="${text.length > 3 ? 15 : 21}" font-weight="900" fill="#3a2700" font-family="system-ui">${esc(text)}</text>
    <rect x="30" y="122" width="60" height="12" rx="6" fill="#2a2a2a"/>
  </svg>`;
}
function artMedal(metal) {
  const col = { Oro: ['#fff2a8', '#d4a017'], Plata: ['#ffffff', '#9aa3b0'], Bronce: ['#f3c08a', '#a0612b'] }[metal];
  const id = 'g' + (++svgId);
  return `<svg viewBox="0 0 120 140" class="art">
    <defs><radialGradient id="${id}" cx=".35" cy=".35"><stop offset="0" stop-color="${col[0]}"/><stop offset="1" stop-color="${col[1]}"/></radialGradient></defs>
    <polygon points="30,0 52,0 66,58 46,58" fill="#c60b1e"/><polygon points="68,0 90,0 74,58 54,58" fill="#c60b1e"/>
    <polygon points="36,0 46,0 58,50 50,50" fill="#ffc400"/><polygon points="74,0 84,0 70,50 62,50" fill="#ffc400"/>
    <circle cx="60" cy="94" r="38" fill="url(#${id})" stroke="${col[1]}" stroke-width="4"/>
    <circle cx="60" cy="94" r="28" fill="none" stroke="${col[0]}" stroke-width="2" opacity=".7"/>
    <text x="60" y="104" text-anchor="middle" font-size="28" fill="${col[1]}" font-family="system-ui">🏀</text>
  </svg>`;
}
function artJersey(team, number) {
  const fg = isLight(team.color) ? '#111' : '#fff';
  return `<svg viewBox="0 0 120 140" class="art">
    <path d="M38 8 C44 18 76 18 82 8 L104 18 C100 34 100 44 102 56 L92 60 V132 H28 V60 L18 56 C20 44 20 34 16 18 Z" fill="${team.color}" stroke="${team.color2}" stroke-width="4"/>
    <path d="M42 10 C48 24 72 24 78 10" fill="none" stroke="${team.color2}" stroke-width="5"/>
    <text x="60" y="56" text-anchor="middle" font-size="12" font-weight="800" fill="${fg}" font-family="system-ui">${esc(team.abbr)}</text>
    <text x="60" y="104" text-anchor="middle" font-size="44" font-weight="900" fill="${fg}" stroke="${team.color2}" stroke-width="1.5" font-family="system-ui">${number}</text>
  </svg>`;
}

function artInjury() {
  return `<svg viewBox="0 0 120 140" class="art">
    <circle cx="60" cy="62" r="48" fill="#c62828" stroke="#ff8a80" stroke-width="4"/>
    <rect x="49" y="30" width="22" height="64" rx="4" fill="#fff"/><rect x="28" y="51" width="64" height="22" rx="4" fill="#fff"/>
    <g transform="rotate(-35 60 110)"><rect x="14" y="100" width="92" height="22" rx="11" fill="#f2d3a8" stroke="#c9a77a" stroke-width="2"/>
    ${[30, 42, 54, 66, 78, 90].map(x => `<circle cx="${x}" cy="111" r="1.8" fill="#c9a77a"/>`).join('')}<rect x="50" y="100" width="20" height="22" fill="#e9c28f"/></g>
  </svg>`;
}

function celebrationInfo(c) {
  const k = c.key, t = c.team;
  if (k === 'Lesión') {
    const inj = c.injury;
    return { art: artInjury(), kicker: `Temporada ${c.season} · ${c.missed} de ${c.games} partidos de baja`,
      title: c.ending ? '¡FIN DE CARRERA!' : inj.sev >= 4 ? '¡LESIÓN GRAVE!' : '¡LESIÓN!',
      sub: `${inj.name}. ${Object.entries(inj.attrs).map(([a, v]) => `${ATTRS.find(x => x.k === a).icon} ${v}`).join(' ')}` };
  }
  if (k === 'Draft') return { art: artJersey(t, c.pick), kicker: `Draft NBA ${c.summer}`, title: c.pick === 1 ? '¡NÚMERO 1 DEL DRAFT!' : '¡ELEGIDO EN EL DRAFT!', sub: `${t.name} te elige con el pick nº ${c.pick}` };
  if (k === 'Anillo NBA') return { art: artRing(t), kicker: `Temporada ${c.season}`, title: '¡CAMPEÓN DE LA NBA!', sub: `Ganas el anillo con ${t.name}` };
  const cups = { 'Euroliga': ['¡CAMPEÓN DE EUROPA!', '#ff6b00', 'star'], 'Liga Endesa': ['¡CAMPEÓN DE LIGA!', '#f08a00', ''], 'Copa del Rey': ['¡CAMPEÓN DE COPA!', '#c60b1e', 'crown'], 'Campeonato NCAA': ['¡CAMPEÓN NCAA!', '#1d428a', ''] };
  if (cups[k]) return { art: artTrophy(cups[k][1], cups[k][2]), kicker: `${k} · ${c.season}`, title: cups[k][0], sub: `Con ${t.name}` };
  const metal = (k.match(/^(Oro|Plata|Bronce)/) || [])[1];
  if (metal) return { art: artMedal(metal), kicker: `🇪🇸 Selección española · ${c.summer}`, title: `¡${k.toUpperCase()}!`, sub: metal === 'Oro' ? '¡Campeones con España!' : 'Medalla con España' };
  const starText = /Rookie/.test(k) ? 'ROY' : /Most Outstanding/.test(k) ? 'MOP' : 'MVP';
  return { art: artStar(starText), kicker: `Premio individual · ${c.season}`, title: `¡${k.toUpperCase()}!`, sub: t ? `Jugando en ${t.name}` : '' };
}

function celebrate(queue, done) {
  let i = 0;
  const ov = document.createElement('div');
  ov.className = 'celebration';
  document.body.appendChild(ov);
  const close = () => { ov.remove(); done(); };
  const render = () => {
    const c = queue[i], info = celebrationInfo(c);
    ov.classList.toggle('bad', !!c.bad);
    const colors = c.team ? [c.team.color, c.team.color2, '#ffd34d', '#ffffff'] : ['#c60b1e', '#ffc400', '#ffffff', '#ffd34d'];
    const confetti = c.bad ? '' : Array.from({ length: 46 }, () => `<i style="left:${rand(0, 100)}%;background:${pick(colors)};animation-delay:${rand(0, .9).toFixed(2)}s;animation-duration:${rand(1.8, 3.2).toFixed(2)}s;transform:rotate(${randi(0, 360)}deg);width:${randi(6, 11)}px;height:${randi(10, 16)}px"></i>`).join('');
    ov.innerHTML = `
      ${confetti ? `<div class="confetti">${confetti}</div>` : ''}
      <div class="cel-card">
        <div class="cel-rays"></div>
        <div class="cel-art">${info.art}</div>
        ${c.team ? `<div class="cel-crest">${crest(c.team, 34)}</div>` : ''}
        <small class="cel-kicker">${esc(info.kicker)}</small>
        <h2 class="cel-title">${esc(info.title)}</h2>
        <p class="cel-sub">${esc(info.sub)}</p>
        <div class="actions center">
          <button class="btn primary" data-cel="next">${i < queue.length - 1 ? `Siguiente (${i + 1}/${queue.length}) ▶` : c.bad ? (c.ending ? 'Ver mi carrera' : 'A recuperarse 💪') : '¡Vamos! ▶'}</button>
          ${queue.length - i > 1 ? '<button class="btn" data-cel="skip">Saltar todas</button>' : ''}
        </div>
      </div>`;
    ov.querySelector('[data-cel=next]').onclick = () => { i++; if (i < queue.length) render(); else close(); };
    const sk = ov.querySelector('[data-cel=skip]');
    if (sk) sk.onclick = close;
  };
  render();
}

function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 1800);
}

// ---------------------------------------------------------------- Arranque
function scoutText() {
  return S.pot >= 92 ? 'un talento generacional' : S.pot >= 85 ? 'madera de estrella' : S.pot >= 78 ? 'buen futuro' : S.pot >= 70 ? 'nivel para ser un jugador de rotación' : 'mucho trabajo por delante… y no todos llegan';
}

function showStartOffers() {
  const offers = startOffers();
  const flag = $('#f-nat').selectedOptions[0].textContent.split(' ')[0];
  panel(`
    <h3>${flag} Tus primeras ofertas</h3>
    <p>18 años · media <b>${S.ovr}</b> · 🔭 Los ojeadores ven ${scoutText()}.</p>
    <p class="legend">🏠 Cantera: puedes ir al Draft desde los 19 · 🎓 Beca NCAA: 4 años máximo y luego al Draft</p>
    <div class="options">
      ${offers.map((t, i) => teamCard(t, { attr: `data-start="${i}"`, badges: [t.league === 'NCAA' ? '🎓 Beca' : '🏠 Cantera'] })).join('')}
    </div>`);
  document.querySelectorAll('[data-start]').forEach(b => b.onclick = () => {
    const t = offers[+b.dataset.start];
    S.team = t; S.teamsPath = [t.name];
    renderAll();
    panel(`
      <div class="welcome">${crest(t, 72)}<h3>¡Bienvenido a ${esc(t.name)}!</h3></div>
      <p>Empiezas tu carrera en ${t.league === 'NCAA' ? 'la NCAA' : 'la cantera y el primer equipo'} de ${esc(t.name)}. ¡A por todas!</p>
      <div class="actions"><button class="btn primary big" id="btn-go">Jugar ${S.block > 1 ? `las primeras ${S.block} temporadas` : 'la primera temporada'} ▶</button></div>`);
    $('#btn-go').onclick = playBlock;
  });
}

function init() {
  const syncHeight = () => {
    const [mn, mx] = HEIGHT[$('#f-pos').value], r = $('#f-height');
    r.min = mn; r.max = mx; r.value = Math.round((mn + mx) / 2); $('#f-height-out').textContent = fmtHeight(+r.value);
  };
  $('#f-pos').addEventListener('change', syncHeight);
  $('#f-height').addEventListener('input', () => { $('#f-height-out').textContent = fmtHeight(+$('#f-height').value); });
  syncHeight();

  $('#form-start').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name').value.trim() || 'Jugador Anónimo';
    newCareer({
      height: +$('#f-height').value,
      name, pos: $('#f-pos').value, nat: $('#f-nat').value, start: null,
      block: +document.querySelector('input[name=mode]:checked').value,
    });
    renderAll();
    showStartOffers();
    show('game');
  });

  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
    const to = b.dataset.goto;
    if (to === 'records') renderRecords();
    show(to);
  }));
  $('#btn-copy').onclick = async () => {
    try { await navigator.clipboard.writeText(shareText()); toast('¡Resumen copiado!'); }
    catch {
      let ta = $('#share-fallback');
      if (!ta) {
        ta = document.createElement('textarea');
        ta.id = 'share-fallback'; ta.readOnly = true; ta.rows = 8;
        ta.style.cssText = 'display:block;width:100%;max-width:560px;margin:14px auto 0;background:var(--bg2);color:var(--text);border:1px solid var(--line);border-radius:10px;padding:10px;font:inherit;font-size:.85rem';
        $('#btn-copy').parentElement.after(ta);
      }
      ta.value = shareText(); ta.focus(); ta.select();
      toast('Selecciona y copia el texto');
    }
  };
  $('#btn-clear-rec').onclick = () => {
    const b = $('#btn-clear-rec');
    if (b.dataset.confirm) { try { localStorage.removeItem(REC_KEY); } catch { /* nada */ } delete b.dataset.confirm; b.textContent = 'Borrar récords'; renderRecords(); }
    else { b.dataset.confirm = '1'; b.textContent = '¿Seguro? Pulsa otra vez'; }
  };
}

init();
