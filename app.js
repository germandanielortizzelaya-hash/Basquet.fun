/* Basquet.fun · Del Barrio al Anillo
 * Simulador de carrera de baloncesto (ACB, Euroliga, NCAA, NBA y Selección).
 * Todo es ficción: las fuerzas de los equipos y los resultados son aproximados y aleatorios.
 */
'use strict';

// ---------------------------------------------------------------- Datos
// s = fuerza del equipo (0-100) dentro de su liga, c = color principal
const TEAMS = [
  // NBA
  ['Oklahoma City Thunder', 'NBA', 95, '#007ac1'], ['Denver Nuggets', 'NBA', 87, '#0e2240'],
  ['Cleveland Cavaliers', 'NBA', 88, '#860038'], ['New York Knicks', 'NBA', 86, '#f58426'],
  ['Houston Rockets', 'NBA', 86, '#ce1141'], ['Los Angeles Lakers', 'NBA', 84, '#552583'],
  ['Minnesota Timberwolves', 'NBA', 84, '#236192'], ['Orlando Magic', 'NBA', 83, '#0077c0'],
  ['San Antonio Spurs', 'NBA', 82, '#8a8d8f'], ['Boston Celtics', 'NBA', 82, '#007a33'],
  ['Golden State Warriors', 'NBA', 80, '#1d428a'], ['Detroit Pistons', 'NBA', 80, '#c8102e'],
  ['LA Clippers', 'NBA', 80, '#c8102e'], ['Atlanta Hawks', 'NBA', 79, '#e03a3e'],
  ['Dallas Mavericks', 'NBA', 77, '#00538c'], ['Memphis Grizzlies', 'NBA', 76, '#5d76a9'],
  ['Milwaukee Bucks', 'NBA', 76, '#00471b'], ['Miami Heat', 'NBA', 75, '#98002e'],
  ['Philadelphia 76ers', 'NBA', 74, '#006bb6'], ['Indiana Pacers', 'NBA', 72, '#fdbb30'],
  ['Phoenix Suns', 'NBA', 72, '#e56020'], ['Toronto Raptors', 'NBA', 72, '#ce1141'],
  ['Sacramento Kings', 'NBA', 70, '#5a2d81'], ['Chicago Bulls', 'NBA', 70, '#ce1141'],
  ['Portland Trail Blazers', 'NBA', 70, '#e03a3e'], ['Charlotte Hornets', 'NBA', 64, '#00788c'],
  ['New Orleans Pelicans', 'NBA', 64, '#85714d'], ['Utah Jazz', 'NBA', 60, '#002b5c'],
  ['Brooklyn Nets', 'NBA', 58, '#444444'], ['Washington Wizards', 'NBA', 55, '#002b5c'],
  // Liga Endesa (ACB)
  ['Real Madrid', 'ACB', 90, '#d4af37'], ['FC Barcelona', 'ACB', 85, '#a50044'],
  ['Valencia Basket', 'ACB', 84, '#f08a00'], ['Unicaja Málaga', 'ACB', 84, '#007a3d'],
  ['Baskonia', 'ACB', 80, '#0c2d6b'], ['La Laguna Tenerife', 'ACB', 77, '#ffd200'],
  ['Dreamland Gran Canaria', 'ACB', 76, '#ffcc00'], ['UCAM Murcia', 'ACB', 74, '#c8102e'],
  ['Joventut Badalona', 'ACB', 72, '#007a3d'], ['BAXI Manresa', 'ACB', 68, '#e30613'],
  ['Casademont Zaragoza', 'ACB', 66, '#d0021b'], ['Surne Bilbao Basket', 'ACB', 66, '#1d1d1b'],
  ['Río Breogán', 'ACB', 66, '#62b5e5'], ['MoraBanc Andorra', 'ACB', 64, '#003da5'],
  ['Bàsquet Girona', 'ACB', 62, '#b3001b'], ['San Pablo Burgos', 'ACB', 62, '#c8102e'],
  ['Covirán Granada', 'ACB', 60, '#e2001a'], ['Hiopos Lleida', 'ACB', 60, '#0055a4'],
  // NCAA (EE. UU.)
  ['Duke Blue Devils', 'NCAA', 88, '#003087'], ['Kentucky Wildcats', 'NCAA', 84, '#0033a0'],
  ['Kansas Jayhawks', 'NCAA', 84, '#0051ba'], ['UConn Huskies', 'NCAA', 86, '#0e1a3e'],
  ['North Carolina Tar Heels', 'NCAA', 80, '#7bafd4'], ['Gonzaga Bulldogs', 'NCAA', 82, '#041e42'],
  ['Michigan State Spartans', 'NCAA', 78, '#18453b'], ['Arizona Wildcats', 'NCAA', 79, '#cc0033'],
  ['Houston Cougars', 'NCAA', 83, '#c8102e'], ['Villanova Wildcats', 'NCAA', 74, '#00205b'],
].map(([name, league, s, color]) => ({ name, league, base: s, s, color }));

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

