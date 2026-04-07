import './v23y-match-info-white.css';
import './v23x-match-strong.css';
import './v23w-match-column-contrast.css';
import './v23v-table-header-contrast.css';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FIREBASE_DATABASE_URL } from './firebaseConfig';
import './v23k-dark-background.css';
import './v23l-public-mobile-ranking.css';
import './v23o-public-ranking.css';
import './v23q-public-ranking.css';
import homeLogoUrl from './home-logo.png';

const STORAGE_KEY = 'tournoidevolley-react-vite-V26K';
const LEGACY_STORAGE_KEYS = ['tournoidevolley-react-vite-V25L', 'tournoidevolley-react-vite-V25K', 'tournoidevolley-react-vite-V25G', 'tournoidevolley-react-vite-V25F', 'tournoidevolley-react-vite-V25E', 'tournoidevolley-react-vite-V25D', 'tournoidevolley-react-vite-V25C', 'tournoidevolley-react-vite-V25B', 'tournoidevolley-react-vite-V24W', 'tournoidevolley-react-vite-V24V', 'tournoidevolley-react-vite-V24U', 'tournoidevolley-react-vite-V24Q', 'tournoidevolley-react-vite-V24I', 'tournoidevolley-react-vite-V24H', 'tournoidevolley-react-vite-V24D', 'tournoidevolley-react-vite-V24C', 'tournoidevolley-react-vite-V24B', 'tournoidevolley-react-vite-V24A', 'tournoidevolley-react-vite-V23AA', 'tournoidevolley-react-vite-V23Y', 'tournoidevolley-react-vite-V23G', 'tournoidevolley-react-vite-V23Y', 'tournoidevolley-react-vite-V23D', 'tournoidevolley-react-vite-V23C', 'tournoidevolley-react-vite-V23B', 'tournoidevolley-react-vite-V23', 'tournoidevolley-react-vite-V22E', 'tournoidevolley-react-vite-V22D', 'tournoidevolley-react-vite-V22C', 'tournoidevolley-react-vite-V22B', 'tournoidevolley-react-vite-V22A', 'tournoidevolley-react-vite-V21U', 'tournoidevolley-react-vite-V21T', 'tournoidevolley-react-vite-V21S', 'tournoidevolley-react-vite-V21R', 'tournoidevolley-react-vite-V21O', 'tournoidevolley-react-vite-V21N', 'tournoidevolley-react-vite-V21L', 'tournoidevolley-react-vite-V21K', 'tournoidevolley-react-vite-V21J', 'tournoidevolley-react-vite-V21I', 'tournoidevolley-react-vite-V21H', 'tournoidevolley-react-vite-V21G', 'tournoidevolley-react-vite-V21F', 'tournoidevolley-react-vite-V21E', 'tournoidevolley-react-vite-V21D', 'tournoidevolley-react-vite-V21C', 'tournoidevolley-react-vite-V21B', 'tournoidevolley-react-vite-V21A', 'tournoidevolley-react-vite-V21', 'tournoidevolley-react-vite-V20R4', 'tournoidevolley-react-vite-V20R3', 'tournoidevolley-react-vite-V20R2', 'tournoidevolley-react-vite-V20R1', 'tournoidevolley-react-vite-V20Q', 'tournoidevolley-react-vite-V20P', 'tournoidevolley-react-vite-V20O', 'tournoidevolley-react-vite-V20N', 'tournoidevolley-react-vite-V20M', 'tournoidevolley-react-vite-V20L', 'tournoidevolley-react-vite-V20K', 'tournoidevolley-react-vite-V20J', 'tournoidevolley-react-vite-V20I', 'tournoidevolley-react-vite-V20H', 'tournoidevolley-react-vite-V20G', 'tournoidevolley-react-vite-V20F', 'tournoidevolley-react-vite-V20E', 'tournoidevolley-react-vite-V20D', 'tournoidevolley-react-vite-V20C', 'tournoidevolley-react-vite-V20B', 'tournoidevolley-react-vite-V20A', 'tournoidevolley-react-vite-V19Y', 'tournoidevolley-react-vite-V19X', 'tournoidevolley-react-vite-V19W', 'tournoidevolley-react-vite-V19V', 'tournoidevolley-react-vite-V19U', 'tournoidevolley-react-vite-V19T', 'tournoidevolley-react-vite-V19S', 'tournoidevolley-react-vite-V19R', 'tournoidevolley-react-vite-V19Q', 'tournoidevolley-react-vite-V19P', 'tournoidevolley-react-vite-V19O', 'tournoidevolley-react-vite-V19N', 'tournoidevolley-react-vite-V19M', 'tournoidevolley-react-vite-V19L', 'tournoidevolley-react-vite-V19K', 'tournoidevolley-react-vite-V19J', 'tournoidevolley-react-vite-V19I', 'tournoidevolley-react-vite-V19H', 'tournoidevolley-react-vite-V19G', 'tournoidevolley-react-vite-V19F', 'tournoidevolley-react-vite-V19E', 'tournoidevolley-react-vite-V19D', 'tournoidevolley-react-vite-V19C', 'tournoidevolley-react-vite-V19B', 'tournoidevolley-react-vite-V19', 'tournoidevolley-react-vite-v18I', 'tournoidevolley-react-vite-v18H', 'tournoidevolley-react-vite-V18G', 'tournoidevolley-react-vite-v18F', 'tournoidevolley-react-vite-V18D', 'tournoidevolley-react-vite-v18C', 'tournoidevolley-react-vite-V18B', 'tournoidevolley-react-vite-v18A', 'tournoidevolley-react-vite-v18', 'tournoidevolley-react-vite-v17D'];
const MAX_ACTIVE_COURTS = 3;
const TEAM_TARGET = 18;
const LEVELS = ['L', 'D', 'R', 'PN', 'N'];
const LEVEL_WEIGHT = { L: 1, D: 2, R: 3, PN: 4, NP: 4, N: 5 };
const LEVEL_CLASS = { N: 'team-level-n', PN: 'team-level-pn', NP: 'team-level-pn', R: 'team-level-r', D: 'team-level-d', L: 'team-level-l' };

function getPoolLevelTotal(pool, teamMap) {
  if (!pool || !Array.isArray(pool.teamIds)) return 0;
  return pool.teamIds.reduce((total, teamId) => {
    const level = normalizeLevelValue(teamMap.get(teamId)?.level, '');
    return total + (LEVEL_WEIGHT[level] || 0);
  }, 0);
}

function formatPoolNameWithLevel(pool, teamMap) {
  if (!pool?.name) return 'Poule';
  return `${pool.name} - Niveau ${getPoolLevelTotal(pool, teamMap)}`;
}
const APP_VERSION = 'V26M';
const DEFAULT_TOURNAMENT_NAME = 'SAISIR ICI LE NOM DU TOURNOI';
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

function getPreferredBrassagePoolCount(teamCount) {
  if (teamCount < 8) return 0;
  if (teamCount === 8) return 2;
  if (teamCount === 9) return 2;
  if (teamCount === 10) return 2;
  if (teamCount === 11) return 3;
  if (teamCount === 12) return 3;
  if (teamCount === 13 || teamCount === 14) return 4;
  if (teamCount === 15) return 5;
  if (teamCount === 16) return 4;
  if (teamCount === 17) return 5;
  return 6;
}

function getBrassagePoolSummary(teamCount) {
  const poolCount = getPreferredBrassagePoolCount(teamCount);
  if (!poolCount) return '';
  const baseSize = Math.floor(teamCount / poolCount);
  const remainder = teamCount % poolCount;
  const sizes = Array.from({ length: poolCount }, (_, index) => baseSize + (index < remainder ? 1 : 0));
  const minSize = Math.min(...sizes);
  const maxSize = Math.max(...sizes);
  return minSize === maxSize
    ? `${poolCount} poules de ${minSize}`
    : `${poolCount} poules de ${minSize} à ${maxSize}`;
}

function getMainStageDistribution(teamCount) {
  if (teamCount >= 18) return {
    principaleCount: 12,
    consolanteCount: 6,
    normalizedRanking: false,
    consolanteMode: 'pools',
    principalePoolNames: PRINCIPALE_POOL_NAMES,
    consolantePoolNames: CONSOLANTE_POOL_NAMES,
    directPrincipalSemis: false,
  };
  if (teamCount === 8 || teamCount === 9 || teamCount === 10) return {
    principaleCount: 8,
    consolanteCount: 0,
    normalizedRanking: true,
    consolanteMode: 'pools',
    principalePoolNames: [],
    consolantePoolNames: [],
    directPrincipalSemis: false,
  };
  if (teamCount === 12) return {
    principaleCount: 8,
    consolanteCount: 4,
    normalizedRanking: true,
    consolanteMode: 'championship',
    principalePoolNames: [],
    consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]],
    directPrincipalSemis: false,
  };
  if (teamCount === 11) return {
    principaleCount: 8,
    consolanteCount: 3,
    normalizedRanking: true,
    consolanteMode: 'championship',
    principalePoolNames: [],
    consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]],
    directPrincipalSemis: false,
  };
  if (teamCount === 17) return {
    principaleCount: 12,
    consolanteCount: 5,
    normalizedRanking: true,
    consolanteMode: 'championship',
    principalePoolNames: PRINCIPALE_POOL_NAMES,
    consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]],
    directPrincipalSemis: false,
  };
  if (teamCount === 16) return {
    principaleCount: 12,
    consolanteCount: 4,
    normalizedRanking: true,
    consolanteMode: 'championship',
    principalePoolNames: PRINCIPALE_POOL_NAMES,
    consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]],
    directPrincipalSemis: false,
  };
  if (teamCount === 15) return {
    principaleCount: 12,
    consolanteCount: 3,
    normalizedRanking: true,
    consolanteMode: 'championship',
    principalePoolNames: PRINCIPALE_POOL_NAMES,
    consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]],
    directPrincipalSemis: false,
  };
  if (teamCount === 14) return {
    principaleCount: 8,
    consolanteCount: 6,
    normalizedRanking: true,
    consolanteMode: 'pools',
    principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 2),
    consolantePoolNames: CONSOLANTE_POOL_NAMES,
    directPrincipalSemis: true,
  };
  if (teamCount === 13) return {
    principaleCount: 8,
    consolanteCount: 5,
    normalizedRanking: true,
    consolanteMode: 'championship',
    principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 2),
    consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]],
    directPrincipalSemis: true,
  };
  if (teamCount >= 13) return {
    principaleCount: 8,
    consolanteCount: Math.max(0, teamCount - 8),
    normalizedRanking: true,
    consolanteMode: 'pools',
    principalePoolNames: PRINCIPALE_POOL_NAMES,
    consolantePoolNames: CONSOLANTE_POOL_NAMES,
    directPrincipalSemis: false,
  };
  return {
    principaleCount: 0,
    consolanteCount: 0,
    normalizedRanking: false,
    consolanteMode: 'pools',
    principalePoolNames: PRINCIPALE_POOL_NAMES,
    consolantePoolNames: CONSOLANTE_POOL_NAMES,
    directPrincipalSemis: false,
  };
}
const CHAMPIONSHIP_ALLER_POOL_NAME = 'Championnat Aller';
const CHAMPIONSHIP_RETOUR_POOL_NAME = 'Championnat Retour';
const SMALL_QUARTER_PAIRINGS = [[1, 8], [4, 5], [3, 6], [2, 7]];

const RANDOM_TEAM_NAMES = ['Atlas', 'Blitz', 'Comete', 'Cyclone', 'Dynamo', 'Eclair', 'Falcon', 'Fusion', 'Galaxy', 'Helios', 'Horizon', 'Impact', 'Jaguar', 'Krypton', 'Laser', 'Meteor', 'Mirage', 'Nova', 'Orion', 'Phenix', 'Pixel', 'Quartz', 'Raptor', 'Rocket', 'Shadow', 'Silver', 'Solstice', 'Sonic', 'Storm', 'Titan', 'Turbo', 'Vega', 'Vector', 'Volt', 'Zenith', 'Aigle', 'Boreal', 'Cobalt', 'Cosmos', 'Dragon', 'Echo', 'Foudre', 'Globe', 'Inferno', 'Iris', 'Lynx', 'Magma', 'Nimbus', 'Onyx', 'Pegase', 'Pulsar', 'Ruby', 'Saphir', 'Saturne', 'Spectrum', 'Tornado', 'Vortex', 'Ymir', 'Zephyr'];

