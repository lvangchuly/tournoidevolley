import React, { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'tournoidevolley-react-vite-v14h';
const TEAM_TARGET = 18;
const LEVELS = ['L', 'D', 'R', 'NP', 'N'];
const LEVEL_WEIGHT = { L: 1, D: 2, R: 3, NP: 4, N: 5 };
const APP_VERSION = 'v14h';

const DEFAULT_PHASE_RULES = {
  brassage1: { winningScore: 21, mode: 'sec' },
  brassage2: { winningScore: 21, mode: 'sec' },
  principale: { winningScore: 21, mode: 'sec' },
  consolante: { winningScore: 21, mode: 'sec' },
  championnatAller: { winningScore: 21, mode: 'sec' },
  championnatRetour: { winningScore: 21, mode: 'sec' },
  quart: { winningScore: 21, mode: 'sec' },
  demi: { winningScore: 21, mode: 'sec' },
  finale: { winningScore: 21, mode: 'sec' },
  petiteFinale: { winningScore: 21, mode: 'sec' },
};
const PRINCIPALE_POOL_NAMES = ['Principale A', 'Principale B', 'Principale C', 'Principale D'];
const CONSOLANTE_POOL_NAMES = ['Consolante A', 'Consolante B'];
const CHAMPIONSHIP_ALLER_POOL_NAME = 'Championnat Aller';
const CHAMPIONSHIP_RETOUR_POOL_NAME = 'Championnat Retour';
const SMALL_QUARTER_PAIRINGS = [[1, 8], [4, 5], [3, 6], [2, 7]];
const LEVEL_DISPLAY_ORDER = ['N', 'NP', 'R', 'D', 'L'];

function getLevelClass(level) {
  return `team-level-${String(level || '').replace(/[^a-zA-Z0-9]+/g, '').toLowerCase()}`;
}

function formatGroupDisplay(group) {
  return String(group || '')
    .replace(/^Brassage\s*1\s*-\s*/i, '')
    .replace(/^Brassage\s*2\s*-\s*/i, '')
    .replace(/^Championnat\s*Aller\s*-\s*/i, '')
    .replace(/^Championnat\s*Retour\s*-\s*/i, '');
}

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function addMinutesToTime(time, minutesToAdd) {
  const [hours, minutes] = String(time || '09:00').split(':').map(Number);
  const total = hours * 60 + minutes + minutesToAdd;
  const normalized = ((total % 1440) + 1440) % 1440;
  const h = String(Math.floor(normalized / 60)).padStart(2, '0');
  const m = String(normalized % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function parseTimeToMinutes(time) {
  const [hours, minutes] = String(time || '09:00').split(':').map(Number);
  return (hours * 60) + minutes;
}

function minutesToTime(value) {
  const normalized = ((Math.round(value) % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalized / 60)).padStart(2, '0');
  const minutes = String(normalized % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function stampToMinutes(stamp) {
  if (!stamp) return null;
  const date = new Date(stamp);
  if (Number.isNaN(date.getTime())) return null;
  return (date.getHours() * 60) + date.getMinutes();
}

function estimatePhaseDurationMinutes(rule) {
  return Math.max(6, (Number(rule?.winningScore) || 21) + 5);
}

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function safeClone(value, fallback) {
  try {
    return value ? JSON.parse(JSON.stringify(value)) : fallback;
  } catch {
    return fallback;
  }
}

function loadState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function defaultTeams() {
  const defaults = ['N', 'N', 'NP', 'NP', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'L', 'L', 'L', 'L', 'NP', 'R', 'D'];
  return Array.from({ length: TEAM_TARGET }, (_, index) => ({
    id: uid('team'),
    name: `Équipe ${index + 1}`,
    level: defaults[index] || 'D',
    club: '',
    contact: '',
  }));
}

function sortTeamsForSeeding(teams) {
  return [...teams].sort((a, b) => {
    const diff = (LEVEL_WEIGHT[b.level] || 0) - (LEVEL_WEIGHT[a.level] || 0);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'fr');
  });
}

function distributeSerpentine(teamIds, poolCount) {
  const pools = Array.from({ length: poolCount }, () => []);
  let index = 0;
  let direction = 1;

  teamIds.forEach((teamId) => {
    pools[index].push(teamId);
    if (direction === 1) {
      if (index === poolCount - 1) {
        direction = -1;
      } else {
        index += 1;
      }
    } else if (index === 0) {
      direction = 1;
    } else {
      index -= 1;
    }
  });

  return pools;
}

function createPools(teamIds, names) {
  return distributeSerpentine(teamIds, names.length).map((teamIdList, index) => ({
    id: uid('pool'),
    name: names[index],
    teamIds: teamIdList,
  }));
}

function createNumberedNames(prefix, count) {
  return Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}`);
}

function createChampionshipPool(teamIds, poolName) {
  return [{
    id: uid('pool'),
    name: poolName,
    teamIds,
  }];
}

function createChampionshipMatches(teamIds, phase, groupName, reverse = false) {
  return roundRobinMatches(teamIds, phase, groupName).map((match, index) => ({
    ...match,
    teamAId: reverse ? match.teamBId : match.teamAId,
    teamBId: reverse ? match.teamAId : match.teamBId,
    court: (index % 3) + 1,
    slot: Math.floor(index / 3) + 1,
    time: '',
    validatedAt: match.validatedAt || null,
  }));
}

function createSmallBracketSeeds(rankedIds) {
  const seeds = {};
  rankedIds.slice(0, 8).forEach((teamId, index) => {
    seeds[index + 1] = teamId;
  });
  return seeds;
}

function buildQuarterMatchesFromRanking(rankedIds) {
  const seeds = createSmallBracketSeeds(rankedIds);
  return SMALL_QUARTER_PAIRINGS.map(([seedA, seedB], index) => {
    const teamAId = seeds[seedA] || null;
    const teamBId = seeds[seedB] || null;
    return teamAId && teamBId ? makeKnockoutMatch('Quart de finale', `Quart ${index + 1}`, teamAId, teamBId) : null;
  }).filter(Boolean);
}

function resolveQuarterSlotWinner(rankedIds, quarterMatches, pairIndex, phaseRules) {
  const seeds = createSmallBracketSeeds(rankedIds);
  const [seedA, seedB] = SMALL_QUARTER_PAIRINGS[pairIndex];
  const teamAId = seeds[seedA] || null;
  const teamBId = seeds[seedB] || null;
  if (teamAId && !teamBId) return teamAId;
  if (!teamAId && teamBId) return teamBId;
  if (teamAId && teamBId) {
    const match = quarterMatches.find((item) => item.group === `Quart ${pairIndex + 1}`);
    return getWinnerLoser(match, phaseRules).winner;
  }
  return null;
}

function buildSemisFromRanking(rankedIds) {
  const seeds = createSmallBracketSeeds(rankedIds);
  const team1 = seeds[1] || null;
  const team2 = seeds[2] || null;
  const team3 = seeds[3] || null;
  const team4 = seeds[4] || null;
  if (rankedIds.length >= 4) {
    return [
      makeKnockoutMatch('Demi-finale', 'Demi 1', team1, team4),
      makeKnockoutMatch('Demi-finale', 'Demi 2', team2, team3),
    ].filter((match) => match.teamAId && match.teamBId);
  }
  if (rankedIds.length === 3) {
    return [makeKnockoutMatch('Demi-finale', 'Demi 1', team2, team3)];
  }
  return [];
}

function buildSemisFromQuarters(rankedIds, quarterMatches, phaseRules) {
  return [
    makeKnockoutMatch('Demi-finale', 'Demi 1', resolveQuarterSlotWinner(rankedIds, quarterMatches, 0, phaseRules), resolveQuarterSlotWinner(rankedIds, quarterMatches, 1, phaseRules)),
    makeKnockoutMatch('Demi-finale', 'Demi 2', resolveQuarterSlotWinner(rankedIds, quarterMatches, 2, phaseRules), resolveQuarterSlotWinner(rankedIds, quarterMatches, 3, phaseRules)),
  ].filter((match) => match.teamAId && match.teamBId);
}

function roundRobinMatches(teamIds, phase, groupName) {
  const ids = [...teamIds];
  if (ids.length % 2 !== 0) ids.push(null);

  const rounds = [];
  const rotating = [...ids];
  const total = rotating.length;

  for (let round = 0; round < total - 1; round += 1) {
    for (let i = 0; i < total / 2; i += 1) {
      const a = rotating[i];
      const b = rotating[total - 1 - i];
      if (a && b) {
        rounds.push({
          id: uid('match'),
          phase,
          group: groupName,
          round: round + 1,
          teamAId: round % 2 === 0 ? a : b,
          teamBId: round % 2 === 0 ? b : a,
          scoreA: '',
          scoreB: '',
        });
      }
    }
    rotating.splice(1, 0, rotating.pop());
  }

  return rounds;
}

function createThreeTeamPoolMatches(pool, phase) {
  if (pool.teamIds.length !== 3) {
    return roundRobinMatches(pool.teamIds, phase, pool.name);
  }

  const [team1, team2, team3] = pool.teamIds;

  return [
    {
      id: uid('match'),
      phase,
      group: pool.name,
      round: 1,
      teamAId: team1,
      teamBId: team2,
      scoreA: '',
      scoreB: '',
    },
    {
      id: uid('match'),
      phase,
      group: pool.name,
      round: 2,
      teamAId: team2,
      teamBId: team3,
      scoreA: '',
      scoreB: '',
    },
    {
      id: uid('match'),
      phase,
      group: pool.name,
      round: 3,
      teamAId: team3,
      teamBId: team1,
      scoreA: '',
      scoreB: '',
    },
  ];
}

function scheduleBrassageMatches(pools, phase, startSlot) {
  const poolPairs = [
    [0, 1],
    [2, 3],
    [4, 5],
  ];

  const scheduled = [];

  poolPairs.forEach(([firstPoolIndex, secondPoolIndex], courtIndex) => {
    const firstPool = pools[firstPoolIndex];
    const secondPool = pools[secondPoolIndex];
    if (!firstPool || !secondPool) return;

    const firstPoolMatches = createThreeTeamPoolMatches(firstPool, phase);
    const secondPoolMatches = createThreeTeamPoolMatches(secondPool, phase);

    const orderedMatches = [
      firstPoolMatches[0],
      secondPoolMatches[0],
      firstPoolMatches[1],
      secondPoolMatches[1],
      firstPoolMatches[2],
      secondPoolMatches[2],
    ];

    orderedMatches.forEach((match, offset) => {
      const zeroBasedSlot = startSlot + offset;
      scheduled.push({
        ...match,
        court: courtIndex + 1,
        slot: zeroBasedSlot + 1,
        time: '',
        validatedAt: match.validatedAt || null,
      });
    });
  });

  return scheduled.sort((a, b) => {
    if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
    return (a.court || 0) - (b.court || 0);
  });
}

function assignSchedule(matches, startSlot) {
  return matches.map((match, index) => {
    const zeroBasedSlot = startSlot + Math.floor(index / 3);
    return {
      ...match,
      court: (index % 3) + 1,
      slot: zeroBasedSlot + 1,
      time: '',
      validatedAt: match.validatedAt || null,
    };
  });
}

function stageSlotCount(matchCount) {
  return Math.ceil(matchCount / 3);
}

function computeTournamentPoints(scoreA, scoreB) {
  const diff = Math.abs(scoreA - scoreB);
  if (scoreA > scoreB) return { a: (2 * scoreA) + diff, b: scoreB - diff };
  if (scoreB > scoreA) return { a: scoreA - diff, b: (2 * scoreB) + diff };
  return { a: scoreA, b: scoreB };
}

function getRuleKeyFromPhaseLabel(phaseLabel) {
  if (phaseLabel === 'Brassage 1') return 'brassage1';
  if (phaseLabel === 'Brassage 2') return 'brassage2';
  if (phaseLabel === 'Principale' || phaseLabel === 'Tableau principal') return 'principale';
  if (phaseLabel === 'Consolante' || phaseLabel === 'Tableau consolante') return 'consolante';
  if (phaseLabel === 'Championnat Aller') return 'championnatAller';
  if (phaseLabel === 'Championnat Retour') return 'championnatRetour';
  if (phaseLabel === 'Quart de finale') return 'quart';
  if (phaseLabel === 'Demi-finale') return 'demi';
  if (phaseLabel === 'Finale') return 'finale';
  if (phaseLabel === 'Petite finale') return 'petiteFinale';
  return 'brassage1';
}

function getRuleForPhaseLabel(phaseLabel, phaseRules) {
  const key = getRuleKeyFromPhaseLabel(phaseLabel);
  return phaseRules?.[key] || DEFAULT_PHASE_RULES[key];
}

function isMatchResultValid(match, phaseRules) {
  const scoreA = toNumber(match.scoreA);
  const scoreB = toNumber(match.scoreB);
  if (scoreA === null || scoreB === null) return false;
  if (scoreA === scoreB) return false;

  const rule = getRuleForPhaseLabel(match.phase, phaseRules);
  const target = Number(rule?.winningScore) || 21;
  const mode = rule?.mode || 'sec';

  if (mode === 'sec') {
    return (scoreA === target && scoreB < target) || (scoreB === target && scoreA < target);
  }

  return (scoreA >= target || scoreB >= target) && Math.abs(scoreA - scoreB) >= 2;
}

function getMatchStatusLabel(match, phaseRules) {
  const scoreA = toNumber(match.scoreA);
  const scoreB = toNumber(match.scoreB);
  if (scoreA === null || scoreB === null) return 'À saisir';
  return isMatchResultValid(match, phaseRules) ? 'Valide' : 'Score invalide';
}

function computeDynamicStageSchedule(matches, stageStartMinutes, phaseRules) {
  const scheduleMap = {};
  const sorted = [...matches].sort((a, b) => {
    if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
    return (a.court || 0) - (b.court || 0);
  });
  const courtAvailability = new Map([[1, stageStartMinutes], [2, stageStartMinutes], [3, stageStartMinutes]]);

  sorted.forEach((match) => {
    const court = match.court || 1;
    const plannedStart = courtAvailability.get(court) ?? stageStartMinutes;
    const actualEnd = isMatchResultValid(match, phaseRules) ? stampToMinutes(match.validatedAt) : null;
    const estimatedEnd = plannedStart + estimatePhaseDurationMinutes(getRuleForPhaseLabel(match.phase, phaseRules));
    const endMinutes = actualEnd !== null ? Math.max(plannedStart, actualEnd) : estimatedEnd;

    scheduleMap[match.id] = {
      startMinutes: plannedStart,
      startText: minutesToTime(plannedStart),
      endMinutes,
      endText: minutesToTime(endMinutes),
      estimatedDuration: estimatePhaseDurationMinutes(getRuleForPhaseLabel(match.phase, phaseRules)),
    };

    courtAvailability.set(court, endMinutes);
  });

  return {
    scheduleMap,
    stageEnd: Math.max(...courtAvailability.values()),
  };
}

function computeTournamentSchedule(stageGroups, startTime, phaseRules) {
  let stageStart = parseTimeToMinutes(startTime);
  const mergedMap = {};

  stageGroups.forEach((group) => {
    if (!group.length) return;
    const result = computeDynamicStageSchedule(group, stageStart, phaseRules);
    Object.assign(mergedMap, result.scheduleMap);
    stageStart = result.stageEnd;
  });

  return {
    scheduleMap: mergedMap,
    estimatedEndMinutes: stageStart,
    estimatedEndText: minutesToTime(stageStart),
  };
}

function compareStandingRows(a, b) {
  if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints;
  if (b.wins !== a.wins) return b.wins - a.wins;
  if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
  if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
  return a.teamName.localeCompare(b.teamName, 'fr');
}

function computeRanking(teamIds, matches, teamMap, phaseRules) {
  const rows = teamIds.map((teamId) => ({
    teamId,
    teamName: teamMap.get(teamId)?.name || teamId,
    level: teamMap.get(teamId)?.level || '',
    played: 0,
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    pointDiff: 0,
    tournamentPoints: 0,
  }));

  const rowMap = new Map(rows.map((row) => [row.teamId, row]));

  matches.forEach((match) => {
    if (!rowMap.has(match.teamAId) || !rowMap.has(match.teamBId)) return;
    const scoreA = toNumber(match.scoreA);
    const scoreB = toNumber(match.scoreB);
    if (scoreA === null || scoreB === null) return;
    if (!isMatchResultValid(match, phaseRules)) return;

    const teamA = rowMap.get(match.teamAId);
    const teamB = rowMap.get(match.teamBId);

    teamA.played += 1;
    teamB.played += 1;
    teamA.pointsFor += scoreA;
    teamA.pointsAgainst += scoreB;
    teamB.pointsFor += scoreB;
    teamB.pointsAgainst += scoreA;

    const tp = computeTournamentPoints(scoreA, scoreB);
    teamA.tournamentPoints += tp.a;
    teamB.tournamentPoints += tp.b;

    if (scoreA > scoreB) {
      teamA.wins += 1;
      teamB.losses += 1;
    } else {
      teamB.wins += 1;
      teamA.losses += 1;
    }
  });

  rows.forEach((row) => {
    row.pointDiff = row.pointsFor - row.pointsAgainst;
  });

  return rows.sort(compareStandingRows);
}

function computeGroupStandings(pools, matches, teamMap, phaseRules) {
  return pools.map((pool) => ({
    pool,
    rows: computeRanking(
      pool.teamIds,
      matches.filter((match) => pool.teamIds.includes(match.teamAId) && pool.teamIds.includes(match.teamBId)),
      teamMap,
      phaseRules
    ),
  }));
}

function getWinnerLoser(match, phaseRules) {
  const scoreA = toNumber(match.scoreA);
  const scoreB = toNumber(match.scoreB);
  if (scoreA === null || scoreB === null || scoreA === scoreB) return { winner: null, loser: null };
  if (!isMatchResultValid(match, phaseRules)) return { winner: null, loser: null };
  return scoreA > scoreB
    ? { winner: match.teamAId, loser: match.teamBId }
    : { winner: match.teamBId, loser: match.teamAId };
}

function makeKnockoutMatch(phase, group, teamAId, teamBId) {
  return {
    id: uid('ko'),
    phase,
    group,
    round: 1,
    teamAId,
    teamBId,
    scoreA: '',
    scoreB: '',
  };
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Button({ children, variant = 'primary', ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

function Section({ title, subtitle, right, children }) {
  return (
    <section className="section-card">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        {right ? <div className="actions-row">{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

function StatCard({ label, value, subvalue }) {
  return (
    <div className="stat-card">
      <div className="muted small">{label}</div>
      <div className="stat-value">{value}</div>
      {subvalue ? <div className="muted small">{subvalue}</div> : null}
    </div>
  );
}

function PhaseRuleEditor({ title, value, onScoreChange, onModeChange }) {
  const estimatedDuration = estimatePhaseDurationMinutes(value);
  return (
    <div className="rule-card">
      <h3>{title}</h3>
      <div className="form-grid two-cols">
        <label>
          <span>Score gagnant</span>
          <input type="number" min="1" value={value.winningScore} onChange={(e) => onScoreChange(Number(e.target.value) || 21)} />
        </label>
        <label>
          <span>Contexte</span>
          <select value={value.mode} onChange={(e) => onModeChange(e.target.value)}>
            <option value="sec">Sec</option>
            <option value="twoPointGap">Avec 2 points d’écart</option>
          </select>
        </label>
      </div>
      <p className="muted small helper-text">Durée estimée utilisée pour le planning : {estimatedDuration} min (échauffement inclus).</p>
    </div>
  );
}

function LargePublicMatch({ title, match, teamName, renderTeamBadge }) {
  if (!match) return null;
  return (
    <div className="public-match-card">
      <div className="public-label">{title}</div>
      <div className="public-match-grid">
        <div>
          <div className="muted small">{match.time} • Terrain {match.court}</div>
          <div className="public-team">{renderTeamBadge(match.teamAId)}</div>
          <div className="muted small">vs</div>
          <div className="public-team">{renderTeamBadge(match.teamBId)}</div>
        </div>
        <div className="align-right">
          <div className="muted small">{match.group}</div>
          <div className="public-score">{match.scoreA === '' ? '-' : match.scoreA} : {match.scoreB === '' ? '-' : match.scoreB}</div>
        </div>
      </div>
    </div>
  );
}



function buildRefereeAccessUrl() {
  if (typeof window === 'undefined') return '?mode=referee';
  const url = new URL(window.location.href);
  url.searchParams.set('mode', 'referee');
  return url.toString();
}

function RefereeQrCode({ url }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
  return (
    <div className="referee-qr-card">
      <div className="referee-qr-title">Accès arbitres</div>
      <img className="referee-qr-image" src={qrSrc} alt="QR code d’accès au mode arbitres" />
      <div className="referee-qr-caption">Scanne ce QR code pour ouvrir directement le mode Arbitres.</div>
    </div>
  );
}

export default function App() {
  const initial = loadState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'public';
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'referee' ? 'referee' : 'public';
  });
  const [isOrganizerAuthenticated, setIsOrganizerAuthenticated] = useState(false);
  const [showOrganizerLogin, setShowOrganizerLogin] = useState(false);
  const [organizerAttempt, setOrganizerAttempt] = useState('');
  const [loginError, setLoginError] = useState('');
  const [teams, setTeams] = useState(safeClone(initial?.teams, defaultTeams()));
  const [startTime, setStartTime] = useState(initial?.settings?.startTime || '09:00');
  const [slotDuration, setSlotDuration] = useState(initial?.settings?.slotDuration || 20);
  const [phaseRules, setPhaseRules] = useState(() => ({ ...DEFAULT_PHASE_RULES, ...(safeClone(initial?.settings?.phaseRules, {}) || {}) }));
  const [organizerPassword, setOrganizerPassword] = useState(initial?.settings?.organizerPassword || 'Chuly0ne');
  const [passwordDraft, setPasswordDraft] = useState(initial?.settings?.organizerPassword || 'Chuly0ne');
  const [tournamentName, setTournamentName] = useState(initial?.settings?.tournamentName || 'Tournoi de volley');
  const [lastSavedAt, setLastSavedAt] = useState(initial?.meta?.lastSavedAt || '');
  const [brassage1, setBrassage1] = useState(safeClone(initial?.brassage1, { pools: [], matches: [] }));
  const [brassage2, setBrassage2] = useState(safeClone(initial?.brassage2, { pools: [], matches: [] }));
  const [mainStage, setMainStage] = useState(safeClone(initial?.mainStage, { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] }));
  const [knockout, setKnockout] = useState(safeClone(initial?.knockout, { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] }));
  const [championshipLeg1, setChampionshipLeg1] = useState(safeClone(initial?.championshipLeg1, { pools: [], matches: [] }));
  const [championshipLeg2, setChampionshipLeg2] = useState(safeClone(initial?.championshipLeg2, { pools: [], matches: [] }));
  const [singleKnockout, setSingleKnockout] = useState(safeClone(initial?.singleKnockout, { quarters: [], semis: [], finals: [] }));
  const [refereeSelectedMatch, setRefereeSelectedMatch] = useState(null);
  const importRef = useRef(null);
  const refereeAccessUrl = useMemo(() => buildRefereeAccessUrl(), []);

  const teamMap = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const activeTeams = useMemo(() => teams.filter((team) => team.name.trim()), [teams]);
  const allTeamIds = useMemo(() => activeTeams.map((team) => team.id), [activeTeams]);
  const isSmallTournamentMode = activeTeams.length > 0 && activeTeams.length < 10;
  const teamsSortedByLevel = useMemo(() => [...teams].sort((a, b) => {
    const diff = (LEVEL_WEIGHT[b.level] || 0) - (LEVEL_WEIGHT[a.level] || 0);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'fr');
  }), [teams]);


  const brassage1Standings = useMemo(() => computeGroupStandings(brassage1.pools, brassage1.matches, teamMap, phaseRules), [brassage1, teamMap, phaseRules]);
  const brassage2Standings = useMemo(() => computeGroupStandings(brassage2.pools, brassage2.matches, teamMap, phaseRules), [brassage2, teamMap, phaseRules]);
  const principaleStandings = useMemo(() => computeGroupStandings(mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules), [mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules]);
  const consolanteStandings = useMemo(() => computeGroupStandings(mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules), [mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules]);

  const rankingAfterBrassage1 = useMemo(() => computeRanking(allTeamIds, brassage1.matches, teamMap, phaseRules), [allTeamIds, brassage1.matches, teamMap, phaseRules]);
  const rankingAfterBrassages = useMemo(() => computeRanking(allTeamIds, [...brassage1.matches, ...brassage2.matches], teamMap, phaseRules), [allTeamIds, brassage1.matches, brassage2.matches, teamMap, phaseRules]);
  const championshipLeg1Standings = useMemo(() => computeGroupStandings(championshipLeg1.pools, championshipLeg1.matches, teamMap, phaseRules), [championshipLeg1, teamMap, phaseRules]);
  const championshipLeg2Standings = useMemo(() => computeGroupStandings(championshipLeg2.pools, championshipLeg2.matches, teamMap, phaseRules), [championshipLeg2, teamMap, phaseRules]);
  const championshipRanking = useMemo(() => computeRanking(allTeamIds, [...championshipLeg1.matches, ...championshipLeg2.matches], teamMap, phaseRules), [allTeamIds, championshipLeg1.matches, championshipLeg2.matches, teamMap, phaseRules]);
  const overallRanking = useMemo(() => computeRanking(allTeamIds, isSmallTournamentMode ? [
    ...championshipLeg1.matches,
    ...championshipLeg2.matches,
    ...singleKnockout.quarters,
    ...singleKnockout.semis,
    ...singleKnockout.finals,
  ] : [
    ...brassage1.matches,
    ...brassage2.matches,
    ...mainStage.principaleMatches,
    ...mainStage.consolanteMatches,
    ...knockout.principalQuarters,
    ...knockout.principalSemis,
    ...knockout.principalFinals,
    ...knockout.consolanteSemis,
    ...knockout.consolanteFinals,
  ] , teamMap, phaseRules), [allTeamIds, isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage, knockout, teamMap, phaseRules]);

  function getPersistedState(savedAt = lastSavedAt) {
    return {
      teams,
      settings: { startTime, slotDuration, phaseRules, organizerPassword, tournamentName },
      meta: { lastSavedAt: savedAt },
      brassage1,
      brassage2,
      mainStage,
      knockout,
      championshipLeg1,
      championshipLeg2,
      singleKnockout,
    };
  }

  function saveTournamentState(showMessage = true) {
    if (typeof window === 'undefined') return;
    const savedAt = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getPersistedState(savedAt)));
    setLastSavedAt(savedAt);
    if (showMessage) {
      window.alert('État du tournoi sauvegardé sur ce navigateur.');
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getPersistedState()));
  }, [teams, startTime, slotDuration, phaseRules, organizerPassword, tournamentName, brassage1, brassage2, mainStage, knockout, championshipLeg1, championshipLeg2, singleKnockout]);

  const scheduleData = useMemo(() => computeTournamentSchedule(isSmallTournamentMode ? [
    championshipLeg1.matches,
    championshipLeg2.matches,
    singleKnockout.quarters,
    singleKnockout.semis,
    singleKnockout.finals,
  ] : [
    brassage1.matches,
    brassage2.matches,
    [...mainStage.principaleMatches, ...mainStage.consolanteMatches],
    [...knockout.principalQuarters, ...knockout.consolanteSemis],
    [...knockout.principalSemis, ...knockout.consolanteFinals],
    knockout.principalFinals,
  ], startTime, phaseRules), [startTime, phaseRules, isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage, knockout]);

  const estimatedTournamentEnd = scheduleData.estimatedEndText;

  const nextMatches = useMemo(() => {
    const allMatches = isSmallTournamentMode ? [
      ...championshipLeg1.matches,
      ...championshipLeg2.matches,
      ...singleKnockout.quarters,
      ...singleKnockout.semis,
      ...singleKnockout.finals,
    ] : [
      ...brassage1.matches,
      ...brassage2.matches,
      ...mainStage.principaleMatches,
      ...mainStage.consolanteMatches,
      ...knockout.principalQuarters,
      ...knockout.principalSemis,
      ...knockout.principalFinals,
      ...knockout.consolanteSemis,
      ...knockout.consolanteFinals,
    ];
    return allMatches
      .filter((match) => toNumber(match.scoreA) === null || toNumber(match.scoreB) === null || !isMatchResultValid(match, phaseRules))
      .sort((a, b) => (scheduleData.scheduleMap[a.id]?.startMinutes || 0) - (scheduleData.scheduleMap[b.id]?.startMinutes || 0))
      .slice(0, 3)
      .map((match) => ({ ...match, time: scheduleData.scheduleMap[match.id]?.startText || match.time }));
  }, [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage, knockout, phaseRules, scheduleData]);

  const completedMatchCounts = isSmallTournamentMode ? {
    championnatAller: championshipLeg1.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    championnatRetour: championshipLeg2.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    quart: singleKnockout.quarters.filter((m) => isMatchResultValid(m, phaseRules)).length,
    demi: singleKnockout.semis.filter((m) => isMatchResultValid(m, phaseRules)).length,
    finale: singleKnockout.finals.filter((m) => isMatchResultValid(m, phaseRules)).length,
  } : {
    b1: brassage1.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    b2: brassage2.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    principale: mainStage.principaleMatches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    consolante: mainStage.consolanteMatches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    ko: [...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals, ...knockout.consolanteSemis, ...knockout.consolanteFinals].filter((m) => isMatchResultValid(m, phaseRules)).length,
  };

  const stageValidation = useMemo(() => isSmallTournamentMode ? ({
    championnatAllerComplete: championshipLeg1.matches.length > 0 && championshipLeg1.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    championnatRetourComplete: championshipLeg2.matches.length > 0 && championshipLeg2.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    quarterComplete: singleKnockout.quarters.length === 0 || singleKnockout.quarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    semiComplete: singleKnockout.semis.length === 0 || singleKnockout.semis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }) : ({
    brassage1Complete: brassage1.matches.length > 0 && brassage1.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    brassage2Complete: brassage2.matches.length > 0 && brassage2.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalePoolsComplete: mainStage.principaleMatches.length > 0 && mainStage.principaleMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolantePoolsComplete: mainStage.consolanteMatches.length > 0 && mainStage.consolanteMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalQuartersComplete: knockout.principalQuarters.length > 0 && knockout.principalQuarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalSemisComplete: knockout.principalSemis.length > 0 && knockout.principalSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolanteSemisComplete: knockout.consolanteSemis.length > 0 && knockout.consolanteSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout, phaseRules]);

  const refereeMatchGroups = useMemo(() => (isSmallTournamentMode ? [
    { title: 'Championnat Aller', scope: 'championshipLeg1', matches: championshipLeg1.matches, isUnlocked: true, lockReason: '' },
    { title: 'Championnat Retour', scope: 'championshipLeg2', matches: championshipLeg2.matches, isUnlocked: stageValidation.championnatAllerComplete, lockReason: 'Tous les scores du Championnat Aller doivent être valides.' },
    { title: 'Quarts de finale', scope: 'quarters', matches: singleKnockout.quarters, isUnlocked: stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete, lockReason: 'Tous les scores du Championnat Aller et Retour doivent être valides.' },
    { title: 'Demi-finales', scope: 'semis', matches: singleKnockout.semis, isUnlocked: stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete && (singleKnockout.quarters.length === 0 || stageValidation.quarterComplete), lockReason: singleKnockout.quarters.length ? 'Tous les scores des quarts de finale doivent être valides.' : 'Tous les scores du Championnat Aller et Retour doivent être valides.' },
    { title: 'Finale et petite finale', scope: 'finals', matches: singleKnockout.finals, isUnlocked: (singleKnockout.semis.length ? stageValidation.semiComplete : stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete), lockReason: singleKnockout.semis.length ? 'Tous les scores des demi-finales doivent être valides.' : 'Tous les scores du Championnat Aller et Retour doivent être valides.' },
  ] : [
    { title: 'Brassage 1', scope: 'brassage1', matches: brassage1.matches, isUnlocked: true, lockReason: '' },
    { title: 'Brassage 2', scope: 'brassage2', matches: brassage2.matches, isUnlocked: stageValidation.brassage1Complete, lockReason: 'Tous les scores du Brassage 1 doivent être valides.' },
    { title: 'Principale', scope: 'principale', matches: mainStage.principaleMatches, isUnlocked: stageValidation.brassage2Complete, lockReason: 'Tous les scores du Brassage 2 doivent être valides.' },
    { title: 'Consolante', scope: 'consolante', matches: mainStage.consolanteMatches, isUnlocked: stageValidation.brassage2Complete, lockReason: 'Tous les scores du Brassage 2 doivent être valides.' },
    { title: 'Quarts principale', scope: 'principalQuarters', matches: knockout.principalQuarters, isUnlocked: stageValidation.principalePoolsComplete, lockReason: 'Tous les scores des poules principales doivent être valides.' },
    { title: 'Demi-finales principale', scope: 'principalSemis', matches: knockout.principalSemis, isUnlocked: stageValidation.principalQuartersComplete, lockReason: 'Tous les scores des quarts de finale principaux doivent être valides.' },
    { title: 'Finales principale', scope: 'principalFinals', matches: knockout.principalFinals, isUnlocked: stageValidation.principalSemisComplete, lockReason: 'Tous les scores des demi-finales principales doivent être valides.' },
    { title: 'Demi-finales consolante', scope: 'consolanteSemis', matches: knockout.consolanteSemis, isUnlocked: stageValidation.consolantePoolsComplete, lockReason: 'Tous les scores des poules de consolante doivent être valides.' },
    { title: 'Finales consolante', scope: 'consolanteFinals', matches: knockout.consolanteFinals, isUnlocked: stageValidation.consolanteSemisComplete, lockReason: 'Tous les scores des demi-finales de consolante doivent être valides.' },
  ]), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout, stageValidation]);

  const refereeSelectedEntry = useMemo(() => {
    if (!refereeSelectedMatch) return null;
    const group = refereeMatchGroups.find((item) => item.scope === refereeSelectedMatch.scope);
    if (!group) return null;
    const match = group.matches.find((item) => item.id === refereeSelectedMatch.matchId);
    return match ? { ...group, match } : null;
  }, [refereeSelectedMatch, refereeMatchGroups]);

  useEffect(() => {
    if (refereeSelectedMatch && !refereeSelectedEntry) {
      setRefereeSelectedMatch(null);
    }
  }, [refereeSelectedMatch, refereeSelectedEntry]);


  useEffect(() => {
    const allowedTabs = isSmallTournamentMode ? ['dashboard', 'equipes', 'championship', 'finales', 'export'] : ['dashboard', 'equipes', 'brassage1', 'brassage2', 'principale', 'finales', 'export'];
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [isSmallTournamentMode, activeTab]);

  function countValidMatches(matches) {
    return matches.filter((match) => getMatchStatusLabel(match, phaseRules) === 'Valide').length;
  }

  function confirmOverwritePlayedMatches(matches, label) {
    const validCount = countValidMatches(matches);
    if (!validCount) return true;
    const first = window.confirm(`${validCount} match(s) déjà joué(s) dans ${label} seront effacés si tu continues. Veux-tu poursuivre ?`);
    if (!first) return false;
    return window.confirm(`Confirmation finale : ${validCount} match(s) valide(s) seront définitivement effacés dans ${label}. Confirmer ?`);
  }

  function updatePhaseRule(ruleKey, field, value) {
    setPhaseRules((current) => ({ ...current, [ruleKey]: { ...current[ruleKey], [field]: value } }));
  }

  function teamName(teamId) {
    return teamMap.get(teamId)?.name || 'À définir';
  }

  function renderTeamBadge(teamId, extraClass = '') {
    const team = teamMap.get(teamId);
    const classes = ['team-name-chip', getLevelClass(team?.level), extraClass].filter(Boolean).join(' ');
    return <span className={classes}>{team?.name || 'À définir'}</span>;
  }

  function enterPublicMode() {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      window.history.replaceState({}, '', url.toString());
    }
    setMode('public');
    setIsOrganizerAuthenticated(false);
    setShowOrganizerLogin(false);
    setOrganizerAttempt('');
    setLoginError('');
    setRefereeSelectedMatch(null);
  }

  function enterRefereeMode() {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'referee');
      window.history.replaceState({}, '', url.toString());
    }
    setMode('referee');
    setIsOrganizerAuthenticated(false);
    setShowOrganizerLogin(false);
    setOrganizerAttempt('');
    setLoginError('');
    setRefereeSelectedMatch(null);
  }

  function requestOrganizerMode() {
    setShowOrganizerLogin(true);
    setOrganizerAttempt('');
    setLoginError('');
  }

  function handleOrganizerLogin() {
    if (organizerAttempt === organizerPassword) {
      setIsOrganizerAuthenticated(true);
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('mode');
        window.history.replaceState({}, '', url.toString());
      }
      setMode('organizer');
      setShowOrganizerLogin(false);
      setOrganizerAttempt('');
      setLoginError('');
      return;
    }
    setLoginError('Mot de passe incorrect.');
  }

  function lockOrganizerMode() {
    enterPublicMode();
  }

  function updateOrganizerPassword() {
    const cleanPassword = passwordDraft.trim();
    if (!cleanPassword) {
      window.alert('Le mot de passe organisateur ne peut pas être vide.');
      return;
    }
    setOrganizerPassword(cleanPassword);
    window.alert('Mot de passe organisateur mis à jour.');
  }

  function updateTeam(teamId, field, value) {
    setTeams((current) => current.map((team) => (team.id === teamId ? { ...team, [field]: value } : team)));
  }

  function addTeam() {
    setTeams((current) => [...current, { id: uid('team'), name: `Équipe ${current.length + 1}`, level: 'D', club: '', contact: '' }]);
  }

  function removeTeam(teamId) {
    setTeams((current) => current.filter((team) => team.id !== teamId));
    setBrassage1({ pools: [], matches: [] });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setChampionshipLeg1({ pools: [], matches: [] });
    setChampionshipLeg2({ pools: [], matches: [] });
    setSingleKnockout({ quarters: [], semis: [], finals: [] });
  }

  function resetTournament() {
    setTeams(defaultTeams());
    setStartTime('09:00');
    setSlotDuration(20);
    setPhaseRules({ ...DEFAULT_PHASE_RULES });
    setOrganizerPassword('Chuly0ne');
    setPasswordDraft('Chuly0ne');
    setTournamentName('Tournoi de volley');
    setLastSavedAt('');
    setBrassage1({ pools: [], matches: [] });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setChampionshipLeg1({ pools: [], matches: [] });
    setChampionshipLeg2({ pools: [], matches: [] });
    setSingleKnockout({ quarters: [], semis: [], finals: [] });
  }

  function generateBrassage1() {
    if (!confirmOverwritePlayedMatches([
      ...brassage1.matches,
      ...brassage2.matches,
      ...mainStage.principaleMatches,
      ...mainStage.consolanteMatches,
      ...knockout.principalQuarters,
      ...knockout.principalSemis,
      ...knockout.principalFinals,
      ...knockout.consolanteSemis,
      ...knockout.consolanteFinals,
      ...championshipLeg1.matches,
      ...championshipLeg2.matches,
      ...singleKnockout.quarters,
      ...singleKnockout.semis,
      ...singleKnockout.finals,
    ], 'le tournoi en cours')) return;
    const readyTeams = activeTeams;
    if (readyTeams.length < 2) {
      window.alert('Ajoute au moins 2 équipes pour générer un tournoi.');
      return;
    }
    if (readyTeams.length < 10) {
      const seededIds = sortTeamsForSeeding(readyTeams).map((team) => team.id);
      const pools = createChampionshipPool(seededIds, CHAMPIONSHIP_ALLER_POOL_NAME);
      const matches = createChampionshipMatches(seededIds, 'Championnat Aller', CHAMPIONSHIP_ALLER_POOL_NAME, false);
      setChampionshipLeg1({ pools, matches });
      setChampionshipLeg2({ pools: [], matches: [] });
      setSingleKnockout({ quarters: [], semis: [], finals: [] });
      setBrassage1({ pools: [], matches: [] });
      setBrassage2({ pools: [], matches: [] });
      setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
      setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
      setActiveTab('championship');
      return;
    }
    if (readyTeams.length !== TEAM_TARGET) {
      window.alert(`Cette application attend ${TEAM_TARGET} équipes pour le mode standard. Actuellement : ${readyTeams.length}. Pour moins de 10 équipes, un mode Championnat Aller / Retour est utilisé automatiquement.`);
      return;
    }
    const seededIds = sortTeamsForSeeding(readyTeams).map((team) => team.id);
    const pools = createPools(seededIds, createNumberedNames('Brassage 1 - Poule', 6));
    const matches = scheduleBrassageMatches(pools, 'Brassage 1', 0);
    setBrassage1({ pools, matches });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setChampionshipLeg1({ pools: [], matches: [] });
    setChampionshipLeg2({ pools: [], matches: [] });
    setSingleKnockout({ quarters: [], semis: [], finals: [] });
    setActiveTab('brassage1');
  }

  function generateBrassage2() {
    if (!confirmOverwritePlayedMatches([
      ...brassage2.matches,
      ...mainStage.principaleMatches,
      ...mainStage.consolanteMatches,
      ...knockout.principalQuarters,
      ...knockout.principalSemis,
      ...knockout.principalFinals,
      ...knockout.consolanteSemis,
      ...knockout.consolanteFinals,
    ], 'le brassage 2 et les phases suivantes')) return;
    if (isSmallTournamentMode) {
      if (championshipLeg1.matches.length === 0) {
        window.alert('Génère d’abord le Championnat Aller.');
        return;
      }
      if (!confirmOverwritePlayedMatches([
        ...championshipLeg2.matches,
        ...singleKnockout.quarters,
        ...singleKnockout.semis,
        ...singleKnockout.finals,
      ], 'le Championnat Retour et le tableau final')) return;
      const teamIds = championshipLeg1.pools[0]?.teamIds || sortTeamsForSeeding(activeTeams).map((team) => team.id);
      const pools = createChampionshipPool(teamIds, CHAMPIONSHIP_RETOUR_POOL_NAME);
      const matches = createChampionshipMatches(teamIds, 'Championnat Retour', CHAMPIONSHIP_RETOUR_POOL_NAME, true);
      setChampionshipLeg2({ pools, matches });
      setSingleKnockout({ quarters: [], semis: [], finals: [] });
      setActiveTab('championship');
      return;
    }
    if (brassage1.matches.length === 0) {
      window.alert('Génère d’abord le brassage 1.');
      return;
    }
    const rankedIds = rankingAfterBrassage1.map((row) => row.teamId);
    const pools = createPools(rankedIds, createNumberedNames('Brassage 2 - Poule', 6));
    const matches = scheduleBrassageMatches(pools, 'Brassage 2', stageSlotCount(brassage1.matches.length));
    setBrassage2({ pools, matches });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setActiveTab('brassage2');
  }


  function generateSmallKnockoutStage1() {
    if (!confirmOverwritePlayedMatches([
      ...singleKnockout.quarters,
      ...singleKnockout.semis,
      ...singleKnockout.finals,
    ], 'le tableau final du Championnat')) return;
    if (championshipLeg1.matches.length === 0 || championshipLeg2.matches.length === 0) {
      window.alert('Génère d’abord le Championnat Aller et le Championnat Retour.');
      return;
    }
    if (!stageValidation.championnatAllerComplete || !stageValidation.championnatRetourComplete) {
      window.alert('Tous les scores du Championnat Aller et Retour doivent être valides.');
      return;
    }
    const rankedIds = championshipRanking.map((row) => row.teamId);
    if (rankedIds.length >= 5) {
      const quarters = assignSchedule(buildQuarterMatchesFromRanking(rankedIds), stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length));
      setSingleKnockout({ quarters, semis: [], finals: [] });
    } else if (rankedIds.length >= 3) {
      const semis = assignSchedule(buildSemisFromRanking(rankedIds), stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length));
      setSingleKnockout({ quarters: [], semis, finals: [] });
    } else if (rankedIds.length === 2) {
      const finals = assignSchedule([makeKnockoutMatch('Finale', 'Finale', rankedIds[0], rankedIds[1])], stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length));
      setSingleKnockout({ quarters: [], semis: [], finals });
    } else {
      window.alert('Il faut au moins 2 équipes classées pour générer le tableau final.');
      return;
    }
    setActiveTab('finales');
  }

  function generateSmallKnockoutStage2() {
    if (!confirmOverwritePlayedMatches([
      ...singleKnockout.semis,
      ...singleKnockout.finals,
    ], 'les demi-finales et finales du Championnat')) return;
    if (singleKnockout.quarters.length === 0) {
      window.alert('Génère d’abord les quarts de finale.');
      return;
    }
    if (!stageValidation.quarterComplete) {
      window.alert('Tous les scores des quarts de finale doivent être valides.');
      return;
    }
    const rankedIds = championshipRanking.map((row) => row.teamId);
    const semis = assignSchedule(
      buildSemisFromQuarters(rankedIds, singleKnockout.quarters, phaseRules),
      stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length) + stageSlotCount(singleKnockout.quarters.length)
    );
    setSingleKnockout((current) => ({ ...current, semis, finals: [] }));
  }

  function generateSmallKnockoutStage3() {
    if (!confirmOverwritePlayedMatches(singleKnockout.finals, 'la finale du Championnat')) return;
    if (singleKnockout.semis.length === 0) {
      window.alert('Génère d’abord les demi-finales.');
      return;
    }
    if (!stageValidation.semiComplete) {
      window.alert('Tous les scores des demi-finales doivent être valides.');
      return;
    }
    const rankedIds = championshipRanking.map((row) => row.teamId);
    const semiWinners = singleKnockout.semis.map((match) => getWinnerLoser(match, phaseRules).winner);
    if (semiWinners.some((winner) => !winner)) {
      window.alert('Tous les scores des demi-finales doivent être valides.');
      return;
    }
    const finalsRaw = [];
    if (rankedIds.length === 3 && singleKnockout.semis.length === 1) {
      finalsRaw.push(makeKnockoutMatch('Finale', 'Finale', rankedIds[0], semiWinners[0]));
    } else {
      const semi1 = getWinnerLoser(singleKnockout.semis[0], phaseRules);
      const semi2 = getWinnerLoser(singleKnockout.semis[1], phaseRules);
      finalsRaw.push(makeKnockoutMatch('Finale', 'Finale', semi1.winner, semi2.winner));
      if (singleKnockout.semis.length > 1) {
        finalsRaw.unshift(makeKnockoutMatch('Petite finale', 'Petite finale', semi1.loser, semi2.loser));
      }
    }
    const finals = assignSchedule(finalsRaw, stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length) + stageSlotCount(singleKnockout.quarters.length) + stageSlotCount(singleKnockout.semis.length));
    setSingleKnockout((current) => ({ ...current, finals }));
  }

  function generateMainStage() {
    if (!confirmOverwritePlayedMatches([
      ...mainStage.principaleMatches,
      ...mainStage.consolanteMatches,
      ...knockout.principalQuarters,
      ...knockout.principalSemis,
      ...knockout.principalFinals,
      ...knockout.consolanteSemis,
      ...knockout.consolanteFinals,
    ], 'la principale, la consolante et les phases finales')) return;
    if (brassage2.matches.length === 0) {
      window.alert('Génère d’abord le brassage 2.');
      return;
    }
    const rankedIds = rankingAfterBrassages.map((row) => row.teamId);
    const principaleIds = rankedIds.slice(0, 12);
    const consolanteIds = rankedIds.slice(12, 18);
    const principalePools = createPools(principaleIds, PRINCIPALE_POOL_NAMES);
    const consolantePools = createPools(consolanteIds, CONSOLANTE_POOL_NAMES);
    const scheduled = assignSchedule([
      ...principalePools.flatMap((pool) => roundRobinMatches(pool.teamIds, 'Principale', pool.name)),
      ...consolantePools.flatMap((pool) => roundRobinMatches(pool.teamIds, 'Consolante', pool.name)),
    ], stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length));

    setMainStage({
      principalePools,
      principaleMatches: scheduled.filter((match) => match.phase === 'Principale'),
      consolantePools,
      consolanteMatches: scheduled.filter((match) => match.phase === 'Consolante'),
    });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setActiveTab('principale');
  }

  function generateKnockoutStage1() {
    if (!confirmOverwritePlayedMatches([
      ...knockout.principalQuarters,
      ...knockout.principalSemis,
      ...knockout.principalFinals,
      ...knockout.consolanteSemis,
      ...knockout.consolanteFinals,
    ], 'les phases finales')) return;
    if (!mainStage.principalePools.length || !mainStage.consolantePools.length) {
      window.alert('Génère d’abord la principale et la consolante.');
      return;
    }
    const pMap = new Map(principaleStandings.map((entry) => [entry.pool.name, entry.rows]));
    const cMap = new Map(consolanteStandings.map((entry) => [entry.pool.name, entry.rows]));
    const principalQuartersRaw = [
      makeKnockoutMatch('Tableau principal', 'Quart 1', pMap.get('Principale A')?.[0]?.teamId || null, pMap.get('Principale D')?.[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 2', pMap.get('Principale B')?.[0]?.teamId || null, pMap.get('Principale C')?.[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 3', pMap.get('Principale C')?.[0]?.teamId || null, pMap.get('Principale B')?.[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 4', pMap.get('Principale D')?.[0]?.teamId || null, pMap.get('Principale A')?.[1]?.teamId || null),
    ];
    const consolanteSemisRaw = [
      makeKnockoutMatch('Tableau consolante', 'Demi 1', cMap.get('Consolante A')?.[0]?.teamId || null, cMap.get('Consolante B')?.[1]?.teamId || null),
      makeKnockoutMatch('Tableau consolante', 'Demi 2', cMap.get('Consolante B')?.[0]?.teamId || null, cMap.get('Consolante A')?.[1]?.teamId || null),
    ];
    const combined = assignSchedule([...principalQuartersRaw, ...consolanteSemisRaw], stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length));
    setKnockout((current) => ({
      ...current,
      principalQuarters: combined.filter((match) => match.phase === 'Tableau principal'),
      consolanteSemis: combined.filter((match) => match.phase === 'Tableau consolante'),
      principalSemis: [],
      principalFinals: [],
      consolanteFinals: [],
    }));
    setActiveTab('finales');
  }

  function generateKnockoutStage2() {
    if (!confirmOverwritePlayedMatches([
      ...knockout.principalSemis,
      ...knockout.principalFinals,
      ...knockout.consolanteFinals,
    ], 'la suite des phases finales')) return;
    if (knockout.principalQuarters.length === 0 || knockout.consolanteSemis.length === 0) {
      window.alert('Génère d’abord les quarts et les demi-finales de consolante.');
      return;
    }
    const q1 = getWinnerLoser(knockout.principalQuarters[0], phaseRules);
    const q2 = getWinnerLoser(knockout.principalQuarters[1], phaseRules);
    const q3 = getWinnerLoser(knockout.principalQuarters[2], phaseRules);
    const q4 = getWinnerLoser(knockout.principalQuarters[3], phaseRules);
    const c1 = getWinnerLoser(knockout.consolanteSemis[0], phaseRules);
    const c2 = getWinnerLoser(knockout.consolanteSemis[1], phaseRules);
    if (!q1.winner || !q2.winner || !q3.winner || !q4.winner || !c1.winner || !c2.winner) {
      window.alert('Renseigne d’abord des scores valides pour les quarts et les demi-finales de consolante.');
      return;
    }
    const principalSemisRaw = [
      makeKnockoutMatch('Tableau principal', 'Demi 1', q1.winner, q2.winner),
      makeKnockoutMatch('Tableau principal', 'Demi 2', q3.winner, q4.winner),
    ];
    const consolanteFinalsRaw = [
      makeKnockoutMatch('Tableau consolante', 'Petite finale', c1.loser, c2.loser),
      makeKnockoutMatch('Tableau consolante', 'Finale', c1.winner, c2.winner),
    ];
    const startSlot = stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length) + stageSlotCount(knockout.principalQuarters.length + knockout.consolanteSemis.length);
    const combined = assignSchedule([...principalSemisRaw, ...consolanteFinalsRaw], startSlot);
    setKnockout((current) => ({
      ...current,
      principalSemis: combined.filter((match) => match.phase === 'Tableau principal'),
      consolanteFinals: combined.filter((match) => match.phase === 'Tableau consolante'),
      principalFinals: [],
    }));
  }

  function generatePrincipalFinals() {
    if (!confirmOverwritePlayedMatches(knockout.principalFinals, 'la finale principale')) return;
    if (knockout.principalSemis.length === 0) {
      window.alert('Génère d’abord les demi-finales principales.');
      return;
    }
    const s1 = getWinnerLoser(knockout.principalSemis[0], phaseRules);
    const s2 = getWinnerLoser(knockout.principalSemis[1], phaseRules);
    if (!s1.winner || !s2.winner) {
      window.alert('Renseigne d’abord des scores valides pour les demi-finales principales.');
      return;
    }
    const finalsRaw = [
      makeKnockoutMatch('Tableau principal', 'Petite finale', s1.loser, s2.loser),
      makeKnockoutMatch('Tableau principal', 'Finale', s1.winner, s2.winner),
    ];
    const startSlot = stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length) + stageSlotCount(knockout.principalQuarters.length + knockout.consolanteSemis.length) + stageSlotCount(knockout.principalSemis.length + knockout.consolanteFinals.length);
    setKnockout((current) => ({ ...current, principalFinals: assignSchedule(finalsRaw, startSlot) }));
  }

  function updateMatchesInScope(scope, updater) {
    if (scope === 'championshipLeg1') return setChampionshipLeg1((current) => ({ ...current, matches: updater(current.matches) }));
    if (scope === 'championshipLeg2') return setChampionshipLeg2((current) => ({ ...current, matches: updater(current.matches) }));
    if (scope === 'quarters') return setSingleKnockout((current) => ({ ...current, quarters: updater(current.quarters) }));
    if (scope === 'semis') return setSingleKnockout((current) => ({ ...current, semis: updater(current.semis) }));
    if (scope === 'finals') return setSingleKnockout((current) => ({ ...current, finals: updater(current.finals) }));
    if (scope === 'brassage1') return setBrassage1((current) => ({ ...current, matches: updater(current.matches) }));
    if (scope === 'brassage2') return setBrassage2((current) => ({ ...current, matches: updater(current.matches) }));
    if (scope === 'principale') return setMainStage((current) => ({ ...current, principaleMatches: updater(current.principaleMatches) }));
    if (scope === 'consolante') return setMainStage((current) => ({ ...current, consolanteMatches: updater(current.consolanteMatches) }));
    if (scope === 'principalQuarters') return setKnockout((current) => ({ ...current, principalQuarters: updater(current.principalQuarters) }));
    if (scope === 'principalSemis') return setKnockout((current) => ({ ...current, principalSemis: updater(current.principalSemis) }));
    if (scope === 'principalFinals') return setKnockout((current) => ({ ...current, principalFinals: updater(current.principalFinals) }));
    if (scope === 'consolanteSemis') return setKnockout((current) => ({ ...current, consolanteSemis: updater(current.consolanteSemis) }));
    return setKnockout((current) => ({ ...current, consolanteFinals: updater(current.consolanteFinals) }));
  }

  function getPendingMatchSnapshot(match) {
    return {
      ...match,
      scoreA: match.submittedScoreA,
      scoreB: match.submittedScoreB,
    };
  }

  function getPendingStatus(match) {
    const pendingA = toNumber(match.submittedScoreA);
    const pendingB = toNumber(match.submittedScoreB);
    if (pendingA === null || pendingB === null) return 'Aucun';
    return isMatchResultValid(getPendingMatchSnapshot(match), phaseRules) ? 'À valider' : 'Saisie arbitre invalide';
  }

  function updateOfficialMatchScore(scope, matchId, field, value) {
    const normalized = value === '' ? '' : Math.max(0, Number(value));
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      const updated = {
        ...match,
        [field]: normalized,
        submittedScoreA: '',
        submittedScoreB: '',
        submittedAt: null,
      };
      updated.validatedAt = isMatchResultValid(updated, phaseRules) ? new Date().toISOString() : null;
      return updated;
    }));
  }

  function updateRefereeMatchScore(scope, matchId, field, value) {
    const normalized = value === '' ? '' : Math.max(0, Number(value));
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRules) === 'Valide') return match;
      return {
        ...match,
        [field]: match[field],
        [field === 'scoreA' ? 'submittedScoreA' : 'submittedScoreB']: normalized,
        submittedAt: new Date().toISOString(),
      };
    }));
  }

  function approveRefereeScore(scope, matchId) {
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      const approved = {
        ...match,
        scoreA: match.submittedScoreA,
        scoreB: match.submittedScoreB,
        submittedScoreA: '',
        submittedScoreB: '',
        submittedAt: null,
      };
      approved.validatedAt = isMatchResultValid(approved, phaseRules) ? new Date().toISOString() : null;
      return approved;
    }));
  }

  function rejectRefereeScore(scope, matchId) {
    updateMatchesInScope(scope, (matches) => matches.map((match) => (
      match.id === matchId
        ? { ...match, submittedScoreA: '', submittedScoreB: '', submittedAt: null }
        : match
    )));
  }

  function formatExportFilename() {
    const sourceDate = new Date();
    const stamp = `${sourceDate.getFullYear()}-${String(sourceDate.getMonth() + 1).padStart(2, '0')}-${String(sourceDate.getDate()).padStart(2, '0')}_${String(sourceDate.getHours()).padStart(2, '0')}-${String(sourceDate.getMinutes()).padStart(2, '0')}-${String(sourceDate.getSeconds()).padStart(2, '0')}`;
    const slug = String(tournamentName || 'tournoi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'tournoi';
    return `${slug}_${stamp}.json`;
  }

  function exportState() {
    const savedAt = new Date().toISOString();
    setLastSavedAt(savedAt);
    downloadJson(formatExportFilename(), getPersistedState(savedAt));
  }

  async function copyState() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getPersistedState(), null, 2));
      window.alert('Configuration copiée dans le presse-papiers.');
    } catch {
      window.alert('Copie non disponible dans ce navigateur.');
    }
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.teams)) setTeams(parsed.teams);
        if (parsed.settings?.startTime) setStartTime(parsed.settings.startTime);
        if (parsed.settings?.slotDuration) setSlotDuration(parsed.settings.slotDuration);
        if (parsed.settings?.phaseRules) setPhaseRules({ ...DEFAULT_PHASE_RULES, ...(parsed.settings.phaseRules || {}) });
        if (parsed.settings?.organizerPassword) {
          setOrganizerPassword(parsed.settings.organizerPassword);
          setPasswordDraft(parsed.settings.organizerPassword);
        }
        if (parsed.settings?.tournamentName) setTournamentName(parsed.settings.tournamentName);
        if (parsed.meta?.lastSavedAt) setLastSavedAt(parsed.meta.lastSavedAt);
        if (parsed.brassage1) setBrassage1(parsed.brassage1);
        if (parsed.brassage2) setBrassage2(parsed.brassage2);
        if (parsed.mainStage) setMainStage(parsed.mainStage);
        if (parsed.knockout) setKnockout(parsed.knockout);
        if (parsed.championshipLeg1) setChampionshipLeg1(parsed.championshipLeg1);
        if (parsed.championshipLeg2) setChampionshipLeg2(parsed.championshipLeg2);
        if (parsed.singleKnockout) setSingleKnockout(parsed.singleKnockout);
        window.alert('Import réussi.');
      } catch {
        window.alert('Le fichier JSON est invalide.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  function renderStandings(cards) {
    if (!cards.length) return <div className="empty-state">Aucun classement disponible pour le moment.</div>;
    return (
      <div className="cards-grid three-up">
        {cards.map(({ pool, rows }) => (
          <div key={pool.id} className="mini-card">
            <div className="mini-card-head">{pool.name}</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Équipe</th>
                    <th>J</th>
                    <th>V</th>
                    <th>Pts T.</th>
                    <th>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.teamId}>
                      <td>{index + 1}</td>
                      <td>{renderTeamBadge(row.teamId)}</td>
                      <td>{row.played}</td>
                      <td>{row.wins}</td>
                      <td>{row.tournamentPoints}</td>
                      <td>{row.pointDiff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderOrganizerMatches(matches, scope, groupLabel = 'Match') {
    if (!matches.length) return <div className="empty-state">Aucun match généré pour le moment.</div>;
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="time-header-cell">Heure</th>
              <th className="court-header-cell">Terrain</th>
              <th>{groupLabel}</th>
              <th className="team-col-header">Équipe A</th>
              <th className="score-header-cell">Score officiel</th>
              <th className="team-col-header">Équipe B</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const status = getMatchStatusLabel(match, phaseRules);
              const pendingStatus = getPendingStatus(match);
              const schedule = scheduleData.scheduleMap[match.id];
              return (
                <tr key={match.id} className={status === 'Score invalide' || pendingStatus === 'Saisie arbitre invalide' ? 'row-invalid' : ''}>
                  <td className="time-cell">{schedule?.startText || match.time}</td>
                  <td className="court-cell">Terrain {match.court}</td>
                  <td>{formatGroupDisplay(match.group)}</td>
                  <td className="team-col-cell team-col-cell-a">{renderTeamBadge(match.teamAId)}</td>
                  <td className="score-cell">
                    <div className="score-inputs">
                      <input type="number" min="0" value={match.scoreA} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreA', e.target.value)} />
                      <span>-</span>
                      <input type="number" min="0" value={match.scoreB} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreB', e.target.value)} />
                    </div>
                  </td>
                  <td className="team-col-cell team-col-cell-b">{renderTeamBadge(match.teamBId)}</td>
                  <td>
                    <div className="status-cell">
                      <span className={`badge ${status === 'Valide' ? 'badge-success' : status === 'Score invalide' ? 'badge-danger' : 'badge-neutral'}`}>{status}</span>
                      {pendingStatus === 'À valider' ? (
                        <>
                          <span className="badge badge-warning">À valider</span>
                          <span className="muted tiny">Saisie arbitre : {match.submittedScoreA} - {match.submittedScoreB}</span>
                          <div className="actions-row compact-actions">
                            <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                            <Button variant="secondary" onClick={() => rejectRefereeScore(scope, match.id)}>Refuser</Button>
                          </div>
                        </>
                      ) : null}
                      {pendingStatus === 'Saisie arbitre invalide' ? (
                        <>
                          <span className="badge badge-danger">Saisie arbitre invalide</span>
                          <span className="muted tiny">Saisie arbitre : {match.submittedScoreA} - {match.submittedScoreB}</span>
                          <div className="actions-row compact-actions">
                            <Button variant="secondary" onClick={() => rejectRefereeScore(scope, match.id)}>Effacer</Button>
                          </div>
                        </>
                      ) : null}
                      {schedule ? <span className="muted tiny">Fin prévue : {schedule.endText}</span> : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function renderRefereeSelectedMatch(entry) {
    if (!entry?.match) return null;
    const { scope, title, match } = entry;
    const schedule = scheduleData.scheduleMap[match.id];
    const pendingStatus = getPendingStatus(match);
    const officialStatus = getMatchStatusLabel(match, phaseRules);
    const isLocked = officialStatus === 'Valide';
    const displayScoreA = isLocked ? (match.scoreA ?? '') : (match.submittedScoreA ?? '');
    const displayScoreB = isLocked ? (match.scoreB ?? '') : (match.submittedScoreB ?? '');
    const badgeClass = isLocked ? 'badge-success' : pendingStatus === 'À valider' ? 'badge-warning' : pendingStatus === 'Saisie arbitre invalide' ? 'badge-danger' : 'badge-neutral';
    const badgeText = isLocked ? 'Valide' : pendingStatus === 'Aucun' ? 'À saisir' : pendingStatus;

    return (
      <div className="referee-focus-card">
        <div className="referee-focus-head">
          <div>
            <div className="muted small">{title}</div>
            <h2>{renderTeamBadge(match.teamAId, 'team-name-chip-large')} <span className="muted">vs</span> {renderTeamBadge(match.teamBId, 'team-name-chip-large')}</h2>
            <p className="muted">{match.group} • Terrain {match.court} • Début prévu : {schedule?.startText || match.time}</p>
          </div>
          <div className="actions-row">
            <Button variant="secondary" onClick={() => setRefereeSelectedMatch(null)}>Choisir un autre match</Button>
          </div>
        </div>

        <div className="referee-focus-body">
          <div className="referee-team-card">
            <span className="muted small">Équipe A</span>
            {renderTeamBadge(match.teamAId, 'team-name-chip-large block-chip')}
          </div>
          <div className="referee-big-score">
            {isLocked ? (
              <div className="score-readonly score-readonly-large">
                <span className="score-chip score-chip-large">{displayScoreA === '' ? '-' : displayScoreA}</span>
                <span className="score-separator">-</span>
                <span className="score-chip score-chip-large">{displayScoreB === '' ? '-' : displayScoreB}</span>
              </div>
            ) : (
              <div className="score-inputs score-inputs-large">
                <input type="number" min="0" value={displayScoreA} onChange={(e) => updateRefereeMatchScore(scope, match.id, 'scoreA', e.target.value)} />
                <span className="score-separator">-</span>
                <input type="number" min="0" value={displayScoreB} onChange={(e) => updateRefereeMatchScore(scope, match.id, 'scoreB', e.target.value)} />
              </div>
            )}
            <div className="status-cell center-status">
              <span className={`badge ${badgeClass}`}>{badgeText}</span>
              {isLocked ? <span className="muted tiny">Match verrouillé : déjà validé par l’organisateur</span> : <span className="muted tiny">La saisie arbitre sera proposée à validation à l’organisateur</span>}
            </div>
          </div>
          <div className="referee-team-card">
            <span className="muted small">Équipe B</span>
            {renderTeamBadge(match.teamBId, 'team-name-chip-large block-chip')}
          </div>
        </div>
      </div>
    );
  }

  function renderOverallRanking(rows, withStatus = false) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Équipe</th>
              <th>Niveau</th>
              <th>J</th>
              <th>V</th>
              <th>Pts T.</th>
              <th>Diff</th>
              {withStatus ? <th>Statut</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.teamId}>
                <td>{index + 1}</td>
                <td>{renderTeamBadge(row.teamId)}</td>
                <td><span className={`team-level-pill ${getLevelClass(row.level)}`}>{row.level}</span></td>
                <td>{row.played}</td>
                <td>{row.wins}</td>
                <td>{row.tournamentPoints}</td>
                <td>{row.pointDiff}</td>
                {withStatus ? <td>{index < 12 ? 'Principale' : 'Consolante'}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderPodium(title, matches) {
    const finalMatch = matches.find((match) => match.group === 'Finale');
    const smallFinal = matches.find((match) => match.group === 'Petite finale');
    const finalResult = finalMatch ? getWinnerLoser(finalMatch, phaseRules) : { winner: null, loser: null };
    const smallResult = smallFinal ? getWinnerLoser(smallFinal, phaseRules) : { winner: null, loser: null };
    return (
      <div className="mini-card">
        <div className="mini-card-head">{title}</div>
        <div className="podium-grid">
          <div className="podium-item"><strong>1er</strong><span>{finalResult.winner ? renderTeamBadge(finalResult.winner) : 'À venir'}</span></div>
          <div className="podium-item"><strong>2e</strong><span>{finalResult.loser ? renderTeamBadge(finalResult.loser) : 'À venir'}</span></div>
          <div className="podium-item"><strong>3e</strong><span>{smallResult.winner ? renderTeamBadge(smallResult.winner) : 'À venir'}</span></div>
        </div>
      </div>
    );
  }

  function renderOrganizerLoginCard() {
    return (
      <section className="login-card">
        <h2>Accès organisateur</h2>
        <p className="muted">Saisis le mot de passe organisateur pour déverrouiller le mode organisateur.</p>
        <form className="login-grid" onSubmit={(e) => { e.preventDefault(); handleOrganizerLogin(); }}>
          <input type="password" value={organizerAttempt} onChange={(e) => setOrganizerAttempt(e.target.value)} placeholder="Mot de passe" />
          <Button type="submit" variant="primary">Déverrouiller</Button>
          <Button type="button" variant="secondary" onClick={() => { setShowOrganizerLogin(false); setOrganizerAttempt(''); setLoginError(''); }}>Annuler</Button>
        </form>
        {loginError ? <div className="error-text">{loginError}</div> : null}
      </section>
    );
  }

  const tabs = isSmallTournamentMode ? [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'championship', label: 'Championnat' },
    { id: 'finales', label: 'Phases finales' },
    { id: 'public', label: 'Affichage public' },
    { id: 'export', label: 'Sauvegarde' },
  ] : [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'brassage1', label: 'Brassage 1' },
    { id: 'brassage2', label: 'Brassage 2' },
    { id: 'principale', label: 'Principale / Consolante' },
    { id: 'finales', label: 'Phases finales' },
    { id: 'public', label: 'Affichage public' },
    { id: 'export', label: 'Sauvegarde' },
  ];


  if (mode === 'public') {
    return (
      <div className="public-page">
        <div className="container">
          <header className="hero public-hero public-hero-light">
            <div>
              <div className="hero-brand">
                <div className="hero-tag hero-tag-dark">tournoidevolley.fr</div>
                <div className="hero-version hero-version-dark">Version {APP_VERSION}</div>
              </div>
              <h1>{tournamentName}</h1>
            </div>
            <div className="hero-controls">
              <div className="hero-pill public-pill-light">
                <span>Fin estimée du tournoi</span>
                <strong>{estimatedTournamentEnd}</strong>
              </div>
              <div className="actions-stack">
                <Button variant="primary" onClick={requestOrganizerMode}>Accès organisateur</Button>
                <Button variant="success" onClick={enterRefereeMode}>Mode arbitres</Button>
              </div>
            </div>
          </header>

          {showOrganizerLogin ? renderOrganizerLoginCard() : null}

          <div className="cards-grid three-up">
            {nextMatches.map((match, index) => (
              <LargePublicMatch key={match.id} title={`Prochain match ${index + 1}`} match={match} teamName={teamName} renderTeamBadge={renderTeamBadge} />
            ))}
          </div>

          <div className="stack-gap">
            <Section title="Classement cumulé" subtitle="Tous les matchs officiels valides sont pris en compte.">
              {renderOverallRanking(overallRanking)}
            </Section>
            <Section title="Podiums" subtitle="Les podiums s’affichent dès que les finales sont validées par l’organisateur.">
              <div className="cards-grid two-up">
                {renderPodium('Tableau principal', knockout.principalFinals)}
                {renderPodium('Tableau consolante', knockout.consolanteFinals)}
              </div>
            </Section>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'referee') {
    return (
      <div className="referee-page">
        <div className="container">
          <header className="hero referee-hero">
            <div>
              <div className="hero-brand">
                <div className="hero-tag">tournoidevolley.fr</div>
                <div className="hero-version">Version {APP_VERSION}</div>
              </div>
              <h1>{tournamentName} — mode arbitres</h1>
              <p>{isSmallTournamentMode ? 'Sélectionne un match du Championnat ou du tableau final unique pour saisir les scores.' : 'Sélectionne un match pour saisir les scores. Dès qu’un score officiel est validé, il reste visible mais il ne peut plus être modifié en mode arbitres.'}</p>
            </div>
            <div className="hero-controls">
              <div className="hero-pill">
                <span>Fin estimée du tournoi</span>
                <strong>{estimatedTournamentEnd}</strong>
              </div>
              <div className="actions-stack">
                <Button variant="secondary" onClick={enterPublicMode}>Retour à l’affichage public</Button>
                <Button variant="primary" onClick={requestOrganizerMode}>Accès organisateur</Button>
              </div>
            </div>
          </header>

          {showOrganizerLogin ? renderOrganizerLoginCard() : null}

          <div className="stack-gap">
            {refereeSelectedEntry ? (
              <Section title="Saisie arbitre" subtitle="Le match sélectionné s’affiche seul pour faciliter la saisie des scores.">
                {renderRefereeSelectedMatch(refereeSelectedEntry)}
              </Section>
            ) : (
              <Section title="Choisir un match" subtitle="Sélectionne le match à saisir. Les autres matchs seront masqués tant qu’un match est ouvert.">
                <div className="referee-selector-grid">
                  {refereeMatchGroups.filter((group) => group.matches.length > 0).map((group) => (
                    <div key={group.scope} className="mini-card">
                      <div className="mini-card-head">{group.title}</div>
                      {!group.isUnlocked ? <div className="referee-lock-note">{group.lockReason}</div> : null}
                      <div className="referee-selector-list">
                        {group.matches.map((match) => {
                          const schedule = scheduleData.scheduleMap[match.id];
                          const pendingStatus = getPendingStatus(match);
                          const officialStatus = getMatchStatusLabel(match, phaseRules);
                          const statusText = officialStatus === 'Valide' ? 'Valide' : pendingStatus === 'Aucun' ? 'À saisir' : pendingStatus;
                          const badgeClass = officialStatus === 'Valide' ? 'badge-success' : pendingStatus === 'À valider' ? 'badge-warning' : pendingStatus === 'Saisie arbitre invalide' ? 'badge-danger' : 'badge-neutral';
                          return (
                            <button
                              key={match.id}
                              className={`referee-selector-item ${group.isUnlocked ? '' : 'referee-selector-item-disabled'}`}
                              onClick={() => group.isUnlocked && setRefereeSelectedMatch({ scope: group.scope, matchId: match.id })}
                              disabled={!group.isUnlocked}
                              title={group.isUnlocked ? '' : group.lockReason}
                            >
                              <div>
                                <strong>{renderTeamBadge(match.teamAId)} <span className="muted">vs</span> {renderTeamBadge(match.teamBId)}</strong>
                                <div className="muted tiny">{match.group} • Terrain {match.court} • {schedule?.startText || match.time}</div>
                              </div>
                              <span className={`badge ${group.isUnlocked ? badgeClass : 'badge-neutral'}`}>{group.isUnlocked ? statusText : 'Verrouillé'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero">
          <div>
            <div className="hero-brand">
              <div className="hero-tag">tournoidevolley.fr</div>
              <div className="hero-version">Version {APP_VERSION}</div>
            </div>
            <h1>{tournamentName}</h1>
            <RefereeQrCode url={refereeAccessUrl} />
          </div>
          <div className="hero-controls">
            <label>
              <span>Début</span>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <div className="hero-pill">
              <span>Fin estimée du tournoi</span>
              <strong>{estimatedTournamentEnd}</strong>
            </div>
            <div className="actions-stack">
              <Button variant="success" onClick={() => saveTournamentState(true)}>Sauvegarder</Button>
              <Button variant="secondary" onClick={enterRefereeMode}>Mode arbitres</Button>
              <Button variant="secondary" onClick={enterPublicMode}>Affichage public</Button>
              <Button variant="danger" onClick={lockOrganizerMode}>Verrouiller</Button>
            </div>
            {lastSavedAt ? <div className="muted small">Dernière sauvegarde locale : {new Date(lastSavedAt).toLocaleString('fr-FR')}</div> : null}
          </div>
        </header>

        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => {
                if (tab.id === 'public') {
                  enterPublicMode();
                } else {
                  setActiveTab(tab.id);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="stack-gap">
          {activeTab === 'dashboard' && (
            <>
              <div className="cards-grid six-up">
                <StatCard label="Équipes" value={teams.length} subvalue={isSmallTournamentMode ? 'Mode Championnat Aller / Retour' : 'Cible : 18'} />
                {isSmallTournamentMode ? (
                  <>
                    <StatCard label="Championnat Aller" value={`${completedMatchCounts.championnatAller}/${championshipLeg1.matches.length || 0}`} subvalue="Toutes les équipes" />
                    <StatCard label="Championnat Retour" value={`${completedMatchCounts.championnatRetour}/${championshipLeg2.matches.length || 0}`} subvalue="Matchs retour" />
                    <StatCard label="Quarts" value={`${completedMatchCounts.quart}/${singleKnockout.quarters.length || 0}`} subvalue="Si 5 à 8 équipes" />
                    <StatCard label="Demies" value={`${completedMatchCounts.demi}/${singleKnockout.semis.length || 0}`} subvalue="Tableau final" />
                    <StatCard label="Leader" value={championshipRanking[0]?.teamName || '-'} subvalue={`${championshipRanking[0]?.tournamentPoints ?? 0} pts`} />
                  </>
                ) : (
                  <>
                    <StatCard label="Brassage 1" value={`${completedMatchCounts.b1}/${brassage1.matches.length || 0}`} subvalue="6 poules de 3" />
                    <StatCard label="Brassage 2" value={`${completedMatchCounts.b2}/${brassage2.matches.length || 0}`} subvalue="6 poules de 3" />
                    <StatCard label="Principale" value={`${completedMatchCounts.principale}/${mainStage.principaleMatches.length || 0}`} subvalue="4 poules de 3" />
                    <StatCard label="Consolante" value={`${completedMatchCounts.consolante}/${mainStage.consolanteMatches.length || 0}`} subvalue="2 poules de 3" />
                    <StatCard label="Leader" value={rankingAfterBrassages[0]?.teamName || '-'} subvalue={`${rankingAfterBrassages[0]?.tournamentPoints ?? 0} pts`} />
                  </>
                )}
              </div>

              <Section title="Paramètres de score par phase" subtitle="Chaque phase dispose de son score gagnant et de son contexte de validation.">
                <div className="cards-grid two-up">
                  {isSmallTournamentMode ? (
                    <>
                      <PhaseRuleEditor title="Championnat Aller" value={phaseRules.championnatAller} onScoreChange={(value) => updatePhaseRule('championnatAller', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('championnatAller', 'mode', value)} />
                      <PhaseRuleEditor title="Championnat Retour" value={phaseRules.championnatRetour} onScoreChange={(value) => updatePhaseRule('championnatRetour', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('championnatRetour', 'mode', value)} />
                      <PhaseRuleEditor title="Quart de finale" value={phaseRules.quart} onScoreChange={(value) => updatePhaseRule('quart', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('quart', 'mode', value)} />
                      <PhaseRuleEditor title="Demi-finale" value={phaseRules.demi} onScoreChange={(value) => updatePhaseRule('demi', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('demi', 'mode', value)} />
                      <PhaseRuleEditor title="Finale" value={phaseRules.finale} onScoreChange={(value) => updatePhaseRule('finale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('finale', 'mode', value)} />
                      <PhaseRuleEditor title="Petite finale" value={phaseRules.petiteFinale} onScoreChange={(value) => updatePhaseRule('petiteFinale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('petiteFinale', 'mode', value)} />
                    </>
                  ) : (
                    <>
                      <PhaseRuleEditor title="Brassage 1" value={phaseRules.brassage1} onScoreChange={(value) => updatePhaseRule('brassage1', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('brassage1', 'mode', value)} />
                      <PhaseRuleEditor title="Brassage 2" value={phaseRules.brassage2} onScoreChange={(value) => updatePhaseRule('brassage2', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('brassage2', 'mode', value)} />
                      <PhaseRuleEditor title="Principale" value={phaseRules.principale} onScoreChange={(value) => updatePhaseRule('principale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('principale', 'mode', value)} />
                      <PhaseRuleEditor title="Consolante" value={phaseRules.consolante} onScoreChange={(value) => updatePhaseRule('consolante', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('consolante', 'mode', value)} />
                    </>
                  )}
                </div>
              </Section>

              <Section title="Flux du tournoi" subtitle={isSmallTournamentMode ? 'Pour moins de 10 équipes : Championnat Aller, Championnat Retour puis tableau final sans huitièmes.' : 'Mode standard à 18 équipes avec brassages, principale, consolante et phases finales.'} right={isSmallTournamentMode ? <><Button onClick={generateBrassage1}>1. Générer Aller</Button><Button variant="secondary" onClick={generateBrassage2}>2. Générer Retour</Button><Button variant="success" onClick={generateSmallKnockoutStage1}>3. Générer tableau final</Button></> : <><Button onClick={generateBrassage1}>1. Générer brassage 1</Button><Button variant="secondary" onClick={generateBrassage2}>2. Générer brassage 2</Button><Button variant="success" onClick={generateMainStage}>3. Générer principale / consolante</Button></>}>
                <div className="cards-grid two-up">
                  <div className="mini-card"><div className="mini-card-head">Fin estimée du tournoi</div><p className="muted">{estimatedTournamentEnd}</p></div>
                  <div className="mini-card"><div className="mini-card-head">Classement général</div>{renderOverallRanking(isSmallTournamentMode ? championshipRanking : overallRanking)}</div>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'equipes' && (
            <Section title="Équipes" subtitle="N = 5, NP = 4, R = 3, D = 2, L = 1. Le brassage 1 s’appuie sur ce niveau pour faire les têtes de série." right={<><Button variant="secondary" onClick={addTeam}>Ajouter</Button><Button onClick={generateBrassage1}>Générer brassage 1</Button></>}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom</th>
                      <th>Niveau</th>
                      <th>Club</th>
                      <th>Contact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamsSortedByLevel.map((team, index) => (
                      <tr key={team.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className={`team-name-chip team-input-chip ${getLevelClass(team.level)}`}>
                            <input value={team.name} onChange={(e) => updateTeam(team.id, 'name', e.target.value)} aria-label={`Nom ${team.name || index + 1}`} />
                          </div>
                        </td>
                        <td>
                          <select value={team.level} onChange={(e) => updateTeam(team.id, 'level', e.target.value)}>
                            {LEVEL_DISPLAY_ORDER.map((level) => <option key={level} value={level}>{level}</option>)}
                          </select>
                        </td>
                        <td><input value={team.club} onChange={(e) => updateTeam(team.id, 'club', e.target.value)} /></td>
                        <td><input value={team.contact} onChange={(e) => updateTeam(team.id, 'contact', e.target.value)} /></td>
                        <td><Button variant="danger" onClick={() => removeTeam(team.id)}>Supprimer</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}


          {activeTab === 'championship' && isSmallTournamentMode && (
            <>
              <Section title="Championnat Aller" subtitle="Toutes les équipes se rencontrent une première fois pour construire le classement général." right={<Button onClick={generateBrassage2}>Générer le Championnat Retour</Button>}>
                {renderStandings(championshipLeg1Standings)}
              </Section>
              <Section title="Matchs du Championnat Aller">{renderOrganizerMatches(championshipLeg1.matches, 'championshipLeg1', 'Poule')}</Section>
              <Section title="Championnat Retour" subtitle="Toutes les équipes se rencontrent une seconde fois. Le classement cumule l’aller et le retour." right={<Button onClick={generateSmallKnockoutStage1}>Générer tableau final</Button>}>
                {renderStandings(championshipLeg2Standings)}
              </Section>
              <Section title="Matchs du Championnat Retour">{renderOrganizerMatches(championshipLeg2.matches, 'championshipLeg2', 'Poule')}</Section>
              <Section title="Classement général Aller + Retour" subtitle="Utilisé pour construire directement les quarts, les demi-finales ou la finale selon le nombre d’équipes.">
                {renderOverallRanking(championshipRanking)}
              </Section>
            </>
          )}

          {activeTab === 'brassage1' && !isSmallTournamentMode && (
            <>
              <Section title="Brassage 1" subtitle="6 poules de 3 construites selon le niveau des équipes. Poules 1-2 sur le terrain 1, 3-4 sur le terrain 2, 5-6 sur le terrain 3, avec alternance des matchs pour réduire l’attente avant le deuxième match." right={<Button onClick={generateBrassage2}>Générer brassage 2</Button>}>
                {renderStandings(brassage1Standings)}
              </Section>
              <Section title="Matchs du brassage 1">{renderOrganizerMatches(brassage1.matches, 'brassage1', 'Poule')}</Section>
              <Section title="Classement général du brassage 1" subtitle="Utilisé pour créer le brassage 2.">
                {renderOverallRanking(rankingAfterBrassage1)}
              </Section>
            </>
          )}

          {activeTab === 'brassage2' && !isSmallTournamentMode && (
            <>
              <Section title="Brassage 2" subtitle="6 poules de 3 construites selon les points du brassage 1. Poules 1-2 sur le terrain 1, 3-4 sur le terrain 2, 5-6 sur le terrain 3, avec alternance des matchs pour réduire l’attente avant le deuxième match." right={<Button onClick={generateMainStage}>Générer principale / consolante</Button>}>
                {renderStandings(brassage2Standings)}
              </Section>
              <Section title="Matchs du brassage 2">{renderOrganizerMatches(brassage2.matches, 'brassage2', 'Poule')}</Section>
              <Section title="Classement cumulé brassage 1 + brassage 2" subtitle="Les 12 premiers vont en principale, les 6 autres en consolante.">
                {renderOverallRanking(rankingAfterBrassages, true)}
              </Section>
            </>
          )}

          {activeTab === 'principale' && !isSmallTournamentMode && (
            <>
              <Section title="Poules principale" subtitle="4 poules de 3 issues des 12 meilleures équipes, avec méthode serpent.">
                {renderStandings(principaleStandings)}
              </Section>
              <Section title="Matchs de la principale">{renderOrganizerMatches(mainStage.principaleMatches, 'principale', 'Poule')}</Section>
              <Section title="Poules consolante" subtitle="2 poules de 3 issues des 6 équipes restantes, avec méthode serpent." right={<Button variant="success" onClick={generateKnockoutStage1}>Générer quarts / demies</Button>}>
                {renderStandings(consolanteStandings)}
              </Section>
              <Section title="Matchs de la consolante">{renderOrganizerMatches(mainStage.consolanteMatches, 'consolante', 'Poule')}</Section>
            </>
          )}

          {activeTab === 'finales' && (
            <>
              {isSmallTournamentMode ? (
                <>
                  <Section title="Quarts de finale" subtitle="Générés uniquement si le nombre d’équipes classées est compris entre 5 et 8." right={<><Button onClick={generateSmallKnockoutStage1}>Regénérer le premier tour</Button><Button variant="success" onClick={generateSmallKnockoutStage2}>Générer les demi-finales</Button></>}>
                    {renderOrganizerMatches(singleKnockout.quarters, 'quarters')}
                  </Section>

                  <Section title="Demi-finales" subtitle="Créées directement pour 3 ou 4 équipes, ou après les quarts pour 5 à 8 équipes." right={<Button variant="success" onClick={generateSmallKnockoutStage3}>Générer la finale et la petite finale</Button>}>
                    {renderOrganizerMatches(singleKnockout.semis, 'semis')}
                  </Section>

                  <Section title="Finale et petite finale" subtitle="Dernière étape du tournoi.">
                    {renderOrganizerMatches(singleKnockout.finals, 'finals')}
                  </Section>

                  <Section title="Podium" subtitle="Le podium s’affiche dès que la finale est validée.">
                    <div className="cards-grid two-up">
                      {renderPodium('Tournoi', singleKnockout.finals)}
                    </div>
                  </Section>
                </>
              ) : (
                <>
                  <Section title="Étape 1 des tableaux finaux" subtitle="Principale : quarts de finale. Consolante : demi-finales." right={<><Button onClick={generateKnockoutStage1}>Regénérer</Button><Button variant="success" onClick={generateKnockoutStage2}>Générer demies principale + finales consolante</Button></>}>
                    <div className="cards-grid two-up">
                      <div>
                        <h3>Quarts de finale principale</h3>
                        {renderOrganizerMatches(knockout.principalQuarters, 'principalQuarters')}
                      </div>
                      <div>
                        <h3>Demi-finales consolante</h3>
                        {renderOrganizerMatches(knockout.consolanteSemis, 'consolanteSemis')}
                      </div>
                    </div>
                  </Section>

                  <Section title="Étape 2 des tableaux finaux" subtitle="Principale : demi-finales. Consolante : finale et petite finale." right={<Button variant="success" onClick={generatePrincipalFinals}>Générer finale principale</Button>}>
                    <div className="cards-grid two-up">
                      <div>
                        <h3>Demi-finales principale</h3>
                        {renderOrganizerMatches(knockout.principalSemis, 'principalSemis')}
                      </div>
                      <div>
                        <h3>Finales consolante</h3>
                        {renderOrganizerMatches(knockout.consolanteFinals, 'consolanteFinals')}
                      </div>
                    </div>
                  </Section>

                  <Section title="Étape 3 du tableau principal" subtitle="Finale et petite finale pour déterminer les 3 premières équipes du tournoi.">
                    {renderOrganizerMatches(knockout.principalFinals, 'principalFinals')}
                  </Section>

                  <Section title="Podiums" subtitle="Le podium principal donne les places 1 à 3 du tournoi. Le podium consolante donne les places 1 à 3 de la consolante.">
                    <div className="cards-grid two-up">
                      {renderPodium('Tableau principal', knockout.principalFinals)}
                      {renderPodium('Tableau consolante', knockout.consolanteFinals)}
                    </div>
                  </Section>
                </>
              )}
            </>
          )}

          {activeTab === 'export' && (
            <Section title="Sauvegarde" subtitle="Export, import et sauvegarde locale du tournoi." right={<><Button onClick={exportState}>Exporter JSON</Button><Button variant="secondary" onClick={copyState}>Copier JSON</Button><Button variant="secondary" onClick={() => importRef.current?.click()}>Importer JSON</Button><Button variant="danger" onClick={resetTournament}>Réinitialiser</Button></>}>
              <input ref={importRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
              <div className="cards-grid two-up">
                <div className="mini-card">
                  <div className="mini-card-head">Fonctions incluses</div>
                  <ul className="simple-list">
                    <li>18 équipes et niveaux N / NP / R / D / L</li>
                    <li>2 brassages en 6 poules de 3</li>
                    <li>Principale à 12 et consolante à 6</li>
                    <li>Quarts, demi-finales, finales et petites finales</li>
                    <li>Modes public, arbitres et organisateur</li>
                  </ul>
                </div>
                <div className="mini-card">
                  <div className="mini-card-head">Sauvegarde et export</div>
                  <ul className="simple-list">
                    <li>Sauvegarde locale automatique et bouton de sauvegarde manuelle</li>
                    <li>Nom du tournoi intégré au nom du fichier JSON exporté</li>
                    <li>Date et heure de sauvegarde intégrées au nom du fichier</li>
                    <li>Import complet depuis un export JSON précédent</li>
                  </ul>
                </div>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