function roleFor(rel) {
  if (rel >= 8) return 'Estrella';
  if (rel >= 2) return 'Titular';
  if (rel >= -4) return 'Rotación';
  return 'Banquillo';
}

// ---------------------------------------------------------------- Estado
let S = null;

function newCareer({ name, pos, nat, start, block }) {
  TEAMS.forEach(t => { t.s = t.base; });
  S = {
    name, pos, nat, block,
    age: 18,
    ovr: randi(58, 65),
    pot: randi(76, 97),       // potencial oculto
    fame: 10,
    injuryGuard: 0,           // temporadas con menor riesgo de lesión
    growthBonus: 0,           // bonificación de progresión para la próxima temporada
    team: teamByName(start),
    year: START_YEAR,
    drafted: false,
    draftInfo: null,
    ncaaYears: 0,
    nbaSeasons: 0,
    seasons: [],
    trophies: {},
    teamsPath: [],
    totals: { g: 0, pts: 0, reb: 0, ast: 0 },
    over: false,
  };
  S.teamsPath.push(S.team.name);
}

function addTrophy(name, n = 1) { S.trophies[name] = (S.trophies[name] || 0) + n; }

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

  // Lesiones
  let gp = L.games, injury = null;
  const injRisk = (S.age > 30 ? 0.16 : 0.1) * (S.injuryGuard > 0 ? 0.5 : 1);
  if (chance(injRisk)) {
    const missed = Math.round(L.games * rand(0.1, 0.7));
    gp = L.games - missed;
    injury = missed > L.games * 0.45 ? 'Lesión grave' : 'Lesión';
    if (missed > L.games * 0.45) S.ovr -= randi(1, 3);
  } else {
    gp = L.games - randi(0, Math.round(L.games * 0.08));
  }
  if (S.injuryGuard > 0) S.injuryGuard--;

  // Estadísticas
  const q = Math.max(2, S.ovr - 45), f = minutes / 36;
  const ppg = q * 0.55 * prof.pts * L.scoring * f * rand(0.88, 1.12);
  const rpg = q * 0.22 * prof.reb * f * rand(0.85, 1.15);
  const apg = q * 0.15 * prof.ast * f * rand(0.85, 1.15);

  // Resultado del equipo
  const contribution = rel * f * 0.6;
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
        if (rel >= 6 && chance(0.6)) { addTrophy('MVP Final Four'); awards.push('⭐ MVP Final Four'); }
      } else if (chance(p * 1.6)) awards.push('Final Four');
      if (S.ovr >= 85 && rel >= 7 && chance(0.25)) { addTrophy('MVP Euroliga'); awards.push('⭐ MVP Euroliga'); }
    }
    if (rel >= 7 && ppg >= 13 && chance(clamp(0.15 + (rel - 7) * 0.06, 0, 0.6))) { addTrophy('MVP Liga Endesa'); awards.push('⭐ MVP ACB'); }
    if (S.age <= 22 && rel >= 0 && chance(0.35)) { addTrophy('Mejor Joven ACB'); awards.push('Mejor Joven ACB'); }
  }

  if (t.league === 'NBA') {
    S.nbaSeasons++;
    if (S.nbaSeasons === 1 && ppg >= 12 && chance(clamp((ppg - 10) / 12, 0, 0.9))) { addTrophy('Rookie del Año'); awards.push('⭐ Rookie del Año'); }
    if (ppg >= 21 || (S.ovr >= 87 && chance(0.7))) { addTrophy('All-Star'); awards.push('All-Star'); }
    if (S.ovr >= 91 && gp > 60) { addTrophy('All-NBA'); awards.push('All-NBA'); }
    if (S.ovr >= 93 && rank <= 5 && gp > 65 && chance((S.ovr - 92) * 0.16)) { addTrophy('MVP NBA'); awards.push('⭐ MVP NBA'); }
    if (won && rel >= 6 && chance(0.7)) { addTrophy('MVP de las Finales'); awards.push('⭐ MVP Finales'); }
  }

  if (t.league === 'NCAA') {
    S.ncaaYears++;
    if (ppg >= 18) { addTrophy('All-American'); awards.push('All-American'); }
    if (won && rel >= 4) { addTrophy('Most Outstanding Player'); awards.push('⭐ MOP Final Four'); }
  }

  // Selección española (verano tras la temporada)
  const summer = S.year + 1;
  const tourney = { 3: 'Mundial', 0: 'Juegos Olímpicos', 1: 'EuroBasket' }[summer % 4];
  if (S.nat === 'España' && tourney && S.ovr >= 79 && !(injury === 'Lesión grave')) {
    const pGold = clamp(0.12 + (S.ovr - 80) * 0.015, 0.08, 0.42);
    const r = Math.random();
    let medal = null;
    if (r < pGold) medal = 'Oro';
    else if (r < pGold + 0.16) medal = 'Plata';
    else if (r < pGold + 0.32) medal = 'Bronce';
    const icon = { Oro: '🥇', Plata: '🥈', Bronce: '🥉' };
    if (medal) {
      const label = tourney === 'Juegos Olímpicos' ? `${medal} olímpico` : `${medal} ${tourney}`;
      addTrophy(label); awards.push(`${icon[medal]} ${label} ${summer}`);
    } else awards.push(`🇪🇸 ${tourney} ${summer}`);
    S.fame += 3;
  }

  // Progresión
  const prevOvr = S.ovr;
  let delta;
  if (S.age <= 21) delta = rand(2, 6);
  else if (S.age <= 25) delta = rand(0.5, 4);
  else if (S.age <= 29) delta = rand(-1, 2);
  else if (S.age <= 32) delta = rand(-3, 0.5);
  else delta = rand(-6, -1.5);
  if (S.ovr > S.pot - 2 && delta > 0) delta *= 0.25;      // techo de potencial
  if (minutes > 28 && S.age <= 25) delta += 0.8;          // los minutos hacen crecer
  delta += S.growthBonus; S.growthBonus = 0;
  S.ovr = clamp(Math.round(S.ovr + delta), 40, 99);

  // Fama
  S.fame = clamp(S.fame + (role === 'Estrella' ? 6 : role === 'Titular' ? 3 : 0) + (won ? 5 : 0) + (t.league === 'NBA' ? 2 : 0), 0, 100);

  // Totales
  S.totals.g += gp; S.totals.pts += ppg * gp; S.totals.reb += rpg * gp; S.totals.ast += apg * gp;

  const season = {
    label: seasonLabel(S.year), team: t.name, color: t.color, league: t.league,
    age: S.age, ovr: prevOvr, newOvr: S.ovr, gp, ppg, rpg, apg, role, result, won, awards, injury,
  };
  S.seasons.push(season);
  S.year++; S.age++;
  return season;
}

