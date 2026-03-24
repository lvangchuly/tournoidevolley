import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FIREBASE_DATABASE_URL } from './firebaseConfig';

const STORAGE_KEY = 'tournoidevolley-react-vite-V19';
const LEGACY_STORAGE_KEYS = ['tournoidevolley-react-vite-v18I', 'tournoidevolley-react-vite-v18H', 'tournoidevolley-react-vite-V18G', 'tournoidevolley-react-vite-v18F', 'tournoidevolley-react-vite-V18D', 'tournoidevolley-react-vite-v18C', 'tournoidevolley-react-vite-V18B', 'tournoidevolley-react-vite-v18A', 'tournoidevolley-react-vite-v18', 'tournoidevolley-react-vite-v17D'];
const MAX_ACTIVE_COURTS = 3;
const TEAM_TARGET = 18;
const LEVELS = ['L', 'D', 'R', 'NP', 'N'];
const LEVEL_WEIGHT = { L: 1, D: 2, R: 3, NP: 4, N: 5 };
const LEVEL_CLASS = { N: 'team-level-n', NP: 'team-level-np', R: 'team-level-r', D: 'team-level-d', L: 'team-level-l' };
const APP_VERSION = 'V19';
const ORGANIZER_BANNER_LOGO_TILE_SIZE = 45;
const NORMALIZED_LOGO_SOURCE_SIZE = 96;

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

function normalizeTeamsList(inputTeams) {
  if (!Array.isArray(inputTeams) || inputTeams.length === 0) return defaultTeams();
  return inputTeams
    .filter(Boolean)
    .slice(0, TEAM_TARGET)
    .map((team, index) => ({
      id: team?.id || uid('team'),
      name: team?.name || `Équipe ${index + 1}`,
      level: LEVELS.includes(team?.level) ? team.level : 'D',
      club: team?.club || '',
      contact: team?.contact || '',
    }));
}

function getSortedTeamIds(match) {
  return [match?.teamAId || '', match?.teamBId || ''].filter(Boolean).sort();
}

function teamPairKey(match, phaseOverride = '') {
  const teamIds = getSortedTeamIds(match);
  if (teamIds.length < 2) return '';
  return [phaseOverride || match?.phase || '', ...teamIds].join('|');
}

function isKnockoutMatchSlot(match) {
  const phase = String(match?.phase || '');
  const group = String(match?.group || '');
  return /quart de finale|demi-finale|tableau principal|tableau consolante|finale/i.test(phase)
    || /quart|demi|finale|petite finale/i.test(group);
}

function matchIdentityKey(match) {
  if (!match) return '';
  const phase = match.phase || '';
  const group = match.group || '';
  const round = match.round || '';
  if (isKnockoutMatchSlot(match) && (phase || group)) {
    return [phase, group || '', round || ''].join('|');
  }
  const teamIds = getSortedTeamIds(match);
  const canonicalKey = [
    phase,
    group,
    round,
    ...teamIds,
  ].join('|');
  if (canonicalKey.replace(/\|/g, '')) {
    return canonicalKey;
  }
  return match.id || [
    phase,
    group,
    round,
    match.teamAId || '',
    match.teamBId || '',
    match.court || '',
    match.slot || '',
  ].join('|');
}

function pickPreferredMatch(existingMatch, incomingMatch) {
  if (!existingMatch) return incomingMatch;
  if (!incomingMatch) return existingMatch;

  const existingWeight =
    (existingMatch.validatedAt ? 1000000 : 0) +
    (existingMatch.scoreA !== '' && existingMatch.scoreA !== null && existingMatch.scoreA !== undefined ? 10000 : 0) +
    (existingMatch.scoreB !== '' && existingMatch.scoreB !== null && existingMatch.scoreB !== undefined ? 10000 : 0) +
    (existingMatch.submittedAt ? 1000 : 0) +
    (existingMatch.submittedScoreA !== '' && existingMatch.submittedScoreA !== null && existingMatch.submittedScoreA !== undefined ? 100 : 0) +
    (existingMatch.submittedScoreB !== '' && existingMatch.submittedScoreB !== null && existingMatch.submittedScoreB !== undefined ? 100 : 0) +
    (existingMatch.matchInProgress ? 10 : 0) +
    (existingMatch.refereeInProgress ? 1 : 0) +
    (existingMatch.manualOverrideAt ? 5000 : 0);
  const incomingWeight =
    (incomingMatch.validatedAt ? 1000000 : 0) +
    (incomingMatch.scoreA !== '' && incomingMatch.scoreA !== null && incomingMatch.scoreA !== undefined ? 10000 : 0) +
    (incomingMatch.scoreB !== '' && incomingMatch.scoreB !== null && incomingMatch.scoreB !== undefined ? 10000 : 0) +
    (incomingMatch.submittedAt ? 1000 : 0) +
    (incomingMatch.submittedScoreA !== '' && incomingMatch.submittedScoreA !== null && incomingMatch.submittedScoreA !== undefined ? 100 : 0) +
    (incomingMatch.submittedScoreB !== '' && incomingMatch.submittedScoreB !== null && incomingMatch.submittedScoreB !== undefined ? 100 : 0) +
    (incomingMatch.matchInProgress ? 10 : 0) +
    (incomingMatch.refereeInProgress ? 1 : 0) +
    (incomingMatch.manualOverrideAt ? 5000 : 0);

  if (incomingWeight !== existingWeight) {
    return incomingWeight > existingWeight ? incomingMatch : existingMatch;
  }

  const existingTimestamp = Math.max(toTimestamp(existingMatch.validatedAt), toTimestamp(existingMatch.submittedAt), toTimestamp(existingMatch.manualOverrideAt));
  const incomingTimestamp = Math.max(toTimestamp(incomingMatch.validatedAt), toTimestamp(incomingMatch.submittedAt), toTimestamp(incomingMatch.manualOverrideAt));
  if (incomingTimestamp !== existingTimestamp) {
    return incomingTimestamp > existingTimestamp ? incomingMatch : existingMatch;
  }

  return incomingMatch;
}

function dedupeMatches(matches) {
  if (!Array.isArray(matches) || matches.length <= 1) return Array.isArray(matches) ? matches.filter(Boolean) : [];
  const byKey = new Map();
  matches.forEach((match) => {
    if (!match) return;
    const key = matchIdentityKey(match);
    if (!key) return;
    byKey.set(key, pickPreferredMatch(byKey.get(key), match));
  });
  return Array.from(byKey.values()).filter((match) => {
    if (!match) return false;
    if (!isKnockoutMatchSlot(match)) return true;
    return Boolean(match.teamAId && match.teamBId);
  });
}

function normalizeLeagueState(input) {
  return {
    pools: Array.isArray(input?.pools) ? input.pools : [],
    matches: dedupeMatches(Array.isArray(input?.matches) ? input.matches : []),
  };
}

function normalizeMainStageState(input) {
  return {
    principalePools: Array.isArray(input?.principalePools) ? input.principalePools : [],
    principaleMatches: dedupeMatches(Array.isArray(input?.principaleMatches) ? input.principaleMatches : []),
    consolantePools: Array.isArray(input?.consolantePools) ? input.consolantePools : [],
    consolanteMatches: dedupeMatches(Array.isArray(input?.consolanteMatches) ? input.consolanteMatches : []),
  };
}

function normalizeKnockoutState(input) {
  return {
    principalQuarters: dedupeMatches(Array.isArray(input?.principalQuarters) ? input.principalQuarters : []),
    principalSemis: dedupeMatches(Array.isArray(input?.principalSemis) ? input.principalSemis : []),
    principalFinals: dedupeMatches(Array.isArray(input?.principalFinals) ? input.principalFinals : []),
    consolanteSemis: dedupeMatches(Array.isArray(input?.consolanteSemis) ? input.consolanteSemis : []),
    consolanteFinals: dedupeMatches(Array.isArray(input?.consolanteFinals) ? input.consolanteFinals : []),
  };
}

function normalizeSingleKnockoutState(input) {
  return {
    quarters: dedupeMatches(Array.isArray(input?.quarters) ? input.quarters : []),
    semis: dedupeMatches(Array.isArray(input?.semis) ? input.semis : []),
    finals: dedupeMatches(Array.isArray(input?.finals) ? input.finals : []),
  };
}

function countMatchesInPersistedState(payload) {
  if (!payload) return 0;
  const arrays = [
    payload?.brassage1?.matches,
    payload?.brassage2?.matches,
    payload?.mainStage?.principaleMatches,
    payload?.mainStage?.consolanteMatches,
    payload?.knockout?.principalQuarters,
    payload?.knockout?.principalSemis,
    payload?.knockout?.principalFinals,
    payload?.knockout?.consolanteSemis,
    payload?.knockout?.consolanteFinals,
    payload?.championshipLeg1?.matches,
    payload?.championshipLeg2?.matches,
    payload?.singleKnockout?.quarters,
    payload?.singleKnockout?.semis,
    payload?.singleKnockout?.finals,
  ];
  return arrays.reduce((total, matches) => total + (Array.isArray(matches) ? matches.length : 0), 0);
}

function loadState() {
  if (typeof window === 'undefined') return null;
  try {
    const storageKeys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
    const raw = storageKeys.map((key) => window.localStorage.getItem(key)).find(Boolean);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.teams)) parsed.teams = normalizeTeamsList(parsed.teams);
    parsed.brassage1 = normalizeLeagueState(parsed?.brassage1);
    parsed.brassage2 = normalizeLeagueState(parsed?.brassage2);
    parsed.mainStage = normalizeMainStageState(parsed?.mainStage);
    parsed.knockout = normalizeKnockoutState(parsed?.knockout);
    parsed.championshipLeg1 = normalizeLeagueState(parsed?.championshipLeg1);
    parsed.championshipLeg2 = normalizeLeagueState(parsed?.championshipLeg2);
    parsed.singleKnockout = normalizeSingleKnockoutState(parsed?.singleKnockout);
    return parsed;
  } catch {
    return null;
  }
}

function defaultTeams(defaultLevelMap = null, fallbackLevel = 'D') {
  const defaults = Array.isArray(defaultLevelMap) ? defaultLevelMap : ['N', 'N', 'NP', 'NP', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'L', 'L', 'L', 'L', 'NP', 'R', 'D'];
  return Array.from({ length: TEAM_TARGET }, (_, index) => ({
    id: uid('team'),
    name: `Équipe ${index + 1}`,
    level: defaults[index] || fallbackLevel,
    club: '',
    contact: '',
  }));
}

