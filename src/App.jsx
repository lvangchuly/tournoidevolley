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

const PODIUM_PLAYERS_HUMAN_URL = '/podium-players-human.png';

const STORAGE_KEY = 'tournoidevolley-react-vite-V27BH';
const LEGACY_STORAGE_KEYS = ['tournoidevolley-react-vite-V27BE', 'tournoidevolley-react-vite-V27BD', 'tournoidevolley-react-vite-V27BB', 'tournoidevolley-react-vite-V27AO', 'tournoidevolley-react-vite-V27AN', 'tournoidevolley-react-vite-V27AL', 'tournoidevolley-react-vite-V27AK', 'tournoidevolley-react-vite-V27AM', 'tournoidevolley-react-vite-V27Z', 'tournoidevolley-react-vite-V27Y', 'tournoidevolley-react-vite-V27U', 'tournoidevolley-react-vite-V27T', 'tournoidevolley-react-vite-V27S', 'tournoidevolley-react-vite-V27R', 'tournoidevolley-react-vite-V27Q', 'tournoidevolley-react-vite-V26V', 'tournoidevolley-react-vite-V26T', 'tournoidevolley-react-vite-V26S', 'tournoidevolley-react-vite-V26R', 'tournoidevolley-react-vite-V26Q', 'tournoidevolley-react-vite-V26P', 'tournoidevolley-react-vite-V25L', 'tournoidevolley-react-vite-V25K', 'tournoidevolley-react-vite-V25G', 'tournoidevolley-react-vite-V25F', 'tournoidevolley-react-vite-V25E', 'tournoidevolley-react-vite-V25D', 'tournoidevolley-react-vite-V25C', 'tournoidevolley-react-vite-V25B', 'tournoidevolley-react-vite-V24W', 'tournoidevolley-react-vite-V24V', 'tournoidevolley-react-vite-V24U', 'tournoidevolley-react-vite-V24Q', 'tournoidevolley-react-vite-V24I', 'tournoidevolley-react-vite-V24H', 'tournoidevolley-react-vite-V24D', 'tournoidevolley-react-vite-V24C', 'tournoidevolley-react-vite-V24B', 'tournoidevolley-react-vite-V24A', 'tournoidevolley-react-vite-V23AA', 'tournoidevolley-react-vite-V23Y', 'tournoidevolley-react-vite-V23G', 'tournoidevolley-react-vite-V23Y', 'tournoidevolley-react-vite-V23D', 'tournoidevolley-react-vite-V23C', 'tournoidevolley-react-vite-V23B', 'tournoidevolley-react-vite-V23', 'tournoidevolley-react-vite-V22E', 'tournoidevolley-react-vite-V22D', 'tournoidevolley-react-vite-V22C', 'tournoidevolley-react-vite-V22B', 'tournoidevolley-react-vite-V22A', 'tournoidevolley-react-vite-V21U', 'tournoidevolley-react-vite-V21T', 'tournoidevolley-react-vite-V21S', 'tournoidevolley-react-vite-V21R', 'tournoidevolley-react-vite-V21O', 'tournoidevolley-react-vite-V21N', 'tournoidevolley-react-vite-V21L', 'tournoidevolley-react-vite-V21K', 'tournoidevolley-react-vite-V21J', 'tournoidevolley-react-vite-V21I', 'tournoidevolley-react-vite-V21H', 'tournoidevolley-react-vite-V21G', 'tournoidevolley-react-vite-V21F', 'tournoidevolley-react-vite-V21E', 'tournoidevolley-react-vite-V21D', 'tournoidevolley-react-vite-V21C', 'tournoidevolley-react-vite-V21B', 'tournoidevolley-react-vite-V21A', 'tournoidevolley-react-vite-V21', 'tournoidevolley-react-vite-V20R4', 'tournoidevolley-react-vite-V20R3', 'tournoidevolley-react-vite-V20R2', 'tournoidevolley-react-vite-V20R1', 'tournoidevolley-react-vite-V20Q', 'tournoidevolley-react-vite-V20P', 'tournoidevolley-react-vite-V20O', 'tournoidevolley-react-vite-V20N', 'tournoidevolley-react-vite-V20M', 'tournoidevolley-react-vite-V20L', 'tournoidevolley-react-vite-V20K', 'tournoidevolley-react-vite-V20J', 'tournoidevolley-react-vite-V20I', 'tournoidevolley-react-vite-V20H', 'tournoidevolley-react-vite-V20G', 'tournoidevolley-react-vite-V20F', 'tournoidevolley-react-vite-V20E', 'tournoidevolley-react-vite-V20D', 'tournoidevolley-react-vite-V20C', 'tournoidevolley-react-vite-V20B', 'tournoidevolley-react-vite-V20A', 'tournoidevolley-react-vite-V19Y', 'tournoidevolley-react-vite-V19X', 'tournoidevolley-react-vite-V19W', 'tournoidevolley-react-vite-V19V', 'tournoidevolley-react-vite-V19U', 'tournoidevolley-react-vite-V19T', 'tournoidevolley-react-vite-V19S', 'tournoidevolley-react-vite-V19R', 'tournoidevolley-react-vite-V19Q', 'tournoidevolley-react-vite-V19P', 'tournoidevolley-react-vite-V19O', 'tournoidevolley-react-vite-V19N', 'tournoidevolley-react-vite-V19M', 'tournoidevolley-react-vite-V19L', 'tournoidevolley-react-vite-V19K', 'tournoidevolley-react-vite-V19J', 'tournoidevolley-react-vite-V19I', 'tournoidevolley-react-vite-V19H', 'tournoidevolley-react-vite-V19G', 'tournoidevolley-react-vite-V19F', 'tournoidevolley-react-vite-V19E', 'tournoidevolley-react-vite-V19D', 'tournoidevolley-react-vite-V19C', 'tournoidevolley-react-vite-V19B', 'tournoidevolley-react-vite-V19', 'tournoidevolley-react-vite-v18I', 'tournoidevolley-react-vite-v18H', 'tournoidevolley-react-vite-V18G', 'tournoidevolley-react-vite-v18F', 'tournoidevolley-react-vite-V18D', 'tournoidevolley-react-vite-v18C', 'tournoidevolley-react-vite-V18B', 'tournoidevolley-react-vite-v18A', 'tournoidevolley-react-vite-v18', 'tournoidevolley-react-vite-v17D'];
const DEFAULT_COURT_COUNT = 3;
const MIN_COURT_COUNT = 3;
const MAX_COURT_COUNT = 6;
let CURRENT_COURT_COUNT = DEFAULT_COURT_COUNT;
const DEFAULT_TEAM_COUNT = 18;
const TEAM_TARGET = 36;
const MIN_TEAM_TARGET = 15;
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
const APP_VERSION = 'V34M';
const ARBITRAGE_REQUEST_TIMEOUT_MS = 60 * 1000;
const ARBITRAGE_REQUEST_STATUS = 'En pause';
const MASTER_PASSWORD = 'Chuly0ne';
const POINTS_AVERAGE_TOOLTIP = "Les points de chaque match sont additionnés puis divisés par le nombre de matchs joués pour obtenir une moyenne par match. Cela permet de comparer équitablement des poules qui n’ont pas toutes le même nombre de matchs.";
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
const PRINCIPALE_POOL_NAMES = ['Principale A', 'Principale B', 'Principale C', 'Principale D', 'Principale E', 'Principale F'];
const CONSOLANTE_POOL_NAMES = ['Consolante A', 'Consolante B', 'Consolante C', 'Consolante D', 'Consolante E', 'Consolante F'];

function getPreferredBrassagePoolCount(teamCount) {
  if (teamCount < 8) return 0;
  if (teamCount === 18) return 6;
  if (teamCount === 19) return 4;
  if (teamCount === 20) return 6;
  if (teamCount === 21) return 7;
  if (teamCount === 22) return 7;
  if (teamCount === 23) return 7;
  if (teamCount === 24) return 8;
  return Math.ceil(teamCount / 3);
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
  if (teamCount === 36) return { principaleCount: 18, consolanteCount: 18, normalizedRanking: false, consolanteMode: 'pools36', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 6), consolantePoolNames: CONSOLANTE_POOL_NAMES.slice(0, 6), directPrincipalSemis: false };
  if (teamCount === 24) return { principaleCount: 12, consolanteCount: 12, normalizedRanking: false, consolanteMode: 'quarter-pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: ['Consolante A', 'Consolante B', 'Consolante C', 'Consolante D'], directPrincipalSemis: false };
  if (teamCount === 23) return { principaleCount: 12, consolanteCount: 11, normalizedRanking: false, consolanteMode: 'quarter-pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: ['Consolante A', 'Consolante B', 'Consolante C'], directPrincipalSemis: false };
  if (teamCount === 22) return { principaleCount: 12, consolanteCount: 10, normalizedRanking: false, consolanteMode: 'quarter-pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: ['Consolante A', 'Consolante B', 'Consolante C'], directPrincipalSemis: false };
  if (teamCount === 21) return { principaleCount: 12, consolanteCount: 9, normalizedRanking: false, consolanteMode: 'quarter-pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: ['Consolante A', 'Consolante B', 'Consolante C'], directPrincipalSemis: false };
  if (teamCount === 20) return { principaleCount: 12, consolanteCount: 8, normalizedRanking: false, consolanteMode: 'quarter-pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: ['Consolante A', 'Consolante B'], directPrincipalSemis: false };
  if (teamCount === 19) return { principaleCount: 12, consolanteCount: 7, normalizedRanking: false, consolanteMode: 'mixed43', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: ['Consolante A', 'Consolante B'], directPrincipalSemis: false };
  if (teamCount === 18) return { principaleCount: 12, consolanteCount: 6, normalizedRanking: false, consolanteMode: 'pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: CONSOLANTE_POOL_NAMES.slice(0, 2), directPrincipalSemis: false };
  if (teamCount === 8) return { principaleCount: 8, consolanteCount: 0, normalizedRanking: true, consolanteMode: 'pools', principalePoolNames: [], consolantePoolNames: [], directPrincipalSemis: false };
  if (teamCount === 12) return { principaleCount: 8, consolanteCount: 4, normalizedRanking: true, consolanteMode: 'direct-podium', principalePoolNames: [], consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]], directPrincipalSemis: false };
  if (teamCount === 11) return { principaleCount: 8, consolanteCount: 3, normalizedRanking: true, consolanteMode: 'pools', principalePoolNames: [], consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]], directPrincipalSemis: false, directPrincipalQuarters: true };
  if (teamCount === 17) return { principaleCount: 12, consolanteCount: 5, normalizedRanking: true, consolanteMode: 'championship', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]], directPrincipalSemis: false };
  if (teamCount === 16) return { principaleCount: 12, consolanteCount: 4, normalizedRanking: true, consolanteMode: 'championship', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]], directPrincipalSemis: false };
  if (teamCount === 15) return { principaleCount: 12, consolanteCount: 3, normalizedRanking: true, consolanteMode: 'championship', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]], directPrincipalSemis: false };
  if (teamCount === 14) return { principaleCount: 8, consolanteCount: 6, normalizedRanking: true, consolanteMode: 'pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 2), consolantePoolNames: CONSOLANTE_POOL_NAMES, directPrincipalSemis: true };
  if (teamCount === 13) return { principaleCount: 8, consolanteCount: 5, normalizedRanking: true, consolanteMode: 'championship', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 2), consolantePoolNames: [CONSOLANTE_POOL_NAMES[0]], directPrincipalSemis: true };
  if (teamCount >= 13) return { principaleCount: 8, consolanteCount: Math.max(0, teamCount - 8), normalizedRanking: true, consolanteMode: 'pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: CONSOLANTE_POOL_NAMES.slice(0, 2), directPrincipalSemis: false };
  return { principaleCount: 0, consolanteCount: 0, normalizedRanking: false, consolanteMode: 'pools', principalePoolNames: PRINCIPALE_POOL_NAMES.slice(0, 4), consolantePoolNames: CONSOLANTE_POOL_NAMES.slice(0, 2), directPrincipalSemis: false };
}
const CHAMPIONSHIP_ALLER_POOL_NAME = 'Championnat Aller';
const CHAMPIONSHIP_RETOUR_POOL_NAME = 'Championnat Retour';
const SMALL_QUARTER_PAIRINGS = [[1, 8], [2, 7], [3, 6], [4, 5]];

const RANDOM_TEAM_NAMES = ['Atlas', 'Blitz', 'Comete', 'Cyclone', 'Dynamo', 'Eclair', 'Falcon', 'Fusion', 'Galaxy', 'Helios', 'Horizon', 'Impact', 'Jaguar', 'Krypton', 'Laser', 'Meteor', 'Mirage', 'Nova', 'Orion', 'Phenix', 'Pixel', 'Quartz', 'Raptor', 'Rocket', 'Shadow', 'Silver', 'Solstice', 'Sonic', 'Storm', 'Titan', 'Turbo', 'Vega', 'Vector', 'Volt', 'Zenith', 'Aigle', 'Boreal', 'Cobalt', 'Cosmos', 'Dragon', 'Echo', 'Foudre', 'Globe', 'Inferno', 'Iris', 'Lynx', 'Magma', 'Nimbus', 'Onyx', 'Pegase', 'Pulsar', 'Ruby', 'Saphir', 'Saturne', 'Spectrum', 'Tornado', 'Vortex', 'Ymir', 'Zephyr'];

function randomInt(min, max) {
  const safeMin = Math.ceil(Math.min(min, max));
  const safeMax = Math.floor(Math.max(min, max));
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}


function clampCourtCount(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_COURT_COUNT;
  return Math.max(MIN_COURT_COUNT, Math.min(MAX_COURT_COUNT, Math.round(numeric)));
}

function getCourtNumbers(count = DEFAULT_COURT_COUNT) {
  return Array.from({ length: clampCourtCount(count) }, (_, index) => index + 1);
}


function getPrincipalQuarterCourts(count = CURRENT_COURT_COUNT) {
  const courtCount = clampCourtCount(count);
  if (courtCount >= 6) return [1, 2, 3];
  if (courtCount === 5) return [1, 2, 3];
  if (courtCount === 4) return [1, 2];
  return getCourtNumbers(courtCount);
}

function splitCourtsByStage(count = DEFAULT_COURT_COUNT) {
  const courts = getCourtNumbers(count);
  const safeCount = courts.length;

  if (safeCount <= 3) {
    return {
      all: courts,
      principale: courts,
      consolante: courts,
    };
  }

  if (safeCount === 4) {
    return {
      all: courts,
      principale: [1, 2],
      consolante: [3, 4],
    };
  }

  if (safeCount === 5) {
    return {
      all: courts,
      principale: [1, 2, 3],
      consolante: [4, 5],
    };
  }

  return {
    all: courts,
    principale: [1, 2, 3],
    consolante: [4, 5, 6],
  };
}

function getMaxActiveCourts(count = CURRENT_COURT_COUNT) {
  return getCourtNumbers(count).length;
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
  const winningScore = Number(rule?.winningScore) || 21;
  return winningScore >= 21 ? 20 : 15;
}