// ---------------------------------------------------------------- Eventos (decisiones entre bloques)
const EVENTS = [
  () => ({
    title: '☀️ Verano de trabajo',
    text: 'Se acaba la temporada. ¿En qué inviertes el verano?',
    options: [
      { label: '🎯 Mejorar el tiro', sub: 'Más progresión, más cansancio', run: () => { S.growthBonus += S.age < 30 ? 2 : 1; return 'Mil tiros diarios. Tu mecánica está más fina que nunca.'; } },
      { label: '💪 Trabajo físico', sub: 'Menos riesgo de lesión', run: () => { S.injuryGuard = 2; S.growthBonus += 0.5; return 'Llegas a pretemporada como un toro.'; } },
      { label: '🏝️ Vacaciones', sub: 'Desconectar también cuenta', run: () => { S.fame += 2; return 'Ibiza, playa y fotos virales. Vuelves fresco.'; } },
    ],
  }),
  () => ({
    title: '🎓 Campus con una leyenda',
    text: 'Un exjugador histórico te invita a entrenar con él en su campus de verano.',
    options: [
      { label: 'Aceptar', sub: 'Aprender de los mejores', run: () => { const g = chance(0.7) ? 2 : 0; S.growthBonus += g; return g ? 'Te enseña un movimiento en el poste que te cambia el juego.' : 'Mucho aprender, pero poco que aplicar. Al menos la foto quedó bien.'; } },
      { label: 'Rechazar', sub: 'Prefieres descansar', run: () => 'Descansas en casa con la familia.' },
    ],
  }),
  () => ({
    title: '📱 Polémica en redes',
    text: 'Un periodista critica tu actitud en el último partido y el tema se hace viral.',
    options: [
      { label: 'Responder en la pista', sub: 'Que hable tu juego', run: () => { S.growthBonus += 1; return 'Te encierras en el gimnasio. La mejor respuesta es un triple.'; } },
      { label: 'Contestar en Twitter', sub: 'Arriesgado…', run: () => { if (chance(0.5)) { S.fame += 8; return 'Tu respuesta se hace legendaria. Ganas miles de seguidores.'; } S.fame -= 5; S.growthBonus -= 1; return 'Te llueven críticas y te cuesta centrarte.'; } },
    ],
  }),
  () => ({
    title: '💼 Oferta de patrocinio',
    text: 'Una marca de zapatillas quiere sacar tu modelo propio.',
    options: [
      { label: 'Firmar', sub: '+ fama, más compromisos', run: () => { S.fame += 6; if (chance(0.3)) { S.growthBonus -= 1; return 'Las zapatillas se venden genial, aunque los eventos te quitan horas de entreno.'; } return '¡Tus zapatillas se agotan en dos días!'; } },
      { label: 'Rechazar', sub: 'Solo baloncesto', run: () => { S.growthBonus += 0.5; return 'Sigues centrado al 100% en la pista.'; } },
    ],
  }),
  () => ({
    title: '🏥 Molestias en la rodilla',
    text: 'Los médicos detectan una pequeña lesión. Puedes operarte ahora o aguantar.',
    options: [
      { label: 'Operarse', sub: 'Pierdes algo de forma, pero seguro', run: () => { S.ovr = Math.max(40, S.ovr - 1); S.injuryGuard = 3; return 'Operación exitosa. Rodilla como nueva.'; } },
      { label: 'Aguantar', sub: 'Puede salir bien… o no', run: () => { if (chance(0.65)) return 'La rodilla responde. Ni te acuerdas.'; S.ovr = Math.max(40, S.ovr - 4); return 'Mala decisión: la lesión empeora y pierdes explosividad.'; } },
    ],
  }),
  () => ({
    title: '🧠 Nuevo entrenador personal',
    text: 'Un preparador conocido por trabajar con estrellas NBA quiere entrenarte.',
    options: [
      { label: 'Contratarlo', sub: 'Caro, pero efectivo', run: () => { S.growthBonus += 1.5; return 'Nuevos hábitos, nueva dieta, nuevo jugador.'; } },
      { label: 'Seguir con el de siempre', sub: 'La confianza vale mucho', run: () => { S.growthBonus += 0.5; S.fame += 1; return 'Tu entrenador de siempre te conoce mejor que nadie.'; } },
    ],
  }),
];