function defaultTeamsAllLevelL() {
  return defaultTeams(Array.from({ length: TEAM_TARGET }, () => 'L'), 'L');
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

function scheduleAlternatingPoolsOnCourt(pools, phase, court, startSlot) {
  const safePools = Array.isArray(pools) ? pools.filter(Boolean) : [];
  if (!safePools.length) return [];

  const poolMatches = safePools.map((pool) => createThreeTeamPoolMatches(pool, phase));
  const maxRounds = Math.max(...poolMatches.map((matches) => matches.length), 0);
  const orderedMatches = [];

  for (let roundIndex = 0; roundIndex < maxRounds; roundIndex += 1) {
    poolMatches.forEach((matches) => {
      const match = matches[roundIndex];
      if (match) orderedMatches.push(match);
    });
  }

  return orderedMatches.map((match, offset) => ({
    ...match,
    court,
    slot: startSlot + offset + 1,
    time: '',
    validatedAt: match.validatedAt || null,
  }));
}

function scheduleBrassageMatches(pools, phase, startSlot) {
  const poolPairs = [
    [0, 1],
    [2, 3],
    [4, 5],
  ];

  const scheduled = [];

  poolPairs.forEach(([firstPoolIndex, secondPoolIndex], courtIndex) => {
    const courtMatches = scheduleAlternatingPoolsOnCourt(
      [pools[firstPoolIndex], pools[secondPoolIndex]].filter(Boolean),
      phase,
      courtIndex + 1,
      startSlot,
    );
    scheduled.push(...courtMatches);
  });

  return scheduled.sort((a, b) => {
    if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
    return (a.court || 0) - (b.court || 0);
  });
}

function scheduleMainStageMatches(principalePools, consolantePools, startSlot) {
  const scheduled = [
    ...scheduleAlternatingPoolsOnCourt([principalePools[0], principalePools[1]].filter(Boolean), 'Principale', 1, startSlot),
    ...scheduleAlternatingPoolsOnCourt([principalePools[2], principalePools[3]].filter(Boolean), 'Principale', 2, startSlot),
    ...scheduleAlternatingPoolsOnCourt(consolantePools, 'Consolante', 3, startSlot),
  ];

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

function getRuleKeyFromMatch(match) {
  if (!match) return 'brassage1';
  const phaseLabel = match.phase;
  const groupLabel = String(match.group || '').trim();
  if (phaseLabel === 'Tableau principal' || phaseLabel === 'Tableau consolante') {
    if (/^Quart/i.test(groupLabel)) return 'quart';
    if (/^Demi/i.test(groupLabel)) return 'demi';
    if (/^Finale$/i.test(groupLabel)) return 'finale';
    if (/^Petite finale/i.test(groupLabel)) return 'petiteFinale';
    return phaseLabel === 'Tableau principal' ? 'principale' : 'consolante';
  }
  return getRuleKeyFromPhaseLabel(phaseLabel);
}

function getRuleForMatch(match, phaseRules) {
  const key = getRuleKeyFromMatch(match);
  return phaseRules?.[key] || DEFAULT_PHASE_RULES[key];
}

function isMatchResultValid(match, phaseRules) {
  const scoreA = toNumber(match.scoreA);
  const scoreB = toNumber(match.scoreB);
  if (scoreA === null || scoreB === null) return false;
  if (scoreA === scoreB) return false;

  const rule = getRuleForMatch(match, phaseRules);
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

function isMatchCurrentlyInProgress(match, phaseRules) {
  if (!match) return false;
  if (getMatchStatusLabel(match, phaseRules) === 'Valide') return false;
  return Boolean(match.refereeInProgress || match.matchInProgress);
}

function toTimestamp(value) {
  const stamp = Date.parse(value || '');
  return Number.isFinite(stamp) ? stamp : 0;
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
    const estimatedEnd = plannedStart + estimatePhaseDurationMinutes(getRuleForMatch(match, phaseRules));
    const endMinutes = actualEnd !== null ? Math.max(plannedStart, actualEnd) : estimatedEnd;

    scheduleMap[match.id] = {
      startMinutes: plannedStart,
      startText: minutesToTime(plannedStart),
      endMinutes,
      endText: minutesToTime(endMinutes),
      estimatedDuration: estimatePhaseDurationMinutes(getRuleForMatch(match, phaseRules)),
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

function getLevelClass(level) {
  return LEVEL_CLASS[level] || 'team-level-default';
}

function TeamBadge({ name, level, className = '', children = null }) {
  return <span className={`team-badge ${getLevelClass(level)} ${className}`.trim()}>{name}{children}</span>;
}

function formatPoolLabel(group = '') {
  return String(group || '')
    .replace(/^Brassage [12] - /, '')
    .replace(/^Championnat (Aller|Retour) - /, '')
    .replace(/^Principale\s+/, 'Poule ')
    .replace(/^Consolante\s+/, 'Poule ')
    .trim();
}

function getPoolLetter(poolName = '') {
  const match = String(poolName || '').trim().match(/([A-Z])$/i);
  return match ? match[1].toUpperCase() : String(poolName || '').trim().toUpperCase();
}

function getStandingsRowsForPool(standings, pools, targetPoolLetter) {
  const target = String(targetPoolLetter || '').trim().toUpperCase();
  const standingEntry = (Array.isArray(standings) ? standings : []).find((entry) => getPoolLetter(entry?.pool?.name) === target);
  if (Array.isArray(standingEntry?.rows) && standingEntry.rows.length) {
    return standingEntry.rows;
  }
  const pool = (Array.isArray(pools) ? pools : []).find((entry) => getPoolLetter(entry?.name) === target);
  if (!Array.isArray(pool?.teamIds)) return [];
  return pool.teamIds.filter(Boolean).map((teamId) => ({ teamId }));
}

function sanitizeKnockoutMatches(matches) {
  return dedupeMatches(Array.isArray(matches) ? matches : []).filter((match) => match?.teamAId && match?.teamBId);
}

function hasBothTeamsDefined(match) {
  return Boolean(match?.teamAId && match?.teamBId);
}

function clearMatchScores(match) {
  return {
    ...match,
    scoreA: '',
    scoreB: '',
    submittedScoreA: '',
    submittedScoreB: '',
    submittedAt: null,
    validatedAt: null,
    manualOverrideAt: null,
    refereeInProgress: false,
    matchInProgress: false,
  };
}

function stampGeneratedMatches(matches, generatedAt = new Date().toISOString()) {
  return (Array.isArray(matches) ? matches : []).map((match) => ({
    ...clearMatchScores(match),
    generatedAt,
  }));
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

function PhaseRuleEditor({ title, value, onScoreChange, onModeChange, disabled = false, disabledReason = '' }) {
  const estimatedDuration = estimatePhaseDurationMinutes(value);
  return (
    <div className={`rule-card ${disabled ? 'rule-card-disabled' : ''}`}>
      <h3>{title}</h3>
      <div className="form-grid two-cols">
        <label>
          <span>Score gagnant</span>
          <input type="number" min="1" value={value.winningScore} disabled={disabled} onChange={(e) => onScoreChange(Number(e.target.value) || 21)} />
        </label>
        <label>
          <span>Contexte</span>
          <select value={value.mode} disabled={disabled} onChange={(e) => onModeChange(e.target.value)}>
            <option value="sec">Sec</option>
            <option value="twoPointGap">Avec 2 points d’écart</option>
          </select>
        </label>
      </div>
      <p className="muted small helper-text">Durée estimée utilisée pour le planning : {estimatedDuration} min (échauffement inclus).</p>
      {disabled && disabledReason ? <p className="muted small helper-text">{disabledReason}</p> : null}
    </div>
  );
}


function filterMatchesToPools(matches, pools, phaseLabel) {
  const safeMatches = dedupeMatches(Array.isArray(matches) ? matches : []);
  const safePools = Array.isArray(pools) ? pools : [];
  if (!safePools.length) return safeMatches;

  const allowedPairs = new Map();
  safePools.forEach((pool) => {
    const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [];
    if (teamIds.length < 2) return;
    for (let i = 0; i < teamIds.length - 1; i += 1) {
      for (let j = i + 1; j < teamIds.length; j += 1) {
        allowedPairs.set(teamPairKey({ phase: phaseLabel, teamAId: teamIds[i], teamBId: teamIds[j] }, phaseLabel), pool.name || '');
      }
    }
  });

  const selectedMatches = new Map();
  safeMatches.forEach((match) => {
    if (!match) return;
    if (phaseLabel && match.phase !== phaseLabel) return;
    const pairKey = teamPairKey(match, phaseLabel);
    if (!pairKey || !allowedPairs.has(pairKey)) return;
    const expectedGroup = allowedPairs.get(pairKey);
    const current = selectedMatches.get(pairKey);
    if (!current) {
      selectedMatches.set(pairKey, match);
      return;
    }
    const currentGroupScore = current.group === expectedGroup ? 1 : 0;
    const incomingGroupScore = match.group === expectedGroup ? 1 : 0;
    if (incomingGroupScore !== currentGroupScore) {
      if (incomingGroupScore > currentGroupScore) {
        selectedMatches.set(pairKey, match);
      }
      return;
    }
    selectedMatches.set(pairKey, pickPreferredMatch(current, match));
  });

  return Array.from(selectedMatches.values());
}

function filterMatchesBySelectedTeam(matches, selectedTeamId) {
  const safeMatches = Array.isArray(matches) ? matches : [];
  if (!selectedTeamId) return safeMatches;
  return safeMatches.filter((match) => match?.teamAId === selectedTeamId || match?.teamBId === selectedTeamId);
}

function formatRemainingMatchesLabel(matches, phaseRules) {
  const uniqueMatches = dedupeMatches(Array.isArray(matches) ? matches : []);
  const remainingCount = uniqueMatches.filter((match) => getMatchStatusLabel(match, phaseRules) !== 'Valide').length;
  return `${remainingCount} match${remainingCount > 1 ? 's' : ''} restant${remainingCount > 1 ? 's' : ''} à jouer`;
}



function PublicPodiumHighlightCard({ title, principalTeamId, consolanteTeamId, resolveTeam }) {
  const renderSlot = (label, teamId) => {
    if (!teamId) return <div className="public-podium-team-value muted">À venir</div>;
    const team = resolveTeam(teamId);
    return <TeamBadge name={team.name} level={team.level} className="team-badge-public public-podium-badge" />;
  };

  return (
    <div className="public-match-card public-podium-card">
      <div className="public-match-topline">
        <div className="public-label">Tournoi terminé</div>
        <div className="public-phase-label">{title}</div>
      </div>
      <div className="public-podium-card-body">
        <div className="public-podium-team-row">
          <div className="public-podium-team-label">Principale</div>
          <div className="public-podium-team-content">{renderSlot('Principale', principalTeamId)}</div>
        </div>
        <div className="public-podium-team-row">
          <div className="public-podium-team-label">Consolante</div>
          <div className="public-podium-team-content">{renderSlot('Consolante', consolanteTeamId)}</div>
        </div>
      </div>
    </div>
  );
}

function LargePublicMatch({ title, match, resolveTeam, phaseRules }) {
  if (!match) return null;
  const isInProgress = isMatchCurrentlyInProgress(match, phaseRules);
  const displayScoreA = isInProgress && match.submittedScoreA !== '' ? match.submittedScoreA : match.scoreA;
  const displayScoreB = isInProgress && match.submittedScoreB !== '' ? match.submittedScoreB : match.scoreB;
  const phaseAndGroup = [match.phase, match.group].filter(Boolean).join(' - ');
  const statusLabel = isInProgress ? 'Match en cours' : title;
  const endLabel = isInProgress ? 'Fin de match prévue à' : 'Fin prévue à';
  const startText = match.scheduledStartText || match.time;
  const endText = match.scheduledEndText || '-';
  return (
    <div className="public-match-card public-match-card-featured">
      <div className="public-match-topline">
        <div className="public-label">{statusLabel}</div>
        <div className="public-phase-label">{phaseAndGroup}</div>
      </div>
      <div className="muted small public-match-meta">{startText} • Terrain {match.court}</div>
      <div className="public-match-grid public-match-grid-featured">
        <div className="public-match-main">
          <div className="public-match-team-row">
            <div className="public-team"><TeamBadge name={resolveTeam(match.teamAId).name} level={resolveTeam(match.teamAId).level} className="team-badge-public" /></div>
            <div className="public-score public-score-inline">{displayScoreA === '' ? '-' : displayScoreA}</div>
          </div>
          <div className="muted small public-versus">vs</div>
          <div className="public-match-team-row">
            <div className="public-team"><TeamBadge name={resolveTeam(match.teamBId).name} level={resolveTeam(match.teamBId).level} className="team-badge-public" /></div>
            <div className="public-score public-score-inline">{displayScoreB === '' ? '-' : displayScoreB}</div>
          </div>
        </div>
        <div className="public-match-side-note">
          <div className="public-end-label">{endLabel}</div>
          <div className="public-end-time">{endText}</div>
        </div>
      </div>
    </div>
  );
}



function slugify(value) {
  return String(value || 'tournoi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'tournoi';
}

function buildDefaultSharedTournamentId(name) {
  return `${slugify(name)}-partage`;
}

function buildFirebaseTournamentUrl(sharedTournamentId) {
  const effectiveId = encodeURIComponent(String(sharedTournamentId || '').trim());
  return `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/tournaments/${effectiveId}.json`;
}

function buildRefereeAccessUrl(sharedTournamentId) {
  if (typeof window === 'undefined') return '?mode=referee';
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('mode', 'referee');
  if (sharedTournamentId) {
    url.searchParams.set('sharedTournamentId', sharedTournamentId);
  }
  return url.toString();
}


function buildPublicAccessUrl(sharedTournamentId) {
  if (typeof window === 'undefined') return '?sharedTournamentId=demo';
  const url = new URL(window.location.origin + window.location.pathname);
  if (sharedTournamentId) {
    url.searchParams.set('sharedTournamentId', sharedTournamentId);
  }
  return url.toString();
}

function formatRemoteTimestamp(value) {
  if (!value) return 'Jamais';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Jamais';
  return date.toLocaleString('fr-FR');
}

function normalizeImageFileToSquareDataUrl(file, targetSize = NORMALIZED_LOGO_SOURCE_SIZE) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Impossible de préparer le logo.'));
            return;
          }
          context.clearRect(0, 0, targetSize, targetSize);
          const ratio = Math.min(targetSize / image.width, targetSize / image.height);
          const drawWidth = Math.max(1, Math.round(image.width * ratio));
          const drawHeight = Math.max(1, Math.round(image.height * ratio));
          const offsetX = Math.round((targetSize - drawWidth) / 2);
          const offsetY = Math.round((targetSize - drawHeight) / 2);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
          resolve(canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = () => reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
      image.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.onerror = () => reject(new Error('Impossible de lire le fichier sélectionné.'));
    reader.readAsDataURL(file);
  });
}

function AccessQrCode({ url, title, caption, alt, topImageSrc, topImageAlt }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
  return (
    <div className="referee-qr-card">
      <div className="referee-qr-title">{title}</div>
      {topImageSrc ? <img className="referee-qr-top-image" src={topImageSrc} alt={topImageAlt || ''} /> : null}
      <img className="referee-qr-image" src={qrSrc} alt={alt} />
      <div className="referee-qr-caption">{caption}</div>
    </div>
  );
}

export default function App() {
  const initial = loadState();
  const initialOrganizerPassword = Object.prototype.hasOwnProperty.call(initial?.settings || {}, 'organizerPassword')
    ? String(initial?.settings?.organizerPassword ?? '')
    : 'Chuly0ne';
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
  const [teams, setTeams] = useState(() => normalizeTeamsList(safeClone(initial?.teams, defaultTeams())));
  const [startTime, setStartTime] = useState(initial?.settings?.startTime || '09:00');
  const [slotDuration, setSlotDuration] = useState(initial?.settings?.slotDuration || 20);
  const [phaseRules, setPhaseRules] = useState(safeClone(initial?.settings?.phaseRules, DEFAULT_PHASE_RULES));
  const [organizerPassword, setOrganizerPassword] = useState(initialOrganizerPassword);
  const [passwordDraft, setPasswordDraft] = useState(initialOrganizerPassword);
  const [tournamentName, setTournamentName] = useState(initial?.settings?.tournamentName || 'Tournoi de volley');
  const [tournamentLogo, setTournamentLogo] = useState(initial?.settings?.tournamentLogo || '');
  const [sharedTournamentId, setSharedTournamentId] = useState(initial?.settings?.sharedTournamentId || buildDefaultSharedTournamentId(initial?.settings?.tournamentName || 'Tournoi de volley'));
  const [lastSavedAt, setLastSavedAt] = useState(initial?.meta?.lastSavedAt || '');
  const [remoteSavedAt, setRemoteSavedAt] = useState(initial?.meta?.remoteSavedAt || '');
  const [remoteSyncMessage, setRemoteSyncMessage] = useState('');
  const [isRemoteSyncing, setIsRemoteSyncing] = useState(false);
  const [remoteStateInitialized, setRemoteStateInitialized] = useState(mode !== 'referee');
  const [brassage1, setBrassage1] = useState(normalizeLeagueState(safeClone(initial?.brassage1, { pools: [], matches: [] })));
  const [brassage2, setBrassage2] = useState(normalizeLeagueState(safeClone(initial?.brassage2, { pools: [], matches: [] })));
  const [mainStage, setMainStage] = useState(normalizeMainStageState(safeClone(initial?.mainStage, { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] })));
  const [knockout, setKnockout] = useState(normalizeKnockoutState(safeClone(initial?.knockout, { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] })));
  const [championshipLeg1, setChampionshipLeg1] = useState(normalizeLeagueState(safeClone(initial?.championshipLeg1, { pools: [], matches: [] })));
  const [championshipLeg2, setChampionshipLeg2] = useState(normalizeLeagueState(safeClone(initial?.championshipLeg2, { pools: [], matches: [] })));
  const [singleKnockout, setSingleKnockout] = useState(normalizeSingleKnockoutState(safeClone(initial?.singleKnockout, { quarters: [], semis: [], finals: [] })));
  const [refereeSelectedMatch, setRefereeSelectedMatch] = useState(null);
  const [organizerMatchTeamFilter, setOrganizerMatchTeamFilter] = useState('');
  const importRef = useRef(null);
  const tournamentLogoInputRef = useRef(null);
  const organizerLoginInputRef = useRef(null);
  const autoRefereeSyncTimeoutRef = useRef(null);
  const backgroundCloudSaveTimeoutRef = useRef(null);
  const recentRefereeReleaseRef = useRef(new Map());
  const pendingFreshTournamentTimestampRef = useRef(null);
  const previousTournamentNameRef = useRef(initial?.settings?.tournamentName || 'Tournoi de volley');
  const refereeAccessUrl = useMemo(() => buildRefereeAccessUrl(sharedTournamentId), [sharedTournamentId]);
  const publicAccessUrl = useMemo(() => buildPublicAccessUrl(sharedTournamentId), [sharedTournamentId]);
  const organizerBannerStyle = useMemo(() => {
    if (!tournamentLogo) return undefined;
    return {
      backgroundColor: '#0f172a',
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.26)), url(${tournamentLogo})`,
      backgroundRepeat: 'no-repeat, repeat',
      backgroundPosition: 'center, center',
      backgroundSize: `100% 100%, ${ORGANIZER_BANNER_LOGO_TILE_SIZE}px ${ORGANIZER_BANNER_LOGO_TILE_SIZE}px`,
      filter: 'saturate(1.08) brightness(1.1)',
    };
  }, [tournamentLogo]);

  const teamMap = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams]);
  const teamsSortedByLevel = useMemo(() => sortTeamsForSeeding(teams), [teams]);
  const activeTeams = useMemo(() => teams.filter((team) => team.name.trim()), [teams]);
  const duplicateTeamNameMap = useMemo(() => {
    const counts = new Map();
    teams.forEach((team) => {
      const normalizedName = team.name.trim().toLocaleLowerCase('fr-FR');
      if (!normalizedName) return;
      counts.set(normalizedName, (counts.get(normalizedName) || 0) + 1);
    });
    return counts;
  }, [teams]);
  const duplicatedTeamNames = useMemo(() => [...duplicateTeamNameMap.entries()].filter(([, count]) => count > 1).map(([name]) => name), [duplicateTeamNameMap]);
  const hasDuplicateTeamNames = duplicatedTeamNames.length > 0;
  const isDuplicateTeamName = useCallback((name) => {
    const normalizedName = String(name || '').trim().toLocaleLowerCase('fr-FR');
    return !!normalizedName && (duplicateTeamNameMap.get(normalizedName) || 0) > 1;
  }, [duplicateTeamNameMap]);
  const allTeamIds = useMemo(() => activeTeams.map((team) => team.id), [activeTeams]);
  const isSmallTournamentMode = activeTeams.length > 0 && activeTeams.length < 10;

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

  const allCompetitionMatches = useMemo(() => dedupeMatches(isSmallTournamentMode ? [
    ...championshipLeg1.matches,
    ...championshipLeg2.matches,
    ...singleKnockout.quarters,
    ...singleKnockout.semis,
    ...singleKnockout.finals,
  ] : [
    ...filterMatchesToPools(brassage1.matches, brassage1.pools, 'Brassage 1'),
    ...filterMatchesToPools(brassage2.matches, brassage2.pools, 'Brassage 2'),
    ...filterMatchesToPools(mainStage.principaleMatches, mainStage.principalePools, 'Principale'),
    ...filterMatchesToPools(mainStage.consolanteMatches, mainStage.consolantePools, 'Consolante'),
    ...sanitizeKnockoutMatches(knockout.principalQuarters),
    ...sanitizeKnockoutMatches(knockout.principalSemis),
    ...sanitizeKnockoutMatches(knockout.principalFinals),
    ...sanitizeKnockoutMatches(knockout.consolanteSemis),
    ...sanitizeKnockoutMatches(knockout.consolanteFinals),
  ]), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage1.pools, brassage2.matches, brassage2.pools, mainStage.principaleMatches, mainStage.principalePools, mainStage.consolanteMatches, mainStage.consolantePools, knockout]);

  const activeInProgressTeamIds = useMemo(() => {
    const ids = new Set();
    allCompetitionMatches.forEach((match) => {
      if (!isMatchCurrentlyInProgress(match, phaseRules)) return;
      if (match.teamAId) ids.add(match.teamAId);
      if (match.teamBId) ids.add(match.teamBId);
    });
    return ids;
  }, [allCompetitionMatches, phaseRules]);

  const activeOccupiedMatchCount = useMemo(() => (
    allCompetitionMatches.filter((match) => isMatchCurrentlyInProgress(match, phaseRules)).length
  ), [allCompetitionMatches, phaseRules]);

  function getPersistedState(savedAt = lastSavedAt) {
    return {
      teams,
      settings: { startTime, slotDuration, phaseRules, organizerPassword, tournamentName, tournamentLogo, sharedTournamentId },
      meta: { lastSavedAt: savedAt, remoteSavedAt },
      brassage1,
      brassage2,
      mainStage,
      knockout,
      championshipLeg1,
      championshipLeg2,
      singleKnockout,
    };
  }

  function applyPersistedState(parsed, options = {}) {
    if (!parsed) return;
    if (Array.isArray(parsed.teams)) setTeams(normalizeTeamsList(parsed.teams));
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'startTime')) setStartTime(parsed.settings?.startTime || '09:00');
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'slotDuration')) setSlotDuration(parsed.settings?.slotDuration || 20);
    if (parsed.settings?.phaseRules) setPhaseRules({ ...DEFAULT_PHASE_RULES, ...parsed.settings.phaseRules });
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'organizerPassword')) {
      const nextPassword = String(parsed.settings?.organizerPassword ?? '');
      setOrganizerPassword(nextPassword);
      setPasswordDraft(nextPassword);
    }
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'tournamentName')) setTournamentName(parsed.settings?.tournamentName || 'Tournoi de volley');
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'tournamentLogo')) setTournamentLogo(String(parsed.settings?.tournamentLogo || ''));
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'sharedTournamentId')) setSharedTournamentId(parsed.settings?.sharedTournamentId || '');
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'lastSavedAt')) setLastSavedAt(parsed.meta?.lastSavedAt || '');
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'remoteSavedAt')) setRemoteSavedAt(parsed.meta?.remoteSavedAt || '');
    if (parsed.brassage1) setBrassage1(normalizeLeagueState(parsed.brassage1));
    if (parsed.brassage2) setBrassage2(normalizeLeagueState(parsed.brassage2));
    if (parsed.mainStage) setMainStage(normalizeMainStageState(parsed.mainStage));
    if (parsed.knockout) setKnockout(normalizeKnockoutState(parsed.knockout));
    if (parsed.championshipLeg1) setChampionshipLeg1(normalizeLeagueState(parsed.championshipLeg1));
    if (parsed.championshipLeg2) setChampionshipLeg2(normalizeLeagueState(parsed.championshipLeg2));
    if (parsed.singleKnockout) setSingleKnockout(normalizeSingleKnockoutState(parsed.singleKnockout));
    if (!options.preserveSelection) setRefereeSelectedMatch(null);

  }

  function queueBackgroundCloudSave(delay = 150) {
    if (typeof window === 'undefined' || !sharedTournamentId) return;
    if (backgroundCloudSaveTimeoutRef.current) {
      window.clearTimeout(backgroundCloudSaveTimeoutRef.current);
    }
    backgroundCloudSaveTimeoutRef.current = window.setTimeout(() => {
      saveTournamentToCloud(false, true);
    }, delay);
  }


  async function fetchTournamentFromCloudRaw(targetId = sharedTournamentId) {
    const effectiveId = String(targetId || '').trim();
    if (!effectiveId) return null;
    const response = await fetch(buildFirebaseTournamentUrl(effectiveId));
    if (!response.ok) {
      throw new Error(response.status === 404 ? 'Aucune sauvegarde distante trouvée pour cet identifiant.' : 'Impossible de charger le tournoi depuis Firebase.');
    }
    const payload = await response.json();
    if (!payload) {
      throw new Error('Aucune sauvegarde distante trouvée pour cet identifiant.');
    }
    return payload;
  }

  function mergeRemoteMatches(localMatches, remoteMatches = []) {
    const safeLocalMatches = dedupeMatches(Array.isArray(localMatches) ? localMatches : []);
    const safeRemoteMatches = dedupeMatches(Array.isArray(remoteMatches) ? remoteMatches : []);
    if (!safeLocalMatches.length && safeRemoteMatches.length) {
      return safeClone(safeRemoteMatches, []);
    }

    let changed = false;
    const remoteById = new Map(safeRemoteMatches.map((match) => [match.id, match]));
    const now = Date.now();
    const merged = safeLocalMatches.map((match) => {
      const remote = remoteById.get(match.id);
      if (!remote) return match;

      const recentRelease = recentRefereeReleaseRef.current.get(match.id);
      const remoteInProgress = Boolean(remote.refereeInProgress);
      const remoteMatchInProgress = Boolean(remote.matchInProgress || remote.refereeInProgress);
      const localMatchInProgress = Boolean(match.matchInProgress || match.refereeInProgress);
      const shouldIgnoreRemoteLock = Boolean(recentRelease && recentRelease.until > now && remoteInProgress);
      const localSubmittedAt = toTimestamp(match.submittedAt);
      const remoteSubmittedAt = toTimestamp(remote.submittedAt);
      const localValidatedAt = toTimestamp(match.validatedAt);
      const remoteValidatedAt = toTimestamp(remote.validatedAt);
      const localManualOverrideAt = toTimestamp(match.manualOverrideAt);
      const remoteManualOverrideAt = toTimestamp(remote.manualOverrideAt);
      const localOfficialAt = Math.max(localValidatedAt, localManualOverrideAt);
      const remoteOfficialAt = Math.max(remoteValidatedAt, remoteManualOverrideAt);
      const localOfficialScoresDiffer =
        String(match.scoreA ?? '') !== String(remote.scoreA ?? '') ||
        String(match.scoreB ?? '') !== String(remote.scoreB ?? '');
      const shouldKeepLocalOfficialEdit =
        localOfficialScoresDiffer &&
        localOfficialAt > remoteOfficialAt &&
        localOfficialAt >= remoteSubmittedAt;
      const remoteIsValid = isMatchResultValid(remote, phaseRules);
      const localIsValid = isMatchResultValid(match, phaseRules);
      const pendingScoresDiffer =
        String(match.submittedScoreA ?? '') !== String(remote.submittedScoreA ?? '') ||
        String(match.submittedScoreB ?? '') !== String(remote.submittedScoreB ?? '');
      const shouldAdoptRemotePendingWithoutTimestamp =
        mode !== 'referee' &&
        pendingScoresDiffer &&
        (remoteMatchInProgress || Boolean(remote.submittedAt));

      let nextMatch = match;

      if (!shouldKeepLocalOfficialEdit && remoteIsValid && (!localIsValid || remoteOfficialAt >= localOfficialAt)) {
        nextMatch = {
          ...nextMatch,
          scoreA: remote.scoreA ?? '',
          scoreB: remote.scoreB ?? '',
          validatedAt: remote.validatedAt ?? null,
          manualOverrideAt: remote.manualOverrideAt ?? null,
          submittedScoreA: '',
          submittedScoreB: '',
          submittedAt: null,
          refereeInProgress: false,
          matchInProgress: false,
        };
      } else if (!shouldKeepLocalOfficialEdit && (remoteSubmittedAt >= localSubmittedAt || shouldAdoptRemotePendingWithoutTimestamp)) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: remote.submittedScoreA ?? '',
          submittedScoreB: remote.submittedScoreB ?? '',
          submittedAt: remote.submittedAt ?? null,
          refereeInProgress: shouldIgnoreRemoteLock ? false : remoteInProgress,
          matchInProgress: shouldIgnoreRemoteLock ? (localMatchInProgress || remoteMatchInProgress) : remoteMatchInProgress,
        };
      } else if (shouldIgnoreRemoteLock) {
        nextMatch = {
          ...nextMatch,
          refereeInProgress: false,
          matchInProgress: localMatchInProgress || remoteMatchInProgress,
        };
      }

      if (!remoteInProgress && !remoteMatchInProgress && recentRelease) {
        recentRefereeReleaseRef.current.delete(match.id);
      }

      const hasChanged =
        (match.scoreA ?? '') !== (nextMatch.scoreA ?? '') ||
        (match.scoreB ?? '') !== (nextMatch.scoreB ?? '') ||
        (match.validatedAt ?? null) !== (nextMatch.validatedAt ?? null) ||
        (match.manualOverrideAt ?? null) !== (nextMatch.manualOverrideAt ?? null) ||
        (match.submittedScoreA ?? '') !== (nextMatch.submittedScoreA ?? '') ||
        (match.submittedScoreB ?? '') !== (nextMatch.submittedScoreB ?? '') ||
        (match.submittedAt ?? null) !== (nextMatch.submittedAt ?? null) ||
        Boolean(match.refereeInProgress) !== Boolean(nextMatch.refereeInProgress) ||
        Boolean(match.matchInProgress) !== Boolean(nextMatch.matchInProgress);
      if (!hasChanged) return match;
      changed = true;
      return nextMatch;
    });

    const localIds = new Set(safeLocalMatches.map((match) => match.id));
    const localIdentityKeys = new Set(safeLocalMatches.map((match) => matchIdentityKey(match)).filter(Boolean));
    const remoteOnlyMatches = safeRemoteMatches.filter((match) => {
      if (localIds.has(match.id)) return false;
      const remoteIdentityKey = matchIdentityKey(match);
      return !remoteIdentityKey || !localIdentityKeys.has(remoteIdentityKey);
    });
    if (remoteOnlyMatches.length) {
      changed = true;
      merged.push(...safeClone(remoteOnlyMatches, []));
    }

    return changed ? dedupeMatches(merged) : safeLocalMatches;
  }

  function mergeRemoteRefereeState(payload) {
    if (!payload) return;

    const pendingFreshTournamentTimestamp = pendingFreshTournamentTimestampRef.current;
    if (pendingFreshTournamentTimestamp) {
      const remotePayloadTimestamp = toTimestamp(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt || null);
      const pendingResetTimestamp = toTimestamp(pendingFreshTournamentTimestamp);
      if (!remotePayloadTimestamp || remotePayloadTimestamp < pendingResetTimestamp) {
        return;
      }
      pendingFreshTournamentTimestampRef.current = null;
    }

    const remoteMatchCount = countMatchesInPersistedState(payload);
    const localMatchCount = allCompetitionMatches.length;
    const remoteTeamCount = Array.isArray(payload?.teams) ? payload.teams.length : 0;
    const shouldHydrateStructure = mode !== 'organizer' && (
      (remoteMatchCount > 0 && localMatchCount === 0)
      || remoteMatchCount > localMatchCount
      || (remoteTeamCount > 0 && teams.length < remoteTeamCount)
    );

    if (shouldHydrateStructure) {
      applyPersistedState(payload, { preserveSelection: true });
    }

    setRemoteStateInitialized(true);
    if (payload?.meta?.remoteSavedAt) setRemoteSavedAt(payload.meta.remoteSavedAt);
    if (payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt) {
      setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt)}`);
    }
    if (payload.brassage1?.matches) setBrassage1((current) => ({ ...current, matches: mergeRemoteMatches(current.matches, payload.brassage1.matches) }));
    if (payload.brassage2?.matches) setBrassage2((current) => ({ ...current, matches: mergeRemoteMatches(current.matches, payload.brassage2.matches) }));
    if (payload.mainStage?.principaleMatches || payload.mainStage?.consolanteMatches) {
      setMainStage((current) => ({
        ...current,
        principaleMatches: mergeRemoteMatches(current.principaleMatches, payload.mainStage?.principaleMatches || []),
        consolanteMatches: mergeRemoteMatches(current.consolanteMatches, payload.mainStage?.consolanteMatches || []),
      }));
    }
    if (payload.knockout) {
      setKnockout((current) => ({
        ...current,
        principalQuarters: mergeRemoteMatches(current.principalQuarters, payload.knockout?.principalQuarters || []),
        principalSemis: mergeRemoteMatches(current.principalSemis, payload.knockout?.principalSemis || []),
        principalFinals: mergeRemoteMatches(current.principalFinals, payload.knockout?.principalFinals || []),
        consolanteSemis: mergeRemoteMatches(current.consolanteSemis, payload.knockout?.consolanteSemis || []),
        consolanteFinals: mergeRemoteMatches(current.consolanteFinals, payload.knockout?.consolanteFinals || []),
      }));
    }
    if (payload.championshipLeg1?.matches) setChampionshipLeg1((current) => ({ ...current, matches: mergeRemoteMatches(current.matches, payload.championshipLeg1.matches) }));
    if (payload.championshipLeg2?.matches) setChampionshipLeg2((current) => ({ ...current, matches: mergeRemoteMatches(current.matches, payload.championshipLeg2.matches) }));
    if (payload.singleKnockout) {
      setSingleKnockout((current) => ({
        ...current,
        quarters: mergeRemoteMatches(current.quarters, payload.singleKnockout?.quarters || []),
        semis: mergeRemoteMatches(current.semis, payload.singleKnockout?.semis || []),
        finals: mergeRemoteMatches(current.finals, payload.singleKnockout?.finals || []),
      }));
    }
  }

  async function loadTournamentFromCloud(targetId = sharedTournamentId, showMessage = true) {
    const effectiveId = String(targetId || '').trim();
    if (!effectiveId) {
      window.alert('Renseigne un identifiant de tournoi partagé avant de charger depuis Firebase.');
      return false;
    }
    setIsRemoteSyncing(true);
    setRemoteSyncMessage('Chargement Firebase en cours...');
    try {
      const payload = await fetchTournamentFromCloudRaw(effectiveId);
      pendingFreshTournamentTimestampRef.current = null;
      applyPersistedState(payload);
      setRemoteStateInitialized(true);
      setSharedTournamentId(effectiveId);
      setRemoteSavedAt(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt || '');
      setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt)}`);
      if (showMessage) window.alert('Tournoi chargé depuis Firebase.');
      return true;
    } catch (error) {
      setRemoteSyncMessage(error.message || 'Échec du chargement Firebase.');
      if (showMessage) window.alert(error.message || 'Échec du chargement Firebase.');
      return false;
    } finally {
      setIsRemoteSyncing(false);
    }
  }

  async function saveTournamentToCloud(showMessage = true, silent = false) {
    if (mode === 'referee' && !remoteStateInitialized) {
      if (!silent) {
        setRemoteSyncMessage('Chargement Firebase en cours...');
      }
      return false;
    }
    const effectiveId = String(sharedTournamentId || '').trim() || buildDefaultSharedTournamentId(tournamentName);
    if (!sharedTournamentId) setSharedTournamentId(effectiveId);
    const savedAt = new Date().toISOString();
    const payload = getPersistedState(savedAt);
    payload.settings.sharedTournamentId = effectiveId;
    payload.meta = { ...(payload.meta || {}), remoteSavedAt: savedAt };
    if (!silent) {
      setIsRemoteSyncing(true);
      setRemoteSyncMessage('Sauvegarde Firebase en cours...');
    }
    try {
      const response = await fetch(buildFirebaseTournamentUrl(effectiveId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.error || 'Impossible de sauvegarder sur Firebase.');
      }
      setLastSavedAt(savedAt);
      setRemoteSavedAt(savedAt);
      setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(savedAt)}`);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
      if (showMessage) window.alert('Tournoi partagé sauvegardé sur Firebase.');
      return true;
    } catch (error) {
      if (!silent) setRemoteSyncMessage(error.message || 'Échec de la sauvegarde Firebase.');
      if (showMessage) window.alert(error.message || 'Échec de la sauvegarde Firebase.');
      return false;
    } finally {
      if (!silent) setIsRemoteSyncing(false);
    }
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
  }, [teams, startTime, slotDuration, phaseRules, organizerPassword, tournamentName, sharedTournamentId, remoteSavedAt, brassage1, brassage2, mainStage, knockout, championshipLeg1, championshipLeg2, singleKnockout]);

  useEffect(() => {
    const previousName = previousTournamentNameRef.current;
    const previousDefaultId = buildDefaultSharedTournamentId(previousName);
    if (!sharedTournamentId || sharedTournamentId === previousDefaultId) {
      const nextId = buildDefaultSharedTournamentId(tournamentName);
      if (nextId !== sharedTournamentId) {
        setSharedTournamentId(nextId);
      }
    }
    previousTournamentNameRef.current = tournamentName;
  }, [tournamentName]);

  useEffect(() => () => {
    if (typeof window !== 'undefined') {
      if (autoRefereeSyncTimeoutRef.current) window.clearTimeout(autoRefereeSyncTimeoutRef.current);
      if (backgroundCloudSaveTimeoutRef.current) window.clearTimeout(backgroundCloudSaveTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const requestedSharedId = params.get('sharedTournamentId');
    if (requestedSharedId) {
      setRemoteStateInitialized(false);
      setSharedTournamentId(requestedSharedId);
      loadTournamentFromCloud(requestedSharedId, false);
    }
  }, []);

  useEffect(() => {
    if (!sharedTournamentId) return;
    let cancelled = false;

    const pollRemoteRefereeState = async () => {
      try {
        const payload = await fetchTournamentFromCloudRaw(sharedTournamentId);
        if (!cancelled) mergeRemoteRefereeState(payload);
      } catch (error) {
        // ignore background sync errors
      }
    };

    pollRemoteRefereeState();
    const remotePollIntervalMs = mode === 'organizer' ? 300 : mode === 'public' ? 400 : 800;
    const intervalId = window.setInterval(pollRemoteRefereeState, remotePollIntervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [sharedTournamentId, mode]);

  const refereeRealtimeSignature = useMemo(() => JSON.stringify({
    selected: refereeSelectedMatch,
    b1: brassage1.matches.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    b2: brassage2.matches.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    pm: mainStage.principaleMatches.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    cm: mainStage.consolanteMatches.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    pq: knockout.principalQuarters.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    ps: knockout.principalSemis.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    pf: knockout.principalFinals.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    cs: knockout.consolanteSemis.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    cf: knockout.consolanteFinals.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    c1: championshipLeg1.matches.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    c2: championshipLeg2.matches.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    sq: singleKnockout.quarters.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    ss: singleKnockout.semis.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
    sf: singleKnockout.finals.map(({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress }) => ({ id, submittedScoreA, submittedScoreB, submittedAt, refereeInProgress, matchInProgress })),
  }), [refereeSelectedMatch, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout.principalQuarters, knockout.principalSemis, knockout.principalFinals, knockout.consolanteSemis, knockout.consolanteFinals, championshipLeg1.matches, championshipLeg2.matches, singleKnockout.quarters, singleKnockout.semis, singleKnockout.finals]);

  useEffect(() => {
    if (mode !== 'referee' || !sharedTournamentId || !remoteStateInitialized) return;
    if (autoRefereeSyncTimeoutRef.current) window.clearTimeout(autoRefereeSyncTimeoutRef.current);
    autoRefereeSyncTimeoutRef.current = window.setTimeout(() => {
      saveTournamentToCloud(false, true);
    }, 200);
    return () => {
      if (autoRefereeSyncTimeoutRef.current) window.clearTimeout(autoRefereeSyncTimeoutRef.current);
    };
  }, [mode, sharedTournamentId, remoteStateInitialized, refereeRealtimeSignature]);

  const organizerCloudSignature = useMemo(() => JSON.stringify({
    tournamentName,
    sharedTournamentId,
    teams,
    startTime,
    slotDuration,
    phaseRules,
    brassage1,
    brassage2,
    mainStage,
    knockout,
    championshipLeg1,
    championshipLeg2,
    singleKnockout,
  }), [tournamentName, sharedTournamentId, teams, startTime, slotDuration, phaseRules, brassage1, brassage2, mainStage, knockout, championshipLeg1, championshipLeg2, singleKnockout]);

  useEffect(() => {
    if (mode !== 'organizer' || !sharedTournamentId) return;
    if (backgroundCloudSaveTimeoutRef.current) window.clearTimeout(backgroundCloudSaveTimeoutRef.current);
    backgroundCloudSaveTimeoutRef.current = window.setTimeout(() => {
      saveTournamentToCloud(false, true);
    }, 800);
    return () => {
      if (backgroundCloudSaveTimeoutRef.current) window.clearTimeout(backgroundCloudSaveTimeoutRef.current);
    };
  }, [mode, sharedTournamentId, organizerCloudSignature]);

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

  const currentMatches = useMemo(() => (
    allCompetitionMatches
      .filter((match) => isMatchCurrentlyInProgress(match, phaseRules))
      .sort((a, b) => (scheduleData.scheduleMap[a.id]?.startMinutes || 0) - (scheduleData.scheduleMap[b.id]?.startMinutes || 0))
      .slice(0, MAX_ACTIVE_COURTS)
      .map((match) => ({
        ...match,
        time: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
      }))
  ), [allCompetitionMatches, phaseRules, scheduleData]);

  const upcomingMatches = useMemo(() => (
    allCompetitionMatches
      .filter((match) => {
        if (isMatchCurrentlyInProgress(match, phaseRules)) return false;
        return toNumber(match.scoreA) === null || toNumber(match.scoreB) === null || !isMatchResultValid(match, phaseRules);
      })
      .sort((a, b) => (scheduleData.scheduleMap[a.id]?.startMinutes || 0) - (scheduleData.scheduleMap[b.id]?.startMinutes || 0))
      .slice(0, MAX_ACTIVE_COURTS)
      .map((match) => ({
        ...match,
        time: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
      }))
  ), [allCompetitionMatches, phaseRules, scheduleData]);

  const publicPodiumLeaders = useMemo(() => {
    const extractPodium = (matches) => {
      const finalMatch = matches.find((match) => match.group === 'Finale');
      const smallFinal = matches.find((match) => match.group === 'Petite finale');
      const finalResult = finalMatch ? getWinnerLoser(finalMatch, phaseRules) : { winner: null, loser: null };
      const smallResult = smallFinal ? getWinnerLoser(smallFinal, phaseRules) : { winner: null, loser: null };
      return {
        first: finalResult.winner || null,
        second: finalResult.loser || null,
        third: smallResult.winner || null,
      };
    };

    const principale = extractPodium(knockout.principalFinals);
    const consolante = extractPodium(knockout.consolanteFinals);
    const tournamentFinished = Boolean(principale.first && principale.second && principale.third && consolante.first && consolante.second && consolante.third);

    return { tournamentFinished, principale, consolante };
  }, [knockout.principalFinals, knockout.consolanteFinals, phaseRules]);

  const featuredPublicMatches = useMemo(() => {
    if (publicPodiumLeaders.tournamentFinished) {
      return [
        {
          type: 'podium',
          title: '1res places',
          principalTeamId: publicPodiumLeaders.principale.first,
          consolanteTeamId: publicPodiumLeaders.consolante.first,
        },
        {
          type: 'podium',
          title: '2es places',
          principalTeamId: publicPodiumLeaders.principale.second,
          consolanteTeamId: publicPodiumLeaders.consolante.second,
        },
        {
          type: 'podium',
          title: '3es places',
          principalTeamId: publicPodiumLeaders.principale.third,
          consolanteTeamId: publicPodiumLeaders.consolante.third,
        },
      ];
    }

    const items = currentMatches
      .filter((match) => {
        const teamAName = String(resolveTeam(match.teamAId).name || '').trim().toLowerCase();
        const teamBName = String(resolveTeam(match.teamBId).name || '').trim().toLowerCase();
        return teamAName !== 'à définir' && teamBName !== 'à définir';
      })
      .map((match, index) => ({
        type: 'match',
        title: currentMatches.length > 1 ? `Match en cours ${index + 1}` : 'Match en cours',
        match,
      }));
    const remainingSlots = Math.max(0, MAX_ACTIVE_COURTS - items.length);
    upcomingMatches
      .filter((match) => {
        const teamAName = String(resolveTeam(match.teamAId).name || '').trim().toLowerCase();
        const teamBName = String(resolveTeam(match.teamBId).name || '').trim().toLowerCase();
        return teamAName !== 'à définir' && teamBName !== 'à définir';
      })
      .slice(0, remainingSlots)
      .forEach((match, index) => {
        items.push({
          type: 'match',
          title: `Prochain match ${index + 1}`,
          match,
        });
      });
    return items;
  }, [currentMatches, upcomingMatches, publicPodiumLeaders, resolveTeam]);

  const visibleBrassage1Matches = useMemo(() => filterMatchesToPools(brassage1.matches, brassage1.pools, 'Brassage 1'), [brassage1.matches, brassage1.pools]);
  const visibleBrassage2Matches = useMemo(() => filterMatchesToPools(brassage2.matches, brassage2.pools, 'Brassage 2'), [brassage2.matches, brassage2.pools]);
  const visiblePrincipaleMatches = useMemo(() => filterMatchesToPools(mainStage.principaleMatches, mainStage.principalePools, 'Principale'), [mainStage.principaleMatches, mainStage.principalePools]);
  const visibleConsolanteMatches = useMemo(() => filterMatchesToPools(mainStage.consolanteMatches, mainStage.consolantePools, 'Consolante'), [mainStage.consolanteMatches, mainStage.consolantePools]);

  const completedMatchCounts = isSmallTournamentMode ? {
    championnatAller: championshipLeg1.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    championnatRetour: championshipLeg2.matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    quart: singleKnockout.quarters.filter((m) => isMatchResultValid(m, phaseRules)).length,
    demi: singleKnockout.semis.filter((m) => isMatchResultValid(m, phaseRules)).length,
    finale: singleKnockout.finals.filter((m) => isMatchResultValid(m, phaseRules)).length,
  } : {
    b1: visibleBrassage1Matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    b2: visibleBrassage2Matches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    principale: visiblePrincipaleMatches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    consolante: visibleConsolanteMatches.filter((m) => isMatchResultValid(m, phaseRules)).length,
    ko: [...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals, ...knockout.consolanteSemis, ...knockout.consolanteFinals].filter((m) => isMatchResultValid(m, phaseRules)).length,
  };

  const stageValidation = useMemo(() => isSmallTournamentMode ? ({
    championnatAllerComplete: championshipLeg1.matches.length > 0 && championshipLeg1.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    championnatRetourComplete: championshipLeg2.matches.length > 0 && championshipLeg2.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    quarterComplete: singleKnockout.quarters.length === 0 || singleKnockout.quarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    semiComplete: singleKnockout.semis.length === 0 || singleKnockout.semis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }) : ({
    brassage1Complete: visibleBrassage1Matches.length > 0 && visibleBrassage1Matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    brassage2Complete: visibleBrassage2Matches.length > 0 && visibleBrassage2Matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalePoolsComplete: mainStage.principaleMatches.length > 0 && mainStage.principaleMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolantePoolsComplete: mainStage.consolanteMatches.length > 0 && mainStage.consolanteMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalQuartersComplete: knockout.principalQuarters.length > 0 && knockout.principalQuarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalSemisComplete: knockout.principalSemis.length > 0 && knockout.principalSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolanteSemisComplete: knockout.consolanteSemis.length > 0 && knockout.consolanteSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout, phaseRules]);

  const filterRefereeVisibleMatches = useCallback((matches) => (
    dedupeMatches(Array.isArray(matches) ? matches : [])
      .filter((match) => hasBothTeamsDefined(match) && getMatchStatusLabel(match, phaseRules) !== 'Valide')
  ), [phaseRules]);

  const refereeMatchGroups = useMemo(() => (isSmallTournamentMode ? [
    { title: 'Championnat Aller', scope: 'championshipLeg1', matches: filterRefereeVisibleMatches(championshipLeg1.matches), isUnlocked: true, lockReason: '' },
    { title: 'Championnat Retour', scope: 'championshipLeg2', matches: filterRefereeVisibleMatches(championshipLeg2.matches), isUnlocked: stageValidation.championnatAllerComplete, lockReason: 'Tous les scores du Championnat Aller doivent être valides.' },
    { title: 'Quarts de finale', scope: 'quarters', matches: filterRefereeVisibleMatches(singleKnockout.quarters), isUnlocked: stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete, lockReason: 'Tous les scores du Championnat Aller et Retour doivent être valides.' },
    { title: 'Demi-finales', scope: 'semis', matches: filterRefereeVisibleMatches(singleKnockout.semis), isUnlocked: stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete && (singleKnockout.quarters.length === 0 || stageValidation.quarterComplete), lockReason: singleKnockout.quarters.length ? 'Tous les scores des quarts de finale doivent être valides.' : 'Tous les scores du Championnat Aller et Retour doivent être valides.' },
    { title: 'Finale et petite finale', scope: 'finals', matches: filterRefereeVisibleMatches(singleKnockout.finals), isUnlocked: (singleKnockout.semis.length ? stageValidation.semiComplete : stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete), lockReason: singleKnockout.semis.length ? 'Tous les scores des demi-finales doivent être valides.' : 'Tous les scores du Championnat Aller et Retour doivent être valides.' },
  ] : [
    { title: 'Brassage 1', scope: 'brassage1', matches: filterRefereeVisibleMatches(brassage1.matches), isUnlocked: true, lockReason: '' },
    { title: 'Brassage 2', scope: 'brassage2', matches: filterRefereeVisibleMatches(brassage2.matches), isUnlocked: stageValidation.brassage1Complete, lockReason: 'Tous les scores du Brassage 1 doivent être valides.' },
    { title: 'Principale', scope: 'principale', matches: filterRefereeVisibleMatches(mainStage.principaleMatches), isUnlocked: stageValidation.brassage2Complete, lockReason: 'Tous les scores du Brassage 2 doivent être valides.' },
    { title: 'Consolante', scope: 'consolante', matches: filterRefereeVisibleMatches(mainStage.consolanteMatches), isUnlocked: stageValidation.brassage2Complete, lockReason: 'Tous les scores du Brassage 2 doivent être valides.' },
    { title: 'Quarts principale', scope: 'principalQuarters', matches: filterRefereeVisibleMatches(knockout.principalQuarters), isUnlocked: stageValidation.principalePoolsComplete, lockReason: 'Tous les scores des poules principales doivent être valides.' },
    { title: 'Demi-finales principale', scope: 'principalSemis', matches: filterRefereeVisibleMatches(knockout.principalSemis), isUnlocked: stageValidation.principalQuartersComplete, lockReason: 'Tous les scores des quarts de finale principaux doivent être valides.' },
    { title: 'Finales principale', scope: 'principalFinals', matches: filterRefereeVisibleMatches(knockout.principalFinals), isUnlocked: stageValidation.principalSemisComplete, lockReason: 'Tous les scores des demi-finales principales doivent être valides.' },
    { title: 'Demi-finales consolante', scope: 'consolanteSemis', matches: filterRefereeVisibleMatches(knockout.consolanteSemis), isUnlocked: stageValidation.consolantePoolsComplete, lockReason: 'Tous les scores des poules de consolante doivent être valides.' },
    { title: 'Finales consolante', scope: 'consolanteFinals', matches: filterRefereeVisibleMatches(knockout.consolanteFinals), isUnlocked: stageValidation.consolanteSemisComplete, lockReason: 'Tous les scores des demi-finales de consolante doivent être valides.' },
  ]), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout, stageValidation, filterRefereeVisibleMatches]);

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

  useEffect(() => {
    if (!showOrganizerLogin) return;
    const timer = window.setTimeout(() => organizerLoginInputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [showOrganizerLogin]);

  function countMatchesWithStatus(matches, targetStatus = 'Valide') {
    return matches.filter((match) => getMatchStatusLabel(match, phaseRules) === targetStatus).length;
  }

  function hasAnyValidMatch(matches) {
    return countMatchesWithStatus(matches, 'Valide') > 0;
  }

  function hasAnyOfficiallyValidatedMatch(matches) {
    return matches.some((match) => Boolean(match?.validatedAt) && isMatchResultValid(match, phaseRules));
  }

  const teamLevelLocked = useMemo(() => isSmallTournamentMode ? hasAnyValidMatch(championshipLeg1.matches) : hasAnyValidMatch(brassage1.matches), [isSmallTournamentMode, championshipLeg1.matches, brassage1.matches, phaseRules]);
  const teamDeletionLocked = useMemo(() => isSmallTournamentMode ? hasAnyOfficiallyValidatedMatch(championshipLeg1.matches) : hasAnyOfficiallyValidatedMatch(brassage1.matches), [isSmallTournamentMode, championshipLeg1.matches, brassage1.matches, phaseRules]);
  const teamAdditionLocked = useMemo(() => {
    const firstPhaseGenerated = isSmallTournamentMode ? championshipLeg1.matches.length > 0 : brassage1.matches.length > 0;
    return teams.length >= TEAM_TARGET || firstPhaseGenerated;
  }, [isSmallTournamentMode, championshipLeg1.matches.length, brassage1.matches.length, teams.length]);
  const generateBrassage1Locked = hasDuplicateTeamNames;

  const phaseRuleLocks = useMemo(() => ({
    brassage1: {
      locked: hasAnyValidMatch([...brassage1.matches, ...brassage2.matches, ...mainStage.principaleMatches, ...mainStage.consolanteMatches, ...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals, ...knockout.consolanteSemis, ...knockout.consolanteFinals]),
      reason: 'Paramètre verrouillé dès qu’un match valide existe en Brassage 1 ou dans une phase dépendante.'
    },
    brassage2: {
      locked: hasAnyValidMatch([...brassage2.matches, ...mainStage.principaleMatches, ...mainStage.consolanteMatches, ...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals, ...knockout.consolanteSemis, ...knockout.consolanteFinals]),
      reason: 'Paramètre verrouillé dès qu’un match valide existe en Brassage 2 ou dans une phase suivante.'
    },
    principale: {
      locked: hasAnyValidMatch([...mainStage.principaleMatches, ...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals]),
      reason: 'Paramètre verrouillé dès qu’un match valide existe en Principale ou dans ses phases finales.'
    },
    consolante: {
      locked: hasAnyValidMatch([...mainStage.consolanteMatches, ...knockout.consolanteSemis, ...knockout.consolanteFinals]),
      reason: 'Paramètre verrouillé dès qu’un match valide existe en Consolante ou dans ses phases finales.'
    },
    championnatAller: {
      locked: hasAnyValidMatch([...championshipLeg1.matches, ...championshipLeg2.matches, ...singleKnockout.quarters, ...singleKnockout.semis, ...singleKnockout.finals]),
      reason: 'Paramètre verrouillé dès qu’un match valide existe au Championnat Aller ou dans une phase dépendante.'
    },
    championnatRetour: {
      locked: hasAnyValidMatch([...championshipLeg2.matches, ...singleKnockout.quarters, ...singleKnockout.semis, ...singleKnockout.finals]),
      reason: 'Paramètre verrouillé dès qu’un match valide existe au Championnat Retour ou dans une phase finale.'
    },
    quart: {
      locked: hasAnyValidMatch([...singleKnockout.quarters, ...singleKnockout.semis, ...singleKnockout.finals, ...knockout.principalQuarters, ...knockout.principalSemis, ...knockout.principalFinals]),
      reason: 'Paramètre verrouillé dès qu’un quart de finale valide existe ou qu’une phase finale dépendante a commencé.'
    },
    demi: {
      locked: hasAnyValidMatch([...singleKnockout.semis, ...singleKnockout.finals, ...knockout.principalSemis, ...knockout.principalFinals, ...knockout.consolanteSemis, ...knockout.consolanteFinals]),
      reason: 'Paramètre verrouillé dès qu’une demi-finale valide existe ou qu’une finale dépendante a commencé.'
    },
    finale: {
      locked: hasAnyValidMatch([
        ...singleKnockout.finals.filter((match) => match.group === 'Finale'),
        ...knockout.principalFinals.filter((match) => match.group === 'Finale'),
        ...knockout.consolanteFinals.filter((match) => match.group === 'Finale')
      ]),
      reason: 'Paramètre verrouillé dès qu’une finale valide existe.'
    },
    petiteFinale: {
      locked: hasAnyValidMatch([
        ...singleKnockout.finals.filter((match) => match.group === 'Petite finale'),
        ...knockout.principalFinals.filter((match) => match.group === 'Petite finale'),
        ...knockout.consolanteFinals.filter((match) => match.group === 'Petite finale')
      ]),
      reason: 'Paramètre verrouillé dès qu’une petite finale valide existe.'
    },
  }), [phaseRules, brassage1.matches, brassage2.matches, mainStage, knockout, championshipLeg1.matches, championshipLeg2.matches, singleKnockout]);

  function resolveTeam(teamId) {
    const team = teamMap.get(teamId);
    return { name: team?.name || 'À définir', level: team?.level || 'L' };
  }

  function countValidMatches(matches) {
    return countMatchesWithStatus(matches, 'Valide');
  }

  function confirmOverwritePlayedMatches(matches, label) {
    const validCount = countValidMatches(matches);
    if (!validCount) return true;
    const first = window.confirm(`${validCount} match(s) déjà joué(s) dans ${label} seront effacés si tu continues. Veux-tu poursuivre ?`);
    if (!first) return false;
    return window.confirm(`Confirmation finale : ${validCount} match(s) valide(s) seront définitivement effacés dans ${label}. Confirmer ?`);
  }

  function updatePhaseRule(ruleKey, field, value) {
    if (phaseRuleLocks[ruleKey]?.locked) return;
    setPhaseRules((current) => ({ ...current, [ruleKey]: { ...current[ruleKey], [field]: value } }));
  }

  function teamName(teamId) {
    return teamMap.get(teamId)?.name || 'À définir';
  }

  function enterPublicMode() {
    if (sharedTournamentId) queueBackgroundCloudSave(0);
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
    if (sharedTournamentId) queueBackgroundCloudSave(0);
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
    if (organizerPassword === '') {
      setIsOrganizerAuthenticated(true);
      setMode('organizer');
      setActiveTab('dashboard');
      setShowOrganizerLogin(false);
      setOrganizerAttempt('');
      setLoginError('');
      return;
    }
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

  function buildFreshTournamentState(options = {}) {
    const preserveSharedId = options.preserveSharedId !== false;
    const preservePassword = options.preservePassword !== false;
    const resetLevelsToL = options.resetLevelsToL === true;
    const nextSharedTournamentId = preserveSharedId ? (String(sharedTournamentId || '').trim() || buildDefaultSharedTournamentId('Tournoi de volley')) : buildDefaultSharedTournamentId('Tournoi de volley');
    const nextOrganizerPassword = preservePassword ? organizerPassword : 'Chuly0ne';
    return {
      teams: resetLevelsToL ? defaultTeamsAllLevelL() : defaultTeams(),
      settings: {
        startTime: '09:00',
        slotDuration: 20,
        phaseRules: safeClone(DEFAULT_PHASE_RULES, DEFAULT_PHASE_RULES),
        organizerPassword: nextOrganizerPassword,
        tournamentName: 'Tournoi de volley',
        tournamentLogo: '',
        sharedTournamentId: nextSharedTournamentId,
      },
      meta: { lastSavedAt: '', remoteSavedAt: '' },
      brassage1: { pools: [], matches: [] },
      brassage2: { pools: [], matches: [] },
      mainStage: { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] },
      knockout: { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] },
      championshipLeg1: { pools: [], matches: [] },
      championshipLeg2: { pools: [], matches: [] },
      singleKnockout: { quarters: [], semis: [], finals: [] },
    };
  }

  async function startNewTournament() {
    const confirmed = window.confirm('Créer un nouveau tournoi ? Toutes les données du tournoi en cours seront réinitialisées.');
    if (!confirmed) return;
    const resetStartedAt = new Date().toISOString();
    pendingFreshTournamentTimestampRef.current = resetStartedAt;
    const freshState = {
      ...buildFreshTournamentState({ preserveSharedId: true, preservePassword: true, resetLevelsToL: true }),
      meta: { lastSavedAt: resetStartedAt, remoteSavedAt: '' },
    };
    applyPersistedState(freshState);
    setRemoteStateInitialized(mode !== 'referee');
    setRemoteSyncMessage('');
    setIsRemoteSyncing(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    }
    if (String(freshState.settings?.sharedTournamentId || '').trim()) {
      const savedAt = new Date().toISOString();
      const cloudPayload = {
        ...freshState,
        meta: { ...(freshState.meta || {}), remoteSavedAt: savedAt },
      };
      try {
        const response = await fetch(buildFirebaseTournamentUrl(freshState.settings.sharedTournamentId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cloudPayload),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body?.error || 'Impossible de réinitialiser le tournoi sur Firebase.');
        }
        pendingFreshTournamentTimestampRef.current = savedAt;
        applyPersistedState(cloudPayload);
        setRemoteSavedAt(savedAt);
        setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(savedAt)}`);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudPayload));
        }
      } catch (error) {
        setRemoteSyncMessage(error.message || 'Échec de la réinitialisation Firebase.');
        window.alert(error.message || 'Échec de la réinitialisation Firebase.');
        return;
      }
    }
    window.alert('Nouveau tournoi prêt. Toutes les données du tournoi précédent ont été réinitialisées.');
  }

  function updateOrganizerPassword() {
    const nextPassword = String(passwordDraft ?? '');
    setOrganizerPassword(nextPassword);
    setPasswordDraft(nextPassword);
    window.alert(nextPassword === '' ? 'Mot de passe organisateur retiré. L’accès organisateur est maintenant direct.' : 'Mot de passe organisateur mis à jour.');
  }

  async function handleTournamentLogoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const normalizedLogo = await normalizeImageFileToSquareDataUrl(file);
      setTournamentLogo(normalizedLogo);
      window.alert('Logo du tournoi mis à jour.');
    } catch (error) {
      window.alert(error.message || 'Impossible de charger ce logo.');
    } finally {
      if (event.target) event.target.value = '';
    }
  }

  function clearTournamentLogo() {
    setTournamentLogo('');
  }

  function regenerateBrassage1FromTeams(nextTeams) {
    const readyTeams = normalizeTeamsList(nextTeams).filter((team) => (team.name || '').trim() !== '');
    const seededIds = sortTeamsForSeeding(readyTeams).map((team) => team.id);
    const pools = createPools(seededIds, createNumberedNames('Brassage 1 - Poule', 6));
    const matches = scheduleBrassageMatches(pools, 'Brassage 1', 0);
    setBrassage1({ pools, matches });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    queueBackgroundCloudSave(250);
  }

  function updateTeam(teamId, field, value) {
    setTeams((current) => {
      const nextTeams = current.map((team) => (team.id === teamId ? { ...team, [field]: value } : team));
      const shouldRegenerateBrassage1 = field === 'level' && !isSmallTournamentMode && brassage1.matches.length > 0;
      if (shouldRegenerateBrassage1) {
        regenerateBrassage1FromTeams(nextTeams);
      }
      return nextTeams;
    });
  }

  function addTeam() {
    const firstPhaseGenerated = isSmallTournamentMode ? championshipLeg1.matches.length > 0 : brassage1.matches.length > 0;
    if (firstPhaseGenerated) {
      window.alert(isSmallTournamentMode ? 'Impossible d’ajouter une équipe après la génération du Championnat Aller.' : 'Impossible d’ajouter une équipe après la génération du Brassage 1.');
      return;
    }
    setTeams((current) => {
      if (current.length >= TEAM_TARGET) {
        window.alert(`Le tournoi standard est limité à ${TEAM_TARGET} équipes.`);
        return current;
      }
      return [...current, { id: uid('team'), name: `Équipe ${current.length + 1}`, level: 'D', club: '', contact: '' }];
    });
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
    const resetStartedAt = new Date().toISOString();
    pendingFreshTournamentTimestampRef.current = resetStartedAt;
    const freshState = {
      ...buildFreshTournamentState({ preserveSharedId: true, preservePassword: false }),
      meta: { lastSavedAt: resetStartedAt, remoteSavedAt: '' },
    };
    applyPersistedState(freshState);
    setRemoteStateInitialized(mode !== 'referee');
    setRemoteSyncMessage('');
    setIsRemoteSyncing(false);
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
    if (hasDuplicateTeamNames) {
      window.alert('Impossible de générer le brassage 1 tant que des doublons de nom d’équipe sont présents.');
      return;
    }
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
      queueBackgroundCloudSave(250);
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
    queueBackgroundCloudSave(250);
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
      if (!stageValidation.championnatAllerComplete) {
        window.alert('Tous les scores du Championnat Aller doivent être valides avant de générer le Championnat Retour.');
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
      queueBackgroundCloudSave(250);
      return;
    }
    if (brassage1.matches.length === 0) {
      window.alert('Génère d’abord le brassage 1.');
      return;
    }
    if (!stageValidation.brassage1Complete) {
      window.alert('Tous les scores du Brassage 1 doivent être valides avant de générer le Brassage 2.');
      return;
    }
    const rankedIds = rankingAfterBrassage1.map((row) => row.teamId);
    const pools = createPools(rankedIds, createNumberedNames('Brassage 2 - Poule', 6));
    const matches = scheduleBrassageMatches(pools, 'Brassage 2', stageSlotCount(brassage1.matches.length));
    setBrassage2({ pools, matches });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setActiveTab('brassage2');
    queueBackgroundCloudSave(250);
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
    queueBackgroundCloudSave(250);
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
    queueBackgroundCloudSave(250);
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
    queueBackgroundCloudSave(250);
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
    if (!stageValidation.brassage2Complete) {
      window.alert('Tous les scores du Brassage 2 doivent être valides avant de générer la phase suivante.');
      return;
    }
    const rankedIds = rankingAfterBrassages.map((row) => row.teamId);
    const principaleIds = rankedIds.slice(0, 12);
    const consolanteIds = rankedIds.slice(12, 18);
    const principalePools = createPools(principaleIds, PRINCIPALE_POOL_NAMES);
    const consolantePools = createPools(consolanteIds, CONSOLANTE_POOL_NAMES);
    const scheduled = scheduleMainStageMatches(
      principalePools,
      consolantePools,
      stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length),
    );

    setMainStage({
      principalePools,
      principaleMatches: scheduled.filter((match) => match.phase === 'Principale'),
      consolantePools,
      consolanteMatches: scheduled.filter((match) => match.phase === 'Consolante'),
    });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setActiveTab('principale');
    queueBackgroundCloudSave(250);
  }

  function generatePrincipalQuarters() {
    if (!confirmOverwritePlayedMatches([
      ...knockout.principalQuarters,
      ...knockout.principalSemis,
      ...knockout.principalFinals,
    ], 'les quarts et la suite du tableau principal')) return;
    if (!mainStage.principalePools.length) {
      window.alert('Génère d’abord la principale.');
      return;
    }
    if (!stageValidation.principalePoolsComplete) {
      window.alert('Tous les scores des poules principales doivent être valides avant de générer les quarts principale.');
      return;
    }
    const pA = getStandingsRowsForPool(principaleStandings, mainStage.principalePools, 'A');
    const pB = getStandingsRowsForPool(principaleStandings, mainStage.principalePools, 'B');
    const pC = getStandingsRowsForPool(principaleStandings, mainStage.principalePools, 'C');
    const pD = getStandingsRowsForPool(principaleStandings, mainStage.principalePools, 'D');
    const principalQuartersRaw = sanitizeKnockoutMatches([
      makeKnockoutMatch('Tableau principal', 'Quart 1', pA[0]?.teamId || null, pD[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 2', pB[0]?.teamId || null, pC[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 3', pC[0]?.teamId || null, pB[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 4', pD[0]?.teamId || null, pA[1]?.teamId || null),
    ]);
    const principalQuarters = stampGeneratedMatches(assignSchedule(
      principalQuartersRaw,
      stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length),
    ));
    setKnockout((current) => ({
      ...current,
      principalQuarters: sanitizeKnockoutMatches(principalQuarters),
      principalSemis: [],
      principalFinals: [],
    }));
    setActiveTab('finales');
    queueBackgroundCloudSave(250);
  }

  function generateConsolanteSemis() {
    if (!confirmOverwritePlayedMatches([
      ...knockout.consolanteSemis,
      ...knockout.consolanteFinals,
    ], 'les demi-finales et finales de consolante')) return;
    if (!mainStage.consolantePools.length) {
      window.alert('Génère d’abord la consolante.');
      return;
    }
    if (!stageValidation.consolantePoolsComplete) {
      window.alert('Tous les scores des poules de consolante doivent être valides avant de générer les demi-finales consolante.');
      return;
    }
    const cA = getStandingsRowsForPool(consolanteStandings, mainStage.consolantePools, 'A');
    const cB = getStandingsRowsForPool(consolanteStandings, mainStage.consolantePools, 'B');
    const consolanteSemisRaw = sanitizeKnockoutMatches([
      makeKnockoutMatch('Tableau consolante', 'Demi 1', cA[0]?.teamId || null, cB[1]?.teamId || null),
      makeKnockoutMatch('Tableau consolante', 'Demi 2', cB[0]?.teamId || null, cA[1]?.teamId || null),
    ]);
    const consolanteSemis = stampGeneratedMatches(assignSchedule(
      consolanteSemisRaw,
      stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length) + stageSlotCount(knockout.principalQuarters.length),
    ));
    setKnockout((current) => ({
      ...current,
      consolanteSemis: sanitizeKnockoutMatches(consolanteSemis),
      consolanteFinals: [],
    }));
    setActiveTab('finales');
    queueBackgroundCloudSave(250);
  }

  function generatePrincipalSemis() {
    if (!confirmOverwritePlayedMatches([
      ...knockout.principalSemis,
      ...knockout.principalFinals,
    ], 'les demi-finales et finales principale')) return;
    const canGeneratePrincipalSemis = knockout.principalQuarters.length > 0 && stageValidation.principalQuartersComplete;
    if (!canGeneratePrincipalSemis) {
      window.alert('Tous les quarts de finale principaux doivent être valides avant de générer les demi-finales principale.');
      return;
    }
    const q1 = getWinnerLoser(knockout.principalQuarters[0], phaseRules);
    const q2 = getWinnerLoser(knockout.principalQuarters[1], phaseRules);
    const q3 = getWinnerLoser(knockout.principalQuarters[2], phaseRules);
    const q4 = getWinnerLoser(knockout.principalQuarters[3], phaseRules);
    if (!q1.winner || !q2.winner || !q3.winner || !q4.winner) {
      window.alert('Renseigne d’abord des scores valides pour les quarts principale.');
      return;
    }
    const principalSemisRaw = [
      makeKnockoutMatch('Tableau principal', 'Demi 1', q1.winner, q2.winner),
      makeKnockoutMatch('Tableau principal', 'Demi 2', q3.winner, q4.winner),
    ];
    const startSlot = stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length) + stageSlotCount(knockout.principalQuarters.length + knockout.consolanteSemis.length);
    setKnockout((current) => ({
      ...current,
      principalSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignSchedule(principalSemisRaw, startSlot))),
      principalFinals: [],
    }));
    queueBackgroundCloudSave(250);
  }

  function generateConsolanteFinals() {
    if (!confirmOverwritePlayedMatches(knockout.consolanteFinals, 'les finales de consolante')) return;
    const canGenerateConsolanteFinals = knockout.consolanteSemis.length > 0 && stageValidation.consolanteSemisComplete;
    if (!canGenerateConsolanteFinals) {
      window.alert('Toutes les demi-finales de consolante doivent être valides avant de générer les finales de consolante.');
      return;
    }
    const c1 = getWinnerLoser(knockout.consolanteSemis[0], phaseRules);
    const c2 = getWinnerLoser(knockout.consolanteSemis[1], phaseRules);
    if (!c1.winner || !c2.winner) {
      window.alert('Renseigne d’abord des scores valides pour les demi-finales de consolante.');
      return;
    }
    const consolanteFinalsRaw = [
      makeKnockoutMatch('Tableau consolante', 'Petite finale', c1.loser, c2.loser),
      makeKnockoutMatch('Tableau consolante', 'Finale', c1.winner, c2.winner),
    ];
    const startSlot = stageSlotCount(brassage1.matches.length) + stageSlotCount(brassage2.matches.length) + stageSlotCount(mainStage.principaleMatches.length + mainStage.consolanteMatches.length) + stageSlotCount(knockout.principalQuarters.length + knockout.consolanteSemis.length);
    setKnockout((current) => ({
      ...current,
      consolanteFinals: sanitizeKnockoutMatches(stampGeneratedMatches(assignSchedule(consolanteFinalsRaw, startSlot))),
    }));
    queueBackgroundCloudSave(250);
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
    setKnockout((current) => ({ ...current, principalFinals: stampGeneratedMatches(assignSchedule(finalsRaw, startSlot)) }));
  }

  function updateMatchesInScope(scope, updater) {
    const applyUpdater = (matches) => dedupeMatches(updater(dedupeMatches(Array.isArray(matches) ? matches : [])));
    if (scope === 'championshipLeg1') return setChampionshipLeg1((current) => ({ ...current, matches: applyUpdater(current.matches) }));
    if (scope === 'championshipLeg2') return setChampionshipLeg2((current) => ({ ...current, matches: applyUpdater(current.matches) }));
    if (scope === 'quarters') return setSingleKnockout((current) => ({ ...current, quarters: applyUpdater(current.quarters) }));
    if (scope === 'semis') return setSingleKnockout((current) => ({ ...current, semis: applyUpdater(current.semis) }));
    if (scope === 'finals') return setSingleKnockout((current) => ({ ...current, finals: applyUpdater(current.finals) }));
    if (scope === 'brassage1') return setBrassage1((current) => ({ ...current, matches: applyUpdater(current.matches) }));
    if (scope === 'brassage2') return setBrassage2((current) => ({ ...current, matches: applyUpdater(current.matches) }));
    if (scope === 'principale') return setMainStage((current) => ({ ...current, principaleMatches: applyUpdater(current.principaleMatches) }));
    if (scope === 'consolante') return setMainStage((current) => ({ ...current, consolanteMatches: applyUpdater(current.consolanteMatches) }));
    if (scope === 'principalQuarters') return setKnockout((current) => ({ ...current, principalQuarters: applyUpdater(current.principalQuarters) }));
    if (scope === 'principalSemis') return setKnockout((current) => ({ ...current, principalSemis: applyUpdater(current.principalSemis) }));
    if (scope === 'principalFinals') return setKnockout((current) => ({ ...current, principalFinals: applyUpdater(current.principalFinals) }));
    if (scope === 'consolanteSemis') return setKnockout((current) => ({ ...current, consolanteSemis: applyUpdater(current.consolanteSemis) }));
    return setKnockout((current) => ({ ...current, consolanteFinals: applyUpdater(current.consolanteFinals) }));
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
    const hasStarted = ((pendingA ?? 0) > 0) || ((pendingB ?? 0) > 0);
    if (match.refereeInProgress || match.matchInProgress || hasStarted) {
      return 'Match en cours';
    }
    return 'À saisir';
  }

  function updateOfficialMatchScore(scope, matchId, field, value) {
    const normalized = value === '' ? '' : Math.max(0, Number(value));
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      const officialEditTimestamp = new Date().toISOString();
      const updated = {
        ...match,
        [field]: normalized,
        submittedScoreA: '',
        submittedScoreB: '',
        submittedAt: null,
        refereeInProgress: false,
        matchInProgress: false,
        manualOverrideAt: officialEditTimestamp,
      };
      updated.validatedAt = isMatchResultValid(updated, phaseRules) ? officialEditTimestamp : null;
      return updated;
    }));
    queueBackgroundCloudSave();
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
        refereeInProgress: true,
        matchInProgress: true,
      };
    }));
    queueBackgroundCloudSave(0);
  }

  function stepRefereeMatchScore(scope, matchId, field, delta) {
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRules) === 'Valide') return match;
      const currentValue = toNumber(field === 'scoreA' ? match.submittedScoreA : match.submittedScoreB) ?? 0;
      const nextValue = Math.max(0, currentValue + delta);
      return {
        ...match,
        [field]: match[field],
        [field === 'scoreA' ? 'submittedScoreA' : 'submittedScoreB']: nextValue,
        submittedAt: new Date().toISOString(),
        refereeInProgress: true,
        matchInProgress: true,
      };
    }));
    queueBackgroundCloudSave(0);
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
        refereeInProgress: false,
        matchInProgress: false,
      };
      approved.manualOverrideAt = null;
      approved.validatedAt = isMatchResultValid(approved, phaseRules) ? new Date().toISOString() : null;
      return approved;
    }));
    queueBackgroundCloudSave();
  }

  function rejectRefereeScore(scope, matchId) {
    updateMatchesInScope(scope, (matches) => matches.map((match) => (
      match.id === matchId
        ? { ...match, submittedScoreA: '', submittedScoreB: '', submittedAt: new Date().toISOString(), refereeInProgress: false, matchInProgress: false }
        : match
    )));
    queueBackgroundCloudSave();
  }

  function reassignRefereeWithoutReset(scope, matchId) {
    recentRefereeReleaseRef.current.set(matchId, { until: Date.now() + 4000 });
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      return {
        ...match,
        submittedAt: new Date().toISOString(),
        refereeInProgress: false,
        matchInProgress: true,
      };
    }));
    setRefereeSelectedMatch((current) => (current && current.scope === scope && current.matchId === matchId ? null : current));
    queueBackgroundCloudSave(250);
  }

  function releaseRefereeSelectedMatch(entry) {
    if (!entry?.match) {
      setRefereeSelectedMatch(null);
      return;
    }
    const pendingA = toNumber(entry.match.submittedScoreA);
    const pendingB = toNumber(entry.match.submittedScoreB);
    const hasStarted = ((pendingA ?? 0) !== 0) || ((pendingB ?? 0) !== 0);
    if (!hasStarted && getMatchStatusLabel(entry.match, phaseRules) !== 'Valide') {
      updateMatchesInScope(entry.scope, (matches) => matches.map((match) => (
        match.id === entry.match.id
          ? { ...match, refereeInProgress: false, matchInProgress: false, submittedScoreA: '', submittedScoreB: '', submittedAt: new Date().toISOString() }
          : match
      )));
      queueBackgroundCloudSave();
    }
    setRefereeSelectedMatch(null);
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
        applyPersistedState(parsed);
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
      <div className="cards-grid one-up standings-full-width-grid">
        {cards.map(({ pool, rows }) => (
          <div key={pool.id} className="mini-card">
            <div className="mini-card-head">{pool.name}</div>
            <div className="table-wrap">
              <table className="standings-table">
                <colgroup>
                  <col className="col-rank" />
                  <col className="col-team" />
                  <col className="col-j" />
                  <col className="col-v" />
                  <col className="col-pts" />
                  <col className="col-diff" />
                </colgroup>
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
                      <td><TeamBadge name={row.teamName} level={row.level} /></td>
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

  function renderOrganizerMatches(matches, scope) {
    const uniqueMatches = dedupeMatches(Array.isArray(matches) ? matches : []);
    const availableTeamIds = new Set();
    uniqueMatches.forEach((match) => {
      if (match?.teamAId) availableTeamIds.add(match.teamAId);
      if (match?.teamBId) availableTeamIds.add(match.teamBId);
    });
    const availableTeams = teams
      .filter((team) => availableTeamIds.has(team.id))
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fr', { sensitivity: 'base' }));
    const effectiveTeamFilter = availableTeamIds.has(organizerMatchTeamFilter) ? organizerMatchTeamFilter : '';
    const filteredMatches = filterMatchesBySelectedTeam(uniqueMatches, effectiveTeamFilter);
    if (!uniqueMatches.length) return <div className="empty-state">Aucun match généré pour le moment.</div>;
    return (
      <>
        <div className="match-filter-row">
          <label htmlFor={`match-team-filter-${scope}`}>Filtrer par équipe</label>
          <select id={`match-team-filter-${scope}`} value={effectiveTeamFilter} onChange={(e) => setOrganizerMatchTeamFilter(e.target.value)}>
            <option value="">Toutes les équipes</option>
            {availableTeams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table className="matches-table">
            <thead>
              <tr>
                <th className="column-match">Match</th>
                <th>Équipe A</th>
                <th>Score officiel</th>
                <th>Équipe B</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => {
                const status = getMatchStatusLabel(match, phaseRules);
                const originalMatchNumber = uniqueMatches.findIndex((item) => item.id === match.id) + 1;
                const pendingStatus = getPendingStatus(match);
                const pendingA = toNumber(match.submittedScoreA);
                const pendingB = toNumber(match.submittedScoreB);
                const isValid = status === 'Valide';
                const canApprovePending = !isValid && match.refereeInProgress && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules);
                const schedule = scheduleData.scheduleMap[match.id];
                return (
                  <tr key={match.id} className={status === 'Score invalide' ? 'row-invalid' : ''}>
                    <td className="match-meta-cell">
                      <div className="match-meta-stack">
                        <span className="match-meta-time">{schedule?.startText || match.time}</span>
                        <span className="match-meta-line"><strong>Match {originalMatchNumber}</strong></span>
                        <span className="match-meta-line">Terrain {match.court}</span>
                        <span className="match-meta-line">{formatPoolLabel(match.group)}</span>
                      </div>
                    </td>
                    <td className="match-team-cell"><TeamBadge name={resolveTeam(match.teamAId).name} level={resolveTeam(match.teamAId).level} /></td>
                    <td>
                      <div className="score-inputs">
                        <input type="number" min="0" inputMode="numeric" value={match.scoreA} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreA', e.target.value)} />
                        <span>-</span>
                        <input type="number" min="0" inputMode="numeric" value={match.scoreB} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreB', e.target.value)} />
                      </div>
                    </td>
                    <td className="match-team-cell"><TeamBadge name={resolveTeam(match.teamBId).name} level={resolveTeam(match.teamBId).level} /></td>
                    <td>
                      <div className="status-cell">
                        <span className={`badge ${isValid ? 'badge-success' : status === 'Score invalide' ? 'badge-danger' : 'badge-neutral'}`}>{status}</span>
                        {!isValid && pendingStatus === 'Match en cours' ? (
                          <>
                            <span className="badge badge-neutral">Match en cours</span>
                            <span className="muted tiny">Saisie arbitre : {match.submittedScoreA} - {match.submittedScoreB}</span>
                            {canApprovePending ? (
                              <div className="actions-row compact-actions">
                                <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                                <Button variant="secondary" onClick={() => rejectRefereeScore(scope, match.id)}>Refuser</Button>
                              </div>
                            ) : null}
                          </>
                        ) : null}
                        {!isValid ? (
                          <div className="actions-row compact-actions">
                            <Button
                              variant={match.refereeInProgress ? 'info' : 'secondary'}
                              onClick={() => reassignRefereeWithoutReset(scope, match.id)}
                              disabled={!match.refereeInProgress}
                            >
                              Changer l’arbitre
                            </Button>
                          </div>
                        ) : null}
                        {!isValid && schedule ? <span className="muted tiny">Fin prévue : {schedule.endText}</span> : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filteredMatches.length ? <div className="empty-state">Aucun match pour cette équipe dans cette phase.</div> : null}
        </div>
      </>
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
    const pendingA = toNumber(match.submittedScoreA);
    const pendingB = toNumber(match.submittedScoreB);
    const hasStarted = !isLocked && (((pendingA ?? 0) !== 0) || ((pendingB ?? 0) !== 0));
    const canChooseAnotherMatch = !hasStarted;
    const badgeText = officialStatus === 'Valide'
      ? 'Valide'
      : pendingStatus === 'Match en cours'
        ? 'Match en cours'
        : 'À saisir';
    const badgeClass = officialStatus === 'Valide'
      ? 'badge-success'
      : match.refereeInProgress
        ? 'badge-danger'
        : 'badge-neutral';
    const phaseRule = getRuleForMatch(match, phaseRules);
    const winningScore = Number(phaseRule?.winningScore) || 21;
    const modeLabel = phaseRule?.mode === 'twoPointGap' ? 'avec 2 points d’écart' : 'sec';
    const contextText = `${match.group} • Terrain ${match.court} • Début prévu : ${schedule?.startText || match.time}`;
    const phaseCaption = (match.phase || title || '').toUpperCase();

    return (
      <div className="referee-focus-card">
        <div className="referee-focus-head">
          <div>
            <div className="referee-phase-caption">{phaseCaption}</div>
            <h2>{resolveTeam(match.teamAId).name} <span className="muted">vs</span> {resolveTeam(match.teamBId).name}</h2>
            <p className="muted referee-match-context">{contextText}</p>
            <p className="referee-match-format">Match en {winningScore} {modeLabel}</p>
          </div>
          <div className="actions-row">
            <Button variant="secondary" onClick={() => releaseRefereeSelectedMatch(entry)} disabled={!canChooseAnotherMatch}>Choisir un autre match</Button>
          </div>
        </div>

        <div className="referee-focus-body">
          <div className="referee-team-card">
            <span className="muted small">Équipe A</span>
<TeamBadge name={resolveTeam(match.teamAId).name} level={resolveTeam(match.teamAId).level} className="team-badge-large" />
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
                <div className="score-stepper">
                  <button
                    type="button"
                    className="score-stepper-btn"
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreA', 1)}
                    aria-label={`Augmenter le score de ${resolveTeam(match.teamAId).name}`}
                  >
                    ▲
                  </button>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={displayScoreA}
                    onChange={(e) => updateRefereeMatchScore(scope, match.id, 'scoreA', e.target.value)}
                  />
                  <button
                    type="button"
                    className="score-stepper-btn"
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreA', -1)}
                    aria-label={`Diminuer le score de ${resolveTeam(match.teamAId).name}`}
                    disabled={(toNumber(displayScoreA) ?? 0) <= 0}
                  >
                    ▼
                  </button>
                </div>
                <span className="score-separator">-</span>
                <div className="score-stepper">
                  <button
                    type="button"
                    className="score-stepper-btn"
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreB', 1)}
                    aria-label={`Augmenter le score de ${resolveTeam(match.teamBId).name}`}
                  >
                    ▲
                  </button>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={displayScoreB}
                    onChange={(e) => updateRefereeMatchScore(scope, match.id, 'scoreB', e.target.value)}
                  />
                  <button
                    type="button"
                    className="score-stepper-btn"
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreB', -1)}
                    aria-label={`Diminuer le score de ${resolveTeam(match.teamBId).name}`}
                    disabled={(toNumber(displayScoreB) ?? 0) <= 0}
                  >
                    ▼
                  </button>
                </div>
              </div>
            )}
            <div className="status-cell center-status">
              <span className={`badge ${badgeClass}`}>{badgeText}</span>
              {isLocked ? <span className="muted tiny">Match verrouillé : déjà validé par l’organisateur</span> : null}
            </div>
          </div>
          <div className="referee-team-card">
            <span className="muted small">Équipe B</span>
<TeamBadge name={resolveTeam(match.teamBId).name} level={resolveTeam(match.teamBId).level} className="team-badge-large" />
          </div>
        </div>
      </div>
    );
  }

  function renderOverallRanking(rows, withStatus = false, activeTeamIds = null) {
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
            {rows.map((row, index) => {
              const isInRefereeGame = Boolean(activeTeamIds?.has(row.teamId));
              return (
                <tr key={row.teamId}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="inline-cluster">
                      <TeamBadge name={row.teamName} level={row.level} className="team-badge-inline">
                        {isInRefereeGame ? <span className="team-badge-status">&nbsp;(En jeu)</span> : null}
                      </TeamBadge>
                    </div>
                  </td>
                  <td>{row.level}</td>
                  <td>{row.played}</td>
                  <td>{row.wins}</td>
                  <td>{row.tournamentPoints}</td>
                  <td>{row.pointDiff}</td>
                  {withStatus ? <td>{index < 12 ? 'Principale' : 'Consolante'}</td> : null}
                </tr>
              );
            })}
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
        <div className="podium-steps podium-steps-model">
          <div className="podium-lane podium-lane-second">
            <div className="podium-team-label">{finalResult.loser ? <TeamBadge name={resolveTeam(finalResult.loser).name} level={resolveTeam(finalResult.loser).level} className="podium-team-badge" /> : 'À venir'}</div>
            <div className="podium-stick" aria-hidden="true" />
            <div className="podium-step podium-step-second">
              <div className="podium-step-rank">2e</div>
            </div>
          </div>
          <div className="podium-lane podium-lane-first">
            <div className="podium-team-label">{finalResult.winner ? <TeamBadge name={resolveTeam(finalResult.winner).name} level={resolveTeam(finalResult.winner).level} className="podium-team-badge" /> : 'À venir'}</div>
            <div className="podium-stick" aria-hidden="true" />
            <div className="podium-step podium-step-first">
              <div className="podium-step-rank">1er</div>
            </div>
          </div>
          <div className="podium-lane podium-lane-third">
            <div className="podium-team-label">{smallResult.winner ? <TeamBadge name={resolveTeam(smallResult.winner).name} level={resolveTeam(smallResult.winner).level} className="podium-team-badge" /> : 'À venir'}</div>
            <div className="podium-stick" aria-hidden="true" />
            <div className="podium-step podium-step-third">
              <div className="podium-step-rank">3e</div>
            </div>
          </div>
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
          <input ref={organizerLoginInputRef} type="password" value={organizerAttempt} onChange={(e) => setOrganizerAttempt(e.target.value)} placeholder="Mot de passe" />
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
            {featuredPublicMatches.map((item, index) => (
              item.type === 'podium' ? (
                <PublicPodiumHighlightCard
                  key={`podium-${index}-${item.title}`}
                  title={item.title}
                  principalTeamId={item.principalTeamId}
                  consolanteTeamId={item.consolanteTeamId}
                  resolveTeam={resolveTeam}
                />
              ) : (
                <LargePublicMatch key={item.match.id} title={item.title} match={item.match} resolveTeam={resolveTeam} phaseRules={phaseRules} />
              )
            ))}
          </div>

          <div className="stack-gap">
            <Section title="Classement cumulé" subtitle="Tous les matchs officiels valides sont pris en compte.">
              {renderOverallRanking(overallRanking, false, activeInProgressTeamIds)}
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
            {!remoteStateInitialized ? <div className="info-banner">Chargement des données partagées en cours…</div> : null}
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
                          const statusText = officialStatus === 'Valide'
                            ? 'Valide'
                            : pendingStatus === 'Match en cours'
                              ? 'Match en cours'
                              : 'À saisir';
                          const badgeClass = officialStatus === 'Valide'
                            ? 'badge-success'
                            : match.refereeInProgress
                              ? 'badge-danger'
                              : 'badge-neutral';
                          const canSelectExistingInProgressMatch = group.isUnlocked && officialStatus !== 'Valide' && !match.refereeInProgress && Boolean(match.matchInProgress);
                          const canSelectNewMatch = group.isUnlocked && officialStatus !== 'Valide' && !match.refereeInProgress && !match.matchInProgress && activeOccupiedMatchCount < MAX_ACTIVE_COURTS;
                          const canSelect = canSelectExistingInProgressMatch || canSelectNewMatch;
                          const disabledReason = !group.isUnlocked
                            ? group.lockReason
                            : match.refereeInProgress
                              ? 'Match déjà en cours de saisie par un arbitre.'
                              : !match.matchInProgress && activeOccupiedMatchCount >= MAX_ACTIVE_COURTS
                                ? 'Les 3 terrains sont déjà occupés par des matchs en cours.'
                                : '';
                          return (
                            <button
                              key={match.id}
                              className={`referee-selector-item ${canSelect ? '' : 'referee-selector-item-disabled'}`}
                              onClick={() => {
                                if (!canSelect) return;
                                updateMatchesInScope(group.scope, (matches) => matches.map((item) => (
                                  item.id === match.id ? { ...item, refereeInProgress: true, matchInProgress: true, submittedAt: new Date().toISOString() } : item
                                )));
                                setRefereeSelectedMatch({ scope: group.scope, matchId: match.id });
                                queueBackgroundCloudSave(50);
                              }}
                              disabled={!canSelect}
                              title={disabledReason}
                            >
                              <div>
                                <div className="referee-selector-teams"><TeamBadge name={resolveTeam(match.teamAId).name} level={resolveTeam(match.teamAId).level} /><span className="muted tiny">vs</span><TeamBadge name={resolveTeam(match.teamBId).name} level={resolveTeam(match.teamBId).level} /></div>
                                <div className="muted tiny">{formatPoolLabel(match.group)} • Terrain {match.court} • {schedule?.startText || match.time}</div>
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
        <header className={`hero hero-organizer-banner ${tournamentLogo ? 'hero-organizer-banner-with-logo' : ''}`.trim()} style={organizerBannerStyle}>
          <div className="banner-side banner-left">
            <AccessQrCode
              url={refereeAccessUrl}
              title="Accès arbitres"
              alt="QR code d’accès au mode arbitres"
              caption="Scanne ce QR code pour ouvrir directement le mode Arbitres."
              topImageSrc="/organizer-banner-bg.png"
              topImageAlt="Logo NEO DEV ChulyOne"
            />
          </div>
          <div className="hero-controls hero-controls-centered">
            <div className="hero-brand">
              <div className="hero-tag">tournoidevolley.fr</div>
              <div className="hero-version">Version {APP_VERSION}</div>
            </div>
            <input
              className="hero-title-input"
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              onBlur={() => {
                const trimmedName = String(tournamentName || '').trim();
                if (!trimmedName) setTournamentName('Tournoi de volley');
                else if (trimmedName !== tournamentName) setTournamentName(trimmedName);
              }}
              placeholder="Nom du tournoi"
              aria-label="Nom du tournoi"
            />
            <label>
              <span>Début</span>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <div className="hero-pill">
              <span>Fin estimée du tournoi</span>
              <strong>{estimatedTournamentEnd}</strong>
            </div>
            <div className="actions-stack hero-actions-centered">
              <Button variant="success" onClick={() => saveTournamentState(true)}>Sauvegarder</Button>
              <Button variant="secondary" onClick={enterRefereeMode}>Mode arbitres</Button>
              <Button variant="secondary" onClick={enterPublicMode}>Affichage public</Button>
              <Button variant="danger" onClick={startNewTournament}>Nouveau tournoi</Button>
            </div>
            <div className="muted small banner-meta">Identifiant partagé Firebase : <strong>{sharedTournamentId}</strong></div>
            {lastSavedAt ? <div className="muted small banner-meta">Dernière sauvegarde locale : {new Date(lastSavedAt).toLocaleString('fr-FR')}</div> : null}
            {remoteSavedAt ? <div className="muted small banner-meta">Dernière sauvegarde Firebase : {new Date(remoteSavedAt).toLocaleString('fr-FR')}</div> : null}
            {remoteSyncMessage ? <div className="muted small banner-meta">{remoteSyncMessage}</div> : null}
          </div>
          <div className="banner-side banner-right">
            <AccessQrCode
              url={publicAccessUrl}
              title="Accès public"
              alt="QR code d’accès à l’affichage public"
              caption="Scanne ce QR code pour ouvrir directement l’affichage public du tournoi."
            />
          </div>
          <div className="organizer-banner-email">Lvangchuly@gmail.com</div>
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
                    <StatCard label="Brassage 1" value={`${completedMatchCounts.b1}/${visibleBrassage1Matches.length || 0}`} subvalue="6 poules de 3" />
                    <StatCard label="Brassage 2" value={`${completedMatchCounts.b2}/${visibleBrassage2Matches.length || 0}`} subvalue="6 poules de 3" />
                    <StatCard label="Principale" value={`${completedMatchCounts.principale}/${visiblePrincipaleMatches.length || 0}`} subvalue="4 poules de 3" />
                    <StatCard label="Consolante" value={`${completedMatchCounts.consolante}/${visibleConsolanteMatches.length || 0}`} subvalue="2 poules de 3" />
                    <StatCard label="Leader" value={rankingAfterBrassages[0]?.teamName || '-'} subvalue={`${rankingAfterBrassages[0]?.tournamentPoints ?? 0} pts`} />
                  </>
                )}
              </div>

              <Section title="Accès organisateur" subtitle="Modifie le mot de passe organisateur. Tu peux aussi laisser le champ vide pour autoriser un accès direct sans mot de passe.">
                <div className="login-grid organizer-password-grid">
                  <input
                    type="password"
                    value={passwordDraft}
                    onChange={(e) => setPasswordDraft(e.target.value)}
                    placeholder="Laisser vide pour un accès direct"
                    aria-label="Mot de passe organisateur"
                  />
                  <Button type="button" variant="secondary" onClick={updateOrganizerPassword}>Enregistrer le mot de passe</Button>
                </div>
                <p className="muted small organizer-password-help">
                  Mot de passe actuel : {organizerPassword === '' ? 'aucun mot de passe' : 'défini'}
                </p>
              </Section>

              <Section title="Logo du tournoi" subtitle="Télécharge un logo qui sera répété en mosaïque sur toute la banderole Organisateur. Chaque logo est affiché à environ un quart du QR code Arbitres pour rester bien visible.">
                <div className="tournament-logo-grid">
                  <div className="tournament-logo-preview-card">
                    <div className="muted small">Aperçu du logo</div>
                    <div className={`tournament-logo-preview ${tournamentLogo ? 'has-logo' : ''}`}>
                      {tournamentLogo ? <img src={tournamentLogo} alt="Logo du tournoi" /> : <span>Aucun logo téléchargé</span>}
                    </div>
                    <p className="muted small tournament-logo-help">
                      La banderole répète le logo en mosaïque avec des tuiles d’environ {ORGANIZER_BANNER_LOGO_TILE_SIZE}px.
                    </p>
                  </div>
                  <div className="tournament-logo-actions">
                    <input
                      ref={tournamentLogoInputRef}
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={handleTournamentLogoChange}
                    />
                    <Button type="button" variant="secondary" onClick={() => tournamentLogoInputRef.current?.click()}>Télécharger un logo</Button>
                    <Button type="button" variant="secondary" onClick={clearTournamentLogo} disabled={!tournamentLogo}>Retirer le logo</Button>
                    <p className="muted small tournament-logo-help">
                      Formats image acceptés. Le logo est automatiquement recentré dans un carré pour un rendu régulier sur la banderole.
                    </p>
                  </div>
                </div>
              </Section>

              <Section title="Paramètres de score par phase" subtitle="Chaque phase dispose de son score gagnant et de son contexte de validation.">
                <div className="cards-grid two-up">
                  {isSmallTournamentMode ? (
                    <>
                      <PhaseRuleEditor title="Championnat Aller" value={phaseRules.championnatAller} disabled={phaseRuleLocks.championnatAller.locked} disabledReason={phaseRuleLocks.championnatAller.reason} onScoreChange={(value) => updatePhaseRule('championnatAller', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('championnatAller', 'mode', value)} />
                      <PhaseRuleEditor title="Championnat Retour" value={phaseRules.championnatRetour} disabled={phaseRuleLocks.championnatRetour.locked} disabledReason={phaseRuleLocks.championnatRetour.reason} onScoreChange={(value) => updatePhaseRule('championnatRetour', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('championnatRetour', 'mode', value)} />
                      <PhaseRuleEditor title="Quart de finale" value={phaseRules.quart} disabled={phaseRuleLocks.quart.locked} disabledReason={phaseRuleLocks.quart.reason} onScoreChange={(value) => updatePhaseRule('quart', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('quart', 'mode', value)} />
                      <PhaseRuleEditor title="Demi-finale" value={phaseRules.demi} disabled={phaseRuleLocks.demi.locked} disabledReason={phaseRuleLocks.demi.reason} onScoreChange={(value) => updatePhaseRule('demi', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('demi', 'mode', value)} />
                      <PhaseRuleEditor title="Finale" value={phaseRules.finale} disabled={phaseRuleLocks.finale.locked} disabledReason={phaseRuleLocks.finale.reason} onScoreChange={(value) => updatePhaseRule('finale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('finale', 'mode', value)} />
                      <PhaseRuleEditor title="Petite finale" value={phaseRules.petiteFinale} disabled={phaseRuleLocks.petiteFinale.locked} disabledReason={phaseRuleLocks.petiteFinale.reason} onScoreChange={(value) => updatePhaseRule('petiteFinale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('petiteFinale', 'mode', value)} />
                    </>
                  ) : (
                    <>
                      <PhaseRuleEditor title="Brassage 1" value={phaseRules.brassage1} disabled={phaseRuleLocks.brassage1.locked} disabledReason={phaseRuleLocks.brassage1.reason} onScoreChange={(value) => updatePhaseRule('brassage1', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('brassage1', 'mode', value)} />
                      <PhaseRuleEditor title="Brassage 2" value={phaseRules.brassage2} disabled={phaseRuleLocks.brassage2.locked} disabledReason={phaseRuleLocks.brassage2.reason} onScoreChange={(value) => updatePhaseRule('brassage2', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('brassage2', 'mode', value)} />
                      <PhaseRuleEditor title="Principale" value={phaseRules.principale} disabled={phaseRuleLocks.principale.locked} disabledReason={phaseRuleLocks.principale.reason} onScoreChange={(value) => updatePhaseRule('principale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('principale', 'mode', value)} />
                      <PhaseRuleEditor title="Consolante" value={phaseRules.consolante} disabled={phaseRuleLocks.consolante.locked} disabledReason={phaseRuleLocks.consolante.reason} onScoreChange={(value) => updatePhaseRule('consolante', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('consolante', 'mode', value)} />
                      <PhaseRuleEditor title="Quart de finale" value={phaseRules.quart} disabled={phaseRuleLocks.quart.locked} disabledReason={phaseRuleLocks.quart.reason} onScoreChange={(value) => updatePhaseRule('quart', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('quart', 'mode', value)} />
                      <PhaseRuleEditor title="Demi-finale" value={phaseRules.demi} disabled={phaseRuleLocks.demi.locked} disabledReason={phaseRuleLocks.demi.reason} onScoreChange={(value) => updatePhaseRule('demi', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('demi', 'mode', value)} />
                      <PhaseRuleEditor title="Finale" value={phaseRules.finale} disabled={phaseRuleLocks.finale.locked} disabledReason={phaseRuleLocks.finale.reason} onScoreChange={(value) => updatePhaseRule('finale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('finale', 'mode', value)} />
                      <PhaseRuleEditor title="Petite finale" value={phaseRules.petiteFinale} disabled={phaseRuleLocks.petiteFinale.locked} disabledReason={phaseRuleLocks.petiteFinale.reason} onScoreChange={(value) => updatePhaseRule('petiteFinale', 'winningScore', value)} onModeChange={(value) => updatePhaseRule('petiteFinale', 'mode', value)} />
                    </>
                  )}
                </div>
              </Section>

              <Section title="Informations" subtitle="Explication du calcul des points et rappel du déroulé du tournoi." right={isSmallTournamentMode ? <><Button onClick={generateBrassage1} disabled={generateBrassage1Locked}>1. Générer Aller</Button><Button variant="secondary" onClick={generateBrassage2}>2. Générer Retour</Button><Button variant="success" onClick={generateSmallKnockoutStage1}>3. Générer tableau final</Button></> : <><Button onClick={generateBrassage1} disabled={generateBrassage1Locked}>1. Générer brassage 1</Button><Button variant="secondary" onClick={generateBrassage2}>2. Générer brassage 2</Button><Button variant="success" onClick={generateMainStage}>3. Générer principale / consolante</Button></>}>
                <div className="cards-grid two-up info-grid">
                  <div className="mini-card info-card">
                    <div className="mini-card-head">Calcul des points</div>
                    <p className="muted small">L’équipe gagnante marque le score gagnant multiplié par 2, puis on ajoute l’écart de points. L’équipe perdante conserve ses points marqués puis on retire cet écart.</p>
                    <p className="muted small"><strong>Exemple :</strong> sur un match en 21, une victoire 21 à 17 donne <strong>46 points</strong> au vainqueur (2 × 21 + 4) et <strong>13 points</strong> au perdant (17 − 4).</p>
                    <p className="muted small">Ces points servent ensuite à départager les équipes dans les classements de poules, de brassage et dans le classement cumulé.</p>
                    {hasDuplicateTeamNames ? <p className="helper-text danger-text">Des doublons de nom d’équipe sont détectés. Le brassage 1 reste bloqué tant qu’ils ne sont pas corrigés.</p> : null}
                  </div>
                  <div className="mini-card"><div className="mini-card-head">Fin estimée du tournoi</div><p className="muted">{estimatedTournamentEnd}</p><div className="mini-card-head top-gap">Classement général</div>{renderOverallRanking(isSmallTournamentMode ? championshipRanking : overallRanking)}</div>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'equipes' && (
            <Section title="Équipes" subtitle="N = 5, NP = 4, R = 3, D = 2, L = 1. Le brassage 1 s’appuie sur ce niveau pour faire les têtes de série." right={<><Button variant="secondary" onClick={addTeam} disabled={teamAdditionLocked}>Ajouter</Button><Button onClick={generateBrassage1} disabled={generateBrassage1Locked}>Générer brassage 1</Button></>}>
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
                      <tr key={team.id} className={isDuplicateTeamName(team.name) ? "duplicate-team-row" : ""}>
                        <td><span className={isDuplicateTeamName(team.name) ? "duplicate-team-index" : ""}>{index + 1}</span></td>
                        <td className="team-name-cell"><input className={`team-name-color-input ${getLevelClass(team.level)} ${isDuplicateTeamName(team.name) ? "duplicate-team-name-input" : ""}`} value={team.name} onChange={(e) => updateTeam(team.id, 'name', e.target.value)} placeholder="Nom de l'équipe" /></td>
                        <td>
                          <select value={team.level} disabled={teamLevelLocked} onChange={(e) => updateTeam(team.id, 'level', e.target.value)}>
                            {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
                          </select>
                        </td>
                        <td><input value={team.club} onChange={(e) => updateTeam(team.id, 'club', e.target.value)} /></td>
                        <td><input value={team.contact} onChange={(e) => updateTeam(team.id, 'contact', e.target.value)} /></td>
                        <td>{teamDeletionLocked ? null : <Button variant="danger" onClick={() => removeTeam(team.id)}>Supprimer</Button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {teamLevelLocked ? <p className="muted small helper-text">Le niveau d’équipe est verrouillé dès qu’un match valide existe dans la première phase du tournoi. Le nom reste modifiable.</p> : null}
              <p className="muted small helper-text">Maximum {TEAM_TARGET} équipes. Le bouton Ajouter est bloqué à partir de {TEAM_TARGET} équipes et dès que la première phase du tournoi est générée.</p>
              {hasDuplicateTeamNames ? <p className="helper-text danger-text">Les numéros en couleur signalent des doublons de nom d’équipe. Corrigez-les avant de générer le brassage 1.</p> : null}
              {teamDeletionLocked ? <p className="muted small helper-text">Le bouton Supprimer disparaît dès qu’un premier match de la phase 1 est officiellement validé.</p> : null}
            </Section>
          )}


          {activeTab === 'championship' && isSmallTournamentMode && (
            <>
              <Section title="Championnat Aller" subtitle="Toutes les équipes se rencontrent une première fois pour construire le classement général." right={<Button onClick={generateBrassage2}>Générer le Championnat Retour</Button>}>
                {renderStandings(championshipLeg1Standings)}
              </Section>
              <Section title={`Matchs du Championnat Aller : ${formatRemainingMatchesLabel(championshipLeg1.matches, phaseRules)}`}>{renderOrganizerMatches(championshipLeg1.matches, 'championshipLeg1')}</Section>
              <Section title="Championnat Retour" subtitle="Toutes les équipes se rencontrent une seconde fois. Le classement cumule l’aller et le retour." right={<Button onClick={generateSmallKnockoutStage1}>Générer tableau final</Button>}>
                {renderStandings(championshipLeg2Standings)}
              </Section>
              <Section title={`Matchs du Championnat Retour : ${formatRemainingMatchesLabel(championshipLeg2.matches, phaseRules)}`}>{renderOrganizerMatches(championshipLeg2.matches, 'championshipLeg2')}</Section>
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
              <Section title={`Matchs du brassage 1 : ${formatRemainingMatchesLabel(visibleBrassage1Matches, phaseRules)}`}>{renderOrganizerMatches(visibleBrassage1Matches, 'brassage1')}</Section>
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
              <Section title={`Matchs du brassage 2 : ${formatRemainingMatchesLabel(visibleBrassage2Matches, phaseRules)}`}>{renderOrganizerMatches(visibleBrassage2Matches, 'brassage2')}</Section>
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
              <Section title={`Matchs de la principale : ${formatRemainingMatchesLabel(visiblePrincipaleMatches, phaseRules)}`}>{renderOrganizerMatches(visiblePrincipaleMatches, 'principale')}</Section>
              <Section title="Poules consolante" subtitle="2 poules de 3 issues des 6 équipes restantes, avec méthode serpent." right={<><Button variant="success" onClick={generatePrincipalQuarters}>Générer quarts principale</Button><Button variant="secondary" onClick={generateConsolanteSemis}>Générer demies consolante</Button></>}>
                {renderStandings(consolanteStandings)}
              </Section>
              <Section title={`Matchs de la consolante : ${formatRemainingMatchesLabel(visibleConsolanteMatches, phaseRules)}`}>{renderOrganizerMatches(visibleConsolanteMatches, 'consolante')}</Section>
            </>
          )}

          {activeTab === 'finales' && (
            <>
              {isSmallTournamentMode ? (
                <>
                  <Section title={`Quarts de finale : ${formatRemainingMatchesLabel(singleKnockout.quarters, phaseRules)}`} subtitle="Générés uniquement si le nombre d’équipes classées est compris entre 5 et 8." right={<><Button onClick={generateSmallKnockoutStage1}>Regénérer le premier tour</Button><Button variant="success" onClick={generateSmallKnockoutStage2}>Générer les demi-finales</Button></>}>
                    {renderOrganizerMatches(singleKnockout.quarters, 'quarters')}
                  </Section>

                  <Section title={`Demi-finales : ${formatRemainingMatchesLabel(singleKnockout.semis, phaseRules)}`} subtitle="Créées directement pour 3 ou 4 équipes, ou après les quarts pour 5 à 8 équipes." right={<Button variant="success" onClick={generateSmallKnockoutStage3}>Générer la finale et la petite finale</Button>}>
                    {renderOrganizerMatches(singleKnockout.semis, 'semis')}
                  </Section>

                  <Section title={`Finale et petite finale : ${formatRemainingMatchesLabel(singleKnockout.finals, phaseRules)}`} subtitle="Dernière étape du tournoi.">
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
                  <Section title="Étape 1 des tableaux finaux" subtitle="Principale : quarts de finale. Consolante : demi-finales." right={<><Button onClick={generatePrincipalQuarters}>Regénérer quarts principale</Button><Button variant="secondary" onClick={generateConsolanteSemis}>Régénérer demies consolante</Button><Button variant="success" onClick={generatePrincipalSemis}>Générer demies principale</Button><Button variant="success" onClick={generateConsolanteFinals}>Générer finales consolante</Button></>}>
                    <div className="cards-grid one-up knockout-step-grid">
                      <div className="knockout-panel">
                        <h3>{`Quarts de finale principale : ${formatRemainingMatchesLabel(knockout.principalQuarters, phaseRules)}`}</h3>
                        {renderOrganizerMatches(knockout.principalQuarters, 'principalQuarters')}
                      </div>
                      <div className="knockout-panel">
                        <h3>{`Demi-finales consolante : ${formatRemainingMatchesLabel(knockout.consolanteSemis, phaseRules)}`}</h3>
                        {renderOrganizerMatches(knockout.consolanteSemis, 'consolanteSemis')}
                      </div>
                    </div>
                  </Section>

                  <Section title="Étape 2 des tableaux finaux" subtitle="Principale : demi-finales. Consolante : finale et petite finale." right={<Button variant="success" onClick={generatePrincipalFinals}>Générer finale principale</Button>}>
                    <div className="cards-grid one-up knockout-step-grid">
                      <div className="knockout-panel">
                        <h3>{`Demi-finales principale : ${formatRemainingMatchesLabel(knockout.principalSemis, phaseRules)}`}</h3>
                        {renderOrganizerMatches(knockout.principalSemis, 'principalSemis')}
                      </div>
                      <div className="knockout-panel">
                        <h3>{`Finales consolante : ${formatRemainingMatchesLabel(knockout.consolanteFinals, phaseRules)}`}</h3>
                        {renderOrganizerMatches(knockout.consolanteFinals, 'consolanteFinals')}
                      </div>
                    </div>
                  </Section>

                  <Section title={`Étape 3 du tableau principal : ${formatRemainingMatchesLabel(knockout.principalFinals, phaseRules)}`} subtitle="Finale et petite finale pour déterminer les 3 premières équipes du tournoi.">
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
            <Section title="Sauvegarde" subtitle="Export, import, sauvegarde locale et partage Firebase du tournoi." right={<><Button onClick={exportState}>Exporter JSON</Button><Button variant="secondary" onClick={copyState}>Copier JSON</Button><Button variant="secondary" onClick={() => saveTournamentToCloud(true)}>Sauvegarder sur Firebase</Button><Button variant="secondary" onClick={() => loadTournamentFromCloud(sharedTournamentId, true)}>Charger Firebase</Button><Button variant="secondary" onClick={() => importRef.current?.click()}>Importer JSON</Button><Button variant="danger" onClick={resetTournament}>Réinitialiser</Button></>}>
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
                  <div className="field-stack">
                    <label>
                      <span>Identifiant partagé Firebase</span>
                      <input value={sharedTournamentId} onChange={(e) => setSharedTournamentId(slugify(e.target.value))} placeholder="tournoi-partage" />
                    </label>
                  </div>
                  <ul className="simple-list">
                    <li>Sauvegarde locale automatique et bouton de sauvegarde manuelle</li>
                    <li>Partage OVHcloud via JSON commun pour organisateur et arbitres</li>
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
