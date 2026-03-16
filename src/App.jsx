import React, { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'tournoidevolley-react-vite-v2';
const TEAM_TARGET = 18;
const LEVELS = ['L', 'D', 'R', 'NP', 'N'];
const LEVEL_WEIGHT = { L: 1, D: 2, R: 3, NP: 4, N: 5 };
const DEFAULT_PHASE_RULES = {
  brassage1: { winningScore: 21, mode: 'sec' },
  brassage2: { winningScore: 21, mode: 'sec' },
  principale: { winningScore: 21, mode: 'sec' },
  consolante: { winningScore: 21, mode: 'sec' },
};
const PRINCIPALE_POOL_NAMES = ['Principale A', 'Principale B', 'Principale C', 'Principale D'];
const CONSOLANTE_POOL_NAMES = ['Consolante A', 'Consolante B'];

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

function LargePublicMatch({ title, match, teamName }) {
  if (!match) return null;
  return (
    <div className="public-match-card">
      <div className="public-label">{title}</div>
      <div className="public-match-grid">
        <div>
          <div className="muted small">{match.time} • Terrain {match.court}</div>
          <div className="public-team">{teamName(match.teamAId)}</div>
          <div className="muted small">vs</div>
          <div className="public-team">{teamName(match.teamBId)}</div>
        </div>
        <div className="align-right">
          <div className="muted small">{match.group}</div>
          <div className="public-score">{match.scoreA === '' ? '-' : match.scoreA} : {match.scoreB === '' ? '-' : match.scoreB}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const initial = loadState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [publicMode, setPublicMode] = useState(true);
  const [isOrganizerAuthenticated, setIsOrganizerAuthenticated] = useState(false);
  const [showOrganizerLogin, setShowOrganizerLogin] = useState(false);
  const [organizerAttempt, setOrganizerAttempt] = useState('');
  const [loginError, setLoginError] = useState('');
  const [teams, setTeams] = useState(safeClone(initial?.teams, defaultTeams()));
  const [startTime, setStartTime] = useState(initial?.settings?.startTime || '09:00');
  const [slotDuration, setSlotDuration] = useState(initial?.settings?.slotDuration || 20);
  const [phaseRules, setPhaseRules] = useState(safeClone(initial?.settings?.phaseRules, DEFAULT_PHASE_RULES));
  const [organizerPassword, setOrganizerPassword] = useState(initial?.settings?.organizerPassword || 'Chuly0ne');
  const [passwordDraft, setPasswordDraft] = useState(initial?.settings?.organizerPassword || 'Chuly0ne');
  const [lastSavedAt, setLastSavedAt] = useState(initial?.meta?.lastSavedAt || '');
  const [brassage1, setBrassage1] = useState(safeClone(initial?.brassage1, { pools: [], matches: [] }));
  const [brassage2, setBrassage2] = useState(safeClone(initial?.brassage2, { pools: [], matches: [] }));
  const [mainStage, setMainStage] = useState(safeClone(initial?.mainStage, { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] }));
  const [knockout, setKnockout] = useState(safeClone(initial?.knockout, { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] }));
  const importRef = useRef(null);

  const teamMap = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const allTeamIds = useMemo(() => teams.map((team) => team.id), [teams]);

  const brassage1Standings = useMemo(() => computeGroupStandings(brassage1.pools, brassage1.matches, teamMap, phaseRules), [brassage1, teamMap, phaseRules]);
  const brassage2Standings = useMemo(() => computeGroupStandings(brassage2.pools, brassage2.matches, teamMap, phaseRules), [brassage2, teamMap, phaseRules]);
  const principaleStandings = useMemo(() => computeGroupStandings(mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules), [mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules]);
  const consolanteStandings = useMemo(() => computeGroupStandings(mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules), [mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules]);

  const rankingAfterBrassage1 = useMemo(() => computeRanking(allTeamIds, brassage1.matches, teamMap, phaseRules), [allTeamIds, brassage1.matches, teamMap, phaseRules]);
  const rankingAfterBrassages = useMemo(() => computeRanking(allTeamIds, [...brassage1.matches, ...brassage2.matches], teamMap, phaseRules), [allTeamIds, brassage1.matches, brassage2.matches, teamMap, phaseRules]);
  const overallRanking = useMemo(() => computeRanking(allTeamIds, [
    ...brassage1.matches,
    ...brassage2.matches,
    ...mainStage.principaleMatches,
    ...mainStage.consolanteMatches,
    ...knockout.principalQuarters,
    ...knockout.principalSemis,
    ...knockout.principalFinals,
    ...knockout.consolanteSemis,
    ...knockout.consolanteFinals,
  ], teamMap, phaseRules), [allTeamIds, brassage1.matches, brassage2.matches, mainStage, knockout, teamMap, phaseRules]);

  function getPersistedState(savedAt = lastSavedAt) {
    return {
      teams,
      settings: { startTime, slotDuration, phaseRules, organizerPassword },
      meta: { lastSavedAt: savedAt },
      brassage1,
      brassage2,
      mainStage,
      knockout,
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
  }, [teams, startTime, slotDuration, phaseRules, organizerPassword, brassage1, brassage2, mainStage, knockout]);

  const scheduleData = useMemo(() => computeTournamentSchedule([
    brassage1.matches,
    brassage2.matches,
    [...mainStage.principaleMatches, ...mainStage.consolanteMatches],
    [...knockout.principalQuarters, ...knockout.consolanteSemis],
    [...knockout.principalSemis, ...knockout.consolanteFinals],
    knockout.principalFinals,
  ], startTime, phaseRules), [startTime, phaseRules, brassage1.matches, brassage2.matches, mainStage, knockout]);

  const estimatedTournamentEnd = scheduleData.estimatedEndText;

  const nextMatches = useMemo(() => {
    const allMatches = [
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
  }, [brassage1.matches, brassage2.matches, mainStage, knockout, phaseRules, scheduleData]);

  const completedMatchCounts = {
    b1: brassage1.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    b2: brassage2.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    principale: mainStage.principaleMatches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    consolante: mainStage.consolanteMatches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    ko: [...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals, ...knockout.consolanteSemis, ...knockout.consolanteFinals].filter((m) => isMatchResultValid(m, phaseRules)).length,
  };

  function updatePhaseRule(ruleKey, field, value) {
    setPhaseRules((current) => ({
      ...current,
      [ruleKey]: { ...current[ruleKey], [field]: value },
    }));
  }

  function teamName(teamId) {
    return teamMap.get(teamId)?.name || 'À définir';
  }

  function resetTournament() {
    setTeams(defaultTeams());
    setStartTime('09:00');
    setSlotDuration(20);
    setPhaseRules(safeClone(DEFAULT_PHASE_RULES, DEFAULT_PHASE_RULES));
    setOrganizerPassword('Chuly0ne');
    setPasswordDraft('Chuly0ne');
    setLastSavedAt('');
    setBrassage1({ pools: [], matches: [] });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
  }

  function handleOrganizerLogin() {
    if (organizerAttempt === organizerPassword) {
      setIsOrganizerAuthenticated(true);
      setPublicMode(false);
      setShowOrganizerLogin(false);
      setOrganizerAttempt('');
      setLoginError('');
      return;
    }
    setLoginError('Mot de passe incorrect.');
  }

  function lockOrganizerMode() {
    setIsOrganizerAuthenticated(false);
    setPublicMode(true);
    setShowOrganizerLogin(false);
    setOrganizerAttempt('');
    setLoginError('');
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
  }

  function generateBrassage1() {
    const readyTeams = teams.filter((team) => team.name.trim());
    if (readyTeams.length !== TEAM_TARGET) {
      window.alert(`Cette application attend ${TEAM_TARGET} équipes. Actuellement : ${readyTeams.length}.`);
      return;
    }
    const seededIds = sortTeamsForSeeding(readyTeams).map((team) => team.id);
    const pools = createPools(seededIds, createNumberedNames('Brassage 1 - Poule', 6));
    const matches = assignSchedule(pools.flatMap((pool) => roundRobinMatches(pool.teamIds, 'Brassage 1', pool.name)), 0, startTime, Number(slotDuration));
    setBrassage1({ pools, matches });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setActiveTab('brassage1');
  }

  function generateBrassage2() {
    if (brassage1.matches.length === 0) {
      window.alert('Génère d’abord le brassage 1.');
      return;
    }
    const rankedIds = rankingAfterBrassage1.map((row) => row.teamId);
    const pools = createPools(rankedIds, createNumberedNames('Brassage 2 - Poule', 6));
    const matches = assignSchedule(pools.flatMap((pool) => roundRobinMatches(pool.teamIds, 'Brassage 2', pool.name)), stageSlotCount(brassage1.matches.length), startTime, Number(slotDuration));
    setBrassage2({ pools, matches });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setActiveTab('brassage2');
  }

  function generateMainStage() {
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

  function updateMatchScore(scope, matchId, field, value) {
    const normalized = value === '' ? '' : Math.max(0, Number(value));
    const apply = (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      const updated = { ...match, [field]: normalized };
      updated.validatedAt = isMatchResultValid(updated, phaseRules) ? new Date().toISOString() : null;
      return updated;
    });
    if (scope === 'brassage1') return setBrassage1((current) => ({ ...current, matches: apply(current.matches) }));
    if (scope === 'brassage2') return setBrassage2((current) => ({ ...current, matches: apply(current.matches) }));
    if (scope === 'principale') return setMainStage((current) => ({ ...current, principaleMatches: apply(current.principaleMatches) }));
    if (scope === 'consolante') return setMainStage((current) => ({ ...current, consolanteMatches: apply(current.consolanteMatches) }));
    if (scope === 'principalQuarters') return setKnockout((current) => ({ ...current, principalQuarters: apply(current.principalQuarters) }));
    if (scope === 'principalSemis') return setKnockout((current) => ({ ...current, principalSemis: apply(current.principalSemis) }));
    if (scope === 'principalFinals') return setKnockout((current) => ({ ...current, principalFinals: apply(current.principalFinals) }));
    if (scope === 'consolanteSemis') return setKnockout((current) => ({ ...current, consolanteSemis: apply(current.consolanteSemis) }));
    return setKnockout((current) => ({ ...current, consolanteFinals: apply(current.consolanteFinals) }));
  }

  function exportState() {
    downloadJson('tournoidevolley-tournament.json', getPersistedState());
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
        if (parsed.settings?.phaseRules) setPhaseRules({ ...DEFAULT_PHASE_RULES, ...parsed.settings.phaseRules });
        if (parsed.settings?.organizerPassword) {
          setOrganizerPassword(parsed.settings.organizerPassword);
          setPasswordDraft(parsed.settings.organizerPassword);
        }
        if (parsed.meta?.lastSavedAt) setLastSavedAt(parsed.meta.lastSavedAt);
        if (parsed.brassage1) setBrassage1(parsed.brassage1);
        if (parsed.brassage2) setBrassage2(parsed.brassage2);
        if (parsed.mainStage) setMainStage(parsed.mainStage);
        if (parsed.knockout) setKnockout(parsed.knockout);
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
      <div className="cards-grid four-up">
        {cards.map(({ pool, rows }) => (
          <div className="mini-card" key={pool.id}>
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
                      <td>{row.teamName}</td>
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

  function renderMatches(matches, scope) {
    if (!matches.length) return <div className="empty-state">Aucun match généré pour le moment.</div>;
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Heure</th>
              <th>Terrain</th>
              <th>Phase</th>
              <th>Match</th>
              <th>Équipe A</th>
              <th>Score</th>
              <th>Équipe B</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const status = getMatchStatusLabel(match, phaseRules);
              const schedule = scheduleData.scheduleMap[match.id];
              return (
                <tr key={match.id} className={status === 'Score invalide' ? 'row-invalid' : ''}>
                  <td>{schedule?.startText || match.time}</td>
                  <td>Terrain {match.court}</td>
                  <td>{match.phase}</td>
                  <td>{match.group}</td>
                  <td>{teamName(match.teamAId)}</td>
                  <td>
                    <div className="score-inputs">
                      <input type="number" min="0" value={match.scoreA} onChange={(e) => updateMatchScore(scope, match.id, 'scoreA', e.target.value)} />
                      <span>-</span>
                      <input type="number" min="0" value={match.scoreB} onChange={(e) => updateMatchScore(scope, match.id, 'scoreB', e.target.value)} />
                    </div>
                  </td>
                  <td>{teamName(match.teamBId)}</td>
                  <td><div className="status-cell"><span className={`badge ${status === 'Valide' ? 'badge-success' : status === 'Score invalide' ? 'badge-danger' : 'badge-neutral'}`}>{status}</span>{schedule ? <span className="muted tiny">Fin prévue : {schedule.endText}</span> : null}</div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                <td>{row.teamName}</td>
                <td>{row.level}</td>
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
          <div className="podium-item"><strong>1er</strong><span>{finalResult.winner ? teamName(finalResult.winner) : 'À venir'}</span></div>
          <div className="podium-item"><strong>2e</strong><span>{finalResult.loser ? teamName(finalResult.loser) : 'À venir'}</span></div>
          <div className="podium-item"><strong>3e</strong><span>{smallResult.winner ? teamName(smallResult.winner) : 'À venir'}</span></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'brassage1', label: 'Brassage 1' },
    { id: 'brassage2', label: 'Brassage 2' },
    { id: 'principale', label: 'Principale / Consolante' },
    { id: 'finales', label: 'Phases finales' },
    { id: 'public', label: 'Affichage public' },
    { id: 'export', label: 'Sauvegarde' },
  ];

  if (publicMode || !isOrganizerAuthenticated) {
    return (
      <div className="public-page">
        <div className="container">
          <header className="hero public-hero">
            <div>
              <div className="hero-tag">tournoidevolley.fr</div>
              <h1>Affichage public du tournoi</h1>
              <p>Prochains matchs, classement cumulé, estimation de fin du tournoi et accès organisateur protégé.</p>
            </div>
            <div className="hero-controls">
              <div className="hero-pill">
                <span>Fin estimée du tournoi</span>
                <strong>{estimatedTournamentEnd}</strong>
              </div>
              {isOrganizerAuthenticated ? (
                <Button variant="secondary" onClick={() => setPublicMode(false)}>Retour au mode organisateur</Button>
              ) : (
                <Button variant="primary" onClick={() => { setShowOrganizerLogin(true); setLoginError(''); }}>Accès organisateur</Button>
              )}
            </div>
          </header>

          {showOrganizerLogin && !isOrganizerAuthenticated ? (
            <section className="login-card">
              <h2>Accès organisateur</h2>
              <p className="muted">Saisis le mot de passe organisateur pour déverrouiller l’édition du tournoi.</p>
              <div className="login-grid">
                <input type="password" value={organizerAttempt} onChange={(e) => setOrganizerAttempt(e.target.value)} placeholder="Mot de passe" />
                <Button variant="primary" onClick={handleOrganizerLogin}>Déverrouiller</Button>
                <Button variant="secondary" onClick={() => { setShowOrganizerLogin(false); setOrganizerAttempt(''); setLoginError(''); }}>Annuler</Button>
              </div>
              {loginError ? <div className="error-text">{loginError}</div> : null}
            </section>
          ) : null}

          <div className="cards-grid three-up">
            {nextMatches.map((match, index) => (
              <LargePublicMatch key={match.id} title={`Prochain match ${index + 1}`} match={match} teamName={teamName} />
            ))}
          </div>

          <div className="stack-gap">
            <Section title="Classement cumulé" subtitle="Tous les matchs valides saisis sont pris en compte.">
              {renderOverallRanking(overallRanking)}
            </Section>
            <Section title="Podiums" subtitle="Les podiums s’affichent dès que les finales sont valides.">
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

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero">
          <div>
            <div className="hero-tag">tournoidevolley.fr</div>
            <h1>Gestionnaire de tournoi de volley</h1>
            <p>
              Projet React/Vite prêt à déployer : 18 équipes, 2 brassages de 6 poules de 3,
              principale à 12, consolante à 6, méthode serpent, validation des scores par phase,
              classements, tableaux finaux et affichage public.
            </p>
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
              <Button variant="secondary" onClick={() => setPublicMode(true)}>Ouvrir l’affichage public</Button>
              <Button variant="danger" onClick={lockOrganizerMode}>Verrouiller le mode organisateur</Button>
            </div>
            {lastSavedAt ? <div className="muted small">Dernière sauvegarde locale : {new Date(lastSavedAt).toLocaleString('fr-FR')}</div> : null}
          </div>
        </header>

        <nav className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => (tab.id === 'public' ? setPublicMode(true) : setActiveTab(tab.id))}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="stack-gap">
          {activeTab === 'dashboard' && (
            <>
              <div className="cards-grid six-up">
                <StatCard label="Équipes" value={teams.length} subvalue="Cible : 18" />
                <StatCard label="Brassage 1" value={`${completedMatchCounts.b1}/${brassage1.matches.length || 0}`} subvalue="6 poules de 3" />
                <StatCard label="Brassage 2" value={`${completedMatchCounts.b2}/${brassage2.matches.length || 0}`} subvalue="6 poules de 3" />
                <StatCard label="Principale" value={`${completedMatchCounts.principale}/${mainStage.principaleMatches.length || 0}`} subvalue="4 poules de 3" />
                <StatCard label="Consolante" value={`${completedMatchCounts.consolante}/${mainStage.consolanteMatches.length || 0}`} subvalue="2 poules de 3" />
                <StatCard label="Leader" value={rankingAfterBrassages[0]?.teamName || '-'} subvalue={`${rankingAfterBrassages[0]?.tournamentPoints ?? 0} pts`} />
              </div>

              <Section title="Paramètres de score par phase" subtitle="En mode sec, il faut atteindre exactement le score cible. En mode avec 2 points d’écart, il faut atteindre au moins le score cible avec 2 points d’avance minimum.">
                <div className="cards-grid two-up">
                  <PhaseRuleEditor title="Brassage 1" value={phaseRules.brassage1} onScoreChange={(value) => updatePhaseRule('brassage1', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('brassage1', 'mode', value)} />
                  <PhaseRuleEditor title="Brassage 2" value={phaseRules.brassage2} onScoreChange={(value) => updatePhaseRule('brassage2', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('brassage2', 'mode', value)} />
                  <PhaseRuleEditor title="Principale" value={phaseRules.principale} onScoreChange={(value) => updatePhaseRule('principale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('principale', 'mode', value)} />
                  <PhaseRuleEditor title="Consolante" value={phaseRules.consolante} onScoreChange={(value) => updatePhaseRule('consolante', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('consolante', 'mode', value)} />
                </div>
              </Section>

              <Section title="Sécurité organisateur" subtitle="Le mode organisateur se déverrouille avec un mot de passe. Tu peux le modifier ici, uniquement une fois connecté.">
                <div className="cards-grid two-up">
                  <div className="rule-card">
                    <h3>Mot de passe organisateur</h3>
                    <label>
                      <span>Nouveau mot de passe</span>
                      <input type="password" value={passwordDraft} onChange={(e) => setPasswordDraft(e.target.value)} />
                    </label>
                    <div className="actions-row">
                      <Button variant="primary" onClick={updateOrganizerPassword}>Mettre à jour le mot de passe</Button>
                    </div>
                  </div>
                  <div className="rule-card">
                    <h3>Sauvegarde locale</h3>
                    <p className="muted">Le bouton Sauvegarder enregistre l’état actuel sur ce navigateur pour le retrouver lors de la prochaine ouverture de la page.</p>
                    <div className="actions-row">
                      <Button variant="success" onClick={() => saveTournamentState(true)}>Sauvegarder maintenant</Button>
                    </div>
                    {lastSavedAt ? <p className="muted small helper-text">Dernière sauvegarde : {new Date(lastSavedAt).toLocaleString('fr-FR')}</p> : null}
                  </div>
                </div>
              </Section>

              <Section
                title="Flux du tournoi"
                subtitle="La méthode serpent est utilisée pour les brassages, la principale et la consolante. Les scores invalides ne comptent pas dans les classements."
                right={
                  <>
                    <Button onClick={generateBrassage1}>1. Générer brassage 1</Button>
                    <Button variant="secondary" onClick={generateBrassage2}>2. Générer brassage 2</Button>
                    <Button variant="success" onClick={generateMainStage}>3. Générer principale / consolante</Button>
                  </>
                }
              >
                <div className="cards-grid five-up">
                  {[
                    ['Brassage 1', '6 poules de 3 créées selon le niveau des équipes.'],
                    ['Brassage 2', '6 poules de 3 créées selon les points du brassage 1.'],
                    ['Répartition', 'Les 12 meilleurs vont en principale, les 6 autres en consolante.'],
                    ['Principale', '4 poules de 3 puis quarts, demies, finale et petite finale.'],
                    ['Consolante', '2 poules de 3 puis demi-finales, finale et petite finale.'],
                  ].map(([title, text]) => (
                    <div className="mini-card" key={title}>
                      <div className="mini-card-head">{title}</div>
                      <p className="muted">{text}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Classement cumulé" subtitle="Tous les matchs valides saisis sont pris en compte.">
                {renderOverallRanking(overallRanking)}
              </Section>
            </>
          )}

          {activeTab === 'equipes' && (
            <Section
              title="Équipes"
              subtitle="N = 5, NP = 4, R = 3, D = 2, L = 1. Le brassage 1 s’appuie sur ce niveau pour les têtes de série."
              right={
                <>
                  <Button variant="secondary" onClick={addTeam}>Ajouter</Button>
                  <Button onClick={generateBrassage1}>Générer brassage 1</Button>
                </>
              }
            >
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
                    {teams.map((team, index) => (
                      <tr key={team.id}>
                        <td>{index + 1}</td>
                        <td><input value={team.name} onChange={(e) => updateTeam(team.id, 'name', e.target.value)} /></td>
                        <td>
                          <select value={team.level} onChange={(e) => updateTeam(team.id, 'level', e.target.value)}>
                            {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
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

          {activeTab === 'brassage1' && (
            <>
              <Section title="Brassage 1" subtitle="6 poules de 3 construites selon le niveau des équipes." right={<Button onClick={generateBrassage2}>Générer brassage 2</Button>}>
                {renderStandings(brassage1Standings)}
              </Section>
              <Section title="Matchs du brassage 1">{renderMatches(brassage1.matches, 'brassage1')}</Section>
              <Section title="Classement général du brassage 1" subtitle="Il sert à créer le brassage 2.">
                {renderOverallRanking(rankingAfterBrassage1)}
              </Section>
            </>
          )}

          {activeTab === 'brassage2' && (
            <>
              <Section title="Brassage 2" subtitle="6 poules de 3 construites selon les points du brassage 1." right={<Button onClick={generateMainStage}>Générer principale / consolante</Button>}>
                {renderStandings(brassage2Standings)}
              </Section>
              <Section title="Matchs du brassage 2">{renderMatches(brassage2.matches, 'brassage2')}</Section>
              <Section title="Classement cumulé brassage 1 + brassage 2" subtitle="Les 12 premiers vont en principale, les 6 autres en consolante.">
                {renderOverallRanking(rankingAfterBrassages, true)}
              </Section>
            </>
          )}

          {activeTab === 'principale' && (
            <>
              <Section title="Poules principale" subtitle="4 poules de 3 issues des 12 meilleures équipes, avec méthode serpent.">
                {renderStandings(principaleStandings)}
              </Section>
              <Section title="Matchs de la principale">{renderMatches(mainStage.principaleMatches, 'principale')}</Section>
              <Section title="Poules consolante" subtitle="2 poules de 3 issues des 6 autres équipes, avec méthode serpent." right={<Button variant="success" onClick={generateKnockoutStage1}>Générer quarts / demies</Button>}>
                {renderStandings(consolanteStandings)}
              </Section>
              <Section title="Matchs de la consolante">{renderMatches(mainStage.consolanteMatches, 'consolante')}</Section>
            </>
          )}

          {activeTab === 'finales' && (
            <>
              <Section title="Étape 1 des tableaux finaux" subtitle="Principale : quarts. Consolante : demi-finales." right={<><Button onClick={generateKnockoutStage1}>Regénérer</Button><Button variant="success" onClick={generateKnockoutStage2}>Générer étape 2</Button></>}>
                <div className="cards-grid two-up">
                  <div>
                    <h3>Quarts de finale principale</h3>
                    {renderMatches(knockout.principalQuarters, 'principalQuarters')}
                  </div>
                  <div>
                    <h3>Demi-finales consolante</h3>
                    {renderMatches(knockout.consolanteSemis, 'consolanteSemis')}
                  </div>
                </div>
              </Section>

              <Section title="Étape 2 des tableaux finaux" subtitle="Principale : demi-finales. Consolante : finale et petite finale." right={<Button variant="success" onClick={generatePrincipalFinals}>Générer finale principale</Button>}>
                <div className="cards-grid two-up">
                  <div>
                    <h3>Demi-finales principale</h3>
                    {renderMatches(knockout.principalSemis, 'principalSemis')}
                  </div>
                  <div>
                    <h3>Finales consolante</h3>
                    {renderMatches(knockout.consolanteFinals, 'consolanteFinals')}
                  </div>
                </div>
              </Section>

              <Section title="Étape 3 du tableau principal" subtitle="Finale et petite finale pour les places 1 à 3.">
                {renderMatches(knockout.principalFinals, 'principalFinals')}
              </Section>

              <Section title="Podiums" subtitle="Le podium principal donne les places 1 à 3 du tournoi. Le podium consolante donne les places 1 à 3 de la consolante.">
                <div className="cards-grid two-up">
                  {renderPodium('Tableau principal', knockout.principalFinals)}
                  {renderPodium('Tableau consolante', knockout.consolanteFinals)}
                </div>
              </Section>
            </>
          )}

          {activeTab === 'export' && (
            <Section
              title="Sauvegarde"
              subtitle="Export et import complets du tournoi."
              right={
                <>
                  <Button onClick={exportState}>Exporter JSON</Button>
                  <Button variant="secondary" onClick={copyState}>Copier JSON</Button>
                  <Button variant="secondary" onClick={() => importRef.current?.click()}>Importer JSON</Button>
                  <Button variant="danger" onClick={resetTournament}>Réinitialiser</Button>
                </>
              }
            >
              <input ref={importRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
              <div className="cards-grid two-up">
                <div className="mini-card">
                  <div className="mini-card-head">Fonctions incluses</div>
                  <ul className="simple-list">
                    <li>18 équipes et niveaux N / NP / R / D / L</li>
                    <li>2 brassages en 6 poules de 3</li>
                    <li>Principale à 12 et consolante à 6</li>
                    <li>Quarts, demi-finales, finales et petites finales</li>
                    <li>Classements automatiques et affichage public</li>
                  </ul>
                </div>
                <div className="mini-card">
                  <div className="mini-card-head">Validation des scores</div>
                  <ul className="simple-list">
                    <li>Réglage distinct pour brassage 1, brassage 2, principale et consolante</li>
                    <li>Mode sec : le vainqueur doit atteindre exactement le score cible</li>
                    <li>Mode 2 points d’écart : score cible minimum + 2 points d’avance</li>
                    <li>Les scores invalides ne comptent pas dans les classements</li>
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