// ---------------------------------------------------------------- Ofertas
function salaryText(team) {
  if (team.league === 'NBA') return `${Math.max(1.2, (S.ovr - 70) * 2.3).toFixed(1).replace('.', ',')} M$/año`;
  if (team.league === 'NCAA') return 'Beca + NIL';
  return `${Math.max(0.1, (S.ovr - 58) * 0.12).toFixed(2).replace('.', ',')} M€/año`;
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

  // Equipos interesados
  const pool = TEAMS.filter(t => t !== cur && t.league !== 'NCAA')
    .filter(t => t.league !== 'NBA' || S.drafted || S.ovr >= 78)
    .map(t => ({ t, rel: S.ovr - teamLevel(t) }))
    .filter(x => x.rel >= -5);
  const sorted = [...pool].sort((a, b) => b.t.s - a.t.s);
  const best = sorted.find(x => x.rel >= -5);
  const picked = new Set(offers.map(o => o.team));
  if (best && !picked.has(best.t)) { offers.push(offerFor(best.t, { note: 'Oferta más ambiciosa' })); picked.add(best.t); }
  for (const x of shuffle(pool)) {
    if (offers.length >= 4) break;
    if (!picked.has(x.t)) { offers.push(offerFor(x.t)); picked.add(x.t); }
  }
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
    <div class="avatar" style="background:${t.color}">${esc(initials(S.name))}</div>
    <div>
      <h2>${esc(S.name)}</h2>
      <div class="meta">${S.pos} · ${S.age} años · ${esc(S.nat)} · <span class="dot" style="background:${t.color}"></span>${esc(t.name)} (${t.league})</div>
      <div class="chips">
        <span class="chip">Fama ${Math.round(S.fame)}/100</span>
        <span class="chip">${S.seasons.length} temporadas</span>
        ${top.map(([k, v]) => `<span class="chip gold">${v}× ${esc(k)}</span>`).join('')}
      </div>
    </div>
    <div class="ovr"><b>${S.ovr}</b><small>Media</small></div>`;
}

function renderLog() {
  $('#log').innerHTML = S.seasons.map(s => {
    const d = s.newOvr - s.ovr;
    return `<tr class="${s.won ? 'champ' : ''}">
      <td>${s.label}</td>
      <td><span class="dot" style="background:${s.color}"></span>${esc(s.team)}</td>
      <td>${s.age}</td>
      <td>${s.ovr} <small class="${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'}${Math.abs(d)}</small></td>
      <td>${s.gp}</td><td>${fmt1(s.ppg)}</td><td>${fmt1(s.rpg)}</td><td>${fmt1(s.apg)}</td>
      <td>${s.role}</td>
      <td>${s.result}${s.injury ? ` · <span class="down">${s.injury}</span>` : ''}${s.awards.length ? `<div class="awards">${s.awards.map(esc).join(' · ')}</div>` : ''}</td>
    </tr>`;
  }).reverse().join('');
}

function renderAll() { renderStatus(); renderLog(); }

function panel(html) { $('#panel').innerHTML = html; }

function seasonNews(list) {
  return list.map(s => {
    const highlight = s.awards.length ? ` — ${s.awards.map(esc).join(', ')}` : '';
    return `<div class="news"><b>${s.label}</b> · ${esc(s.team)}: ${fmt1(s.ppg)} pts, ${fmt1(s.rpg)} reb, ${fmt1(s.apg)} ast · ${s.result}${highlight}</div>`;
  }).join('');
}

// ---------------------------------------------------------------- Flujo
function playBlock() {
  const played = [];
  for (let i = 0; i < S.block; i++) {
    played.push(simulateSeason());
    if (S.team.league === 'NCAA' && S.ncaaYears >= 4) break;   // máximo 4 años universitarios
    if (mustRetire()) break;
  }
  renderAll();
  if (mustRetire()) return endCareer(mustRetire());
  showEvent(played);
}

function mustRetire() {
  if (S.age >= 41) return 'El cuerpo dice basta a los 41 años.';
  if (S.age >= 36 && S.ovr < 68) return 'Ya no encuentras equipo a tu nivel. Toca colgar las botas.';
  if (S.age >= 30 && S.ovr < 56) return 'Las lesiones y la falta de minutos te obligan a retirarte.';
  return null;
}

function showEvent(played) {
  const ev = pick(EVENTS)();
  panel(`
    <h3>Resumen de ${played.length > 1 ? 'las últimas temporadas' : 'la temporada'}</h3>
    ${seasonNews(played)}
    <h3 style="margin-top:16px">${ev.title}</h3>
    <p>${ev.text}</p>
    <div class="options">
      ${ev.options.map((o, i) => `<button class="offer" data-ev="${i}"><span class="bar" style="background:var(--orange)"></span><span><b>${o.label}</b><small>${o.sub}</small></span><span></span></button>`).join('')}
    </div>`);
  document.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => {
    const msg = ev.options[+b.dataset.ev].run();
    S.fame = clamp(S.fame, 0, 100);
    renderStatus();
    showOffers(msg);
  });
}

function showOffers(msg) {
  const cur = S.team;
  const forcedOut = cur.league === 'NCAA' && S.ncaaYears >= 4;
  const offers = buildOffers();
  const stayRel = S.ovr - teamLevel(cur);
  const canStay = !forcedOut && (stayRel >= -7 || cur.league === 'NCAA');

  const opt = (o, i) => `
    <button class="offer" data-offer="${i}">
      <span class="bar" style="background:${o.team.color}"></span>
      <span><b>${esc(o.team.name)}</b> <span class="stars">${starsFor(o.team)}</span>
        <small>${o.note ? esc(o.note) + ' · ' : ''}Rol previsto: ${o.role} · ${o.salary}</small></span>
      <span class="tag ${LEAGUE[o.team.league].tag}">${o.team.league}</span>
    </button>`;

  panel(`
    ${msg ? `<div class="news">${esc(msg)}</div>` : ''}
    <h3 style="margin-top:14px">📝 Mercado de fichajes · verano ${S.year}</h3>
    <p>${forcedOut ? 'Has agotado tus 4 años universitarios. Toca dar el salto.' : `Tienes ${S.age} años y una media de ${S.ovr}. ¿Qué haces?`}</p>
    <div class="options">
      ${canStay ? `<button class="offer" data-stay="1"><span class="bar" style="background:${cur.color}"></span><span><b>Seguir en ${esc(cur.name)}</b><small>Rol previsto: ${roleFor(stayRel)} · ${salaryText(cur)}</small></span><span class="tag stay">Renovar</span></button>` : ''}
      ${offers.map(opt).join('')}
      ${S.age >= 31 ? `<button class="offer" data-retire="1"><span class="bar" style="background:var(--red)"></span><span><b>Retirarte</b><small>Colgar las zapatillas con ${S.age} años</small></span><span class="tag ret">Fin</span></button>` : ''}
    </div>`);

  document.querySelectorAll('[data-offer]').forEach(b => b.onclick = () => {
    const o = offers[+b.dataset.offer];
    if (o.draft) { S.drafted = true; S.draftInfo = { pick: o.draft, team: o.team.name, year: S.year }; }
    if (o.team.league === 'NBA') S.drafted = true;
    S.team = o.team;
    if (S.teamsPath[S.teamsPath.length - 1] !== o.team.name) S.teamsPath.push(o.team.name);
    renderStatus();
    playBlock();
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
  const label = pts >= 400 ? 'GOAT' : pts >= 250 ? 'Leyenda' : pts >= 150 ? 'Hall of Fame' : pts >= 80 ? 'Gran carrera' : pts >= 40 ? 'Jugador sólido' : 'Currante de la pista';
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
  const peak = Math.max(...S.seasons.map(s => s.newOvr), S.ovr);

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
    </div>
    <h3>🏆 Palmarés</h3>
    ${trophies.length ? `<ul class="trophies">${trophies.map(([k, v]) => `<li><b>${v}×</b>${esc(k)}</li>`).join('')}</ul>` : '<p class="muted">Sin títulos, pero con mucho corazón.</p>'}
    <h3>🧳 Trayectoria</h3>
    <div class="teams-path">${S.teamsPath.map(esc).join(' → ')}</div>
    <p class="muted" style="margin-top:14px">${esc(reason)}</p>
    <p class="muted" style="font-size:.75rem">basquet.fun</p>`;

  saveHof(lg, trophies);
  show('end');
}