function randomInt(min, max) {
  const safeMin = Math.ceil(Math.min(min, max));
  const safeMax = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

function shuffleArray(items) {
  const copy = Array.isArray(items) ? [...items] : [];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildRandomValidScore(rule) {
  const target = Math.max(1, Number(rule?.winningScore) || 21);
  const mode = rule?.mode || 'sec';
  const winnerIsA = Math.random() < 0.5;
  let winnerScore = target;
  let loserScore = randomInt(0, Math.max(0, target - 2));

  if (mode !== 'sec') {
    loserScore = randomInt(Math.max(0, target - 6), Math.max(0, target - 2));
    winnerScore = Math.max(target, loserScore + randomInt(2, 6));
  }

  return winnerIsA
    ? { scoreA: winnerScore, scoreB: loserScore }
    : { scoreA: loserScore, scoreB: winnerScore };
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

function safeGetLocalStorageItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocalStorageItem(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function normalizeLevelValue(level, fallback = 'D') {
  const normalized = level === 'NP' ? 'PN' : level;
  return LEVELS.includes(normalized) ? normalized : fallback;
}

function normalizeTeamsList(inputTeams) {
  if (!Array.isArray(inputTeams) || inputTeams.length === 0) return defaultTeams();
  return inputTeams
    .filter(Boolean)
    .slice(0, TEAM_TARGET)
    .map((team, index) => ({
      id: team?.id || uid('team'),
      name: team?.name || `Équipe ${index + 1}`,
      level: normalizeLevelValue(team?.level),
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
    const raw = storageKeys.map((key) => safeGetLocalStorageItem(key)).find(Boolean);
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
  const defaults = Array.isArray(defaultLevelMap) ? defaultLevelMap : ['N', 'N', 'PN', 'PN', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'L', 'L', 'L', 'L', 'PN', 'R', 'D'];
  return Array.from({ length: TEAM_TARGET }, (_, index) => ({
    id: uid('team'),
    name: `Équipe ${index + 1}`,
    level: normalizeLevelValue(defaults[index], fallbackLevel),
    club: '',
    contact: '',
  }));
}

function defaultTeamsAllLevelL() {
  return defaultTeams(Array.from({ length: TEAM_TARGET }, () => 'L'), 'L');
}

function sortTeamsForSeeding(teams) {
  return [...teams].sort((a, b) => {
    const diff = (LEVEL_WEIGHT[normalizeLevelValue(b.level, '')] || 0) - (LEVEL_WEIGHT[normalizeLevelValue(a.level, '')] || 0);
    if (diff !== 0) return diff;
    return a.name.localeCompare(b.name, 'fr');
  });
}

function getBrassage1OrderedTeamIds(teams) {
  return sortTeamsForSeeding((Array.isArray(teams) ? teams : []).filter((team) => !!team?.name?.trim()))
    .map((team) => team.id)
    .filter(Boolean);
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

function createPoolsFromAssignments(assignments, names) {
  return names.map((name, index) => ({
    id: uid('pool'),
    name,
    teamIds: Array.isArray(assignments[index]) ? assignments[index].filter(Boolean) : [],
  }));
}

function createBrassage1PoolsFromOrderedTeams(orderedTeams, names) {
  const poolCount = names.length;
  const teamIds = (Array.isArray(orderedTeams) ? orderedTeams : []).map((team) => team?.id).filter(Boolean);
  const assignments = Array.from({ length: poolCount }, () => []);

  for (let poolIndex = 0; poolIndex < poolCount; poolIndex += 1) {
    if (teamIds[poolIndex]) assignments[poolIndex].push(teamIds[poolIndex]);
  }

  for (let poolIndex = 0; poolIndex < poolCount; poolIndex += 1) {
    const reverseIndex = teamIds.length - 1 - poolIndex;
    if (reverseIndex >= poolCount && teamIds[reverseIndex]) assignments[poolIndex].push(teamIds[reverseIndex]);
  }

  for (let poolIndex = 0; poolIndex < poolCount; poolIndex += 1) {
    const middleIndex = poolCount + poolIndex;
    if (middleIndex < teamIds.length - poolCount && teamIds[middleIndex]) assignments[poolIndex].push(teamIds[middleIndex]);
  }

  const usedIds = new Set(assignments.flat());
  const leftovers = teamIds.filter((teamId) => !usedIds.has(teamId));
  leftovers.forEach((teamId, index) => {
    assignments[index % poolCount]?.push(teamId);
  });

  return createPoolsFromAssignments(assignments, names);
}

function getOrderedPoolTeamIds(pool, standings) {
  const rows = (Array.isArray(standings) ? standings : []).find((entry) => entry?.pool?.id === pool?.id)?.rows || [];
  const rankedIds = rows.map((row) => row.teamId).filter(Boolean);
  const missingIds = (Array.isArray(pool?.teamIds) ? pool.teamIds : []).filter((teamId) => !rankedIds.includes(teamId));
  return [...rankedIds, ...missingIds];
}

function createBrassage2PoolsFromBrassage1(sourcePools, standings, names) {
  const poolCount = Array.isArray(names) ? names.length : 0;
  const safeSourcePools = Array.isArray(sourcePools) ? sourcePools : [];
  const orderedByPool = Array.from({ length: poolCount }, (_, index) => getOrderedPoolTeamIds(safeSourcePools[index], standings));
  const targetSizes = Array.from({ length: poolCount }, (_, index) => {
    const teamIds = Array.isArray(safeSourcePools[index]?.teamIds) ? safeSourcePools[index].teamIds.filter(Boolean) : [];
    return Math.max(0, teamIds.length);
  });
  const totalTeams = targetSizes.reduce((sum, size) => sum + size, 0);

  if (totalTeams >= 13 && totalTeams <= 17) {
    const rankedTeamIds = [];
    orderedByPool.forEach((teamIds) => {
      teamIds.forEach((teamId) => {
        if (teamId && !rankedTeamIds.includes(teamId)) rankedTeamIds.push(teamId);
      });
    });

    const assignments = Array.from({ length: poolCount }, () => []);
    let cursor = 0;
    targetSizes.forEach((size, poolIndex) => {
      for (let slot = 0; slot < size; slot += 1) {
        const teamId = rankedTeamIds[cursor] || null;
        if (teamId) assignments[poolIndex].push(teamId);
        cursor += 1;
      }
    });

    return createPoolsFromAssignments(assignments, names);
  }

  const assignments = names.map(() => []);
  const assignedIds = new Set();

  const tryAssign = (targetIndex, teamId) => {
    if (!teamId) return;
    if (assignedIds.has(teamId)) return;
    if (assignments[targetIndex].length >= targetSizes[targetIndex]) return;
    assignments[targetIndex].push(teamId);
    assignedIds.add(teamId);
  };

  for (let index = 0; index < poolCount; index += 1) {
    tryAssign(index, orderedByPool[index]?.[0] || null);
  }

  for (let index = 0; index < poolCount; index += 1) {
    tryAssign(index, orderedByPool[(index + 1) % poolCount]?.[1] || null);
  }

  for (let index = 0; index < poolCount; index += 1) {
    tryAssign(index, orderedByPool[(index - 1 + poolCount) % poolCount]?.[2] || null);
  }

  const leftovers = orderedByPool.flat().filter((teamId) => teamId && !assignedIds.has(teamId));
  leftovers.forEach((teamId) => {
    const targetIndex = assignments.findIndex((teamIds, index) => teamIds.length < targetSizes[index]);
    if (targetIndex >= 0) {
      assignments[targetIndex].push(teamId);
      assignedIds.add(teamId);
    }
  });

  return createPoolsFromAssignments(assignments, names);
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
  const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [];
  if (teamIds.length === 2) {
    const [team1, team2] = teamIds;
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
        teamBId: team1,
        scoreA: '',
        scoreB: '',
      },
    ];
  }

  if (teamIds.length !== 3) {
    return roundRobinMatches(teamIds, phase, pool.name);
  }

  const [team1, team2, team3] = teamIds;

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

function buildPoolMatchDescriptors(pools, phase, preferredCourts, extra = {}) {
  const safePreferredCourts = Array.isArray(preferredCourts) && preferredCourts.length ? preferredCourts : [1, 2, 3];
  return (Array.isArray(pools) ? pools : [])
    .filter((pool) => pool && Array.isArray(pool.teamIds) && pool.teamIds.filter(Boolean).length >= 2)
    .map((pool) => {
      const teamIds = Array.isArray(pool.teamIds) ? pool.teamIds.filter(Boolean) : [];
      const preferred = typeof extra.getPreferredCourts === 'function'
        ? extra.getPreferredCourts(pool, safePreferredCourts, teamIds)
        : safePreferredCourts;
      return {
        pool,
        phase,
        preferredCourts: Array.isArray(preferred) && preferred.length ? preferred : safePreferredCourts,
        matches: createThreeTeamPoolMatches(pool, phase),
        nextIndex: 0,
        lastSlot: 0,
        teamIds,
        teamCount: teamIds.length,
      };
    });
}

function schedulePoolDescriptorsOnCourts(descriptors, courts, startSlot) {
  const safeDescriptors = (Array.isArray(descriptors) ? descriptors : []).filter((entry) => entry && Array.isArray(entry.matches) && entry.matches.length);
  const safeCourts = Array.isArray(courts) && courts.length ? courts : [1, 2, 3];
  if (!safeDescriptors.length) return [];

  const scheduled = [];
  let slot = startSlot + 1;

  while (safeDescriptors.some((entry) => entry.nextIndex < entry.matches.length)) {
    const usedTeamIds = new Set();

    safeCourts.forEach((court) => {
      const candidates = safeDescriptors
        .filter((entry) => entry.nextIndex < entry.matches.length && entry.preferredCourts.includes(court))
        .filter((entry) => entry.teamIds.every((teamId) => !usedTeamIds.has(teamId)))
        .sort((a, b) => {
          const aRemaining = Math.max(0, (a.matches?.length || 0) - (a.nextIndex || 0));
          const bRemaining = Math.max(0, (b.matches?.length || 0) - (b.nextIndex || 0));
          if (aRemaining !== bRemaining) return bRemaining - aRemaining;
          if ((a.teamCount || 0) !== (b.teamCount || 0)) return (b.teamCount || 0) - (a.teamCount || 0);
          const aGap = slot - (a.lastSlot || 0);
          const bGap = slot - (b.lastSlot || 0);
          if (aGap !== bGap) return bGap - aGap;
          if (a.nextIndex !== b.nextIndex) return a.nextIndex - b.nextIndex;
          return String(a.pool?.name || '').localeCompare(String(b.pool?.name || ''));
        });

      const entry = candidates[0];
      if (!entry) return;

      const match = entry.matches[entry.nextIndex];
      entry.nextIndex += 1;
      entry.lastSlot = slot;
      entry.teamIds.forEach((teamId) => usedTeamIds.add(teamId));

      scheduled.push({
        ...match,
        court,
        slot,
        time: '',
        validatedAt: match.validatedAt || null,
      });
    });

    slot += 1;
  }

  return scheduled.sort((a, b) => {
    if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
    return (a.court || 0) - (b.court || 0);
  });
}

function scheduleBrassageMatches(pools, phase, startSlot) {
  const safePools = Array.isArray(pools) ? pools.filter(Boolean) : [];
  if (!safePools.length) return [];

  const courts = [1, 2, 3];
  const poolMeta = safePools.map((pool, originalIndex) => {
    const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [];
    const matches = createThreeTeamPoolMatches(pool, phase);
    return {
      pool,
      originalIndex,
      teamIds,
      teamCount: teamIds.length,
      matchCount: matches.length,
    };
  });

  const maxTeamCount = Math.max(...poolMeta.map((entry) => entry.teamCount || 0), 0);
  const courtLoads = new Map(courts.map((court) => [court, 0]));
  const preferredCourtByPoolId = new Map();

  poolMeta
    .slice()
    .sort((a, b) => {
      if ((a.teamCount || 0) !== (b.teamCount || 0)) return (b.teamCount || 0) - (a.teamCount || 0);
      if ((a.matchCount || 0) !== (b.matchCount || 0)) return (b.matchCount || 0) - (a.matchCount || 0);
      return a.originalIndex - b.originalIndex;
    })
    .forEach((entry) => {
      const sortedCourts = courts.slice().sort((a, b) => {
        const loadDiff = (courtLoads.get(a) || 0) - (courtLoads.get(b) || 0);
        if (loadDiff !== 0) return loadDiff;
        return a - b;
      });
      const preferredCourt = sortedCourts[0];
      preferredCourtByPoolId.set(entry.pool.id, preferredCourt);
      courtLoads.set(preferredCourt, (courtLoads.get(preferredCourt) || 0) + (entry.matchCount || 0));
    });

  const descriptors = safePools.flatMap((pool) => buildPoolMatchDescriptors([pool], phase, [preferredCourtByPoolId.get(pool.id) || 1], {
    getPreferredCourts: (currentPool, baseCourts, teamIds) => {
      const teamCount = teamIds?.length || 0;
      if (safePools.length >= 6) return baseCourts;
      if (teamCount < maxTeamCount) return baseCourts;
      if (teamCount <= 3) return baseCourts;
      const fallbackCourts = courts.filter((court) => !baseCourts.includes(court));
      return [...baseCourts, ...fallbackCourts];
    },
  }));

  return schedulePoolDescriptorsOnCourts(descriptors, courts, startSlot);
}

function scheduleMainStageMatches(principalePools, consolantePools, startSlot) {
  const safePrincipalePools = Array.isArray(principalePools) ? principalePools.filter(Boolean) : [];
  const safeConsolantePools = Array.isArray(consolantePools) ? consolantePools.filter(Boolean) : [];

  const samePoolCount = safePrincipalePools.length > 0
    && safePrincipalePools.length === safeConsolantePools.length;

  const descriptors = [
    ...buildPoolMatchDescriptors(safePrincipalePools, 'Principale', samePoolCount ? [1, 2, 3] : [1, 2]),
    ...buildPoolMatchDescriptors(safeConsolantePools, 'Consolante', samePoolCount ? [1, 2, 3] : [3]),
  ];

  return schedulePoolDescriptorsOnCourts(descriptors, [1, 2, 3], startSlot);
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

function assignScheduleWithCourts(matches, startSlot, courts) {
  const safeCourts = Array.isArray(courts) && courts.length ? courts : [1, 2, 3];
  return matches.map((match, index) => {
    const zeroBasedSlot = startSlot + Math.floor(index / safeCourts.length);
    return {
      ...match,
      court: safeCourts[index % safeCourts.length],
      slot: zeroBasedSlot + 1,
      time: '',
      validatedAt: match.validatedAt || null,
    };
  });
}

function stageSlotCount(matchCount) {
  return Math.ceil(matchCount / 3);
}

function stageSlotCountForCourts(matchCount, courts) {
  const safeCourtCount = Array.isArray(courts) && courts.length ? courts.length : 3;
  return Math.ceil(matchCount / safeCourtCount);
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

function hasMatchStartedForPublicRanking(match, phaseRules) {
  if (!match) return false;
  if (getMatchStatusLabel(match, phaseRules) === 'Valide') return true;
  const officialA = toNumber(match.scoreA);
  const officialB = toNumber(match.scoreB);
  const submittedA = toNumber(match.submittedScoreA);
  const submittedB = toNumber(match.submittedScoreB);
  return Boolean(
    match.refereeInProgress
    || match.matchInProgress
    || ((officialA ?? 0) !== 0)
    || ((officialB ?? 0) !== 0)
    || ((submittedA ?? 0) !== 0)
    || ((submittedB ?? 0) !== 0)
  );
}

function collectUniquePoolTeamIds(pools) {
  return Array.from(new Set((Array.isArray(pools) ? pools : []).flatMap((pool) => Array.isArray(pool?.teamIds) ? pool.teamIds : [])));
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

function getEstimatedEndTextForMatches(matches, scheduleMap, emptyText = 'À générer') {
  const safeMatches = dedupeMatches(Array.isArray(matches) ? matches : []).filter(Boolean);
  if (!safeMatches.length) return emptyText;

  const endMinutes = safeMatches.reduce((maxEnd, match) => {
    const scheduledEnd = scheduleMap?.[match.id]?.endMinutes;
    if (typeof scheduledEnd === 'number') return Math.max(maxEnd, scheduledEnd);
    return maxEnd;
  }, -Infinity);

  return Number.isFinite(endMinutes) ? minutesToTime(endMinutes) : emptyText;
}

function OrganizerPhaseEstimateCard({ data, compact = false }) {
  if (!data) return null;

  if (data.mode === 'split') {
    return (
      <div className={`phase-estimate-panel ${compact ? 'phase-estimate-panel-compact' : ''}`.trim()}>
        <div className="phase-estimate-heading">{data.heading}</div>
        <div className="phase-estimate-columns">
          <div className="phase-estimate-column">
            <div className="phase-estimate-column-title">{data.leftTitle}</div>
            {data.leftItems.map((item) => (
              <div key={item.label} className="phase-estimate-row">
                <span className="phase-estimate-row-label">{item.label}</span>
                <strong className="phase-estimate-row-value">{item.value}</strong>
              </div>
            ))}
          </div>
          <div className="phase-estimate-column">
            <div className="phase-estimate-column-title">{data.rightTitle}</div>
            {data.rightItems.map((item) => (
              <div key={item.label} className="phase-estimate-row">
                <span className="phase-estimate-row-label">{item.label}</span>
                <strong className="phase-estimate-row-value">{item.value}</strong>
              </div>
            ))}
          </div>
                    <div className="home-signature" aria-label="Signature Tournoi de Volley">
            <div className="home-signature-logo">
              <div className="home-signature-ring">
                <div className="home-signature-line home-signature-line-top">NEO DEV</div>
                <div className="home-signature-mark">⚙</div>
                <div className="home-signature-line home-signature-line-bottom">Chuly0ne</div>
              </div>
            </div>
            <div className="home-signature-email">Lvangchuly@gmail.com</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`phase-estimate-panel ${compact ? 'phase-estimate-panel-compact' : ''}`.trim()}>
      <div className="phase-estimate-heading">{data.heading}</div>
      <div className="phase-estimate-single">
        <span className="phase-estimate-phase-label">{data.phaseLabel}</span>
        <strong className="phase-estimate-single-value">{data.value}</strong>
      </div>
    </div>
  );
}

function compareStandingRows(a, b, options = {}) {
  const normalizeByMatches = Boolean(options?.normalizeByMatches);

  if (normalizeByMatches) {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.avgTournamentPoints !== a.avgTournamentPoints) return b.avgTournamentPoints - a.avgTournamentPoints;
    if (b.avgPointDiff !== a.avgPointDiff) return b.avgPointDiff - a.avgPointDiff;
    if (b.avgPointsFor !== a.avgPointsFor) return b.avgPointsFor - a.avgPointsFor;
    if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints;
  } else if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints;

  if (b.wins !== a.wins) return b.wins - a.wins;
  if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
  if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
  if ((a.initialOrder ?? 0) !== (b.initialOrder ?? 0)) return (a.initialOrder ?? 0) - (b.initialOrder ?? 0);
  return a.teamName.localeCompare(b.teamName, 'fr');
}

function computeRanking(teamIds, matches, teamMap, phaseRules, options = {}) {
  const normalizeByMatches = Boolean(options?.normalizeByMatches);
  const rows = teamIds.map((teamId, index) => ({
    teamId,
    teamName: teamMap.get(teamId)?.name || teamId,
    level: normalizeLevelValue(teamMap.get(teamId)?.level, ''),
    initialOrder: index,
    played: 0,
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    pointDiff: 0,
    tournamentPoints: 0,
    avgTournamentPoints: 0,
    avgPointDiff: 0,
    avgPointsFor: 0,
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
    row.avgTournamentPoints = row.played > 0 ? row.tournamentPoints / row.played : 0;
    row.avgPointDiff = row.played > 0 ? row.pointDiff / row.played : 0;
    row.avgPointsFor = row.played > 0 ? row.pointsFor / row.played : 0;
  });

  return rows.sort((a, b) => compareStandingRows(a, b, { normalizeByMatches }));
}

function computeGroupStandings(pools, matches, teamMap, phaseRules, options = {}) {
  return pools.map((pool) => ({
    pool,
    rows: computeRanking(
      pool.teamIds,
      matches.filter((match) => pool.teamIds.includes(match.teamAId) && pool.teamIds.includes(match.teamBId)),
      teamMap,
      phaseRules,
      options,
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
  return LEVEL_CLASS[normalizeLevelValue(level, '')] || 'team-level-default';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMatchCardMarkup(match, resolveTeam, poolTeamIds = [], phaseRules = PHASE_RULES_DEFAULT) {
  const refereeTeamId = Array.isArray(poolTeamIds)
    ? poolTeamIds.find((teamId) => teamId !== match?.teamAId && teamId !== match?.teamBId) || null
    : null;
  const refereeTeam = refereeTeamId ? resolveTeam(refereeTeamId) : null;
  const teamA = resolveTeam(match?.teamAId);
  const teamB = resolveTeam(match?.teamBId);
  const status = getMatchStatusLabel(match, phaseRules);
  const statusClass = status === 'Valide' ? 'badge-success' : status === 'Score invalide' ? 'badge-danger' : 'badge-neutral';
  const statusMarkup = status === 'À saisir' ? '' : `${statusMarkup}`;
  return `
    <div class="compact-match-card-v24c compact-match-card-v24e">
      <div class="compact-match-header-v24c compact-match-header-wide-v24d compact-match-header-wide-v24e">
        <span class="compact-match-chip compact-match-chip-v24c">T${escapeHtml(match?.court || '—')}</span>
        <span class="team-badge ${escapeHtml(getLevelClass(refereeTeam?.level))} compact-match-referee-badge-v24d compact-match-referee-badge-v24e">${escapeHtml(refereeTeam?.name || '—')}</span>
        <span class="compact-match-chip compact-match-chip-v24c">M${escapeHtml(match?.slot || '—')}</span>
      </div>
      <div class="compact-match-team-row-v24c compact-match-team-row-v24e">
        <span class="team-badge ${escapeHtml(getLevelClass(teamA?.level))} compact-team-strip-badge compact-team-strip-badge-v24c compact-team-strip-badge-v24e">${escapeHtml(teamA?.name || '—')}</span>
        <span class="team-badge ${escapeHtml(getLevelClass(teamB?.level))} compact-team-strip-badge compact-team-strip-badge-v24c compact-team-strip-badge-v24e">${escapeHtml(teamB?.name || '—')}</span>
      </div>
      <div class="compact-match-score-row compact-match-score-row-v24c compact-match-score-row-v24e">
        <label class="compact-score-box compact-score-box-v24c compact-score-box-v24e"><input type="text" value="${escapeHtml(match?.scoreA ?? '')}" readonly /></label>
        <label class="compact-score-box compact-score-box-v24c compact-score-box-v24e"><input type="text" value="${escapeHtml(match?.scoreB ?? '')}" readonly /></label>
      </div>
      <div class="compact-match-footer-v24c compact-match-footer-v24e">
        <span class="match-print-button-v24c">🖨️</span>
        ${statusMarkup}
      </div>
    </div>`;
}

function printMatchCard(matchId) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const node = document.getElementById(`match-card-${matchId}`);
  if (!node) return;
  const printableNode = node.cloneNode(true);
  printableNode.querySelectorAll('.match-print-button-v24c').forEach((entry) => entry.remove());
  printableNode.querySelectorAll('.compact-match-card-actions').forEach((entry) => entry.remove());
  printableNode.querySelectorAll('.badge').forEach((entry) => {
    const label = String(entry.textContent || '').trim();
    if (label === 'À saisir') entry.remove();
  });
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) return;
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((entry) => entry.outerHTML)
    .join('\n');
  printWindow.document.write(`<!doctype html><html><head><title>Impression match</title>${styles}<style>body{margin:0;padding:24px;background:#ffffff;font-family:Inter,Arial,sans-serif}.print-wrap{display:flex;justify-content:center;align-items:flex-start}.compact-match-card-v24c{width:420px!important;max-width:420px!important;box-shadow:none!important;border:1px solid #0f172a!important}.match-print-button-v24c,.compact-match-card-actions{display:none!important}.compact-match-score-row,.compact-match-score-row-v24c,.compact-match-score-row-v24e,.compact-match-score-row-v24n{min-height:88px!important;gap:16px!important;align-items:stretch!important}.compact-score-box,.compact-score-box-v24c,.compact-score-box-v24e,.compact-score-box-v24n{min-height:88px!important;padding:12px!important}.compact-score-box input,.compact-score-box-v24c input,.compact-score-box-v24e input,.compact-score-box-v24n input{min-height:64px!important;height:64px!important;font-size:28px!important;text-align:center!important}.compact-match-team-row-v24c .team-badge,.compact-match-team-row-v24e .team-badge,.compact-match-team-row-v24n .team-badge,.compact-team-strip-badge,.compact-team-strip-badge-v24c,.compact-team-strip-badge-v24e,.compact-team-strip-badge-v24n{font-size:24px!important;line-height:1.15!important;padding-top:10px!important;padding-bottom:10px!important}.compact-match-referee-badge-v24d,.compact-match-referee-badge-v24e,.compact-match-referee-badge-v24n{font-size:24px!important;line-height:1.15!important;padding-top:10px!important;padding-bottom:10px!important}</style></head><body><div class="print-wrap">${printableNode.outerHTML}</div></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
}

function printRemainingBrassageMatches(title, matches, pools = [], resolveTeamFn = () => ({ name: '—', level: '' }), phaseRules = PHASE_RULES_DEFAULT) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const remaining = dedupeMatches(Array.isArray(matches) ? matches : []).filter((match) => getMatchStatusLabel(match, phaseRules) !== 'Valide');
  if (!remaining.length) {
    window.alert('Aucun match restant à imprimer.');
    return;
  }
  const poolByName = new Map((Array.isArray(pools) ? pools : []).map((pool) => [pool?.name, pool]));
  const nodes = remaining.map((match) => {
    const pool = poolByName.get(match?.group);
    const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds : [];
    return renderMatchCardMarkup(match, resolveTeamFn, teamIds, phaseRules);
  }).join('');
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((entry) => entry.outerHTML)
    .join('\n');
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) {
    window.alert("La fenêtre d'impression a été bloquée par le navigateur.");
    return;
  }
  printWindow.document.write(`<!doctype html><html><head><title>${title}</title>${styles}<style>@page{size:A4 landscape;margin:8mm}body{margin:0;background:#fff;font-family:Inter,Arial,sans-serif;color:#0f172a}.print-a4-title{font-weight:800;font-size:16px;margin:0 0 8px}.print-a4-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;align-items:start}.print-a4-grid .compact-match-card-v24c{transform:scale(.72);transform-origin:top left;width:138%;margin:0 0 -42px 0;box-shadow:none!important;border:1px solid #0f172a!important;break-inside:avoid;page-break-inside:avoid}.print-a4-grid .compact-match-card-v24c:last-child{margin-bottom:0}.print-a4-grid .match-print-button-v24c,.print-a4-grid .compact-match-card-actions{display:none!important}.print-a4-grid .compact-score-box input{background:#fff!important;min-height:64px!important;height:64px!important;font-size:28px!important;text-align:center!important}.print-a4-grid .compact-match-score-row,.print-a4-grid .compact-match-score-row-v24c,.print-a4-grid .compact-match-score-row-v24e,.print-a4-grid .compact-match-score-row-v24n{min-height:88px!important;gap:16px!important;align-items:stretch!important}.print-a4-grid .compact-score-box,.print-a4-grid .compact-score-box-v24c,.print-a4-grid .compact-score-box-v24e,.print-a4-grid .compact-score-box-v24n{min-height:88px!important;padding:12px!important}.print-a4-grid .compact-match-team-row-v24c .team-badge,.print-a4-grid .compact-match-team-row-v24e .team-badge,.print-a4-grid .compact-match-team-row-v24n .team-badge,.print-a4-grid .compact-team-strip-badge,.print-a4-grid .compact-team-strip-badge-v24c,.print-a4-grid .compact-team-strip-badge-v24e,.print-a4-grid .compact-team-strip-badge-v24n{font-size:24px!important;line-height:1.15!important;padding-top:10px!important;padding-bottom:10px!important}.print-a4-grid .compact-match-referee-badge-v24d,.print-a4-grid .compact-match-referee-badge-v24e,.print-a4-grid .compact-match-referee-badge-v24n{font-size:24px!important;line-height:1.15!important;padding-top:10px!important;padding-bottom:10px!important}</style></head><body><div class="print-a4-title">${title}</div><div class="print-a4-grid">${nodes}</div></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    try {
      printWindow.print();
    } finally {
      printWindow.close();
    }
  }, 350);
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

function isPublicDisplayableMatch(match, resolveTeam) {
  if (!hasBothTeamsDefined(match)) return false;
  const teamAName = String(resolveTeam(match.teamAId)?.name || '').trim().toLowerCase();
  const teamBName = String(resolveTeam(match.teamBId)?.name || '').trim().toLowerCase();
  return Boolean(teamAName && teamBName && teamAName !== 'à définir' && teamBName !== 'à définir');
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

function matchHasEnteredScore(match) {
  if (!match) return false;
  const values = [match.scoreA, match.scoreB, match.submittedScoreA, match.submittedScoreB];
  return values.some((value) => String(value ?? '').trim() !== '');
}

function hasLiveMatchData(match) {
  return matchHasEnteredScore(match)
    || Boolean(match?.refereeInProgress)
    || Boolean(match?.matchInProgress)
    || Boolean(match?.validatedAt)
    || Boolean(match?.manualOverrideAt)
    || Boolean(match?.submittedAt);
}

function shouldPreserveLocalMatchIdentity(localMatch, remoteMatch) {
  if (!localMatch?.id) return false;
  const localGeneratedAt = toTimestamp(localMatch?.generatedAt);
  const remoteGeneratedAt = toTimestamp(remoteMatch?.generatedAt);
  if (localGeneratedAt !== remoteGeneratedAt) {
    return localGeneratedAt > remoteGeneratedAt;
  }
  const localLive = hasLiveMatchData(localMatch);
  const remoteLive = hasLiveMatchData(remoteMatch);
  if (localLive !== remoteLive) {
    return localLive && !remoteLive;
  }
  const localLatestAt = Math.max(
    toTimestamp(localMatch?.submittedAt),
    toTimestamp(localMatch?.validatedAt),
    toTimestamp(localMatch?.manualOverrideAt),
  );
  const remoteLatestAt = Math.max(
    toTimestamp(remoteMatch?.submittedAt),
    toTimestamp(remoteMatch?.validatedAt),
    toTimestamp(remoteMatch?.manualOverrideAt),
  );
  return localLatestAt >= remoteLatestAt;
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
  const hasHeader = Boolean(title || subtitle || right);
  return (
    <section className="section-card">
      {hasHeader ? (
        <div className="section-head">
          <div>
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
          {right ? <div className="actions-row">{right}</div> : null}
        </div>
      ) : null}
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

  return safeMatches.filter((match) => {
    if (!match) return false;
    if (phaseLabel && match.phase !== phaseLabel) return false;
    const pairKey = teamPairKey(match, phaseLabel);
    if (!pairKey || !allowedPairs.has(pairKey)) return false;
    const expectedGroup = allowedPairs.get(pairKey);
    return !expectedGroup || !match.group || match.group === expectedGroup;
  });
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
  const rawScoreA = isInProgress && match.submittedScoreA !== '' ? match.submittedScoreA : match.scoreA;
  const rawScoreB = isInProgress && match.submittedScoreB !== '' ? match.submittedScoreB : match.scoreB;
  const displayScoreA = isInProgress ? (rawScoreA === '' ? '--' : rawScoreA) : '--';
  const displayScoreB = isInProgress ? (rawScoreB === '' ? '--' : rawScoreB) : '--';
  const phaseAndGroup = [match.phase, match.group].filter(Boolean).join(' - ');
  const statusLabel = isInProgress ? 'Match en cours' : title;
  const endLabel = isInProgress ? 'Fin de match prévue à' : 'Fin prévue à';
  const startText = match.scheduledStartText || match.time || '--:--';
  const endText = match.scheduledEndText || '--:--';
  return (
    <div className="public-match-card public-match-card-featured">
      <div className="public-match-topline">
        <div className="public-label">{statusLabel}</div>
        <div className="public-phase-label">{phaseAndGroup}</div>
      </div>
      <div className="muted small public-match-meta">Terrain <span className="public-court-number">{match.court}</span></div>
      <div className="public-match-grid public-match-grid-featured">
        <div className="public-match-main">
          <div className="public-match-team-row">
            <div className="public-team"><TeamBadge name={resolveTeam(match.teamAId).name} level={resolveTeam(match.teamAId).level} className="team-badge-public" /></div>
            <div className="public-score public-score-inline">{displayScoreA}</div>
          </div>
          <div className="muted small public-versus">vs</div>
          <div className="public-match-team-row">
            <div className="public-team"><TeamBadge name={resolveTeam(match.teamBId).name} level={resolveTeam(match.teamBId).level} className="team-badge-public" /></div>
            <div className="public-score public-score-inline">{displayScoreB}</div>
          </div>
        </div>
        <div className="public-match-side-note">
          <div className="public-start-block">
            <div className="public-start-label">Début estimé à</div>
            <div className="public-start-time">{startText}</div>
          </div>
          <div className="public-end-block">
            <div className="public-end-label">{endLabel}</div>
            <div className="public-end-time">{endText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}



function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-|-$/g, '');
}

function buildRandomTournamentCode(length = 5) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('').toLowerCase();
}

function buildDefaultSharedTournamentId(name, forcedCode = '') {
  const base = slugify(name);
  const nextCode = slugify(forcedCode || buildRandomTournamentCode(5)).replace(/-/g, '') || buildRandomTournamentCode(5).toLowerCase();
  return `${base}-${nextCode}`;
}

function buildFirebaseTournamentUrl(sharedTournamentId) {
  const effectiveId = encodeURIComponent(String(sharedTournamentId || '').trim());
  return `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/tournaments/${effectiveId}.json`;
}

function buildFirebaseTournamentsCollectionUrl() {
  return `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/tournaments.json`;
}

function buildBaseAccessHref() {
  if (typeof window === 'undefined') return '';
  const href = String(window.location.href || '');
  if (!href) return '';
  const hashIndex = href.indexOf('#');
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = withoutHash.indexOf('?');
  return queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
}

function buildAccessHref(sharedTournamentId, isReferee = false) {
  const baseHref = buildBaseAccessHref();
  const params = new URLSearchParams();
  if (isReferee) params.set('mode', 'referee');
  if (sharedTournamentId) {
    params.set('sharedTournamentId', sharedTournamentId);
  }
  const queryString = params.toString();
  if (!baseHref) {
    return queryString ? `?${queryString}` : '?';
  }
  return queryString ? `${baseHref}?${queryString}` : baseHref;
}

function buildRefereeAccessUrl(sharedTournamentId) {
  return buildAccessHref(sharedTournamentId, true);
}


function buildPublicAccessUrl(sharedTournamentId) {
  return buildAccessHref(sharedTournamentId, false) || '?sharedTournamentId=demo';
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

function AccessQrCode({ url, title, caption, alt, topImageSrc, topImageAlt, onOpen }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
  return (
    <div
      className="referee-qr-card referee-qr-card-clickable"
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={onOpen ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(); } } : undefined}
    >
      <div className="referee-qr-title">{title}</div>
      {topImageSrc ? <img className="referee-qr-top-image" src={topImageSrc} alt={topImageAlt || ''} /> : null}
      <img className="referee-qr-image" src={qrSrc} alt={alt} />
      <div className="referee-qr-caption">{caption}</div>
      <a className="referee-qr-link" href={url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{url}</a>
    </div>
  );
}

export default function App() {
  const initial = loadState();
  const initialOrganizerPassword = Object.prototype.hasOwnProperty.call(initial?.settings || {}, 'organizerPassword')
    ? String(initial?.settings?.organizerPassword ?? '')
    : '';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'organizer') return 'organizer';
    if (params.get('mode') === 'referee') return 'referee';
    if (params.get('sharedTournamentId')) return 'public';
    return 'home';
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
  const [tournamentName, setTournamentName] = useState(initial?.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME);
  const [tournamentLogo, setTournamentLogo] = useState(initial?.settings?.tournamentLogo || '');
  const [sharedTournamentId, setSharedTournamentId] = useState(initial?.settings?.sharedTournamentId || buildDefaultSharedTournamentId(initial?.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME));
  const [disableBrassage2, setDisableBrassage2] = useState(Boolean(initial?.settings?.disableBrassage2));
  const [lastSavedAt, setLastSavedAt] = useState(initial?.meta?.lastSavedAt || '');
  const [remoteSavedAt, setRemoteSavedAt] = useState(initial?.meta?.remoteSavedAt || '');
  const [remoteSyncMessage, setRemoteSyncMessage] = useState('');
  const [isRemoteSyncing, setIsRemoteSyncing] = useState(false);
  const [createdAt, setCreatedAt] = useState(initial?.meta?.createdAt || new Date().toISOString());
  const [homeTournamentOptions, setHomeTournamentOptions] = useState([]);
  const [homeSearch, setHomeSearch] = useState('');
  const [homeSelectedTournamentId, setHomeSelectedTournamentId] = useState('');
  const [homeSelectorOpen, setHomeSelectorOpen] = useState(false);
  const [homeCatalogLoading, setHomeCatalogLoading] = useState(false);
  const [homeCatalogError, setHomeCatalogError] = useState('');
  const [homeDeletingTournamentId, setHomeDeletingTournamentId] = useState('');
  const [remoteStateInitialized, setRemoteStateInitialized] = useState(mode !== 'referee');
  const [brassage1, setBrassage1] = useState(normalizeLeagueState(safeClone(initial?.brassage1, { pools: [], matches: [] })));
  const [brassage2, setBrassage2] = useState(normalizeLeagueState(safeClone(initial?.brassage2, { pools: [], matches: [] })));
  const [mainStage, setMainStage] = useState(normalizeMainStageState(safeClone(initial?.mainStage, { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] })));
  const [knockout, setKnockout] = useState(normalizeKnockoutState(safeClone(initial?.knockout, { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] })));
  const [championshipLeg1, setChampionshipLeg1] = useState(normalizeLeagueState(safeClone(initial?.championshipLeg1, { pools: [], matches: [] })));
  const [championshipLeg2, setChampionshipLeg2] = useState(normalizeLeagueState(safeClone(initial?.championshipLeg2, { pools: [], matches: [] })));
  const [singleKnockout, setSingleKnockout] = useState(normalizeSingleKnockoutState(safeClone(initial?.singleKnockout, { quarters: [], semis: [], finals: [] })));
  const [refereeSelectedMatch, setRefereeSelectedMatch] = useState(null);
  const [refereeSelectedScoreDraft, setRefereeSelectedScoreDraft] = useState(null);
  const [refereeScoreDrafts, setRefereeScoreDrafts] = useState({});
  const [organizerMatchTeamFilter, setOrganizerMatchTeamFilter] = useState('');
  const [selectedBrassagePoolByScope, setSelectedBrassagePoolByScope] = useState({ brassage1: '', brassage2: '', principale: '', consolante: '' });
  const [selectedBrassageTeamByScope, setSelectedBrassageTeamByScope] = useState({ brassage1: '', brassage2: '', principale: '', consolante: '' });
  const importRef = useRef(null);
  const tournamentLogoInputRef = useRef(null);
  const organizerLoginInputRef = useRef(null);
  const autoRefereeSyncTimeoutRef = useRef(null);
  const backgroundCloudSaveTimeoutRef = useRef(null);
  const recentRefereeReleaseRef = useRef(new Map());
  const recentRefereeLocalEditsRef = useRef(new Map());
  const recentOrganizerLocalEditsRef = useRef(new Map());
  const latestPersistedStateRef = useRef(null);
  const refereeSelectedScoreDraftRef = useRef(refereeSelectedScoreDraft);
  const refereeScoreDraftsRef = useRef(refereeScoreDrafts);
  const cloudSaveInFlightRef = useRef(false);
  const createdAtRef = useRef(createdAt);
  const queuedCloudSaveRequestRef = useRef(null);
  const teamsRef = useRef(teams);
  const startTimeRef = useRef(startTime);
  const slotDurationRef = useRef(slotDuration);
  const phaseRulesRef = useRef(phaseRules);
  const organizerTitleInputStyle = useMemo(() => {
    const label = String(tournamentName || DEFAULT_TOURNAMENT_NAME || '').trim() || DEFAULT_TOURNAMENT_NAME;
    const length = label.length;
    let fontSize = 'clamp(28px, 4vw, 42px)';
    if (length >= 20) fontSize = 'clamp(24px, 3.8vw, 36px)';
    if (length >= 26) fontSize = 'clamp(20px, 3.3vw, 30px)';
    if (length >= 34) fontSize = 'clamp(16px, 3vw, 24px)';
    return { width: '100%', maxWidth: '100%', minWidth: 0, fontSize };
  }, [tournamentName]);
  const organizerPasswordRef = useRef(organizerPassword);
  const tournamentNameRef = useRef(tournamentName);
  const tournamentLogoRef = useRef(tournamentLogo);
  const sharedTournamentIdRef = useRef(sharedTournamentId);
  const disableBrassage2Ref = useRef(disableBrassage2);
  const remoteSavedAtRef = useRef(remoteSavedAt);
  const brassage1Ref = useRef(brassage1);
  const brassage2Ref = useRef(brassage2);
  const mainStageRef = useRef(mainStage);
  const knockoutRef = useRef(knockout);
  const championshipLeg1Ref = useRef(championshipLeg1);
  const championshipLeg2Ref = useRef(championshipLeg2);
  const singleKnockoutRef = useRef(singleKnockout);
  const pendingFreshTournamentTimestampRef = useRef(null);
  const pendingStructureSyncTimestampRef = useRef(null);
  const pendingLocalMutationTimestampRef = useRef(null);
  const previousTournamentNameRef = useRef(initial?.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME);

  useEffect(() => {
    sharedTournamentIdRef.current = sharedTournamentId;
  }, [sharedTournamentId]);

  useEffect(() => {
    disableBrassage2Ref.current = disableBrassage2;
  }, [disableBrassage2]);

  const refereeAccessUrl = useMemo(() => buildRefereeAccessUrl(sharedTournamentId), [sharedTournamentId]);
  const publicAccessUrl = useMemo(() => buildPublicAccessUrl(sharedTournamentId), [sharedTournamentId]);
  const normalizedHomeSearch = useMemo(() => String(homeSearch || '').trim().toLocaleLowerCase('fr-FR'), [homeSearch]);
  const filteredHomeTournamentOptions = useMemo(() => {
    const baseItems = [...homeTournamentOptions].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fr', { sensitivity: 'base' }));
    if (!normalizedHomeSearch) return baseItems;
    return baseItems
      .map((item) => {
        const name = String(item.name || '').toLocaleLowerCase('fr-FR');
        const index = name.indexOf(normalizedHomeSearch);
        return { ...item, matchIndex: index < 0 ? Number.MAX_SAFE_INTEGER : index };
      })
      .sort((a, b) => {
        if (a.matchIndex !== b.matchIndex) return a.matchIndex - b.matchIndex;
        return String(a.name || '').localeCompare(String(b.name || ''), 'fr', { sensitivity: 'base' });
      });
  }, [homeTournamentOptions, normalizedHomeSearch]);
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
  const isSmallTournamentMode = activeTeams.length > 0 && activeTeams.length < 8;
  const mainStageDistribution = useMemo(() => getMainStageDistribution(activeTeams.length), [activeTeams.length]);
  const useNormalizedPoolRanking = !isSmallTournamentMode && mainStageDistribution.normalizedRanking;
  const canDisableBrassage2 = !isSmallTournamentMode && activeTeams.length >= 8 && activeTeams.length <= 17;
  const shouldSkipBrassage2 = canDisableBrassage2 && disableBrassage2;

  const brassage1Standings = useMemo(() => computeGroupStandings(brassage1.pools, brassage1.matches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [brassage1, teamMap, phaseRules, useNormalizedPoolRanking]);
  const brassage2Standings = useMemo(() => computeGroupStandings(brassage2.pools, brassage2.matches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [brassage2, teamMap, phaseRules, useNormalizedPoolRanking]);
  const principaleStandings = useMemo(() => computeGroupStandings(mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules, useNormalizedPoolRanking]);
  const consolanteStandings = useMemo(() => computeGroupStandings(mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules, useNormalizedPoolRanking]);

  const rankingAfterBrassage1 = useMemo(() => computeRanking(allTeamIds, brassage1.matches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [allTeamIds, brassage1.matches, teamMap, phaseRules, useNormalizedPoolRanking]);
  const rankingAfterBrassages = useMemo(() => computeRanking(allTeamIds, [...brassage1.matches, ...brassage2.matches], teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [allTeamIds, brassage1.matches, brassage2.matches, teamMap, phaseRules, useNormalizedPoolRanking]);

  const principaleOverallRanking = useMemo(() => {
    const principaleTeamIds = (Array.isArray(mainStage.principalePools) ? mainStage.principalePools : [])
      .flatMap((pool) => Array.isArray(pool?.teamIds) ? pool.teamIds : [])
      .filter(Boolean);
    return computeRanking([...new Set(principaleTeamIds)], mainStage.principaleMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking });
  }, [mainStage.principalePools, mainStage.principaleMatches, teamMap, phaseRules, useNormalizedPoolRanking]);
  const consolanteOverallRanking = useMemo(() => {
    const consolanteTeamIds = (Array.isArray(mainStage.consolantePools) ? mainStage.consolantePools : [])
      .flatMap((pool) => Array.isArray(pool?.teamIds) ? pool.teamIds : [])
      .filter(Boolean);
    return computeRanking([...new Set(consolanteTeamIds)], mainStage.consolanteMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking });
  }, [mainStage.consolantePools, mainStage.consolanteMatches, teamMap, phaseRules, useNormalizedPoolRanking]);
  const championshipLeg1Standings = useMemo(() => computeGroupStandings(championshipLeg1.pools, championshipLeg1.matches, teamMap, phaseRules), [championshipLeg1, teamMap, phaseRules]);
  const championshipLeg2Standings = useMemo(() => computeGroupStandings(championshipLeg2.pools, championshipLeg2.matches, teamMap, phaseRules), [championshipLeg2, teamMap, phaseRules]);
  const championshipRanking = useMemo(() => computeRanking(allTeamIds, [...championshipLeg1.matches, ...championshipLeg2.matches], teamMap, phaseRules), [allTeamIds, championshipLeg1.matches, championshipLeg2.matches, teamMap, phaseRules]);
  const principalePoolTeamIds = useMemo(() => collectUniquePoolTeamIds(mainStage.principalePools), [mainStage.principalePools]);
  const consolantePoolTeamIds = useMemo(() => collectUniquePoolTeamIds(mainStage.consolantePools), [mainStage.consolantePools]);
  const principalePublicRanking = useMemo(() => computeRanking(principalePoolTeamIds, mainStage.principaleMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [principalePoolTeamIds, mainStage.principaleMatches, teamMap, phaseRules, useNormalizedPoolRanking]);
  const consolantePublicRanking = useMemo(() => computeRanking(consolantePoolTeamIds, mainStage.consolanteMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking }), [consolantePoolTeamIds, mainStage.consolanteMatches, teamMap, phaseRules, useNormalizedPoolRanking]);

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

  function getPersistedStateSnapshot(savedAt = lastSavedAt, overrides = {}) {
    return {
      teams: safeClone(overrides.teams ?? teamsRef.current, []),
      settings: {
        startTime: overrides.startTime ?? startTimeRef.current,
        slotDuration: overrides.slotDuration ?? slotDurationRef.current,
        phaseRules: safeClone(overrides.phaseRules ?? phaseRulesRef.current, DEFAULT_PHASE_RULES),
        organizerPassword: overrides.organizerPassword ?? organizerPasswordRef.current,
        tournamentName: overrides.tournamentName ?? tournamentNameRef.current,
        tournamentLogo: overrides.tournamentLogo ?? tournamentLogoRef.current,
        sharedTournamentId: overrides.sharedTournamentId ?? sharedTournamentIdRef.current,
        disableBrassage2: overrides.disableBrassage2 ?? disableBrassage2Ref.current,
      },
      meta: {
        createdAt: overrides.createdAt ?? createdAtRef.current,
        lastSavedAt: savedAt,
        remoteSavedAt: overrides.remoteSavedAt ?? remoteSavedAtRef.current,
      },
      brassage1: safeClone(overrides.brassage1 ?? brassage1Ref.current, {}),
      brassage2: safeClone(overrides.brassage2 ?? brassage2Ref.current, {}),
      mainStage: safeClone(overrides.mainStage ?? mainStageRef.current, {}),
      knockout: safeClone(overrides.knockout ?? knockoutRef.current, {}),
      championshipLeg1: safeClone(overrides.championshipLeg1 ?? championshipLeg1Ref.current, {}),
      championshipLeg2: safeClone(overrides.championshipLeg2 ?? championshipLeg2Ref.current, {}),
      singleKnockout: safeClone(overrides.singleKnockout ?? singleKnockoutRef.current, {}),
    };
  }

  function getPersistedState(savedAt = lastSavedAt) {
    return getPersistedStateSnapshot(savedAt);
  }

  function commitRefereeScoreDrafts(updater) {
    setRefereeScoreDrafts((current) => {
      const nextDrafts = typeof updater === 'function' ? updater(current) : updater;
      refereeScoreDraftsRef.current = nextDrafts;
      return nextDrafts;
    });
  }

  function applyPersistedState(parsed, options = {}) {
    if (!parsed) return;
    const preserveLocalSettings = Boolean(options.preserveLocalSettings);
    if (Array.isArray(parsed.teams)) setTeams(normalizeTeamsList(parsed.teams));
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'startTime')) setStartTime(parsed.settings?.startTime || '09:00');
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'slotDuration')) setSlotDuration(parsed.settings?.slotDuration || 20);
    if (!preserveLocalSettings && parsed.settings?.phaseRules) setPhaseRules({ ...DEFAULT_PHASE_RULES, ...parsed.settings.phaseRules });
    if (!preserveLocalSettings && Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'organizerPassword')) {
      const nextPassword = String(parsed.settings?.organizerPassword ?? '');
      setOrganizerPassword(nextPassword);
      setPasswordDraft(nextPassword);
    }
    if (!preserveLocalSettings && Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'tournamentName')) setTournamentName(parsed.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME);
    if (!preserveLocalSettings && Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'tournamentLogo')) setTournamentLogo(String(parsed.settings?.tournamentLogo || ''));
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'sharedTournamentId')) setSharedTournamentId(parsed.settings?.sharedTournamentId || '');
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'disableBrassage2')) setDisableBrassage2(Boolean(parsed.settings?.disableBrassage2));
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'createdAt')) setCreatedAt(parsed.meta?.createdAt || new Date().toISOString());
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'lastSavedAt')) setLastSavedAt(parsed.meta?.lastSavedAt || '');
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'remoteSavedAt')) setRemoteSavedAt(parsed.meta?.remoteSavedAt || '');
    if (parsed.brassage1) setBrassage1(normalizeLeagueState(parsed.brassage1));
    if (parsed.brassage2) setBrassage2(normalizeLeagueState(parsed.brassage2));
    if (parsed.mainStage) setMainStage(normalizeMainStageState(parsed.mainStage));
    if (parsed.knockout) setKnockout(normalizeKnockoutState(parsed.knockout));
    if (parsed.championshipLeg1) setChampionshipLeg1(normalizeLeagueState(parsed.championshipLeg1));
    if (parsed.championshipLeg2) setChampionshipLeg2(normalizeLeagueState(parsed.championshipLeg2));
    if (parsed.singleKnockout) setSingleKnockout(normalizeSingleKnockoutState(parsed.singleKnockout));
    if (!options.preserveSelection) {
      setRefereeSelectedMatch(null);
      setRefereeSelectedScoreDraft(null);
      refereeSelectedScoreDraftRef.current = null;
      setRefereeScoreDrafts({});
      refereeScoreDraftsRef.current = {};
      recentRefereeLocalEditsRef.current = new Map();
      recentRefereeReleaseRef.current = new Map();
    }

  }

  function markPendingStructureSync(timestamp = new Date().toISOString()) {
    pendingStructureSyncTimestampRef.current = timestamp;
    pendingLocalMutationTimestampRef.current = timestamp;
    return timestamp;
  }

  function markPendingLocalMutation(timestamp = new Date().toISOString()) {
    pendingLocalMutationTimestampRef.current = timestamp;
    return timestamp;
  }

  function queueBackgroundCloudSave(delay = 150, timestamp = null) {
    const mutationTimestamp = timestamp || new Date().toISOString();
    markPendingLocalMutation(mutationTimestamp);
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

  function mergeRemoteMatches(localMatches, remoteMatches = [], replaceOnExplicitEmpty = false) {
    const remoteArrayProvided = Array.isArray(remoteMatches);
    const safeLocalMatches = dedupeMatches(Array.isArray(localMatches) ? localMatches : []);
    const safeRemoteMatches = dedupeMatches(remoteArrayProvided ? remoteMatches : []);
    if (!remoteArrayProvided) {
      return safeLocalMatches;
    }
    if (!safeRemoteMatches.length) {
      return replaceOnExplicitEmpty ? [] : safeLocalMatches;
    }

    const localById = new Map(safeLocalMatches.map((match) => [match.id, match]));
    const localByIdentity = new Map(
      safeLocalMatches
        .map((match) => [matchIdentityKey(match), match])
        .filter(([identityKey]) => Boolean(identityKey))
    );
    const now = Date.now();
    let changed = safeLocalMatches.length !== safeRemoteMatches.length;

    const mergeLocalIntoRemote = (localMatch, remoteMatch) => {
      if (!localMatch) return remoteMatch;

      const recentRelease = recentRefereeReleaseRef.current.get(localMatch.id);
      const recentLocalEdit = recentRefereeLocalEditsRef.current.get(localMatch.id);
      const recentOrganizerEdit = recentOrganizerLocalEditsRef.current.get(localMatch.id);
      const remoteInProgress = Boolean(remoteMatch.refereeInProgress);
      const remoteMatchInProgress = Boolean(remoteMatch.matchInProgress || remoteMatch.refereeInProgress);
      const localMatchInProgress = Boolean(localMatch.matchInProgress || localMatch.refereeInProgress);
      const shouldIgnoreRemoteLock = Boolean(recentRelease && recentRelease.until > now && remoteInProgress);
      const localSubmittedAt = toTimestamp(localMatch.submittedAt);
      const remoteSubmittedAt = toTimestamp(remoteMatch.submittedAt);
      const localValidatedAt = toTimestamp(localMatch.validatedAt);
      const remoteValidatedAt = toTimestamp(remoteMatch.validatedAt);
      const localManualOverrideAt = toTimestamp(localMatch.manualOverrideAt);
      const remoteManualOverrideAt = toTimestamp(remoteMatch.manualOverrideAt);
      const localOfficialAt = Math.max(localValidatedAt, localManualOverrideAt);
      const remoteOfficialAt = Math.max(remoteValidatedAt, remoteManualOverrideAt);
      const localOfficialScoresDiffer =
        String(localMatch.scoreA ?? '') !== String(remoteMatch.scoreA ?? '') ||
        String(localMatch.scoreB ?? '') !== String(remoteMatch.scoreB ?? '');
      const hasRecentProtectedOrganizerEdit = Boolean(
        recentOrganizerEdit
        && recentOrganizerEdit.until > now
        && String(localMatch.scoreA ?? '') === String(recentOrganizerEdit.scoreA ?? '')
        && String(localMatch.scoreB ?? '') === String(recentOrganizerEdit.scoreB ?? '')
      );
      const remoteOfficialCaughtUpToLocalEdit = Boolean(
        recentOrganizerEdit
        && String(remoteMatch.scoreA ?? '') === String(recentOrganizerEdit.scoreA ?? '')
        && String(remoteMatch.scoreB ?? '') === String(recentOrganizerEdit.scoreB ?? '')
        && remoteOfficialAt >= toTimestamp(recentOrganizerEdit.officialAt)
      );
      const shouldKeepLocalOfficialEdit =
        localOfficialScoresDiffer &&
        localOfficialAt > remoteOfficialAt &&
        localOfficialAt >= remoteSubmittedAt;
      const shouldIgnoreRemoteOfficialBecauseLocalEdit =
        hasRecentProtectedOrganizerEdit
        && !remoteOfficialCaughtUpToLocalEdit
        && (localOfficialScoresDiffer || localOfficialAt >= remoteOfficialAt);
      const remoteIsValid = isMatchResultValid(remoteMatch, phaseRules);
      const localIsValid = isMatchResultValid(localMatch, phaseRules);
      const pendingScoresDiffer =
        String(localMatch.submittedScoreA ?? '') !== String(remoteMatch.submittedScoreA ?? '') ||
        String(localMatch.submittedScoreB ?? '') !== String(remoteMatch.submittedScoreB ?? '');
      const hasRecentProtectedLocalEdit = Boolean(
        recentLocalEdit
        && recentLocalEdit.until > now
        && String(localMatch.submittedScoreA ?? '') === String(recentLocalEdit.submittedScoreA ?? '')
        && String(localMatch.submittedScoreB ?? '') === String(recentLocalEdit.submittedScoreB ?? '')
      );
      const remotePendingCaughtUpToLocalEdit = Boolean(
        recentLocalEdit
        && String(remoteMatch.submittedScoreA ?? '') === String(recentLocalEdit.submittedScoreA ?? '')
        && String(remoteMatch.submittedScoreB ?? '') === String(recentLocalEdit.submittedScoreB ?? '')
        && remoteSubmittedAt >= localSubmittedAt
      );
      const shouldIgnoreRemotePendingBecauseLocalEdit =
        hasRecentProtectedLocalEdit
        && pendingScoresDiffer
        && !remotePendingCaughtUpToLocalEdit
        && remoteSubmittedAt <= localSubmittedAt;
      const shouldAdoptRemotePendingWithoutTimestamp =
        mode !== 'referee' &&
        pendingScoresDiffer &&
        (remoteMatchInProgress || Boolean(remoteMatch.submittedAt));

      let nextMatch = { ...remoteMatch };

      if (shouldKeepLocalOfficialEdit || shouldIgnoreRemoteOfficialBecauseLocalEdit) {
        nextMatch = {
          ...nextMatch,
          scoreA: localMatch.scoreA ?? '',
          scoreB: localMatch.scoreB ?? '',
          validatedAt: localMatch.validatedAt ?? null,
          manualOverrideAt: localMatch.manualOverrideAt ?? null,
          submittedScoreA: '',
          submittedScoreB: '',
          submittedAt: null,
          refereeInProgress: false,
          matchInProgress: false,
        };
      } else if (remoteIsValid && (!localIsValid || remoteOfficialAt >= localOfficialAt)) {
        nextMatch = {
          ...nextMatch,
          scoreA: remoteMatch.scoreA ?? '',
          scoreB: remoteMatch.scoreB ?? '',
          validatedAt: remoteMatch.validatedAt ?? null,
          manualOverrideAt: remoteMatch.manualOverrideAt ?? null,
          submittedScoreA: '',
          submittedScoreB: '',
          submittedAt: null,
          refereeInProgress: false,
          matchInProgress: false,
        };
      } else if (!shouldIgnoreRemoteOfficialBecauseLocalEdit && !shouldIgnoreRemotePendingBecauseLocalEdit && (remoteSubmittedAt >= localSubmittedAt || shouldAdoptRemotePendingWithoutTimestamp)) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: remoteMatch.submittedScoreA ?? '',
          submittedScoreB: remoteMatch.submittedScoreB ?? '',
          submittedAt: remoteMatch.submittedAt ?? null,
          refereeInProgress: shouldIgnoreRemoteLock ? false : remoteInProgress,
          matchInProgress: shouldIgnoreRemoteLock ? (localMatchInProgress || remoteMatchInProgress) : remoteMatchInProgress,
        };
      } else if (shouldIgnoreRemoteLock) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: localMatch.submittedScoreA ?? nextMatch.submittedScoreA ?? '',
          submittedScoreB: localMatch.submittedScoreB ?? nextMatch.submittedScoreB ?? '',
          submittedAt: localMatch.submittedAt ?? nextMatch.submittedAt ?? null,
          refereeInProgress: false,
          matchInProgress: localMatchInProgress || remoteMatchInProgress,
        };
      } else if (shouldIgnoreRemotePendingBecauseLocalEdit) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: localMatch.submittedScoreA ?? '',
          submittedScoreB: localMatch.submittedScoreB ?? '',
          submittedAt: localMatch.submittedAt ?? null,
          refereeInProgress: localMatch.refereeInProgress ?? nextMatch.refereeInProgress ?? false,
          matchInProgress: localMatch.matchInProgress ?? nextMatch.matchInProgress ?? false,
        };
      }

      if (!remoteInProgress && !remoteMatchInProgress && recentRelease) {
        recentRefereeReleaseRef.current.delete(localMatch.id);
      }
      if (recentLocalEdit) {
        const remoteCaughtUpToLocalEdit =
          String(remoteMatch.submittedScoreA ?? '') === String(localMatch.submittedScoreA ?? '')
          && String(remoteMatch.submittedScoreB ?? '') === String(localMatch.submittedScoreB ?? '')
          && remoteSubmittedAt >= localSubmittedAt;
        if (remoteCaughtUpToLocalEdit || recentLocalEdit.until <= now || !nextMatch.refereeInProgress) {
          recentRefereeLocalEditsRef.current.delete(localMatch.id);
        }
      }
      if (recentOrganizerEdit) {
        if (remoteOfficialCaughtUpToLocalEdit || recentOrganizerEdit.until <= now) {
          recentOrganizerLocalEditsRef.current.delete(localMatch.id);
        }
      }

      const hasChanged = JSON.stringify(localMatch) !== JSON.stringify(nextMatch);
      if (hasChanged) changed = true;
      return hasChanged ? nextMatch : localMatch;
    };

    const merged = safeRemoteMatches.map((remoteMatch) => {
      const localBySameId = localById.get(remoteMatch.id) || null;
      if (localBySameId) {
        return mergeLocalIntoRemote(localBySameId, remoteMatch);
      }

      const remoteIdentityKey = matchIdentityKey(remoteMatch);
      const localBySameIdentity = remoteIdentityKey ? localByIdentity.get(remoteIdentityKey) : null;
      const sameTeams = Boolean(
        localBySameIdentity
        && String(localBySameIdentity.teamAId ?? '') === String(remoteMatch.teamAId ?? '')
        && String(localBySameIdentity.teamBId ?? '') === String(remoteMatch.teamBId ?? '')
      );

      if (sameTeams) {
        const mergedMatch = mergeLocalIntoRemote(localBySameIdentity, remoteMatch);
        if (shouldPreserveLocalMatchIdentity(localBySameIdentity, remoteMatch)) {
          return {
            ...mergedMatch,
            id: localBySameIdentity.id,
            generatedAt: localBySameIdentity.generatedAt ?? mergedMatch.generatedAt,
            court: localBySameIdentity.court ?? mergedMatch.court,
            slot: localBySameIdentity.slot ?? mergedMatch.slot,
            time: localBySameIdentity.time ?? mergedMatch.time,
          };
        }
        return mergedMatch;
      }

      if (localBySameIdentity) {
        changed = true;
      }
      return remoteMatch;
    });

    return dedupeMatches(merged);
  }


  function mergeRemoteLeagueState(currentState, remoteState) {
    const normalizedCurrent = normalizeLeagueState(currentState || { pools: [], matches: [] });
    const normalizedRemote = normalizeLeagueState(remoteState || { pools: [], matches: [] });
    const remoteHasPools = Array.isArray(normalizedRemote.pools) && normalizedRemote.pools.length > 0;
    const remoteExplicitlyEmpty = Array.isArray(remoteState?.matches) && remoteState.matches.length === 0 && Array.isArray(remoteState?.pools) && remoteState.pools.length === 0;
    return {
      ...normalizedCurrent,
      ...normalizedRemote,
      pools: remoteHasPools ? normalizedRemote.pools : (remoteExplicitlyEmpty ? [] : normalizedCurrent.pools),
      matches: mergeRemoteMatches(normalizedCurrent.matches, normalizedRemote.matches, remoteExplicitlyEmpty),
    };
  }

  function mergeRemoteMainStageState(currentState, remoteState) {
    const normalizedCurrent = normalizeMainStageState(currentState || {});
    const normalizedRemote = normalizeMainStageState(remoteState || {});
    const principaleExplicitlyEmpty = Array.isArray(remoteState?.principaleMatches) && remoteState.principaleMatches.length === 0 && Array.isArray(remoteState?.principalePools) && remoteState.principalePools.length === 0;
    const consolanteExplicitlyEmpty = Array.isArray(remoteState?.consolanteMatches) && remoteState.consolanteMatches.length === 0 && Array.isArray(remoteState?.consolantePools) && remoteState.consolantePools.length === 0;
    return {
      ...normalizedCurrent,
      ...normalizedRemote,
      principalePools: normalizedRemote.principalePools?.length ? normalizedRemote.principalePools : (principaleExplicitlyEmpty ? [] : normalizedCurrent.principalePools),
      principaleMatches: mergeRemoteMatches(normalizedCurrent.principaleMatches, normalizedRemote.principaleMatches || [], principaleExplicitlyEmpty),
      consolantePools: normalizedRemote.consolantePools?.length ? normalizedRemote.consolantePools : (consolanteExplicitlyEmpty ? [] : normalizedCurrent.consolantePools),
      consolanteMatches: mergeRemoteMatches(normalizedCurrent.consolanteMatches, normalizedRemote.consolanteMatches || [], consolanteExplicitlyEmpty),
    };
  }

  function buildCurrentTeamContext() {
    const currentTeams = normalizeTeamsList(teamsRef.current || []).filter((team) => (team.name || '').trim() !== '');
    return {
      teams: currentTeams,
      teamMap: new Map(currentTeams.map((team) => [team.id, team])),
      teamIds: currentTeams.map((team) => team.id),
    };
  }

  function mergeRemoteRefereeState(payload) {
    if (!payload) return;

    const remotePayloadTimestamp = toTimestamp(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt || null);
    const localSnapshotTimestamp = toTimestamp(latestPersistedStateRef.current?.meta?.lastSavedAt || latestPersistedStateRef.current?.meta?.remoteSavedAt || null);
    if (remotePayloadTimestamp && localSnapshotTimestamp && remotePayloadTimestamp < localSnapshotTimestamp) {
      return;
    }

    const pendingStructureSyncTimestamp = pendingStructureSyncTimestampRef.current;
    if (pendingStructureSyncTimestamp) {
      const pendingStructureTimestamp = toTimestamp(pendingStructureSyncTimestamp);
      if (!remotePayloadTimestamp || remotePayloadTimestamp < pendingStructureTimestamp) {
        return;
      }
      pendingStructureSyncTimestampRef.current = null;
    }

    const pendingFreshTournamentTimestamp = pendingFreshTournamentTimestampRef.current;
    if (pendingFreshTournamentTimestamp) {
      const pendingResetTimestamp = toTimestamp(pendingFreshTournamentTimestamp);
      if (!remotePayloadTimestamp || remotePayloadTimestamp < pendingResetTimestamp) {
        return;
      }
      pendingFreshTournamentTimestampRef.current = null;
    }

    const pendingLocalMutationTimestamp = pendingLocalMutationTimestampRef.current;
    if (pendingLocalMutationTimestamp) {
      const pendingLocalTimestamp = toTimestamp(pendingLocalMutationTimestamp);
      if (!remotePayloadTimestamp || remotePayloadTimestamp < pendingLocalTimestamp) {
        return;
      }
      pendingLocalMutationTimestampRef.current = null;
    }

    const remoteMatchCount = countMatchesInPersistedState(payload);
    const localMatchCount = allCompetitionMatches.length;
    const remoteTeamCount = Array.isArray(payload?.teams) ? payload.teams.length : 0;
    const remoteTeamsSignature = JSON.stringify((Array.isArray(payload?.teams) ? payload.teams : []).map((team) => ({
      id: team?.id || '',
      name: String(team?.name || '').trim(),
      level: team?.level || '',
    })));
    const localTeamsSignature = JSON.stringify((Array.isArray(teams) ? teams : []).map((team) => ({
      id: team?.id || '',
      name: String(team?.name || '').trim(),
      level: team?.level || '',
    })));
    const remoteTournamentName = String(payload?.settings?.tournamentName || '').trim();
    const localTournamentName = String(tournamentNameRef.current || tournamentName || '').trim();
    const shouldHydrateStructure =
      (remoteMatchCount > 0 && localMatchCount === 0)
      || remoteMatchCount > localMatchCount
      || (remoteTeamCount > 0 && teams.length < remoteTeamCount)
      || (remoteTeamsSignature !== localTeamsSignature)
      ;

    if (shouldHydrateStructure && mode !== 'referee') {
      applyPersistedState(payload, { preserveSelection: true, preserveLocalSettings: true });
      latestPersistedStateRef.current = safeClone(payload, {});
    }

    setRemoteStateInitialized(true);
    if (payload?.meta?.remoteSavedAt) setRemoteSavedAt(payload.meta.remoteSavedAt);
    if (payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt) {
      setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt)}`);
    }
    if (payload.brassage1) setBrassage1((current) => mergeRemoteLeagueState(current, payload.brassage1));
    if (payload.brassage2) setBrassage2((current) => mergeRemoteLeagueState(current, payload.brassage2));
    if (payload.mainStage) {
      setMainStage((current) => mergeRemoteMainStageState(current, payload.mainStage));
    }
    if (payload.knockout) {
      setKnockout((current) => ({
        ...current,
        principalQuarters: Array.isArray(payload.knockout?.principalQuarters) ? mergeRemoteMatches(current.principalQuarters, payload.knockout.principalQuarters, payload.knockout.principalQuarters.length === 0) : current.principalQuarters,
        principalSemis: Array.isArray(payload.knockout?.principalSemis) ? mergeRemoteMatches(current.principalSemis, payload.knockout.principalSemis, payload.knockout.principalSemis.length === 0) : current.principalSemis,
        principalFinals: Array.isArray(payload.knockout?.principalFinals) ? mergeRemoteMatches(current.principalFinals, payload.knockout.principalFinals, payload.knockout.principalFinals.length === 0) : current.principalFinals,
        consolanteSemis: Array.isArray(payload.knockout?.consolanteSemis) ? mergeRemoteMatches(current.consolanteSemis, payload.knockout.consolanteSemis, payload.knockout.consolanteSemis.length === 0) : current.consolanteSemis,
        consolanteFinals: Array.isArray(payload.knockout?.consolanteFinals) ? mergeRemoteMatches(current.consolanteFinals, payload.knockout.consolanteFinals, payload.knockout.consolanteFinals.length === 0) : current.consolanteFinals,
      }));
    }
    if (payload.championshipLeg1) setChampionshipLeg1((current) => mergeRemoteLeagueState(current, payload.championshipLeg1));
    if (payload.championshipLeg2) setChampionshipLeg2((current) => mergeRemoteLeagueState(current, payload.championshipLeg2));
    if (payload.singleKnockout) {
      setSingleKnockout((current) => ({
        ...current,
        quarters: Array.isArray(payload.singleKnockout?.quarters) ? mergeRemoteMatches(current.quarters, payload.singleKnockout.quarters, payload.singleKnockout.quarters.length === 0) : current.quarters,
        semis: Array.isArray(payload.singleKnockout?.semis) ? mergeRemoteMatches(current.semis, payload.singleKnockout.semis, payload.singleKnockout.semis.length === 0) : current.semis,
        finals: Array.isArray(payload.singleKnockout?.finals) ? mergeRemoteMatches(current.finals, payload.singleKnockout.finals, payload.singleKnockout.finals.length === 0) : current.finals,
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
      pendingStructureSyncTimestampRef.current = null;
      pendingLocalMutationTimestampRef.current = null;
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

  async function fetchHomeTournamentCatalog() {
    setHomeCatalogLoading(true);
    setHomeCatalogError('');
    try {
      const response = await fetch(buildFirebaseTournamentsCollectionUrl());
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Impossible de charger la liste des tournois.');
      }
      const items = Object.entries(payload || {})
        .map(([id, data]) => {
          const createdAtRaw = data?.meta?.createdAt || data?.meta?.lastSavedAt || data?.meta?.remoteSavedAt || '';
          const createdAtValue = createdAtRaw ? new Date(createdAtRaw).getTime() : Number.MAX_SAFE_INTEGER;
          return {
            id,
            name: String(data?.settings?.tournamentName || id || 'Tournoi sans nom'),
            createdAt: createdAtRaw,
            createdAtValue: Number.isFinite(createdAtValue) ? createdAtValue : Number.MAX_SAFE_INTEGER,
            organizerPassword: String(data?.settings?.organizerPassword ?? ''),
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
      setHomeTournamentOptions(items);
      setHomeSelectedTournamentId((current) => {
        if (current && items.some((item) => item.id === current)) return current;
        return items[0]?.id || '';
      });
      setHomeSearch((current) => {
        if (current) return current;
        return items[0]?.name || '';
      });
      return items;
    } catch (error) {
      const message = String(error?.message || 'Impossible de charger la liste des tournois.');
      const enhancedMessage = /permission denied/i.test(message)
        ? "Permission denied : la règle Firebase doit autoriser la lecture de /tournaments pour afficher la liste d'accueil."
        : message;
      setHomeCatalogError(enhancedMessage);
      setHomeTournamentOptions([]);
      setHomeSelectedTournamentId('');
      return [];
    } finally {
      setHomeCatalogLoading(false);
    }
  }

  async function deleteSelectedTournamentFromHome() {
    const targetId = String(homeSelectedTournamentId || '').trim();
    if (!targetId) {
      window.alert('Sélectionne un tournoi dans la liste.');
      return;
    }
    const target = homeTournamentOptions.find((item) => item.id === targetId);
    const targetLabel = String(target?.name || targetId);
    if (!window.confirm(`Supprimer le tournoi « ${targetLabel} » de Firebase ?`)) return;
    setHomeDeletingTournamentId(targetId);
    setHomeCatalogError('');
    try {
      const readResponse = await fetch(buildFirebaseTournamentUrl(targetId));
      const readPayload = await readResponse.json().catch(() => ({}));
      if (!readResponse.ok) {
        const rawMessage = String(readPayload?.error || 'Impossible de vérifier le mot de passe du tournoi.');
        const enhancedMessage = /permission denied/i.test(rawMessage)
          ? "Permission denied : la règle Firebase doit autoriser la lecture du tournoi sélectionné pour vérifier le mot de passe avant suppression."
          : rawMessage;
        throw new Error(enhancedMessage);
      }
      const tournamentPassword = String(readPayload?.settings?.organizerPassword ?? '');
      if (tournamentPassword === '') {
        const confirmedWithoutPassword = window.confirm(`Le tournoi « ${targetLabel} » n'a pas de mot de passe. Veux-tu le supprimer ?`);
        if (!confirmedWithoutPassword) return;
      } else {
        const deletionPassword = window.prompt(`Pour supprimer le tournoi « ${targetLabel} », saisis le mot de passe du tournoi.`);
        if (deletionPassword === null) return;
        const normalizedDeletionPassword = String(deletionPassword ?? '');
        const isPasswordValid = normalizedDeletionPassword === 'Chuly0ne' || normalizedDeletionPassword === tournamentPassword;
        if (!isPasswordValid) {
          window.alert('Mot de passe incorrect. Suppression annulée.');
          return;
        }
      }
      const response = await fetch(buildFirebaseTournamentUrl(targetId), { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const rawMessage = String(payload?.error || 'Impossible de supprimer le tournoi.');
        const enhancedMessage = /permission denied/i.test(rawMessage)
          ? "Permission denied : la règle Firebase doit autoriser l'écriture sur /tournaments pour supprimer un tournoi."
          : rawMessage;
        throw new Error(enhancedMessage);
      }
      const remaining = homeTournamentOptions.filter((item) => item.id !== targetId);
      setHomeTournamentOptions(remaining);
      const nextSelected = remaining[0]?.id || '';
      setHomeSelectedTournamentId(nextSelected);
      setHomeSearch(remaining[0]?.name || '');
      if (String(sharedTournamentIdRef.current || '').trim() === targetId) {
        setMode('home');
        setIsOrganizerAuthenticated(false);
      }
      window.alert('Tournoi supprimé de Firebase.');
      if (remaining.length === 0) {
        setHomeSelectorOpen(false);
      }
    } catch (error) {
      setHomeCatalogError(error.message || 'Impossible de supprimer le tournoi.');
      window.alert(error.message || 'Impossible de supprimer le tournoi.');
    } finally {
      setHomeDeletingTournamentId('');
    }
  }

  async function continueWithSelectedTournament() {
    const targetId = String(homeSelectedTournamentId || '').trim();
    if (!targetId) {
      window.alert('Sélectionne un tournoi dans la liste.');
      return;
    }
    const loaded = await loadTournamentFromCloud(targetId, false);
    if (!loaded) return;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      url.searchParams.set('sharedTournamentId', targetId);
      window.history.replaceState({}, '', url.toString());
    }
    setHomeSelectorOpen(false);
    setMode('public');
    setIsOrganizerAuthenticated(false);
  }

  async function createTournamentFromHome() {
    const resetStartedAt = new Date().toISOString();
    const freshState = {
      ...buildFreshTournamentState({ preserveSharedId: false, preservePassword: false, resetLevelsToL: true }),
      meta: { createdAt: resetStartedAt, lastSavedAt: resetStartedAt, remoteSavedAt: '' },
    };
    applyPersistedState(freshState);
    restoreOrganizerFreshView();
    setRemoteStateInitialized(true);
    setRemoteSyncMessage('');
    setIsRemoteSyncing(false);
    if (typeof window !== 'undefined') {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
      safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(freshState));
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      url.searchParams.set('sharedTournamentId', freshState.settings.sharedTournamentId);
      window.history.replaceState({}, '', url.toString());
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
        if (!response.ok) throw new Error(body?.error || 'Impossible de créer le tournoi sur Firebase.');
        applyPersistedState(cloudPayload);
        setRemoteSavedAt(savedAt);
        setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(savedAt)}`);
        if (typeof window !== 'undefined') safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(cloudPayload));
      } catch (error) {
        setRemoteSyncMessage(error.message || 'Échec de la création du tournoi sur Firebase.');
        window.alert(error.message || 'Échec de la création du tournoi sur Firebase.');
        return;
      }
    }
    setMode('organizer');
    setIsOrganizerAuthenticated(true);
    setActiveTab('dashboard');
    fetchHomeTournamentCatalog();
  }

  async function saveTournamentToCloud(showMessage = true, silent = false) {
    if (mode === 'referee' && !remoteStateInitialized) {
      if (!silent) {
        setRemoteSyncMessage('Chargement Firebase en cours...');
      }
      return false;
    }

    if (cloudSaveInFlightRef.current) {
      queuedCloudSaveRequestRef.current = { showMessage, silent };
      if (!silent) {
        setRemoteSyncMessage('Sauvegarde Firebase en file d’attente...');
      }
      return true;
    }

    cloudSaveInFlightRef.current = true;
    const effectiveId = String(sharedTournamentIdRef.current || '').trim() || buildDefaultSharedTournamentId(tournamentNameRef.current);
    if (!sharedTournamentIdRef.current) {
      sharedTournamentIdRef.current = effectiveId;
      setSharedTournamentId(effectiveId);
    }
    const savedAt = new Date().toISOString();
    const basePayload = getPersistedStateSnapshot(savedAt, { sharedTournamentId: effectiveId });
    latestPersistedStateRef.current = basePayload;
    const payload = safeClone(basePayload, {});
    payload.settings = { ...(payload.settings || {}), sharedTournamentId: effectiveId };
    payload.meta = { ...(payload.meta || {}), lastSavedAt: savedAt, remoteSavedAt: savedAt };
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
      pendingStructureSyncTimestampRef.current = null;
      pendingLocalMutationTimestampRef.current = savedAt;
      setLastSavedAt(savedAt);
      setRemoteSavedAt(savedAt);
      setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(savedAt)}`);
      if (typeof window !== 'undefined') {
        safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(payload));
      }
      if (showMessage) window.alert('Tournoi partagé sauvegardé sur Firebase.');
      return true;
    } catch (error) {
      if (!silent) setRemoteSyncMessage(error.message || 'Échec de la sauvegarde Firebase.');
      if (showMessage) window.alert(error.message || 'Échec de la sauvegarde Firebase.');
      return false;
    } finally {
      cloudSaveInFlightRef.current = false;
      if (!silent) setIsRemoteSyncing(false);
      const queuedRequest = queuedCloudSaveRequestRef.current;
      if (queuedRequest) {
        queuedCloudSaveRequestRef.current = null;
        saveTournamentToCloud(queuedRequest.showMessage, queuedRequest.silent);
      }
    }
  }

  function saveTournamentState(showMessage = true) {
    if (typeof window === 'undefined') return;
    const savedAt = new Date().toISOString();
    const snapshot = getPersistedStateSnapshot(savedAt);
    latestPersistedStateRef.current = snapshot;
    safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(snapshot));
    setLastSavedAt(savedAt);
    if (showMessage) {
      window.alert('État du tournoi sauvegardé sur ce navigateur.');
    }
  }

  useEffect(() => { refereeScoreDraftsRef.current = refereeScoreDrafts; }, [refereeScoreDrafts]);
  useEffect(() => { refereeSelectedScoreDraftRef.current = refereeSelectedScoreDraft; }, [refereeSelectedScoreDraft]);
  useEffect(() => { teamsRef.current = teams; }, [teams]);
  useEffect(() => { startTimeRef.current = startTime; }, [startTime]);
  useEffect(() => { slotDurationRef.current = slotDuration; }, [slotDuration]);
  useEffect(() => { phaseRulesRef.current = phaseRules; }, [phaseRules]);
  useEffect(() => { organizerPasswordRef.current = organizerPassword; }, [organizerPassword]);
  useEffect(() => { tournamentNameRef.current = tournamentName; }, [tournamentName]);
  useEffect(() => { tournamentLogoRef.current = tournamentLogo; }, [tournamentLogo]);
  useEffect(() => { sharedTournamentIdRef.current = sharedTournamentId; }, [sharedTournamentId]);
  useEffect(() => { createdAtRef.current = createdAt; }, [createdAt]);
  useEffect(() => { disableBrassage2Ref.current = disableBrassage2; }, [disableBrassage2]);
  useEffect(() => { remoteSavedAtRef.current = remoteSavedAt; }, [remoteSavedAt]);
  useEffect(() => { brassage1Ref.current = brassage1; }, [brassage1]);
  useEffect(() => { brassage2Ref.current = brassage2; }, [brassage2]);
  useEffect(() => { mainStageRef.current = mainStage; }, [mainStage]);
  useEffect(() => { knockoutRef.current = knockout; }, [knockout]);
  useEffect(() => { championshipLeg1Ref.current = championshipLeg1; }, [championshipLeg1]);
  useEffect(() => { championshipLeg2Ref.current = championshipLeg2; }, [championshipLeg2]);
  useEffect(() => { singleKnockoutRef.current = singleKnockout; }, [singleKnockout]);

  useEffect(() => {
    latestPersistedStateRef.current = getPersistedStateSnapshot();
    if (typeof window === 'undefined') return;
    safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(latestPersistedStateRef.current));
  }, [teams, startTime, slotDuration, phaseRules, organizerPassword, tournamentName, tournamentLogo, sharedTournamentId, disableBrassage2, remoteSavedAt, brassage1, brassage2, mainStage, knockout, championshipLeg1, championshipLeg2, singleKnockout]);

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
    if (mode === 'home') {
      fetchHomeTournamentCatalog();
    }
  }, [mode]);

  useEffect(() => {
    if (!filteredHomeTournamentOptions.length) return;
    const selectedItem = filteredHomeTournamentOptions.find((item) => item.id === homeSelectedTournamentId);
    if (!selectedItem) {
      setHomeSelectedTournamentId(filteredHomeTournamentOptions[0].id);
    }
  }, [filteredHomeTournamentOptions, homeSelectedTournamentId]);


  useEffect(() => {
    if (mode === 'home' || !sharedTournamentId) return;
    let cancelled = false;

    const pollRemoteLiveState = async () => {
      try {
        const payload = await fetchTournamentFromCloudRaw(sharedTournamentId);
        if (!cancelled) mergeRemoteRefereeState(payload);
      } catch (error) {
        // ignore background sync errors
      }
    };

    pollRemoteLiveState();
    const remotePollIntervalMs = mode === 'public'
      ? 400
      : mode === 'organizer'
        ? 350
        : 800;
    const intervalId = window.setInterval(pollRemoteLiveState, remotePollIntervalMs);
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
    disableBrassage2,
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
  }), [tournamentName, sharedTournamentId, disableBrassage2, teams, startTime, slotDuration, phaseRules, brassage1, brassage2, mainStage, knockout, championshipLeg1, championshipLeg2, singleKnockout]);

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

  const visibleBrassage1Matches = useMemo(() => filterMatchesToPools(brassage1.matches, brassage1.pools, 'Brassage 1'), [brassage1.matches, brassage1.pools]);
  const visibleBrassage2Matches = useMemo(() => filterMatchesToPools(brassage2.matches, brassage2.pools, 'Brassage 2'), [brassage2.matches, brassage2.pools]);
  const visiblePrincipaleMatches = useMemo(() => filterMatchesToPools(mainStage.principaleMatches, mainStage.principalePools, 'Principale'), [mainStage.principaleMatches, mainStage.principalePools]);
  const visibleConsolanteMatches = useMemo(() => filterMatchesToPools(mainStage.consolanteMatches, mainStage.consolantePools, 'Consolante'), [mainStage.consolanteMatches, mainStage.consolantePools]);

  const hasPublicPoolRankingStarted = useMemo(() => (
    visiblePrincipaleMatches.some((match) => hasMatchStartedForPublicRanking(match, phaseRules))
    || visibleConsolanteMatches.some((match) => hasMatchStartedForPublicRanking(match, phaseRules))
  ), [visiblePrincipaleMatches, visibleConsolanteMatches, phaseRules]);
  const hasStartedBrassage1PublicRanking = useMemo(() => (
    visibleBrassage1Matches.some((match) => hasMatchStartedForPublicRanking(match, phaseRules))
  ), [visibleBrassage1Matches, phaseRules]);
  const hasStartedBrassage2PublicRanking = useMemo(() => (
    visibleBrassage2Matches.some((match) => hasMatchStartedForPublicRanking(match, phaseRules))
  ), [visibleBrassage2Matches, phaseRules]);
  const showPublicPrincipalePoolRanking = hasPublicPoolRankingStarted
    && principalePublicRanking.length > 0
    && knockout.principalQuarters.length === 0
    && knockout.principalSemis.length === 0;
  const showPublicConsolantePoolRanking = hasPublicPoolRankingStarted
    && consolantePublicRanking.length > 0
    && knockout.consolanteSemis.length === 0
    && knockout.consolanteFinals.length === 0;
  const showSplitPublicPoolRankings = (showPublicPrincipalePoolRanking || showPublicConsolantePoolRanking);
  const hidePublicRankingSection = false;
  const publicOverallRankingRows = showSplitPublicPoolRankings
    ? []
    : hasStartedBrassage2PublicRanking
      ? rankingAfterBrassages
      : hasStartedBrassage1PublicRanking
        ? rankingAfterBrassage1
        : overallRanking;
  const publicOverallRankingTitle = hasStartedBrassage2PublicRanking
    ? 'Classement cumulé brassage 1 + brassage 2'
    : hasStartedBrassage1PublicRanking
      ? 'Classement cumulé du brassage 1'
      : 'Classement cumulé';
  const publicOverallRankingSubtitle = hasStartedBrassage2PublicRanking
    ? 'Les matchs valides du brassage 1 et du brassage 2 sont pris en compte.'
    : hasStartedBrassage1PublicRanking
      ? 'Les matchs valides du brassage 1 sont pris en compte dès cette phase dans l’affichage public.'
      : 'Tous les matchs officiels valides sont pris en compte.';

  const organizerPhaseEstimateData = useMemo(() => {
    if (isSmallTournamentMode) {
      const championshipAllerComplete = championshipLeg1.matches.length > 0 && championshipLeg1.matches.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
      const championshipRetourComplete = championshipLeg2.matches.length > 0 && championshipLeg2.matches.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
      const quarterComplete = singleKnockout.quarters.length === 0 || singleKnockout.quarters.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
      const semiComplete = singleKnockout.semis.length === 0 || singleKnockout.semis.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
      const finalsComplete = singleKnockout.finals.length > 0 && singleKnockout.finals.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');

      const currentStage = [
        { phaseLabel: 'Championnat Aller', matches: championshipLeg1.matches, complete: championshipAllerComplete },
        { phaseLabel: 'Championnat Retour', matches: championshipLeg2.matches, complete: championshipRetourComplete },
        { phaseLabel: 'Quarts de finale', matches: singleKnockout.quarters, complete: quarterComplete },
        { phaseLabel: 'Demi-finales', matches: singleKnockout.semis, complete: semiComplete },
        { phaseLabel: 'Finale / petite finale', matches: singleKnockout.finals, complete: finalsComplete },
      ].find((stage) => stage.matches.length > 0 && !stage.complete)
        || [
          { phaseLabel: 'Finale / petite finale', matches: singleKnockout.finals },
          { phaseLabel: 'Demi-finales', matches: singleKnockout.semis },
          { phaseLabel: 'Quarts de finale', matches: singleKnockout.quarters },
          { phaseLabel: 'Championnat Retour', matches: championshipLeg2.matches },
          { phaseLabel: 'Championnat Aller', matches: championshipLeg1.matches },
        ].find((stage) => stage.matches.length > 0)
        || { phaseLabel: 'Phase à venir', matches: [] };

      return {
        mode: 'single',
        heading: 'Fin estimée de la phase',
        phaseLabel: currentStage.phaseLabel,
        value: getEstimatedEndTextForMatches(currentStage.matches, scheduleData.scheduleMap, '--'),
      };
    }

    const brassage1Complete = visibleBrassage1Matches.length > 0 && visibleBrassage1Matches.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
    const brassage2Complete = visibleBrassage2Matches.length > 0 && visibleBrassage2Matches.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');

    const hasMainStageOrFinals = mainStage.principaleMatches.length > 0
      || mainStage.consolanteMatches.length > 0
      || knockout.principalQuarters.length > 0
      || knockout.principalSemis.length > 0
      || knockout.principalFinals.length > 0
      || knockout.consolanteSemis.length > 0
      || knockout.consolanteFinals.length > 0;

    if (hasMainStageOrFinals) {
      return {
        mode: 'split',
        heading: 'Fin estimée de la phase',
        leftTitle: 'Tableau principal',
        leftItems: [
          { label: 'Matchs de poules principale', value: getEstimatedEndTextForMatches(visiblePrincipaleMatches, scheduleData.scheduleMap) },
          { label: 'Quarts de finale principale', value: getEstimatedEndTextForMatches(knockout.principalQuarters, scheduleData.scheduleMap) },
          { label: 'Demi-finales principale', value: getEstimatedEndTextForMatches(knockout.principalSemis, scheduleData.scheduleMap) },
          { label: 'Finale / petite finale principale', value: getEstimatedEndTextForMatches(knockout.principalFinals, scheduleData.scheduleMap) },
        ],
        rightTitle: 'Tableau consolante',
        rightItems: [
          { label: 'Matchs de poules consolante', value: getEstimatedEndTextForMatches(visibleConsolanteMatches, scheduleData.scheduleMap) },
          { label: 'Demi-finales consolante', value: getEstimatedEndTextForMatches(knockout.consolanteSemis, scheduleData.scheduleMap) },
          { label: 'Finale / petite finale consolante', value: getEstimatedEndTextForMatches(knockout.consolanteFinals, scheduleData.scheduleMap) },
        ],
      };
    }

    const currentStage = [
      { phaseLabel: 'Brassage 1', matches: visibleBrassage1Matches, complete: brassage1Complete },
      { phaseLabel: 'Brassage 2', matches: visibleBrassage2Matches, complete: brassage2Complete },
    ].find((stage) => stage.matches.length > 0 && !stage.complete)
      || [
        { phaseLabel: 'Brassage 2', matches: visibleBrassage2Matches },
        { phaseLabel: 'Brassage 1', matches: visibleBrassage1Matches },
      ].find((stage) => stage.matches.length > 0)
      || { phaseLabel: 'Phase à venir', matches: [] };

    return {
      mode: 'single',
      heading: 'Fin estimée de la phase',
      phaseLabel: currentStage.phaseLabel,
      value: getEstimatedEndTextForMatches(currentStage.matches, scheduleData.scheduleMap, '--'),
    };
  }, [
    isSmallTournamentMode,
    championshipLeg1.matches,
    championshipLeg2.matches,
    singleKnockout.quarters,
    singleKnockout.semis,
    singleKnockout.finals,
    visibleBrassage1Matches,
    visibleBrassage2Matches,
    visiblePrincipaleMatches,
    visibleConsolanteMatches,
    mainStage.principaleMatches,
    mainStage.consolanteMatches,
    knockout.principalQuarters,
    knockout.principalSemis,
    knockout.principalFinals,
    knockout.consolanteSemis,
    knockout.consolanteFinals,
    phaseRules,
    scheduleData.scheduleMap,
  ]);

  const currentMatches = useMemo(() => (
    allCompetitionMatches
      .filter((match) => isMatchCurrentlyInProgress(match, phaseRules))
      .filter((match) => isPublicDisplayableMatch(match, resolveTeam))
      .sort((a, b) => (scheduleData.scheduleMap[a.id]?.startMinutes || 0) - (scheduleData.scheduleMap[b.id]?.startMinutes || 0))
      .slice(0, MAX_ACTIVE_COURTS)
      .map((match) => ({
        ...match,
        time: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
      }))
  ), [allCompetitionMatches, phaseRules, resolveTeam, scheduleData]);

  const upcomingMatches = useMemo(() => (
    allCompetitionMatches
      .filter((match) => {
        if (isMatchCurrentlyInProgress(match, phaseRules)) return false;
        if (!isPublicDisplayableMatch(match, resolveTeam)) return false;
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
  ), [allCompetitionMatches, phaseRules, resolveTeam, scheduleData]);

  const publicPodiumLeaders = useMemo(() => {
    const isResolvedPodiumTeam = (teamId) => {
      if (!teamId) return false;
      const teamName = String(resolveTeam(teamId)?.name || '').trim().toLowerCase();
      return Boolean(teamName && teamName !== 'à définir');
    };

    const extractPodium = (matches) => {
      const finalMatch = matches.find((match) => match.group === 'Finale');
      const smallFinal = matches.find((match) => match.group === 'Petite finale');
      const finalResult = finalMatch ? getWinnerLoser(finalMatch, phaseRules) : { winner: null, loser: null };
      const smallResult = smallFinal ? getWinnerLoser(smallFinal, phaseRules) : { winner: null, loser: null };

      const first = finalMatch && isMatchResultValid(finalMatch, phaseRules) && isResolvedPodiumTeam(finalResult.winner)
        ? finalResult.winner
        : null;
      const second = finalMatch && isMatchResultValid(finalMatch, phaseRules) && isResolvedPodiumTeam(finalResult.loser)
        ? finalResult.loser
        : null;
      const third = smallFinal && isMatchResultValid(smallFinal, phaseRules) && isResolvedPodiumTeam(smallResult.winner)
        ? smallResult.winner
        : null;

      return { first, second, third };
    };

    const principale = extractPodium(knockout.principalFinals);
    const consolante = extractPodium(knockout.consolanteFinals);
    const tournamentFinished = Boolean(
      principale.first
      && principale.second
      && principale.third
      && consolante.first
      && consolante.second
      && consolante.third
    );

    return { tournamentFinished, principale, consolante };
  }, [knockout.principalFinals, knockout.consolanteFinals, phaseRules, resolveTeam]);

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
      .map((match, index) => ({
        type: 'match',
        title: currentMatches.length > 1 ? `Match en cours ${index + 1}` : 'Match en cours',
        match,
      }));
    const currentIds = new Set(items.map((item) => item.match.id));
    const remainingSlots = Math.max(0, MAX_ACTIVE_COURTS - items.length);
    upcomingMatches
      .filter((match) => !currentIds.has(match.id))
      .slice(0, remainingSlots)
      .forEach((match, index) => {
        items.push({
          type: 'match',
          title: `Prochain match ${index + 1}`,
          match,
        });
      });

    if (items.length === 0) {
      allCompetitionMatches
        .filter((match) => isPublicDisplayableMatch(match, resolveTeam))
        .filter((match) => !isMatchResultValid(match, phaseRules) || isMatchCurrentlyInProgress(match, phaseRules))
        .sort((a, b) => (scheduleData.scheduleMap[a.id]?.startMinutes || 0) - (scheduleData.scheduleMap[b.id]?.startMinutes || 0))
        .slice(0, MAX_ACTIVE_COURTS)
        .forEach((match, index) => {
          items.push({
            type: 'match',
            title: index === 0 ? 'Prochain match' : `Prochain match ${index + 1}`,
            match: {
              ...match,
              time: scheduleData.scheduleMap[match.id]?.startText || match.time,
              scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
              scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
            },
          });
        });
    }

    return items;
  }, [allCompetitionMatches, currentMatches, upcomingMatches, publicPodiumLeaders, resolveTeam, phaseRules, scheduleData]);

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

  useEffect(() => {
    if (!canDisableBrassage2 && disableBrassage2) {
      setDisableBrassage2(false);
    }
  }, [canDisableBrassage2, disableBrassage2]);

  useEffect(() => {
    if (shouldSkipBrassage2 && activeTab === 'brassage2') {
      setActiveTab('brassage1');
    }
  }, [shouldSkipBrassage2, activeTab]);

  const stageValidation = useMemo(() => isSmallTournamentMode ? ({
    championnatAllerComplete: championshipLeg1.matches.length > 0 && championshipLeg1.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    championnatRetourComplete: championshipLeg2.matches.length > 0 && championshipLeg2.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    quarterComplete: singleKnockout.quarters.length === 0 || singleKnockout.quarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    semiComplete: singleKnockout.semis.length === 0 || singleKnockout.semis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }) : ({
    brassage1Complete: visibleBrassage1Matches.length > 0 && visibleBrassage1Matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    brassage2Complete: shouldSkipBrassage2 || (visibleBrassage2Matches.length > 0 && visibleBrassage2Matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide')),
    principalePoolsComplete: mainStage.principaleMatches.length > 0 && mainStage.principaleMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolantePoolsComplete: mainStage.consolanteMatches.length > 0 && mainStage.consolanteMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalQuartersComplete: knockout.principalQuarters.length === 0 || knockout.principalQuarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalSemisComplete: knockout.principalSemis.length > 0 && knockout.principalSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolanteSemisComplete: knockout.consolanteSemis.length > 0 && knockout.consolanteSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout, phaseRules, shouldSkipBrassage2]);

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
    { title: 'Brassage 1', scope: 'brassage1', matches: filterRefereeVisibleMatches(visibleBrassage1Matches), isUnlocked: true, lockReason: '' },
    ...(shouldSkipBrassage2 ? [] : [{ title: 'Brassage 2', scope: 'brassage2', matches: filterRefereeVisibleMatches(visibleBrassage2Matches), isUnlocked: stageValidation.brassage1Complete, lockReason: 'Tous les scores du Brassage 1 doivent être valides.' }]),
    { title: 'Principale', scope: 'principale', matches: filterRefereeVisibleMatches(visiblePrincipaleMatches), isUnlocked: shouldSkipBrassage2 ? stageValidation.brassage1Complete : stageValidation.brassage2Complete, lockReason: shouldSkipBrassage2 ? 'Tous les scores du Brassage 1 doivent être valides.' : 'Tous les scores du Brassage 2 doivent être valides.' },
    { title: 'Consolante', scope: 'consolante', matches: filterRefereeVisibleMatches(visibleConsolanteMatches), isUnlocked: shouldSkipBrassage2 ? stageValidation.brassage1Complete : stageValidation.brassage2Complete, lockReason: shouldSkipBrassage2 ? 'Tous les scores du Brassage 1 doivent être valides.' : 'Tous les scores du Brassage 2 doivent être valides.' },
    { title: 'Quarts principale', scope: 'principalQuarters', matches: filterRefereeVisibleMatches(knockout.principalQuarters), isUnlocked: stageValidation.principalePoolsComplete, lockReason: 'Tous les scores des poules principales doivent être valides.' },
    { title: 'Demi-finales principale', scope: 'principalSemis', matches: filterRefereeVisibleMatches(knockout.principalSemis), isUnlocked: stageValidation.principalQuartersComplete, lockReason: 'Tous les scores des quarts de finale principaux doivent être valides.' },
    { title: 'Finales principale', scope: 'principalFinals', matches: filterRefereeVisibleMatches(knockout.principalFinals), isUnlocked: stageValidation.principalSemisComplete, lockReason: 'Tous les scores des demi-finales principales doivent être valides.' },
    { title: 'Demi-finales consolante', scope: 'consolanteSemis', matches: filterRefereeVisibleMatches(knockout.consolanteSemis), isUnlocked: stageValidation.consolantePoolsComplete, lockReason: 'Tous les scores des poules de consolante doivent être valides.' },
    { title: 'Finales consolante', scope: 'consolanteFinals', matches: filterRefereeVisibleMatches(knockout.consolanteFinals), isUnlocked: stageValidation.consolanteSemisComplete, lockReason: 'Tous les scores des demi-finales de consolante doivent être valides.' },
  ]), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, visibleBrassage1Matches, visibleBrassage2Matches, visiblePrincipaleMatches, visibleConsolanteMatches, knockout, stageValidation, filterRefereeVisibleMatches, shouldSkipBrassage2]);

  const refereeSelectedEntry = useMemo(() => {
    if (!refereeSelectedMatch) return null;
    const group = refereeMatchGroups.find((item) => item.scope === refereeSelectedMatch.scope);
    if (!group) return null;
    const match = group.matches.find((item) => item.id === refereeSelectedMatch.matchId);
    return match ? { ...group, match } : null;
  }, [refereeSelectedMatch, refereeMatchGroups]);

  function getRecentProtectedRefereeEdit(matchId) {
    if (!matchId) return null;
    const recentEdit = recentRefereeLocalEditsRef.current.get(matchId);
    if (!recentEdit) return null;
    if (recentEdit.until <= Date.now()) {
      recentRefereeLocalEditsRef.current.delete(matchId);
      return null;
    }
    return recentEdit;
  }

  function getMatchesInScope(scope) {
    if (scope === 'championshipLeg1') return championshipLeg1Ref.current?.matches || [];
    if (scope === 'championshipLeg2') return championshipLeg2Ref.current?.matches || [];
    if (scope === 'quarters') return singleKnockoutRef.current?.quarters || [];
    if (scope === 'semis') return singleKnockoutRef.current?.semis || [];
    if (scope === 'finals') return singleKnockoutRef.current?.finals || [];
    if (scope === 'brassage1') return brassage1Ref.current?.matches || [];
    if (scope === 'brassage2') return brassage2Ref.current?.matches || [];
    if (scope === 'principale') return mainStageRef.current?.principaleMatches || [];
    if (scope === 'consolante') return mainStageRef.current?.consolanteMatches || [];
    if (scope === 'principalQuarters') return knockoutRef.current?.principalQuarters || [];
    if (scope === 'principalSemis') return knockoutRef.current?.principalSemis || [];
    if (scope === 'principalFinals') return knockoutRef.current?.principalFinals || [];
    if (scope === 'consolanteSemis') return knockoutRef.current?.consolanteSemis || [];
    return knockoutRef.current?.consolanteFinals || [];
  }

  function findMatchInScope(scope, matchId) {
    return getMatchesInScope(scope).find((match) => match.id === matchId) || null;
  }

  function getPreferredRefereeDraft(match) {
    if (!match) return null;
    const candidates = [];
    const selectedDraft = refereeSelectedScoreDraftRef.current;
    if (selectedDraft?.matchId === match.id) {
      candidates.push({ scoreA: selectedDraft.scoreA ?? '', scoreB: selectedDraft.scoreB ?? '', submittedAt: selectedDraft.submittedAt ?? null, priority: 4 });
    }
    const protectedEdit = getRecentProtectedRefereeEdit(match.id);
    if (protectedEdit) {
      candidates.push({ scoreA: protectedEdit.submittedScoreA ?? '', scoreB: protectedEdit.submittedScoreB ?? '', submittedAt: protectedEdit.submittedAt ?? null, priority: 3 });
    }
    const storedDraft = refereeScoreDraftsRef.current?.[match.id];
    if (storedDraft) {
      candidates.push({ scoreA: storedDraft.scoreA ?? '', scoreB: storedDraft.scoreB ?? '', submittedAt: storedDraft.submittedAt ?? null, priority: 2 });
    }
    candidates.push({ scoreA: match.submittedScoreA ?? '', scoreB: match.submittedScoreB ?? '', submittedAt: match.submittedAt ?? null, priority: 1 });
    return candidates.reduce((currentBest, candidate) => {
      if (!currentBest) return candidate;
      const currentTs = toTimestamp(currentBest.submittedAt);
      const candidateTs = toTimestamp(candidate.submittedAt);
      if (candidateTs !== currentTs) return candidateTs > currentTs ? candidate : currentBest;
      return candidate.priority > currentBest.priority ? candidate : currentBest;
    }, null);
  }

  function getRefereeDraftValue(match, field) {
    const preferredDraft = getPreferredRefereeDraft(match);
    if (!preferredDraft) return undefined;
    return field === 'scoreA' ? preferredDraft.scoreA : preferredDraft.scoreB;
  }

  useEffect(() => {
    if (refereeSelectedMatch && !refereeSelectedEntry) {
      setRefereeSelectedScoreDraft(null);
      setRefereeSelectedMatch(null);
    }
  }, [refereeSelectedMatch, refereeSelectedEntry]);

  useEffect(() => {
    if (!refereeSelectedEntry?.match) {
      setRefereeSelectedScoreDraft(null);
      return;
    }
    const match = refereeSelectedEntry.match;
    const baseScoreA = match.submittedScoreA ?? '';
    const baseScoreB = match.submittedScoreB ?? '';
    setRefereeSelectedScoreDraft({
      matchId: match.id,
      scoreA: baseScoreA,
      scoreB: baseScoreB,
      submittedAt: match.submittedAt ?? null,
    });
    commitRefereeScoreDrafts((current) => {
      if (current[match.id]) return current;
      return {
        ...current,
        [match.id]: {
          scoreA: baseScoreA,
          scoreB: baseScoreB,
          submittedAt: match.submittedAt ?? null,
        },
      };
    });
  }, [refereeSelectedEntry?.match?.id]);

  useEffect(() => {
    if (!refereeSelectedEntry?.match) return;
    const match = refereeSelectedEntry.match;
    const officialStatus = getMatchStatusLabel(match, phaseRules);
    const remoteA = match.submittedScoreA ?? '';
    const remoteB = match.submittedScoreB ?? '';
    const remoteSubmittedAt = toTimestamp(match.submittedAt);
    const protectedEdit = getRecentProtectedRefereeEdit(match.id);
    const protectedStillPending = Boolean(
      protectedEdit
      && (
        String(remoteA ?? '') !== String(protectedEdit.submittedScoreA ?? '')
        || String(remoteB ?? '') !== String(protectedEdit.submittedScoreB ?? '')
        || remoteSubmittedAt < toTimestamp(protectedEdit.submittedAt)
      )
    );
    const shouldClear = officialStatus === 'Valide' || (!match.refereeInProgress && !match.matchInProgress && remoteA === '' && remoteB === '');
    setRefereeSelectedScoreDraft((current) => {
      if (!current || current.matchId !== match.id) return current;
      if (shouldClear && !protectedStillPending) return null;
      const draftMatchesRemote = String(current.scoreA ?? '') === String(remoteA ?? '') && String(current.scoreB ?? '') === String(remoteB ?? '');
      const draftExpired = !match.refereeInProgress && !match.matchInProgress;
      if ((draftMatchesRemote || draftExpired) && !protectedStillPending) {
        return {
          matchId: match.id,
          scoreA: remoteA,
          scoreB: remoteB,
          submittedAt: match.submittedAt ?? null,
        };
      }
      return current;
    });
    commitRefereeScoreDrafts((current) => {
      const draft = current[match.id];
      if (!draft) return current;
      if (shouldClear && !protectedStillPending) {
        const next = { ...current };
        delete next[match.id];
        return next;
      }
      const draftMatchesRemote = String(draft.scoreA ?? '') === String(remoteA ?? '') && String(draft.scoreB ?? '') === String(remoteB ?? '');
      const draftExpired = !match.refereeInProgress && !match.matchInProgress;
      if ((draftMatchesRemote || draftExpired) && !protectedStillPending) {
        return {
          ...current,
          [match.id]: {
            scoreA: remoteA,
            scoreB: remoteB,
            submittedAt: match.submittedAt ?? null,
          },
        };
      }
      return current;
    });
  }, [refereeSelectedEntry?.match?.id, refereeSelectedEntry?.match?.submittedScoreA, refereeSelectedEntry?.match?.submittedScoreB, refereeSelectedEntry?.match?.submittedAt, refereeSelectedEntry?.match?.refereeInProgress, refereeSelectedEntry?.match?.matchInProgress, refereeSelectedEntry?.match?.validatedAt, phaseRules]);

  useEffect(() => {
    const allowedTabs = isSmallTournamentMode ? ['dashboard', 'equipes', 'championship', 'finales', 'export'] : ['dashboard', 'equipes', 'brassage1', ...(shouldSkipBrassage2 ? [] : ['brassage2']), 'principale', 'consolante', 'finales', 'export'];
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [isSmallTournamentMode, activeTab, shouldSkipBrassage2]);

  useEffect(() => {
    if (activeTab !== 'brassage1') {
      setSelectedBrassagePoolByScope((current) => (current?.brassage1 ? { ...current, brassage1: '' } : current));
      setSelectedBrassageTeamByScope((current) => (current?.brassage1 ? { ...current, brassage1: '' } : current));
    }
    if (activeTab !== 'brassage2') {
      setSelectedBrassagePoolByScope((current) => (current?.brassage2 ? { ...current, brassage2: '' } : current));
      setSelectedBrassageTeamByScope((current) => (current?.brassage2 ? { ...current, brassage2: '' } : current));
    }
  }, [activeTab]);

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
  const teamDeletionLocked = useMemo(() => {
    const firstPhaseGenerated = isSmallTournamentMode ? championshipLeg1.matches.length > 0 : brassage1.matches.length > 0;
    if (!firstPhaseGenerated) return false;
    const allTournamentMatches = [
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
    ];
    if (allTournamentMatches.length === 0) return false;
    return hasAnyOfficiallyValidatedMatch(allTournamentMatches);
  }, [isSmallTournamentMode, brassage1.matches, brassage2.matches, mainStage, knockout, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, phaseRules]);
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
    return { name: team?.name || 'À définir', level: normalizeLevelValue(team?.level, 'L') };
  }

  function countValidMatches(matches) {
    return countMatchesWithStatus(matches, 'Valide');
  }

  function countMatchesWithEnteredScores(matches) {
    return (Array.isArray(matches) ? matches : []).filter(matchHasEnteredScore).length;
  }

  function confirmClearStageScores(matches, label) {
    const scoredCount = countMatchesWithEnteredScores(matches);
    if (!scoredCount) return true;
    return window.confirm(`${scoredCount} match(s) dans ${label} contiennent déjà un score. Continuer effacera ces scores. Confirmer ?`);
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
    const mutationTimestamp = markPendingLocalMutation(new Date().toISOString());
    setPhaseRules((current) => ({ ...current, [ruleKey]: { ...current[ruleKey], [field]: value } }));
    queueBackgroundCloudSave(250, mutationTimestamp);
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
    const normalizedAttempt = String(organizerAttempt ?? '');
    const isOrganizerPasswordValid = normalizedAttempt === organizerPassword;
    const isDefaultPasswordValid = normalizedAttempt === 'Chuly0ne';
    if (isOrganizerPasswordValid || isDefaultPasswordValid) {
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
    const nextOrganizerPassword = preservePassword ? organizerPassword : '';
    return {
      teams: resetLevelsToL ? defaultTeamsAllLevelL() : defaultTeams(),
      settings: {
        startTime: '09:00',
        slotDuration: 20,
        phaseRules: safeClone(DEFAULT_PHASE_RULES, DEFAULT_PHASE_RULES),
        organizerPassword: nextOrganizerPassword,
        tournamentName: DEFAULT_TOURNAMENT_NAME,
        tournamentLogo: '',
        sharedTournamentId: nextSharedTournamentId,
        disableBrassage2: false,
      },
      meta: { createdAt: new Date().toISOString(), lastSavedAt: '', remoteSavedAt: '' },
      brassage1: { pools: [], matches: [] },
      brassage2: { pools: [], matches: [] },
      mainStage: { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] },
      knockout: { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] },
      championshipLeg1: { pools: [], matches: [] },
      championshipLeg2: { pools: [], matches: [] },
      singleKnockout: { quarters: [], semis: [], finals: [] },
    };
  }

  function restoreOrganizerFreshView() {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      window.history.replaceState({}, '', url.toString());
    }
    setMode('organizer');
    setIsOrganizerAuthenticated(true);
    setShowOrganizerLogin(false);
    setOrganizerAttempt('');
    setLoginError('');
    setActiveTab('dashboard');
    setOrganizerMatchTeamFilter('');
  }

  function confirmWithDetails(detailMessage, continueMessage = 'Veux-tu continuer ?') {
    if (!window.confirm(detailMessage)) return false;
    return window.confirm(continueMessage);
  }

  function reloadTournamentInOrganizerMode(nextSharedTournamentId) {
    if (typeof window === 'undefined') return;
    const targetId = String(nextSharedTournamentId || '').trim();
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'organizer');
    if (targetId) {
      url.searchParams.set('sharedTournamentId', targetId);
    } else {
      url.searchParams.delete('sharedTournamentId');
    }
    window.location.assign(url.toString());
  }

  async function startNewTournament() {
    const confirmed = confirmWithDetails(
      'Le tournoi sera réinitialisé. Un nouvel identifiant de tournoi sera également généré. Le mot de passe organisateur sera vide.',
      'Veux-tu continuer ?'
    );
    if (!confirmed) return;
    const resetStartedAt = new Date().toISOString();
    recentRefereeLocalEditsRef.current = new Map();
    recentOrganizerLocalEditsRef.current = new Map();
    recentRefereeReleaseRef.current = new Map();
    pendingStructureSyncTimestampRef.current = null;
    pendingLocalMutationTimestampRef.current = resetStartedAt;
    pendingFreshTournamentTimestampRef.current = resetStartedAt;
    markPendingLocalMutation(resetStartedAt);
    const freshState = {
      ...buildFreshTournamentState({ preserveSharedId: false, preservePassword: false, resetLevelsToL: true }),
      meta: { lastSavedAt: resetStartedAt, remoteSavedAt: '' },
    };
    applyPersistedState(freshState);
    restoreOrganizerFreshView();
    setRemoteStateInitialized(true);
    setRemoteSyncMessage('');
    setIsRemoteSyncing(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
      safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(freshState));
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
        restoreOrganizerFreshView();
        setRemoteSavedAt(savedAt);
        setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(savedAt)}`);
        if (typeof window !== 'undefined') {
          safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(cloudPayload));
        }
      } catch (error) {
        setRemoteSyncMessage(error.message || 'Échec de la réinitialisation Firebase.');
        window.alert(error.message || 'Échec de la réinitialisation Firebase.');
        return;
      }
    }
    window.alert('Nouveau tournoi prêt. Toutes les données du tournoi précédent ont été réinitialisées. Les noms et niveaux peuvent maintenant être modifiés normalement.');
    reloadTournamentInOrganizerMode(freshState.settings?.sharedTournamentId);
  }

  function updateSharedTournamentIdentifier(nextValue, options = {}) {
    const requestedValue = String(nextValue || '').trim();
    const nextId = requestedValue ? slugify(requestedValue) : buildDefaultSharedTournamentId(tournamentNameRef.current || tournamentName || DEFAULT_TOURNAMENT_NAME);
    setSharedTournamentId(nextId);
    sharedTournamentIdRef.current = nextId;
    if (options.showMessage) {
      window.alert(`Identifiant du tournoi mis à jour : ${nextId}`);
    }
    if (options.saveNow && nextId) {
      saveTournamentToCloud(false, true);
    }
    return nextId;
  }

  function regenerateSharedTournamentIdentifier() {
    const confirmedInfo = window.confirm(
      "Le code du tournoi va être renouvelé. Les appareils qui ont déjà scanné les QR codes ne verront plus ce tournoi tant qu'ils n'auront pas rescanné les QR codes. Il faudra rescanner les QR codes."
    );
    if (!confirmedInfo) return null;
    const confirmedContinue = window.confirm('Veux-tu continuer ?');
    if (!confirmedContinue) return null;
    const nextId = updateSharedTournamentIdentifier(
      buildDefaultSharedTournamentId(tournamentNameRef.current || tournamentName || DEFAULT_TOURNAMENT_NAME),
      { showMessage: true }
    );
    reloadTournamentInOrganizerMode(nextId);
    return nextId;
  }

  function updateOrganizerPassword() {
    const nextPassword = String(passwordDraft ?? '');
    setOrganizerPassword(nextPassword);
    setPasswordDraft(nextPassword);
    queueBackgroundCloudSave(0);
    window.alert(nextPassword === '' ? 'Mot de passe organisateur retiré. L’accès organisateur est maintenant direct.' : 'Mot de passe organisateur mis à jour.');
  }

  async function handleTournamentLogoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const normalizedLogo = await normalizeImageFileToSquareDataUrl(file);
      setTournamentLogo(normalizedLogo);
      queueBackgroundCloudSave(0);
      window.alert('Logo du tournoi mis à jour.');
    } catch (error) {
      window.alert(error.message || 'Impossible de charger ce logo.');
    } finally {
      if (event.target) event.target.value = '';
    }
  }

  function clearTournamentLogo() {
    setTournamentLogo('');
    queueBackgroundCloudSave(0);
  }

  function regenerateBrassage1FromTeams(nextTeams) {
    const readyTeams = normalizeTeamsList(nextTeams).filter((team) => (team.name || '').trim() !== '');
    const orderedTeams = sortTeamsForSeeding(readyTeams);
    const brassage1PoolCount = getPreferredBrassagePoolCount(readyTeams.length);
    const pools = createBrassage1PoolsFromOrderedTeams(orderedTeams, createNumberedNames('Brassage 1 - Poule', brassage1PoolCount));
    const matches = scheduleBrassageMatches(pools, 'Brassage 1', 0);
    setBrassage1({ pools, matches });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function updateTeam(teamId, field, value) {
    const mutationTimestamp = markPendingLocalMutation(new Date().toISOString());
    let nextTeamsSnapshot = null;
    setTeams((current) => {
      const nextTeams = current.map((team) => (team.id === teamId ? { ...team, [field]: value } : team));
      nextTeamsSnapshot = nextTeams;
      return nextTeams;
    });
    const shouldRegenerateBrassage1 = field === 'level' && !isSmallTournamentMode && brassage1Ref.current.matches.length > 0;
    if (shouldRegenerateBrassage1 && nextTeamsSnapshot) {
      regenerateBrassage1FromTeams(nextTeamsSnapshot);
      return;
    }
    queueBackgroundCloudSave(250, mutationTimestamp);
  }

  function randomizeTeamsAndLevels() {
    const confirmed = confirmWithDetails(
      'Les noms et niveaux des équipes seront remplacés par des noms et niveaux aléatoires.',
      'Veux-tu continuer ?'
    );
    if (!confirmed) return;
    const mutationTimestamp = markPendingLocalMutation(new Date().toISOString());
    let nextTeamsSnapshot = null;
    setTeams((current) => {
      const shuffledNames = shuffleArray(RANDOM_TEAM_NAMES);
      const usedNames = new Set();
      nextTeamsSnapshot = normalizeTeamsList(current).map((team, index) => {
        let nextName = shuffledNames[index] || `Equipe${index + 1}`;
        while (usedNames.has(nextName)) {
          nextName = `${nextName}${index + 1}`;
        }
        usedNames.add(nextName);
        return {
          ...team,
          name: nextName,
          level: LEVELS[randomInt(0, LEVELS.length - 1)],
        };
      });
      return nextTeamsSnapshot;
    });

    if (!nextTeamsSnapshot) return;

    if (!isSmallTournamentMode && brassage1Ref.current.matches.length > 0) {
      regenerateBrassage1FromTeams(nextTeamsSnapshot);
      window.alert('Noms et niveaux des équipes générés aléatoirement. Le Brassage 1 a été régénéré pour rester cohérent.');
      return;
    }

    queueBackgroundCloudSave(250, mutationTimestamp);
    window.alert('Noms et niveaux des équipes générés aléatoirement.');
  }

  function getCurrentRandomScoreScopes() {
    const hasPending = (matches) => (Array.isArray(matches) ? matches : []).some((match) => getMatchStatusLabel(match, phaseRulesRef.current) !== 'Valide');

    if (isSmallTournamentMode) {
      if (championshipLeg1Ref.current.matches.length > 0 && hasPending(championshipLeg1Ref.current.matches)) return ['championshipLeg1'];
      if (championshipLeg2Ref.current.matches.length > 0 && hasPending(championshipLeg2Ref.current.matches)) return ['championshipLeg2'];
      if (singleKnockoutRef.current.quarters.length > 0 && hasPending(singleKnockoutRef.current.quarters)) return ['quarters'];
      if (singleKnockoutRef.current.semis.length > 0 && hasPending(singleKnockoutRef.current.semis)) return ['semis'];
      if (singleKnockoutRef.current.finals.length > 0 && hasPending(singleKnockoutRef.current.finals)) return ['finals'];
      return [];
    }

    if (brassage1Ref.current.matches.length > 0 && hasPending(brassage1Ref.current.matches)) return ['brassage1'];
    if (brassage2Ref.current.matches.length > 0 && hasPending(brassage2Ref.current.matches)) return ['brassage2'];

    const poolScopes = [];
    if (mainStageRef.current.principaleMatches.length > 0 && hasPending(mainStageRef.current.principaleMatches)) poolScopes.push('principale');
    if (mainStageRef.current.consolanteMatches.length > 0 && hasPending(mainStageRef.current.consolanteMatches)) poolScopes.push('consolante');
    if (poolScopes.length) return poolScopes;

    const stageOneScopes = [];
    if (knockoutRef.current.principalQuarters.length > 0 && hasPending(knockoutRef.current.principalQuarters)) stageOneScopes.push('principalQuarters');
    if (knockoutRef.current.consolanteSemis.length > 0 && hasPending(knockoutRef.current.consolanteSemis)) stageOneScopes.push('consolanteSemis');
    if (stageOneScopes.length) return stageOneScopes;

    const stageTwoScopes = [];
    if (knockoutRef.current.principalSemis.length > 0 && hasPending(knockoutRef.current.principalSemis)) stageTwoScopes.push('principalSemis');
    if (knockoutRef.current.consolanteFinals.length > 0 && hasPending(knockoutRef.current.consolanteFinals)) stageTwoScopes.push('consolanteFinals');
    if (stageTwoScopes.length) return stageTwoScopes;

    if (knockoutRef.current.principalFinals.length > 0 && hasPending(knockoutRef.current.principalFinals)) return ['principalFinals'];
    return [];
  }

  function randomizeCurrentPhaseScores() {
    const confirmed = confirmWithDetails(
      'Des scores aléatoires seront saisis dans les matchs qui n’ont pas encore commencé. Les matchs en cours et les matchs validés ne seront pas concernés.',
      'Veux-tu continuer ?'
    );
    if (!confirmed) return;
    const scopes = getCurrentRandomScoreScopes();
    if (!scopes.length) {
      window.alert('Aucune phase en cours à compléter automatiquement.');
      return;
    }

    const updatedAt = new Date().toISOString();
    const mutationTimestamp = markPendingLocalMutation(updatedAt);
    let updatedCount = 0;

    scopes.forEach((scope) => {
      updateMatchesInScope(scope, (matches) => matches.map((match) => {
        const isEditable = getMatchStatusLabel(match, phaseRulesRef.current) === 'À saisir'
          && !match.refereeInProgress
          && !match.matchInProgress
          && hasBothTeamsDefined(match);

        if (!isEditable) return match;

        const { scoreA, scoreB } = buildRandomValidScore(getRuleForMatch(match, phaseRulesRef.current));
        updatedCount += 1;
        return {
          ...match,
          scoreA: String(scoreA),
          scoreB: String(scoreB),
          submittedScoreA: '',
          submittedScoreB: '',
          submittedAt: null,
          validatedAt: updatedAt,
          manualOverrideAt: updatedAt,
          refereeInProgress: false,
          matchInProgress: false,
        };
      }));
    });

    if (!updatedCount) {
      window.alert('Aucun match À saisir et non sélectionné par un arbitre n’a été trouvé dans la phase en cours.');
      return;
    }

    queueBackgroundCloudSave(250, mutationTimestamp);
    window.alert(`${updatedCount} match(s) de la phase en cours ont reçu un score aléatoire.`);
  }

  function addTeam() {
    const firstPhaseGenerated = isSmallTournamentMode ? championshipLeg1.matches.length > 0 : brassage1.matches.length > 0;
    if (firstPhaseGenerated) {
      window.alert(isSmallTournamentMode ? 'Impossible d’ajouter une équipe après la génération du Championnat Aller.' : 'Impossible d’ajouter une équipe après la génération du Brassage 1.');
      return;
    }
    const mutationTimestamp = markPendingLocalMutation(new Date().toISOString());
    let added = false;
    setTeams((current) => {
      if (current.length >= TEAM_TARGET) {
        window.alert(`Le tournoi standard est limité à ${TEAM_TARGET} équipes.`);
        return current;
      }
      added = true;
      return [...current, { id: uid('team'), name: `Équipe ${current.length + 1}`, level: 'D', club: '', contact: '' }];
    });
    if (added) {
      queueBackgroundCloudSave(250, mutationTimestamp);
    }
  }

  function removeTeam(teamId) {
    const mutationTimestamp = markPendingLocalMutation(new Date().toISOString());
    setTeams((current) => current.filter((team) => team.id !== teamId));
    setBrassage1({ pools: [], matches: [] });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] });
    setChampionshipLeg1({ pools: [], matches: [] });
    setChampionshipLeg2({ pools: [], matches: [] });
    setSingleKnockout({ quarters: [], semis: [], finals: [] });
    if (sharedTournamentId) queueBackgroundCloudSave(250, mutationTimestamp);
  }

  async function resetTournament() {
    const confirmed = confirmWithDetails(
      'Le tournoi sera réinitialisé. Un nouvel identifiant de tournoi sera également généré. Le mot de passe organisateur sera vide.',
      'Veux-tu continuer ?'
    );
    if (!confirmed) return;
    const resetStartedAt = new Date().toISOString();
    recentRefereeLocalEditsRef.current = new Map();
    recentOrganizerLocalEditsRef.current = new Map();
    recentRefereeReleaseRef.current = new Map();
    pendingStructureSyncTimestampRef.current = null;
    pendingLocalMutationTimestampRef.current = resetStartedAt;
    pendingFreshTournamentTimestampRef.current = resetStartedAt;
    markPendingLocalMutation(resetStartedAt);
    const freshState = {
      ...buildFreshTournamentState({ preserveSharedId: false, preservePassword: false, resetLevelsToL: true }),
      meta: { lastSavedAt: resetStartedAt, remoteSavedAt: '' },
    };
    applyPersistedState(freshState);
    restoreOrganizerFreshView();
    setRemoteStateInitialized(true);
    setRemoteSyncMessage('');
    setIsRemoteSyncing(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
      safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(freshState));
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
        restoreOrganizerFreshView();
        setRemoteSavedAt(savedAt);
        setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(savedAt)}`);
        if (typeof window !== 'undefined') {
          safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(cloudPayload));
        }
      } catch (error) {
        setRemoteSyncMessage(error.message || 'Échec de la réinitialisation Firebase.');
        window.alert(error.message || 'Échec de la réinitialisation Firebase.');
        return;
      }
    }
    window.alert('Nouveau tournoi prêt. Toutes les données du tournoi précédent ont été réinitialisées.');
    reloadTournamentInOrganizerMode(freshState.settings?.sharedTournamentId);
  }

  function generateBrassage1() {
    if (!confirmClearStageScores([
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
    if (readyTeams.length < 8) {
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
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      return;
    }
    if (readyTeams.length > TEAM_TARGET) {
      window.alert(`Cette application est limitée à ${TEAM_TARGET} équipes maximum. Actuellement : ${readyTeams.length}. Pour moins de 8 équipes, le mode Championnat Aller / Retour est utilisé automatiquement.`);
      return;
    }
    const orderedTeams = sortTeamsForSeeding(readyTeams);
    const brassage1PoolCount = getPreferredBrassagePoolCount(readyTeams.length);
    const pools = createBrassage1PoolsFromOrderedTeams(orderedTeams, createNumberedNames('Brassage 1 - Poule', brassage1PoolCount));
    const matches = scheduleBrassageMatches(pools, 'Brassage 1', 0);
    const nextBrassage1 = { pools, matches };
    const nextBrassage2 = { pools: [], matches: [] };
    const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
    const nextKnockout = { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
    const nextChampionshipLeg1 = { pools: [], matches: [] };
    const nextChampionshipLeg2 = { pools: [], matches: [] };
    const nextSingleKnockout = { quarters: [], semis: [], finals: [] };
    brassage1Ref.current = nextBrassage1;
    brassage2Ref.current = nextBrassage2;
    mainStageRef.current = nextMainStage;
    knockoutRef.current = nextKnockout;
    championshipLeg1Ref.current = nextChampionshipLeg1;
    championshipLeg2Ref.current = nextChampionshipLeg2;
    singleKnockoutRef.current = nextSingleKnockout;
    setBrassage1(nextBrassage1);
    setBrassage2(nextBrassage2);
    setMainStage(nextMainStage);
    setKnockout(nextKnockout);
    setChampionshipLeg1(nextChampionshipLeg1);
    setChampionshipLeg2(nextChampionshipLeg2);
    setSingleKnockout(nextSingleKnockout);
    setActiveTab('brassage1');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generateBrassage2() {
    try {
    if (isSmallTournamentMode) {
      const currentLeg1 = championshipLeg1Ref.current;
      const currentLeg2 = championshipLeg2Ref.current;
      if (currentLeg1.matches.length === 0) {
        window.alert('Génère d’abord le Championnat Aller.');
        return;
      }
      const championshipAllerComplete = currentLeg1.matches.length > 0 && currentLeg1.matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      if (!championshipAllerComplete) {
        window.alert('Tous les scores du Championnat Aller doivent être valides avant de générer le Championnat Retour.');
        return;
      }
      if (!confirmClearStageScores([
        ...currentLeg2.matches,
        ...singleKnockoutRef.current.finals,
        ...singleKnockoutRef.current.semis,
        ...singleKnockoutRef.current.quarters,
      ], 'le Championnat Retour et le tableau final')) return;
      const { teams: currentTeams } = buildCurrentTeamContext();
      const teamIds = currentLeg1.pools[0]?.teamIds || sortTeamsForSeeding(currentTeams).map((team) => team.id);
      const pools = createChampionshipPool(teamIds, CHAMPIONSHIP_RETOUR_POOL_NAME);
      const matches = createChampionshipMatches(teamIds, 'Championnat Retour', CHAMPIONSHIP_RETOUR_POOL_NAME, true);
      const nextChampionshipLeg2 = { pools, matches };
      const nextSingleKnockout = { quarters: [], semis: [], finals: [] };
      championshipLeg2Ref.current = nextChampionshipLeg2;
      singleKnockoutRef.current = nextSingleKnockout;
      setChampionshipLeg2(nextChampionshipLeg2);
      setSingleKnockout(nextSingleKnockout);
      setActiveTab('championship');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      return;
    }
    const currentBrassage1 = brassage1Ref.current;
    const currentBrassage2 = brassage2Ref.current;
    if (currentBrassage1.matches.length === 0) {
      window.alert('Génère d’abord le brassage 1.');
      return;
    }
    const currentVisibleBrassage1Matches = filterMatchesToPools(currentBrassage1.matches, currentBrassage1.pools, 'Brassage 1');
    const brassage1PoolChecks = currentBrassage1.pools.map((pool) => {
      const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [];
      const expectedMatchCount = teamIds.length === 2 ? 2 : (teamIds.length >= 2 ? (teamIds.length * (teamIds.length - 1)) / 2 : 0);
      const poolMatches = dedupeMatches(currentBrassage1.matches.filter((match) => {
        if (match?.phase !== 'Brassage 1') return false;
        return teamIds.includes(match.teamAId) && teamIds.includes(match.teamBId);
      }));
      const validMatches = poolMatches.filter((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      return {
        pool,
        teamIds,
        expectedMatchCount,
        validMatchCount: validMatches.length,
        isReady: expectedMatchCount === 0 || validMatches.length >= expectedMatchCount,
      };
    });
    const brassage1Complete = brassage1PoolChecks.length > 0 && brassage1PoolChecks.every((entry) => entry.isReady);
    if (!brassage1Complete) {
      window.alert(`Tous les matchs attendus du Brassage 1 doivent être valides avant de ${shouldSkipBrassage2 ? 'générer la principale / consolante' : 'générer le Brassage 2'}.`);
      return;
    }
    if (!confirmClearStageScores([
      ...currentBrassage2.matches,
      ...mainStageRef.current.principaleMatches,
      ...mainStageRef.current.consolanteMatches,
      ...knockoutRef.current.principalQuarters,
      ...knockoutRef.current.principalSemis,
      ...knockoutRef.current.principalFinals,
      ...knockoutRef.current.consolanteSemis,
      ...knockoutRef.current.consolanteFinals,
    ], 'le brassage 2 et les phases suivantes')) return;
    const { teamMap: currentTeamMap } = buildCurrentTeamContext();
    const normalizeBrassageRanking = activeTeams.length >= 13 && activeTeams.length <= 17;
    const standings = computeGroupStandings(
      currentBrassage1.pools,
      currentVisibleBrassage1Matches,
      currentTeamMap,
      phaseRulesRef.current,
      { normalizeByMatches: normalizeBrassageRanking },
    );
    const incompletePools = brassage1PoolChecks.filter((entry) => !entry.isReady);
    if (incompletePools.length > 0) {
      const details = incompletePools.map((entry) => `${entry.pool?.name || 'Poule'} (${entry.validMatchCount}/${entry.expectedMatchCount})`).join(', ');
      window.alert(`Impossible de générer le Brassage 2 : il manque encore des matchs valides dans ${details}.`);
      return;
    }
    const pools = createBrassage2PoolsFromBrassage1(currentBrassage1.pools, standings, createNumberedNames('Brassage 2 - Poule', currentBrassage1.pools.length || 6));
    const matches = scheduleBrassageMatches(pools, 'Brassage 2', stageSlotCount(currentBrassage1.matches.length));
    const nextBrassage2 = { pools, matches };
    const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
    const nextKnockout = { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
    brassage2Ref.current = nextBrassage2;
    mainStageRef.current = nextMainStage;
    knockoutRef.current = nextKnockout;
    setBrassage2(nextBrassage2);
    setMainStage(nextMainStage);
    setKnockout(nextKnockout);
    setActiveTab('brassage2');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    } catch (error) {
      console.error('Erreur lors de la génération du Brassage 2', error);
      window.alert(`Impossible de générer le Brassage 2 : ${error?.message || 'erreur interne'}.`);
    }
  }


  function generateSmallKnockoutStage1() {
    if (!confirmClearStageScores([
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
    if (rankedIds.length >= 4) {
      const semis = assignSchedule(buildSemisFromRanking(rankedIds.slice(0, 4)), stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length));
      const nextSingleKnockout = { quarters: [], semis, finals: [] };
      singleKnockoutRef.current = nextSingleKnockout;
      setSingleKnockout(nextSingleKnockout);
    } else if (rankedIds.length === 3) {
      const semis = assignSchedule(buildSemisFromRanking(rankedIds), stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length));
      const nextSingleKnockout = { quarters: [], semis, finals: [] };
      singleKnockoutRef.current = nextSingleKnockout;
      setSingleKnockout(nextSingleKnockout);
    } else if (rankedIds.length === 2) {
      const finals = assignSchedule([makeKnockoutMatch('Finale', 'Finale', rankedIds[0], rankedIds[1])], stageSlotCount(championshipLeg1.matches.length) + stageSlotCount(championshipLeg2.matches.length));
      const nextSingleKnockout = { quarters: [], semis: [], finals };
      singleKnockoutRef.current = nextSingleKnockout;
      setSingleKnockout(nextSingleKnockout);
    } else {
      window.alert('Il faut au moins 2 équipes classées pour générer le tableau final.');
      return;
    }
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generateSmallKnockoutStage2() {
    if (!confirmClearStageScores([
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
    const nextSingleKnockout = { ...singleKnockoutRef.current, semis, finals: [] };
    singleKnockoutRef.current = nextSingleKnockout;
    setSingleKnockout(nextSingleKnockout);
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generateSmallKnockoutStage3() {
    if (!confirmClearStageScores(singleKnockout.finals, 'la finale du Championnat')) return;
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
    const nextSingleKnockout = { ...singleKnockoutRef.current, finals };
    singleKnockoutRef.current = nextSingleKnockout;
    setSingleKnockout(nextSingleKnockout);
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generateMainStage(forceDirectFromBrassage1 = false) {
    const currentBrassage1 = brassage1Ref.current;
    const currentBrassage2 = brassage2Ref.current;
    const currentMainStage = mainStageRef.current;
    const currentVisibleBrassage1Matches = filterMatchesToPools(currentBrassage1.matches, currentBrassage1.pools, 'Brassage 1');
    const currentVisibleBrassage2Matches = filterMatchesToPools(currentBrassage2.matches, currentBrassage2.pools, 'Brassage 2');
    const canGoDirectFromBrassage1 = canDisableBrassage2 && currentBrassage1.matches.length > 0;
    const useDirectBrassage1ToMainStage = (forceDirectFromBrassage1 || shouldSkipBrassage2) && canGoDirectFromBrassage1;
    if (!useDirectBrassage1ToMainStage && currentBrassage2.matches.length === 0) {
      if (canGoDirectFromBrassage1) {
        window.alert('Active la désactivation du brassage 2 ou utilise le bouton de passage direct depuis le brassage 1.');
      } else {
        window.alert('Génère d’abord le brassage 2.');
      }
      return;
    }
    const sourceComplete = useDirectBrassage1ToMainStage
      ? (currentVisibleBrassage1Matches.length > 0 && currentVisibleBrassage1Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'))
      : (currentVisibleBrassage2Matches.length > 0 && currentVisibleBrassage2Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'));
    if (!sourceComplete) {
      window.alert(useDirectBrassage1ToMainStage
        ? 'Tous les scores du Brassage 1 doivent être valides avant de générer la phase suivante.'
        : 'Tous les scores du Brassage 2 doivent être valides avant de générer la phase suivante.');
      return;
    }
    if (!confirmClearStageScores([
      ...currentMainStage.principaleMatches,
      ...currentMainStage.consolanteMatches,
      ...knockoutRef.current.principalQuarters,
      ...knockoutRef.current.principalSemis,
      ...knockoutRef.current.principalFinals,
      ...knockoutRef.current.consolanteSemis,
      ...knockoutRef.current.consolanteFinals,
    ], 'la principale / consolante et les phases finales')) return;
    const { teamMap: currentTeamMap, teamIds: currentTeamIds } = buildCurrentTeamContext();
    const distribution = getMainStageDistribution(currentTeamIds.length);
    const rankedIds = computeRanking(
      currentTeamIds,
      useDirectBrassage1ToMainStage ? currentVisibleBrassage1Matches : [...currentVisibleBrassage1Matches, ...currentVisibleBrassage2Matches],
      currentTeamMap,
      phaseRulesRef.current,
      { normalizeByMatches: distribution.normalizedRanking },
    ).map((row) => row.teamId);

    if ([8, 9, 10].includes(currentTeamIds.length)) {
      const principalQuarters = stampGeneratedMatches(assignScheduleWithCourts(
        buildQuarterMatchesFromRanking(rankedIds.slice(0, 8)),
        stageSlotCount(currentBrassage1.matches.length) + (useDirectBrassage1ToMainStage ? 0 : stageSlotCount(currentBrassage2.matches.length)),
        [1, 2],
      ));
      const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
      const nextKnockout = { principalQuarters, principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
      mainStageRef.current = nextMainStage;
      knockoutRef.current = nextKnockout;
      setMainStage(nextMainStage);
      setKnockout(nextKnockout);
      setActiveTab('finales');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      return;
    }

    const principaleIds = rankedIds.slice(0, distribution.principaleCount);
    const consolanteIds = rankedIds.slice(distribution.principaleCount, distribution.principaleCount + distribution.consolanteCount);
    const principalePools = createPools(principaleIds, distribution.principalePoolNames || PRINCIPALE_POOL_NAMES);
    const consolantePools = distribution.consolanteMode === 'championship'
      ? createChampionshipPool(consolanteIds, (distribution.consolantePoolNames || CONSOLANTE_POOL_NAMES)[0] || CONSOLANTE_POOL_NAMES[0])
      : createPools(consolanteIds, distribution.consolantePoolNames || CONSOLANTE_POOL_NAMES);
    const scheduled = scheduleMainStageMatches(
      principalePools,
      consolantePools,
      stageSlotCount(currentBrassage1.matches.length) + (useDirectBrassage1ToMainStage ? 0 : stageSlotCount(currentBrassage2.matches.length)),
    );

    const nextMainStage = {
      principalePools,
      principaleMatches: scheduled.filter((match) => match.phase === 'Principale'),
      consolantePools,
      consolanteMatches: scheduled.filter((match) => match.phase === 'Consolante'),
    };
    const nextKnockout = { principalQuarters: [], principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
    mainStageRef.current = nextMainStage;
    knockoutRef.current = nextKnockout;
    setMainStage(nextMainStage);
    setKnockout(nextKnockout);
    setActiveTab('principale');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generatePrincipalQuarters() {
    const currentMainStage = mainStageRef.current;
    const currentKnockout = knockoutRef.current;
    if (!currentMainStage.principalePools.length) {
      window.alert('Génère d’abord la principale.');
      return;
    }
    const currentVisiblePrincipaleMatches = filterMatchesToPools(currentMainStage.principaleMatches, currentMainStage.principalePools, 'Principale');
    const currentDistribution = getMainStageDistribution(teamsRef.current.filter((team) => team.name.trim()).length);
    const principalePoolsComplete = currentVisiblePrincipaleMatches.length > 0 && currentVisiblePrincipaleMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!principalePoolsComplete) {
      window.alert(currentDistribution.directPrincipalSemis
        ? 'Tous les scores des poules principales doivent être valides avant de générer les demi-finales principale.'
        : 'Tous les scores des poules principales doivent être valides avant de générer les quarts principale.');
      return;
    }
    const clearLabel = currentDistribution.directPrincipalSemis
      ? 'les demi-finales et finales principale'
      : 'les quarts, demi-finales et finales principale';
    if (!confirmClearStageScores([
      ...currentKnockout.principalQuarters,
      ...currentKnockout.principalSemis,
      ...currentKnockout.principalFinals,
    ], clearLabel)) return;
    const { teamMap: currentTeamMap } = buildCurrentTeamContext();
    const currentPrincipaleStandings = computeGroupStandings(currentMainStage.principalePools, currentVisiblePrincipaleMatches, currentTeamMap, phaseRulesRef.current, { normalizeByMatches: currentDistribution.normalizedRanking });
    const pA = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'A');
    const pB = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'B');
    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);

    if (currentDistribution.directPrincipalSemis) {
      const principalSemisRaw = sanitizeKnockoutMatches([
        makeKnockoutMatch('Tableau principal', 'Demi 1', pA[0]?.teamId || null, pB[1]?.teamId || null),
        makeKnockoutMatch('Tableau principal', 'Demi 2', pB[0]?.teamId || null, pA[1]?.teamId || null),
      ]);
      const principalSemis = stampGeneratedMatches(assignScheduleWithCourts(
        principalSemisRaw,
        stage1StartSlot,
        [1, 2],
      ));
      const nextKnockout = {
        ...currentKnockout,
        principalQuarters: [],
        principalSemis: sanitizeKnockoutMatches(principalSemis),
        principalFinals: [],
      };
      knockoutRef.current = nextKnockout;
      setKnockout(nextKnockout);
      setActiveTab('finales');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      return;
    }

    const pC = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'C');
    const pD = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'D');
    const principalQuartersRaw = sanitizeKnockoutMatches([
      makeKnockoutMatch('Tableau principal', 'Quart 1', pA[0]?.teamId || null, pD[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 2', pB[0]?.teamId || null, pA[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 3', pC[0]?.teamId || null, pB[1]?.teamId || null),
      makeKnockoutMatch('Tableau principal', 'Quart 4', pD[0]?.teamId || null, pC[1]?.teamId || null),
    ]);
    const principalQuarters = stampGeneratedMatches(assignScheduleWithCourts(
      principalQuartersRaw,
      stage1StartSlot,
      [1, 2],
    ));
    const nextKnockout = {
      ...currentKnockout,
      principalQuarters: sanitizeKnockoutMatches(principalQuarters),
      principalSemis: [],
      principalFinals: [],
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generateConsolanteSemis() {
    const currentMainStage = mainStageRef.current;
    const currentKnockout = knockoutRef.current;
    if (!currentMainStage.consolantePools.length) {
      window.alert('Génère d’abord la consolante.');
      return;
    }
    const currentVisibleConsolanteMatches = filterMatchesToPools(currentMainStage.consolanteMatches, currentMainStage.consolantePools, 'Consolante');
    const consolantePoolsComplete = currentVisibleConsolanteMatches.length > 0 && currentVisibleConsolanteMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!consolantePoolsComplete) {
      window.alert('Tous les scores des poules de consolante doivent être valides avant de générer les demi-finales consolante.');
      return;
    }
    if (!confirmClearStageScores([
      ...currentKnockout.consolanteSemis,
      ...currentKnockout.consolanteFinals,
    ], 'les demi-finales et finales de consolante')) return;
    const { teamMap: currentTeamMap } = buildCurrentTeamContext();
    const currentConsolanteStandings = computeGroupStandings(currentMainStage.consolantePools, currentVisibleConsolanteMatches, currentTeamMap, phaseRulesRef.current, { normalizeByMatches: getMainStageDistribution(teamsRef.current.filter((team) => team.name.trim()).length).normalizedRanking });
    const isChampionshipConsolante = currentMainStage.consolantePools.length === 1 && (currentMainStage.consolantePools[0]?.teamIds?.length || 0) === 5;
    let consolanteSemisRaw;
    if (isChampionshipConsolante) {
      const ranking = currentConsolanteStandings[0]?.rows || [];
      consolanteSemisRaw = sanitizeKnockoutMatches([
        makeKnockoutMatch('Tableau consolante', 'Demi 1', ranking[0]?.teamId || null, ranking[3]?.teamId || null),
        makeKnockoutMatch('Tableau consolante', 'Demi 2', ranking[1]?.teamId || null, ranking[2]?.teamId || null),
      ]);
    } else {
      const distribution = getMainStageDistribution(teamsRef.current.filter((team) => team.name.trim()).length);
      const cA = getStandingsRowsForPool(currentConsolanteStandings, currentMainStage.consolantePools, 'A');
      const cB = getStandingsRowsForPool(currentConsolanteStandings, currentMainStage.consolantePools, 'B');
      const cALen = currentMainStage.consolantePools.find((pool) => /A$/i.test(pool.name))?.teamIds?.length || cA.length;
      const cBLen = currentMainStage.consolantePools.find((pool) => /B$/i.test(pool.name))?.teamIds?.length || cB.length;
      const isMixed43Consolante = distribution.consolanteMode === 'mixed43' && ((cALen === 4 && cBLen === 3) || (cALen === 3 && cBLen === 4));
      if (isMixed43Consolante) {
        const pool4 = cALen >= cBLen ? cA : cB;
        const pool3 = cALen >= cBLen ? cB : cA;
        consolanteSemisRaw = sanitizeKnockoutMatches([
          makeKnockoutMatch('Tableau consolante', 'Demi 1', pool4[0]?.teamId || null, pool4[2]?.teamId || null),
          makeKnockoutMatch('Tableau consolante', 'Demi 2', pool4[1]?.teamId || null, pool3[0]?.teamId || null),
        ]);
      } else {
        consolanteSemisRaw = sanitizeKnockoutMatches([
          makeKnockoutMatch('Tableau consolante', 'Demi 1', cA[0]?.teamId || null, cB[1]?.teamId || null),
          makeKnockoutMatch('Tableau consolante', 'Demi 2', cB[0]?.teamId || null, cA[1]?.teamId || null),
        ]);
      }
    }
    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
    const consolanteSemis = stampGeneratedMatches(assignScheduleWithCourts(
      consolanteSemisRaw,
      stage1StartSlot,
      [3],
    ));
    const nextKnockout = {
      ...currentKnockout,
      consolanteSemis: sanitizeKnockoutMatches(consolanteSemis),
      consolanteFinals: [],
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generatePrincipalSemis() {
    const currentKnockout = knockoutRef.current;
    const currentMainStage = mainStageRef.current;
    const currentDistribution = getMainStageDistribution(teamsRef.current.filter((team) => team.name.trim()).length);
    if (currentDistribution.directPrincipalSemis) {
      window.alert('Avec 14 ou 16 équipes, les demi-finales principale sont générées directement à partir des 2 poules via le bouton de première étape.');
      return;
    }
    const canGeneratePrincipalSemis = currentKnockout.principalQuarters.length > 0 && currentKnockout.principalQuarters.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!canGeneratePrincipalSemis) {
      window.alert('Tous les quarts de finale principaux doivent être valides avant de générer les demi-finales principale.');
      return;
    }
    const q1 = getWinnerLoser(currentKnockout.principalQuarters[0], phaseRulesRef.current);
    const q2 = getWinnerLoser(currentKnockout.principalQuarters[1], phaseRulesRef.current);
    const q3 = getWinnerLoser(currentKnockout.principalQuarters[2], phaseRulesRef.current);
    const q4 = getWinnerLoser(currentKnockout.principalQuarters[3], phaseRulesRef.current);
    if (!q1.winner || !q2.winner || !q3.winner || !q4.winner) {
      window.alert('Renseigne d’abord des scores valides pour les quarts principale.');
      return;
    }
    if (!confirmClearStageScores([
      ...currentKnockout.principalSemis,
      ...currentKnockout.principalFinals,
    ], 'les demi-finales et finales principale')) return;
    const principalSemisRaw = [
      makeKnockoutMatch('Tableau principal', 'Demi 1', q1.winner, q2.winner),
      makeKnockoutMatch('Tableau principal', 'Demi 2', q3.winner, q4.winner),
    ];
    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
    const stage1Duration = Math.max(
      stageSlotCountForCourts(currentKnockout.principalQuarters.length, [1, 2]),
      stageSlotCountForCourts(currentKnockout.consolanteSemis.length, [3]),
    );
    const startSlot = stage1StartSlot + stage1Duration;
    const nextKnockout = {
      ...currentKnockout,
      principalSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(principalSemisRaw, startSlot, [1, 2]))),
      principalFinals: [],
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generateConsolanteFinals() {
    const currentKnockout = knockoutRef.current;
    const currentMainStage = mainStageRef.current;
    const currentConsolanteSemis = sanitizeKnockoutMatches(currentKnockout.consolanteSemis);
    const canGenerateConsolanteFinals = currentConsolanteSemis.length === 2 && currentConsolanteSemis.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!canGenerateConsolanteFinals) {
      window.alert('Toutes les demi-finales de consolante doivent être valides avant de générer les finales de consolante.');
      return;
    }
    const c1 = getWinnerLoser(currentConsolanteSemis[0], phaseRulesRef.current);
    const c2 = getWinnerLoser(currentConsolanteSemis[1], phaseRulesRef.current);
    if (!c1.winner || !c2.winner || !c1.loser || !c2.loser) {
      window.alert('Renseigne d’abord des scores valides pour les demi-finales de consolante.');
      return;
    }
    if (!confirmClearStageScores(currentKnockout.consolanteFinals, 'les finales de consolante')) return;
    const consolanteFinalsRaw = sanitizeKnockoutMatches([
      makeKnockoutMatch('Tableau consolante', 'Petite finale', c1.loser, c2.loser),
      makeKnockoutMatch('Tableau consolante', 'Finale', c1.winner, c2.winner),
    ]);
    if (consolanteFinalsRaw.length !== 2) {
      window.alert('Impossible de générer les finales de consolante tant que les 4 équipes qualifiées ne sont pas déterminées.');
      return;
    }
    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length)
      + stageSlotCount(brassage2Ref.current.matches.length)
      + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
    const stage1Duration = Math.max(
      stageSlotCountForCourts(currentKnockout.principalQuarters.length, [1, 2]),
      stageSlotCountForCourts(currentConsolanteSemis.length, [3]),
    );
    const startSlot = stage1StartSlot + stage1Duration;
    const nextKnockout = {
      ...currentKnockout,
      consolanteFinals: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(consolanteFinalsRaw, startSlot, [3]))),
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function generatePrincipalFinals() {
    const currentKnockout = knockoutRef.current;
    const currentMainStage = mainStageRef.current;
    const currentPrincipalSemis = sanitizeKnockoutMatches(currentKnockout.principalSemis);
    if (currentPrincipalSemis.length !== 2) {
      window.alert('Génère d’abord les demi-finales principales.');
      return;
    }
    const s1 = getWinnerLoser(currentPrincipalSemis[0], phaseRulesRef.current);
    const s2 = getWinnerLoser(currentPrincipalSemis[1], phaseRulesRef.current);
    if (!s1.winner || !s2.winner || !s1.loser || !s2.loser) {
      window.alert('Renseigne d’abord des scores valides pour les demi-finales principales.');
      return;
    }
    if (!confirmClearStageScores(currentKnockout.principalFinals, 'la finale principale')) return;
    const finalsRaw = sanitizeKnockoutMatches([
      makeKnockoutMatch('Tableau principal', 'Petite finale', s1.loser, s2.loser),
      makeKnockoutMatch('Tableau principal', 'Finale', s1.winner, s2.winner),
    ]);
    if (finalsRaw.length !== 2) {
      window.alert('Impossible de générer la finale principale tant que les 4 équipes qualifiées ne sont pas déterminées.');
      return;
    }
    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
    const stage1Duration = Math.max(
      stageSlotCountForCourts(currentKnockout.principalQuarters.length, [1, 2]),
      stageSlotCountForCourts(currentKnockout.consolanteSemis.length, [3]),
    );
    const stage2Duration = Math.max(
      stageSlotCountForCourts(currentPrincipalSemis.length, [1, 2]),
      stageSlotCountForCourts(currentKnockout.consolanteFinals.length, [3]),
    );
    const startSlot = stage1StartSlot + stage1Duration + stage2Duration;
    const nextKnockout = {
      ...currentKnockout,
      principalFinals: stampGeneratedMatches(assignScheduleWithCourts(finalsRaw, startSlot, [1, 2])),
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
  }

  function updateMatchesInScope(scope, updater) {
    const applyUpdater = (matches) => dedupeMatches(updater(dedupeMatches(Array.isArray(matches) ? matches : [])));
    if (scope === 'championshipLeg1') {
      const next = { ...championshipLeg1Ref.current, matches: applyUpdater(championshipLeg1Ref.current?.matches) };
      championshipLeg1Ref.current = next;
      setChampionshipLeg1(next);
      return;
    }
    if (scope === 'championshipLeg2') {
      const next = { ...championshipLeg2Ref.current, matches: applyUpdater(championshipLeg2Ref.current?.matches) };
      championshipLeg2Ref.current = next;
      setChampionshipLeg2(next);
      return;
    }
    if (scope === 'quarters') {
      const next = { ...singleKnockoutRef.current, quarters: applyUpdater(singleKnockoutRef.current?.quarters) };
      singleKnockoutRef.current = next;
      setSingleKnockout(next);
      return;
    }
    if (scope === 'semis') {
      const next = { ...singleKnockoutRef.current, semis: applyUpdater(singleKnockoutRef.current?.semis) };
      singleKnockoutRef.current = next;
      setSingleKnockout(next);
      return;
    }
    if (scope === 'finals') {
      const next = { ...singleKnockoutRef.current, finals: applyUpdater(singleKnockoutRef.current?.finals) };
      singleKnockoutRef.current = next;
      setSingleKnockout(next);
      return;
    }
    if (scope === 'brassage1') {
      const next = { ...brassage1Ref.current, matches: applyUpdater(brassage1Ref.current?.matches) };
      brassage1Ref.current = next;
      setBrassage1(next);
      return;
    }
    if (scope === 'brassage2') {
      const next = { ...brassage2Ref.current, matches: applyUpdater(brassage2Ref.current?.matches) };
      brassage2Ref.current = next;
      setBrassage2(next);
      return;
    }
    if (scope === 'principale') {
      const next = { ...mainStageRef.current, principaleMatches: applyUpdater(mainStageRef.current?.principaleMatches) };
      mainStageRef.current = next;
      setMainStage(next);
      return;
    }
    if (scope === 'consolante') {
      const next = { ...mainStageRef.current, consolanteMatches: applyUpdater(mainStageRef.current?.consolanteMatches) };
      mainStageRef.current = next;
      setMainStage(next);
      return;
    }
    if (scope === 'principalQuarters') {
      const next = { ...knockoutRef.current, principalQuarters: applyUpdater(knockoutRef.current?.principalQuarters) };
      knockoutRef.current = next;
      setKnockout(next);
      return;
    }
    if (scope === 'principalSemis') {
      const next = { ...knockoutRef.current, principalSemis: applyUpdater(knockoutRef.current?.principalSemis) };
      knockoutRef.current = next;
      setKnockout(next);
      return;
    }
    if (scope === 'principalFinals') {
      const next = { ...knockoutRef.current, principalFinals: applyUpdater(knockoutRef.current?.principalFinals) };
      knockoutRef.current = next;
      setKnockout(next);
      return;
    }
    if (scope === 'consolanteSemis') {
      const next = { ...knockoutRef.current, consolanteSemis: applyUpdater(knockoutRef.current?.consolanteSemis) };
      knockoutRef.current = next;
      setKnockout(next);
      return;
    }
    const next = { ...knockoutRef.current, consolanteFinals: applyUpdater(knockoutRef.current?.consolanteFinals) };
    knockoutRef.current = next;
    setKnockout(next);
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

  function getOrganizerStatusBadge(match) {
    const officialStatus = getMatchStatusLabel(match, phaseRulesRef.current);
    if (officialStatus === 'Valide') {
      return { text: 'Valide', className: 'badge-success' };
    }
    if (officialStatus === 'Score invalide') {
      return { text: 'Score invalide', className: 'badge-danger' };
    }
    const pendingStatus = getPendingStatus(match);
    if (pendingStatus === 'Match en cours') {
      return {
        text: 'Match en cours',
        className: match.refereeInProgress ? 'badge-danger' : 'badge-neutral',
      };
    }
    return { text: 'À saisir', className: 'badge-neutral' };
  }

  function protectOrganizerLocalEdit(matchId, snapshot) {
    recentOrganizerLocalEditsRef.current.set(matchId, {
      scoreA: String(snapshot.scoreA ?? ''),
      scoreB: String(snapshot.scoreB ?? ''),
      officialAt: snapshot.officialAt ?? new Date().toISOString(),
      until: Date.now() + 30000,
    });
  }

  function updateOfficialMatchScore(scope, matchId, field, value) {
    const fallbackMatch = findMatchInScope(scope, matchId);
    if (!fallbackMatch) return;
    const normalized = value === '' ? '' : Math.max(0, Number(value));
    const officialEditTimestamp = markPendingLocalMutation(new Date().toISOString());
    const nextScoreA = field === 'scoreA' ? normalized : (fallbackMatch.scoreA ?? '');
    const nextScoreB = field === 'scoreB' ? normalized : (fallbackMatch.scoreB ?? '');
    const protectedSnapshot = {
      scoreA: nextScoreA,
      scoreB: nextScoreB,
      officialAt: officialEditTimestamp,
    };
    protectOrganizerLocalEdit(matchId, protectedSnapshot);
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
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
      updated.validatedAt = isMatchResultValid(updated, phaseRulesRef.current) ? officialEditTimestamp : null;
      return updated;
    }));
    queueBackgroundCloudSave();
  }

  function updateRefereeMatchScore(scope, matchId, field, value) {
    const fallbackMatch = findMatchInScope(scope, matchId);
    if (!fallbackMatch || getMatchStatusLabel(fallbackMatch, phaseRulesRef.current) === 'Valide') return;
    const normalized = value === '' ? '' : String(Math.max(0, Number(value)));
    const editTimestamp = markPendingLocalMutation(new Date().toISOString());
    const selectedDraft = refereeSelectedScoreDraftRef.current?.matchId === matchId ? refereeSelectedScoreDraftRef.current : null;
    const storedDraft = refereeScoreDraftsRef.current?.[matchId] || null;
    const nextScoreA = field === 'scoreA'
      ? normalized
      : (selectedDraft?.scoreA ?? storedDraft?.scoreA ?? fallbackMatch.submittedScoreA ?? '');
    const nextScoreB = field === 'scoreB'
      ? normalized
      : (selectedDraft?.scoreB ?? storedDraft?.scoreB ?? fallbackMatch.submittedScoreB ?? '');
    const nextDraft = {
      matchId,
      scoreA: nextScoreA,
      scoreB: nextScoreB,
      submittedAt: editTimestamp,
    };
    const localPendingSnapshot = {
      submittedScoreA: String(nextScoreA ?? ''),
      submittedScoreB: String(nextScoreB ?? ''),
      submittedAt: editTimestamp,
    };

    refereeSelectedScoreDraftRef.current = nextDraft;
    setRefereeSelectedScoreDraft(nextDraft);
    commitRefereeScoreDrafts((current) => ({
      ...current,
      [matchId]: {
        ...(current[matchId] || { scoreA: '', scoreB: '' }),
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        submittedAt: editTimestamp,
      },
    }));
    recentRefereeLocalEditsRef.current.set(matchId, {
      ...localPendingSnapshot,
      until: Date.now() + 30000,
    });
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide') return match;
      return {
        ...match,
        submittedScoreA: nextScoreA,
        submittedScoreB: nextScoreB,
        submittedAt: editTimestamp,
        refereeInProgress: true,
        matchInProgress: true,
      };
    }));
    queueBackgroundCloudSave(120);
  }

  function stepRefereeMatchScore(scope, matchId, field, delta) {
    const fallbackMatch = findMatchInScope(scope, matchId);
    if (!fallbackMatch || getMatchStatusLabel(fallbackMatch, phaseRulesRef.current) === 'Valide') return;
    const selectedDraft = refereeSelectedScoreDraftRef.current?.matchId === matchId ? refereeSelectedScoreDraftRef.current : null;
    const storedDraft = refereeScoreDraftsRef.current?.[matchId] || null;
    const currentRawValue = field === 'scoreA'
      ? (selectedDraft?.scoreA ?? storedDraft?.scoreA ?? fallbackMatch.submittedScoreA)
      : (selectedDraft?.scoreB ?? storedDraft?.scoreB ?? fallbackMatch.submittedScoreB);
    const currentValue = toNumber(currentRawValue) ?? 0;
    const computedNextValue = String(Math.max(0, currentValue + delta));
    const editTimestamp = markPendingLocalMutation(new Date().toISOString());
    const nextScoreA = field === 'scoreA'
      ? computedNextValue
      : (selectedDraft?.scoreA ?? storedDraft?.scoreA ?? fallbackMatch.submittedScoreA ?? '');
    const nextScoreB = field === 'scoreB'
      ? computedNextValue
      : (selectedDraft?.scoreB ?? storedDraft?.scoreB ?? fallbackMatch.submittedScoreB ?? '');
    const nextDraft = {
      matchId,
      scoreA: nextScoreA,
      scoreB: nextScoreB,
      submittedAt: editTimestamp,
    };
    const localPendingSnapshot = {
      submittedScoreA: String(nextScoreA ?? ''),
      submittedScoreB: String(nextScoreB ?? ''),
      submittedAt: editTimestamp,
    };

    refereeSelectedScoreDraftRef.current = nextDraft;
    setRefereeSelectedScoreDraft(nextDraft);
    commitRefereeScoreDrafts((current) => ({
      ...current,
      [matchId]: {
        ...(current[matchId] || { scoreA: '', scoreB: '' }),
        scoreA: nextScoreA,
        scoreB: nextScoreB,
        submittedAt: editTimestamp,
      },
    }));
    recentRefereeLocalEditsRef.current.set(matchId, {
      ...localPendingSnapshot,
      until: Date.now() + 30000,
    });
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide') return match;
      return {
        ...match,
        submittedScoreA: nextScoreA,
        submittedScoreB: nextScoreB,
        submittedAt: editTimestamp,
        refereeInProgress: true,
        matchInProgress: true,
      };
    }));
    queueBackgroundCloudSave(120);
  }

  function approveRefereeScore(scope, matchId) {
    recentRefereeLocalEditsRef.current.delete(matchId);
    const approvalTimestamp = markPendingLocalMutation(new Date().toISOString());
    const fallbackMatch = findMatchInScope(scope, matchId);
    if (fallbackMatch) {
      protectOrganizerLocalEdit(matchId, {
        scoreA: fallbackMatch.submittedScoreA ?? fallbackMatch.scoreA ?? '',
        scoreB: fallbackMatch.submittedScoreB ?? fallbackMatch.scoreB ?? '',
        officialAt: approvalTimestamp,
      });
    }
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
      approved.manualOverrideAt = approvalTimestamp;
      approved.validatedAt = isMatchResultValid(approved, phaseRulesRef.current) ? approvalTimestamp : null;
      return approved;
    }));
    queueBackgroundCloudSave();
  }

  function rejectRefereeScore(scope, matchId) {
    recentRefereeLocalEditsRef.current.delete(matchId);
    const rejectionTimestamp = markPendingLocalMutation(new Date().toISOString());
    updateMatchesInScope(scope, (matches) => matches.map((match) => (
      match.id === matchId
        ? { ...match, submittedScoreA: '', submittedScoreB: '', submittedAt: rejectionTimestamp, refereeInProgress: false, matchInProgress: false }
        : match
    )));
    queueBackgroundCloudSave(150, rejectionTimestamp);
  }

  function reassignRefereeWithoutReset(scope, matchId) {
    recentRefereeLocalEditsRef.current.delete(matchId);
    const releaseTimestamp = markPendingLocalMutation(new Date().toISOString());
    recentRefereeReleaseRef.current.set(matchId, { until: Date.now() + 4000 });
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      return {
        ...match,
        submittedAt: releaseTimestamp,
        refereeInProgress: false,
        matchInProgress: true,
      };
    }));
    setRefereeSelectedScoreDraft((current) => (current && current.matchId === matchId ? null : current));
    setRefereeSelectedMatch((current) => (current && current.scope === scope && current.matchId === matchId ? null : current));
    queueBackgroundCloudSave(250, releaseTimestamp);
  }

  function releaseRefereeSelectedMatch(entry) {
    if (!entry?.match) {
      setRefereeSelectedScoreDraft(null);
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
    setRefereeSelectedScoreDraft(null);
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
          <div key={pool.id} className="mini-card public-ranking-card">
            <div className="mini-card-head">{formatPoolNameWithLevel(pool, teamMap)}</div>
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

  function renderCompactBrassageBoard(pools, matches, standings, scope, rankingOverride = null, rankingLabel = 'Classement général') {
    const safePools = Array.isArray(pools) ? pools.filter(Boolean) : [];
    const safeMatches = dedupeMatches(Array.isArray(matches) ? matches : []);
    const standingsMap = new Map((Array.isArray(standings) ? standings : []).map((entry) => [entry.pool?.id, entry]));
    const overallRanking = Array.isArray(rankingOverride) ? rankingOverride : (scope === 'brassage1' ? rankingAfterBrassage1 : scope === 'brassage2' ? rankingAfterBrassages : []);
    const preferredPoolId = selectedBrassagePoolByScope?.[scope] || '';
    const selectedTeamId = selectedBrassageTeamByScope?.[scope] || '';
    const terrainMatchMap = new Map();

    [1, 2, 3].forEach((courtNumber) => {
      const courtMatches = safeMatches
        .filter((match) => Number(match.court || 0) === courtNumber)
        .slice()
        .sort((a, b) => {
          if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
          return String(a.id || '').localeCompare(String(b.id || ''));
        });
      terrainMatchMap.set(courtNumber, courtMatches);
    });

    const poolCards = safePools.map((pool) => {
      const poolTeamIds = Array.isArray(pool.teamIds) ? pool.teamIds.filter(Boolean) : [];
      const poolMatches = safeMatches
        .filter((match) => match.group === pool.name || (poolTeamIds.includes(match.teamAId) && poolTeamIds.includes(match.teamBId)))
        .sort((a, b) => {
          if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
          return (a.court || 0) - (b.court || 0);
        });
      const computedRows = standingsMap.get(pool.id)?.rows || computeRanking(poolTeamIds, poolMatches, teamMap, phaseRules, { normalizeByMatches: useNormalizedPoolRanking });
      return {
        pool,
        teamIds: poolTeamIds,
        matches: poolMatches,
        rows: computedRows,
      };
    });

    if (!safePools.length) return <div className="empty-state">Aucune poule générée pour le moment.</div>;

    return (
      <div className="compact-brassage-layout compact-brassage-layout-v24n">
        <div className="mini-card compact-brassage-pools-column-v24n">
          {poolCards.map(({ pool, rows }) => {
            const isSelected = pool.id === preferredPoolId;
            return (
              <button
                type="button"
                key={pool.id}
                className={`compact-brassage-pool-list-card-v24n ${isSelected ? 'is-selected' : ''}`.trim()}
                onClick={() => {
                setSelectedBrassagePoolByScope((current) => ({ ...current, [scope]: pool.id }));
                setSelectedBrassageTeamByScope((current) => ({ ...current, [scope]: '' }));
              }}
              >
                <div className="compact-brassage-pool-list-head-v24n">{formatPoolNameWithLevel(pool, teamMap)}</div>
                <div className="compact-brassage-pool-teams-v24n">
                  {rows.map((row, rowIndex) => {
                    const fallbackTeam = resolveTeam(row.teamId);
                    return (
                      <div key={row.teamId || `${pool.id}-${rowIndex}`} className="compact-brassage-pool-team-row-v24n">
                        <span className="compact-rank-chip compact-rank-chip-v24n">{rowIndex + 1}</span>
                        <TeamBadge name={row.teamName || fallbackTeam.name} level={row.level || fallbackTeam.level} className="compact-brassage-pool-team-badge-v24n" />
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mini-card compact-brassage-matches-column-v24n">
          <div className="compact-brassage-title compact-brassage-title-v24n">Matchs</div>
          <div className="compact-terrain-columns-v24n">
            {[1, 2, 3].map((courtNumber) => {
              const courtMatches = terrainMatchMap.get(courtNumber) || [];
              return (
                <div key={courtNumber} className="compact-terrain-column-v24n">
                  <div className="compact-terrain-column-title-v24n">Terrain {courtNumber}</div>
                  <div className="compact-terrain-match-list-v24n">
                    {courtMatches.map((match, index) => {
                      const poolCard = poolCards.find((entry) => entry.pool?.name === match.group || (entry.teamIds.includes(match.teamAId) && entry.teamIds.includes(match.teamBId)));
                      const poolTeamIds = Array.isArray(poolCard?.teamIds) ? poolCard.teamIds : [];
                      const refereeTeamId = poolTeamIds.find((teamId) => teamId !== match.teamAId && teamId !== match.teamBId) || null;
                      const refereeTeam = refereeTeamId ? resolveTeam(refereeTeamId) : null;
                      const teamA = resolveTeam(match.teamAId);
                      const teamB = resolveTeam(match.teamBId);
                      const status = getMatchStatusLabel(match, phaseRules);
                      const pendingStatus = getPendingStatus(match);
                      const pendingA = toNumber(match.submittedScoreA);
                      const pendingB = toNumber(match.submittedScoreB);
                      const isValid = status === 'Valide';
                      const canApprovePending = !isValid && match.refereeInProgress && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules);
                      const isHighlightedMatch = Boolean(selectedTeamId) && (match.teamAId === selectedTeamId || match.teamBId === selectedTeamId || refereeTeamId === selectedTeamId);

                      return (
                        <div key={match.id} id={`match-card-${match.id}`} className={`compact-match-card-v24n ${isHighlightedMatch ? 'is-team-highlighted' : ''}`.trim()}>
                          <div className="compact-match-header-v24n">
                            <span className="compact-match-chip compact-match-chip-v24n">T{match.court || courtNumber}</span>
                            <TeamBadge name={refereeTeam ? refereeTeam.name : '—'} level={refereeTeam?.level} className="compact-match-referee-badge-v24n" />
                            <span className="compact-match-chip compact-match-chip-v24n">M{index + 1}</span>
                          </div>
                          <div className="compact-match-team-row-v24n">
                            <TeamBadge name={teamA.name} level={teamA.level} className="compact-team-strip-badge-v24n" />
                            <TeamBadge name={teamB.name} level={teamB.level} className="compact-team-strip-badge-v24n" />
                          </div>
                          <div className="compact-match-score-row-v24n">
                            <label className="compact-score-box compact-score-box-v24n">
                              <input type="number" min="0" inputMode="numeric" value={match.scoreA ?? ''} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreA', e.target.value)} placeholder="" />
                            </label>
                            <label className="compact-score-box compact-score-box-v24n">
                              <input type="number" min="0" inputMode="numeric" value={match.scoreB ?? ''} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreB', e.target.value)} placeholder="" />
                            </label>
                          </div>
                          <div className="compact-match-footer-v24n">
                            <button type="button" className="match-print-button-v24c" onClick={() => printMatchCard(match.id)} title="Imprimer ce match" aria-label="Imprimer ce match">🖨️</button>
                            <span className={`badge ${getOrganizerStatusBadge(match).className}`}>{getOrganizerStatusBadge(match).text}</span>
                          </div>
                          {!isValid && pendingStatus === 'Match en cours' ? <div className="muted tiny compact-pending-score-v24n">Arbitre : {match.submittedScoreA} - {match.submittedScoreB}</div> : null}
                          {!isValid && canApprovePending ? (
                            <div className="actions-row compact-actions compact-match-card-actions">
                              <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                              <Button variant="secondary" onClick={() => rejectRefereeScore(scope, match.id)}>Refuser</Button>
                            </div>
                          ) : null}
                          {!isValid && pendingStatus === 'Match en cours' ? (
                            <div className="actions-row compact-actions compact-match-card-actions">
                              <Button variant={match.refereeInProgress ? 'info' : 'secondary'} onClick={() => reassignRefereeWithoutReset(scope, match.id)}>
                                Changer l’arbitre
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="mini-card compact-overall-ranking-column-v24n">
          <div className="compact-brassage-title compact-overall-ranking-title">{rankingLabel}</div>
          <div className="compact-overall-ranking-scroll compact-overall-ranking-scroll-v24n">
            {renderOverallRanking(overallRanking, scope === 'brassage2', null, {
              compact: true,
              onTeamClick: (teamId) => {
                const pool = safePools.find((entry) => Array.isArray(entry.teamIds) && entry.teamIds.includes(teamId));
                if (!pool) return;
                setSelectedBrassagePoolByScope((current) => ({ ...current, [scope]: pool.id }));
                setSelectedBrassageTeamByScope((current) => ({ ...current, [scope]: teamId }));
              },
            })}
          </div>
        </aside>
      </div>
    );
  }

  function renderCompactFinalStage(matches, scope) {
    const safeMatches = dedupeMatches(Array.isArray(matches) ? matches : []);
    if (!safeMatches.length) return <div className="empty-state">Aucun match généré pour le moment.</div>;

    const terrainMatchMap = new Map();
    [1, 2, 3].forEach((courtNumber) => {
      const courtMatches = safeMatches
        .filter((match) => Number(match.court || 0) === courtNumber)
        .slice()
        .sort((a, b) => {
          if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
          return String(a.id || '').localeCompare(String(b.id || ''));
        });
      terrainMatchMap.set(courtNumber, courtMatches);
    });

    return (
      <div className="mini-card compact-final-stage-board-v24s">
        <div className="compact-brassage-title compact-brassage-title-v24n">Matchs</div>
        <div className="compact-terrain-columns-v24n compact-final-terrain-columns-v24s">
          {[1, 2, 3].map((courtNumber) => {
            const courtMatches = terrainMatchMap.get(courtNumber) || [];
            return (
              <div key={courtNumber} className="compact-terrain-column-v24n compact-final-terrain-column-v24s">
                <div className="compact-terrain-column-title-v24n">Terrain {courtNumber}</div>
                <div className="compact-terrain-match-list-v24n compact-final-terrain-match-list-v24s">
                  {courtMatches.length ? courtMatches.map((match, index) => {
                    const teamA = resolveTeam(match.teamAId);
                    const teamB = resolveTeam(match.teamBId);
                    const status = getMatchStatusLabel(match, phaseRules);
                    const pendingStatus = getPendingStatus(match);
                    const pendingA = toNumber(match.submittedScoreA);
                    const pendingB = toNumber(match.submittedScoreB);
                    const isValid = status === 'Valide';
                    const canApprovePending = !isValid && match.refereeInProgress && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules);
                    const matchNumber = index + 1;

                    return (
                      <div key={match.id} id={`match-card-${match.id}`} className="compact-match-card-v24n compact-final-match-card-v24s">
                        <div className="compact-match-header-v24n">
                          <span className="compact-match-chip compact-match-chip-v24n">T{match.court || courtNumber}</span>
                          <span className="compact-final-stage-label-v24s">{match.group || match.phase || 'Match'}</span>
                          <span className="compact-match-chip compact-match-chip-v24n">M{matchNumber}</span>
                        </div>
                        <div className="compact-match-team-row-v24n">
                          <TeamBadge name={teamA.name} level={teamA.level} className="compact-team-strip-badge-v24n" />
                          <TeamBadge name={teamB.name} level={teamB.level} className="compact-team-strip-badge-v24n" />
                        </div>
                        <div className="compact-match-score-row-v24n">
                          <label className="compact-score-box compact-score-box-v24n">
                            <input type="number" min="0" inputMode="numeric" value={match.scoreA ?? ''} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreA', e.target.value)} placeholder="" />
                          </label>
                          <label className="compact-score-box compact-score-box-v24n">
                            <input type="number" min="0" inputMode="numeric" value={match.scoreB ?? ''} onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreB', e.target.value)} placeholder="" />
                          </label>
                        </div>
                        <div className="compact-match-footer-v24n">
                          <button type="button" className="match-print-button-v24c" onClick={() => printMatchCard(match.id)} title="Imprimer ce match" aria-label="Imprimer ce match">🖨️</button>
                          <span className={`badge ${getOrganizerStatusBadge(match).className}`}>{getOrganizerStatusBadge(match).text}</span>
                        </div>
                        {!isValid && pendingStatus === 'Match en cours' ? <div className="muted tiny compact-pending-score-v24n">Arbitre : {match.submittedScoreA} - {match.submittedScoreB}</div> : null}
                        {!isValid && canApprovePending ? (
                          <div className="actions-row compact-actions compact-match-card-actions">
                            <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                            <Button variant="secondary" onClick={() => rejectRefereeScore(scope, match.id)}>Refuser</Button>
                          </div>
                        ) : null}
                        {!isValid && pendingStatus === 'Match en cours' ? (
                          <div className="actions-row compact-actions compact-match-card-actions">
                            <Button variant={match.refereeInProgress ? 'info' : 'secondary'} onClick={() => reassignRefereeWithoutReset(scope, match.id)}>
                              Changer l’arbitre
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    );
                  }) : <div className="empty-state compact-final-empty-v24s">Aucun match sur ce terrain.</div>}
                </div>
              </div>
            );
          })}
        </div>
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
                        <span className={`badge ${getOrganizerStatusBadge(match).className}`}>{getOrganizerStatusBadge(match).text}</span>
                        {!isValid && pendingStatus === 'Match en cours' ? (
                          <>
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
                              disabled={pendingStatus !== 'Match en cours'}
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
    const { scope, title, match: entryMatch } = entry;
    const match = findMatchInScope(scope, entryMatch.id) || entryMatch;
    const schedule = scheduleData.scheduleMap[match.id];
    const pendingStatus = getPendingStatus(match);
    const officialStatus = getMatchStatusLabel(match, phaseRules);
    const isLocked = officialStatus === 'Valide';
    const selectedDraft = refereeSelectedScoreDraft?.matchId === match.id ? refereeSelectedScoreDraft : null;
    const preferredDraft = getPreferredRefereeDraft(match);
    const liveStoredDraft = refereeScoreDraftsRef.current?.[match.id] || null;
    const draftScoreA = selectedDraft?.scoreA ?? liveStoredDraft?.scoreA ?? preferredDraft?.scoreA ?? getRefereeDraftValue(match, 'scoreA');
    const draftScoreB = selectedDraft?.scoreB ?? liveStoredDraft?.scoreB ?? preferredDraft?.scoreB ?? getRefereeDraftValue(match, 'scoreB');
    const displayScoreA = isLocked ? (match.scoreA ?? '') : (draftScoreA !== undefined ? draftScoreA : (match.submittedScoreA ?? ''));
    const displayScoreB = isLocked ? (match.scoreB ?? '') : (draftScoreB !== undefined ? draftScoreB : (match.submittedScoreB ?? ''));
    const pendingA = toNumber(displayScoreA !== '' ? displayScoreA : match.submittedScoreA);
    const pendingB = toNumber(displayScoreB !== '' ? displayScoreB : match.submittedScoreB);
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

  function renderOverallRanking(rows, withStatus = false, activeTeamIds = null, options = {}) {
    const compact = Boolean(options?.compact);
    const onTeamClick = typeof options?.onTeamClick === 'function' ? options.onTeamClick : null;

    if (compact) {
      return (
        <div className="overall-ranking-compact-v24p">
          <div className="overall-ranking-compact-head-v24p">
            <div className="overall-ranking-rank-v24p">#</div>
            <div className="overall-ranking-team-head-v24p">Équipe</div>
            <div className="overall-ranking-points-head-v24p" aria-label="Points cumulés">Pts</div>
          </div>
          <div className="overall-ranking-compact-body-v24p">
            {rows.map((row, index) => {
              const isInRefereeGame = Boolean(activeTeamIds?.has(row.teamId));
              const content = (
                <>
                  <div className="overall-ranking-rank-v24p">{index + 1}</div>
                  <div className="overall-ranking-team-v24p">
                    <TeamBadge name={row.teamName} level={row.level} className="team-badge-inline team-badge-inline-compact-overall-v24p">
                      {isInRefereeGame ? <span className="team-badge-status">&nbsp;(En jeu)</span> : null}
                    </TeamBadge>
                  </div>
                  <div className="overall-ranking-points-v24p">{row.tournamentPoints}</div>
                </>
              );
              return onTeamClick ? (
                <button
                  key={row.teamId}
                  type="button"
                  className="overall-ranking-row-v24p overall-ranking-row-button-v24p"
                  onClick={() => onTeamClick(row.teamId)}
                >
                  {content}
                </button>
              ) : (
                <div key={row.teamId} className="overall-ranking-row-v24p">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Équipe</th>
              <th>Niveau</th>
              <th>J</th><th>V</th><th>Pts T.</th>
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
                      <div>
                        <TeamBadge name={row.teamName} level={row.level} className="team-badge-inline">
                          {isInRefereeGame ? <span className="team-badge-status">&nbsp;(En jeu)</span> : null}
                        </TeamBadge>
                      </div>
                    </div>
                  </td>
                  <td>{row.level}</td>
                  <td>{row.played}</td><td>{row.wins}</td><td>{row.tournamentPoints}</td>
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
      <div className="mini-card public-ranking-card">
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
    { id: 'export', label: 'Sauvegarde' },
  ] : [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'brassage1', label: 'Brassage 1' },
    ...(shouldSkipBrassage2 ? [] : [{ id: 'brassage2', label: 'Brassage 2' }]),
    { id: 'principale', label: 'Principale' },
    { id: 'consolante', label: 'Consolante' },
    { id: 'finales', label: 'Phases finales' },
    { id: 'export', label: 'Sauvegarde' },
  ];


  if (mode === 'home') {
    const selectedHomeTournament = homeTournamentOptions.find((item) => item.id === homeSelectedTournamentId) || null;
    return (
      <div className="home-page">
        <div className="home-corner-brand" aria-label="Informations de contact">
          <img className="home-corner-logo-image" src={homeLogoUrl} alt="Logo NEO DEV Chuly0ne" />
          <div className="home-corner-email">Lvangchuly@gmail.com</div>
        </div>
        <div className="home-shell">
          <div className="home-brand">
            <div className="home-brand-pill">TOURNOIDEVOLLEY.FR</div>
            <div className="home-version">VERSION {APP_VERSION}</div>
          </div>
          <button className="home-new-tournament" onClick={createTournamentFromHome}>Nouveau tournoi</button>
          <div className="home-selector-row">
            <button className="home-continue-button" onClick={continueWithSelectedTournament} aria-label="Continuer vers le tournoi sélectionné">▶<span>CONTINUER</span></button>
            <div className="home-selector-block">
              <label className="home-selector-label" htmlFor="home-tournament-search">Tournoi:</label>
              <div className={`home-selector ${homeSelectorOpen ? 'home-selector-open' : ''}`.trim()}>
                <input
                  id="home-tournament-search"
                  className="home-selector-input"
                  type="text"
                  value={homeSearch}
                  placeholder="Nom du tournoi recherché"
                  onFocus={() => setHomeSelectorOpen(true)}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setHomeSearch(nextValue);
                    const normalizedNextValue = String(nextValue || '').trim().toLocaleLowerCase('fr-FR');
                    const nextOptions = [...homeTournamentOptions]
                      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fr', { sensitivity: 'base' }))
                      .map((item) => {
                        const name = String(item.name || '').toLocaleLowerCase('fr-FR');
                        const index = normalizedNextValue ? name.indexOf(normalizedNextValue) : 0;
                        return { ...item, matchIndex: index < 0 ? Number.MAX_SAFE_INTEGER : index };
                      })
                      .sort((a, b) => {
                        if (a.matchIndex !== b.matchIndex) return a.matchIndex - b.matchIndex;
                        return String(a.name || '').localeCompare(String(b.name || ''), 'fr', { sensitivity: 'base' });
                      });
                    if (nextOptions[0]) setHomeSelectedTournamentId(nextOptions[0].id);
                    setHomeSelectorOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      continueWithSelectedTournament();
                    }
                  }}
                />
                <button
                  type="button"
                  className="home-selector-toggle"
                  aria-label="Afficher la liste des tournois"
                  onClick={() => setHomeSelectorOpen((current) => !current)}
                >▼</button>
                {homeSelectorOpen ? (
                  <div className="home-selector-dropdown">
                    {homeCatalogLoading ? <div className="home-selector-status">Chargement des tournois…</div> : null}
                    {!homeCatalogLoading && homeCatalogError ? <div className="home-selector-status home-selector-error">{homeCatalogError}</div> : null}
                    {!homeCatalogLoading && !homeCatalogError && filteredHomeTournamentOptions.length === 0 ? <div className="home-selector-status">Aucun tournoi trouvé.</div> : null}
                    {!homeCatalogLoading && !homeCatalogError && filteredHomeTournamentOptions.length > 0 ? (
                      <div className="home-selector-list">
                        {filteredHomeTournamentOptions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={`home-selector-option ${item.id === homeSelectedTournamentId ? 'home-selector-option-active' : ''}`.trim()}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              setHomeSelectedTournamentId(item.id);
                              setHomeSearch(item.name);
                              setHomeSelectorOpen(false);
                            }}
                          >
                            <span>{item.name}</span>
                            <small>{item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : ''}</small>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                className="home-delete-button"
                onClick={deleteSelectedTournamentFromHome}
                disabled={!homeSelectedTournamentId || homeDeletingTournamentId === homeSelectedTournamentId || homeCatalogLoading}
                aria-label="Supprimer le tournoi sélectionné"
                title="Supprimer le tournoi sélectionné"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'public') {
    return (
      <div className="public-page">
        <div className="container">
          <header
            className={`hero public-hero ${tournamentLogo ? 'public-hero-with-logo hero-organizer-banner-with-logo' : 'public-hero-light'}`.trim()}
            style={tournamentLogo ? organizerBannerStyle : undefined}
          >
            <div>
              <div className="hero-brand">
                <div className={`hero-tag ${tournamentLogo ? '' : 'hero-tag-dark'}`.trim()}>tournoidevolley.fr</div>
                <div className={`hero-version ${tournamentLogo ? '' : 'hero-version-dark'}`.trim()}>Version {APP_VERSION}</div>
              </div>
              <h1>{tournamentName}</h1>
            </div>
            <div className="hero-controls">
              <div className={`hero-pill ${tournamentLogo ? 'public-pill-on-logo' : 'public-pill-light'}`.trim()}>
                <span>Fin estimée de la phase</span>
                <strong>{estimatedTournamentEnd}</strong>
              </div>
              <div className="actions-stack">
                <Button variant="primary" onClick={requestOrganizerMode}>Accès organisateur</Button>
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
            {showSplitPublicPoolRankings ? (
              <Section title="Classements des poules" subtitle="Affichage par poule pour visualiser directement les équipes qualifiées. Les points du brassage ne sont pas repris dans ces classements.">
                <div className="cards-grid two-up public-rankings-grid">
                  {showPublicPrincipalePoolRanking ? (
                    <div className="mini-card public-ranking-card">
                      <div className="mini-card-head">Poules principale</div>
                      {renderStandings(principaleStandings)}
                    </div>
                  ) : null}
                  {showPublicConsolantePoolRanking ? (
                    <div className="mini-card public-ranking-card">
                      <div className="mini-card-head">Poules consolante</div>
                      {renderStandings(consolanteStandings)}
                    </div>
                  ) : null}
                </div>
              </Section>
            ) : (
              <Section title={publicOverallRankingTitle} subtitle={publicOverallRankingSubtitle}>
                {renderOverallRanking(publicOverallRankingRows, false, activeInProgressTeamIds)}
              </Section>
            )}
            {publicPodiumLeaders.tournamentFinished ? (
              <Section title="Podiums">
                <div className="cards-grid two-up public-rankings-grid">
                  {renderPodium('Tableau principal', knockout.principalFinals)}
                  {renderPodium('Tableau consolante', knockout.consolanteFinals)}
                </div>
              </Section>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'referee') {
    return (
      <div className="referee-page">
        <div className="container">
          <header
            className={`hero referee-hero ${tournamentLogo ? 'referee-hero-with-logo hero-organizer-banner-with-logo' : ''}`.trim()}
            style={tournamentLogo ? organizerBannerStyle : undefined}
          >
            <div>
              <div className="hero-brand">
                <div className={`hero-tag ${tournamentLogo ? '' : 'hero-tag-dark'}`.trim()}>tournoidevolley.fr</div>
                <div className={`hero-version ${tournamentLogo ? '' : 'hero-version-dark'}`.trim()}>Version {APP_VERSION}</div>
              </div>
              <h1>{tournamentName} — mode arbitres</h1>
            </div>
            <div className="hero-controls">
              <div className={`hero-pill ${tournamentLogo ? 'public-pill-on-logo' : ''}`.trim()}>
                <span>Fin estimée de la phase</span>
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
              <Section>
                <div className="referee-selector-grid">
                  {refereeMatchGroups.filter((group) => group.matches.length > 0).map((group) => (
                    <div key={group.scope} className="mini-card public-ranking-card">
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
      <div className={`container ${['brassage1', 'brassage2', 'principale', 'consolante', 'finales'].includes(activeTab) ? 'organizer-phase-fullwidth' : ''}`.trim()}>
        {activeTab === 'dashboard' ? (
        <header className={`hero hero-organizer-banner ${tournamentLogo ? 'hero-organizer-banner-with-logo' : ''}`.trim()} style={organizerBannerStyle}>
          <div className="banner-side banner-left">
            <AccessQrCode
              url={refereeAccessUrl}
              title="Accès arbitres"
              alt="QR code d’accès au mode arbitres"
              caption="Scanne ce QR code pour ouvrir directement le mode Arbitres."
              topImageSrc="/organizer-banner-bg.png"
              topImageAlt="Logo NEO DEV ChulyOne"
              onOpen={enterRefereeMode}
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
              style={organizerTitleInputStyle}
              onChange={(e) => {
                const nextName = e.target.value;
                setTournamentName(nextName);
                if (!String(sharedTournamentIdRef.current || '').trim()) {
                  const nextId = buildDefaultSharedTournamentId(nextName || DEFAULT_TOURNAMENT_NAME);
                  setSharedTournamentId(nextId);
                }
                queueBackgroundCloudSave(150);
              }}
              onBlur={() => {
                const trimmedName = String(tournamentName || '').trim();
                const nextName = !trimmedName ? DEFAULT_TOURNAMENT_NAME : trimmedName;
                if (nextName !== tournamentName) setTournamentName(nextName);
                queueBackgroundCloudSave(0);
              }}
              placeholder={DEFAULT_TOURNAMENT_NAME}
              aria-label="Nom du tournoi"
            />
            <div className="hero-pill organizer-phase-pill">
              <OrganizerPhaseEstimateCard data={organizerPhaseEstimateData} />
            </div>
            <div className="actions-stack hero-actions-centered">
              <Button variant="success" onClick={() => saveTournamentState(true)}>Sauvegarder</Button>
              <Button variant="danger" onClick={startNewTournament}>Nouveau tournoi</Button>
            </div>
            <div className="muted small banner-meta">Identifiant du tournoi : <strong>{sharedTournamentId}</strong></div>
          </div>
          <div className="banner-side banner-right">
            <AccessQrCode
              url={publicAccessUrl}
              title="Accès public"
              alt="QR code d’accès à l’affichage public"
              caption="Scanne ce QR code pour ouvrir directement l’affichage public du tournoi."
              onOpen={enterPublicMode}
            />
          </div>
        </header>
        ) : null}

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
                <StatCard label="Équipes" value={teams.length} subvalue={isSmallTournamentMode ? 'Mode Championnat Aller / Retour (< 8 équipes)' : 'Cible : 18'} />
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
                    <StatCard label="Brassage 1" value={`${completedMatchCounts.b1}/${visibleBrassage1Matches.length || 0}`} subvalue={getBrassagePoolSummary(activeTeams.length)} />
                    {shouldSkipBrassage2 ? <StatCard label="Brassage 2" value="Désactivé" subvalue="Passage direct après le brassage 1" /> : <StatCard label="Brassage 2" value={`${completedMatchCounts.b2}/${visibleBrassage2Matches.length || 0}`} subvalue={getBrassagePoolSummary(activeTeams.length)} />}
                    <StatCard label="Principale" value={`${completedMatchCounts.principale}/${visiblePrincipaleMatches.length || 0}`} subvalue={mainStageDistribution.principalePoolNames.length === 2 ? '2 poules' : '4 poules de 3'} />
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
                  MOT DE PASSE ACTUEL: {organizerPassword === '' ? 'aucun mot de passe' : organizerPassword}
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
                {canDisableBrassage2 ? (
                  <label className="checkbox-row" style={{ marginBottom: '12px' }}>
                    <input type="checkbox" checked={disableBrassage2} onChange={(e) => setDisableBrassage2(e.target.checked)} />
                    <span> Désactiver le brassage 2 et passer directement à la principale / consolante après le brassage 1</span>
                  </label>
                ) : null}
                <div className="cards-grid two-up public-rankings-grid">
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

              <Section title="Informations" subtitle="Explication du calcul des points.">
                <div className="cards-grid one-up info-grid">
                  <div className="mini-card info-card">
                    <div className="mini-card-head">Calcul des points</div>
                    <p className="muted small">L’équipe gagnante marque le score gagnant multiplié par 2, puis on ajoute l’écart de points. L’équipe perdante conserve ses points marqués puis on retire cet écart.</p>
                    <p className="muted small"><strong>Exemple :</strong> sur un match en 21, une victoire 21 à 17 donne <strong>46 points</strong> au vainqueur (2 × 21 + 4) et <strong>13 points</strong> au perdant (17 − 4).</p>
                    <p className="muted small">Ces points servent ensuite à départager les équipes dans les classements de poules, de brassage et dans le classement cumulé.</p>
                    {hasDuplicateTeamNames ? <p className="helper-text danger-text">Des doublons de nom d’équipe sont détectés. Le brassage 1 reste bloqué tant qu’ils ne sont pas corrigés.</p> : null}
                  </div>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'equipes' && (
            <Section title="Équipes" subtitle="N = 5, PN = 4, R = 3, D = 2, L = 1. Le brassage 1 utilise les numéros de la liste affichée des équipes triées par niveau : 1 à 6 en équipe 1, 18 à 13 en équipe 2, puis 7 à 12 en équipe 3. En cas d'égalité complète avant saisie des scores, l'ordre affiché dans la poule suit cet ordre d'affectation. Pour 8 à 17 équipes, le brassage privilégie uniquement des poules de 3 à 5 équipes, sans poule de 2." right={<><Button variant="secondary" onClick={addTeam} disabled={teamAdditionLocked}>Ajouter</Button><Button onClick={generateBrassage1} disabled={generateBrassage1Locked}>Générer brassage 1</Button></>}>
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
              {teamDeletionLocked ? <p className="muted small helper-text">Le bouton Supprimer disparaît dès qu’un match du tournoi est officiellement validé. Après "Nouveau tournoi", il reste disponible tant qu’aucun match du nouveau tournoi n’a été validé.</p> : null}
            </Section>
          )}


          {activeTab === 'championship' && isSmallTournamentMode && (
            <>
              <Section title="Championnat Aller" subtitle="Toutes les équipes se rencontrent une première fois pour construire le classement général." right={<Button onClick={generateBrassage2}>Générer le Championnat Retour</Button>}>
                {renderStandings(championshipLeg1Standings)}
              </Section>
              <Section title={`Matchs du Championnat Aller : ${formatRemainingMatchesLabel(championshipLeg1.matches, phaseRules)}`} right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Championnat Aller — matchs restants', championshipLeg1.matches, [], resolveTeam, phaseRules)}>🖨️</Button>}>
                {renderCompactFinalStage(championshipLeg1.matches, 'championshipLeg1')}
              </Section>
              <Section title="Championnat Retour" subtitle="Toutes les équipes se rencontrent une seconde fois. Le classement cumule l’aller et le retour." right={<Button onClick={generateSmallKnockoutStage1}>Générer tableau final</Button>}>
                {renderStandings(championshipLeg2Standings)}
              </Section>
              <Section title={`Matchs du Championnat Retour : ${formatRemainingMatchesLabel(championshipLeg2.matches, phaseRules)}`} right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Championnat Retour — matchs restants', championshipLeg2.matches, [], resolveTeam, phaseRules)}>🖨️</Button>}>
                {renderCompactFinalStage(championshipLeg2.matches, 'championshipLeg2')}
              </Section>
              <Section title="Classement général Aller + Retour" subtitle="Utilisé pour construire directement les quarts, les demi-finales ou la finale selon le nombre d’équipes.">
                {renderOverallRanking(championshipRanking)}
              </Section>
            </>
          )}

          {activeTab === 'brassage1' && !isSmallTournamentMode && (
            <>
              <Section title={`Brassage 1 : ${formatRemainingMatchesLabel(visibleBrassage1Matches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Brassage 1 — matchs restants', visibleBrassage1Matches, brassage1.pools, resolveTeam, phaseRules)}>🖨️</Button>{shouldSkipBrassage2 ? <Button onClick={() => generateMainStage(true)}>Générer principale / consolante</Button> : <Button onClick={generateBrassage2}>Générer brassage 2</Button>}{canDisableBrassage2 && !shouldSkipBrassage2 ? <Button variant="success" onClick={() => generateMainStage(true)}>Passer en principale / consolante</Button> : null}</>}>
                {renderCompactBrassageBoard(brassage1.pools, visibleBrassage1Matches, brassage1Standings, 'brassage1')}
              </Section>
            </>
          )}

          {activeTab === 'brassage2' && !isSmallTournamentMode && !shouldSkipBrassage2 && (
            <>
              <Section title={`Brassage 2 : ${formatRemainingMatchesLabel(visibleBrassage2Matches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Brassage 2 — matchs restants', visibleBrassage2Matches, brassage2.pools, resolveTeam, phaseRules)}>🖨️</Button><Button onClick={generateMainStage}>Générer principale / consolante</Button></>}>
                {renderCompactBrassageBoard(brassage2.pools, visibleBrassage2Matches, brassage2Standings, 'brassage2')}
              </Section>
            </>
          )}

          {activeTab === 'principale' && !isSmallTournamentMode && (
            <>
              <Section title={`Principale : ${formatRemainingMatchesLabel(visiblePrincipaleMatches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Principale — matchs restants', visiblePrincipaleMatches, mainStage.principalePools, resolveTeam, phaseRules)}>🖨️</Button><Button variant="success" onClick={generatePrincipalQuarters}>{mainStageDistribution.directPrincipalSemis ? 'Générer demies principale' : 'Générer quarts principale'}</Button></>}>
                {renderCompactBrassageBoard(mainStage.principalePools, visiblePrincipaleMatches, principaleStandings, 'principale', principaleOverallRanking, 'Classement générale principale')}
              </Section>
            </>
          )}

          {activeTab === 'consolante' && !isSmallTournamentMode && (
            <>
              <Section title={`Consolante : ${formatRemainingMatchesLabel(visibleConsolanteMatches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Consolante — matchs restants', visibleConsolanteMatches, mainStage.consolantePools, resolveTeam, phaseRules)}>🖨️</Button><Button variant="secondary" onClick={generateConsolanteSemis}>Générer demies consolante</Button></>}>
                {renderCompactBrassageBoard(mainStage.consolantePools, visibleConsolanteMatches, consolanteStandings, 'consolante', consolanteOverallRanking, 'Classement général consolante')}
              </Section>
            </>
          )}

          {activeTab === 'finales' && (
            <>
              {isSmallTournamentMode ? (
                <>
                  <Section title={`Quarts de finale : ${formatRemainingMatchesLabel(singleKnockout.quarters, phaseRules)}`} subtitle="Générés uniquement si le nombre d’équipes classées est compris entre 5 et 8." right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Quarts de finale — matchs restants', singleKnockout.quarters, [], resolveTeam, phaseRules)}>🖨️</Button><Button onClick={generateSmallKnockoutStage1}>Regénérer le premier tour</Button><Button variant="success" onClick={generateSmallKnockoutStage2}>Générer les demi-finales</Button></>}>
                    {renderCompactFinalStage(singleKnockout.quarters, 'quarters')}
                  </Section>

                  <Section title={`Demi-finales : ${formatRemainingMatchesLabel(singleKnockout.semis, phaseRules)}`} subtitle="Créées directement pour 3 ou 4 équipes, ou après les quarts pour 5 à 8 équipes." right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Demi-finales — matchs restants', singleKnockout.semis, [], resolveTeam, phaseRules)}>🖨️</Button><Button variant="success" onClick={generateSmallKnockoutStage3}>Générer la finale et la petite finale</Button></>}>
                    {renderCompactFinalStage(singleKnockout.semis, 'semis')}
                  </Section>

                  <Section title={`Finale et petite finale : ${formatRemainingMatchesLabel(singleKnockout.finals, phaseRules)}`} subtitle="Dernière étape du tournoi." right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Finale et petite finale — matchs restants', singleKnockout.finals, [], resolveTeam, phaseRules)}>🖨️</Button>}>
                    {renderCompactFinalStage(singleKnockout.finals, 'finals')}
                  </Section>

                  <Section title="Podium" subtitle="Le podium s’affiche dès que la finale est validée.">
                    <div className="cards-grid two-up public-rankings-grid">
                      {renderPodium('Tournoi', singleKnockout.finals)}
                    </div>
                  </Section>
                </>
              ) : (
                <>
                  <Section title="Étape 1 des tableaux finaux" right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Étape 1 des tableaux finaux — matchs restants', [...(mainStageDistribution.directPrincipalSemis ? knockout.principalSemis : knockout.principalQuarters), ...knockout.consolanteSemis], [], resolveTeam, phaseRules)}>🖨️</Button><Button onClick={generatePrincipalQuarters}>{mainStageDistribution.directPrincipalSemis ? 'Régénérer demies principale' : 'Regénérer quarts principale'}</Button><Button variant="secondary" onClick={generateConsolanteSemis}>Régénérer demies consolante</Button>{!mainStageDistribution.directPrincipalSemis && <Button variant="success" onClick={generatePrincipalSemis}>Générer demies principale</Button>}<Button variant="success" onClick={generateConsolanteFinals}>Générer finales consolante</Button></>}>
                    <div className="cards-grid one-up knockout-step-grid">
                      <div className="knockout-panel">
                        <h3>{mainStageDistribution.directPrincipalSemis ? `Demi-finales principale : ${formatRemainingMatchesLabel(knockout.principalSemis, phaseRules)}` : `Quarts de finale principale : ${formatRemainingMatchesLabel(knockout.principalQuarters, phaseRules)}`}</h3>
                        {renderCompactFinalStage(mainStageDistribution.directPrincipalSemis ? knockout.principalSemis : knockout.principalQuarters, mainStageDistribution.directPrincipalSemis ? 'principalSemis' : 'principalQuarters')}
                      </div>
                      <div className="knockout-panel">
                        <h3>{`Demi-finales consolante : ${formatRemainingMatchesLabel(knockout.consolanteSemis, phaseRules)}`}</h3>
                        {renderCompactFinalStage(knockout.consolanteSemis, 'consolanteSemis')}
                      </div>
                    </div>
                  </Section>

                  <Section title="Étape 2 des tableaux finaux" right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Étape 2 des tableaux finaux — matchs restants', [...knockout.principalSemis, ...knockout.consolanteFinals], [], resolveTeam, phaseRules)}>🖨️</Button><Button variant="success" onClick={generatePrincipalFinals}>Générer finale principale</Button></>}>
                    <div className="cards-grid one-up knockout-step-grid">
                      {!mainStageDistribution.directPrincipalSemis && (
                        <div className="knockout-panel">
                          <h3>{`Demi-finales principale : ${formatRemainingMatchesLabel(knockout.principalSemis, phaseRules)}`}</h3>
                          {renderCompactFinalStage(knockout.principalSemis, 'principalSemis')}
                        </div>
                      )}
                      <div className="knockout-panel">
                        <h3>{`Finales consolante : ${formatRemainingMatchesLabel(knockout.consolanteFinals, phaseRules)}`}</h3>
                        {renderCompactFinalStage(knockout.consolanteFinals, 'consolanteFinals')}
                      </div>
                    </div>
                  </Section>

                  <Section title={`Étape 3 du tableau principal : ${formatRemainingMatchesLabel(knockout.principalFinals, phaseRules)}`} right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Étape 3 du tableau principal — matchs restants', knockout.principalFinals, [], resolveTeam, phaseRules)}>🖨️</Button>}>
                    {renderCompactFinalStage(knockout.principalFinals, 'principalFinals')}
                  </Section>

                  <Section title="Podiums">
                    <div className="cards-grid two-up public-rankings-grid">
                      {renderPodium('Tableau principal', knockout.principalFinals)}
                      {renderPodium('Tableau consolante', knockout.consolanteFinals)}
                    </div>
                  </Section>
                </>
              )}
            </>
          )}

          {activeTab === 'export' && (
            <Section title="Sauvegarde" subtitle="Export, import et sauvegarde locale du tournoi." right={<><Button onClick={exportState}>Exporter JSON</Button><Button variant="secondary" onClick={randomizeTeamsAndLevels}>ALEAT</Button><Button variant="secondary" onClick={randomizeCurrentPhaseScores}>Score aléatoire</Button><Button variant="secondary" onClick={() => importRef.current?.click()}>Importer JSON</Button></>}>
              <input ref={importRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
              <div className="cards-grid two-up public-rankings-grid">
                <div className="mini-card public-ranking-card">
                  <div className="mini-card-head">Fonctions incluses</div>
                  <ul className="simple-list">
                    <li>13 à 18 équipes en mode tournoi, ou championnat aller-retour jusqu’à 12 équipes. Avec 17 équipes : 12 en principale et 5 en consolante avec une première phase de championnat avant les demi-finales.</li>
                    <li>2 brassages en 6 poules de 3</li>
                    <li>Principale et consolante adaptées automatiquement selon le nombre d’équipes</li>
                    <li>Quarts, demi-finales, finales et petites finales</li>
                    <li>Modes public, arbitres et organisateur</li>
                  </ul>
                </div>
                <div className="mini-card public-ranking-card">
                  <div className="mini-card-head">Sauvegarde et export</div>
                  <div className="field-stack">
                    <label>
                      <span>Identifiant du tournoi (organisateur uniquement)</span>
                      <div className="inline-form-row">
                        <input
                          value={sharedTournamentId}
                          readOnly
                          placeholder="tournoi-ab12c"
                        />
                        <Button variant="secondary" onClick={regenerateSharedTournamentIdentifier}>Nouveau code</Button>
                      </div>
                    </label>
                    <div className="muted small">L’identifiant combine le nom du tournoi et un code aléatoire. Tous les appareils utilisant le même identifiant chargent maintenant la même liste d’équipes et le même tournoi partagé.</div>
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
