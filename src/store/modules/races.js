export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];

const createRoundTemplates = () =>
  ROUND_DISTANCES.map((distance, index) => ({
    id: `round-${index + 1}`,
    distance,
    horses: [],
    status: 'idle', // idle | running | finished
  }));

const pickRandomSubset = (horses, count) => {
  const pool = [...horses];
  const selection = [];
  const limit = Math.min(count, pool.length);

  for (let i = 0; i < limit; i += 1) {
    const idx = Math.floor(Math.random() * pool.length);
    const [horse] = pool.splice(idx, 1);
    selection.push(horse);
  }

  return selection;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const computeDuration = (distance, horse) => {
  const base = distance * 5; // base milliseconds tied to distance
  const conditionBoost = horse ? (horse.condition - 50) * 30 : 0; // higher condition => faster
  const randomness = Math.random() * 1200;
  return Math.max(3500, base - conditionBoost + randomness);
};

export default {
  namespaced: true,
  state: () => ({
    rounds: [],
    resultsByRound: {},
    progressByRound: {},
  }),
  getters: {
    rounds: (state) => state.rounds,
    resultsByRound: (state) => state.resultsByRound,
    progressByRound: (state) => state.progressByRound,
    roundById: (state) => (roundId) => state.rounds.find((round) => round.id === roundId),
    roundResults: (state) =>
      state.rounds.map((round) => ({
        roundId: round.id,
        distance: round.distance,
        status: round.status,
        placements: state.resultsByRound[round.id] || [],
      })),
  },
  mutations: {
    SET_ROUNDS(state, rounds) {
      state.rounds = rounds;
    },
    RESET_ROUNDS(state) {
      state.rounds = [];
      state.resultsByRound = {};
      state.progressByRound = {};
    },
    RESET_RESULTS(state) {
      state.resultsByRound = {};
    },
    RESET_PROGRESS(state) {
      state.progressByRound = {};
    },
    SET_ROUND_STATUS(state, { roundId, status }) {
      const round = state.rounds.find((entry) => entry.id === roundId);
      if (round) {
        round.status = status;
      }
    },
    SET_ROUND_HORSES(state, { roundId, horses }) {
      const round = state.rounds.find((entry) => entry.id === roundId);
      if (round) {
        round.horses = horses;
      }
    },
    SET_RESULTS(state, { roundId, placements }) {
      state.resultsByRound = {
        ...state.resultsByRound,
        [roundId]: placements,
      };
    },
    INIT_PROGRESS(state, { roundId, horses, durations }) {
      state.progressByRound = {
        ...state.progressByRound,
        [roundId]: horses.reduce((acc, horseId) => {
          acc[horseId] = { progress: 0, duration: durations[horseId] || 800 };
          return acc;
        }, {}),
      };
    },
    SET_PROGRESS(state, { roundId, horseId, progress }) {
      const roundProgress = state.progressByRound[roundId];
      if (roundProgress) {
        const existing = roundProgress[horseId] || { duration: 800 };
        roundProgress[horseId] = { ...existing, progress };
      }
    },
  },
  actions: {
    seedRounds({ commit }) {
      // Prepares blank rounds with the expected distances; horse assignments happen later.
      commit('RESET_RESULTS');
      commit('RESET_PROGRESS');
      commit('SET_ROUNDS', createRoundTemplates());
    },
    resetRaces({ commit }) {
      commit('RESET_ROUNDS');
    },
    assignRandomHorses({ state, commit }, horsePool = []) {
      // Assigns 10 random (unique per round) horses from the pool to each round.
      state.rounds.forEach((round) => {
        const selections = pickRandomSubset(horsePool, 10).map((horse) => horse.id);
        commit('SET_ROUND_HORSES', { roundId: round.id, horses: selections });
      });
    },
    prepareForRace({ commit, state }) {
      // Resets lifecycle state while preserving assigned horses.
      commit('RESET_RESULTS');
      commit('RESET_PROGRESS');
      state.rounds.forEach((round) => {
        commit('SET_ROUND_STATUS', { roundId: round.id, status: 'idle' });
      });
    },
    async runRound({ commit }, { round, horseLookup = {} }) {
      if (!round) return;

      const { id: roundId, horses = [], distance } = round;
      const durations = horses.reduce((acc, horseId) => {
        const horse = horseLookup[horseId];
        acc[horseId] = computeDuration(distance, horse);
        return acc;
      }, {});

      commit('SET_ROUND_STATUS', { roundId, status: 'running' });
      commit('INIT_PROGRESS', { roundId, horses, durations });

      await sleep(50); // allow DOM to paint before animating widths
      horses.forEach((horseId) => {
        commit('SET_PROGRESS', { roundId, horseId, progress: 100 });
      });

      const placements = [];
      await Promise.all(
        horses.map(
          (horseId) =>
            new Promise((resolve) => {
              const duration = durations[horseId] || 1000;
              setTimeout(() => {
                placements.push(horseId);
                resolve();
              }, duration);
            }),
        ),
      );

      commit('SET_RESULTS', { roundId, placements });
      commit('SET_ROUND_STATUS', { roundId, status: 'finished' });
    },
  },
};