function shareText() {
  const g = Math.max(1, S.totals.g), lg = legacy();
  const lines = [
    `🏀 ${S.name} (${S.pos}) — ${lg.label}`,
    `${S.seasons.length} temporadas · ${S.totals.g} partidos · ${fmt1(S.totals.pts / g)} pts · ${fmt1(S.totals.reb / g)} reb · ${fmt1(S.totals.ast / g)} ast`,
    ...Object.entries(S.trophies).map(([k, v]) => `🏆 ${v}× ${k}`),
    `🧳 ${S.teamsPath.join(' → ')}`,
    'Juega tu carrera en basquet.fun',
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------- Salón de la Fama
const HOF_KEY = 'basquetfun_hof';
function loadHof() { try { return JSON.parse(localStorage.getItem(HOF_KEY)) || []; } catch { return []; } }
function saveHof(lg, trophies) {
  const list = loadHof();
  list.push({ name: S.name, pos: S.pos, label: lg.label, pts: lg.pts, seasons: S.seasons.length,
    top: trophies.slice(0, 4).map(([k, v]) => `${v}× ${k}`).join(', '), date: Date.now() });
  list.sort((a, b) => b.pts - a.pts);
  try { localStorage.setItem(HOF_KEY, JSON.stringify(list.slice(0, 10))); } catch { /* sin almacenamiento */ }
}
function renderHof() {
  const list = loadHof();
  $('#hof-list').innerHTML = list.length
    ? list.map(h => `<li><b>${esc(h.name)}</b> · ${esc(h.pos)} · ${esc(h.label)} (${h.pts} pts)<small>${h.seasons} temporadas${h.top ? ' · ' + esc(h.top) : ''}</small></li>`).join('')
    : '<li class="muted">Todavía no hay carreras. ¡Juega la primera!</li>';
}

function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 1800);
}