function getCurrentClockMinutes() {
  const now = new Date();
  return (now.getHours() * 60) + now.getMinutes();
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
  if (!Array.isArray(inputTeams) || inputTeams.length === 0) return defaultTeams(18);
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
    || /quart|demi|finale|petite finale|petite final|principale|principal/i.test(group);
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
    principalEighths: dedupeMatches(Array.isArray(input?.principalEighths) ? input.principalEighths : []),
    principalQuarters: dedupeMatches(Array.isArray(input?.principalQuarters) ? input.principalQuarters : []),
    principalSemis: dedupeMatches(Array.isArray(input?.principalSemis) ? input.principalSemis : []),
    principalFinals: dedupeMatches(Array.isArray(input?.principalFinals) ? input.principalFinals : []),
    consolanteEighths: dedupeMatches(Array.isArray(input?.consolanteEighths) ? input.consolanteEighths : []),
    consolanteQuarters: dedupeMatches(Array.isArray(input?.consolanteQuarters) ? input.consolanteQuarters : []),
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


function matchHasUndefinedTeams(match) {
  const a = String(match?.teamAId || '').trim().toLowerCase();
  const b = String(match?.teamBId || '').trim().toLowerCase();
  return !a || !b || a === 'a definir' || b === 'a definir' || a === 'à définir' || b === 'à définir';
}

function stageContainsUndefinedTeams(matches) {
  const safe = Array.isArray(matches) ? matches : [];
  return safe.some(matchHasUndefinedTeams);
}

function areAllMatchesValidated(matches, phaseRules = PHASE_RULES_DEFAULT) {
  const safe = Array.isArray(matches) ? matches : [];
  return safe.length > 0 && safe.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
}

function sanitizePrematureFutureStages(parsed) {
  const brassage1Finished = areAllMatchesValidated(parsed?.brassage1?.matches || [], PHASE_RULES_DEFAULT);

  if (!brassage1Finished) {
    if (stageContainsUndefinedTeams(parsed?.brassage2?.matches || [])) {
      parsed.brassage2 = normalizeLeagueState({ pools: [], matches: [] });
    }
    if (
      stageContainsUndefinedTeams(parsed?.mainStage?.principaleMatches || []) ||
      stageContainsUndefinedTeams(parsed?.mainStage?.consolanteMatches || [])
    ) {
      parsed.mainStage = normalizeMainStageState({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    }
    if (
      stageContainsUndefinedTeams(parsed?.knockout?.principalQuarters || []) ||
      stageContainsUndefinedTeams(parsed?.knockout?.principalSemis || []) ||
      stageContainsUndefinedTeams(parsed?.knockout?.principalFinals || []) ||
      stageContainsUndefinedTeams(parsed?.knockout?.consolanteQuarters || []) ||
      stageContainsUndefinedTeams(parsed?.knockout?.consolanteSemis || []) ||
      stageContainsUndefinedTeams(parsed?.knockout?.consolanteFinals || [])
    ) {
      parsed.knockout = normalizeKnockoutState({
        principalQuarters: [], principalSemis: [], principalFinals: [],
        consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [],
      });
    }
  }
  return parsed;
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
    payload?.knockout?.consolanteQuarters,
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
    parsed.settings = { ...(parsed.settings || {}), courtCount: clampCourtCount(parsed?.settings?.courtCount ?? DEFAULT_COURT_COUNT) };
    return sanitizePrematureFutureStages(parsed);
  } catch {
    return null;
  }
}

function defaultTeams(defaultLevelMap = null, fallbackLevel = 'D') {
  const defaults = Array.isArray(defaultLevelMap) ? defaultLevelMap : ['N', 'N', 'PN', 'PN', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'L', 'L', 'L', 'L', 'PN', 'R', 'D'];
  return Array.from({ length: defaults.length || DEFAULT_TEAM_COUNT }, (_, index) => ({
    id: uid('team'),
    name: `Équipe ${index + 1}`,
    level: normalizeLevelValue(defaults[index], fallbackLevel),
    club: '',
    contact: '',
  }));
}

function defaultTeamsAllLevelL() {
  return defaultTeams(Array.from({ length: DEFAULT_TEAM_COUNT }, () => 'L'), 'L');
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
  const teamIds = (Array.isArray(orderedTeams) ? orderedTeams : [])
    .map((team) => team?.id)
    .filter(Boolean);

  return createPools(teamIds, names);
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
  const orderedByPool = Array.from(
    { length: poolCount },
    (_, index) => getOrderedPoolTeamIds(safeSourcePools[index], standings)
  );

  const rankedTeamIds = [];
  orderedByPool.forEach((teamIds) => {
    teamIds.forEach((teamId) => {
      if (teamId && !rankedTeamIds.includes(teamId)) {
        rankedTeamIds.push(teamId);
      }
    });
  });

  return createPools(rankedTeamIds, names);
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


function buildConsolanteQuarterMatchesFromRanking(rankedIds) {
  const seeds = createSmallBracketSeeds(rankedIds);
  return SMALL_QUARTER_PAIRINGS.map(([seedA, seedB], index) => {
    const teamAId = seeds[seedA] || null;
    const teamBId = seeds[seedB] || null;
    return teamAId && teamBId ? makeKnockoutMatch('Tableau consolante', `Quart ${index + 1}`, teamAId, teamBId) : null;
  }).filter(Boolean);
}

function buildConsolanteSemisFromQuarters(rankedIds, quarterMatches, phaseRules) {
  return [
    makeKnockoutMatch('Tableau consolante', 'Demi 1', resolveQuarterSlotWinner(rankedIds, quarterMatches, 0, phaseRules), resolveQuarterSlotWinner(rankedIds, quarterMatches, 1, phaseRules)),
    makeKnockoutMatch('Tableau consolante', 'Demi 2', resolveQuarterSlotWinner(rankedIds, quarterMatches, 2, phaseRules), resolveQuarterSlotWinner(rankedIds, quarterMatches, 3, phaseRules)),
  ].filter((match) => match.teamAId && match.teamBId);
}


function buildSeededKnockoutMatchesFromRanking(rankedIds, phaseLabel, roundLabel = 'Huitième') {
  const safeIds = Array.isArray(rankedIds) ? rankedIds.filter(Boolean) : [];
  const count = safeIds.length;
  const matchCount = Math.floor(count / 2);
  return Array.from({ length: matchCount }, (_, index) => {
    const teamAId = safeIds[index] || null;
    const teamBId = safeIds[count - 1 - index] || null;
    return teamAId && teamBId ? makeKnockoutMatch(phaseLabel, `${roundLabel} ${index + 1}`, teamAId, teamBId) : null;
  }).filter(Boolean);
}
function buildEighthMatchesFromRanking(rankedIds, phaseLabel = 'Tableau principal') {
  return buildSeededKnockoutMatchesFromRanking((Array.isArray(rankedIds) ? rankedIds : []).slice(0, 16), phaseLabel, 'Huitième');
}
function buildNextKnockoutRoundFromWinnerRanking(matches, phaseRules, teamMap, phaseLabel, roundLabel) {
  const safeMatches = Array.isArray(matches) ? matches.filter(Boolean) : [];
  const winners = safeMatches.map((match) => getWinnerLoser(match, phaseRules).winner).filter(Boolean);
  const ranking = computeRanking(winners, safeMatches, teamMap || new Map(), phaseRules, { normalizeByMatches: false }).map((row) => row.teamId).filter(Boolean);
  return buildSeededKnockoutMatchesFromRanking(ranking, phaseLabel, roundLabel);
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
    makeKnockoutMatch('Demi-finale', 'Demi 1', resolveQuarterSlotWinner(rankedIds, quarterMatches, 0, phaseRules), resolveQuarterSlotWinner(rankedIds, quarterMatches, 3, phaseRules)),
    makeKnockoutMatch('Demi-finale', 'Demi 2', resolveQuarterSlotWinner(rankedIds, quarterMatches, 1, phaseRules), resolveQuarterSlotWinner(rankedIds, quarterMatches, 2, phaseRules)),
  ].filter((match) => match.teamAId && match.teamBId);
}

function assignBalancedReferees(matches, teamIds) {
  const safeTeamIds = Array.isArray(teamIds) ? teamIds.filter(Boolean) : [];
  if (!Array.isArray(matches) || !matches.length || safeTeamIds.length <= 3) return matches;

  const refereeCounts = new Map(safeTeamIds.map((teamId) => [teamId, 0]));
  const lastAssignedIndex = new Map(safeTeamIds.map((teamId) => [teamId, -1]));

  return matches.map((match, matchIndex) => {
    const candidateIds = safeTeamIds.filter((teamId) => teamId !== match.teamAId && teamId !== match.teamBId);
    if (!candidateIds.length) return match;

    const refereeTeamId = candidateIds
      .slice()
      .sort((teamIdA, teamIdB) => {
        const countDiff = (refereeCounts.get(teamIdA) || 0) - (refereeCounts.get(teamIdB) || 0);
        if (countDiff !== 0) return countDiff;
        const gapA = matchIndex - (lastAssignedIndex.get(teamIdA) ?? -1);
        const gapB = matchIndex - (lastAssignedIndex.get(teamIdB) ?? -1);
        if (gapA !== gapB) return gapB - gapA;
        return safeTeamIds.indexOf(teamIdA) - safeTeamIds.indexOf(teamIdB);
      })[0];

    refereeCounts.set(refereeTeamId, (refereeCounts.get(refereeTeamId) || 0) + 1);
    lastAssignedIndex.set(refereeTeamId, matchIndex);

    return {
      ...match,
      refereeTeamId,
    };
  });
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

  return assignBalancedReferees(rounds, teamIds);
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
  const safePreferredCourts = Array.isArray(preferredCourts) && preferredCourts.length ? preferredCourts : getCourtNumbers();
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
  const safeCourts = Array.isArray(courts) && courts.length ? courts : getCourtNumbers(CURRENT_COURT_COUNT);
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



function buildWaitingTimeRowsForPhase(pools, matches, resolveTeam) {
  const safePools = Array.isArray(pools) ? pools : [];
  const safeMatches = (Array.isArray(matches) ? matches : [])
    .filter(Boolean)
    .slice()
    .sort((a, b) => {
      if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
      return (a.court || 0) - (b.court || 0);
    });

  const orderedSlots = [...new Set(safeMatches.map((match) => Number(match?.slot || 0)).filter((slot) => slot > 0))].sort((a, b) => a - b);
  const localSlotIndex = new Map(orderedSlots.map((slot, index) => [slot, index + 1]));

  const poolNameByTeamId = new Map();
  safePools.forEach((pool) => {
    const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [];
    teamIds.forEach((teamId) => {
      poolNameByTeamId.set(teamId, pool?.name || '');
    });
  });

  const rowsByTeam = new Map();

  const ensureRow = (teamId, fallbackName = '') => {
    if (!teamId) return null;
    if (!rowsByTeam.has(teamId)) {
      const team = typeof resolveTeam === 'function' ? resolveTeam(teamId) : null;
      rowsByTeam.set(teamId, {
        teamId,
        teamName: team?.name || fallbackName || 'À définir',
        poolName: poolNameByTeamId.get(teamId) || '',
        slots: [],
      });
    }
    return rowsByTeam.get(teamId);
  };

  safeMatches.forEach((match) => {
    const slot = Number(match?.slot || 0);
    const normalizedSlot = localSlotIndex.get(slot) || slot;
    const teamARow = ensureRow(match?.teamAId, match?.teamAName || '');
    const teamBRow = ensureRow(match?.teamBId, match?.teamBName || '');
    if (teamARow) teamARow.slots.push(normalizedSlot);
    if (teamBRow) teamBRow.slots.push(normalizedSlot);
  });

  return Array.from(rowsByTeam.values())
    .map((row) => {
      const slots = row.slots.slice().sort((a, b) => a - b);
      const waits = slots.map((slot, index) => {
        if (index === 0) {
          if (slot <= 1) return "Joue le premier match (M1)";
          const beforeCount = Math.max(0, slot - 1);
          return `${beforeCount} match${beforeCount > 1 ? 's' : ''} avant de jouer le premier match`;
        }
        const previousSlot = slots[index - 1];
        const gap = Math.max(0, slot - previousSlot - 1);
        if (gap === 0) return `Aucune attente entre M${index} et M${index + 1}`;
        return `${gap} match${gap > 1 ? 's' : ''} d'attente entre M${index} et M${index + 1}`;
      });

      return {
        ...row,
        slots,
        waits,
      };
    })
    .sort((a, b) => {
      if ((a.poolName || '') !== (b.poolName || '')) return String(a.poolName || '').localeCompare(String(b.poolName || ''));
      return String(a.teamName || '').localeCompare(String(b.teamName || ''));
    });
}


function scheduleBrassageMatches(pools, phase, startSlot) {
  const safePools = Array.isArray(pools) ? pools.filter(Boolean) : [];
  if (!safePools.length) return [];

  const courts = getCourtNumbers(CURRENT_COURT_COUNT);
  const descriptors = safePools
    .filter((pool) => Array.isArray(pool?.teamIds) && pool.teamIds.filter(Boolean).length >= 2)
    .map((pool, originalIndex) => ({
      pool,
      originalIndex,
      matches: createThreeTeamPoolMatches(pool, phase),
      nextIndex: 0,
      lastSlot: null,
      teamIds: Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [],
      teamCount: Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean).length : 0,
    }));

  if (!descriptors.length) return [];

  const teamStats = new Map();
  descriptors.forEach((entry) => {
    entry.teamIds.forEach((teamId) => {
      if (!teamStats.has(teamId)) {
        teamStats.set(teamId, {
          firstSlot: null,
          lastSlot: null,
          playCount: 0,
          refereeCount: 0,
        });
      }
    });
  });

  const countNeverPlayed = (entry) => entry.teamIds.reduce((sum, teamId) => {
    const stat = teamStats.get(teamId);
    return sum + (stat && stat.firstSlot === null ? 1 : 0);
  }, 0);

  const getWaitPenalty = (stat, slot) => {
    if (!stat) return 0;

    if (stat.firstSlot === null) {
      const beforeFirst = Math.max(0, slot - startSlot - 2);
      if (beforeFirst >= 5) return 20000 + ((beforeFirst - 5) * 6000);
      return beforeFirst * 500;
    }

    const gap = slot - stat.lastSlot - 1;
    if (gap < 0) return 50000;
    if (gap === 0) return 1800;
    if (gap === 1) return 180;
    if (gap === 2) return 30;
    if (gap === 3) return 90;
    if (gap === 4) return 250;
    if (gap === 5) return 1200;
    return 12000 + ((gap - 5) * 4000);
  };

  const getUrgency = (entry, slot) => {
    const neverPlayedCount = countNeverPlayed(entry);
    const worstFirst = entry.teamIds.reduce((maxValue, teamId) => {
      const stat = teamStats.get(teamId);
      const value = stat?.firstSlot === null ? slot : stat.firstSlot;
      return Math.max(maxValue, value);
    }, 0);
    const idleGap = entry.lastSlot === null ? 999 : (slot - entry.lastSlot);
    return { neverPlayedCount, worstFirst, idleGap };
  };

  const computeCandidateScore = (entry, match, slot) => {
    const teamAStat = teamStats.get(match.teamAId);
    const teamBStat = teamStats.get(match.teamBId);
    const neverPlayedCount = countNeverPlayed(entry);
    const poolIdleGap = entry.lastSlot === null ? 999 : (slot - entry.lastSlot);

    const teamPenalty = getWaitPenalty(teamAStat, slot) + getWaitPenalty(teamBStat, slot);
    const poolFirstPenalty = neverPlayedCount > 0 ? Math.max(0, slot - startSlot - 1) * 260 * neverPlayedCount : 0;
    const poolGapPenalty = entry.lastSlot === null ? 0 : Math.max(0, poolIdleGap - 2) * 170;
    const loadPenalty = ((teamAStat?.playCount || 0) + (teamBStat?.playCount || 0)) * 8 + (entry.nextIndex * 6);
    const biggerPoolBonus = -(entry.teamCount || 0) * 4;

    return teamPenalty + poolFirstPenalty + poolGapPenalty + loadPenalty + biggerPoolBonus;
  };

  const scheduled = [];
  let slot = startSlot + 1;

  while (descriptors.some((entry) => entry.nextIndex < entry.matches.length)) {
    const usedPools = new Set();
    const usedTeams = new Set();
    let scheduledThisSlot = 0;

    const orderedDescriptors = descriptors
      .filter((entry) => entry.nextIndex < entry.matches.length)
      .map((entry) => ({ entry, urgency: getUrgency(entry, slot) }))
      .sort((a, b) => {
        if (a.urgency.neverPlayedCount !== b.urgency.neverPlayedCount) {
          return b.urgency.neverPlayedCount - a.urgency.neverPlayedCount;
        }
        if (a.urgency.worstFirst !== b.urgency.worstFirst) {
          return b.urgency.worstFirst - a.urgency.worstFirst;
        }
        if (a.urgency.idleGap !== b.urgency.idleGap) {
          return b.urgency.idleGap - a.urgency.idleGap;
        }
        if ((a.entry.teamCount || 0) !== (b.entry.teamCount || 0)) {
          return (b.entry.teamCount || 0) - (a.entry.teamCount || 0);
        }
        return (a.entry.originalIndex || 0) - (b.entry.originalIndex || 0);
      });

    courts.forEach((court) => {
      const candidates = orderedDescriptors
        .map(({ entry }) => {
          if (usedPools.has(entry.pool.id)) return null;
          const match = entry.matches[entry.nextIndex];
          if (!match) return null;
          if (usedTeams.has(match.teamAId) || usedTeams.has(match.teamBId)) return null;
          return { entry, match, score: computeCandidateScore(entry, match, slot) };
        })
        .filter(Boolean)
        .sort((a, b) => {
          const aNever = countNeverPlayed(a.entry);
          const bNever = countNeverPlayed(b.entry);
          if (aNever !== bNever) return bNever - aNever;
          if (a.score !== b.score) return a.score - b.score;
          if ((a.entry.teamCount || 0) !== (b.entry.teamCount || 0)) {
            return (b.entry.teamCount || 0) - (a.entry.teamCount || 0);
          }
          return (a.entry.originalIndex || 0) - (b.entry.originalIndex || 0);
        });

      const chosen = candidates[0];
      if (!chosen) return;

      const { entry, match } = chosen;
      entry.nextIndex += 1;
      entry.lastSlot = slot;

      usedPools.add(entry.pool.id);
      usedTeams.add(match.teamAId);
      usedTeams.add(match.teamBId);

      const teamAStat = teamStats.get(match.teamAId);
      const teamBStat = teamStats.get(match.teamBId);

      if (teamAStat) {
        if (teamAStat.firstSlot === null) teamAStat.firstSlot = slot;
        teamAStat.lastSlot = slot;
        teamAStat.playCount += 1;
      }
      if (teamBStat) {
        if (teamBStat.firstSlot === null) teamBStat.firstSlot = slot;
        teamBStat.lastSlot = slot;
        teamBStat.playCount += 1;
      }

      if (match.refereeTeamId && teamStats.has(match.refereeTeamId)) {
        const refereeStat = teamStats.get(match.refereeTeamId);
        refereeStat.refereeCount += 1;
      }

      scheduled.push({
        ...match,
        court,
        slot,
        time: '',
        validatedAt: match.validatedAt || null,
      });
      scheduledThisSlot += 1;
    });

    if (!scheduledThisSlot) {
      const fallback = orderedDescriptors[0]?.entry;
      if (!fallback) break;
      const match = fallback.matches[fallback.nextIndex];
      if (!match) break;

      fallback.nextIndex += 1;
      fallback.lastSlot = slot;

      const teamAStat = teamStats.get(match.teamAId);
      const teamBStat = teamStats.get(match.teamBId);

      if (teamAStat) {
        if (teamAStat.firstSlot === null) teamAStat.firstSlot = slot;
        teamAStat.lastSlot = slot;
        teamAStat.playCount += 1;
      }
      if (teamBStat) {
        if (teamBStat.firstSlot === null) teamBStat.firstSlot = slot;
        teamBStat.lastSlot = slot;
        teamBStat.playCount += 1;
      }

      scheduled.push({
        ...match,
        court: 1,
        slot,
        time: '',
        validatedAt: match.validatedAt || null,
      });
    }

    slot += 1;
  }

  return scheduled.sort((a, b) => {
    if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
    return (a.court || 0) - (b.court || 0);
  });
}



function scheduleMainStageMatches(principalePools, consolantePools, startSlot) {
  const safePrincipalePools = Array.isArray(principalePools) ? principalePools.filter(Boolean) : [];
  const safeConsolantePools = Array.isArray(consolantePools) ? consolantePools.filter(Boolean) : [];
  const stageCourts = splitCourtsByStage(CURRENT_COURT_COUNT);

  const principaleDescriptors = buildPoolMatchDescriptors(safePrincipalePools, 'Principale', stageCourts.principale);
  const consolanteDescriptors = buildPoolMatchDescriptors(safeConsolantePools, 'Consolante', stageCourts.consolante);

  const principaleScheduled = schedulePoolDescriptorsOnCourts(principaleDescriptors, stageCourts.principale, startSlot);
  const consolanteScheduled = schedulePoolDescriptorsOnCourts(consolanteDescriptors, stageCourts.consolante, startSlot);

  return [...principaleScheduled, ...consolanteScheduled].sort((a, b) => {
    if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
    return (a.court || 0) - (b.court || 0);
  });
}

function assignSchedule(matches, startSlot) {
  return matches.map((match, index) => {
    const zeroBasedSlot = startSlot + Math.floor(index / getCourtNumbers(CURRENT_COURT_COUNT).length);
    return {
      ...match,
      court: getCourtNumbers(CURRENT_COURT_COUNT)[index % getCourtNumbers(CURRENT_COURT_COUNT).length],
      slot: zeroBasedSlot + 1,
      time: '',
      validatedAt: match.validatedAt || null,
    };
  });
}



function rebalancePrincipalQuarterCourts(matches, count = CURRENT_COURT_COUNT) {
  const safeMatches = Array.isArray(matches) ? matches.map((match) => ({ ...match })) : [];
  const principalCourts = getPrincipalQuarterCourts(count);

  if (safeMatches.length === 4 && principalCourts.length >= 3) {
    const orderedCourts = [principalCourts[0], principalCourts[1], principalCourts[2], principalCourts[0]];
    return safeMatches.map((match, index) => ({
      ...match,
      court: orderedCourts[index],
      slot: index < 3 ? 1 : 2,
      time: '',
      validatedAt: match.validatedAt || null,
    }));
  }

  return safeMatches;
}


function forcePrincipalQuarterThreeCourts(matches, count = CURRENT_COURT_COUNT) {
  const safeMatches = Array.isArray(matches) ? matches.map((match) => ({ ...match })) : [];
  const courtCount = clampCourtCount(count);
  if (courtCount < 6 || safeMatches.length != 4) {
    return safeMatches;
  }
  const orderedCourts = [1, 2, 3, 1];
  return safeMatches.map((match, index) => ({
    ...match,
    court: orderedCourts[index],
    slot: index < 3 ? 1 : 2,
    time: '',
    validatedAt: match.validatedAt || null,
  }));
}

function assignScheduleWithCourts(matches, startSlot, courts) {
  const safeCourts = Array.isArray(courts) && courts.length ? courts : getCourtNumbers(CURRENT_COURT_COUNT);
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
  return Math.ceil(matchCount / getCourtNumbers(CURRENT_COURT_COUNT).length);
}

function stageSlotCountForCourts(matchCount, courts) {
  const safeCourtCount = Array.isArray(courts) && courts.length ? courts.length : getCourtNumbers(CURRENT_COURT_COUNT).length;
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



function makeArbitrageRequestMatch(match) {
  return {
    ...match,
    status: ARBITRAGE_REQUEST_STATUS,
    arbitrageRequestStatus: 'pending',
    arbitrageRequestedAt: Date.now(),
    refereeStartedAt: null,
    refereeInProgress: false,
    matchInProgress: false,
  };
}

function isArbitrageRequestPending(match) {
  return match?.arbitrageRequestStatus === 'pending' || match?.status === ARBITRAGE_REQUEST_STATUS;
}

function isArbitrageRequestExpired(match, now = Date.now()) {
  if (!isArbitrageRequestPending(match)) return false;
  const requestedAt = Number(match?.arbitrageRequestedAt || 0);
  return requestedAt > 0 && now - requestedAt >= ARBITRAGE_REQUEST_TIMEOUT_MS;
}

function sanitizeExpiredArbitrageRequest(match, now = Date.now()) {
  if (!isArbitrageRequestExpired(match, now)) return match;
  return {
    ...match,
    status: 'A saisir',
    arbitrageRequestStatus: null,
    arbitrageRequestedAt: null,
    refereeStartedAt: null,
    refereeInProgress: false,
    matchInProgress: false,
  };
}

function isScoreInputLockedByArbitrageRequest(match) {
  return isArbitrageRequestPending(match);
}

function getMatchStatusLabel(match, phaseRules) {
  if (isArbitrageRequestPending(match)) return ARBITRAGE_REQUEST_STATUS;

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

function ensureMatchArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function buildDirectRankingPodiumFallback(pools, poolMatches, semiMatches, finalMatches, overallRanking, phaseRules) {
  const safePools = Array.isArray(pools) ? pools.filter(Boolean) : [];
  const safePoolMatches = Array.isArray(poolMatches) ? poolMatches.filter(Boolean) : [];
  const safeSemiMatches = Array.isArray(semiMatches) ? semiMatches.filter(Boolean) : [];
  const safeFinalMatches = Array.isArray(finalMatches) ? finalMatches.filter(Boolean) : [];
  const safeRanking = Array.isArray(overallRanking) ? overallRanking.filter(Boolean) : [];

  if (!safePools.length || !safePoolMatches.length || safeSemiMatches.length || safeFinalMatches.length) return [];

  const allPoolMatchesValidated = safePoolMatches.length > 0 && safePoolMatches.every((match) => isMatchResultValid(match, phaseRules));
  if (!allPoolMatchesValidated) return [];

  return safeRanking
    .map((row) => ({ ...row, teamId: row?.teamId || null }))
    .filter((row) => row.teamId)
    .slice(0, 3);
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
  const courtAvailability = new Map(getCourtNumbers(CURRENT_COURT_COUNT).map((court) => [court, stageStartMinutes]));

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
  const baseStart = parseTimeToMinutes(startTime);
  let stageStart = baseStart;
  const mergedMap = {};

  stageGroups.forEach((group) => {
    if (!group.length) return;
    const result = computeDynamicStageSchedule(group, stageStart, phaseRules);
    Object.assign(mergedMap, result.scheduleMap);
    stageStart = result.stageEnd;
  });

  const totalDuration = Math.max(0, stageStart - baseStart);
  const durationLabel = formatDurationLabel(totalDuration);

  return {
    scheduleMap: mergedMap,
    estimatedEndMinutes: stageStart,
    estimatedEndText: durationLabel ? `${durationLabel}` : minutesToTime(stageStart),
  };
}

function formatDurationLabel(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return '';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${String(minutes).padStart(2, '0')}`;
}

function getEstimatedEndTextForMatches(matches, scheduleMap, emptyText = 'À générer', phaseRules = {}) {
  const safeMatches = dedupeMatches(Array.isArray(matches) ? matches : []).filter(Boolean);
  if (!safeMatches.length) return emptyText;

  const stageDuration = computeDynamicStageSchedule(safeMatches, 0, phaseRules).stageEnd;
  if (!Number.isFinite(stageDuration)) return emptyText;

  return formatDurationLabel(stageDuration) || emptyText;
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
    if (b.avgTournamentPoints !== a.avgTournamentPoints) return b.avgTournamentPoints - a.avgTournamentPoints;
    if (b.avgPointDiff !== a.avgPointDiff) return b.avgPointDiff - a.avgPointDiff;
    if (b.avgPointsFor !== a.avgPointsFor) return b.avgPointsFor - a.avgPointsFor;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints;
  } else if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints;

  if (b.wins !== a.wins) return b.wins - a.wins;
  if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
  if (b.pointsFor !== a.pointsFor) return b.pointsFor - a.pointsFor;
  if ((a.initialOrder ?? 0) !== (b.initialOrder ?? 0)) return (a.initialOrder ?? 0) - (b.initialOrder ?? 0);
  return a.teamName.localeCompare(b.teamName, 'fr');
}

function formatStandingPoints(row, normalizeByMatches = false) {
  if (!row) return '0';
  if (!normalizeByMatches) return String(row.tournamentPoints ?? 0);
  const value = Number.isFinite(row.avgTournamentPoints) ? row.avgTournamentPoints : 0;
  return value.toFixed(2).replace('.', ',');
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
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    if (anchor.parentNode) {
      anchor.parentNode.removeChild(anchor);
    }
    URL.revokeObjectURL(url);
  }, 150);
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
  const refereeTeamId = match?.refereeTeamId || (Array.isArray(poolTeamIds)
    ? poolTeamIds.find((teamId) => teamId !== match?.teamAId && teamId !== match?.teamBId) || null
    : null);
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

function printQrCode(url, title = 'QR Code') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(url)}`;
  const printWindow = window.open('', '_blank', 'width=700,height=700');
  if (!printWindow) return;
  const safeTitle = escapeHtml(title);
  printWindow.document.write(`<!doctype html><html><head><title>${safeTitle}</title><style>
    @page { margin: 1cm; }
    html,body{margin:0;padding:0;background:#fff;font-family:Arial,sans-serif}
    .page{min-height:100vh;display:flex;align-items:center;justify-content:center}
    .qr-wrap{width:5cm;height:5cm;display:flex;align-items:center;justify-content:center}
    .qr-wrap img{width:5cm;height:5cm;display:block;object-fit:contain}
  </style></head><body><div class="page"><div class="qr-wrap"><img src="${qrSrc}" alt="${safeTitle}" /></div></div><script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},150);});</script></body></html>`);
  printWindow.document.close();
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
    pendingResultSentAt: null,
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

function isRefereePendingResultReady(match, phaseRules) {
  if (!match) return false;
  const snapshot = getPendingMatchSnapshot(match);
  return isMatchResultValid(snapshot, phaseRules);
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

function buildTeamsPhaseExplanation(teamCount, { isSmallTournamentMode, shouldSkipBrassage2, hasConsolante, mainStageDistribution }) {
  const levelText = 'N = National, PN = Pré-National, R = Régional, D = Départementale, L = Loisir.';
  if (!teamCount) return `${levelText} Ajoutez des équipes pour afficher automatiquement le déroulé du tournoi.`;

  if (isSmallTournamentMode) {
    if (teamCount === 9 || teamCount === 10) {
      return `${levelText} Avec ${teamCount} équipes, méthode championnat : une seule poule de ${teamCount} équipes, Championnat Aller puis Championnat Retour. À l’issue du Championnat Retour, le classement cumulé Aller + Retour qualifie les 8 meilleures équipes pour les quarts : 1er contre 8e, 2e contre 7e, 3e contre 6e et 4e contre 5e. Les demi-finales opposent le vainqueur du quart 1 au vainqueur du quart 4, puis le vainqueur du quart 2 au vainqueur du quart 3. Les gagnants jouent la finale et les perdants la petite finale.`;
    }
    const finalStageText = teamCount <= 2
      ? 'pas de phase finale supplémentaire : le classement du championnat désigne directement le vainqueur'
      : teamCount <= 4
        ? 'demi-finales puis finale et petite finale'
        : 'quarts de finale, demi-finales puis finale et petite finale';
    return `${levelText} Avec ${teamCount} équipes, le tournoi se joue en championnat aller${teamCount >= 5 ? ' puis retour' : ''}. À l’issue du championnat, le classement général qualifie les équipes pour ${finalStageText}.`;
  }

  const phases = ['Brassage 1'];
  if (!shouldSkipBrassage2) phases.push('Brassage 2');
  phases.push('Principale');
  if (hasConsolante) phases.push('Consolante');

  let finalsText = 'tableau final adapté automatiquement';
  if (mainStageDistribution?.directPrincipalSemis) {
    finalsText = hasConsolante
      ? 'demi-finales principale et demi-finales consolante, puis finales'
      : 'demi-finales puis finale et petite finale';
  } else if (mainStageDistribution?.topCount >= 8) {
    finalsText = hasConsolante
      ? 'quarts de finale principale, demi-finales consolante, puis finales'
      : 'quarts de finale puis demi-finales, finale et petite finale';
  }

  return `${levelText} Avec ${teamCount} équipes, les phases prévues sont : ${phases.join(' → ')}. Les brassages sont répartis automatiquement en privilégiant des poules de 3 équipes, puis des poules de 4 si nécessaire afin de limiter la durée du tournoi sur 3 terrains ; les poules de 5 sont évitées. Le Brassage 1 est équilibré en serpent à partir des niveaux saisis, puis le Brassage 2 est recomposé en serpent selon le classement cumulé avant d’alimenter ${finalsText}.`;
}




function getCourtAwareFlowSuffix(teamCount, courtCount = CURRENT_COURT_COUNT) {
  const safeCourtCount = clampCourtCount(courtCount);
  if (safeCourtCount <= 3) {
    return " Avec 3 terrains, la planification privilégie la compacité et peut faire alterner Principale et Consolante sur les mêmes terrains selon les matchs restants.";
  }
  if (safeCourtCount === 4) {
    return " Avec 4 terrains, l'organisation privilégie si possible Principale sur les terrains 1-2 et Consolante sur les terrains 3-4.";
  }
  if (safeCourtCount === 5) {
    return " Avec 5 terrains, l'organisation privilégie si possible Principale sur les terrains 1-2-3 et Consolante sur les terrains 4-5.";
  }
  return " Avec 6 terrains, l'organisation privilégie si possible Principale sur les terrains 1-2-3 et Consolante sur les terrains 4-5-6.";
}

function getCourtAwareSaveModeFunctionnements(buildBaseItems, courtCount = CURRENT_COURT_COUNT) {
  return buildBaseItems().map((item) => {
    const match = String(item).match(/^Pour\s+(\d+)\s+équipes\s*:/i);
    if (!match) return item;
    return `${item}${getCourtAwareFlowSuffix(Number(match[1]), courtCount)}`;
  });
}

function getSaveModeExplanationTeamCount(item) {
  const match = String(item || '').match(/^Pour\s+(\d+)\s+équipes?\s*:/i);
  return match ? Number(match[1]) : null;
}

function buildSaveModeFunctionnements() {
  return [
    "Pour 1 à 7 équipes : le tournoi se joue en championnat aller, puis en championnat retour à partir de 5 équipes. Le classement général qualifie ensuite les équipes pour une phase finale adaptée : pas de tableau final à 2 équipes, demi-finales à 3 ou 4 équipes, et quarts de finale à partir de 5 équipes.",

    "Pour 15 équipes : 2 phases de brassage. La première répartit les équipes selon le niveau saisi (N, PN, R, D et L). La seconde recompose les poules selon la moyenne de points cumulés. Les 12 meilleures équipes accèdent à la principale et les 3 autres à la consolante. La principale débute par 4 poules de 3 équipes ; les 2 premières de chaque poule forment les quarts de finale principale. Les gagnantes des quarts vont en demi-finales principale, puis en finale principale et petite finale principale. La consolante se joue en championnat à 3 équipes avec classement final direct.",
    "Pour 16 équipes : 2 phases de brassage. La première répartit les équipes selon le niveau saisi (N, PN, R, D et L). La seconde recompose les poules selon la moyenne de points cumulés. Les 12 meilleures équipes accèdent à la principale et les 4 autres à la consolante. La principale débute par 4 poules de 3 équipes ; les 2 premières de chaque poule forment les quarts de finale principale. Les gagnantes des quarts vont en demi-finales principale, puis en finale principale et petite finale principale. La consolante se joue d’abord en championnat à 4 équipes, puis en demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 17 équipes : 2 phases de brassage. La première répartit les équipes selon le niveau saisi (N, PN, R, D et L). La seconde recompose les poules selon la moyenne de points cumulés. Les 12 meilleures équipes accèdent à la principale et les 5 autres à la consolante. La principale débute par 4 poules de 3 équipes ; les 2 premières de chaque poule forment les quarts de finale principale. Les gagnantes des quarts vont en demi-finales principale, puis en finale principale et petite finale principale. La consolante se joue d’abord en championnat à 5 équipes avant les demi-finales, la finale consolante et la petite finale consolante.",
    "Pour 18 équipes : 2 phases de brassage. La première répartit les équipes selon le niveau saisi (N, PN, R, D et L). La seconde recompose les poules selon la moyenne de points cumulés. Les 12 meilleures équipes du classement vont en phase principale et les 6 autres en phase consolante. La principale débute par 4 poules de 3 équipes et les 2 premières de chaque poule forment les quarts de finale principale. Les gagnantes des quarts vont en demi-finales principale. Les gagnantes des demi-finales vont en finale principale et les perdantes en petite finale principale. La consolante débute par 2 poules de 3 équipes et les 2 meilleures équipes de chaque poule forment les demi-finales consolante. Les gagnantes des demi-finales consolante vont en finale consolante et les perdantes en petite finale consolante.",
    "Pour 19 équipes : même modèle que pour 18 équipes, avec 2 phases de brassage. Les équipes sont réparties en 4 poules de 4 à 5 équipes au brassage 1, puis en 4 poules de 4 à 5 équipes au brassage 2. À l’issue du classement cumulé, les 12 meilleures équipes vont en phase principale et les 6 suivantes en phase consolante. La 19e équipe n’est pas qualifiée pour la suite. La principale débute par 4 poules de 3 équipes, puis quarts de finale, demi-finales, finale principale et petite finale principale. La consolante débute par 1 poule de 3 équipes et 1 poule de 4 équipes, puis les 4 meilleures équipes du classement des 2 poules vont en demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 20 équipes : même modèle que pour 18 équipes, avec 2 phases de brassage. Pour réduire la durée du tournoi sur 3 terrains, les équipes sont réparties en 2 poules de 4 et 4 poules de 3 au brassage 1, puis selon le même format au brassage 2. Le Brassage 1 est équilibré en serpent à partir des niveaux saisis, puis le Brassage 2 est recomposé en serpent selon le classement cumulé. À l’issue du classement cumulé, les 12 meilleures équipes vont en phase principale et les 8 suivantes en phase consolante. La principale débute par 4 poules de 3 équipes, puis quarts de finale, demi-finales, finale principale et petite finale principale. La consolante débute par 2 poules de 4 équipes, puis le classement des deux poules consolante permet de distribuer les équipes dans les 4 matchs de quarts de finale consolante, puis demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 21 équipes : même modèle que pour 18 équipes, avec 2 phases de brassage. Pour réduire la durée du tournoi sur 3 terrains, les équipes sont réparties en 7 poules de 3 au brassage 1, puis selon le même format au brassage 2. Le Brassage 1 est équilibré en serpent à partir des niveaux saisis, puis le Brassage 2 est recomposé en serpent selon le classement cumulé. À l’issue du classement cumulé, les 12 meilleures équipes vont en phase principale et les 9 suivantes en phase consolante. La principale débute par 4 poules de 3 équipes, puis quarts de finale, demi-finales, finale principale et petite finale principale. La consolante débute par 3 poules de 3 équipes, puis les 8 meilleures équipes du classement général des trois poules iront en quarts de finale consolante, demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 22 équipes : même modèle que pour 18 équipes, avec 2 phases de brassage. Pour réduire la durée du tournoi sur 3 terrains, les équipes sont réparties en 1 poule de 4 et 6 poules de 3 au brassage 1, puis selon le même format au brassage 2. Le Brassage 1 est équilibré en serpent à partir des niveaux saisis, puis le Brassage 2 est recomposé en serpent selon le classement cumulé. À l’issue du classement cumulé, les 12 meilleures équipes vont en phase principale et les 10 suivantes en phase consolante. La principale débute par 4 poules de 3 équipes, puis quarts de finale, demi-finales, finale principale et petite finale principale. La consolante débute par 2 poules de 3 équipes et 1 poule de 4 équipes puis les 8 meilleures équipes du classement général des trois poules iront en quarts de finale consolante, puis demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 23 équipes : même modèle que pour 18 équipes, avec 2 phases de brassage. Pour réduire la durée du tournoi sur 3 terrains, les équipes sont réparties en 2 poules de 4 et 5 poules de 3 au brassage 1, puis selon le même format au brassage 2. Le Brassage 1 est équilibré en serpent à partir des niveaux saisis, puis le Brassage 2 est recomposé en serpent selon le classement cumulé. À l’issue du classement cumulé, les 12 meilleures équipes vont en phase principale et les 11 suivantes en phase consolante. La principale débute par 4 poules de 3 équipes, puis quarts de finale, demi-finales, finale principale et petite finale principale. La consolante débute par 2 poules de 4 et 1 poule de 3 équipes puis les 8 meilleures équipes du classement général des 3 poules iront en quarts de finale consolante, puis demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 24 équipes : même modèle que pour 18 équipes, avec 2 phases de brassage. Pour réduire la durée du tournoi sur 3 terrains, les équipes sont réparties en 8 poules de 3 au brassage 1, puis selon le même format au brassage 2. Le Brassage 1 est équilibré en serpent à partir des niveaux saisis, puis le Brassage 2 est recomposé en serpent selon le classement cumulé. À l’issue du classement cumulé, les 12 meilleures équipes vont en phase principale et les 12 dernières en phase consolante. La principale débute par 4 poules de 3 équipes, puis quarts de finale, demi-finales, finale principale et petite finale principale. La consolante débute par 4 poules de 3 équipes puis quarts de finale consolante, demi-finales consolante, finale consolante et petite finale consolante.",
    "Pour 36 équipes : 2 phases de brassage avec 12 poules de 3 équipes au brassage 1 puis 12 poules de 3 équipes au brassage 2, recomposées en serpent selon le classement. À l’issue du brassage 2, les 18 meilleures équipes vont en phase principale et les 18 autres en phase consolante. Chaque tableau est organisé en 6 poules de 3 équipes. Après cette phase, les 16 meilleures équipes de chaque tableau accèdent aux huitièmes de finale, puis quarts de finale, demi-finales, finale et petite finale.",
  ];
}


function PublicPodiumHighlightCard({ title, principalTeamId, consolanteTeamId, resolveTeam }) {
  const showConsolante = Boolean(consolanteTeamId);
  const renderSlot = (teamId) => {
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
          <div className="public-podium-team-content">{renderSlot(principalTeamId)}</div>
        </div>
        {showConsolante ? (
          <div className="public-podium-team-row">
            <div className="public-podium-team-label">Consolante</div>
            <div className="public-podium-team-content">{renderSlot(consolanteTeamId)}</div>
          </div>
        ) : null}
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
  const estimatedDuration = Number(match.estimatedDuration) || estimatePhaseDurationMinutes(getRuleForMatch(match, phaseRules));
  const estimatedDurationText = formatDurationLabel(estimatedDuration) || `${estimatedDuration} min`;
  const inProgressStartText = match.actualStartText || match.scheduledStartText || match.time || '--:--';
  const inProgressEndText = match.actualEndText || match.scheduledEndText || '--:--';
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
          {isInProgress ? (
            <>
              <div className="public-start-block">
                <div className="public-start-label">Début pris en compte à</div>
                <div className="public-start-time">{inProgressStartText}</div>
              </div>
              <div className="public-end-block">
                <div className="public-end-label">Fin estimée à</div>
                <div className="public-end-time">{inProgressEndText}</div>
              </div>
            </>
          ) : (
            <div className="public-end-block">
              <div className="public-end-label">Durée estimée</div>
              <div className="public-end-time">{estimatedDurationText}</div>
            </div>
          )}
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

const HOME_ANNOUNCEMENT_RECORD_ID = '__home_announcement__';

function buildFirebaseHomeAnnouncementUrl() {
  return `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/homeAnnouncement.json`;
}

function buildFirebaseHomeAnnouncementRecordUrl() {
  const effectiveId = encodeURIComponent(HOME_ANNOUNCEMENT_RECORD_ID);
  return `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/tournaments/${effectiveId}.json`;
}

function buildFirebaseRealtimeStreamUrl(sharedTournamentId) {
  const effectiveId = encodeURIComponent(String(sharedTournamentId || '').trim());
  const databaseHost = new URL(FIREBASE_DATABASE_URL).hostname;
  const namespace = databaseHost.split('.')[0];
  const baseUrl = `${FIREBASE_DATABASE_URL.replace(/\/$/, '')}/tournaments/${effectiveId}.json`;
  return `${baseUrl}?ns=${encodeURIComponent(namespace)}`;
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
      <div className="actions-row compact-actions" style={{ justifyContent: 'center', marginTop: '8px' }}>
        <button
          type="button"
          className="match-print-button-v24c"
          title="Imprimer ce QR Code"
          aria-label={`Imprimer ${title}`}
          onClick={(event) => {
            event.stopPropagation();
            printQrCode(url, title);
          }}
        >
          🖨️
        </button>
      </div>
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
  const [teams, setTeams] = useState(() => normalizeTeamsList(safeClone(initial?.teams, defaultTeams(18))));
  const [startTime, setStartTime] = useState(initial?.settings?.startTime || '09:00');
  const [slotDuration, setSlotDuration] = useState(initial?.settings?.slotDuration || 20);
  const [phaseRules, setPhaseRules] = useState(safeClone(initial?.settings?.phaseRules, DEFAULT_PHASE_RULES));
  const [organizerPassword, setOrganizerPassword] = useState(initialOrganizerPassword);
  const [passwordDraft, setPasswordDraft] = useState(initialOrganizerPassword);
  const [tournamentName, setTournamentName] = useState(initial?.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME);
  const [tournamentLogo, setTournamentLogo] = useState(initial?.settings?.tournamentLogo || '');
  const [sharedTournamentId, setSharedTournamentId] = useState(initial?.settings?.sharedTournamentId || buildDefaultSharedTournamentId(initial?.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME));
  const [disableBrassage2, setDisableBrassage2] = useState(Boolean(initial?.settings?.disableBrassage2));
  const [courtCount, setCourtCount] = useState(clampCourtCount(initial?.settings?.courtCount ?? DEFAULT_COURT_COUNT));
  const [lastSavedAt, setLastSavedAt] = useState(initial?.meta?.lastSavedAt || '');
  const [lastAutomaticSaveFilename, setLastAutomaticSaveFilenameState] = useState(initial?.meta?.lastAutomaticSaveFilename || '');
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
  const [homeAnnouncementText, setHomeAnnouncementText] = useState('');
  const [homeAnnouncementDraft, setHomeAnnouncementDraft] = useState('');
  const [homeAnnouncementEditing, setHomeAnnouncementEditing] = useState(false);
  const [homeAnnouncementLoading, setHomeAnnouncementLoading] = useState(false);
  const [homeAnnouncementSaving, setHomeAnnouncementSaving] = useState(false);
  const [remoteStateInitialized, setRemoteStateInitialized] = useState(mode !== 'referee');
  const [brassage1, setBrassage1] = useState(normalizeLeagueState(safeClone(initial?.brassage1, { pools: [], matches: [] })));
  const [brassage2, setBrassage2] = useState(normalizeLeagueState(safeClone(initial?.brassage2, { pools: [], matches: [] })));
  const [mainStage, setMainStage] = useState(normalizeMainStageState(safeClone(initial?.mainStage, { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] })));
  const [knockout, setKnockout] = useState(normalizeKnockoutState(safeClone(initial?.knockout, { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] })));
  const [championshipLeg1, setChampionshipLeg1] = useState(normalizeLeagueState(safeClone(initial?.championshipLeg1, { pools: [], matches: [] })));
  const [championshipLeg2, setChampionshipLeg2] = useState(normalizeLeagueState(safeClone(initial?.championshipLeg2, { pools: [], matches: [] })));
  const [singleKnockout, setSingleKnockout] = useState(normalizeSingleKnockoutState(safeClone(initial?.singleKnockout, { quarters: [], semis: [], finals: [] })));
  const [refereeSelectedMatch, setRefereeSelectedMatch] = useState(null);
  const [refereeSelectedScoreDraft, setRefereeSelectedScoreDraft] = useState(null);
  const [refereeScoreDrafts, setRefereeScoreDrafts] = useState({});
  const [organizerMatchTeamFilter, setOrganizerMatchTeamFilter] = useState('');
  const [selectedBrassagePoolByScope, setSelectedBrassagePoolByScope] = useState({ brassage1: '', brassage2: '', principale: '', consolante: '' });
  const [selectedBrassageTeamByScope, setSelectedBrassageTeamByScope] = useState({ brassage1: '', brassage2: '', principale: '', consolante: '' });
  const [waitingTimePhaseView, setWaitingTimePhaseView] = useState('auto');
  const importRef = useRef(null);
  const tournamentLogoInputRef = useRef(null);
  const organizerLoginInputRef = useRef(null);
  const autoRefereeSyncTimeoutRef = useRef(null);
  const lastAutomaticSaveFilenameRef = useRef(initial?.meta?.lastAutomaticSaveFilename || '');
  const backgroundCloudSaveTimeoutRef = useRef(null);
  const realtimeEventSourceRef = useRef(null);
  const realtimeRefreshTimeoutRef = useRef(null);
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
  const courtCountRef = useRef(courtCount);
  const remoteSavedAtRef = useRef(remoteSavedAt);
  const brassage1Ref = useRef(brassage1);
  const brassage2Ref = useRef(brassage2);
  const mainStageRef = useRef(mainStage);
  const knockoutRef = useRef(knockout);
  const championshipLeg1Ref = useRef(championshipLeg1);
  const championshipLeg2Ref = useRef(championshipLeg2);
  const singleKnockoutRef = useRef(singleKnockout);
  const pendingFreshTournamentTimestampRef = useRef(null);
  const homeAnnouncementTextareaRef = useRef(null);
  const pendingStructureSyncTimestampRef = useRef(null);
  const pendingLocalMutationTimestampRef = useRef(null);
  const previousTournamentNameRef = useRef(initial?.settings?.tournamentName || DEFAULT_TOURNAMENT_NAME);
  const autoGeneratedStageSignaturesRef = useRef(new Set());

  useEffect(() => {
    sharedTournamentIdRef.current = sharedTournamentId;
  }, [sharedTournamentId]);

  useEffect(() => {
    disableBrassage2Ref.current = disableBrassage2;
  }, [disableBrassage2]);

  useEffect(() => {
    courtCountRef.current = clampCourtCount(courtCount);
    CURRENT_COURT_COUNT = clampCourtCount(courtCount);
  }, [courtCount]);

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

  const loadHomeAnnouncement = useCallback(async () => {
    if (!FIREBASE_DATABASE_URL) return;
    setHomeAnnouncementLoading(true);
    try {
      let nextText = '';

      const recordResponse = await fetch(buildFirebaseHomeAnnouncementRecordUrl(), { cache: 'no-store' });
      if (recordResponse.ok) {
        const recordPayload = await recordResponse.json().catch(() => ({}));
        nextText = typeof recordPayload?.meta?.homeAnnouncementText === 'string'
          ? recordPayload.meta.homeAnnouncementText
          : (typeof recordPayload?.settings?.homeAnnouncementText === 'string' ? recordPayload.settings.homeAnnouncementText : '');
      } else if (recordResponse.status !== 404) {
        throw new Error(`HTTP ${recordResponse.status}`);
      }

      if (!nextText) {
        const legacyResponse = await fetch(buildFirebaseHomeAnnouncementUrl(), { cache: 'no-store' });
        if (legacyResponse.ok) {
          const legacyPayload = await legacyResponse.json().catch(() => ({}));
          nextText = typeof legacyPayload === 'string'
            ? legacyPayload
            : (typeof legacyPayload?.text === 'string' ? legacyPayload.text : '');
        } else if (legacyResponse.status !== 404) {
          throw new Error(`HTTP ${legacyResponse.status}`);
        }
      }

      setHomeAnnouncementText(nextText);
      setHomeAnnouncementDraft((current) => (homeAnnouncementEditing ? current : nextText));
    } catch (error) {
      console.error("Impossible de charger le message d'accueil.", error);
      setHomeAnnouncementText('');
      setHomeAnnouncementDraft((current) => (homeAnnouncementEditing ? current : ''));
    } finally {
      setHomeAnnouncementLoading(false);
    }
  }, [homeAnnouncementEditing]);

  const cancelHomeAnnouncementEdit = useCallback(() => {
    setHomeAnnouncementDraft(homeAnnouncementText || '');
    setHomeAnnouncementEditing(false);
  }, [homeAnnouncementText]);

  const saveHomeAnnouncement = useCallback(async (nextValue) => {
    const normalizedValue = String(nextValue || '').trim();
    const previousText = homeAnnouncementText || '';

    setHomeAnnouncementLoading(false);
    setHomeAnnouncementText(normalizedValue);
    setHomeAnnouncementDraft(normalizedValue);
    setHomeAnnouncementEditing(false);

    if (!FIREBASE_DATABASE_URL) {
      return;
    }

    setHomeAnnouncementSaving(true);
    try {
      const nowIso = new Date().toISOString();
      const response = await fetch(buildFirebaseHomeAnnouncementRecordUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            tournamentName: '__home_announcement__',
            organizerPassword: '',
            homeAnnouncementText: normalizedValue,
          },
          meta: {
            hiddenHomeRecord: true,
            homeAnnouncementText: normalizedValue,
            updatedAt: nowIso,
            createdAt: nowIso,
            remoteSavedAt: nowIso,
            lastSavedAt: nowIso,
          },
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setHomeAnnouncementLoading(false);
      setHomeAnnouncementText(normalizedValue);
      setHomeAnnouncementDraft(normalizedValue);

      window.setTimeout(() => {
        loadHomeAnnouncement();
      }, 0);
    } catch (error) {
      console.error("Impossible d'enregistrer le message d'accueil.", error);
      setHomeAnnouncementLoading(false);
      setHomeAnnouncementText(previousText);
      setHomeAnnouncementDraft(normalizedValue);
      setHomeAnnouncementEditing(true);
      window.alert("Impossible d'enregistrer le message d'accueil.");
    } finally {
      setHomeAnnouncementSaving(false);
    }
  }, [homeAnnouncementText, loadHomeAnnouncement]);

  const handleHomeAnnouncementEditStart = useCallback(() => {
    if (homeAnnouncementSaving) return;
    const password = window.prompt('Mot de passe :', '');
    if (password == null) return;
    if (password !== MASTER_PASSWORD) {
      window.alert('Mot de passe incorrect.');
      return;
    }
    setHomeAnnouncementDraft(homeAnnouncementText || '');
    setHomeAnnouncementEditing(true);
  }, [homeAnnouncementSaving, homeAnnouncementText]);

  useEffect(() => {
    if (mode !== 'home') return undefined;
    loadHomeAnnouncement();
    const intervalId = window.setInterval(() => {
      loadHomeAnnouncement();
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, [mode, loadHomeAnnouncement]);

  useEffect(() => {
    if (!homeAnnouncementEditing) return;
    const timeoutId = window.setTimeout(() => {
      homeAnnouncementTextareaRef.current?.focus();
      const valueLength = homeAnnouncementTextareaRef.current?.value?.length || 0;
      homeAnnouncementTextareaRef.current?.setSelectionRange?.(valueLength, valueLength);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [homeAnnouncementEditing]);
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
  const tournamentTeamCount = activeTeams.length;

  const isSmallTournamentMode = activeTeams.length > 0 && activeTeams.length < 8;
  const mainStageDistribution = useMemo(() => getMainStageDistribution(activeTeams.length), [activeTeams.length]);
  const useNormalizedPoolRanking = !isSmallTournamentMode;
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

  const publicPrincipalQuarterTeams = useMemo(
    () => buildQuarterQualifiedTeamRowsFromMatches(knockout.principalQuarters, principaleOverallRanking),
    [knockout.principalQuarters, principaleOverallRanking]
  );
  const publicConsolanteQuarterTeams = useMemo(
    () => buildQuarterQualifiedTeamRowsFromMatches(knockout.consolanteQuarters, consolanteOverallRanking),
    [knockout.consolanteQuarters, consolanteOverallRanking]
  );

  const publicPrincipalSemiTeams = useMemo(
    () => buildQualifiedTeamRowsFromTeamIds(getWinnersFromMatches(knockout.principalQuarters, phaseRules), principaleOverallRanking),
    [knockout.principalQuarters, principaleOverallRanking, phaseRules]
  );
  const publicPrincipalFinalTeams = useMemo(
    () => buildQualifiedTeamRowsFromTeamIds(getWinnersFromMatches(knockout.principalSemis, phaseRules), principaleOverallRanking),
    [knockout.principalSemis, principaleOverallRanking, phaseRules]
  );
  const publicPrincipalPetiteFinaleTeams = useMemo(
    () => buildQualifiedTeamRowsFromTeamIds(getLosersFromMatches(knockout.principalSemis, phaseRules), principaleOverallRanking),
    [knockout.principalSemis, principaleOverallRanking, phaseRules]
  );
  const publicConsolanteSemiTeams = useMemo(
    () => buildQualifiedTeamRowsFromTeamIds(getWinnersFromMatches(knockout.consolanteQuarters, phaseRules), consolanteOverallRanking),
    [knockout.consolanteQuarters, consolanteOverallRanking, phaseRules]
  );
  const publicConsolanteFinalTeams = useMemo(
    () => buildQualifiedTeamRowsFromTeamIds(getWinnersFromMatches(knockout.consolanteSemis, phaseRules), consolanteOverallRanking),
    [knockout.consolanteSemis, consolanteOverallRanking, phaseRules]
  );
  const publicConsolantePetiteFinaleTeams = useMemo(
    () => buildQualifiedTeamRowsFromTeamIds(getLosersFromMatches(knockout.consolanteSemis, phaseRules), consolanteOverallRanking),
    [knockout.consolanteSemis, consolanteOverallRanking, phaseRules]
  );

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

  function setLastAutomaticSaveFilename(nextValue) {
    const safeValue = String(nextValue || '');
    lastAutomaticSaveFilenameRef.current = safeValue;
    setLastAutomaticSaveFilenameState(safeValue);
  }

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
        courtCount: clampCourtCount(overrides.courtCount ?? courtCountRef.current),
      },
      meta: {
        createdAt: overrides.createdAt ?? createdAtRef.current,
        lastSavedAt: savedAt,
        remoteSavedAt: overrides.remoteSavedAt ?? remoteSavedAtRef.current,
        lastAutomaticSaveFilename: overrides.lastAutomaticSaveFilename ?? lastAutomaticSaveFilenameRef.current,
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
    if (Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'courtCount')) {
      const nextCourtCount = clampCourtCount(parsed.settings?.courtCount);
      CURRENT_COURT_COUNT = nextCourtCount;
      setCourtCount(nextCourtCount);
    }
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'createdAt')) setCreatedAt(parsed.meta?.createdAt || new Date().toISOString());
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'lastSavedAt')) setLastSavedAt(parsed.meta?.lastSavedAt || '');
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'remoteSavedAt')) setRemoteSavedAt(parsed.meta?.remoteSavedAt || '');
    if (Object.prototype.hasOwnProperty.call(parsed.meta || {}, 'lastAutomaticSaveFilename')) setLastAutomaticSaveFilename(parsed.meta?.lastAutomaticSaveFilename || '');
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

  function queueBackgroundCloudSave(delay = 80, timestamp = null) {
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
    const response = await fetch(buildFirebaseTournamentUrl(effectiveId), { cache: 'no-store' });
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
          pendingResultSentAt: null,
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
          pendingResultSentAt: null,
          refereeInProgress: false,
          matchInProgress: false,
        };
      } else if (!shouldIgnoreRemoteOfficialBecauseLocalEdit && !shouldIgnoreRemotePendingBecauseLocalEdit && (remoteSubmittedAt >= localSubmittedAt || shouldAdoptRemotePendingWithoutTimestamp)) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: remoteMatch.submittedScoreA ?? '',
          submittedScoreB: remoteMatch.submittedScoreB ?? '',
          submittedAt: remoteMatch.submittedAt ?? null,
          pendingResultSentAt: remoteMatch.pendingResultSentAt ?? localMatch.pendingResultSentAt ?? null,
          refereeInProgress: shouldIgnoreRemoteLock ? false : remoteInProgress,
          matchInProgress: shouldIgnoreRemoteLock ? (localMatchInProgress || remoteMatchInProgress) : (remoteMatchInProgress || Boolean(remoteMatch.pendingResultSentAt)),
        };
      } else if (shouldIgnoreRemoteLock) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: localMatch.submittedScoreA ?? nextMatch.submittedScoreA ?? '',
          submittedScoreB: localMatch.submittedScoreB ?? nextMatch.submittedScoreB ?? '',
          submittedAt: localMatch.submittedAt ?? nextMatch.submittedAt ?? null,
          pendingResultSentAt: localMatch.pendingResultSentAt ?? nextMatch.pendingResultSentAt ?? null,
          refereeInProgress: false,
          matchInProgress: localMatchInProgress || remoteMatchInProgress,
        };
      } else if (shouldIgnoreRemotePendingBecauseLocalEdit) {
        nextMatch = {
          ...nextMatch,
          submittedScoreA: localMatch.submittedScoreA ?? '',
          submittedScoreB: localMatch.submittedScoreB ?? '',
          submittedAt: localMatch.submittedAt ?? null,
          pendingResultSentAt: localMatch.pendingResultSentAt ?? nextMatch.pendingResultSentAt ?? null,
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
        consolanteQuarters: Array.isArray(payload.knockout?.consolanteQuarters) ? mergeRemoteMatches(current.consolanteQuarters, payload.knockout.consolanteQuarters, payload.knockout.consolanteQuarters.length === 0) : current.consolanteQuarters,
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
    latestPersistedStateRef.current = safeClone(payload, {});
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
        .filter(([id]) => id !== HOME_ANNOUNCEMENT_RECORD_ID)
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
        const isPasswordValid = normalizedDeletionPassword === MASTER_PASSWORD || normalizedDeletionPassword === tournamentPassword;
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

    const selectedTournament = homeTournamentOptions.find((item) => item.id === targetId) || null;
    const tournamentLabel = String(selectedTournament?.name || targetId);

    setIsRemoteSyncing(true);
    setRemoteSyncMessage('Chargement Firebase en cours...');
    try {
      const payload = await fetchTournamentFromCloudRaw(targetId);
      const tournamentPassword = String(payload?.settings?.organizerPassword ?? '');
      const requiresPassword = tournamentPassword.trim() !== '';

      if (requiresPassword) {
        const passwordAttempt = window.prompt(
          `Saisis le mot de passe du tournoi « ${tournamentLabel} » pour ouvrir l'accès Organisateur.`,
          ''
        );
        if (passwordAttempt === null) {
          setRemoteSyncMessage('Accès organisateur annulé.');
          return;
        }

        const normalizedAttempt = String(passwordAttempt ?? '');
        const isOrganizerPasswordValid = normalizedAttempt === tournamentPassword;
        const isMasterPasswordValid = normalizedAttempt === MASTER_PASSWORD;
        if (!isOrganizerPasswordValid && !isMasterPasswordValid) {
          window.alert('Mot de passe incorrect.');
          setMode('home');
          setIsOrganizerAuthenticated(false);
          setRemoteSyncMessage('Mot de passe incorrect.');
          return;
        }
      }

      pendingFreshTournamentTimestampRef.current = null;
      pendingStructureSyncTimestampRef.current = null;
      pendingLocalMutationTimestampRef.current = null;
      applyPersistedState(payload);
      setRemoteStateInitialized(true);
      setSharedTournamentId(targetId);
      setRemoteSavedAt(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt || '');
      setRemoteSyncMessage(`Dernière synchro Firebase : ${formatRemoteTimestamp(payload?.meta?.remoteSavedAt || payload?.meta?.lastSavedAt)}`);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('mode');
        url.searchParams.set('sharedTournamentId', targetId);
        window.history.replaceState({}, '', url.toString());
      }
      setHomeSelectorOpen(false);
      setMode('organizer');
      setIsOrganizerAuthenticated(true);
      setShowOrganizerLogin(false);
      setOrganizerAttempt('');
      setLoginError('');
      setActiveTab('dashboard');
    } catch (error) {
      const message = String(error?.message || 'Échec du chargement Firebase.');
      setRemoteSyncMessage(message);
      window.alert(message);
    } finally {
      setIsRemoteSyncing(false);
    }
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
      queuedCloudSaveRequestRef.current = { showMessage, silent: true };
      if (!silent) {
        setRemoteSyncMessage('Chargement Firebase en cours...');
      }
      if (typeof window !== 'undefined') {
        if (backgroundCloudSaveTimeoutRef.current) {
          window.clearTimeout(backgroundCloudSaveTimeoutRef.current);
        }
        backgroundCloudSaveTimeoutRef.current = window.setTimeout(() => {
          saveTournamentToCloud(false, true);
        }, 350);
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
      if (realtimeRefreshTimeoutRef.current) window.clearTimeout(realtimeRefreshTimeoutRef.current);
    }
    if (realtimeEventSourceRef.current) {
      realtimeEventSourceRef.current.close();
      realtimeEventSourceRef.current = null;
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
    let fallbackIntervalId = null;

    const refreshFromFirebase = async () => {
      try {
        const payload = await fetchTournamentFromCloudRaw(sharedTournamentId);
        if (!cancelled) mergeRemoteRefereeState(payload);
      } catch (error) {
        // ignore background realtime sync errors
      }
    };

    const scheduleRefresh = (delay = 30) => {
      if (typeof window === 'undefined') return;
      if (realtimeRefreshTimeoutRef.current) window.clearTimeout(realtimeRefreshTimeoutRef.current);
      realtimeRefreshTimeoutRef.current = window.setTimeout(() => {
        refreshFromFirebase();
      }, delay);
    };

    refreshFromFirebase();

    if (typeof window !== 'undefined' && typeof EventSource !== 'undefined') {
      try {
        const eventSource = new EventSource(buildFirebaseRealtimeStreamUrl(sharedTournamentId));
        realtimeEventSourceRef.current = eventSource;
        const handleRealtimeEvent = () => scheduleRefresh(20);
        eventSource.addEventListener('put', handleRealtimeEvent);
        eventSource.addEventListener('patch', handleRealtimeEvent);
        eventSource.onmessage = handleRealtimeEvent;
        eventSource.onerror = () => {
          if (!fallbackIntervalId) {
            const remotePollIntervalMs = mode === 'public' ? 900 : mode === 'organizer' ? 700 : 500;
            fallbackIntervalId = window.setInterval(refreshFromFirebase, remotePollIntervalMs);
          }
        };
      } catch (error) {
        const remotePollIntervalMs = mode === 'public' ? 900 : mode === 'organizer' ? 700 : 500;
        fallbackIntervalId = window.setInterval(refreshFromFirebase, remotePollIntervalMs);
      }
    } else if (typeof window !== 'undefined') {
      const remotePollIntervalMs = mode === 'public' ? 900 : mode === 'organizer' ? 700 : 500;
      fallbackIntervalId = window.setInterval(refreshFromFirebase, remotePollIntervalMs);
    }

    return () => {
      cancelled = true;
      if (realtimeRefreshTimeoutRef.current) {
        window.clearTimeout(realtimeRefreshTimeoutRef.current);
        realtimeRefreshTimeoutRef.current = null;
      }
      if (fallbackIntervalId) window.clearInterval(fallbackIntervalId);
      if (realtimeEventSourceRef.current) {
        realtimeEventSourceRef.current.close();
        realtimeEventSourceRef.current = null;
      }
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
    }, 80);
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
  const hasGeneratedMainStagePublic = mainStage.principalePools.length > 0 || mainStage.principaleMatches.length > 0 || mainStage.consolantePools.length > 0 || mainStage.consolanteMatches.length > 0;
  const showSplitPublicPoolRankings = (showPublicPrincipalePoolRanking || showPublicConsolantePoolRanking);
  const hidePublicRankingSection = false;
  const publicOverallRankingRows = (showSplitPublicPoolRankings || hasGeneratedMainStagePublic)
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
        heading: 'Durée estimée de la phase',
        phaseLabel: currentStage.phaseLabel,
        value: getEstimatedEndTextForMatches(currentStage.matches, scheduleData.scheduleMap, '--', phaseRules),
      };
    }

    const brassage1Complete = visibleBrassage1Matches.length > 0 && visibleBrassage1Matches.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
    const brassage2Complete = visibleBrassage2Matches.length > 0 && visibleBrassage2Matches.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');

    const hasMainStageOrFinals = mainStage.principaleMatches.length > 0
      || mainStage.consolanteMatches.length > 0
      || knockout.principalQuarters.length > 0
      || knockout.principalSemis.length > 0
      || knockout.principalFinals.length > 0
      || (knockout.consolanteEighths || []).length > 0
    || knockout.consolanteQuarters.length > 0
    || (knockout.consolanteEighths || []).length > 0
    || knockout.consolanteQuarters.length > 0
    || knockout.consolanteSemis.length > 0
      || knockout.consolanteFinals.length > 0;

    if (hasMainStageOrFinals) {
      return {
        mode: 'split',
        heading: 'Durée estimée de la phase',
        leftTitle: 'Tableau principal',
        leftItems: [
          { label: 'Matchs de poules principale', value: getEstimatedEndTextForMatches(visiblePrincipaleMatches, scheduleData.scheduleMap, 'À générer', phaseRules) },
          { label: 'Quarts de finale principale', value: getEstimatedEndTextForMatches(knockout.principalQuarters, scheduleData.scheduleMap, 'À générer', phaseRules) },
          { label: 'Demi-finales principale', value: getEstimatedEndTextForMatches(knockout.principalSemis, scheduleData.scheduleMap, 'À générer', phaseRules) },
          { label: 'Finale / petite finale principale', value: getEstimatedEndTextForMatches(knockout.principalFinals, scheduleData.scheduleMap, 'À générer', phaseRules) },
        ],
        rightTitle: 'Tableau consolante',
        rightItems: [
          { label: 'Matchs de poules consolante', value: getEstimatedEndTextForMatches(visibleConsolanteMatches, scheduleData.scheduleMap, 'À générer', phaseRules) },
          { label: 'Demi-finales consolante', value: getEstimatedEndTextForMatches(knockout.consolanteSemis, scheduleData.scheduleMap, 'À générer', phaseRules) },
          { label: 'Finale / petite finale consolante', value: getEstimatedEndTextForMatches(knockout.consolanteFinals, scheduleData.scheduleMap, 'À générer', phaseRules) },
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
      heading: 'Durée estimée de la phase',
      phaseLabel: currentStage.phaseLabel,
      value: getEstimatedEndTextForMatches(currentStage.matches, scheduleData.scheduleMap, '--', phaseRules),
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
    knockout.consolanteQuarters,
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
      .slice(0, getMaxActiveCourts(courtCount))
      .map((match) => {
        const estimatedDuration = estimatePhaseDurationMinutes(getRuleForMatch(match, phaseRules));
        const actualStartMinutes = stampToMinutes(match.submittedAt) ?? scheduleData.scheduleMap[match.id]?.startMinutes ?? parseTimeToMinutes(match.time || '09:00');
        const actualEndMinutes = actualStartMinutes + estimatedDuration;
        return {
          ...match,
          time: minutesToTime(actualStartMinutes),
          scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
          scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
          actualStartText: minutesToTime(actualStartMinutes),
          actualEndText: minutesToTime(actualEndMinutes),
          estimatedDuration,
        };
      })
  ), [allCompetitionMatches, phaseRules, resolveTeam, scheduleData]);

  const upcomingMatches = useMemo(() => (
    allCompetitionMatches
      .filter((match) => {
        if (isMatchCurrentlyInProgress(match, phaseRules)) return false;
        if (!isPublicDisplayableMatch(match, resolveTeam)) return false;
        return toNumber(match.scoreA) === null || toNumber(match.scoreB) === null || !isMatchResultValid(match, phaseRules);
      })
      .sort((a, b) => (scheduleData.scheduleMap[a.id]?.startMinutes || 0) - (scheduleData.scheduleMap[b.id]?.startMinutes || 0))
      .slice(0, getMaxActiveCourts(courtCount))
      .map((match) => ({
        ...match,
        time: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
        scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
        estimatedDuration: estimatePhaseDurationMinutes(getRuleForMatch(match, phaseRules)),
      }))
  ), [allCompetitionMatches, phaseRules, resolveTeam, scheduleData]);

  const publicPodiumLeaders = useMemo(() => {
    const isResolvedPodiumTeam = (teamId) => {
      if (!teamId) return false;
      const teamName = String(resolveTeam(teamId)?.name || '').trim().toLowerCase();
      return Boolean(teamName && teamName !== 'à définir');
    };

    const extractPodium = (matches, fallbackRanking = [], options = {}) => {
      const finalMatch = matches.find((match) => match.group === 'Finale');
      const smallFinal = matches.find((match) => match.group === 'Petite finale');
      const finalResult = finalMatch ? getWinnerLoser(finalMatch, phaseRules) : { winner: null, loser: null };
      const smallResult = smallFinal ? getWinnerLoser(smallFinal, phaseRules) : { winner: null, loser: null };

      let first = finalMatch && isMatchResultValid(finalMatch, phaseRules) && isResolvedPodiumTeam(finalResult.winner)
        ? finalResult.winner
        : null;
      let second = finalMatch && isMatchResultValid(finalMatch, phaseRules) && isResolvedPodiumTeam(finalResult.loser)
        ? finalResult.loser
        : null;
      let third = smallFinal && isMatchResultValid(smallFinal, phaseRules) && isResolvedPodiumTeam(smallResult.winner)
        ? smallResult.winner
        : null;

      const allowFallback = options?.allowFallback !== false;

      if (allowFallback && (!first || !second || !third)) {
        const fallback = (Array.isArray(fallbackRanking) ? fallbackRanking : [])
          .map((row) => row?.teamId || null)
          .filter((teamId) => isResolvedPodiumTeam(teamId));
        if (!first) first = fallback[0] || null;
        if (!second) second = fallback[1] || null;
        if (!third) third = fallback[2] || null;
      }

      return { first, second, third };
    };

    const consolanteFallbackRanking = buildDirectRankingPodiumFallback(
      mainStage.consolantePools,
      mainStage.consolanteMatches,
      knockout.consolanteSemis,
      knockout.consolanteFinals,
      consolanteOverallRanking,
      phaseRules,
    );

    const consolanteHasQuarterStage = Array.isArray(knockout.consolanteQuarters) && knockout.consolanteQuarters.length > 0;
    const consolanteQuartersComplete = !consolanteHasQuarterStage
      || knockout.consolanteQuarters.every((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');

    const principale = extractPodium(knockout.principalFinals);
    const consolante = extractPodium(
      knockout.consolanteFinals,
      consolanteFallbackRanking,
      { allowFallback: !consolanteHasQuarterStage || consolanteQuartersComplete }
    );
    const tournamentFinished = Boolean(
      principale.first
      && principale.second
      && principale.third
      && consolante.first
      && consolante.second
      && consolante.third
    );

    return { tournamentFinished, principale, consolante };
  }, [knockout.principalFinals, knockout.consolanteFinals, knockout.consolanteSemis, mainStage.consolanteMatches, mainStage.consolantePools, consolanteOverallRanking, phaseRules, resolveTeam]);

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
    const remainingSlots = Math.max(0, getMaxActiveCourts(courtCount) - items.length);
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
        .slice(0, getMaxActiveCourts(courtCount))
        .forEach((match, index) => {
          items.push({
            type: 'match',
            title: index === 0 ? 'Prochain match' : `Prochain match ${index + 1}`,
            match: {
              ...match,
              time: scheduleData.scheduleMap[match.id]?.startText || match.time,
              scheduledStartText: scheduleData.scheduleMap[match.id]?.startText || match.time,
              scheduledEndText: scheduleData.scheduleMap[match.id]?.endText || '',
              estimatedDuration: estimatePhaseDurationMinutes(getRuleForMatch(match, phaseRules)),
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


  function tryGenerateThirtySixFinalStages() {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (currentTeamCount !== 36) return false;

    let changed = false;
    const beforePrincipal = (knockoutRef.current?.principalEighths || []).length;
    if (!beforePrincipal) {
      const handled = generateThirtySixPrincipalEighths({ silent: true });
      changed = changed || handled;
    }

    const beforeConsolante = (knockoutRef.current?.consolanteEighths || []).length;
    if (!beforeConsolante) {
      const handled = generateThirtySixConsolanteEighths({ silent: true });
      changed = changed || handled;
    }

    return changed;
  }

  const stageValidation = useMemo(() => isSmallTournamentMode ? ({
    championnatAllerComplete: championshipLeg1.matches.length > 0 && championshipLeg1.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    championnatRetourComplete: championshipLeg2.matches.length > 0 && championshipLeg2.matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    quarterComplete: singleKnockout.quarters.length === 0 || singleKnockout.quarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    semiComplete: singleKnockout.semis.length === 0 || singleKnockout.semis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }) : ({
    brassage1Complete: (brassage1.matches || []).length > 0 && (brassage1.matches || []).every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    brassage2Complete: shouldSkipBrassage2 || (visibleBrassage2Matches.length > 0 && visibleBrassage2Matches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide')),
    principalePoolsComplete: visiblePrincipaleMatches.length > 0 && visiblePrincipaleMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolantePoolsComplete: visibleConsolanteMatches.length > 0 && visibleConsolanteMatches.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalQuartersComplete: knockout.principalQuarters.length === 0 || knockout.principalQuarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    principalSemisComplete: knockout.principalSemis.length > 0 && knockout.principalSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolanteQuartersComplete: knockout.consolanteQuarters.length > 0 && knockout.consolanteQuarters.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
    consolanteSemisComplete: knockout.consolanteSemis.length > 0 && knockout.consolanteSemis.every((m) => getMatchStatusLabel(m, phaseRules) === 'Valide'),
  }), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, brassage1.matches, brassage2.matches, mainStage.principaleMatches, mainStage.consolanteMatches, knockout, phaseRules, shouldSkipBrassage2]);

  useEffect(() => {
    if (isSmallTournamentMode) {
      if (forceSmallChampionshipQuartersIfReady({ silent: true })) return;

      if (stageValidation.championnatAllerComplete && championshipLeg2Ref.current.matches.length === 0) {
        const signature = 'auto-championship-retour';
        if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
          autoGeneratedStageSignaturesRef.current.add(signature);
          generateBrassage2();
          return;
        }
      }
      if (activeTeamCount === 9 && stageValidation.championnatRetourComplete && singleKnockoutRef.current.quarters.length === 0) {
        const signature = 'auto-nine-ko';
        if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
          const generated = forceSmallChampionshipQuartersIfReady({ silent: true });
          if (generated) {
            autoGeneratedStageSignaturesRef.current.add(signature);
            return;
          }
        }
      }
      if (forceSmallChampionshipQuartersIfReady({ silent: true })) {
        return;
      }
      if (stageValidation.championnatAllerComplete && stageValidation.championnatRetourComplete && singleKnockoutRef.current.quarters.length === 0 && singleKnockoutRef.current.semis.length === 0 && singleKnockoutRef.current.finals.length === 0) {
        const signature = 'auto-small-ko-1';
        if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
          autoGeneratedStageSignaturesRef.current.add(signature);
          generateSmallKnockoutStage1();
          return;
        }
      }
      if (singleKnockoutRef.current.quarters.length > 0 && stageValidation.quarterComplete && singleKnockoutRef.current.semis.length === 0) {
        const signature = `auto-small-ko-2-${singleKnockoutRef.current.quarters.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`;
        if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
          autoGeneratedStageSignaturesRef.current.add(signature);
          generateSmallKnockoutStage2();
          return;
        }
      }
      if (singleKnockoutRef.current.semis.length > 0 && stageValidation.semiComplete && singleKnockoutRef.current.finals.length === 0) {
        const signature = `auto-small-ko-3-${singleKnockoutRef.current.semis.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`;
        if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
          autoGeneratedStageSignaturesRef.current.add(signature);
          generateSmallKnockoutStage3();
        }
      }
      return;
    }

    if (stageValidation.brassage1Complete) {
      if (shouldSkipBrassage2) {
        if (mainStageRef.current.principaleMatches.length === 0 && mainStageRef.current.consolanteMatches.length === 0) {
          const signature = 'auto-main-stage-direct';
          if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
            autoGeneratedStageSignaturesRef.current.add(signature);
            generateMainStage(true);
            return;
          }
        }
      } else {
        const brassage2AlreadyGenerated = (brassage2Ref.current.matches.length > 0) || (brassage2Ref.current.pools.length > 0);
        if (!brassage2AlreadyGenerated) {
          const validatedMatchCount = brassage1Ref.current.matches.filter((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide').length;
          const signature = `auto-brassage2-${validatedMatchCount}-${brassage1Ref.current.matches.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}:${match.validatedAt || ''}`).join('|')}`;
          if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
            try {
              const generated = tryAutoGenerateBrassage2Silently();
              if (generated) {
                autoGeneratedStageSignaturesRef.current.add(signature);
                return;
              }
            } catch (error) {
              console.error('Erreur lors de la génération automatique du brassage 2', error);
              autoGeneratedStageSignaturesRef.current.delete(signature);
            }
          }
        }
      }
    }

    const hasGeneratedMainStructure = (
      (mainStageRef.current.principalePools?.length || 0) > 0
      || (mainStageRef.current.principaleMatches?.length || 0) > 0
      || (mainStageRef.current.consolantePools?.length || 0) > 0
      || (mainStageRef.current.consolanteMatches?.length || 0) > 0
      || (knockoutRef.current.principalQuarters?.length || 0) > 0
      || (knockoutRef.current.principalSemis?.length || 0) > 0
      || (knockoutRef.current.principalFinals?.length || 0) > 0
      || (knockoutRef.current.consolanteSemis?.length || 0) > 0
      || (knockoutRef.current.consolanteFinals?.length || 0) > 0
    );

    // V33M safe direct main stage generation
    if (stableGenerateAfterBrassage2({ silent: true })) {
      return;
    }

    if (generateQuartersIfFinalsStartAtQuarters({ silent: true })) {
      return;
    }

    if (!isSmallTournamentMode && teamsRef.current.filter((team) => team.name.trim()).length >= 13 && !shouldSkipBrassage2 && stageValidation.brassage2Complete && !hasGeneratedMainStructure) {
      const signature = `auto-main-stage-${(brassage2Ref.current?.matches || []).map((match) => `${match.id}:${match.scoreA}-${match.scoreB}:${match.validatedAt || ''}`).join('|')}`;
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        try {
          const generated = generateMainStage();
          if (generated !== false) {
            autoGeneratedStageSignaturesRef.current.add(signature);
            return;
          }
        } catch (error) {
          console.error('Erreur lors du passage automatique Brassage 2 → Principale / Consolante', error);
          autoGeneratedStageSignaturesRef.current.delete(signature);
        }
      }
    }

    let generatedFinalStageFromPools = false;

    if (tryGenerateThirtySixFinalStages()) {
      return;
    }

    if (stageValidation.principalePoolsComplete && (knockoutRef.current.principalQuarters || []).length === 0 && (knockoutRef.current.principalSemis || []).length === 0) {
      const signature = `auto-principale-stage1-${mainStageDistribution.directPrincipalSemis ? 'semis' : 'quarters'}`;
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        try {
          const generated = generatePrincipalQuarters();
          if (generated === true) {
            autoGeneratedStageSignaturesRef.current.add(signature);
            generatedFinalStageFromPools = true;
          }
        } catch (error) {
          console.error('Erreur lors de la génération automatique du tableau principal', error);
          autoGeneratedStageSignaturesRef.current.delete(signature);
        }
      }
    }

    if (stageValidation.consolantePoolsComplete && (knockoutRef.current.consolanteSemis || []).length === 0 && (knockoutRef.current.consolanteFinals || []).length === 0 && mainStageDistribution.consolanteMode !== 'direct-podium') {
      const signature = mainStageDistribution.consolanteMode === 'quarter-pools'
        ? `auto-consolante-quarts-${mainStage.consolanteMatches.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`
        : 'auto-consolante-semis';
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        try {
          const generated = generateConsolanteSemis();
          if (generated === true) {
            autoGeneratedStageSignaturesRef.current.add(signature);
            generatedFinalStageFromPools = true;
          }
        } catch (error) {
          console.error('Erreur lors de la génération automatique du tableau consolante', error);
          autoGeneratedStageSignaturesRef.current.delete(signature);
        }
      }
    }

    if (knockoutRef.current.consolanteQuarters.length >= 4 && stageValidation.consolanteQuartersComplete && (knockoutRef.current.consolanteSemis || []).length === 0) {
      const signature = `auto-consolante-semis-${knockoutRef.current.consolanteQuarters.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`;
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        autoGeneratedStageSignaturesRef.current.add(signature);
        generateConsolanteSemis();
        return;
      }
    }

    if (generatedFinalStageFromPools) {
      setActiveTab('finales');
      return;
    }

    if (knockoutRef.current.principalQuarters.length > 0 && stageValidation.principalQuartersComplete && (knockoutRef.current.principalSemis || []).length === 0) {
      const signature = `auto-principal-semis-${knockoutRef.current.principalQuarters.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`;
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        autoGeneratedStageSignaturesRef.current.add(signature);
        generatePrincipalSemis();
        return;
      }
    }

    if (knockoutRef.current.consolanteSemis.length > 0 && stageValidation.consolanteSemisComplete && (knockoutRef.current.consolanteFinals || []).length === 0) {
      const signature = `auto-consolante-finals-${knockoutRef.current.consolanteSemis.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`;
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        autoGeneratedStageSignaturesRef.current.add(signature);
        generateConsolanteFinals();
        return;
      }
    }

    if (knockoutRef.current.principalSemis.length > 0 && stageValidation.principalSemisComplete && knockoutRef.current.principalFinals.length === 0) {
      const signature = `auto-principal-finals-${knockoutRef.current.principalSemis.map((match) => `${match.id}:${match.scoreA}-${match.scoreB}`).join('|')}`;
      if (!autoGeneratedStageSignaturesRef.current.has(signature)) {
        autoGeneratedStageSignaturesRef.current.add(signature);
        generatePrincipalFinals();
      }
    }
  }, [
    isSmallTournamentMode,
    shouldSkipBrassage2,
    stageValidation,
    championshipLeg1.matches,
    championshipLeg2.matches,
    singleKnockout.quarters,
    singleKnockout.semis,
    singleKnockout.finals,
    mainStage.principaleMatches,
    mainStage.consolanteMatches,
    knockout.principalQuarters,
    knockout.principalSemis,
    knockout.principalFinals,
    knockout.consolanteQuarters,
    knockout.consolanteSemis,
    knockout.consolanteFinals,
    mainStageDistribution.directPrincipalSemis,
    mainStageDistribution.consolanteMode,
  ]);

  const filterRefereeVisibleMatches = useCallback((matches) => (
    dedupeMatches(Array.isArray(matches) ? matches : [])
      .filter((match) => hasBothTeamsDefined(match) && getMatchStatusLabel(match, phaseRules) !== 'Valide')
  ), [phaseRules]);

  const refereeMatchGroups = useMemo(() => (
    (isSmallTournamentMode ? [
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
      { title: 'Quarts principale', scope: 'principalQuarters', matches: filterRefereeVisibleMatches(knockout.principalQuarters), isUnlocked: knockout.principalQuarters.length > 0 && (!mainStage.principaleMatches.length || stageValidation.principalePoolsComplete), lockReason: 'Tous les scores des poules principales doivent être valides.' },
      { title: 'Demi-finales principale', scope: 'principalSemis', matches: filterRefereeVisibleMatches(knockout.principalSemis), isUnlocked: stageValidation.principalQuartersComplete, lockReason: 'Tous les scores des quarts de finale principaux doivent être valides.' },
      { title: 'Finales principale', scope: 'principalFinals', matches: filterRefereeVisibleMatches(knockout.principalFinals), isUnlocked: stageValidation.principalSemisComplete, lockReason: 'Tous les scores des demi-finales principales doivent être valides.' },
      { title: 'Quarts consolante', scope: 'consolanteQuarters', matches: filterRefereeVisibleMatches(knockout.consolanteQuarters), isUnlocked: stageValidation.consolantePoolsComplete, lockReason: 'Tous les scores des poules de consolante doivent être valides.' },
      { title: 'Demi-finales consolante', scope: 'consolanteSemis', matches: filterRefereeVisibleMatches(knockout.consolanteSemis), isUnlocked: knockout.consolanteQuarters.length > 0 ? stageValidation.consolanteQuartersComplete : stageValidation.consolantePoolsComplete, lockReason: knockout.consolanteQuarters.length > 0 ? 'Tous les scores des quarts de finale consolante doivent être valides.' : 'Tous les scores des poules de consolante doivent être valides.' },
      { title: 'Finales consolante', scope: 'consolanteFinals', matches: filterRefereeVisibleMatches(knockout.consolanteFinals), isUnlocked: stageValidation.consolanteSemisComplete, lockReason: 'Tous les scores des demi-finales de consolante doivent être valides.' },
    ])
      .filter((group) => Array.isArray(group.matches) && group.matches.length > 0)
  ), [isSmallTournamentMode, championshipLeg1.matches, championshipLeg2.matches, singleKnockout, visibleBrassage1Matches, visibleBrassage2Matches, visiblePrincipaleMatches, visibleConsolanteMatches, knockout, mainStage.principaleMatches.length, stageValidation, filterRefereeVisibleMatches, shouldSkipBrassage2]);

  const refereeSelectedEntry = useMemo(() => {
    if (!refereeSelectedMatch) return null;
    const group = refereeMatchGroups.find((item) => item.scope === refereeSelectedMatch.scope);
    if (!group) return null;
    const visibleMatch = group.matches.find((item) => item.id === refereeSelectedMatch.matchId);
    const fullScopeMatch = findMatchInScope(refereeSelectedMatch.scope, refereeSelectedMatch.matchId);
    const match = visibleMatch || fullScopeMatch || null;
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
    if (scope === 'consolanteQuarters') return knockoutRef.current?.consolanteQuarters || [];
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
    if (!refereeSelectedEntry?.match || !refereeSelectedEntry.match.id) {
      setRefereeSelectedScoreDraft(null);
      return;
    }
    const match = refereeSelectedEntry.match;
    const baseScoreA = match.submittedScoreA ?? '';
    const baseScoreB = match.submittedScoreB ?? '';
    setRefereeSelectedScoreDraft((current) => {
      if (current?.matchId === match.id) {
        return {
          ...current,
          submittedAt: current.submittedAt ?? match.submittedAt ?? null,
        };
      }
      return {
        matchId: match.id,
        scoreA: baseScoreA,
        scoreB: baseScoreB,
        submittedAt: match.submittedAt ?? null,
      };
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
    const allowedTabs = isSmallTournamentMode
      ? [
        'dashboard',
        'equipes',
        'championship',
        ...(singleKnockout.quarters.length > 0 || singleKnockout.semis.length > 0 || singleKnockout.finals.length > 0 ? ['finales'] : []),
        'export',
      ]
      : [
        'dashboard',
        'equipes',
        'brassage1',
        ...(shouldSkipBrassage2 ? [] : ['brassage2']),
        ...(visiblePrincipaleMatches.length > 0 ? ['principale'] : []),
        ...(visibleConsolanteMatches.length > 0 ? ['consolante'] : []),
        ...(
          knockout.principalQuarters.length > 0
          || knockout.principalSemis.length > 0
          || knockout.principalFinals.length > 0
          || (knockout.consolanteEighths || []).length > 0
    || knockout.consolanteQuarters.length > 0
    || knockout.consolanteSemis.length > 0
          || knockout.consolanteFinals.length > 0
          ? ['finales']
          : []
        ),
        'export',
      ];
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [
    isSmallTournamentMode,
    activeTab,
    shouldSkipBrassage2,
    visiblePrincipaleMatches.length,
    visibleConsolanteMatches.length,
    singleKnockout.quarters.length,
    singleKnockout.semis.length,
    singleKnockout.finals.length,
    knockout.principalQuarters.length,
    knockout.principalSemis.length,
    knockout.principalFinals.length,
    knockout.consolanteSemis.length,
    knockout.consolanteFinals.length,
  ]);

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

  const shouldHideRandomTeamsButton = useMemo(() => {
    const currentVisibleBrassage1Matches = filterMatchesToPools(brassage1.matches, brassage1.pools, 'Brassage 1');
    return currentVisibleBrassage1Matches.some((match) => getMatchStatusLabel(match, phaseRules) === 'Valide');
  }, [brassage1.matches, brassage1.pools, phaseRules]);

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
  const showGenerateBrassage1Button = useMemo(() => {
    if (isSmallTournamentMode) {
      return championshipLeg2.matches.length === 0;
    }
    return brassage2.matches.length === 0;
  }, [isSmallTournamentMode, championshipLeg2.matches.length, brassage2.matches.length]);


  const waitingTimeRowsBrassage1 = useMemo(() => (
    buildWaitingTimeRowsForPhase(brassage1.pools, brassage1.matches, resolveTeam)
  ), [brassage1.pools, brassage1.matches, teamMap]);

  const waitingTimeRowsBrassage2 = useMemo(() => (
    buildWaitingTimeRowsForPhase(brassage2.pools, brassage2.matches, resolveTeam)
  ), [brassage2.pools, brassage2.matches, teamMap]);

  const waitingTimeSectionData = useMemo(() => {
    const selectedScope = String(selectedBrassagePoolByScope?.brassage2 || selectedBrassageTeamByScope?.brassage2 || '').trim();
    const brassage2IsSelected =
      activeTab === 'brassage2' ||
      selectedScope.length > 0 ||
      (brassage2.matches.length > 0 && brassage1.matches.length > 0 && activeTab !== 'dashboard');

    const defaultPhase = brassage2IsSelected && brassage2.matches.length > 0 ? 'brassage2' : 'brassage1';
    const requestedPhase = waitingTimePhaseView === 'auto' ? defaultPhase : waitingTimePhaseView;
    const resolvedPhase =
      requestedPhase === 'brassage2' && brassage2.matches.length > 0
        ? 'brassage2'
        : 'brassage1';

    if (resolvedPhase === 'brassage2' && brassage2.matches.length > 0) {
      return {
        title: 'Temps d\'attente — Brassage 2',
        rows: waitingTimeRowsBrassage2,
        phase: 'brassage2',
        canToggle: brassage1.matches.length > 0,
        toggleLabel: 'Voir Brassage 1',
      };
    }

    if (brassage1.matches.length > 0) {
      return {
        title: 'Temps d\'attente — Brassage 1',
        rows: waitingTimeRowsBrassage1,
        phase: 'brassage1',
        canToggle: brassage2.matches.length > 0,
        toggleLabel: 'Voir Brassage 2',
      };
    }

    return {
      title: 'Temps d\'attente',
      rows: [],
      phase: 'brassage1',
      canToggle: false,
      toggleLabel: '',
    };
  }, [
    activeTab,
    brassage1.matches.length,
    brassage2.matches.length,
    selectedBrassagePoolByScope,
    selectedBrassageTeamByScope,
    waitingTimePhaseView,
    waitingTimeRowsBrassage1,
    waitingTimeRowsBrassage2,
  ]);

  useEffect(() => {
    if (waitingTimePhaseView === 'brassage2' && brassage2.matches.length === 0) {
      setWaitingTimePhaseView('brassage1');
    }
    if (waitingTimePhaseView === 'brassage1' && brassage1.matches.length === 0) {
      setWaitingTimePhaseView(brassage2.matches.length > 0 ? 'brassage2' : 'auto');
    }
  }, [waitingTimePhaseView, brassage1.matches.length, brassage2.matches.length]);

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
    const isDefaultPasswordValid = normalizedAttempt === MASTER_PASSWORD;
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
      teams: resetLevelsToL ? defaultTeamsAllLevelL() : defaultTeams(18),
      settings: {
        startTime: '09:00',
        slotDuration: 20,
        phaseRules: safeClone(DEFAULT_PHASE_RULES, DEFAULT_PHASE_RULES),
        organizerPassword: nextOrganizerPassword,
        tournamentName: DEFAULT_TOURNAMENT_NAME,
        tournamentLogo: '',
        sharedTournamentId: nextSharedTournamentId,
        disableBrassage2: false,
        courtCount: DEFAULT_COURT_COUNT,
      },
      meta: { createdAt: new Date().toISOString(), lastSavedAt: '', remoteSavedAt: '', lastAutomaticSaveFilename: '' },
      brassage1: { pools: [], matches: [] },
      brassage2: { pools: [], matches: [] },
      mainStage: { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] },
      knockout: { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] },
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
      meta: { lastSavedAt: resetStartedAt, remoteSavedAt: '', lastAutomaticSaveFilename: '' },
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
    setKnockout({ principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] });
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


  function forceGenerateThirtySixFinalStagesAfterRandomScores() {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (currentTeamCount !== 36) return false;

    let progressed = false;
      try { if (tryProgressPrincipalAfterRandomScores()) progressed = true; } catch {}
    if (!(knockoutRef.current?.principalEighths || []).length) {
      progressed = generateThirtySixPrincipalEighths({ silent: true }) || progressed;
    }
    if (!(knockoutRef.current?.consolanteEighths || []).length) {
      progressed = generateThirtySixConsolanteEighths({ silent: true }) || progressed;
    }
    return progressed;
  }


  function forceGenerateNineTeamStagesAfterRandomScores() {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (currentTeamCount !== 9 && currentTeamCount !== 10) return false;

    let progressed = false;

    try {
      const leg1Matches = championshipLeg1Ref.current?.matches || [];
      const leg2Matches = championshipLeg2Ref.current?.matches || [];
      const allerComplete = leg1Matches.length > 0 && leg1Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      const retourMissing = leg2Matches.length === 0;
      if (allerComplete && retourMissing && typeof generateBrassage2 === 'function') {
        generateBrassage2();
        progressed = true;
      }
    } catch {}

    try {
      if (forceSmallChampionshipQuartersIfReady({ silent: true })) {
        progressed = true;
      }
    } catch {}

    return progressed;
  }


  function randomizeSmallChampionshipTournamentScores() {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (currentTeamCount !== 8 && currentTeamCount !== 9 && currentTeamCount !== 10 && currentTeamCount !== 10) return false;

    const rules = phaseRulesRef.current || phaseRules;
    const fillScope = (scope, matches) => {
      const safeMatches = Array.isArray(matches) ? matches : [];
      if (!safeMatches.some((match) => getMatchStatusLabel(match, rules) !== 'Valide')) return false;
      applyRandomScores(scope);
      return true;
    };

    if (fillScope('championshipLeg1', championshipLeg1Ref.current?.matches)) return true;

    const leg1Complete = (championshipLeg1Ref.current?.matches || []).length > 0
      && (championshipLeg1Ref.current?.matches || []).every((match) => getMatchStatusLabel(match, rules) === 'Valide');

    if (leg1Complete && !(championshipLeg2Ref.current?.matches || []).length) {
      generateBrassage2();
      return true;
    }

    if (fillScope('championshipLeg2', championshipLeg2Ref.current?.matches)) return true;

    if (typeof forceSmallChampionshipQuartersIfReady === 'function' && forceSmallChampionshipQuartersIfReady({ silent: true })) return true;
    if (typeof forceNineTeamFinalsIfReady === 'function' && forceNineTeamFinalsIfReady({ silent: true })) return true;

    if (fillScope('quarters', singleKnockoutRef.current?.quarters)) return true;

    const quartersComplete = (singleKnockoutRef.current?.quarters || []).length > 0
      && (singleKnockoutRef.current?.quarters || []).every((match) => getMatchStatusLabel(match, rules) === 'Valide');
    if (quartersComplete && !(singleKnockoutRef.current?.semis || []).length) {
      generateSmallKnockoutStage2();
      return true;
    }

    if (fillScope('semis', singleKnockoutRef.current?.semis)) return true;

    const semisComplete = (singleKnockoutRef.current?.semis || []).length > 0
      && (singleKnockoutRef.current?.semis || []).every((match) => getMatchStatusLabel(match, rules) === 'Valide');
    if (semisComplete && !(singleKnockoutRef.current?.finals || []).length) {
      generateSmallKnockoutStage3();
      return true;
    }

    if (fillScope('finals', singleKnockoutRef.current?.finals)) return true;

    return false;
  }


  function tryProgressPrincipalAfterRandomScores() {
    let progressed = false;
    try {
      const currentKnockout = knockoutRef.current || {};
      const principalQuarters = currentKnockout.principalQuarters || [];
      const principalSemis = currentKnockout.principalSemis || [];
      const principalFinals = currentKnockout.principalFinals || [];

      const quartersComplete = principalQuarters.length > 0
        && principalQuarters.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      const semisComplete = principalSemis.length > 0
        && principalSemis.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');

      if (quartersComplete && principalSemis.length === 0 && typeof generatePrincipalSemis === 'function') {
        generatePrincipalSemis();
        progressed = true;
      }

      if (semisComplete && principalFinals.length === 0 && typeof generatePrincipalFinals === 'function') {
        generatePrincipalFinals();
        progressed = true;
      }
    } catch (error) {
      console.error('Erreur progression principale score aléatoire', error);
    }
    return progressed;
  }


  function hasPlayablePendingMatches(matches) {
    return Array.isArray(matches)
      && matches.some((match) => getMatchStatusLabel(match, phaseRulesRef.current) !== 'Valide');
  }

  function fillRandomScope(scope, matches) {
    if (!hasPlayablePendingMatches(matches)) return false;
    applyRandomScores(scope);
    return true;
  }

  function fillFirstPendingScopeForRandomScore() {
    const scopeOrder = [
      ['championshipLeg1', championshipLeg1Ref.current?.matches],
      ['championshipLeg2', championshipLeg2Ref.current?.matches],
      ['brassage1', brassage1Ref.current?.matches],
      ['brassage2', brassage2Ref.current?.matches],
      ['principale', mainStageRef.current?.principaleMatches],
      ['consolante', mainStageRef.current?.consolanteMatches],
      ['principalEighths', knockoutRef.current?.principalEighths],
      ['principalQuarters', knockoutRef.current?.principalQuarters],
      ['principalSemis', knockoutRef.current?.principalSemis],
      ['principalFinals', knockoutRef.current?.principalFinals],
      ['consolanteEighths', knockoutRef.current?.consolanteEighths],
      ['consolanteQuarters', knockoutRef.current?.consolanteQuarters],
      ['consolanteSemis', knockoutRef.current?.consolanteSemis],
      ['consolanteFinals', knockoutRef.current?.consolanteFinals],
      ['quarters', singleKnockoutRef.current?.quarters],
      ['semis', singleKnockoutRef.current?.semis],
      ['finals', singleKnockoutRef.current?.finals],
    ];
    for (const [scope, matches] of scopeOrder) {
      if (fillRandomScope(scope, matches)) return true;
    }
    return false;
  }

  function progressStructureForRandomScore() {
    let progressed = false;
    const rules = phaseRulesRef.current;

    try {
      const b1Matches = brassage1Ref.current?.matches || [];
      const b2Matches = brassage2Ref.current?.matches || [];
      const b1Complete = b1Matches.length > 0 && b1Matches.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      if (b1Complete && b2Matches.length === 0 && typeof generateBrassage2 === 'function') {
        generateBrassage2();
        progressed = true;
      }
    } catch (error) { console.error('Progression Brassage 1 → Brassage 2', error); }

    try {
      const c1Matches = championshipLeg1Ref.current?.matches || [];
      const c2Matches = championshipLeg2Ref.current?.matches || [];
      const c1Complete = c1Matches.length > 0 && c1Matches.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      if (c1Complete && c2Matches.length === 0 && typeof generateBrassage2 === 'function') {
        generateBrassage2();
        progressed = true;
      }
    } catch (error) { console.error('Progression Championnat Aller → Retour', error); }

    try { if (typeof generateQuartersIfFinalsStartAtQuarters === 'function' && generateQuartersIfFinalsStartAtQuarters({ silent: true })) progressed = true; } catch (error) { console.error('Progression quarts directs', error); }
    try { if (typeof stableGenerateAfterBrassage2 === 'function' && stableGenerateAfterBrassage2({ silent: true })) progressed = true; } catch (error) { console.error('Progression Brassage 2', error); }

    try {
      const singleQuarters = singleKnockoutRef.current?.quarters || [];
      const singleSemis = singleKnockoutRef.current?.semis || [];
      const singleFinals = singleKnockoutRef.current?.finals || [];
      const singleQuartersComplete = singleQuarters.length > 0 && singleQuarters.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      const singleSemisComplete = singleSemis.length > 0 && singleSemis.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      if (singleQuartersComplete && singleSemis.length === 0 && typeof generateSmallKnockoutStage2 === 'function') {
        generateSmallKnockoutStage2();
        progressed = true;
      }
      if (singleSemisComplete && singleFinals.length === 0 && typeof generateSmallKnockoutStage3 === 'function') {
        generateSmallKnockoutStage3();
        progressed = true;
      }
    } catch (error) { console.error('Progression petit tableau', error); }

    try {
      const principalQuarters = knockoutRef.current?.principalQuarters || [];
      const principalSemis = knockoutRef.current?.principalSemis || [];
      const principalFinals = knockoutRef.current?.principalFinals || [];
      const quartersComplete = principalQuarters.length > 0 && principalQuarters.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      const semisComplete = principalSemis.length > 0 && principalSemis.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      if (quartersComplete && principalSemis.length === 0 && typeof generatePrincipalSemis === 'function') {
        generatePrincipalSemis();
        progressed = true;
      }
      if (semisComplete && principalFinals.length === 0 && typeof generatePrincipalFinals === 'function') {
        generatePrincipalFinals();
        progressed = true;
      }
    } catch (error) { console.error('Progression principale', error); }

    try {
      const consolanteQuarters = knockoutRef.current?.consolanteQuarters || [];
      const consolanteSemis = knockoutRef.current?.consolanteSemis || [];
      const consolanteFinals = knockoutRef.current?.consolanteFinals || [];
      const quartersComplete = consolanteQuarters.length > 0 && consolanteQuarters.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      const semisComplete = consolanteSemis.length > 0 && consolanteSemis.every((match) => getMatchStatusLabel(match, rules) === 'Valide');
      if (quartersComplete && consolanteSemis.length === 0 && typeof generateConsolanteSemis === 'function') {
        generateConsolanteSemis();
        progressed = true;
      }
      if (semisComplete && consolanteFinals.length === 0 && typeof generateConsolanteFinals === 'function') {
        generateConsolanteFinals();
        progressed = true;
      }
    } catch (error) { console.error('Progression consolante', error); }

    return progressed;
  }

  function randomizeTournamentUntilStable() {
    const MAX_RANDOM_STEPS = 120;
    let changed = false;

    for (let step = 0; step < MAX_RANDOM_STEPS; step += 1) {
      if (fillFirstPendingScopeForRandomScore()) {
        changed = true;
        continue;
      }
      if (progressStructureForRandomScore()) {
        changed = true;
        continue;
      }
      break;
    }

    return changed;
  }

  function randomizeCurrentPhaseScores() {
    const changed = randomizeTournamentUntilStable();
    if (!changed) {
      window.alert('Aucun match à remplir automatiquement pour le moment.');
    }
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
    const activeTeamsCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (activeTeamsCount <= MIN_TEAM_TARGET) {
      window.alert('Le tournoi doit conserver au minimum 15 équipes.');
      return;
    }

    const mutationTimestamp = markPendingLocalMutation(new Date().toISOString());
    setTeams((current) => current.filter((team) => team.id !== teamId));
    setBrassage1({ pools: [], matches: [] });
    setBrassage2({ pools: [], matches: [] });
    setMainStage({ principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] });
    setKnockout({ principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] });
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
      meta: { lastSavedAt: resetStartedAt, remoteSavedAt: '', lastAutomaticSaveFilename: '' },
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
    const readyTeamsCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (readyTeamsCount < MIN_TEAM_TARGET) {
      window.alert('Il faut au minimum 15 équipes pour générer le tournoi.');
      return;
    }

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
      setKnockout({ principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] });
      setActiveTab('championship');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      triggerAutomaticBackup({
        phaseName: 'Championnat Aller',
        championshipLeg1: { pools, matches },
        championshipLeg2: { pools: [], matches: [] },
        singleKnockout: { quarters: [], semis: [], finals: [] },
        brassage1: { pools: [], matches: [] },
        brassage2: { pools: [], matches: [] },
        mainStage: { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] },
        knockout: { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] },
      });
      return true;
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
    const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
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
    triggerAutomaticBackup({
      phaseName: 'Brassage 1',
      brassage1: nextBrassage1,
      brassage2: nextBrassage2,
      mainStage: nextMainStage,
      knockout: nextKnockout,
      championshipLeg1: nextChampionshipLeg1,
      championshipLeg2: nextChampionshipLeg2,
      singleKnockout: nextSingleKnockout,
    });
  }


  function tryAutoGenerateBrassage2Silently() {
    if (isSmallTournamentMode || shouldSkipBrassage2) return false;

    const currentBrassage1 = brassage1Ref.current;
    const currentBrassage2 = brassage2Ref.current;
    if (!currentBrassage1 || (currentBrassage1.matches || []).length === 0) return false;
    if ((currentBrassage2?.matches || []).length > 0 || (currentBrassage2?.pools || []).length > 0) return false;

    const currentVisibleBrassage1Matches = filterMatchesToPools(currentBrassage1.matches, currentBrassage1.pools, 'Brassage 1');
    const brassage1PoolChecks = (currentBrassage1.pools || []).map((pool) => {
      const teamIds = Array.isArray(pool?.teamIds) ? pool.teamIds.filter(Boolean) : [];
      const expectedMatchCount = teamIds.length === 2 ? 2 : (teamIds.length >= 2 ? (teamIds.length * (teamIds.length - 1)) / 2 : 0);
      const poolMatches = dedupeMatches((currentBrassage1.matches || []).filter((match) => {
        if (match?.phase !== 'Brassage 1') return false;
        return teamIds.includes(match.teamAId) && teamIds.includes(match.teamBId);
      }));
      const validMatches = poolMatches.filter((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      return {
        pool,
        expectedMatchCount,
        validMatchCount: validMatches.length,
        isReady: expectedMatchCount === 0 || validMatches.length >= expectedMatchCount,
      };
    });

    const brassage1Complete = brassage1PoolChecks.length > 0 && brassage1PoolChecks.every((entry) => entry.isReady);
    if (!brassage1Complete) return false;

    const { teamMap: currentTeamMap } = buildCurrentTeamContext();
    const normalizeBrassageRanking = activeTeams.length >= 13 && activeTeams.length <= 17;
    const standings = computeGroupStandings(
      currentBrassage1.pools,
      currentVisibleBrassage1Matches,
      currentTeamMap,
      phaseRulesRef.current,
      { normalizeByMatches: normalizeBrassageRanking },
    );

    const pools = createBrassage2PoolsFromBrassage1(
      currentBrassage1.pools,
      standings,
      createNumberedNames('Brassage 2 - Poule', currentBrassage1.pools.length || 6)
    );
    const matches = scheduleBrassageMatches(pools, 'Brassage 2', stageSlotCount(currentBrassage1.matches.length));
    const nextBrassage2 = { pools, matches };
    const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
    const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };

    brassage2Ref.current = nextBrassage2;
    mainStageRef.current = nextMainStage;
    knockoutRef.current = nextKnockout;
    setBrassage2(nextBrassage2);
    setMainStage(nextMainStage);
    setKnockout(nextKnockout);
    setActiveTab('brassage2');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({
      phaseName: 'Brassage 2',
      brassage2: nextBrassage2,
      mainStage: nextMainStage,
      knockout: nextKnockout,
    });
    return true;
  }



  function forceSmallChampionshipQuartersIfReady(options = {}) {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (![8, 9, 10].includes(currentTeamCount)) return false;

    const leg1 = championshipLeg1Ref.current || { pools: [], matches: [] };
    const leg2 = championshipLeg2Ref.current || { pools: [], matches: [] };
    const currentSingle = singleKnockoutRef.current || { quarters: [], semis: [], finals: [] };

    if ((currentSingle.quarters || []).length > 0 || (currentSingle.semis || []).length > 0 || (currentSingle.finals || []).length > 0) return false;

    const leg1Matches = Array.isArray(leg1.matches) ? leg1.matches : [];
    const leg2Matches = Array.isArray(leg2.matches) ? leg2.matches : [];
    const finalLegMatches = leg2Matches.length > 0 ? leg2Matches : leg1Matches;

    if (finalLegMatches.length === 0) return false;

    const finalLegComplete = finalLegMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!finalLegComplete) {
      if (!options?.silent && typeof window !== 'undefined') {
        window.alert(leg2Matches.length > 0
          ? 'Tous les scores du Championnat Retour doivent être valides avant de générer les quarts de finale.'
          : 'Tous les scores du Championnat Aller doivent être valides avant de générer les quarts de finale.');
      }
      return false;
    }

    const activeTeamIds = teamsRef.current.filter((team) => team.name.trim()).map((team) => team.id).filter(Boolean);
    const teamIds = (leg2.pools?.[0]?.teamIds || leg1.pools?.[0]?.teamIds || activeTeamIds).filter(Boolean);
    const { teamMap } = buildCurrentTeamContext();
    const allMatches = leg2Matches.length > 0 ? [...leg1Matches, ...leg2Matches] : leg1Matches;

    const rankedIds = computeRanking(teamIds, allMatches, teamMap, phaseRulesRef.current, { normalizeByMatches: false })
      .map((row) => row.teamId)
      .filter(Boolean)
      .slice(0, 8);

    if (rankedIds.length < 8) {
      if (!options?.silent && typeof window !== 'undefined') {
        window.alert('Impossible de générer les quarts : il faut 8 équipes classées.');
      }
      return false;
    }

    const startSlot = stageSlotCount(leg1Matches.length) + stageSlotCount(leg2Matches.length);
    const nextSingleKnockout = {
      ...currentSingle,
      quarters: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(
        buildQuarterMatchesFromRanking(rankedIds),
        startSlot,
        getCourtNumbers(CURRENT_COURT_COUNT),
      ))),
      semis: [],
      finals: [],
    };

    singleKnockoutRef.current = nextSingleKnockout;
    setSingleKnockout(nextSingleKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Quarts de finale', singleKnockout: nextSingleKnockout });
    return true;
  }

  function forceNineTeamFinalsIfReady(options = {}) {
    return forceSmallChampionshipQuartersIfReady(options);
  }

  function generateNineTeamFinalsFromChampionshipReturn(options = {}) {
    return forceSmallChampionshipQuartersIfReady(options);
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
      triggerAutomaticBackup({
        phaseName: 'Championnat Retour',
        championshipLeg2: nextChampionshipLeg2,
        singleKnockout: nextSingleKnockout,
      });
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
    const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
    brassage2Ref.current = nextBrassage2;
    mainStageRef.current = nextMainStage;
    knockoutRef.current = nextKnockout;
    setBrassage2(nextBrassage2);
    setMainStage(nextMainStage);
    setKnockout(nextKnockout);
    setActiveTab('brassage2');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({
      phaseName: 'Brassage 2',
      brassage2: nextBrassage2,
      mainStage: nextMainStage,
      knockout: nextKnockout,
    });
    } catch (error) {
      console.error('Erreur lors de la génération du Brassage 2', error);
      window.alert(`Impossible de générer le Brassage 2 : ${error?.message || 'erreur interne'}.`);
    }
      return true;
}


  function generateSmallKnockoutStage1() {
    if (forceSmallChampionshipQuartersIfReady()) return;

    if (forceNineTeamFinalsIfReady()) return;

    if (generateNineTeamFinalsFromChampionshipReturn()) return;

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
    triggerAutomaticBackup({ phaseName: 'Phase finale', singleKnockout: singleKnockoutRef.current });
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
    triggerAutomaticBackup({ phaseName: 'Phase finale', singleKnockout: nextSingleKnockout });
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
    triggerAutomaticBackup({ phaseName: 'Phase finale', singleKnockout: nextSingleKnockout });
  }


  function stableGenerateAfterBrassage2(options = {}) {
    const activeCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (activeCount >= 3 && activeCount <= 9) return false;

    const b2Matches = brassage2Ref.current?.matches || [];
    const b2Complete = b2Matches.length > 0 && b2Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!b2Complete) return false;

    const hasMainStage = (mainStageRef.current?.principaleMatches?.length || 0) > 0
      || (mainStageRef.current?.consolanteMatches?.length || 0) > 0
      || (mainStageRef.current?.principalePools?.length || 0) > 0
      || (mainStageRef.current?.consolantePools?.length || 0) > 0;

    if (hasMainStage) return false;

    try {
      const generated = generateMainStage(false);
      return generated !== false;
    } catch (error) {
      console.error('Erreur Brassage 2 → phase suivante', error);
      if (!options?.silent && typeof window !== 'undefined') {
        window.alert('Erreur lors de la génération de la phase suivante.');
      }
      return false;
    }
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
      return false;
    }
    const sourceComplete = useDirectBrassage1ToMainStage
      ? (currentVisibleBrassage1Matches.length > 0 && currentVisibleBrassage1Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'))
      : (currentVisibleBrassage2Matches.length > 0 && currentVisibleBrassage2Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'));
    if (!sourceComplete) {
      window.alert(useDirectBrassage1ToMainStage
        ? 'Tous les scores du Brassage 1 doivent être valides avant de générer la phase suivante.'
        : 'Tous les scores du Brassage 2 doivent être valides avant de générer la phase suivante.');
      return false;
    }
    if (!confirmClearStageScores([
      ...currentMainStage.principaleMatches,
      ...currentMainStage.consolanteMatches,
      ...knockoutRef.current.principalQuarters,
      ...knockoutRef.current.principalSemis,
      ...knockoutRef.current.principalFinals,
      ...knockoutRef.current.consolanteSemis,
      ...knockoutRef.current.consolanteFinals,
    ], 'la principale / consolante et les phases finales')) return false;
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
      const principalQuarters = stampGeneratedMatches(forcePrincipalQuarterThreeCourts(assignScheduleWithCourts(
        buildQuarterMatchesFromRanking(rankedIds.slice(0, 8)),
        stageSlotCount(currentBrassage1.matches.length) + (useDirectBrassage1ToMainStage ? 0 : stageSlotCount(currentBrassage2.matches.length)),
        getPrincipalQuarterCourts(CURRENT_COURT_COUNT),
      ), CURRENT_COURT_COUNT));
      const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
      const nextKnockout = { principalQuarters, principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
      mainStageRef.current = nextMainStage;
      knockoutRef.current = nextKnockout;
      setMainStage(nextMainStage);
      setKnockout(nextKnockout);
      setActiveTab('finales');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      triggerAutomaticBackup({ phaseName: 'Principale-Consolante', mainStage: nextMainStage, knockout: nextKnockout });
      return true;
    }

    if (currentTeamIds.length === 12) {
      const startSlot = stageSlotCount(currentBrassage1.matches.length) + (useDirectBrassage1ToMainStage ? 0 : stageSlotCount(currentBrassage2.matches.length));
      const principalQuarters = stampGeneratedMatches(forcePrincipalQuarterThreeCourts(assignScheduleWithCourts(
        buildQuarterMatchesFromRanking(rankedIds.slice(0, 8)),
        startSlot,
        getPrincipalQuarterCourts(CURRENT_COURT_COUNT),
      ), CURRENT_COURT_COUNT));
      const consolantePools = createChampionshipPool(rankedIds.slice(8, 12), CONSOLANTE_POOL_NAMES[0]);
      const consolanteMatches = stampGeneratedMatches(scheduleMainStageMatches([], consolantePools, startSlot).filter((match) => match.phase === 'Consolante'));
      const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools, consolanteMatches };
      const nextKnockout = { principalQuarters, principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
      mainStageRef.current = nextMainStage;
      knockoutRef.current = nextKnockout;
      setMainStage(nextMainStage);
      setKnockout(nextKnockout);
      setActiveTab(consolanteMatches.length > 0 ? 'consolante' : 'finales');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      triggerAutomaticBackup({ phaseName: 'Principale-Consolante', mainStage: nextMainStage, knockout: nextKnockout });
      return true;
    }

    if (currentTeamIds.length === 11) {
      const startSlot = stageSlotCount(currentBrassage1.matches.length) + (useDirectBrassage1ToMainStage ? 0 : stageSlotCount(currentBrassage2.matches.length));
      const principalQuarters = stampGeneratedMatches(forcePrincipalQuarterThreeCourts(assignScheduleWithCourts(
        buildQuarterMatchesFromRanking(rankedIds.slice(0, 8)),
        startSlot,
        getPrincipalQuarterCourts(CURRENT_COURT_COUNT),
      ), CURRENT_COURT_COUNT));
      const consolantePools = createPools(rankedIds.slice(8, 11), [CONSOLANTE_POOL_NAMES[0]]);
      const consolanteMatches = stampGeneratedMatches(scheduleMainStageMatches([], consolantePools, startSlot).filter((match) => match.phase === 'Consolante'));
      const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools, consolanteMatches };
      const nextKnockout = { principalQuarters, principalSemis: [], principalFinals: [], consolanteSemis: [], consolanteFinals: [] };
      mainStageRef.current = nextMainStage;
      knockoutRef.current = nextKnockout;
      setMainStage(nextMainStage);
      setKnockout(nextKnockout);
      setActiveTab('finales');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      triggerAutomaticBackup({ phaseName: 'Principale-Consolante', mainStage: nextMainStage, knockout: nextKnockout });
      return true;
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
    const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
    mainStageRef.current = nextMainStage;
    knockoutRef.current = nextKnockout;
    setMainStage(nextMainStage);
    setKnockout(nextKnockout);
    setActiveTab(nextMainStage.principaleMatches.length > 0 ? 'principale' : (nextMainStage.consolanteMatches.length > 0 ? 'consolante' : 'finales'));
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Principale-Consolante', mainStage: nextMainStage, knockout: nextKnockout });
    return true;
  }


  function generateThirtySixPrincipalEighths(options = {}) {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (currentTeamCount !== 36) return false;
    const currentMainStage = mainStageRef.current;
    const currentKnockout = normalizeKnockoutState(knockoutRef.current);

    const visibleMatches = filterMatchesToPools(currentMainStage.principaleMatches || [], currentMainStage.principalePools || [], 'Principale');
    const complete = visibleMatches.length > 0 && visibleMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!complete) {
      if (!options?.silent) {
        window.alert('Tous les scores des poules principales doivent être valides avant de générer les huitièmes de finale principale.');
      }
      return false;
    }

    if ((currentKnockout.principalEighths || []).length > 0) return false;

    const ranking = computeRanking(
      collectUniquePoolTeamIds(currentMainStage.principalePools),
      visibleMatches,
      buildCurrentTeamContext().teamMap,
      phaseRulesRef.current,
      { normalizeByMatches: false },
    ).map((row) => row.teamId).filter(Boolean).slice(0, 16);

    const stageStartSlot = stageSlotCount(brassage1Ref.current.matches.length)
      + stageSlotCount(brassage2Ref.current.matches.length)
      + stageSlotCount((currentMainStage.principaleMatches || []).length + (currentMainStage.consolanteMatches || []).length);

    const nextKnockout = {
      ...currentKnockout,
      principalEighths: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(
        buildEighthMatchesFromRanking(ranking, 'Tableau principal'),
        stageStartSlot,
        getPrincipalQuarterCourts(CURRENT_COURT_COUNT),
      ))),
      principalQuarters: [],
      principalSemis: [],
      principalFinals: [],
    };

    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Huitièmes principale', knockout: nextKnockout });
    return true;
  }

  function generateThirtySixConsolanteEighths(options = {}) {
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (currentTeamCount !== 36) return false;
    const currentMainStage = mainStageRef.current;
    const currentKnockout = normalizeKnockoutState(knockoutRef.current);

    const visibleMatches = filterMatchesToPools(currentMainStage.consolanteMatches || [], currentMainStage.consolantePools || [], 'Consolante');
    const complete = visibleMatches.length > 0 && visibleMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!complete) {
      if (!options?.silent) {
        window.alert('Tous les scores des poules de consolante doivent être valides avant de générer les huitièmes de finale consolante.');
      }
      return false;
    }

    if ((currentKnockout.consolanteEighths || []).length > 0) return false;

    const ranking = computeRanking(
      collectUniquePoolTeamIds(currentMainStage.consolantePools),
      visibleMatches,
      buildCurrentTeamContext().teamMap,
      phaseRulesRef.current,
      { normalizeByMatches: false },
    ).map((row) => row.teamId).filter(Boolean).slice(0, 16);

    const stageStartSlot = stageSlotCount(brassage1Ref.current.matches.length)
      + stageSlotCount(brassage2Ref.current.matches.length)
      + stageSlotCount((currentMainStage.principaleMatches || []).length + (currentMainStage.consolanteMatches || []).length);

    const nextKnockout = {
      ...currentKnockout,
      consolanteEighths: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(
        buildEighthMatchesFromRanking(ranking, 'Tableau consolante'),
        stageStartSlot,
        splitCourtsByStage(CURRENT_COURT_COUNT).consolante,
      ))),
      consolanteQuarters: [],
      consolanteSemis: [],
      consolanteFinals: [],
    };

    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Huitièmes consolante', knockout: nextKnockout });
    return true;
  }


  function generateDirectPrincipalQuartersFromRanking(rankedIds, options = {}) {
    const ids = (Array.isArray(rankedIds) ? rankedIds : []).filter(Boolean).slice(0, 8);
    if (ids.length < 8) return false;

    if (!options?.force) {
      const teamCount = teamsRef.current.filter((team) => team.name.trim()).length;
      const b1Matches = brassage1Ref.current?.matches || [];
      const b2Matches = brassage2Ref.current?.matches || [];
      const c1Matches = championshipLeg1Ref.current?.matches || [];
      const c2Matches = championshipLeg2Ref.current?.matches || [];
      const allValid = (matches) => Array.isArray(matches) && matches.length > 0 && matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      const champReady = [8, 9, 10].includes(teamCount) && allValid(c1Matches) && allValid(c2Matches);
      const brassageReady = ![8, 9, 10].includes(teamCount) && allValid(b1Matches) && allValid(b2Matches);
      if (!champReady && !brassageReady) return false;
    }

    const currentKnockout = knockoutRef.current || {};
    const alreadyExists = (currentKnockout.principalQuarters || []).length > 0
      || (currentKnockout.principalSemis || []).length > 0
      || (currentKnockout.principalFinals || []).length > 0;
    if (alreadyExists && !options?.replaceExisting) return false;

    const startSlot = options?.startSlot ?? (
      stageSlotCount(brassage1Ref.current?.matches?.length || 0)
      + stageSlotCount(brassage2Ref.current?.matches?.length || 0)
      + stageSlotCount((mainStageRef.current?.principaleMatches?.length || 0) + (mainStageRef.current?.consolanteMatches?.length || 0))
    );

    const quarters = sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(
      buildQuarterMatchesFromRanking(ids),
      startSlot,
      getCourtNumbers(CURRENT_COURT_COUNT),
    )));

    const nextKnockout = {
      ...currentKnockout,
      principalEighths: [],
      principalQuarters: quarters,
      principalSemis: [],
      principalFinals: [],
    };

    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Quarts de finale principale', knockout: nextKnockout });
    return true;
  }

  function generateQuartersIfFinalsStartAtQuarters(options = {}) {
    const teamCount = teamsRef.current.filter((team) => team.name.trim()).length;

    const b1Matches = brassage1Ref.current?.matches || [];
    const b2Matches = brassage2Ref.current?.matches || [];
    const c1Matches = championshipLeg1Ref.current?.matches || [];
    const c2Matches = championshipLeg2Ref.current?.matches || [];

    const allValid = (matches) => Array.isArray(matches)
      && matches.length > 0
      && matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');

    const championnatComplet = allValid(c1Matches) && allValid(c2Matches);
    const brassageComplet = allValid(b1Matches) && allValid(b2Matches);

    if ([8, 9, 10].includes(teamCount)) {
      if (!championnatComplet) return false;
      if (typeof forceSmallChampionshipQuartersIfReady === 'function') {
        return forceSmallChampionshipQuartersIfReady(options);
      }
      return false;
    }

    if (teamCount < 13) {
      if (!brassageComplet) return false;

      const activeTeams = teamsRef.current.filter((team) => team.name.trim());
      const { teamMap } = buildCurrentTeamContext();
      const rankedIds = computeRanking(
        activeTeams.map((team) => team.id).filter(Boolean),
        [...b1Matches, ...b2Matches],
        teamMap,
        phaseRulesRef.current,
        { normalizeByMatches: false },
      ).map((row) => row.teamId).filter(Boolean).slice(0, 8);

      return generateDirectPrincipalQuartersFromRanking(rankedIds, {
        ...options,
        startSlot: stageSlotCount(b1Matches.length) + stageSlotCount(b2Matches.length),
        force: true,
      });
    }

    // >= 13 : les quarts directs ne sont autorisés que si le format généré commence vraiment par des quarts
    // et qu'aucune poule principale n'est en attente.
    if (!brassageComplet) return false;

    const mainStage = mainStageRef.current || {};
    const hasPrincipalPools = (mainStage.principalePools || []).length > 0;
    const hasPrincipalMatches = (mainStage.principaleMatches || []).length > 0;
    const hasPrincipalQuarters = (knockoutRef.current?.principalQuarters || []).length > 0;

    if (!hasPrincipalQuarters && !hasPrincipalPools && !hasPrincipalMatches) {
      const activeTeams = teamsRef.current.filter((team) => team.name.trim());
      const { teamMap } = buildCurrentTeamContext();
      const rankedIds = computeRanking(
        activeTeams.map((team) => team.id).filter(Boolean),
        [...b1Matches, ...b2Matches],
        teamMap,
        phaseRulesRef.current,
        { normalizeByMatches: false },
      ).map((row) => row.teamId).filter(Boolean).slice(0, 8);

      return generateDirectPrincipalQuartersFromRanking(rankedIds, {
        ...options,
        startSlot: stageSlotCount(b1Matches.length) + stageSlotCount(b2Matches.length),
        force: true,
      });
    }

    return false;
  }

  function generatePrincipalQuarters() {
    if (generateQuartersIfFinalsStartAtQuarters()) return true;

    if (generateThirtySixPrincipalEighths()) return true;
    const currentMainStage = mainStageRef.current;
    const currentKnockout = knockoutRef.current;
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    if (!currentMainStage.principalePools.length) { window.alert('Génère d’abord la principale.'); return; }
    const currentVisiblePrincipaleMatches = filterMatchesToPools(currentMainStage.principaleMatches, currentMainStage.principalePools, 'Principale');
    const currentDistribution = getMainStageDistribution(currentTeamCount);
    const principalePoolsComplete = currentVisiblePrincipaleMatches.length > 0 && currentVisiblePrincipaleMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
    if (!principalePoolsComplete) { window.alert('Tous les scores des poules principales doivent être valides avant de générer la phase suivante.'); return; }
    const { teamMap: currentTeamMap } = buildCurrentTeamContext();
    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
    if (currentTeamCount === 36) {
      const ranking = computeRanking(collectUniquePoolTeamIds(currentMainStage.principalePools), currentVisiblePrincipaleMatches, currentTeamMap, phaseRulesRef.current, { normalizeByMatches: false }).map((row) => row.teamId).filter(Boolean);
      if ((currentKnockout.principalEighths || []).length === 0) {
        const eighthsRaw = sanitizeKnockoutMatches(buildEighthMatchesFromRanking(ranking, 'Tableau principal'));
        const nextKnockout = { ...currentKnockout, principalEighths: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(eighthsRaw, stage1StartSlot, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)))), principalQuarters: [], principalSemis: [], principalFinals: [] };
        knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
      }
      if ((currentKnockout.principalQuarters || []).length === 0) {
        const eighths = sanitizeKnockoutMatches(currentKnockout.principalEighths || []);
        if (!(eighths.length === 8 && eighths.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'))) { window.alert('Tous les huitièmes de finale principaux doivent être valides avant de générer les quarts principale.'); return; }
        const quarterRaw = sanitizeKnockoutMatches(buildNextKnockoutRoundFromWinnerRanking(eighths, phaseRulesRef.current, currentTeamMap, 'Tableau principal', 'Quart'));
        const nextKnockout = { ...currentKnockout, principalQuarters: sanitizeKnockoutMatches(forcePrincipalQuarterThreeCourts(assignScheduleWithCourts(quarterRaw, stage1StartSlot + stageSlotCountForCourts(eighths.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)), getPrincipalQuarterCourts(CURRENT_COURT_COUNT)), CURRENT_COURT_COUNT)), principalSemis: [], principalFinals: [] };
        knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
      }
    }
    const currentPrincipaleStandings = computeGroupStandings(currentMainStage.principalePools, currentVisiblePrincipaleMatches, currentTeamMap, phaseRulesRef.current, { normalizeByMatches: currentDistribution.normalizedRanking });
    const pA = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'A');
    const pB = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'B');
    if (currentDistribution.directPrincipalSemis) {
      const raw = sanitizeKnockoutMatches([makeKnockoutMatch('Tableau principal', 'Demi 1', pA[0]?.teamId || null, pB[1]?.teamId || null), makeKnockoutMatch('Tableau principal', 'Demi 2', pB[0]?.teamId || null, pA[1]?.teamId || null)]);
      const nextKnockout = { ...currentKnockout, principalQuarters: [], principalSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(raw, stage1StartSlot, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)))), principalFinals: [] };
      knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
    }
    const pC = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'C');
    const pD = getStandingsRowsForPool(currentPrincipaleStandings, currentMainStage.principalePools, 'D');
    const raw = sanitizeKnockoutMatches([makeKnockoutMatch('Tableau principal', 'Quart 1', pA[0]?.teamId || null, pD[1]?.teamId || null), makeKnockoutMatch('Tableau principal', 'Quart 2', pB[0]?.teamId || null, pA[1]?.teamId || null), makeKnockoutMatch('Tableau principal', 'Quart 3', pC[0]?.teamId || null, pB[1]?.teamId || null), makeKnockoutMatch('Tableau principal', 'Quart 4', pD[0]?.teamId || null, pC[1]?.teamId || null)]);
    const nextKnockout = { ...currentKnockout, principalQuarters: sanitizeKnockoutMatches(stampGeneratedMatches(forcePrincipalQuarterThreeCourts(assignScheduleWithCourts(raw, stage1StartSlot, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)), CURRENT_COURT_COUNT))), principalSemis: [], principalFinals: [] };
    knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
  }

  function generateConsolanteSemis() {
    if (teamsRef.current.filter((team) => team.name.trim()).length === 36) {
      const currentMainStage = mainStageRef.current;
      const currentKnockout = knockoutRef.current;
      const currentVisibleConsolanteMatches = filterMatchesToPools(currentMainStage.consolanteMatches, currentMainStage.consolantePools, 'Consolante');
      const consolantePoolsComplete = currentVisibleConsolanteMatches.length > 0 && currentVisibleConsolanteMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
      if (!consolantePoolsComplete) { window.alert('Tous les scores des poules de consolante doivent être valides avant de générer les huitièmes de finale consolante.'); return false; }
      const { teamMap: currentTeamMap } = buildCurrentTeamContext();
      const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
      if ((currentKnockout.consolanteEighths || []).length === 0) {
        const ranking = computeRanking(collectUniquePoolTeamIds(currentMainStage.consolantePools), currentVisibleConsolanteMatches, currentTeamMap, phaseRulesRef.current, { normalizeByMatches: false }).map((row) => row.teamId).filter(Boolean);
        const raw = sanitizeKnockoutMatches(buildEighthMatchesFromRanking(ranking, 'Tableau consolante'));
        const nextKnockout = { ...currentKnockout, consolanteEighths: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(raw, stage1StartSlot, splitCourtsByStage(CURRENT_COURT_COUNT).consolante))), consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
        knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
      }
      if ((currentKnockout.consolanteQuarters || []).length === 0) {
        const eighths = sanitizeKnockoutMatches(currentKnockout.consolanteEighths || []);
        if (!(eighths.length === 8 && eighths.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'))) { window.alert('Tous les huitièmes de finale consolante doivent être valides avant de générer les quarts de finale consolante.'); return false; }
        const raw = sanitizeKnockoutMatches(buildNextKnockoutRoundFromWinnerRanking(eighths, phaseRulesRef.current, currentTeamMap, 'Tableau consolante', 'Quart'));
        const nextKnockout = { ...currentKnockout, consolanteQuarters: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(raw, stage1StartSlot + stageSlotCountForCourts(eighths.length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante), splitCourtsByStage(CURRENT_COURT_COUNT).consolante))), consolanteSemis: [], consolanteFinals: [] };
        knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
      }
      const quarters = sanitizeKnockoutMatches(currentKnockout.consolanteQuarters || []);
      if (!(quarters.length === 4 && quarters.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'))) { window.alert('Tous les quarts de finale consolante doivent être valides avant de générer les demi-finales consolante.'); return false; }
      const raw = sanitizeKnockoutMatches(buildNextKnockoutRoundFromWinnerRanking(quarters, phaseRulesRef.current, currentTeamMap, 'Tableau consolante', 'Demi'));
      const nextKnockout = { ...currentKnockout, consolanteSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(raw, stage1StartSlot + stageSlotCountForCourts((currentKnockout.consolanteEighths || []).length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante) + stageSlotCountForCourts(quarters.length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante), splitCourtsByStage(CURRENT_COURT_COUNT).consolante))), consolanteFinals: [] };
      knockoutRef.current = nextKnockout; setKnockout(nextKnockout); setActiveTab('finales'); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return true;
    }

    const currentMainStage = mainStageRef.current;
    const currentKnockout = knockoutRef.current;
    const currentTeamCount = teamsRef.current.filter((team) => team.name.trim()).length;
    const distribution = getMainStageDistribution(currentTeamCount);

    if (!currentMainStage.consolantePools.length) {
      window.alert('Génère d’abord la consolante.');
      return;
    }

    const currentVisibleConsolanteMatches = filterMatchesToPools(currentMainStage.consolanteMatches, currentMainStage.consolantePools, 'Consolante');
    const consolantePoolsComplete = currentVisibleConsolanteMatches.length > 0
      && currentVisibleConsolanteMatches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');

    if (distribution.consolanteMode === 'quarter-pools') {
      if (!consolantePoolsComplete) {
        window.alert('Tous les scores des poules de consolante doivent être valides avant de générer les quarts de finale consolante.');
        return false;
      }

      const consolanteTeamIds = collectUniquePoolTeamIds(currentMainStage.consolantePools);
      const currentOverallRanking = computeRanking(
        consolanteTeamIds,
        currentVisibleConsolanteMatches,
        buildCurrentTeamContext().teamMap,
        phaseRulesRef.current,
        { normalizeByMatches: true },
      );
      const rankedIds = currentOverallRanking.slice(0, 8).map((row) => row.teamId).filter(Boolean);

      if ((currentKnockout.consolanteQuarters || []).length === 0) {
        if (!confirmClearStageScores([
          ...(currentKnockout.consolanteQuarters || []),
          ...currentKnockout.consolanteSemis,
          ...currentKnockout.consolanteFinals,
        ], 'les quarts, demi-finales et finales de consolante')) return false;

        const quarterRaw = sanitizeKnockoutMatches(buildConsolanteQuarterMatchesFromRanking(rankedIds));
        const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length)
          + stageSlotCount(brassage2Ref.current.matches.length)
          + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);

        const nextKnockout = {
          ...currentKnockout,
          consolanteQuarters: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(quarterRaw, stage1StartSlot, splitCourtsByStage(CURRENT_COURT_COUNT).consolante))),
          consolanteSemis: [],
          consolanteFinals: [],
        };
        knockoutRef.current = nextKnockout;
        setKnockout(nextKnockout);
        setActiveTab('finales');
        markPendingStructureSync();
        queueBackgroundCloudSave(250);
        triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout });
        return true;
      }

      const currentConsolanteQuarters = sanitizeKnockoutMatches(currentKnockout.consolanteQuarters || []);
      const canGenerateConsolanteSemis = currentConsolanteQuarters.length > 0
        && currentConsolanteQuarters.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');

      if (!canGenerateConsolanteSemis) {
        window.alert('Tous les quarts de finale consolante doivent être valides avant de générer les demi-finales consolante.');
        return false;
      }

      if (!confirmClearStageScores([
        ...currentKnockout.consolanteSemis,
        ...currentKnockout.consolanteFinals,
      ], 'les demi-finales et finales de consolante')) return false;

      const semisRaw = sanitizeKnockoutMatches(buildConsolanteSemisFromQuarters(rankedIds, currentConsolanteQuarters, phaseRulesRef.current));
      const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length)
        + stageSlotCount(brassage2Ref.current.matches.length)
        + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
      const stage1Duration = Math.max(
        stageSlotCountForCourts(currentKnockout.principalQuarters.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)),
        stageSlotCountForCourts(currentConsolanteQuarters.length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante),
      );
      const startSlot = stage1StartSlot + stage1Duration;

      const nextKnockout = {
        ...currentKnockout,
        consolanteSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(semisRaw, startSlot, splitCourtsByStage(CURRENT_COURT_COUNT).consolante))),
        consolanteFinals: [],
      };
      knockoutRef.current = nextKnockout;
      setKnockout(nextKnockout);
      setActiveTab('finales');
      markPendingStructureSync();
      queueBackgroundCloudSave(250);
      triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout });
      return true;
    }

    if (!consolantePoolsComplete) {
      window.alert('Tous les scores des poules de consolante doivent être valides avant de générer les demi-finales consolante.');
      return false;
    }

    if (!confirmClearStageScores([
      ...currentKnockout.consolanteSemis,
      ...currentKnockout.consolanteFinals,
    ], 'les demi-finales et finales de consolante')) return false;

    const { teamMap: currentTeamMap } = buildCurrentTeamContext();
    const currentConsolanteStandings = computeGroupStandings(
      currentMainStage.consolantePools,
      currentVisibleConsolanteMatches,
      currentTeamMap,
      phaseRulesRef.current,
      { normalizeByMatches: distribution.normalizedRanking }
    );
    const isChampionshipConsolante = currentMainStage.consolantePools.length === 1 && (currentMainStage.consolantePools[0]?.teamIds?.length || 0) === 5;
    let consolanteSemisRaw;

    if (isChampionshipConsolante) {
      const ranking = currentConsolanteStandings[0]?.rows || [];
      consolanteSemisRaw = sanitizeKnockoutMatches([
        makeKnockoutMatch('Tableau consolante', 'Demi 1', ranking[0]?.teamId || null, ranking[3]?.teamId || null),
        makeKnockoutMatch('Tableau consolante', 'Demi 2', ranking[1]?.teamId || null, ranking[2]?.teamId || null),
      ]);
    } else {
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

    const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length)
      + stageSlotCount(brassage2Ref.current.matches.length)
      + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
    const consolanteSemis = stampGeneratedMatches(assignScheduleWithCourts(consolanteSemisRaw, stage1StartSlot, splitCourtsByStage(CURRENT_COURT_COUNT).consolante));
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
    triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout });
    return true;
  }

  function generatePrincipalSemis() {
    if (teamsRef.current.filter((team) => team.name.trim()).length === 36 && (knockoutRef.current?.principalEighths || []).length > 0) {
      const currentKnockout = knockoutRef.current;
      const currentMainStage = mainStageRef.current;
      const quarters = sanitizeKnockoutMatches(currentKnockout.principalQuarters || []);
      if (!(quarters.length === 4 && quarters.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide'))) { window.alert('Tous les quarts de finale principaux doivent être valides avant de générer les demi-finales principale.'); return; }
      const { teamMap: currentTeamMap } = buildCurrentTeamContext();
      const raw = sanitizeKnockoutMatches(buildNextKnockoutRoundFromWinnerRanking(quarters, phaseRulesRef.current, currentTeamMap, 'Tableau principal', 'Demi'));
      const stage1StartSlot = stageSlotCount(brassage1Ref.current.matches.length) + stageSlotCount(brassage2Ref.current.matches.length) + stageSlotCount(currentMainStage.principaleMatches.length + currentMainStage.consolanteMatches.length);
      const nextKnockout = { ...currentKnockout, principalSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(raw, stage1StartSlot + stageSlotCountForCourts((currentKnockout.principalEighths || []).length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)) + stageSlotCountForCourts(quarters.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)), getPrincipalQuarterCourts(CURRENT_COURT_COUNT)))), principalFinals: [] };
      knockoutRef.current = nextKnockout; setKnockout(nextKnockout); markPendingStructureSync(); queueBackgroundCloudSave(250); triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout }); return;
    }

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
      stageSlotCountForCourts(currentKnockout.principalQuarters.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)),
      stageSlotCountForCourts(currentKnockout.consolanteSemis.length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante),
    );
    const startSlot = stage1StartSlot + stage1Duration;
    const nextKnockout = {
      ...currentKnockout,
      principalSemis: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(principalSemisRaw, startSlot, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)))),
      principalFinals: [],
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout });
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
      stageSlotCountForCourts(currentKnockout.principalQuarters.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)),
      stageSlotCountForCourts((currentKnockout.consolanteQuarters || []).length > 0 ? currentKnockout.consolanteQuarters.length : currentConsolanteSemis.length, [3]),
    );
    const stage2StartsAfterSemis = (currentKnockout.consolanteQuarters || []).length > 0;
    const startSlot = stage2StartsAfterSemis
      ? stage1StartSlot + stage1Duration + stageSlotCountForCourts(currentConsolanteSemis.length, [3])
      : stage1StartSlot + stage1Duration;
    const nextKnockout = {
      ...currentKnockout,
      consolanteFinals: sanitizeKnockoutMatches(stampGeneratedMatches(assignScheduleWithCourts(consolanteFinalsRaw, startSlot, splitCourtsByStage(CURRENT_COURT_COUNT).consolante))),
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout });
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
      stageSlotCountForCourts(currentKnockout.principalQuarters.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)),
      stageSlotCountForCourts(currentKnockout.consolanteSemis.length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante),
    );
    const stage2Duration = Math.max(
      stageSlotCountForCourts(currentPrincipalSemis.length, getPrincipalQuarterCourts(CURRENT_COURT_COUNT)),
      stageSlotCountForCourts(currentKnockout.consolanteFinals.length, splitCourtsByStage(CURRENT_COURT_COUNT).consolante),
    );
    const startSlot = stage1StartSlot + stage1Duration + stage2Duration;
    const nextKnockout = {
      ...currentKnockout,
      principalFinals: stampGeneratedMatches(assignScheduleWithCourts(finalsRaw, startSlot, getPrincipalQuarterCourts(CURRENT_COURT_COUNT))),
    };
    knockoutRef.current = nextKnockout;
    setKnockout(nextKnockout);
    setActiveTab('finales');
    markPendingStructureSync();
    queueBackgroundCloudSave(250);
    triggerAutomaticBackup({ phaseName: 'Phases finales', knockout: nextKnockout });
  }

  function refreshLatestPersistedSnapshot(savedAt = new Date().toISOString()) {
    latestPersistedStateRef.current = getPersistedStateSnapshot(savedAt);
    if (typeof window !== 'undefined') {
      safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(latestPersistedStateRef.current));
    }
  }



  function requestArbitrageForMatch(match) {
    if (!match || isArbitrageRequestPending(match) || getMatchStatusLabel(match, phaseRulesRef.current) !== 'A saisir') return;
    const requestedMatch = makeArbitrageRequestMatch(match);
    updateMatchById(match.id, () => requestedMatch);
    if (typeof setSelectedRefereeMatch === 'function') setSelectedRefereeMatch(requestedMatch);
  }

  function updateMatchById(matchId, updater) {
    const updateMatches = (matches) => (Array.isArray(matches) ? matches.map((match) => (match.id === matchId ? updater(match) : match)) : matches);

    setChampionshipLeg1((current) => {
      const next = { ...current, matches: updateMatches(current.matches) };
      championshipLeg1Ref.current = next;
      return next;
    });
    setChampionshipLeg2((current) => {
      const next = { ...current, matches: updateMatches(current.matches) };
      championshipLeg2Ref.current = next;
      return next;
    });
    setBrassage1((current) => {
      const next = { ...current, matches: updateMatches(current.matches) };
      brassage1Ref.current = next;
      return next;
    });
    setBrassage2((current) => {
      const next = { ...current, matches: updateMatches(current.matches) };
      brassage2Ref.current = next;
      return next;
    });
    setMainStage((current) => {
      const next = { ...current, principaleMatches: updateMatches(current.principaleMatches), consolanteMatches: updateMatches(current.consolanteMatches) };
      mainStageRef.current = next;
      return next;
    });
    setKnockout((current) => {
      const next = {
        ...current,
        principalEighths: updateMatches(current.principalEighths),
        principalQuarters: updateMatches(current.principalQuarters),
        principalSemis: updateMatches(current.principalSemis),
        principalFinals: updateMatches(current.principalFinals),
        consolanteEighths: updateMatches(current.consolanteEighths),
        consolanteQuarters: updateMatches(current.consolanteQuarters),
        consolanteSemis: updateMatches(current.consolanteSemis),
        consolanteFinals: updateMatches(current.consolanteFinals),
      };
      knockoutRef.current = next;
      return next;
    });
    setSingleKnockout((current) => {
      const next = { ...current, quarters: updateMatches(current.quarters), semis: updateMatches(current.semis), finals: updateMatches(current.finals) };
      singleKnockoutRef.current = next;
      return next;
    });
    refreshLatestPersistedSnapshot();
    queueBackgroundCloudSave(250);
  }

  function acceptArbitrageRequest(matchId) {
    updateMatchById(matchId, (match) => ({
      ...match,
      status: 'Match en cours',
      arbitrageRequestStatus: 'accepted',
      arbitrageAcceptedAt: Date.now(),
      refereeStartedAt: Date.now(),
      refereeInProgress: true,
      matchInProgress: true,
    }));
  }

  function expirePendingArbitrageRequestsInMatches(matches, now = Date.now()) {
    let changed = false;
    const nextMatches = (Array.isArray(matches) ? matches : []).map((match) => {
      const nextMatch = sanitizeExpiredArbitrageRequest(match, now);
      if (nextMatch !== match) changed = true;
      return nextMatch;
    });
    return { matches: nextMatches, changed };
  }

  function expirePendingArbitrageRequests() {
    const now = Date.now();
    let changed = false;
    const updateStageKey = (ref, setter, key) => {
      const stage = ref.current || {};
      const result = expirePendingArbitrageRequestsInMatches(stage[key], now);
      if (!result.changed) return;
      const nextStage = { ...stage, [key]: result.matches };
      ref.current = nextStage;
      setter(nextStage);
      changed = true;
    };

    updateStageKey(championshipLeg1Ref, setChampionshipLeg1, 'matches');
    updateStageKey(championshipLeg2Ref, setChampionshipLeg2, 'matches');
    updateStageKey(brassage1Ref, setBrassage1, 'matches');
    updateStageKey(brassage2Ref, setBrassage2, 'matches');
    updateStageKey(mainStageRef, setMainStage, 'principaleMatches');
    updateStageKey(mainStageRef, setMainStage, 'consolanteMatches');

    const knockoutKeys = ['principalEighths', 'principalQuarters', 'principalSemis', 'principalFinals', 'consolanteEighths', 'consolanteQuarters', 'consolanteSemis', 'consolanteFinals'];
    let nextKnockout = knockoutRef.current || {};
    knockoutKeys.forEach((key) => {
      const result = expirePendingArbitrageRequestsInMatches(nextKnockout[key], now);
      if (result.changed) {
        nextKnockout = { ...nextKnockout, [key]: result.matches };
        changed = true;
      }
    });
    if (nextKnockout !== knockoutRef.current) {
      knockoutRef.current = nextKnockout;
      setKnockout(nextKnockout);
    }

    let nextSingle = singleKnockoutRef.current || {};
    ['quarters', 'semis', 'finals'].forEach((key) => {
      const result = expirePendingArbitrageRequestsInMatches(nextSingle[key], now);
      if (result.changed) {
        nextSingle = { ...nextSingle, [key]: result.matches };
        changed = true;
      }
    });
    if (nextSingle !== singleKnockoutRef.current) {
      singleKnockoutRef.current = nextSingle;
      setSingleKnockout(nextSingle);
    }

    if (changed) {
      refreshLatestPersistedSnapshot();
      queueBackgroundCloudSave(250);
    }
  }

  useEffect(() => {
    expirePendingArbitrageRequests();
    const timer = window.setInterval(expirePendingArbitrageRequests, 10000);
    return () => window.clearInterval(timer);
  }, []);

  function updateMatchesInScope(scope, updater) {
    const applyUpdater = (matches) => dedupeMatches(
      typeof updater === 'function'
        ? updater(dedupeMatches(Array.isArray(matches) ? matches : []))
        : dedupeMatches(Array.isArray(matches) ? matches : [])
    );

    if (scope === 'championshipLeg1') {
      const next = { ...championshipLeg1Ref.current, matches: applyUpdater(championshipLeg1Ref.current?.matches) };
      championshipLeg1Ref.current = next;
      setChampionshipLeg1(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'championshipLeg2') {
      const next = { ...championshipLeg2Ref.current, matches: applyUpdater(championshipLeg2Ref.current?.matches) };
      championshipLeg2Ref.current = next;
      setChampionshipLeg2(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'brassage1') {
      const next = { ...brassage1Ref.current, matches: applyUpdater(brassage1Ref.current?.matches) };
      brassage1Ref.current = next;
      setBrassage1(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'brassage2') {
      const next = { ...brassage2Ref.current, matches: applyUpdater(brassage2Ref.current?.matches) };
      brassage2Ref.current = next;
      setBrassage2(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'principale') {
      const next = { ...mainStageRef.current, principaleMatches: applyUpdater(mainStageRef.current?.principaleMatches) };
      mainStageRef.current = next;
      setMainStage(next);
      refreshLatestPersistedSnapshot();
      return;
    }

    if (scope === 'principalSemis') {
      const next = { ...knockoutRef.current, principalSemis: applyUpdater(knockoutRef.current?.principalSemis) };
      knockoutRef.current = next;
      setKnockout(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'principalFinals') {
      const next = { ...knockoutRef.current, principalFinals: applyUpdater(knockoutRef.current?.principalFinals) };
      knockoutRef.current = next;
      setKnockout(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'consolante') {
      const next = { ...mainStageRef.current, consolanteMatches: applyUpdater(mainStageRef.current?.consolanteMatches) };
      mainStageRef.current = next;
      setMainStage(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'quarters') {
      const next = { ...singleKnockoutRef.current, quarters: applyUpdater(singleKnockoutRef.current?.quarters) };
      singleKnockoutRef.current = next;
      setSingleKnockout(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'semis') {
      const next = { ...singleKnockoutRef.current, semis: applyUpdater(singleKnockoutRef.current?.semis) };
      singleKnockoutRef.current = next;
      setSingleKnockout(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    if (scope === 'finals') {
      const next = { ...singleKnockoutRef.current, finals: applyUpdater(singleKnockoutRef.current?.finals) };
      singleKnockoutRef.current = next;
      setSingleKnockout(next);
      refreshLatestPersistedSnapshot();
      return;
    }
    const knockoutScopes = {
      principalEighths: 'principalEighths',
      principalQuarters: 'principalQuarters',
      principalSemis: 'principalSemis',
      principalFinals: 'principalFinals',
      consolanteEighths: 'consolanteEighths',
      consolanteQuarters: 'consolanteQuarters',
      consolanteSemis: 'consolanteSemis',
      consolanteFinals: 'consolanteFinals',
    };
    if (knockoutScopes[scope]) {
      const key = knockoutScopes[scope];
      const next = { ...knockoutRef.current, [key]: applyUpdater(knockoutRef.current?.[key]) };
      knockoutRef.current = next;
      setKnockout(next);
      refreshLatestPersistedSnapshot();
    }
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
    if (Boolean(match.pendingResultSentAt)) {
      return { text: 'Résultat envoyé', className: 'badge-info' };
    }
    if (Boolean(match.refereeInProgress) || Boolean(match.matchInProgress)) {
      return { text: 'Match en cours', className: 'badge-danger' };
    }
    return { text: 'À saisir', className: 'badge-neutral' };
  }

  function protectOrganizerLocalEdit(matchId, snapshot) {
    recentOrganizerLocalEditsRef.current.set(matchId, {
      scoreA: String(snapshot.scoreA ?? ''),
      scoreB: String(snapshot.scoreB ?? ''),
      officialAt: snapshot.officialAt ?? new Date().toISOString(),
      until: Date.now() + 90000,
    });
  }

  function getStageLevelForScope(scope) {
    if (isSmallTournamentMode) {
      if (scope === 'championshipLeg1') return 0;
      if (scope === 'championshipLeg2') return 1;
      if (scope === 'quarters') return 2;
      if (scope === 'semis') return 3;
      if (scope === 'finals') return 4;
      return 999;
    }
    if (scope === 'brassage1') return 0;
    if (scope === 'brassage2') return 1;
    if (scope === 'principale' || scope === 'consolante') return 2;
    if (scope === 'principalQuarters' || scope === 'consolanteSemis') return 3;
    if (scope === 'principalSemis' || scope === 'consolanteFinals') return 4;
    if (scope === 'principalFinals') return 5;
    return 999;
  }

  function laterValidMatchesExist(scope) {
    const currentStageLevel = getStageLevelForScope(scope);
    const scopedGroups = isSmallTournamentMode
      ? [
          { scope: 'championshipLeg1', matches: championshipLeg1Ref.current?.matches || [] },
          { scope: 'championshipLeg2', matches: championshipLeg2Ref.current?.matches || [] },
          { scope: 'quarters', matches: singleKnockoutRef.current?.quarters || [] },
          { scope: 'semis', matches: singleKnockoutRef.current?.semis || [] },
          { scope: 'finals', matches: singleKnockoutRef.current?.finals || [] },
        ]
      : [
          { scope: 'brassage1', matches: brassage1Ref.current?.matches || [] },
          { scope: 'brassage2', matches: brassage2Ref.current?.matches || [] },
          { scope: 'principale', matches: mainStageRef.current?.principaleMatches || [] },
          { scope: 'consolante', matches: mainStageRef.current?.consolanteMatches || [] },
          { scope: 'principalQuarters', matches: knockoutRef.current?.principalQuarters || [] },
          { scope: 'consolanteSemis', matches: knockoutRef.current?.consolanteSemis || [] },
          { scope: 'principalSemis', matches: knockoutRef.current?.principalSemis || [] },
          { scope: 'consolanteFinals', matches: knockoutRef.current?.consolanteFinals || [] },
          { scope: 'principalFinals', matches: knockoutRef.current?.principalFinals || [] },
        ];
    return scopedGroups.some((entry) => (
      getStageLevelForScope(entry.scope) > currentStageLevel
      && dedupeMatches(Array.isArray(entry.matches) ? entry.matches : []).some((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide')
    ));
  }

  function clearStagesAfterScope(scope) {
    const currentStageLevel = getStageLevelForScope(scope);
    if (isSmallTournamentMode) {
      if (currentStageLevel < 1) {
        const nextLeg2 = { ...championshipLeg2Ref.current, pools: [], matches: [] };
        const nextSingleKnockout = { quarters: [], semis: [], finals: [] };
        championshipLeg2Ref.current = nextLeg2;
        singleKnockoutRef.current = nextSingleKnockout;
        setChampionshipLeg2(nextLeg2);
        setSingleKnockout(nextSingleKnockout);
        return;
      }
      if (currentStageLevel < 2) {
        const nextSingleKnockout = { quarters: [], semis: [], finals: [] };
        singleKnockoutRef.current = nextSingleKnockout;
        setSingleKnockout(nextSingleKnockout);
        return;
      }
      if (currentStageLevel < 3) {
        const nextSingleKnockout = { ...singleKnockoutRef.current, semis: [], finals: [] };
        singleKnockoutRef.current = nextSingleKnockout;
        setSingleKnockout(nextSingleKnockout);
        return;
      }
      if (currentStageLevel < 4) {
        const nextSingleKnockout = { ...singleKnockoutRef.current, finals: [] };
        singleKnockoutRef.current = nextSingleKnockout;
        setSingleKnockout(nextSingleKnockout);
      }
      return;
    }
    if (currentStageLevel < 1) {
      const nextBrassage2 = { pools: [], matches: [] };
      const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
      const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
      brassage2Ref.current = nextBrassage2;
      mainStageRef.current = nextMainStage;
      knockoutRef.current = nextKnockout;
      setBrassage2(nextBrassage2);
      setMainStage(nextMainStage);
      setKnockout(nextKnockout);
      return;
    }
    if (currentStageLevel < 2) {
      const nextMainStage = { principalePools: [], principaleMatches: [], consolantePools: [], consolanteMatches: [] };
      const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
      mainStageRef.current = nextMainStage;
      knockoutRef.current = nextKnockout;
      setMainStage(nextMainStage);
      setKnockout(nextKnockout);
      return;
    }
    if (currentStageLevel < 3) {
      const nextKnockout = { principalEighths: [], principalQuarters: [], principalSemis: [], principalFinals: [], consolanteEighths: [], consolanteQuarters: [], consolanteSemis: [], consolanteFinals: [] };
      knockoutRef.current = nextKnockout;
      setKnockout(nextKnockout);
      return;
    }
    if (currentStageLevel < 4) {
      const nextKnockout = { ...knockoutRef.current, principalSemis: [], principalFinals: [], consolanteFinals: [] };
      knockoutRef.current = nextKnockout;
      setKnockout(nextKnockout);
      return;
    }
    if (currentStageLevel < 5) {
      const nextKnockout = { ...knockoutRef.current, principalFinals: [] };
      knockoutRef.current = nextKnockout;
      setKnockout(nextKnockout);
    }
  }

  function confirmResetLaterStagesBeforeEdit(scope) {
    if (!laterValidMatchesExist(scope)) return true;
    const firstConfirmation = window.confirm("La modification de ce match va remettre à zéro tous les matchs des phases suivantes déjà générés. Continuer ?");
    if (!firstConfirmation) return false;
    const secondConfirmation = window.confirm("Confirmer à nouveau : veux-tu vraiment poursuivre la modification et effacer les résultats des phases suivantes ?");
    if (!secondConfirmation) return false;
    clearStagesAfterScope(scope);
    markPendingStructureSync();

    return true;
  }

  function updateOfficialMatchScore(scope, matchId, field, value) {
    const resolvedScope = !findMatchInScope(scope, matchId)
      ? (findMatchInScope('principalFinals', matchId) ? 'principalFinals'
        : findMatchInScope('consolanteFinals', matchId) ? 'consolanteFinals'
        : findMatchInScope('principalSemis', matchId) ? 'principalSemis'
        : findMatchInScope('consolanteSemis', matchId) ? 'consolanteSemis'
        : findMatchInScope('principalQuarters', matchId) ? 'principalQuarters'
        : findMatchInScope('consolanteQuarters', matchId) ? 'consolanteQuarters'
        : scope)
      : scope;
    const fallbackMatch = findMatchInScope(resolvedScope, matchId);
    if (!fallbackMatch) return;
    const currentValue = field === 'scoreA' ? (fallbackMatch.scoreA ?? '') : (fallbackMatch.scoreB ?? '');
    const normalized = value === '' ? '' : Math.max(0, Number(value));
    if (String(currentValue ?? '') === String(normalized ?? '')) return;
    if (!confirmResetLaterStagesBeforeEdit(scope)) return;
    const officialEditTimestamp = markPendingLocalMutation(new Date().toISOString());
    const nextScoreA = field === 'scoreA' ? normalized : (fallbackMatch.scoreA ?? '');
    const nextScoreB = field === 'scoreB' ? normalized : (fallbackMatch.scoreB ?? '');
    const protectedSnapshot = {
      scoreA: nextScoreA,
      scoreB: nextScoreB,
      officialAt: officialEditTimestamp,
    };
    protectOrganizerLocalEdit(matchId, protectedSnapshot);
    updateMatchesInScope(resolvedScope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      const updated = {
        ...match,
        [field]: normalized,
        submittedScoreA: '',
        submittedScoreB: '',
        submittedAt: null,
        pendingResultSentAt: null,
        refereeInProgress: false,
        matchInProgress: false,
        manualOverrideAt: officialEditTimestamp,
      };
      updated.validatedAt = isMatchResultValid(updated, phaseRulesRef.current) ? officialEditTimestamp : null;
      return updated;
    }));
    queueBackgroundCloudSave(20, approvalTimestamp);
  }


  function updateRefereeMatchScore(scope, matchId, field, value) {
    const fallbackMatch = findMatchInScope(scope, matchId);
    if (!fallbackMatch) return;
    if (getMatchStatusLabel(fallbackMatch, phaseRulesRef.current) === 'Valide') return;

    const editTimestamp = new Date().toISOString();
    const normalized = String(value ?? '').replace(/[^0-9]/g, '').slice(0, 3);

    const selectedDraft = refereeSelectedScoreDraftRef.current?.matchId === matchId
      ? refereeSelectedScoreDraftRef.current
      : null;
    const storedDraft = refereeScoreDraftsRef.current?.[matchId] || null;

    const nextScoreA = field === 'scoreA'
      ? normalized
      : String(selectedDraft?.scoreA ?? storedDraft?.scoreA ?? fallbackMatch.submittedScoreA ?? '');
    const nextScoreB = field === 'scoreB'
      ? normalized
      : String(selectedDraft?.scoreB ?? storedDraft?.scoreB ?? fallbackMatch.submittedScoreB ?? '');

    const nextDraft = {
      matchId,
      scoreA: nextScoreA,
      scoreB: nextScoreB,
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
      submittedScoreA: nextScoreA,
      submittedScoreB: nextScoreB,
      submittedAt: editTimestamp,
      pendingResultSentAt: null,
      until: Date.now() + 90000,
    });

    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide') return match;
      return {
        ...match,
        submittedScoreA: nextScoreA,
        submittedScoreB: nextScoreB,
        submittedAt: editTimestamp,
        pendingResultSentAt: null,
        refereeInProgress: false, matchInProgress: false, arbitrageRequestStatus: 'pending', arbitrageRequestedAt: Date.now(),
      };
    }));
  }


  function submitRefereeMatchResult(scope, matchId) {
    const fallbackMatch = findMatchInScope(scope, matchId);
    if (!fallbackMatch || getMatchStatusLabel(fallbackMatch, phaseRulesRef.current) === 'Valide') return false;

    const displayedDraft = refereeSelectedScoreDraftRef.current?.matchId === matchId
      ? refereeSelectedScoreDraftRef.current
      : (refereeScoreDraftsRef.current?.[matchId] || null);

    const forcedScoreA = String(displayedDraft?.scoreA ?? fallbackMatch.submittedScoreA ?? '');
    const forcedScoreB = String(displayedDraft?.scoreB ?? fallbackMatch.submittedScoreB ?? '');
    const forcedSnapshot = {
      ...fallbackMatch,
      submittedScoreA: forcedScoreA,
      submittedScoreB: forcedScoreB,
      scoreA: forcedScoreA === '' ? null : Number(forcedScoreA),
      scoreB: forcedScoreB === '' ? null : Number(forcedScoreB),
    };

    if (!isMatchResultValid(forcedSnapshot, phaseRulesRef.current)) {
      window.alert("Le score doit être gagnant avant d'envoyer le résultat.");
      return false;
    }

    const submittedAt = displayedDraft?.submittedAt || fallbackMatch.submittedAt || new Date().toISOString();
    const sendTimestamp = markPendingLocalMutation(new Date().toISOString());

    recentRefereeLocalEditsRef.current.set(matchId, {
      submittedScoreA: forcedScoreA,
      submittedScoreB: forcedScoreB,
      submittedAt,
      pendingResultSentAt: sendTimestamp,
      until: Date.now() + 90000,
    });

    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide') return match;
      return {
        ...match,
        submittedScoreA: forcedScoreA,
        submittedScoreB: forcedScoreB,
        submittedAt,
        pendingResultSentAt: sendTimestamp,
        refereeInProgress: false,
        matchInProgress: false, arbitrageRequestStatus: 'pending', arbitrageRequestedAt: Date.now(),
      };
    }));
    queueBackgroundCloudSave(0, sendTimestamp);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        saveTournamentToCloud(false, true);
      }, 0);
      window.setTimeout(() => {
        saveTournamentToCloud(false, true);
      }, 40);
      window.setTimeout(() => {
        saveTournamentToCloud(false, true);
      }, 140);
      window.setTimeout(() => {
        if (sharedTournamentIdRef.current) {
          loadTournamentFromCloud(sharedTournamentIdRef.current, false);
        }
      }, 80);
      window.setTimeout(() => {
        if (sharedTournamentIdRef.current) {
          loadTournamentFromCloud(sharedTournamentIdRef.current, false);
        }
      }, 220);
      window.setTimeout(() => {
        setRefereeSelectedScoreDraft(null);
        setRefereeSelectedMatch(null);
      }, 80);
    } else {
      setRefereeSelectedScoreDraft(null);
      setRefereeSelectedMatch(null);
    }
    return true;
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
      pendingResultSentAt: fallbackMatch?.pendingResultSentAt ?? null,
      until: Date.now() + 90000,
    });
    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      if (getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide') return match;
      return {
        ...match,
        submittedScoreA: nextScoreA,
        submittedScoreB: nextScoreB,
        submittedAt: editTimestamp,
        pendingResultSentAt: null,
        refereeInProgress: false, matchInProgress: false, arbitrageRequestStatus: 'pending', arbitrageRequestedAt: Date.now(),
      };
    }));

  }

  function approveRefereeScore(scope, matchId) {
    const resolvedScope = !findMatchInScope(scope, matchId)
      ? (findMatchInScope('principalFinals', matchId) ? 'principalFinals'
        : findMatchInScope('consolanteFinals', matchId) ? 'consolanteFinals'
        : findMatchInScope('principalSemis', matchId) ? 'principalSemis'
        : findMatchInScope('consolanteSemis', matchId) ? 'consolanteSemis'
        : findMatchInScope('principalQuarters', matchId) ? 'principalQuarters'
        : findMatchInScope('consolanteQuarters', matchId) ? 'consolanteQuarters'
        : scope)
      : scope;
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
        pendingResultSentAt: null,
        refereeInProgress: false,
        matchInProgress: false,
      };
      approved.manualOverrideAt = approvalTimestamp;
      approved.validatedAt = isMatchResultValid(approved, phaseRulesRef.current) ? approvalTimestamp : null;
      return approved;
    }));
    queueBackgroundCloudSave(20, approvalTimestamp);

    const tryGenerateBrassage2AfterValidation = () => {
      try {
        const currentBrassage1Matches = brassage1Ref.current?.matches || [];
        const signature = `post-approval-auto-brassage2-${currentBrassage1Matches.map((m) => `${m.id}:${m.scoreA}-${m.scoreB}:${m.validatedAt || ''}`).join('|')}`;
        if (autoGeneratedStageSignaturesRef.current.has(signature)) return false;
        const generated = tryAutoGenerateBrassage2Silently();
        if (generated) {
          autoGeneratedStageSignaturesRef.current.add(signature);
          return true;
        }
      } catch (error) {
        console.error('Erreur auto Brassage 2 après validation organisateur', error);
      }
      return false;
    };

    const tryGenerateMainStageAfterValidation = () => {
      try {
        const b2Matches = brassage2Ref.current?.matches || [];
        const allBrassage2Validated = b2Matches.length > 0 && b2Matches.every((match) => getMatchStatusLabel(match, phaseRulesRef.current) === 'Valide');
        const hasMainStage = (mainStageRef.current?.principaleMatches?.length || 0) > 0
          || (mainStageRef.current?.consolanteMatches?.length || 0) > 0
          || (mainStageRef.current?.principalePools?.length || 0) > 0
          || (mainStageRef.current?.consolantePools?.length || 0) > 0;
        if (allBrassage2Validated && !hasMainStage) {
          return generateMainStage() !== false;
        }
      } catch (error) {
        console.error('Erreur auto Principale/Consolante après validation organisateur', error);
      }
      return false;
    };

    queueMicrotask(() => {
      if (tryGenerateBrassage2AfterValidation()) return;
      if (generateQuartersIfFinalsStartAtQuarters({ silent: true })) return;
      if (forceSmallChampionshipQuartersIfReady({ silent: true })) return;
      if (stableGenerateAfterBrassage2({ silent: true })) return;
      if (forceSmallChampionshipQuartersIfReady({ silent: true })) return;
      if (tryGenerateThirtySixFinalStages()) return;
      if (stableGenerateAfterBrassage2({ silent: true })) return;
      if (tryGenerateMainStageAfterValidation()) return;
      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          if (tryGenerateBrassage2AfterValidation()) return;
          if (forceSmallChampionshipQuartersIfReady({ silent: true })) return;
      if (tryGenerateThirtySixFinalStages()) return;
          if (stableGenerateAfterBrassage2({ silent: true })) return;
          tryGenerateMainStageAfterValidation();
        }, 80);
        window.setTimeout(() => {
          if (tryGenerateBrassage2AfterValidation()) return;
          if (forceSmallChampionshipQuartersIfReady({ silent: true })) return;
      if (tryGenerateThirtySixFinalStages()) return;
          if (stableGenerateAfterBrassage2({ silent: true })) return;
          tryGenerateMainStageAfterValidation();
        }, 220);
      }
    });
  }

  
function applyRandomScores(scope) {
  const targetScope = scope;
  if (!targetScope) return;

  const winningRule = getRuleForMatch({ phase: targetScope }, phaseRulesRef.current || phaseRules);
  const target = Number(winningRule?.winningScore) || 21;
  const stamp = new Date().toISOString();

  const buildRandomResult = () => {
    const winnerA = Math.random() < 0.5;
    const loserMax = Math.max(0, target - 1);
    const loserScore = Math.floor(Math.random() * (loserMax + 1));
    return winnerA
      ? { scoreA: target, scoreB: loserScore }
      : { scoreA: loserScore, scoreB: target };
  };

  updateMatchesInScope(targetScope, (matches) => (Array.isArray(matches) ? matches : []).map((match) => {
    if (getMatchStatusLabel(match, phaseRulesRef.current || phaseRules) === 'Valide') return match;
    const result = buildRandomResult();
    const updated = {
      ...match,
      scoreA: result.scoreA,
      scoreB: result.scoreB,
      submittedScoreA: '',
      submittedScoreB: '',
      submittedAt: null,
      pendingResultSentAt: null,
      refereeInProgress: false,
      matchInProgress: false,
      manualOverrideAt: stamp,
    };
    updated.validatedAt = isMatchResultValid(updated, phaseRulesRef.current || phaseRules) ? stamp : null;
    return updated;
  }));
  queueBackgroundCloudSave?.(20, stamp);
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
    const releaseTimestamp = markPendingLocalMutation(new Date().toISOString());
    recentRefereeLocalEditsRef.current.delete(matchId);
    recentRefereeReleaseRef.current.set(matchId, { at: Date.now(), until: Date.now() + 90000 });

    const fallbackMatch = findMatchInScope(scope, matchId);
    if (!fallbackMatch) return;

    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      return {
        ...match,
        refereeInProgress: false,
        matchInProgress: false,
      };
    }));

    setRefereeSelectedScoreDraft((current) => (
      current && current.matchId === matchId ? null : current
    ));
    setRefereeSelectedMatch((current) => (
      current && current.matchId === matchId ? null : current
    ));

    queueBackgroundCloudSave(20, releaseTimestamp);
  }

  
  function cancelRefereeResult(scope, matchId) {
    recentRefereeLocalEditsRef.current.delete(matchId);
    recentRefereeReleaseRef.current.set(matchId, { at: Date.now(), until: Date.now() + 90000 });
    const resetTimestamp = markPendingLocalMutation(new Date().toISOString());

    updateMatchesInScope(scope, (matches) => matches.map((match) => {
      if (match.id !== matchId) return match;
      return {
        ...match,
        scoreA: '',
        scoreB: '',
        submittedScoreA: '',
        submittedScoreB: '',
        submittedAt: null,
        pendingResultSentAt: null,
        validatedAt: null,
        refereeInProgress: false,
        matchInProgress: false,
        manualOverrideAt: resetTimestamp,
      };
    }));

    setRefereeSelectedScoreDraft((current) => (
      current && current.matchId === matchId ? null : current
    ));
    setRefereeSelectedMatch((current) => (
      current && current.matchId === matchId ? null : current
    ));

    commitRefereeScoreDrafts((current) => {
      const next = { ...(current || {}) };
      delete next[matchId];
      return next;
    });

    queueBackgroundCloudSave(20, resetTimestamp);
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
          ? { ...match, refereeInProgress: false, matchInProgress: false, submittedScoreA: '', submittedScoreB: '', submittedAt: new Date().toISOString(), pendingResultSentAt: null }
          : match
      )));
      queueBackgroundCloudSave(20);
    }
    setRefereeSelectedScoreDraft(null);
    setRefereeSelectedMatch(null);
  }

  function formatExportFilename(sourceDate = new Date(), phaseName = '') {
    const day = String(sourceDate.getDate()).padStart(2, '0');
    const month = String(sourceDate.getMonth() + 1).padStart(2, '0');
    const year = sourceDate.getFullYear();
    const hours = String(sourceDate.getHours()).padStart(2, '0');
    const minutes = String(sourceDate.getMinutes()).padStart(2, '0');
    const safeTournamentName = String(tournamentName || 'tournoi')
      .replace(/[\/:*?"<>|]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'tournoi';
    const safePhaseName = String(phaseName || 'phase')
      .replace(/[\/:*?"<>|]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || 'phase';
    return `${safePhaseName}-${safeTournamentName}-${day}-${month}-${year} ${hours}h${minutes}.json`;
  }

  function exportState() {
    const savedAt = new Date().toISOString();
    setLastSavedAt(savedAt);
    downloadJson(formatExportFilename(), getPersistedState(savedAt));
  }

  function triggerAutomaticBackup(overrides = {}) {
    const sourceDate = new Date();
    const savedAt = sourceDate.toISOString();
    const fileName = formatExportFilename(sourceDate, overrides.phaseName || 'Phase générée');
    const snapshot = getPersistedStateSnapshot(savedAt, {
      ...overrides,
      lastAutomaticSaveFilename: fileName,
    });
    setLastSavedAt(savedAt);
    setLastAutomaticSaveFilename(fileName);
    downloadJson(fileName, snapshot);
    if (typeof window !== 'undefined') {
      safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(snapshot));
    }
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
                    <th title={POINTS_AVERAGE_TOOLTIP}>Pts ⓘ</th>
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
                      <td>{formatStandingPoints(row, useNormalizedPoolRanking)}</td>
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
    const selectedTeamId = selectedBrassageTeamByScope?.[scope] || '';
    const selectedTeamPool = selectedTeamId
      ? safePools.find((entry) => Array.isArray(entry.teamIds) && entry.teamIds.includes(selectedTeamId))
      : null;
    const preferredPoolId = selectedTeamPool?.id || selectedBrassagePoolByScope?.[scope] || '';
    const terrainMatchMap = new Map();
    const buildTeamPointsTooltip = (teamId, poolRows = []) => {
      if (!teamId) return '';
      const overallRow = (Array.isArray(overallRanking) ? overallRanking : []).find((row) => row?.teamId === teamId) || null;
      const poolRow = (Array.isArray(poolRows) ? poolRows : []).find((row) => row?.teamId === teamId) || null;
      const displayedTotalPoints = formatStandingPoints(overallRow, useNormalizedPoolRanking);
      const poolAveragePoints = Number.isFinite(poolRow?.avgTournamentPoints)
        ? poolRow.avgTournamentPoints
        : ((Number.isFinite(poolRow?.tournamentPoints) ? poolRow.tournamentPoints : 0) / Math.max(1, Number(poolRow?.played) || 0));
      const formattedPoolAveragePoints = (Number.isFinite(poolAveragePoints) ? poolAveragePoints : 0).toFixed(2).replace('.', ',');
      return `Pts: ${displayedTotalPoints} • Poule: ${formattedPoolAveragePoints}`;
    };
    const selectTeamInScope = (teamId) => {
      const normalizedTeamId = teamId || '';
      const nextTeamId = normalizedTeamId && normalizedTeamId === selectedTeamId ? '' : normalizedTeamId;
      const relatedPool = nextTeamId
        ? safePools.find((entry) => Array.isArray(entry.teamIds) && entry.teamIds.includes(nextTeamId))
        : null;
      setSelectedBrassageTeamByScope((current) => ({ ...current, [scope]: nextTeamId }));
      setSelectedBrassagePoolByScope((current) => ({ ...current, [scope]: relatedPool?.id || '' }));
    };
    const selectPoolInScope = (poolId) => {
      const nextPoolId = poolId && poolId === preferredPoolId && !selectedTeamId ? '' : (poolId || '');
      setSelectedBrassagePoolByScope((current) => ({ ...current, [scope]: nextPoolId }));
      setSelectedBrassageTeamByScope((current) => ({ ...current, [scope]: '' }));
    };

    getCourtNumbers(courtCount).forEach((courtNumber) => {
      const courtMatches = safeMatches
        .filter((match) => Number(match.court || 0) === courtNumber)
        .slice()
        .sort((a, b) => {
          if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
          return String(a.id || '').localeCompare(String(b.id || ''));
        });
      terrainMatchMap.set(courtNumber, courtMatches);
    });
    const activeCourtNumbers = getCourtNumbers(courtCount).filter((courtNumber) => (terrainMatchMap.get(courtNumber) || []).length > 0);

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
          {poolCards.map(({ pool, rows, teamIds }) => {
            const isSelected = pool.id === preferredPoolId;
            const isHighlightedByTeam = Boolean(selectedTeamId) && teamIds.includes(selectedTeamId);
            return (
              <button
                type="button"
                key={pool.id}
                className={`compact-brassage-pool-list-card-v24n ${isSelected ? 'is-selected' : ''} ${isHighlightedByTeam ? 'is-team-highlighted' : ''}`.trim()}
                onClick={() => selectPoolInScope(pool.id)}
              >
                <div className="compact-brassage-pool-list-head-v24n">{formatPoolNameWithLevel(pool, teamMap)}</div>
                <div className="compact-brassage-pool-teams-v24n">
                  {rows.map((row, rowIndex) => {
                    const fallbackTeam = resolveTeam(row.teamId);
                    const isHighlightedRow = Boolean(selectedTeamId) && row.teamId === selectedTeamId;
                    return (
                      <div
                        key={row.teamId || `${pool.id}-${rowIndex}`}
                        className={`compact-brassage-pool-team-row-v24n ${isHighlightedRow ? 'is-team-highlighted' : ''}`.trim()}
                        onClick={(event) => {
                          event.stopPropagation();
                          selectTeamInScope(row.teamId);
                        }}
                        title={buildTeamPointsTooltip(row.teamId, rows)}
                      >
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
          <div className="compact-terrain-columns-v24n" style={{ gridTemplateColumns: `repeat(${Math.max(1, activeCourtNumbers.length)}, minmax(0, 1fr))` }}>
            {activeCourtNumbers.map((courtNumber) => {
              const courtMatches = terrainMatchMap.get(courtNumber) || [];
              return (
                <div key={courtNumber} className="compact-terrain-column-v24n">
                  <div className="compact-terrain-column-title-v24n">Terrain {courtNumber}</div>
                  <div className="compact-terrain-match-list-v24n">
                    {courtMatches.map((match, index) => {
                      const poolCard = poolCards.find((entry) => entry.pool?.name === match.group || (entry.teamIds.includes(match.teamAId) && entry.teamIds.includes(match.teamBId)));
                      const poolTeamIds = Array.isArray(poolCard?.teamIds) ? poolCard.teamIds : [];
                      const refereeTeamId = match.refereeTeamId || poolTeamIds.find((teamId) => teamId !== match.teamAId && teamId !== match.teamBId) || null;
                      const refereeTeam = refereeTeamId ? resolveTeam(refereeTeamId) : null;
                      const teamA = resolveTeam(match.teamAId);
                      const teamB = resolveTeam(match.teamBId);
                      const status = getMatchStatusLabel(match, phaseRules);
                      const pendingStatus = getPendingStatus(match);
                      const pendingA = toNumber(match.submittedScoreA);
                      const pendingB = toNumber(match.submittedScoreB);
                      const isValid = status === 'Valide';
                      const canApprovePending = !isValid && Boolean(match.pendingResultSentAt) && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules);
                      const isSelectedTeamPlayingMatch = Boolean(selectedTeamId) && (match.teamAId === selectedTeamId || match.teamBId === selectedTeamId);
                      const isSelectedTeamRefereeMatch = Boolean(selectedTeamId) && refereeTeamId === selectedTeamId;
                      const matchHighlightClass = isSelectedTeamPlayingMatch
                        ? 'is-team-highlighted'
                        : (isSelectedTeamRefereeMatch ? 'is-referee-highlighted' : '');

                      return (
                        <div key={match.id} id={`match-card-${match.id}`} className={`compact-match-card-v24n ${matchHighlightClass}`.trim()}>
                          <div className="compact-match-header-v24n">
                            <span className="compact-match-chip compact-match-chip-v24n">T{match.court || courtNumber}</span>
                            <TeamBadge name={refereeTeam ? refereeTeam.name : '—'} level={refereeTeam?.level} className="compact-match-referee-badge-v24n" />
                            <span className="compact-match-chip compact-match-chip-v24n">M{index + 1}</span>
                          </div>
                          <div className="compact-match-team-row-v24n">
                            <button
                              type="button"
                              className={`compact-team-select-button-v27c ${selectedTeamId === match.teamAId ? 'is-team-highlighted' : ''}`.trim()}
                              onClick={() => selectTeamInScope(match.teamAId)}
                              title={buildTeamPointsTooltip(match.teamAId, poolCard?.rows || [])}
                            >
                              <TeamBadge name={teamA.name} level={teamA.level} className="compact-team-strip-badge-v24n" />
                            </button>
                            <button
                              type="button"
                              className={`compact-team-select-button-v27c ${selectedTeamId === match.teamBId ? 'is-team-highlighted' : ''}`.trim()}
                              onClick={() => selectTeamInScope(match.teamBId)}
                              title={buildTeamPointsTooltip(match.teamBId, poolCard?.rows || [])}
                            >
                              <TeamBadge name={teamB.name} level={teamB.level} className="compact-team-strip-badge-v24n" />
                            </button>
                          </div>
                          <div className="compact-match-score-row-v24n">
                            <label className="compact-score-box compact-score-box-v24n">
                              <input
                              type="number"
                              min="0"
                              inputMode="numeric"
                              value={match.scoreA ?? ''}
                              onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreA', e.target.value)}
                              placeholder=""
                              disabled={false}
                            />
                            </label>
                            <label className="compact-score-box compact-score-box-v24n">
                              <input
                              type="number"
                              min="0"
                              inputMode="numeric"
                              value={match.scoreB ?? ''}
                              onChange={(e) => updateOfficialMatchScore(scope, match.id, 'scoreB', e.target.value)}
                              placeholder=""
                              disabled={false}
                            />
                            </label>
                          </div>
                          <div className="compact-match-footer-v24n">
                            <button type="button" className="match-print-button-v24c" onClick={() => printMatchCard(match.id)} title="Imprimer ce match" aria-label="Imprimer ce match">🖨️</button>
                            {isArbitrageRequestPending(match) ? (
                              <button type="button" className="btn btn-success" onClick={() => acceptArbitrageRequest(match.id)}>
                                Arbitrage demandé
                              </button>
                            ) : null}
                            <span className={`badge ${getOrganizerStatusBadge(match).className}`}>{getOrganizerStatusBadge(match).text}</span>
                          </div>
                          {!isValid && pendingA !== null && pendingB !== null ? <div className="muted tiny compact-pending-score-v24n">Arbitre : {match.submittedScoreA} - {match.submittedScoreB}</div> : null}
                          {!isValid && Boolean(match.pendingResultSentAt) && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules) ? (
                            <div className="actions-row compact-actions compact-match-card-actions">
                              <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                                                          </div>
                          ) : null}
                          {!isValid && !Boolean(match.pendingResultSentAt) && ((Boolean(match.refereeInProgress) || Boolean(match.matchInProgress)) || (pendingA !== null && pendingB !== null)) ? (
                            <div className="actions-row compact-actions compact-match-card-actions">
                              <Button variant='info' onClick={() => reassignRefereeWithoutReset(scope, match.id)}>
                                Changer l’arbitre
                              </Button>
                            </div>
                          ) : null}
                          {!isValid && Boolean(match.pendingResultSentAt) ? (
                            <div className="actions-row compact-actions compact-match-card-actions">
                              <Button variant='danger' onClick={() => cancelRefereeResult(scope, match.id)}>
                                Annuler
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
            {!activeCourtNumbers.length ? <div className="empty-state compact-final-empty-v24s">Aucun match prévu sur les terrains pour cette phase.</div> : null}
          </div>
        </div>

        <aside className="mini-card compact-overall-ranking-column-v24n">
          <div className="compact-brassage-title compact-overall-ranking-title">{rankingLabel}</div>
          <div className="compact-overall-ranking-scroll compact-overall-ranking-scroll-v24n">
            {renderOverallRanking(overallRanking, scope === 'brassage2', null, {
              compact: true,
              selectedTeamId,
              onTeamClick: (teamId) => selectTeamInScope(teamId),
              getTeamTooltip: (teamId) => {
                const relatedPoolRows = poolCards.find((entry) => Array.isArray(entry.teamIds) && entry.teamIds.includes(teamId))?.rows || [];
                return buildTeamPointsTooltip(teamId, relatedPoolRows);
              },
            })}
          </div>
        </aside>
      </div>
    );
  }

  function renderCompactFinalStage(matches, scope) {
    try {
      const safeMatches = dedupeMatches(Array.isArray(matches) ? matches.filter(Boolean) : []);
      if (!safeMatches.length) return <div className="empty-state">Aucun match généré pour le moment.</div>;

    const terrainMatchMap = new Map();
    getCourtNumbers(courtCount).forEach((courtNumber) => {
      const courtMatches = safeMatches
        .filter((match) => Number(match.court || 0) === courtNumber)
        .slice()
        .sort((a, b) => {
          if ((a.slot || 0) !== (b.slot || 0)) return (a.slot || 0) - (b.slot || 0);
          return String(a.id || '').localeCompare(String(b.id || ''));
        });
      terrainMatchMap.set(courtNumber, courtMatches);
    });
    const activeCourtNumbers = getCourtNumbers(courtCount).filter((courtNumber) => (terrainMatchMap.get(courtNumber) || []).length > 0);

      return (
      <div className="mini-card compact-final-stage-board-v24s">
        <div className="compact-brassage-title compact-brassage-title-v24n">Matchs</div>
        <div className="compact-terrain-columns-v24n compact-final-terrain-columns-v24s" style={{ gridTemplateColumns: `repeat(${Math.max(1, activeCourtNumbers.length)}, minmax(0, 1fr))` }}>
          {activeCourtNumbers.map((courtNumber) => {
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
                    const isFinalStage = /quart|demi|finale|petite finale|petite final|principale|principal/i.test(`${match.phase || ''} ${match.group || ''}`);
                    const canApprovePending = !isValid && Boolean(match.pendingResultSentAt) && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules);
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
                        {!isValid && pendingA !== null && pendingB !== null ? <div className="muted tiny compact-pending-score-v24n">Arbitre : {match.submittedScoreA} - {match.submittedScoreB}</div> : null}
                        {!isValid && Boolean(match.pendingResultSentAt) && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules) ? (
                          <div className="actions-row compact-actions compact-match-card-actions">
                            <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                                                      </div>
                        ) : null}
                        {!isValid && !Boolean(match.pendingResultSentAt) && ((Boolean(match.refereeInProgress) || Boolean(match.matchInProgress)) || (pendingA !== null && pendingB !== null)) ? (
                          <div className="actions-row compact-actions compact-match-card-actions">
                            <Button variant={(Boolean(match.refereeInProgress) || Boolean(match.matchInProgress) || pendingA !== null || pendingB !== null) ? 'info' : 'secondary'} onClick={() => reassignRefereeWithoutReset(scope, match.id)}>
                              Annuler
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
    } catch (error) {
      console.error('Erreur affichage phases finales', error);
      return <div className="empty-state">Impossible d'afficher cette étape des phases finales pour le moment.</div>;
    }
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
                const canApprovePending = !isValid && Boolean(match.pendingResultSentAt) && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules);
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
                        {!isValid && !Boolean(match.pendingResultSentAt) && ((Boolean(match.refereeInProgress) || Boolean(match.matchInProgress)) || (pendingA !== null && pendingB !== null)) ? (
                          <>
                            <span className="muted tiny">Saisie arbitre : {match.submittedScoreA} - {match.submittedScoreB}</span>
                            {(canApprovePending || (isFinalStage && pendingA !== null && pendingB !== null && isMatchResultValid(getPendingMatchSnapshot(match), phaseRules))) ? (
                              <div className="actions-row compact-actions">
                                <Button variant="success" onClick={() => approveRefereeScore(scope, match.id)}>Valider</Button>
                                                              </div>
                            ) : null}
                          </>
                        ) : null}
                        {!isValid ? (
                          <div className="actions-row compact-actions">
                            <Button
                              variant={(Boolean(match.refereeInProgress) || Boolean(match.matchInProgress) || pendingA !== null || pendingB !== null) ? 'info' : 'secondary'}
                              onClick={() => reassignRefereeWithoutReset(scope, match.id)}
                              disabled={pendingStatus !== 'Match en cours'}
                            >
                              Annuler
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
    const liveMatch = findMatchInScope(scope, entryMatch?.id);
    const match = liveMatch || entryMatch;
    if (!match?.id) return null;
    if (!liveMatch && refereeSelectedMatch?.matchId === match.id) return null;
    if (!liveMatch && !entryMatch?.id) return null;
    if (!findMatchInScope(scope, match.id) && !entryMatch?.id) return null;

    const teamA = resolveTeam(match.teamAId);
    const teamB = resolveTeam(match.teamBId);
    const schedule = scheduleData?.scheduleMap?.[match.id] || null;
    const officialStatus = getMatchStatusLabel(match, phaseRules);
    const isLocked = officialStatus === 'Valide';

    const storedDraft = refereeScoreDraftsRef.current?.[match.id] || null;
    const selectedDraft = refereeSelectedScoreDraft?.matchId === match.id ? refereeSelectedScoreDraft : null;

    const displayScoreA = isLocked
      ? (match.scoreA ?? '')
      : (selectedDraft?.scoreA ?? storedDraft?.scoreA ?? match.submittedScoreA ?? '');
    const displayScoreB = isLocked
      ? (match.scoreB ?? '')
      : (selectedDraft?.scoreB ?? storedDraft?.scoreB ?? match.submittedScoreB ?? '');

    const pendingSnapshot = {
      ...match,
      scoreA: displayScoreA === '' ? null : Number(displayScoreA),
      scoreB: displayScoreB === '' ? null : Number(displayScoreB),
      submittedScoreA: displayScoreA,
      submittedScoreB: displayScoreB,
    };

    const pendingResultReady = !isLocked && isMatchResultValid(pendingSnapshot, phaseRules);
    const resultAlreadySent = Boolean(match.pendingResultSentAt);
    const hasStarted = !isLocked && (((toNumber(displayScoreA) ?? 0) !== 0) || ((toNumber(displayScoreB) ?? 0) !== 0));
    const canChooseAnotherMatch = !hasStarted;
    const phaseRule = getRuleForMatch(match, phaseRules);
    const winningScore = Number(phaseRule?.winningScore) || 21;
    const modeLabel = phaseRule?.mode === 'twoPointGap' ? 'avec 2 points d’écart' : 'sec';
    const estimatedDurationMinutes = estimatePhaseDurationMinutes(phaseRule);
    const refereeStartMinutes = stampToMinutes(match.submittedAt) ?? schedule?.startMinutes ?? parseTimeToMinutes(match.time || '09:00');
    const estimatedRefereeDurationText = formatDurationLabel(estimatedDurationMinutes) || `${estimatedDurationMinutes} min`;
    const contextText = `${match.group || 'Match'} • Terrain ${match.court || '?'} • Durée estimée : ${estimatedRefereeDurationText}`;
    const phaseCaption = String(match.phase || title || '').toUpperCase();

    const badgeText = isLocked
      ? 'Valide'
      : pendingResultReady
        ? (resultAlreadySent ? 'Résultat envoyé' : 'Match en cours')
        : ((match.refereeInProgress || match.matchInProgress) ? 'Match en cours' : 'À saisir');

    const badgeClass = isLocked
      ? 'badge-success'
      : ((match.refereeInProgress || match.matchInProgress)
        ? 'badge-danger'
        : (pendingResultReady ? 'badge-info' : 'badge-neutral'));

    return (
      <div className="referee-focus-card">
        <div className="referee-focus-head">
          <div>
            <div className="referee-phase-caption">{phaseCaption}</div>
            <h2>{teamA.name} <span className="muted">vs</span> {teamB.name}</h2>
            <p className="muted referee-match-context">{contextText}</p>
            <p className="referee-match-format">Match en {winningScore} {modeLabel}</p>
          </div>
          <div className="actions-row">
            <Button variant="secondary" onClick={() => releaseRefereeSelectedMatch(entry)} disabled={!canChooseAnotherMatch}>
              Choisir un autre match
            </Button>
          </div>
        </div>

        <div className="referee-focus-body">
          <div className="referee-team-card">
            <span className="muted small">Équipe A</span>
            <TeamBadge name={teamA.name} level={teamA.level} className="team-badge-large" />
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
                    className="score-stepper-btn" tabIndex={0}
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreA', 1)}
                    aria-label={`Augmenter le score de ${teamA.name}`}
                  >
                    ▲
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    enterKeyHint="done"
                    value={String(displayScoreA ?? '')}
                    onChange={(e) => updateRefereeMatchScore(scope, match.id, 'scoreA', e.target.value)}
                  />
                  <button
                    type="button"
                    className="score-stepper-btn" tabIndex={0}
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreA', -1)}
                    aria-label={`Diminuer le score de ${teamA.name}`}
                    disabled={(toNumber(displayScoreA) ?? 0) <= 0}
                  >
                    ▼
                  </button>
                </div>

                <span className="score-separator">-</span>

                <div className="score-stepper">
                  <button
                    type="button"
                    className="score-stepper-btn" tabIndex={0}
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreB', 1)}
                    aria-label={`Augmenter le score de ${teamB.name}`}
                  >
                    ▲
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    enterKeyHint="done"
                    value={String(displayScoreB ?? '')}
                    onChange={(e) => updateRefereeMatchScore(scope, match.id, 'scoreB', e.target.value)}
                  />
                  <button
                    type="button"
                    className="score-stepper-btn" tabIndex={0}
                    onClick={() => stepRefereeMatchScore(scope, match.id, 'scoreB', -1)}
                    aria-label={`Diminuer le score de ${teamB.name}`}
                    disabled={(toNumber(displayScoreB) ?? 0) <= 0}
                  >
                    ▼
                  </button>
                </div>
              </div>
            )}

            <div className="status-cell center-status">
              <span className={`badge ${badgeClass}`}>{badgeText}</span>

              {!isLocked && pendingResultReady && !resultAlreadySent ? (
                <div className="actions-row compact-actions">
                  <Button variant="success" onClick={() => submitRefereeMatchResult(scope, match.id)}>
                    Envoyer le résultat
                  </Button>
                </div>
              ) : null}

              {!isLocked && pendingResultReady && resultAlreadySent ? (
                <span className="muted tiny">Résultat final envoyé à l’organisateur</span>
              ) : null}

              {isLocked ? (
                <span className="muted tiny">Match verrouillé : déjà validé par l’organisateur</span>
              ) : null}
            </div>
          </div>

          <div className="referee-team-card">
            <span className="muted small">Équipe B</span>
            <TeamBadge name={teamB.name} level={teamB.level} className="team-badge-large" />
          </div>
        </div>
      </div>
    );
  }


  

function buildQualifiedTeamRowsFromTeamIds(teamIds, rankingRows) {
  const rankingMap = new Map((Array.isArray(rankingRows) ? rankingRows : []).map((row) => [row.teamId, row]));
  const seen = new Set();
  return (Array.isArray(teamIds) ? teamIds : [])
    .filter(Boolean)
    .filter((teamId) => {
      if (seen.has(teamId)) return false;
      seen.add(teamId);
      return true;
    })
    .map((teamId) => ({
      teamId,
      ...(rankingMap.get(teamId) || {}),
    }));
}

function getWinnersFromMatches(matches, phaseRules) {
  return dedupeMatches(Array.isArray(matches) ? matches : [])
    .map((match) => getWinnerLoser(match, phaseRules)?.winner || null)
    .filter(Boolean);
}

function getLosersFromMatches(matches, phaseRules) {
  return dedupeMatches(Array.isArray(matches) ? matches : [])
    .map((match) => getWinnerLoser(match, phaseRules)?.loser || null)
    .filter(Boolean);
}

function buildQuarterQualifiedTeamRowsFromMatches(matches, rankingRows) {
  const rankingMap = new Map((Array.isArray(rankingRows) ? rankingRows : []).map((row) => [row.teamId, row]));
  const seen = new Set();
  return dedupeMatches(Array.isArray(matches) ? matches : [])
    .flatMap((match) => [match?.teamAId, match?.teamBId])
    .filter(Boolean)
    .filter((teamId) => {
      if (seen.has(teamId)) return false;
      seen.add(teamId);
      return true;
    })
    .map((teamId) => ({
      teamId,
      ...(rankingMap.get(teamId) || {}),
    }));
}

function renderQualifiedTeamsList(title, rows, options = {}) {
  const safeRows = Array.isArray(rows) ? rows.filter((row) => row?.teamId) : [];
  const phaseLabel = options.phaseLabel || 'Points de poule';
  const showPoints = options.showPoints !== false;
  if (!safeRows.length) {
    return <div className="empty-state">Aucune équipe qualifiée pour le moment.</div>;
  }
  return (
    <div className="mini-card public-ranking-card public-qualified-list-card">
      <div className="mini-card-head">{title}</div>
      <div className="compact-overall-ranking-scroll compact-overall-ranking-scroll-v24n">
        <table className="standings-table public-qualified-simple-table">
          <thead>
            <tr>
              <th>Équipe</th>
              {showPoints ? <th>{phaseLabel}</th> : null}
            </tr>
          </thead>
          <tbody>
            {safeRows.map((row, index) => {
              const team = resolveTeam(row.teamId);
              const pointsValue = row.avgTournamentPoints ?? row.points ?? row.tournamentPoints ?? 0;
              return (
                <tr key={`${title}-${row.teamId}-${index}`}>
                  <td className="public-qualified-team-cell">
                    <TeamBadge name={team.name} level={team.level} />
                  </td>
                  {showPoints ? <td className="public-qualified-points-cell">{Number.isFinite(pointsValue) ? pointsValue : 0}</td> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderOverallRanking(rows, withStatus = false, activeTeamIds = null, options = {}) {
    const compact = Boolean(options?.compact);
    const onTeamClick = typeof options?.onTeamClick === 'function' ? options.onTeamClick : null;
    const selectedTeamId = options?.selectedTeamId || '';
    const getTeamTooltip = typeof options?.getTeamTooltip === 'function' ? options.getTeamTooltip : null;

    if (compact) {
      return (
        <div className="overall-ranking-compact-v24p">
          <div className="overall-ranking-compact-head-v24p">
            <div className="overall-ranking-rank-v24p">#</div>
            <div className="overall-ranking-team-head-v24p">Équipe</div>
            <div className="overall-ranking-points-head-v24p" aria-label="Moyenne de points par match" title={POINTS_AVERAGE_TOOLTIP}>Pts ⓘ</div>
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
                  <div className="overall-ranking-points-v24p">{formatStandingPoints(row, useNormalizedPoolRanking)}</div>
                </>
              );
              return onTeamClick ? (
                <button
                  key={row.teamId}
                  type="button"
                  className={`overall-ranking-row-v24p overall-ranking-row-button-v24p ${selectedTeamId === row.teamId ? 'is-team-highlighted' : ''}`.trim()}
                  onClick={() => onTeamClick(row.teamId)}
                  title={getTeamTooltip ? getTeamTooltip(row.teamId) : undefined}
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
              <th>J</th><th>V</th><th title={POINTS_AVERAGE_TOOLTIP}>Pts ⓘ</th>
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
                  <td>{row.played}</td><td>{row.wins}</td><td>{formatStandingPoints(row, useNormalizedPoolRanking)}</td>
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

  function renderPodium(title, matches, fallbackPodium = null) {
    const safeMatches = ensureMatchArray(matches);
    const safeFallbackPodium = fallbackPodium && typeof fallbackPodium === 'object' ? fallbackPodium : null;
    const finalMatch = safeMatches.find((match) => match.group === 'Finale');
    const smallFinal = matches.find((match) => match.group === 'Petite finale');
    const finalResult = finalMatch ? getWinnerLoser(finalMatch, phaseRules) : { winner: null, loser: null };
    const smallResult = smallFinal ? getWinnerLoser(smallFinal, phaseRules) : { winner: null, loser: null };
    const firstTeamId = finalResult.winner || safeFallbackPodium?.first || null;
    const secondTeamId = finalResult.loser || safeFallbackPodium?.second || null;
    const thirdTeamId = smallResult.winner || safeFallbackPodium?.third || null;
    return (
      <div className="mini-card public-ranking-card">
        <div className="mini-card-head">{title}</div>
        <div className="podium-steps podium-steps-model">
          <div className="podium-lane podium-lane-second">
            <div className="podium-team-label">{secondTeamId ? <TeamBadge name={resolveTeam(secondTeamId).name} level={resolveTeam(secondTeamId).level} className="podium-team-badge" /> : 'À venir'}</div>
            <div className="podium-players" aria-hidden="true"><img src={PODIUM_PLAYERS_HUMAN_URL} alt="" className="podium-players-image" /></div>
            <div className="podium-step podium-step-second">
              <div className="podium-step-rank">2e</div>
            </div>
          </div>
          <div className="podium-lane podium-lane-first">
            <div className="podium-team-label">{firstTeamId ? <TeamBadge name={resolveTeam(firstTeamId).name} level={resolveTeam(firstTeamId).level} className="podium-team-badge" /> : 'À venir'}</div>
            <div className="podium-players" aria-hidden="true"><img src={PODIUM_PLAYERS_HUMAN_URL} alt="" className="podium-players-image" /></div>
            <div className="podium-step podium-step-first">
              <div className="podium-step-rank">1er</div>
            </div>
          </div>
          <div className="podium-lane podium-lane-third">
            <div className="podium-team-label">{thirdTeamId ? <TeamBadge name={resolveTeam(thirdTeamId).name} level={resolveTeam(thirdTeamId).level} className="podium-team-badge" /> : 'À venir'}</div>
            <div className="podium-players" aria-hidden="true"><img src={PODIUM_PLAYERS_HUMAN_URL} alt="" className="podium-players-image" /></div>
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

  const hasOrganizerPrincipaleMatches = visiblePrincipaleMatches.length > 0;
  const hasOrganizerConsolanteMatches = visibleConsolanteMatches.length > 0;
  const hasOrganizerFinalMatches = (knockout.principalEighths || []).length > 0 || (knockout.principalQuarters || []).length > 0
    || knockout.principalSemis.length > 0
    || knockout.principalFinals.length > 0
    || (knockout.consolanteEighths || []).length > 0
    || knockout.consolanteQuarters.length > 0
    || knockout.consolanteSemis.length > 0
    || knockout.consolanteFinals.length > 0
    || singleKnockout.quarters.length > 0
    || singleKnockout.semis.length > 0
    || singleKnockout.finals.length > 0;

  const hasConsolanteStage = hasOrganizerConsolanteMatches || mainStage.consolantePools.length > 0 || (knockout.consolanteEighths || []).length > 0
    || knockout.consolanteQuarters.length > 0
    || knockout.consolanteSemis.length > 0 || knockout.consolanteFinals.length > 0 || Boolean(publicPodiumLeaders?.consolante?.first);
  const finalsPrincipalEighthOnlyMatches = ensureMatchArray(knockout.principalEighths || []);
  const finalsConsolanteEighthOnlyMatches = ensureMatchArray(knockout.consolanteEighths || []);
  const finalsPrincipalStage1Matches = mainStageDistribution.directPrincipalSemis ? ensureMatchArray(knockout.principalSemis) : ensureMatchArray(knockout.principalQuarters);
  const finalsConsolanteSemisMatches = ensureMatchArray(knockout.consolanteSemis);
  const finalsPrincipalSemisMatches = ensureMatchArray(knockout.principalSemis);
  const finalsConsolanteFinalsMatches = ensureMatchArray(knockout.consolanteFinals);
  const finalsPrincipalFinalsMatches = ensureMatchArray(knockout.principalFinals);
  const finalsPrincipalQuarterOnlyMatches = ensureMatchArray(knockout.principalQuarters);
  const finalsConsolanteQuarterOnlyMatches = ensureMatchArray(knockout.consolanteQuarters);
  const finalsPrincipalSmallFinalMatches = finalsPrincipalFinalsMatches.filter((match) => /^Petite finale/i.test(String(match?.group || '')));
  const finalsPrincipalFinalOnlyMatches = finalsPrincipalFinalsMatches.filter((match) => /^Finale$/i.test(String(match?.group || '')));
  const finalsConsolanteSmallFinalMatches = finalsConsolanteFinalsMatches.filter((match) => /^Petite finale/i.test(String(match?.group || '')));
  const finalsConsolanteFinalOnlyMatches = finalsConsolanteFinalsMatches.filter((match) => /^Finale$/i.test(String(match?.group || '')));
  const finalsSingleQuarters = ensureMatchArray(singleKnockout.quarters);
  const finalsSingleSemis = ensureMatchArray(singleKnockout.semis);
  const finalsSingleFinals = ensureMatchArray(singleKnockout.finals);
  const equipesSubtitle = buildTeamsPhaseExplanation(teams.length, {
    isSmallTournamentMode,
    shouldSkipBrassage2,
    hasConsolante: hasConsolanteStage,
    mainStageDistribution,
  });

  const tabs = isSmallTournamentMode ? [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'championship', label: 'Championnat' },
    ...(hasOrganizerFinalMatches ? [{ id: 'finales', label: 'Phases finales' }] : []),
    { id: 'export', label: 'Explications/Export/Import' },
  ] : [
    { id: 'dashboard', label: 'Vue d’ensemble' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'brassage1', label: 'Brassage 1' },
    ...(shouldSkipBrassage2 ? [] : [{ id: 'brassage2', label: 'Brassage 2' }]),
    ...(hasOrganizerPrincipaleMatches ? [{ id: 'principale', label: 'Principale' }] : []),
    ...(hasOrganizerConsolanteMatches ? [{ id: 'consolante', label: 'Consolante' }] : []),
    ...(hasOrganizerFinalMatches ? [{ id: 'finales', label: 'Phases finales' }] : []),
    { id: 'export', label: 'Explications/Export/Import' },
  ];

  useEffect(() => {
    if (!Array.isArray(tabs) || tabs.length === 0) return;
    if (tabs.some((tab) => tab.id === activeTab)) return;
    setActiveTab(tabs[0].id);
  }, [tabs, activeTab]);

  const previousBrassage2CompleteRef = useRef(stageValidation.brassage2Complete);

  useEffect(() => {
    const wasBrassage2Complete = previousBrassage2CompleteRef.current;
    previousBrassage2CompleteRef.current = stageValidation.brassage2Complete;

    if (isSmallTournamentMode) return;
    if (activeTab !== 'brassage2') return;
    if (!stageValidation.brassage2Complete) return;
    if (wasBrassage2Complete) return;

    if (hasOrganizerPrincipaleMatches) {
      setActiveTab('principale');
      return;
    }
    if (hasOrganizerConsolanteMatches) {
      setActiveTab('consolante');
      return;
    }
    if (hasOrganizerFinalMatches) {
      setActiveTab('finales');
    }
  }, [
    isSmallTournamentMode,
    activeTab,
    stageValidation.brassage2Complete,
    hasOrganizerPrincipaleMatches,
    hasOrganizerConsolanteMatches,
    hasOrganizerFinalMatches,
  ]);

  const finalsAutoOpenReady = !isSmallTournamentMode
    && hasOrganizerFinalMatches
    && (stageValidation.principalePoolsComplete || !hasOrganizerPrincipaleMatches)
    && (stageValidation.consolantePoolsComplete || !hasOrganizerConsolanteMatches || mainStageDistribution.consolanteMode === 'direct-podium');

  const previousFinalsAutoOpenReadyRef = useRef(finalsAutoOpenReady);

  useEffect(() => {
    const wasFinalsAutoOpenReady = previousFinalsAutoOpenReadyRef.current;
    previousFinalsAutoOpenReadyRef.current = finalsAutoOpenReady;

    if (!finalsAutoOpenReady) return;
    if (wasFinalsAutoOpenReady) return;
    if (!['brassage2', 'principale', 'consolante'].includes(activeTab)) return;
    setActiveTab('finales');
  }, [finalsAutoOpenReady, activeTab]);


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
          <div
            className={`home-announcement-card ${homeAnnouncementEditing ? 'home-announcement-editing' : ''}`.trim()}
            onDoubleClick={handleHomeAnnouncementEditStart}
            aria-label="Message d'accueil"
          >
            {homeAnnouncementEditing ? (
              <>
                <textarea
                  ref={homeAnnouncementTextareaRef}
                  className="home-announcement-textarea"
                  value={homeAnnouncementDraft}
                  onChange={(e) => setHomeAnnouncementDraft(e.target.value)}
                  placeholder="Saisir le message d'accueil"
                />
                <div className="home-announcement-actions">
                  <button type="button" className="home-announcement-action home-announcement-save" onClick={() => saveHomeAnnouncement(homeAnnouncementDraft)} disabled={homeAnnouncementSaving}>
                    {homeAnnouncementSaving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button type="button" className="home-announcement-action home-announcement-cancel" onClick={cancelHomeAnnouncementEdit} disabled={homeAnnouncementSaving}>Annuler</button>
                </div>
              </>
            ) : (
              <div className={`home-announcement-text ${!homeAnnouncementText && !homeAnnouncementLoading ? 'home-announcement-empty' : ''}`.trim()}>
                {homeAnnouncementLoading ? 'Chargement…' : (homeAnnouncementText || 'Double-cliquez pour saisir un message.')}
              </div>
            )}
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
                <span>Durée estimée de la phase</span>
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

          <div className="stack-gap public-qualified-lists-column">
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
            ) : hasGeneratedMainStagePublic ? (
              <Section title="Classements généraux" subtitle="Quand la principale et la consolante sont générées, l’affichage public montre les équipes encore en course dans chaque tableau à la place du classement cumulé des brassages.">
                <div className="cards-grid two-up public-rankings-grid">
                  <div className="stack-gap public-qualified-lists-column">
                    {knockout.principalQuarters.length > 0 ? (
                      <>
                        {renderQualifiedTeamsList('Équipes en quarts de finale principale', publicPrincipalQuarterTeams, { showPoints: true, phaseLabel: 'Points de poule' })}
                        {renderQualifiedTeamsList('Équipes en demi-finales principale', publicPrincipalSemiTeams, { showPoints: true, phaseLabel: 'Points de poule' })}
                        {renderQualifiedTeamsList('Équipes en petite finale principale', publicPrincipalPetiteFinaleTeams, { showPoints: true, phaseLabel: 'Points de poule' })}
                        {renderQualifiedTeamsList('Équipes en finale principale', publicPrincipalFinalTeams, { showPoints: true, phaseLabel: 'Points de poule' })}
                      </>
                    ) : (
                      <div className="mini-card public-ranking-card">
                        <div className="mini-card-head">Classement général principale</div>
                        {renderOverallRanking(principaleOverallRanking, false, activeInProgressTeamIds)}
                      </div>
                    )}
                  </div>
                  <div className="stack-gap">
                    {(knockout.consolanteQuarters.length > 0 || (knockout.consolanteEighths || []).length > 0
    || knockout.consolanteQuarters.length > 0
    || knockout.consolanteSemis.length > 0 || knockout.consolanteFinals.length > 0) ? (
                      <>
                        {knockout.consolanteQuarters.length > 0 ? renderQualifiedTeamsList('Équipes en quarts de finale consolante', publicConsolanteQuarterTeams, { showPoints: false }) : null}
                        {renderQualifiedTeamsList('Équipes en demi-finales consolante', publicConsolanteSemiTeams, { showPoints: false })}
                        {renderQualifiedTeamsList('Équipes en petite finale consolante', publicConsolantePetiteFinaleTeams, { showPoints: false })}
                        {renderQualifiedTeamsList('Équipes en finale consolante', publicConsolanteFinalTeams, { showPoints: false })}
                      </>
                    ) : (
                      <div className="mini-card public-ranking-card">
                        <div className="mini-card-head">Classement général consolante</div>
                        {renderOverallRanking(consolanteOverallRanking, false, activeInProgressTeamIds)}
                      </div>
                    )}
                  </div>
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
                  {renderPodium('Tableau principal', finalsPrincipalFinalsMatches)}
                  {renderPodium('Tableau consolante', finalsConsolanteFinalsMatches, publicPodiumLeaders?.consolante || null)}
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
                <span>Durée estimée de la phase</span>
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
                        {group.matches.filter((match) => !match.pendingResultSentAt).map((match) => {
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
                            : ((Boolean(match.refereeInProgress) || Boolean(match.matchInProgress)))
                              ? 'badge-danger'
                              : 'badge-neutral';
                          const isBlockedByRunningReferee = Boolean(match.refereeInProgress || match.matchInProgress);
                          const canSelectExistingInProgressMatch = false;
                          const canSelectNewMatch = group.isUnlocked && officialStatus !== 'Valide' && !isBlockedByRunningReferee && activeOccupiedMatchCount < clampCourtCount(courtCount);
                          const canSelect = canSelectNewMatch;
                          const isLockedVisualMatch = isBlockedByRunningReferee;
                          const isActuallyBlockedByReferee = Boolean(match.refereeInProgress || match.matchInProgress);
                          const disabledReason = !group.isUnlocked
                            ? group.lockReason
                            : isActuallyBlockedByReferee
                              ? 'Match déjà en cours de saisie par un arbitre.'
                              : activeOccupiedMatchCount >= getMaxActiveCourts(courtCount)
                                ? 'Tous les terrains disponibles sont déjà occupés par des matchs en cours.'
                                : '';
                          return (
                            <button
                              key={match.id}
                              className={`referee-selector-item ${canSelect ? '' : 'referee-selector-item-disabled'} ${isLockedVisualMatch ? 'referee-selector-item-locked' : ''}`.trim()}
                              onClick={() => {
                                if (!canSelect) return;
                                const refereeLockAt = new Date().toISOString();
                                updateMatchesInScope(group.scope, (matches) => matches.map((item) => (
                                  item.id === match.id
                                    ? { ...item, refereeInProgress: false, matchInProgress: false, arbitrageRequestStatus: 'pending', arbitrageRequestedAt: Date.now(), submittedAt: refereeLockAt, pendingResultSentAt: null }
                                    : item
                                )));
                                recentRefereeLocalEditsRef.current.set(match.id, {
                                  submittedScoreA: match.submittedScoreA ?? '',
                                  submittedScoreB: match.submittedScoreB ?? '',
                                  submittedAt: refereeLockAt,
                                  until: Date.now() + 90000,
                                });
                                setRefereeSelectedScoreDraft({
                                  matchId: match.id,
                                  scoreA: match.submittedScoreA ?? '',
                                  scoreB: match.submittedScoreB ?? '',
                                  submittedAt: refereeLockAt,
                                });
                                setRefereeSelectedMatch({ scope: group.scope, matchId: match.id });
                                queueBackgroundCloudSave(20, refereeLockAt);
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
              <a
                className="hero-tag hero-tag-button"
                href="https://tournoidevolley.fr"
                onClick={(event) => {
                  event.preventDefault();
                  window.location.href = 'https://tournoidevolley.fr';
                }}
                title="Recharger tournoidevolley.fr"
                aria-label="Recharger tournoidevolley.fr"
              >
                tournoidevolley.fr
              </a>
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
              <Button variant="danger" onClick={startNewTournament}>Nouveau tournoi</Button>
            </div>
            <div className="muted small banner-meta">Identifiant du tournoi : <strong>{sharedTournamentId}</strong></div>
            {lastAutomaticSaveFilename ? <div className="muted small banner-meta">Dernière sauvegarde automatique : <strong>{lastAutomaticSaveFilename}</strong></div> : null}
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
              {/* Cartes de synthèse masquées à la demande en mode Organisateur */}

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

              <Section title="Paramètres de score par phase" subtitle="Chaque phase dispose de son score gagnant et de son contexte de validation. Les terrains sont regroupés par phase autant que possible (par exemple terrains 1 à 3 pour la Principale et 4 à 6 pour la Consolante). Avec 6 terrains, les quarts de finale principale sont répartis sur les terrains 1, 2 et 3.">
                <div className="overview-court-count-row">
                  <span className="muted">Nombre de terrains</span>
                  <select
                    value={courtCount}
                    onChange={(e) => setCourtCount(clampCourtCount(e.target.value))}
                    className="court-count-select"
                  >
                    {[3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </div>
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
                    <p className="muted small">Ces points sont ensuite divisés par le nombre de matchs joués pour obtenir une <strong>moyenne de points par match</strong>, utilisée dans les classements de poules, de brassage et dans le classement cumulé.</p>
                    <p className="muted small">Survole l’intitulé <strong>Pts ⓘ</strong> dans les classements pour afficher ce rappel directement à l’écran.</p>
                    {hasDuplicateTeamNames ? <p className="helper-text danger-text">Des doublons de nom d’équipe sont détectés. Le brassage 1 reste bloqué tant qu’ils ne sont pas corrigés.</p> : null}
                  </div>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'equipes' && (
            <Section
              title="Équipes"
              subtitle={equipesSubtitle}
              right={
                <>
                  <Button variant="secondary" onClick={addTeam} disabled={teamAdditionLocked}>Ajouter</Button>
                  {showGenerateBrassage1Button ? (
                    <Button onClick={generateBrassage1} disabled={generateBrassage1Locked}>Générer brassage 1</Button>
                  ) : null}
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
            </Section>
          )}


          {activeTab === 'championship' && isSmallTournamentMode && (
            <>
              <Section title="Championnat Aller" subtitle="Toutes les équipes se rencontrent une première fois pour construire le classement général.">
                {renderStandings(championshipLeg1Standings)}
              </Section>
              <Section title={`Matchs du Championnat Aller : ${formatRemainingMatchesLabel(championshipLeg1.matches, phaseRules)}`} right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Championnat Aller — matchs restants', championshipLeg1.matches, [], resolveTeam, phaseRules)}>🖨️</Button>}>
                {renderCompactFinalStage(championshipLeg1.matches, 'championshipLeg1')}
              </Section>
              <Section title="Championnat Retour" subtitle="Toutes les équipes se rencontrent une seconde fois. Le classement cumule l’aller et le retour.">
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
              <Section title={`Brassage 1 : ${formatRemainingMatchesLabel(visibleBrassage1Matches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Brassage 1 — matchs restants', visibleBrassage1Matches, brassage1.pools, resolveTeam, phaseRules)}>🖨️</Button></>}>
                {renderCompactBrassageBoard(brassage1.pools, visibleBrassage1Matches, brassage1Standings, 'brassage1')}
              </Section>
            </>
          )}

          {activeTab === 'brassage2' && !isSmallTournamentMode && !shouldSkipBrassage2 && (
            <>
              {(brassage2.pools.length > 0 || brassage2.matches.length > 0) ? (
                <Section title={`Brassage 2 : ${formatRemainingMatchesLabel(visibleBrassage2Matches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Brassage 2 — matchs restants', visibleBrassage2Matches, brassage2.pools, resolveTeam, phaseRules)}>🖨️</Button></>}>
                  {renderCompactBrassageBoard(brassage2.pools, visibleBrassage2Matches, brassage2Standings, 'brassage2')}
                </Section>
              ) : <div className="empty-state"></div>}
            </>
          )}

          {activeTab === 'principale' && !isSmallTournamentMode && (
            <>
              {(mainStage.principalePools.length > 0 || mainStage.principaleMatches.length > 0) ? (
                <Section title={`Principale : ${formatRemainingMatchesLabel(visiblePrincipaleMatches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Principale — matchs restants', visiblePrincipaleMatches, mainStage.principalePools, resolveTeam, phaseRules)}>🖨️</Button></>}>
                  {renderCompactBrassageBoard(mainStage.principalePools, visiblePrincipaleMatches, principaleStandings, 'principale', principaleOverallRanking, 'Classement générale principale')}
                </Section>
              ) : <div className="empty-state"></div>}
            </>
          )}

          {activeTab === 'consolante' && !isSmallTournamentMode && (
            <>
              {(mainStage.consolantePools.length > 0 || mainStage.consolanteMatches.length > 0) ? (
                <Section title={`Consolante : ${formatRemainingMatchesLabel(visibleConsolanteMatches, phaseRules)}`} right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Consolante — matchs restants', visibleConsolanteMatches, mainStage.consolantePools, resolveTeam, phaseRules)}>🖨️</Button></>}>
                  {renderCompactBrassageBoard(mainStage.consolantePools, visibleConsolanteMatches, consolanteStandings, 'consolante', consolanteOverallRanking, 'Classement général consolante')}
                </Section>
              ) : <div className="empty-state"></div>}
            </>
          )}

          {activeTab === 'finales' && (
            <>
              {!isSmallTournamentMode && knockout.principalQuarters.length === 0 && knockout.principalSemis.length === 0 && knockout.principalFinals.length === 0 && knockout.consolanteQuarters.length === 0 && knockout.consolanteSemis.length === 0 && knockout.consolanteFinals.length === 0 ? (
                <div className="empty-state"></div>
              ) : isSmallTournamentMode ? (
                <>
                  <Section title={`Quarts de finale : ${formatRemainingMatchesLabel(finalsSingleQuarters, phaseRules)}`} subtitle="Générés uniquement si le nombre d’équipes classées est compris entre 5 et 8." right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Quarts de finale — matchs restants', finalsSingleQuarters, [], resolveTeam, phaseRules)}>🖨️</Button></>}>
                    {renderCompactFinalStage(finalsSingleQuarters, 'quarters')}
                  </Section>

                  <Section title={`Demi-finales : ${formatRemainingMatchesLabel(finalsSingleSemis, phaseRules)}`} subtitle="Créées directement pour 3 ou 4 équipes, ou après les quarts pour 5 à 8 équipes." right={<><Button variant="secondary" onClick={() => printRemainingBrassageMatches('Demi-finales — matchs restants', finalsSingleSemis, [], resolveTeam, phaseRules)}>🖨️</Button></>}>
                    {renderCompactFinalStage(finalsSingleSemis, 'semis')}
                  </Section>

                  <Section title={`Finale et petite finale : ${formatRemainingMatchesLabel(finalsSingleFinals, phaseRules)}`} subtitle="Dernière étape du tournoi." right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Finale et petite finale — matchs restants', finalsSingleFinals, [], resolveTeam, phaseRules)}>🖨️</Button>}>
                    {renderCompactFinalStage(finalsSingleFinals, 'finals')}
                  </Section>

                  <Section title="Podium" subtitle="Le podium s’affiche dès que la finale est validée.">
                    <div className="cards-grid two-up public-rankings-grid">
                      {renderPodium('Tournoi', finalsSingleFinals)}
                    </div>
                  </Section>
                </>
              ) : (
                <>
                  {(finalsPrincipalEighthOnlyMatches.length > 0 || finalsConsolanteEighthOnlyMatches.length > 0) ? (
                    <Section title="Huitièmes de finale" right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Huitièmes de finale — matchs restants', [...finalsPrincipalEighthOnlyMatches, ...finalsConsolanteEighthOnlyMatches], [], resolveTeam, phaseRules)}>🖨️</Button>}>
                      <div className={`cards-grid ${finalsPrincipalEighthOnlyMatches.length > 0 && finalsConsolanteEighthOnlyMatches.length > 0 ? 'two-up' : 'one-up'} finals-dual-grid`}>
                        {finalsPrincipalEighthOnlyMatches.length > 0 ? (<div className="knockout-panel"><h3>{`Huitièmes principale : ${formatRemainingMatchesLabel(finalsPrincipalEighthOnlyMatches, phaseRules)}`}</h3>{renderCompactFinalStage(finalsPrincipalEighthOnlyMatches, 'principalEighths')}</div>) : null}
                        {finalsConsolanteEighthOnlyMatches.length > 0 ? (<div className="knockout-panel"><h3>{`Huitièmes consolante : ${formatRemainingMatchesLabel(finalsConsolanteEighthOnlyMatches, phaseRules)}`}</h3>{renderCompactFinalStage(finalsConsolanteEighthOnlyMatches, 'consolanteEighths')}</div>) : null}
                      </div>
                    </Section>
                  ) : null}

                  {(finalsPrincipalQuarterOnlyMatches.length > 0 || finalsConsolanteQuarterOnlyMatches.length > 0 || (mainStageDistribution.consolanteMode === 'quarter-pools' && finalsConsolanteFinalsMatches.length === 0)) ? (
                    <Section title="Quarts de finale" right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Quarts de finale — matchs restants', [...finalsPrincipalQuarterOnlyMatches, ...finalsConsolanteQuarterOnlyMatches], [], resolveTeam, phaseRules)}>🖨️</Button>}>
                      <div className={`cards-grid ${finalsPrincipalQuarterOnlyMatches.length > 0 && finalsConsolanteQuarterOnlyMatches.length > 0 ? 'two-up' : 'one-up'} finals-dual-grid`}>
                        {finalsPrincipalQuarterOnlyMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Quarts principale : ${formatRemainingMatchesLabel(finalsPrincipalQuarterOnlyMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsPrincipalQuarterOnlyMatches, 'principalQuarters')}
                          </div>
                        ) : null}
                        {finalsConsolanteQuarterOnlyMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Quarts consolante : ${formatRemainingMatchesLabel(finalsConsolanteQuarterOnlyMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsConsolanteQuarterOnlyMatches, 'consolanteQuarters')}
                          </div>
                        ) : null}
                      </div>
                    </Section>
                  ) : null}

                  {(finalsPrincipalSemisMatches.length > 0 || finalsConsolanteSemisMatches.length > 0) ? (
                    <Section title="Demi-finales" right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Demi-finales — matchs restants', [...finalsPrincipalSemisMatches, ...finalsConsolanteSemisMatches], [], resolveTeam, phaseRules)}>🖨️</Button>}>
                      <div className={`cards-grid ${finalsPrincipalSemisMatches.length > 0 && finalsConsolanteSemisMatches.length > 0 ? 'two-up' : 'one-up'} finals-dual-grid`}>
                        {finalsPrincipalSemisMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Demi-finales principale : ${formatRemainingMatchesLabel(finalsPrincipalSemisMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsPrincipalSemisMatches, 'principalSemis')}
                          </div>
                        ) : null}
                        {finalsConsolanteSemisMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Demi-finales consolante : ${formatRemainingMatchesLabel(finalsConsolanteSemisMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsConsolanteSemisMatches, 'consolanteSemis')}
                          </div>
                        ) : null}
                      </div>
                    </Section>
                  ) : null}

                  {(finalsPrincipalSmallFinalMatches.length > 0 || finalsConsolanteSmallFinalMatches.length > 0) ? (
                    <Section title="Petites finales" right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Petites finales — matchs restants', [...finalsPrincipalSmallFinalMatches, ...finalsConsolanteSmallFinalMatches], [], resolveTeam, phaseRules)}>🖨️</Button>}>
                      <div className={`cards-grid ${finalsPrincipalSmallFinalMatches.length > 0 && finalsConsolanteSmallFinalMatches.length > 0 ? 'two-up' : 'one-up'} finals-dual-grid`}>
                        {finalsPrincipalSmallFinalMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Petite finale principale : ${formatRemainingMatchesLabel(finalsPrincipalSmallFinalMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsPrincipalSmallFinalMatches, 'principalSmallFinal')}
                          </div>
                        ) : null}
                        {finalsConsolanteSmallFinalMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Petite finale consolante : ${formatRemainingMatchesLabel(finalsConsolanteSmallFinalMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsConsolanteSmallFinalMatches, 'consolanteSmallFinal')}
                          </div>
                        ) : null}
                      </div>
                    </Section>
                  ) : null}

                  {(finalsPrincipalFinalOnlyMatches.length > 0 || finalsConsolanteFinalOnlyMatches.length > 0) ? (
                    <Section title="Finales" right={<Button variant="secondary" onClick={() => printRemainingBrassageMatches('Finales — matchs restants', [...finalsPrincipalFinalOnlyMatches, ...finalsConsolanteFinalOnlyMatches], [], resolveTeam, phaseRules)}>🖨️</Button>}>
                      <div className={`cards-grid ${finalsPrincipalFinalOnlyMatches.length > 0 && finalsConsolanteFinalOnlyMatches.length > 0 ? 'two-up' : 'one-up'} finals-dual-grid`}>
                        {finalsPrincipalFinalOnlyMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Finale principale : ${formatRemainingMatchesLabel(finalsPrincipalFinalOnlyMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsPrincipalFinalOnlyMatches, 'principalFinal')}
                          </div>
                        ) : null}
                        {finalsConsolanteFinalOnlyMatches.length > 0 ? (
                          <div className="knockout-panel">
                            <h3>{`Finale consolante : ${formatRemainingMatchesLabel(finalsConsolanteFinalOnlyMatches, phaseRules)}`}</h3>
                            {renderCompactFinalStage(finalsConsolanteFinalOnlyMatches, 'consolanteFinal')}
                          </div>
                        ) : null}
                      </div>
                    </Section>
                  ) : null}

                  <Section title="Podiums">
                    <div className={`cards-grid ${hasConsolanteStage ? 'two-up' : 'one-up'} public-rankings-grid finals-dual-grid`}>
                      {renderPodium('Podium principal', finalsPrincipalFinalsMatches)}
                      {hasConsolanteStage ? renderPodium('Podium consolante', finalsConsolanteFinalsMatches, publicPodiumLeaders?.consolante || null) : null}
                    </div>
                  </Section>
                </>
              )}
            </>
          )}

          {activeTab === 'export' && (
            <Section title="Explications" subtitle={null} right={<><Button onClick={exportState}>Exporter JSON</Button>{shouldHideRandomTeamsButton ? null : <Button variant="secondary" onClick={randomizeTeamsAndLevels}>ALEAT</Button>}<Button variant="secondary" onClick={randomizeCurrentPhaseScores}>Score aléatoire</Button><Button variant="secondary" onClick={() => importRef.current?.click()}>Importer JSON</Button></>}>
              <input ref={importRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
              <div className="cards-grid two-up public-rankings-grid">
                <div className="mini-card public-ranking-card">
                  <div className="mini-card-head">Déroulement</div>
                  <ul className="simple-list">
                    {getCourtAwareSaveModeFunctionnements(buildSaveModeFunctionnements, courtCount).map((item) => {
                      const explanationTeamCount = getSaveModeExplanationTeamCount(item);
                      const isActiveExplanation = explanationTeamCount === tournamentTeamCount;
                      return (
                        <li key={item} className={isActiveExplanation ? 'save-mode-explanation-active' : ''}>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mini-card public-ranking-card">
                  <div className="mini-card-head">Sauvegarde et export</div>
                  <ul className="simple-list">
                    <li>Partage OVHcloud via JSON commun pour organisateur et arbitres</li>
                    <li>Nom du tournoi intégré au nom du fichier JSON exporté</li>
                    <li>Date et heure de sauvegarde intégrées au nom du fichier</li>
                    <li>Import complet depuis un export JSON précédent</li>
                  </ul>
                  {waitingTimeSectionData.rows.length ? (
                    <div className="waiting-time-explanations">
                      <div className="waiting-time-toolbar">
                        <div className="mini-card-head waiting-time-title">{waitingTimeSectionData.title}</div>
                        {waitingTimeSectionData.canToggle ? (
                          <button
                            type="button"
                            className="secondary-button waiting-time-toggle-button"
                            onClick={() => setWaitingTimePhaseView(waitingTimeSectionData.phase === 'brassage2' ? 'brassage1' : 'brassage2')}
                          >
                            {waitingTimeSectionData.toggleLabel}
                          </button>
                        ) : null}
                      </div>
                      <div className="waiting-time-list">
                        {waitingTimeSectionData.rows.map((entry) => (
                          <div key={entry.teamId} className="waiting-time-card">
                            <div className="waiting-time-header">
                              <strong>{entry.teamName}</strong>
                              <span>{entry.poolName || 'Poule'}</span>
                            </div>
                            <div className="waiting-time-body">
                              {entry.waits.map((text, index) => (
                                <div key={`${entry.teamId}-${index}`} className="waiting-time-line">
                                  {index === 0 ? text : `Après M${index} : ${text}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
function buildSemiFinalsFromQuarterWinners(quarters, prefix = 'D') {
  const safeQuarters = Array.isArray(quarters) ? quarters : [];
  const winnerOf = (match, fallback) => {
    const scoreA = toNumber(match?.scoreA);
    const scoreB = toNumber(match?.scoreB);
    if (scoreA === null || scoreB === null || scoreA === scoreB) return fallback;
    return scoreA > scoreB ? match?.teamAId || fallback : match?.teamBId || fallback;
  };
  return [
    {
      id: `${prefix}_M1`,
      label: 'Demi-finale 1',
      teamAId: winnerOf(safeQuarters[0], 'Vainqueur Q1'),
      teamBId: winnerOf(safeQuarters[1], 'Vainqueur Q2'),
      scoreA: '',
      scoreB: '',
    },
    {
      id: `${prefix}_M2`,
      label: 'Demi-finale 2',
      teamAId: winnerOf(safeQuarters[2], 'Vainqueur Q3'),
      teamBId: winnerOf(safeQuarters[3], 'Vainqueur Q4'),
      scoreA: '',
      scoreB: '',
    },
  ];
}