// ---------------------------------------------------------------- Arranque
function init() {
  const sel = $('#f-start');
  const groups = { ACB: '🇪🇸 Cantera ACB', NCAA: '🇺🇸 Universidad (NCAA)' };
  sel.innerHTML = Object.entries(groups).map(([lg, label]) =>
    `<optgroup label="${label}">${TEAMS.filter(t => t.league === lg).map(t => `<option>${esc(t.name)}</option>`).join('')}</optgroup>`).join('');

  $('#form-start').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name').value.trim() || 'Jugador Anónimo';
    newCareer({
      name, pos: $('#f-pos').value, nat: $('#f-nat').value, start: sel.value,
      block: +document.querySelector('input[name=mode]:checked').value,
    });
    renderAll();
    const t = S.team;
    panel(`
      <h3>¡Bienvenido a ${esc(t.name)}!</h3>
      <p>Con 18 años y una media de <b>${S.ovr}</b>, empiezas tu carrera en ${t.league === 'NCAA' ? 'la NCAA' : 'la cantera y el primer equipo'} de ${esc(t.name)}. Los ojeadores dicen que tienes ${S.pot >= 92 ? 'un talento generacional' : S.pot >= 86 ? 'madera de estrella' : S.pot >= 80 ? 'buen futuro' : 'mucho trabajo por delante'}.</p>
      <div class="actions"><button class="btn primary big" id="btn-go">Jugar ${S.block > 1 ? `las primeras ${S.block} temporadas` : 'la primera temporada'} ▶</button></div>`);
    $('#btn-go').onclick = playBlock;
    show('game');
  });

  document.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => {
    const to = b.dataset.goto;
    if (to === 'hof') renderHof();
    show(to);
  }));
  $('#btn-copy').onclick = async () => {
    try { await navigator.clipboard.writeText(shareText()); toast('¡Resumen copiado!'); }
    catch { prompt('Copia tu resumen:', shareText()); }
  };
  $('#btn-clear-hof').onclick = () => { localStorage.removeItem(HOF_KEY); renderHof(); };
}

init();
